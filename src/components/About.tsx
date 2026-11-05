import React from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { GraduationCap, MapPin, Target } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const About: React.FC = () => {
  const { accentColors } = useTheme();

  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="py-24 border-t border-slate-800/80 relative"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-14">
          <div
            className="text-xs font-semibold tracking-wider uppercase mb-2 font-mono"
            style={{ color: accentColors.primary }}
          >
            01. Background &amp; Philosophy
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About Me
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Prose (7 columns) */}
          <div className="lg:col-span-7 space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed">
            <p>
              I am an undergraduate developer pursuing a <strong className="text-white font-semibold">B.Tech in Computer Science and Engineering (AI &amp; DS)</strong> at Marwadi University in Rajkot, Gujarat. My fascination lies at the crossroads of algorithmic problem-solving and Computer Vision—teaching machines to accurately perceive, segment, and interpret visual data from cameras and sensors.
            </p>

            <p>
              Instead of simply consuming machine learning frameworks as opaque APIs, I spend time exploring their underlying mathematical principles and low-level implementations. This approach has led me to actively contribute bug fixes, dimension validation patches, and documentation improvements to critical open-source repositories including <strong className="text-white font-semibold">CPython</strong>, <strong className="text-white font-semibold">Kornia</strong>, <strong className="text-white font-semibold">scikit-image</strong>, <strong className="text-white font-semibold">SciPy</strong>, and <strong className="text-white font-semibold">OpenCV Zoo</strong>.
            </p>

            <p>
              Whether it is developing an industrial steel surface defect detection system that won 1st place at Atmiya University's Code Carnival 3.0, or building touchless human-computer interaction tools using MediaPipe and OpenCV, I focus on practical systems that perform reliably in resource-constrained environments.
            </p>

            {/* Career Objective Banner */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="p-6 bg-[#0E1526]/80 border border-slate-800 rounded-xl space-y-2 backdrop-blur-sm"
              style={{
                boxShadow: `inset 0 0 20px ${accentColors.glow}`,
              }}
            >
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: accentColors.primary }}>
                <Target className="w-4 h-4" />
                <span>Career Focus &amp; Internship Goal</span>
              </div>
              <p className="text-sm text-slate-300 leading-normal">
                I am actively seeking software engineering and AI/Data Science internship opportunities for Summer 2027 where I can contribute to challenging systems engineering, computer vision pipelines, or machine learning infrastructure.
              </p>
            </motion.div>
          </div>

          {/* Structured Detail Cards (5 columns) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Education Card */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-6 bg-[#0E1526] border border-slate-800/80 hover:border-slate-700 rounded-2xl shadow-lg"
            >
              <div
                className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider mb-2 font-mono"
                style={{ color: accentColors.primary }}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Education</span>
              </div>
              <h3 className="font-display text-lg font-bold text-white">
                {PERSONAL_INFO.education.degree}
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                {PERSONAL_INFO.education.institution} · {PERSONAL_INFO.education.duration}
              </p>
              <p className="text-xs text-slate-400 mt-3 border-t border-slate-800 pt-3 leading-relaxed">
                Core coursework: Object Oriented Programming, Data Structures &amp; Algorithms, Database Management Systems, Machine Learning Foundations.
              </p>
            </motion.div>

            {/* Location & Academic Base */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-6 bg-[#0E1526] border border-slate-800/80 hover:border-slate-700 rounded-2xl shadow-lg"
            >
              <div
                className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider mb-2 font-mono"
                style={{ color: accentColors.primary }}
              >
                <MapPin className="w-4 h-4" />
                <span>Location &amp; Base</span>
              </div>
              <p className="font-display text-base font-semibold text-white">
                Rajkot, Gujarat, India
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Open to on-site roles across India as well as remote internships globally.
              </p>
            </motion.div>

            {/* Core Competencies Quick Summary */}
            <div className="p-6 bg-[#0E1526] border border-slate-800/80 rounded-2xl space-y-3">
              <div
                className="text-xs font-semibold uppercase tracking-wider font-mono"
                style={{ color: accentColors.primary }}
              >
                Core Competencies
              </div>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: accentColors.primary }}>·</span>
                  <span><strong className="text-white">Computer Vision:</strong> YOLOv8, OpenCV, MediaPipe, image preprocessing &amp; augmentation.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: accentColors.primary }}>·</span>
                  <span><strong className="text-white">Languages &amp; DSA:</strong> Python, C++, C, SQL; 190+ verified LeetCode problem solutions.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: accentColors.primary }}>·</span>
                  <span><strong className="text-white">Open Source:</strong> CPython bug fixes, Kornia transform dispatches, SciPy docs.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
