import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Send,
  Loader2,
  ArrowDown,
  Sparkles,
} from 'lucide-react';
import { PERSONAL_INFO, FEATURED_PROJECTS, VERIFIED_PRS, SKILL_CATEGORIES } from '../data/portfolioData';
import { Project } from '../types/portfolio';
import { soundManager } from '../audio/soundManager';
import { RoomScene } from '../three/roomScene';

interface GlassPanelsProps {
  currentStation: number;
  onNavigate: (index: number) => void;
  onOpenProject: (project: Project) => void;
  onOpenResume: () => void;
  roomScene?: RoomScene | null;
}

export const GlassPanels: React.FC<GlassPanelsProps> = ({
  currentStation,
  onNavigate,
  onOpenProject,
  onOpenResume,
  roomScene,
}) => {
  // Typewriter roles (matching reference screenshot)
  const roles = [
    'Flutter Builder',
    'AI & Cybersecurity Explorer',
    'Full-Stack Developer',
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Active Project on PC Screen
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  const handlePrevProject = () => {
    soundManager.playClick();
    const newIdx = (activeProjectIndex - 1 + FEATURED_PROJECTS.length) % FEATURED_PROJECTS.length;
    setActiveProjectIndex(newIdx);
    roomScene?.setActiveProjectIdx(newIdx);
  };

  const handleNextProject = () => {
    soundManager.playClick();
    const newIdx = (activeProjectIndex + 1) % FEATURED_PROJECTS.length;
    setActiveProjectIndex(newIdx);
    roomScene?.setActiveProjectIdx(newIdx);
  };

  // Keycap Drop State
  const [keysDropped, setKeysDropped] = useState(false);

  // Half-Adder State
  const [adderA, setAdderA] = useState(true);
  const [adderB, setAdderB] = useState(false);

  // Contact form
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactStatus, setContactStatus] = useState<string | null>(null);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayedRole !== currentRole) {
      timeout = setTimeout(() => {
        setDisplayedRole(currentRole.slice(0, displayedRole.length + 1));
      }, 70);
    } else if (!isDeleting && displayedRole === currentRole) {
      timeout = setTimeout(() => setIsDeleting(true), 2400);
    } else if (isDeleting && displayedRole !== '') {
      timeout = setTimeout(() => {
        setDisplayedRole(currentRole.slice(0, displayedRole.length - 1));
      }, 35);
    } else if (isDeleting && displayedRole === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayedRole, isDeleting, roleIndex]);

  const handleCradleTrigger = () => {
    roomScene?.triggerNewtonsCradle();
  };

  const handleKeycapsToggle = () => {
    if (!keysDropped) {
      roomScene?.dropKeycaps();
      setKeysDropped(true);
    } else {
      roomScene?.reassembleKeycaps();
      setKeysDropped(false);
    }
  };

  const handleToggleAdder = (input: 'A' | 'B') => {
    roomScene?.toggleHalfAdder(input);
    if (input === 'A') setAdderA(!adderA);
    if (input === 'B') setAdderB(!adderB);
  };

  const handleSwingMilestone = (idx: number) => {
    roomScene?.swingMilestone(idx);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...contactForm, subject: 'Portfolio Contact' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setContactStatus('Note transmitted successfully!');
        setContactForm({ name: '', email: '', message: '' });
      } else {
        setContactStatus(data.error || 'Failed to send.');
      }
    } catch (err) {
      setContactStatus('Network error.');
    } finally {
      setContactLoading(false);
    }
  };

  const sumBit = (adderA !== adderB) ? 1 : 0;
  const carryBit = (adderA && adderB) ? 1 : 0;

  return (
    <>
      {/* 0. HERO 3D FLOATING NAME & INTRO CARD (Screenshot 1) */}
      <AnimatePresence>
        {currentStation === 0 && (
          <div className="fixed inset-0 z-20 pointer-events-none flex flex-col justify-between p-4 sm:p-8">
            {/* Top 3D Extruded Title floating above the room (Screenshot 1 / image_93f82158.png) */}
            <motion.div
              initial={{ opacity: 0, y: -25, rotateY: -12 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full pt-10 sm:pt-12 flex flex-col items-center justify-center text-center select-none"
            >
              <h1 className="hero-3d-name text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-[#f1ede6] leading-[0.92]">
                Bheda<br />Nikhilkumar
              </h1>
            </motion.div>

            {/* Centered Bottom Liquid Glass Card (matching reference screenshot c020c1ff.png) */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 35 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-xl mx-auto pb-4 pointer-events-auto"
            >
              <div className="p-6 sm:p-7 rounded-[32px] bg-white/[0.035] border border-white/20 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] text-center text-white">
                <span className="text-[11px] font-mono tracking-[0.2em] text-[#d49b6a] uppercase font-bold block mb-1.5">
                  HELLO, I'M
                </span>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 h-9 flex items-center justify-center">
                  <span>{displayedRole}</span>
                  <span className="inline-block w-2 h-5 bg-[#d49b6a] ml-1.5 animate-pulse" />
                </h2>

                <p className="text-sm text-[#d6cbbf] leading-relaxed mb-6 max-w-lg mx-auto">
                  I build practical software — full-stack products, Flutter apps and automation tools.
                </p>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onOpenResume();
                    }}
                    className="px-7 py-3.5 rounded-full bg-[#d49b6a] hover:bg-[#e0a877] text-[#14100e] font-bold text-sm shadow-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Download Resume (PDF)</span>
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onNavigate(1);
                    }}
                    aria-label="Next station"
                    className="w-11 h-11 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 flex items-center justify-center text-white cursor-pointer transition-all active:scale-95"
                  >
                    <div className="w-2 h-2 rounded-full bg-white/75" />
                  </button>
                </div>
              </div>

              {/* Pill below card: "Scroll to explore" (Screenshot c020c1ff.png) */}
              <div className="mt-3.5 flex justify-center">
                <button
                  onClick={() => onNavigate(1)}
                  className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#141416]/85 hover:bg-[#1a1a1e] border border-white/20 text-xs font-medium text-white/90 hover:text-white backdrop-blur-md shadow-lg cursor-pointer transition-all"
                >
                  <span>Scroll to explore</span>
                  <div className="w-3.5 h-5 rounded-full border border-white/60 flex items-start justify-center p-0.5">
                    <div className="w-1 h-1.5 rounded-full bg-white animate-bounce" />
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STATIONS 1-7 (Left-docked cards with top pill prompts - Screenshots 2-10) */}
      <div className="fixed inset-y-0 left-0 z-20 pointer-events-none flex flex-col justify-center p-4 sm:p-6 md:pl-10 max-w-md">
        {/* 1. ABOUT STATION (Screenshot 3) */}
        {currentStation === 1 && (
          <motion.div
            key="station-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-auto space-y-3"
          >
            {/* Top Interactive Pill (Screenshot 3) */}
            <button
              onClick={handleCradleTrigger}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/20 text-xs font-mono text-[#d6cbbf] hover:text-white backdrop-blur-md shadow-lg cursor-pointer transition-all"
            >
              <div className="w-2.5 h-2.5 rounded-full border border-white/50 flex items-center justify-center p-0.5">
                <div className="w-1 h-1 rounded-full bg-[#d5ae70] animate-ping" />
              </div>
              <span>Pull a ball on the Newton's cradle: p = mv passes through</span>
            </button>

            {/* Transparent Liquid Glass Card (Screenshot 3) */}
            <div className="p-6 sm:p-7 rounded-[26px] bg-white/[0.035] border border-white/20 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-white">
              <span className="text-[10px] font-mono tracking-widest text-[#d5ae70] uppercase font-bold block mb-1">
                01 · ABOUT
              </span>
              <h2 className="text-2xl sm:text-[26px] font-extrabold text-white mb-3 tracking-tight">
                About me
              </h2>

              <p className="text-[12px] text-[#ded9d2] leading-relaxed mb-3">
                2nd-year B.Tech Computer Engineering student (2025–2029) at Marwadi University, Rajkot, and an aspiring software engineer who turns ideas into useful, maintainable products.
              </p>

              <p className="text-[12px] text-[#ded9d2] leading-relaxed mb-3">
                I work across full-stack web, Flutter mobile apps and AI-powered automation, with a growing focus on cybersecurity and secure development.
              </p>

              <p className="text-[12px] text-[#ded9d2] leading-relaxed mb-4">
                Outside class I join hackathons (Code Carnival 3.0, Build With Gemma, AU Hackathon 2.0), work on Kali Linux and BlackArch, and explore AI tool integrations through MCP servers. I keep learning through JavaScript and FlutterFlow developer meetups.
              </p>

              {/* Stats Boxes (Screenshot 3) */}
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                  <span className="font-bold text-sm text-white block">B.Tech</span>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Computer Engineering</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                  <span className="font-bold text-sm text-white block">5,900+</span>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">LinkedIn followers</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                  <span className="font-bold text-sm text-white block">Web · App · AI</span>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">What I build</span>
                </div>
              </div>

              {/* Footer motto (Screenshot 3) */}
              <div className="text-[11px] font-mono text-slate-400 pt-3 border-t border-white/10 flex items-center justify-between">
                <span>Learn → Build → Break → Debug → Improve → Ship</span>
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. CASE STUDIES / PROJECTS (Screenshot 4: Interactive Project Carousel synced to PC Screen) */}
        {currentStation === 2 && (
          <motion.div
            key="station-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-auto space-y-3"
          >
            {/* Top Interactive Pill */}
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/20 text-xs font-mono text-[#d6cbbf] backdrop-blur-md">
                Active on PC screen:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevProject}
                  aria-label="Previous project"
                  className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 flex items-center justify-center text-white cursor-pointer transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextProject}
                  aria-label="Next project"
                  className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 flex items-center justify-center text-white cursor-pointer transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Project Card (Screenshot 4) */}
            <div className="p-6 sm:p-7 rounded-[26px] bg-white/[0.035] border border-white/20 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono tracking-widest text-[#d5ae70] uppercase font-bold">
                  02 · PROJECTS
                </span>
                <span className="text-xs font-mono text-slate-400">
                  0{activeProjectIndex + 1} / 0{FEATURED_PROJECTS.length}
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight">
                {FEATURED_PROJECTS[activeProjectIndex].title}
              </h2>
              <p className="text-xs text-[#d5ae70] font-mono mb-2">
                {FEATURED_PROJECTS[activeProjectIndex].tagline}
              </p>
              <p className="text-xs text-[#d6cbbf] leading-relaxed mb-4 line-clamp-3">
                {FEATURED_PROJECTS[activeProjectIndex].overview}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {FEATURED_PROJECTS[activeProjectIndex].technologies.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 mb-3">
                <a
                  href={FEATURED_PROJECTS[activeProjectIndex].githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#d49b6a] hover:bg-[#e0a978] text-[#14100e] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>View on GitHub ↗</span>
                </a>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenProject(FEATURED_PROJECTS[activeProjectIndex]);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-white/15 cursor-pointer"
                >
                  <span>Case study →</span>
                </button>
              </div>

              <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-white/10 text-center">
                Tap the screen or use &lt; &gt; to switch projects
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. SKILLS STATION (Screenshot 5 & 6) */}
        {currentStation === 3 && (
          <motion.div
            key="station-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-auto space-y-3"
          >
            {/* Top Interactive Pills (Screenshot 5) */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-full bg-[#14100e]/85 border border-white/12 text-xs font-mono text-[#d6cbbf] backdrop-blur-xl">
                Throw a key · 3D physics
              </div>
              <button
                onClick={handleKeycapsToggle}
                className="px-3.5 py-1.5 rounded-full bg-[#d49b6a] hover:bg-[#e0a978] text-[#14100e] font-bold text-xs shadow-lg transition-all cursor-pointer"
              >
                {keysDropped ? 'Reassemble' : 'Drop the keys'}
              </button>
            </div>

            {/* Skills Card (Screenshot 5) */}
            <div className="p-6 rounded-3xl bg-[#14100e]/85 border border-white/12 backdrop-blur-2xl shadow-2xl text-white">
              <span className="text-[10px] font-mono tracking-widest text-[#d5ae70] uppercase font-bold block mb-1">
                04 · SKILLS
              </span>
              <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight">
                Skills
              </h2>
              <p className="text-xs text-[#d6cbbf] mb-4">
                Every keycap is a tool I build with. Watch them fall and reassemble.
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-bold text-[#d5ae70] block font-mono text-[11px] mb-0.5">
                    • AI &amp; Computer Vision
                  </span>
                  <span className="text-slate-300">
                    YOLOv8, OpenCV, MediaPipe, NumPy, Pandas, Data Analysis
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-bold text-[#d5ae70] block font-mono text-[11px] mb-0.5">
                    • Languages &amp; Fundamentals
                  </span>
                  <span className="text-slate-300">
                    Python, C, C++, SQL, DSA (197 Solved), OOP, DBMS
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-bold text-[#d5ae70] block font-mono text-[11px] mb-0.5">
                    • Tools &amp; Ecosystem
                  </span>
                  <span className="text-slate-300">
                    Git &amp; GitHub, VS Code, Linux, CPython internals
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. LAB BENCH (Screenshot 7) */}
        {currentStation === 4 && (
          <motion.div
            key="station-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-auto space-y-3"
          >
            {/* Top Interactive Pill (Screenshot 7) */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-[#14100e]/85 border border-white/12 text-xs font-mono text-[#d6cbbf] backdrop-blur-xl">
                Flip A or B:
              </span>
              <button
                onClick={() => handleToggleAdder('A')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono transition-all cursor-pointer ${
                  adderA ? 'bg-[#22c55e] text-black' : 'bg-white/10 text-white'
                }`}
              >
                A: {adderA ? '1' : '0'}
              </button>
              <button
                onClick={() => handleToggleAdder('B')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono transition-all cursor-pointer ${
                  adderB ? 'bg-[#22c55e] text-black' : 'bg-white/10 text-white'
                }`}
              >
                B: {adderB ? '1' : '0'}
              </button>
            </div>

            {/* Lab Bench Card (Screenshot 7) */}
            <div className="p-6 rounded-3xl bg-[#14100e]/85 border border-white/12 backdrop-blur-2xl shadow-2xl text-white">
              <span className="text-[10px] font-mono tracking-widest text-[#d5ae70] uppercase font-bold block mb-1">
                05 · LAB
              </span>
              <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight">
                The lab bench
              </h2>
              <p className="text-xs text-[#d6cbbf] mb-4">
                The science under the code. Every piece here runs on real logic or real physics.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-bold text-white block">Half adder logic</span>
                  <span className="text-[11px] text-slate-300 block">
                    XOR + AND gates: S = A ⊕ B, C = A · B
                  </span>
                  <span className="text-[11px] font-mono text-[#d5ae70] block mt-0.5">
                    A={adderA ? 1 : 0} B={adderB ? 1 : 0} → S={sumBit} C={carryBit}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-bold text-white block">Oscilloscope</span>
                  <span className="text-[11px] text-slate-300 block">
                    1 kHz Lissajous curve (3:2 frequency ratio)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-bold text-white block">Bohr atom model</span>
                  <span className="text-[11px] text-slate-300 block">
                    Luminous nucleus with orbiting electron rings
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 5. JOURNEY (Screenshot 8) */}
        {currentStation === 5 && (
          <motion.div
            key="station-5"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-auto space-y-3"
          >
            {/* Top Interactive Pill */}
            <div className="flex items-center gap-1.5">
              <span className="px-3 py-1.5 rounded-full bg-[#14100e]/85 border border-white/12 text-xs font-mono text-[#d6cbbf] backdrop-blur-xl">
                Tap to swing:
              </span>
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => handleSwingMilestone(idx)}
                  className="px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-[#d5ae70] hover:text-black text-xs font-mono transition-all cursor-pointer"
                >
                  #{idx + 1}
                </button>
              ))}
            </div>

            {/* Journey Card (Screenshot 8) */}
            <div className="p-6 rounded-3xl bg-[#14100e]/85 border border-white/12 backdrop-blur-2xl shadow-2xl text-white">
              <span className="text-[10px] font-mono tracking-widest text-[#d5ae70] uppercase font-bold block mb-1">
                06 · JOURNEY
              </span>
              <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight">
                Journey
              </h2>
              <p className="text-xs text-[#d6cbbf] mb-4">
                Milestones so far. Tap a frame on the wall to set it swinging.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono text-[#d5ae70] font-bold">2025–29 · EDUCATION</span>
                  <h3 className="font-bold text-white">B.Tech Computer Science (AI &amp; DS)</h3>
                  <p className="text-[11px] text-slate-300">Marwadi University, Rajkot</p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono text-[#d5ae70] font-bold">OCT 2026 · HACKATHON</span>
                  <h3 className="font-bold text-white">Code Carnival 3.0 — 1st Rank</h3>
                  <p className="text-[11px] text-slate-300">PS-7: Steel Surface Defect Detection with YOLO</p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono text-[#d5ae70] font-bold">2026 · OPEN SOURCE</span>
                  <h3 className="font-bold text-white">CPython, OpenCV Zoo, Kornia</h3>
                  <p className="text-[11px] text-slate-300">Upstream bug fixes, CI dispatch, and models</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 6. CERTIFICATES (Screenshot 9) */}
        {currentStation === 6 && (
          <motion.div
            key="station-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-auto space-y-3"
          >
            <div className="px-3.5 py-1.5 rounded-full bg-[#14100e]/85 border border-white/12 text-xs font-mono text-[#d6cbbf] backdrop-blur-xl w-fit">
              Verified credentials
            </div>

            <div className="p-6 rounded-3xl bg-[#14100e]/85 border border-white/12 backdrop-blur-2xl shadow-2xl text-white">
              <span className="text-[10px] font-mono tracking-widest text-[#d5ae70] uppercase font-bold block mb-1">
                07 · CERTIFICATES
              </span>
              <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight">
                Certificates
              </h2>
              <p className="text-xs text-[#d6cbbf] mb-4">
                Selected from hackathons and upstream contributions.
              </p>

              <div className="space-y-2 text-xs max-h-[300px] overflow-y-auto pr-1">
                {VERIFIED_PRS.slice(0, 4).map((pr) => (
                  <a
                    key={pr.id}
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
                      <span className="text-[#d5ae70] font-bold">{pr.repo}</span>
                      <span className="text-slate-400">PR #{pr.prNumber} ↗</span>
                    </div>
                    <p className="text-white text-[11px] line-clamp-1">{pr.title}</p>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 7. CONTACT STATION (Screenshot 10) */}
        {currentStation === 7 && (
          <motion.div
            key="station-7"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-auto space-y-3"
          >
            <div className="p-6 rounded-3xl bg-[#14100e]/85 border border-white/12 backdrop-blur-2xl shadow-2xl text-white">
              <span className="text-[10px] font-mono tracking-widest text-[#d5ae70] uppercase font-bold block mb-1">
                08 · CONTACT
              </span>
              <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight">
                Let's build something
              </h2>
              <p className="text-xs text-[#d6cbbf] mb-4">
                Open to internships, collaborations and interesting AI projects.
              </p>

              <div className="space-y-2 mb-4">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#d5ae70]/20 flex items-center justify-center text-[#d5ae70] font-mono font-bold">
                      @
                    </div>
                    <div>
                      <span className="font-bold text-white block">Email</span>
                      <span className="text-[10px] font-mono text-[#d6cbbf]">{PERSONAL_INFO.email}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href={PERSONAL_INFO.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#d5ae70]/20 flex items-center justify-center text-[#d5ae70] font-mono font-bold">
                      in
                    </div>
                    <div>
                      <span className="font-bold text-white block">LinkedIn</span>
                      <span className="text-[10px] font-mono text-[#d6cbbf]">linkedin.com/in/himesh-rupchandani</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href={PERSONAL_INFO.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#d5ae70]/20 flex items-center justify-center text-[#d5ae70] font-mono font-bold">
                      GH
                    </div>
                    <div>
                      <span className="font-bold text-white block">GitHub</span>
                      <span className="text-[10px] font-mono text-[#d6cbbf]">github.com/Himesh-rupchandani</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenResume();
                }}
                className="w-full py-3 rounded-full bg-[#d49b6a] hover:bg-[#e0a978] text-[#14100e] font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer mb-2"
              >
                <span>Download Resume (PDF)</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              <span className="block text-[10px] text-center text-slate-500 font-mono">
                © {new Date().getFullYear()} Himesh Rupchandani
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};
