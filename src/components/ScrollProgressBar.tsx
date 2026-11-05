import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const { accentColors } = useTheme();

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] bg-white/5 z-50 pointer-events-none">
      <motion.div
        className="h-full origin-left shadow-sm"
        style={{
          scaleX,
          backgroundColor: accentColors.primary,
          boxShadow: `0 0 10px ${accentColors.glow}`,
        }}
      />
    </div>
  );
};
