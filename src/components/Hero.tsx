import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { FileText, Github, Linkedin, ArrowDown } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

interface HeroProps {
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const { accentColors } = useTheme();

  // Scroll Parallax Transforms
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [0.35, 0.05]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden bg-grid-pattern"
    >
      {/* Ambient Neural Glow with Parallax Fade */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px]"
        animate={{
          background: `radial-gradient(circle, ${accentColors.primary}33 0%, rgba(17, 24, 39, 0) 70%)`,
        }}
        transition={{ duration: 0.5 }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Split-Screen Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typographic Hierarchy with Staggered Entrance */}
          <motion.div
            style={{ y: textY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Kicker */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase mb-4"
              style={{ color: accentColors.primary }}
            >
              <span>{PERSONAL_INFO.title}</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-slate-400">Marwadi University</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] mb-6 [text-wrap:balance]"
            >
              Engineering Intelligent Vision &amp; Algorithmic Systems
            </motion.h1>

            {/* Lead Prose */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl"
            >
              I build high-performance Computer Vision pipelines, fine-tune YOLO detection models, and contribute to core open-source internals across CPython, Kornia, and SciPy. Driven by mathematical precision and real-world industrial automation.
            </motion.p>

            {/* CTAs with hover physics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <a
                href="#projects"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-slate-950 rounded-xl transition-all shadow-lg active:translate-y-0.5 whitespace-nowrap cursor-pointer hover:shadow-cyan-500/20"
                style={{
                  backgroundColor: accentColors.primary,
                  boxShadow: `0 8px 24px -4px ${accentColors.glow}`,
                }}
              >
                Explore Projects
              </a>

              <button
                onClick={onOpenResume}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-slate-200 bg-[#111827]/80 hover:bg-[#1E293B] border border-slate-700/60 hover:border-slate-500/80 rounded-xl transition-all whitespace-nowrap cursor-pointer backdrop-blur-sm"
              >
                <FileText className="w-4 h-4" style={{ color: accentColors.primary }} />
                <span>View Resume</span>
              </button>

              <a
                href="#contact"
                className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors whitespace-nowrap"
              >
                Contact Me →
              </a>
            </motion.div>

            {/* Unboxed Metadata */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-5 border-t border-slate-800"
            >
              <span>Rajkot, Gujarat, India</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span>B.Tech CSE (AI &amp; DS) 2025–2029</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span style={{ color: accentColors.primary }}>Open for Summer 2027 Internships</span>
            </motion.div>
          </motion.div>

          {/* Right Column: Headshot with Parallax Shift */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative group w-full max-w-[360px] sm:max-w-[390px]">
              {/* Dynamic Aura Edge */}
              <div
                className="absolute -inset-1.5 rounded-2xl opacity-40 group-hover:opacity-80 blur-lg transition duration-500"
                style={{
                  background: `linear-gradient(to bottom, ${accentColors.primary}, rgba(99, 102, 241, 0.4))`,
                }}
              />

              <div className="relative rounded-2xl overflow-hidden bg-[#0D1320] border border-slate-700/60 shadow-2xl">
                <img
                  src={PERSONAL_INFO.profilePhoto}
                  alt="Himesh Rupchandani - AI & Data Science Developer"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto aspect-square object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Bottom glass banner */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#080B11] via-[#080B11]/90 to-transparent backdrop-blur-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display text-sm font-bold text-white">Himesh Rupchandani</p>
                      <p className="text-xs" style={{ color: accentColors.primary }}>
                        AI &amp; Data Science Developer
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={PERSONAL_INFO.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      <a
                        href={PERSONAL_INFO.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width Key Metrics Strip with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mt-20 pt-8 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="flex flex-col">
            <span className="font-mono-data text-2xl sm:text-3xl font-extrabold" style={{ color: accentColors.primary }}>
              197
            </span>
            <span className="text-xs text-slate-300 mt-1 font-medium">LeetCode Problems Solved</span>
            <span className="text-[11px] text-slate-500">173 Easy · 24 Medium</span>
          </div>

          <div className="flex flex-col">
            <span className="font-mono-data text-2xl sm:text-3xl font-extrabold text-white">
              1st Rank
            </span>
            <span className="text-xs text-slate-300 mt-1 font-medium">Code Carnival 3.0</span>
            <span className="text-[11px] text-slate-500">PS-7 DefectGuard AI</span>
          </div>

          <div className="flex flex-col">
            <span className="font-mono-data text-2xl sm:text-3xl font-extrabold" style={{ color: accentColors.primary }}>
              9+
            </span>
            <span className="text-xs text-slate-300 mt-1 font-medium">Verified Open Source PRs</span>
            <span className="text-[11px] text-slate-500">CPython · Kornia · scikit-image</span>
          </div>

          <div className="flex flex-col">
            <span className="font-mono-data text-2xl sm:text-3xl font-extrabold text-white">
              24
            </span>
            <span className="text-xs text-slate-300 mt-1 font-medium">Public Repositories</span>
            <span className="text-[11px] text-slate-500">Active GitHub Activity</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
