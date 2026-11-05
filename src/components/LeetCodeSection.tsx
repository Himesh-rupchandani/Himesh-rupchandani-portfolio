import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { INITIAL_LEETCODE_STATS } from '../data/portfolioData';
import { LeetCodeStats } from '../types/portfolio';
import { Code, RefreshCw, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const LeetCodeSection: React.FC = () => {
  const [stats, setStats] = useState<LeetCodeStats>(INITIAL_LEETCODE_STATS);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Live Sync');
  const [dataSource, setDataSource] = useState<'live' | 'cache' | 'fallback'>('cache');
  const { accentColors } = useTheme();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leetcode');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setStats({
            username: json.data.username || 'Himesh-rupchandani',
            totalSolved: json.data.totalSolved ?? INITIAL_LEETCODE_STATS.totalSolved,
            totalSubmissions: json.data.totalSubmissions ?? INITIAL_LEETCODE_STATS.totalSubmissions,
            easySolved: json.data.easySolved ?? INITIAL_LEETCODE_STATS.easySolved,
            mediumSolved: json.data.mediumSolved ?? INITIAL_LEETCODE_STATS.mediumSolved,
            hardSolved: json.data.hardSolved ?? INITIAL_LEETCODE_STATS.hardSolved,
            ranking: json.data.ranking || INITIAL_LEETCODE_STATS.ranking,
            reputation: json.data.reputation || INITIAL_LEETCODE_STATS.reputation,
            starRating: json.data.starRating || INITIAL_LEETCODE_STATS.starRating,
            contestRating: json.data.contestRating ?? null,
          });
          setDataSource(json.source || 'live');
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch (err) {
      console.warn('Using client fallback for LeetCode data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
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
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white">
                LeetCode Profile
              </h3>
              <a
                href="https://leetcode.com/u/Himesh-rupchandani/"
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
            aria-label="Refresh LeetCode statistics"
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} style={{ color: loading ? accentColors.primary : undefined }} />
          </button>
        </div>

        {/* Total Solved Hero Number */}
        <div className="p-5 bg-[#080B11] border border-slate-800 rounded-2xl mb-6 flex items-center justify-between">
          <div>
            <span className="block text-xs uppercase tracking-wider text-slate-400 font-mono">
              Total Solved Problems
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono-data text-3xl sm:text-4xl font-extrabold" style={{ color: accentColors.primary }}>
                {stats.totalSolved}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                / {stats.totalSubmissions} submissions
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="block text-[11px] text-slate-400 font-mono">Global Ranking</span>
            <span className="font-mono-data text-sm font-bold text-white">
              #{stats.ranking.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Scroll Animated Difficulty Bars */}
        <div className="space-y-4 mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider font-mono text-slate-400">
            Difficulty Distribution
          </div>

          {/* Easy */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-semibold font-mono">Easy Problems</span>
              <span className="font-mono-data text-white font-bold">{stats.easySolved}</span>
            </div>
            <div className="w-full h-2.5 bg-[#080B11] rounded-full overflow-hidden border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min(100, (stats.easySolved / 250) * 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-emerald-400 rounded-full"
              />
            </div>
          </div>

          {/* Medium */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-400 font-semibold font-mono">Medium Problems</span>
              <span className="font-mono-data text-white font-bold">{stats.mediumSolved}</span>
            </div>
            <div className="w-full h-2.5 bg-[#080B11] rounded-full overflow-hidden border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min(100, (stats.mediumSolved / 100) * 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                className="h-full bg-amber-400 rounded-full"
              />
            </div>
          </div>

          {/* Hard */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-400 font-semibold font-mono">Hard Problems</span>
              <span className="font-mono-data text-slate-500 font-bold">{stats.hardSolved}</span>
            </div>
            <div className="w-full h-2.5 bg-[#080B11] rounded-full overflow-hidden border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min(100, (stats.hardSolved / 50) * 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                className="h-full bg-rose-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Extra Profile Attributes */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
          <div className="p-3 bg-[#080B11] rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">Community Reputation</span>
            <span className="font-mono-data text-sm font-bold text-white">
              {stats.reputation} pts
            </span>
          </div>

          <div className="p-3 bg-[#080B11] rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">Contest Status</span>
            <span className="font-mono-data text-xs text-slate-300 font-medium block truncate">
              {stats.contestRating ? `${stats.contestRating} Rating` : 'Unrated (Practicing)'}
            </span>
          </div>
        </div>
      </div>

      {/* Sync Status Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Source: {dataSource === 'live' ? 'Official LeetCode GraphQL' : 'Cached Snapshot'}</span>
        <a
          href="https://leetcode.com/u/Himesh-rupchandani/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline flex items-center gap-1 font-medium"
          style={{ color: accentColors.primary }}
        >
          <span>Open LeetCode</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  );
};
