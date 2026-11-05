import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VERIFIED_PRS } from '../data/portfolioData';
import { ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const OpenSource: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const { accentColors } = useTheme();

  const filteredPRs = VERIFIED_PRS.filter((pr) => {
    if (filter === 'all') return true;
    return pr.state === filter;
  });

  return (
    <section id="open-source" className="py-24 border-t border-slate-800/80 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <div
              className="text-xs font-semibold tracking-wider uppercase mb-2 font-mono"
              style={{ color: accentColors.primary }}
            >
              04. Open Source Contributions
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Upstream Open Source PRs
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Verified contributions to foundational Python, Computer Vision, and scientific computing repositories. Every entry links directly to public GitHub records.
            </p>
          </div>

          {/* Interactive Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-[#0E1526] border border-slate-800 rounded-xl shrink-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                filter === 'all'
                  ? 'text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={{
                backgroundColor: filter === 'all' ? accentColors.primary : 'transparent',
              }}
            >
              All PRs ({VERIFIED_PRS.length})
            </button>
            <button
              onClick={() => setFilter('open')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                filter === 'open'
                  ? 'text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={{
                backgroundColor: filter === 'open' ? accentColors.primary : 'transparent',
              }}
            >
              Active / Open ({VERIFIED_PRS.filter((p) => p.state === 'open').length})
            </button>
            <button
              onClick={() => setFilter('closed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                filter === 'closed'
                  ? 'text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={{
                backgroundColor: filter === 'closed' ? accentColors.primary : 'transparent',
              }}
            >
              Resolved ({VERIFIED_PRS.filter((p) => p.state === 'closed').length})
            </button>
          </div>
        </motion.div>

        {/* PR Cards Grid with Scroll Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPRs.map((pr, idx) => (
            <motion.div
              key={pr.id}
              layout
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.2)' }}
              className="p-6 bg-[#0E1526] border border-slate-800/90 rounded-2xl transition-all duration-200 flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Repo & State */}
                <div className="flex items-center justify-between gap-2 text-xs mb-3">
                  <span className="font-mono font-semibold" style={{ color: accentColors.primary }}>
                    {pr.repo}
                  </span>
                  <span className="flex items-center gap-1 font-mono uppercase text-[11px]">
                    {pr.state === 'open' ? (
                      <>
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span className="text-cyan-400">Open</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400">Closed</span>
                      </>
                    )}
                  </span>
                </div>

                {/* PR Title */}
                <h3 className="font-display text-base font-bold text-white line-clamp-2 leading-snug mb-2">
                  {pr.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  {pr.description}
                </p>
              </div>

              {/* Bottom Info & Link */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  {pr.impactArea}
                </span>

                <a
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                  style={{ color: accentColors.primary }}
                >
                  <span>#{pr.prNumber}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Repositories summary footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 p-4 bg-[#0E1526]/60 border border-slate-800/80 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400"
        >
          <div>
            Upstream organizations: <span className="text-white font-semibold">python/cpython</span>, <span className="text-white font-semibold">opencv/opencv_zoo</span>, <span className="text-white font-semibold">scikit-image</span>, <span className="text-white font-semibold">kornia</span>, <span className="text-white font-semibold">scipy</span>, <span className="text-white font-semibold">pandas-dev</span>.
          </div>
          <a
            href="https://github.com/search?q=author%3AHimesh-rupchandani+type%3Apr&type=pullrequests"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline font-semibold flex items-center gap-1"
            style={{ color: accentColors.primary }}
          >
            <span>Search all author PRs on GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
