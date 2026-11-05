import React from 'react';
import { motion } from 'motion/react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { Code2, Database, Eye, Terminal, Wrench } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Skills: React.FC = () => {
  const { accentColors } = useTheme();

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Programming':
        return <Code2 className="w-5 h-5" style={{ color: accentColors.primary }} />;
      case 'Data Science':
        return <Database className="w-5 h-5" style={{ color: accentColors.primary }} />;
      case 'AI & Computer Vision':
        return <Eye className="w-5 h-5" style={{ color: accentColors.primary }} />;
      case 'Fundamentals':
        return <Terminal className="w-5 h-5" style={{ color: accentColors.primary }} />;
      case 'Tools & Ecosystem':
        return <Wrench className="w-5 h-5" style={{ color: accentColors.primary }} />;
      default:
        return <Code2 className="w-5 h-5" style={{ color: accentColors.primary }} />;
    }
  };

  return (
    <section id="skills" className="py-24 border-t border-slate-800/80 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div
            className="text-xs font-semibold tracking-wider uppercase mb-2 font-mono"
            style={{ color: accentColors.primary }}
          >
            02. Technical Capabilities
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Technical Skills
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Practical competencies utilized in projects, competitive algorithmic problem solving, and open-source contributions.
          </p>
        </motion.div>

        {/* 5-Category Grid with Staggered Scroll Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILL_CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, borderColor: accentColors.primary }}
              className="p-6 bg-[#0E1526] border border-slate-800/90 rounded-2xl transition-all duration-300 flex flex-col justify-between shadow-xl group"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-[#080B11] rounded-xl border border-slate-800 group-hover:border-slate-700 transition-colors">
                    {getCategoryIcon(cat.name)}
                  </div>
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {cat.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Clean Unboxed Skill Listing */}
              <div className="pt-4 border-t border-slate-800/80">
                <ul className="space-y-2 text-sm">
                  {cat.skills.map((skill, index) => (
                    <li key={skill} className="flex items-center gap-2 text-slate-200">
                      <span className="text-xs font-mono" style={{ color: accentColors.primary }}>
                        0{index + 1}.
                      </span>
                      <span className="font-medium text-xs sm:text-sm">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note on Verification with Hover Motion */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 bg-[#0E1526]/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-400"
        >
          <span>
            Verified by: 190+ algorithmic submissions on LeetCode &amp; PRs merged into upstream repositories.
          </span>
          <a
            href="https://github.com/Himesh-rupchandani"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline font-medium ml-4 shrink-0"
            style={{ color: accentColors.primary }}
          >
            Review GitHub Commits →
          </a>
        </motion.div>
      </div>
    </section>
  );
};
