import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'open-source', label: 'Open Source' },
  { id: 'achievements', label: 'Awards' },
  { id: 'stats', label: 'Stats' },
  { id: 'contact', label: 'Contact' },
];

export const ScrollNavigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { accentColors } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      const sectionElements = SECTIONS.map((sec) => ({
        id: sec.id,
        el: sec.id === 'hero' ? document.body : document.getElementById(sec.id),
      }));

      const scrollPosition = window.scrollY + 250;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const item = sectionElements[i];
        if (item.el) {
          const top = item.id === 'hero' ? 0 : item.el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Floating Right Section Dots (Desktop only) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3.5 pointer-events-auto">
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollTo(sec.id)}
              className="group flex items-center gap-3 cursor-pointer py-1 text-right focus:outline-none"
              aria-label={`Scroll to ${sec.label}`}
            >
              <span
                className={`text-[11px] font-mono transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                  isActive ? 'text-white font-semibold' : 'text-slate-400'
                }`}
              >
                {sec.label}
              </span>
              <motion.span
                animate={{
                  scale: isActive ? 1.4 : 1,
                  backgroundColor: isActive ? accentColors.primary : 'rgba(148, 163, 184, 0.3)',
                  boxShadow: isActive ? `0 0 10px ${accentColors.glow}` : 'none',
                }}
                transition={{ duration: 0.2 }}
                className="w-2 h-2 rounded-full block border border-transparent group-hover:border-white/40"
              />
            </button>
          );
        })}
      </div>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll back to top"
            className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#111827]/90 hover:bg-[#1E293B] border border-slate-700/60 shadow-xl backdrop-blur-md text-white transition-colors cursor-pointer group"
            style={{
              boxShadow: `0 8px 24px -4px ${accentColors.glow}`,
            }}
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
