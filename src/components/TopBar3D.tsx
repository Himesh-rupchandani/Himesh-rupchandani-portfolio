import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../audio/soundManager';
import { PERSONAL_INFO } from '../data/portfolioData';

interface TopBar3DProps {
  currentStation: number;
  onNavigate: (index: number) => void;
  onOpenResume: () => void;
}

const STATIONS = [
  { index: 0, label: 'Overview' },
  { index: 1, label: 'About' },
  { index: 2, label: 'Projects' },
  { index: 3, label: 'Skills' },
  { index: 4, label: 'Lab' },
  { index: 5, label: 'Journey' },
  { index: 6, label: 'Certificates' },
  { index: 7, label: 'Contact' },
];

export const TopBar3D: React.FC<TopBar3DProps> = ({ currentStation, onNavigate, onOpenResume }) => {
  const [isMuted, setIsMuted] = useState(soundManager.getIsMuted());

  const toggleSound = () => {
    const isNowActive = soundManager.toggleMute();
    setIsMuted(!isNowActive);
  };

  const handleNavClick = (idx: number) => {
    soundManager.playClick();
    onNavigate(idx);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 p-4 sm:p-6 flex items-center justify-between pointer-events-none">
      {/* Left: Circular Avatar of Himesh (Screenshots 2-10) */}
      <div className="pointer-events-auto">
        <button
          onClick={() => handleNavClick(0)}
          aria-label="Navigate to Home"
          className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-[#d5ae70] transition-all shadow-2xl cursor-pointer group bg-[#181310]"
        >
          <img
            src={PERSONAL_INFO.profilePhoto}
            alt="Himesh Rupchandani"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </button>
      </div>

      {/* Right Controls: Sound Equalizer + Station Pill Track (Screenshots 2-10) */}
      <div className="pointer-events-auto flex items-center gap-2.5">
        {/* Sound Toggle Button with Animated Wave Bars |I| */}
        <button
          onClick={toggleSound}
          type="button"
          aria-label={isMuted ? 'Sound is muted' : 'Sound is active'}
          className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all cursor-pointer backdrop-blur-xl ${
            !isMuted
              ? 'bg-[#1e1713]/85 border-[#d5ae70]/50 text-[#d5ae70] shadow-[0_0_15px_rgba(213,174,112,0.25)]'
              : 'bg-[#120f0d]/80 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          {!isMuted ? (
            <div className="flex items-center gap-0.5 h-3.5">
              <span className="w-0.5 h-2 bg-[#d5ae70] rounded-full animate-pulse" />
              <span className="w-0.5 h-3.5 bg-[#d5ae70] rounded-full animate-pulse delay-75" />
              <span className="w-0.5 h-1.5 bg-[#d5ae70] rounded-full animate-pulse delay-150" />
            </div>
          ) : (
            <div className="flex items-center gap-0.5 h-3.5 opacity-50">
              <span className="w-0.5 h-2 bg-slate-500 rounded-full" />
              <span className="w-0.5 h-3 bg-slate-500 rounded-full" />
              <span className="w-0.5 h-1.5 bg-slate-500 rounded-full" />
            </div>
          )}
        </button>

        {/* Station Navigation Pill Track (Dots with glowing slider capsule) */}
        <nav
          aria-label="Station Navigation"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#120f0d]/80 border border-white/10 backdrop-blur-xl shadow-2xl"
        >
          {STATIONS.map((station) => {
            const isActive = currentStation === station.index;
            return (
              <button
                key={station.index}
                onClick={() => handleNavClick(station.index)}
                title={station.label}
                aria-label={`Go to ${station.label}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-6 h-2.5 bg-[#d5ae70] shadow-[0_0_10px_rgba(213,174,112,0.6)]'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/70'
                }`}
              />
            );
          })}
        </nav>
      </div>
    </header>
  );
};
