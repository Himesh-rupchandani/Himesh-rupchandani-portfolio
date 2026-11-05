import React from 'react';
import { motion } from 'motion/react';
import { HACKATHON_ACHIEVEMENTS } from '../data/portfolioData';
import { Trophy, Users, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Achievements: React.FC = () => {
  const { accentColors } = useTheme();

  return (
    <section id="achievements" className="py-24 border-t border-slate-800/80 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div
            className="text-xs font-semibold tracking-wider uppercase mb-2 font-mono"
            style={{ color: accentColors.primary }}
          >
            05. Honors &amp; Competitive Track
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Hackathon Achievements
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Competitive technical hackathons demonstrating rapid prototyping, team collaboration, and industrial-grade computer vision models.
          </p>
        </motion.div>

        {/* Featured Achievement Card with Scroll Glow Effect */}
        {HACKATHON_ACHIEVEMENTS.map((ach) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="p-8 sm:p-10 bg-[#0E1526] border border-slate-800 hover:border-slate-700 rounded-3xl relative overflow-hidden shadow-2xl group"
          >
            {/* Ambient Background Aura */}
            <div
              className="absolute -right-20 -top-20 w-80 h-80 rounded-full opacity-10 group-hover:opacity-20 blur-3xl transition-opacity pointer-events-none"
              style={{ backgroundColor: accentColors.primary }}
            />

            {/* Top Row: Trophy & Title */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-[#080B11] border border-slate-800 rounded-2xl text-amber-400 shrink-0 shadow-inner">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1 font-mono text-slate-400">
                    <span style={{ color: accentColors.primary }}>{ach.organizer}</span>
                    <span className="text-slate-600" aria-hidden="true">·</span>
                    <span>{ach.date}</span>
                    <span className="text-slate-600" aria-hidden="true">·</span>
                    <span className="text-white">{ach.team}</span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {ach.title}
                  </h3>
                  <p className="text-sm font-medium mt-1" style={{ color: accentColors.primary }}>
                    {ach.problemStatement}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-right hidden sm:block shrink-0">
                <span className="font-mono text-xs uppercase tracking-wider font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-full">
                  First Rank Champion
                </span>
              </div>
            </div>

            {/* Summary */}
            <p className="text-base text-slate-300 leading-relaxed mb-6 max-w-3xl relative z-10">
              {ach.summary}
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 relative z-10">
              {ach.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{highlight}</span>
                </div>
              ))}
            </div>

            {/* Footer with Team & Link */}
            <div className="mt-8 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 relative z-10">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: accentColors.primary }} />
                <span>Team: <strong className="text-white">DEFECT HUNTERS</strong></span>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span>Role: <strong className="text-white">Computer Vision &amp; AI-ML Development</strong></span>
              </div>
              <a
                href="#projects"
                className="hover:underline font-semibold"
                style={{ color: accentColors.primary }}
              >
                View DefectGuard AI Project Specs →
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
