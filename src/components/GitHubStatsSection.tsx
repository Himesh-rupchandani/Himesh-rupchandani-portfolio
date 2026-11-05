import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { INITIAL_GITHUB_STATS } from '../data/portfolioData';
import { GitHubStats } from '../types/portfolio';
import { Github, Star, RefreshCw, ExternalLink, BookMarked } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const GitHubStatsSection: React.FC = () => {
  const [stats, setStats] = useState<GitHubStats>(INITIAL_GITHUB_STATS);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Live Sync');
  const [dataSource, setDataSource] = useState<'live' | 'cache' | 'fallback'>('cache');
  const { accentColors } = useTheme();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/github');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setStats({
            username: json.data.username || 'Himesh-rupchandani',
            name: json.data.name || 'Himesh Rupchandani',
            bio: json.data.bio || INITIAL_GITHUB_STATS.bio,
            avatarUrl: json.data.avatarUrl || INITIAL_GITHUB_STATS.avatarUrl,
            publicRepos: json.data.publicRepos ?? INITIAL_GITHUB_STATS.publicRepos,
            followers: json.data.followers ?? INITIAL_GITHUB_STATS.followers,
            following: json.data.following ?? INITIAL_GITHUB_STATS.following,
            company: json.data.company || INITIAL_GITHUB_STATS.company,
            location: json.data.location || INITIAL_GITHUB_STATS.location,
            hireable: json.data.hireable ?? true,
            featuredRepos: json.data.repos?.length > 0 ? json.data.repos : INITIAL_GITHUB_STATS.featuredRepos,
          });
          setDataSource(json.source || 'live');
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch (err) {
      console.warn('Using client fallback for GitHub data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="p-8 bg-[#0E1526] border border-slate-800 rounded-3xl shadow-2xl flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#080B11] rounded-2xl border border-slate-800 text-white shadow-inner">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white">
                GitHub Statistics
              </h3>
              <a
                href="https://github.com/Himesh-rupchandani"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:underline font-mono"
                style={{ color: accentColors.primary }}
              >
                @Himesh-rupchandani
              </a>
            </div>
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            aria-label="Refresh GitHub statistics"
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} style={{ color: loading ? accentColors.primary : undefined }} />
          </button>
        </div>

        {/* Real KPI Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 bg-[#080B11] border border-slate-800 rounded-xl text-center">
            <span className="font-mono-data text-2xl font-bold" style={{ color: accentColors.primary }}>
              {stats.publicRepos}
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5">
              Repositories
            </span>
          </div>

          <div className="p-3.5 bg-[#080B11] border border-slate-800 rounded-xl text-center">
            <span className="font-mono-data text-2xl font-bold text-white">
              {stats.followers}
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5">
              Followers
            </span>
          </div>

          <div className="p-3.5 bg-[#080B11] border border-slate-800 rounded-xl text-center">
            <span className="font-mono-data text-2xl font-bold text-white">
              {stats.following}
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5">
              Following
            </span>
          </div>
        </div>

        {/* Bio */}
        {stats.bio && (
          <div className="p-3.5 bg-[#080B11]/70 border border-slate-800/80 rounded-xl text-xs text-slate-300 mb-6 font-mono whitespace-pre-line leading-relaxed">
            {stats.bio}
          </div>
        )}

        {/* Key Repositories */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center justify-between font-mono text-slate-400">
            <span>Key Repositories</span>
            <span className="text-[10px] text-slate-500">Public on GitHub</span>
          </div>

          <div className="space-y-2.5">
            {stats.featuredRepos.slice(0, 4).map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-3.5 bg-[#080B11]/60 hover:bg-[#080B11] border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs font-bold text-white group-hover:text-cyan-300 flex items-center gap-1.5">
                    <BookMarked className="w-3.5 h-3.5" style={{ color: accentColors.primary }} />
                    <span>{repo.name}</span>
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    {repo.language && (
                      <span className="font-mono" style={{ color: accentColors.primary }}>{repo.language}</span>
                    )}
                    {repo.stars > 0 && (
                      <span className="flex items-center gap-0.5 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="font-mono-data">{repo.stars}</span>
                      </span>
                    )}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                {repo.description && (
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {repo.description}
                  </p>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Sync Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Source: {dataSource === 'live' ? 'Live GitHub API' : 'Cached Snapshot'}</span>
        <span>Synced: {lastUpdated}</span>
      </div>
    </motion.div>
  );
};
