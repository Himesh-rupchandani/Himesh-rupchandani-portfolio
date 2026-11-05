import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Github, Linkedin, ArrowUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  onOpenResume: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenResume }) => {
  const { accentColors } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-[#06080E] py-16 text-xs text-slate-400 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-slate-800/80">
          <div>
            <a href="#" className="font-display text-lg font-bold text-white hover:text-cyan-300 transition-colors">
              Himesh Rupchandani
            </a>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              AI &amp; Data Science Developer · Marwadi University, Rajkot
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#open-source" className="hover:text-white transition-colors">Open Source</a>
            <a href="#stats" className="hover:text-white transition-colors">Stats</a>
            <button
              onClick={onOpenResume}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Resume
            </button>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

          {/* Back to top & Socials */}
          <div className="flex items-center gap-3">
            <a
              href={PERSONAL_INFO.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL_INFO.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL_INFO.socialLinks.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LeetCode Profile"
              className="px-2 py-1 text-xs font-mono font-bold text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              LC
            </a>
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top of page"
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors ml-2 cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quiet Copyright Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono gap-3">
          <div>
            © {new Date().getFullYear()} Himesh Rupchandani. Built with modern Dark Obsidian &amp; Neural Cyan aesthetic.
          </div>
          <div className="flex items-center gap-3">
            <span>Rajkot, Gujarat, India</span>
            <span aria-hidden="true">·</span>
            <span style={{ color: accentColors.primary }}>Available for Summer 2027 Internships</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
