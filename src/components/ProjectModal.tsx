import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types/portfolio';
import { X, Github, ExternalLink, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { accentColors } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0B0F19] border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close project modal"
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pr-10 mb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 font-mono">
            <span style={{ color: accentColors.primary }}>{project.category}</span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-white">{project.status}</span>
            {project.badge && (
              <>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span className="text-amber-400 font-bold">{project.badge}</span>
              </>
            )}
          </div>

          <h3 id="project-modal-title" className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {project.title}
          </h3>
          <p className="text-sm sm:text-base text-slate-400 mt-1">
            {project.tagline}
          </p>
        </div>

        {/* Status Callout if Research/Prototype */}
        {project.status !== 'Completed' && project.status !== 'First Rank Winner' && (
          <div className="mb-6 p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block font-semibold mb-0.5">Transparent Development Status:</strong>
              This project is in active development or research phase. The technical approach and initial prototypes are documented here without inflated completion claims.
            </div>
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-6 text-sm text-slate-300">
          {/* Overview & Problem Statement */}
          <div className="p-6 bg-[#0E1526] border border-slate-800 rounded-2xl space-y-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                Overview
              </h4>
              <p className="leading-relaxed text-slate-200">
                {project.overview}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                Problem Statement
              </h4>
              <p className="leading-relaxed text-slate-200">
                {project.problemStatement}
              </p>
            </div>
          </div>

          {/* Technical Approach & Technologies */}
          <div className="p-6 bg-[#0E1526] border border-slate-800 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Technical Approach
            </h4>
            <p className="leading-relaxed">
              {project.technicalApproach}
            </p>
            <div className="pt-3 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-2 font-mono">Technologies Used:</div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-200">
                {project.technologies.map((tech) => (
                  <span key={tech} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColors.primary }} />
                    <span>{tech}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* My Contribution */}
          <div className="p-6 bg-[#0E1526] border border-slate-800 rounded-2xl">
            <h4
              className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono"
              style={{ color: accentColors.primary }}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>My Role &amp; Exact Contribution</span>
            </h4>
            <p className="leading-relaxed text-slate-100 font-medium">
              {project.myContribution}
            </p>
          </div>

          {/* Features and Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-[#0E1526] border border-slate-800 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
                Key Features
              </h4>
              <ul className="space-y-2 text-xs">
                {project.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accentColors.primary }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 bg-[#0E1526] border border-slate-800 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
                Engineering Challenges
              </h4>
              <ul className="space-y-2 text-xs">
                {project.challenges.map((chal, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold" style={{ color: accentColors.primary }}>·</span>
                    <span>{chal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer Links */}
        <div className="mt-8 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-mono">
            Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px]">ESC</kbd> to close
          </div>

          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 rounded-xl transition-all shadow-md"
                style={{ backgroundColor: accentColors.primary }}
              >
                <Github className="w-4 h-4" />
                <span>View on GitHub</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
