import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FEATURED_PROJECTS } from '../data/portfolioData';
import { Project } from '../types/portfolio';
import { ProjectModal } from './ProjectModal';
import { Github, ArrowUpRight, Trophy, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { accentColors } = useTheme();

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'First Rank Winner':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 font-mono">
            <Trophy className="w-3.5 h-3.5" />
            <span>1st Rank Winner</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="text-xs font-semibold font-mono" style={{ color: accentColors.primary }}>
            Completed
          </span>
        );
      case 'Prototype / In Development':
        return (
          <span className="text-xs font-semibold text-amber-400 font-mono">
            In Development
          </span>
        );
      case 'Research & POC':
        return (
          <span className="text-xs font-semibold text-indigo-400 font-mono">
            Research &amp; POC
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="projects" className="py-24 border-t border-slate-800/80 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4"
        >
          <div>
            <div
              className="text-xs font-semibold tracking-wider uppercase mb-2 font-mono"
              style={{ color: accentColors.primary }}
            >
              03. Selected Engineering Work
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Projects
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Production-grade systems and exploratory research spanning industrial computer vision inference, gesture-based spatial control, and autonomous robotics.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            Click any project card to inspect technical approach and challenges.
          </div>
        </motion.div>

        {/* 2x2 Grid of Featured Projects with Scroll Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEATURED_PROJECTS.map((project, idx) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: idx * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onClick={() => setSelectedProject(project)}
              className="cursor-pointer group relative p-8 bg-[#0E1526] hover:bg-[#111A30] border border-slate-800 hover:border-slate-700 rounded-3xl transition-all duration-300 flex flex-col justify-between shadow-2xl overflow-hidden"
              style={{
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
              }}
            >
              {/* Subtle top card glow on hover */}
              <div
                className="absolute top-0 inset-x-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: accentColors.primary }}
              />

              <div>
                {/* Unboxed Metadata (Zero-Pill Discipline) */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                    {project.category}
                  </span>
                  {getStatusBadge(project.status)}
                </div>

                {/* Title and Tagline */}
                <h3 className="font-display text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                  {project.title}
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-1 mb-4">
                  {project.tagline}
                </p>

                {/* Overview */}
                <p className="text-sm text-slate-300 leading-relaxed mb-6 line-clamp-3">
                  {project.overview}
                </p>
              </div>

              {/* Technologies & Action Bar */}
              <div>
                {/* Tech List */}
                <div className="pt-4 border-t border-slate-800/80 mb-5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                    {project.technologies.map((tech, i) => (
                      <React.Fragment key={tech}>
                        <span className="text-slate-300">{tech}</span>
                        {i < project.technologies.length - 1 && (
                          <span className="text-slate-600" aria-hidden="true">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-bold transition-all group-hover:gap-2"
                    style={{ color: accentColors.primary }}
                  >
                    <span>Inspect Full Architecture</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>

                  {project.githubUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
                      }}
                      aria-label={`Open ${project.title} GitHub repo`}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Github className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
