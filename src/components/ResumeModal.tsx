import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X, Printer, Download, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const { accentColors } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('/resume.pdf', { method: 'HEAD' });
      if (response.ok) {
        window.open('/resume.pdf', '_blank');
      } else {
        setDownloadNotice(
          'Custom resume.pdf file is not yet placed in public/resume.pdf. Click "Print / Save PDF" above to generate a pristine PDF directly from this structured resume!'
        );
      }
    } catch (err) {
      setDownloadNotice(
        'Custom resume.pdf not found in public/ directory. Please use "Print / Save PDF" to export immediately.'
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0B0F19] border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Controls Toolbar (Hidden in Print) */}
        <div className="no-print flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
          <div>
            <span
              className="text-xs font-semibold uppercase tracking-wider block font-mono"
              style={{ color: accentColors.primary }}
            >
              Curriculum Vitae
            </span>
            <h2 id="resume-modal-title" className="font-display text-xl sm:text-2xl font-bold text-white">
              Himesh Rupchandani — Resume
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 rounded-xl transition-all shadow-md cursor-pointer"
              style={{ backgroundColor: accentColors.primary }}
              title="Print directly or save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleDownload}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 bg-[#111827] hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" style={{ color: accentColors.primary }} />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close resume view"
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice Banner if Custom PDF Missing */}
        {downloadNotice && (
          <div className="no-print mb-6 p-4 bg-amber-950/40 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs text-amber-200">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              {downloadNotice}
            </div>
            <button
              onClick={() => setDownloadNotice(null)}
              className="text-amber-400 hover:underline shrink-0 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Document Body (Printable Paper Style) */}
        <div className="p-6 sm:p-10 bg-[#080B11] print:bg-white print:text-black border border-slate-800 print:border-none rounded-2xl space-y-8 font-sans">
          {/* Header */}
          <div className="border-b border-slate-800 print:border-black/20 pb-6">
            <h1 className="font-display text-3xl font-extrabold text-white print:text-black tracking-tight">
              Himesh Rupchandani
            </h1>
            <p className="text-sm font-semibold print:text-gray-700 mt-1 font-mono" style={{ color: accentColors.primary }}>
              AI &amp; Data Science Developer · Computer Vision &amp; Machine Learning
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 print:text-gray-600 mt-3 font-mono">
              <span>Rajkot, Gujarat, India</span>
              <span aria-hidden="true">·</span>
              <a href="https://github.com/Himesh-rupchandani" className="hover:underline text-cyan-400 print:text-black">
                github.com/Himesh-rupchandani
              </a>
              <span aria-hidden="true">·</span>
              <a href="https://www.linkedin.com/in/himesh-rupchandani/" className="hover:underline text-cyan-400 print:text-black">
                linkedin.com/in/himesh-rupchandani
              </a>
              <span aria-hidden="true">·</span>
              <a href="https://leetcode.com/u/Himesh-rupchandani/" className="hover:underline text-cyan-400 print:text-black">
                leetcode.com/u/Himesh-rupchandani (190+ Solved)
              </a>
            </div>
          </div>

          {/* Education */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-wider print:text-black border-b border-slate-800 print:border-black/15 pb-1 mb-3 font-mono"
              style={{ color: accentColors.primary }}
            >
              Education
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-sm">
              <span className="font-bold text-white print:text-black">
                B.Tech in Computer Science &amp; Engineering (AI &amp; DS)
              </span>
              <span className="font-mono text-xs text-slate-400 print:text-gray-600">
                2025 – 2029
              </span>
            </div>
            <div className="text-xs text-slate-400 print:text-gray-700 mt-0.5">
              Marwadi University, Rajkot, Gujarat
            </div>
            <p className="text-xs text-slate-300 print:text-gray-600 mt-1">
              Relevant Coursework: Data Structures &amp; Algorithms, Object Oriented Programming, DBMS, Machine Learning, Computer Vision Foundations.
            </p>
          </div>

          {/* Technical Skills */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-wider print:text-black border-b border-slate-800 print:border-black/15 pb-1 mb-3 font-mono"
              style={{ color: accentColors.primary }}
            >
              Technical Skills
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-xs">
              <div>
                <strong className="text-white print:text-black">Programming:</strong>{' '}
                <span className="text-slate-300 print:text-gray-700">Python, C, C++, SQL</span>
              </div>
              <div>
                <strong className="text-white print:text-black">AI &amp; Vision:</strong>{' '}
                <span className="text-slate-300 print:text-gray-700">OpenCV, MediaPipe, YOLO (v8), PyTorch</span>
              </div>
              <div>
                <strong className="text-white print:text-black">Data Science:</strong>{' '}
                <span className="text-slate-300 print:text-gray-700">NumPy, Pandas, Data Preprocessing</span>
              </div>
              <div>
                <strong className="text-white print:text-black">Developer Tools:</strong>{' '}
                <span className="text-slate-300 print:text-gray-700">Git, GitHub, VS Code, Linux Shell</span>
              </div>
            </div>
          </div>

          {/* Key Projects */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-wider print:text-black border-b border-slate-800 print:border-black/15 pb-1 mb-3 font-mono"
              style={{ color: accentColors.primary }}
            >
              Featured Projects
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-bold text-white print:text-black">
                    DefectGuard AI — Industrial Steel Defect Detection
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 print:text-gray-700">
                    1st Rank Winner (PS-7)
                  </span>
                </div>
                <p className="text-xs text-slate-300 print:text-gray-700 mt-1">
                  Engineered an automated quality assurance system using YOLOv8 and OpenCV for real-time manufacturing steel strip inspection. Led the AI-ML and vision development for Team DEFECT HUNTERS at Atmiya University Code Carnival 3.0.
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-bold text-white print:text-black">
                    HandGesture Master Control — Touchless PC Controller
                  </span>
                  <span className="text-xs font-semibold text-cyan-400 print:text-gray-700">
                    Python · MediaPipe · OpenCV
                  </span>
                </div>
                <p className="text-xs text-slate-300 print:text-gray-700 mt-1">
                  Real-time human-computer interface tracking 21 skeletal hand landmarks to smoothly regulate PC volume and screen brightness without physical contact.
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-bold text-white print:text-black">
                    Drone Night-Vision Landing Pad Alignment
                  </span>
                  <span className="text-xs text-slate-400 print:text-gray-700">
                    Robotics Research &amp; POC
                  </span>
                </div>
                <p className="text-xs text-slate-300 print:text-gray-700 mt-1">
                  Investigating fiducial AprilTag/ArUco marker tracking paired with low-light contrast enhancement for autonomous UAV docking in GPS-denied environments.
                </p>
              </div>
            </div>
          </div>

          {/* Open Source Contributions */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-wider print:text-black border-b border-slate-800 print:border-black/15 pb-1 mb-3 font-mono"
              style={{ color: accentColors.primary }}
            >
              Verified Open Source Contributions
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <strong className="text-white print:text-black">python/cpython (PR #158369, #156736):</strong>{' '}
                <span className="text-slate-300 print:text-gray-700">Fixed subinterpreter frame leak in sys._current_frames(); documented bytecode line table complexity.</span>
              </div>
              <div>
                <strong className="text-white print:text-black">opencv/opencv_zoo (PR #317):</strong>{' '}
                <span className="text-slate-300 print:text-gray-700">Contributed evaluation benchmark pipeline for LPD-YuNet License Plate Detection model.</span>
              </div>
              <div>
                <strong className="text-white print:text-black">scikit-image/scikit-image (PR #8302):</strong>{' '}
                <span className="text-slate-300 print:text-gray-700">Added bandwidth parameter numerical boundary validation in gabor_kernel.</span>
              </div>
              <div>
                <strong className="text-white print:text-black">kornia/kornia (PR #5119, #4133):</strong>{' '}
                <span className="text-slate-300 print:text-gray-700">Resolved box/keypoint transform overrides in AugmentationSequential; added zero-sized YUV validation.</span>
              </div>
            </div>
          </div>

          {/* Honors & Hackathons */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-wider print:text-black border-b border-slate-800 print:border-black/15 pb-1 mb-3 font-mono"
              style={{ color: accentColors.primary }}
            >
              Honors &amp; Achievements
            </h3>
            <div className="text-xs space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="font-bold text-white print:text-black">
                  First Rank Winner (PS-7) — Atmiya University Code Carnival 3.0
                </span>
                <span className="text-emerald-400 print:text-gray-600 font-mono">
                  March 2025
                </span>
              </div>
              <p className="text-slate-300 print:text-gray-700">
                Competed against top university engineering teams, successfully presenting a real-time YOLO defect inspection solution to academic and industry judges.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info (Hidden in Print) */}
        <div className="no-print mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Formatted for standard A4 and US-Letter paper</span>
          <button
            onClick={onClose}
            className="hover:underline font-medium cursor-pointer"
            style={{ color: accentColors.primary }}
          >
            Close Viewer
          </button>
        </div>
      </motion.div>
    </div>
  );
};
