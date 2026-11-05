import React, { useState, useEffect } from 'react';
import { Menu, X, FileText, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme, AccentColor } from '../context/ThemeContext';

interface NavbarProps {
  onOpenResume: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [palettePickerOpen, setPalettePickerOpen] = useState(false);
  const { accent, setAccent, accentColors } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Open Source', href: '#open-source' },
    { label: 'Stats', href: '#stats' },
    { label: 'Contact', href: '#contact' },
  ];

  const accentOptions: { key: AccentColor; name: string; colorHex: string }[] = [
    { key: 'cyan', name: 'Electric Cyan', colorHex: '#06B6D4' },
    { key: 'emerald', name: 'Neural Emerald', colorHex: '#10B981' },
    { key: 'violet', name: 'Hyper Violet', colorHex: '#8B5CF6' },
    { key: 'amber', name: 'Warm Amber', colorHex: '#F59E0B' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080B11]/90 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-black/60'
          : 'bg-[#080B11]/50 backdrop-blur-sm border-b border-white/5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="font-display text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 flex items-center gap-2 group"
        >
          <span>Himesh Rupchandani</span>
          <span
            className="w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-150"
            style={{ backgroundColor: accentColors.primary }}
          />
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors relative py-1 group whitespace-nowrap shrink-0"
            >
              <span>{link.label}</span>
              <span
                className="absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-200 group-hover:w-full"
                style={{ backgroundColor: accentColors.primary }}
              />
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Action + Theme Accent Switcher */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {/* Accent Color Palette Switcher */}
          <div className="relative">
            <button
              onClick={() => setPalettePickerOpen(!palettePickerOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-mono"
              title="Change theme accent color"
              aria-label="Change theme accent"
            >
              <span
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: accentColors.primary }}
              />
              <Palette className="w-3.5 h-3.5" />
            </button>

            <AnimatePresence>
              {palettePickerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 p-2 bg-[#111827] border border-slate-700/80 rounded-xl shadow-2xl z-50 text-xs"
                >
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Accent Mood
                  </div>
                  <div className="space-y-1 mt-1">
                    {accentOptions.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setAccent(opt.key);
                          setPalettePickerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                          accent === opt.key ? 'bg-white/10 text-white font-semibold' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: opt.colorHex }}
                          />
                          <span>{opt.name}</span>
                        </div>
                        {accent === opt.key && <span className="text-[10px] text-slate-400">Active</span>}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Resume CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenResume}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 rounded-lg shadow-md whitespace-nowrap shrink-0 transition-all cursor-pointer"
            style={{
              backgroundColor: accentColors.primary,
              boxShadow: `0 4px 16px -2px ${accentColors.glow}`,
            }}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume</span>
          </motion.button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          className="md:hidden p-2 text-slate-200 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0B0F19] border-b border-white/10 px-6 py-6 shadow-2xl space-y-4 overflow-hidden"
          >
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-slate-200 hover:text-white transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Accent Palette</span>
              <div className="flex items-center gap-2">
                {accentOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setAccent(opt.key)}
                    aria-label={opt.name}
                    className={`w-6 h-6 rounded-full border ${
                      accent === opt.key ? 'border-white scale-110 ring-2 ring-white/20' : 'border-transparent opacity-70'
                    }`}
                    style={{ backgroundColor: opt.colorHex }}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-bold text-slate-950 rounded-lg shadow-md transition-all cursor-pointer"
                style={{ backgroundColor: accentColors.primary }}
              >
                <FileText className="w-4 h-4" />
                <span>View Resume</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
