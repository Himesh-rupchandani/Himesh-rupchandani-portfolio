import React, { createContext, useContext, useState, useEffect } from 'react';

export type AccentColor = 'cyan' | 'emerald' | 'violet' | 'amber';

interface ThemeContextType {
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  accentColors: {
    primary: string;
    hover: string;
    glow: string;
    border: string;
    bgSubtle: string;
    text: string;
  };
}

const ACCENT_MAP: Record<AccentColor, ThemeContextType['accentColors']> = {
  cyan: {
    primary: '#06B6D4',
    hover: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.25)',
    border: 'rgba(56, 189, 248, 0.3)',
    bgSubtle: 'rgba(6, 182, 212, 0.08)',
    text: '#38BDF8',
  },
  emerald: {
    primary: '#10B981',
    hover: '#34D399',
    glow: 'rgba(52, 211, 153, 0.25)',
    border: 'rgba(52, 211, 153, 0.3)',
    bgSubtle: 'rgba(16, 185, 129, 0.08)',
    text: '#34D399',
  },
  violet: {
    primary: '#8B5CF6',
    hover: '#A78BFA',
    glow: 'rgba(167, 139, 250, 0.25)',
    border: 'rgba(167, 139, 250, 0.3)',
    bgSubtle: 'rgba(139, 92, 246, 0.08)',
    text: '#A78BFA',
  },
  amber: {
    primary: '#F59E0B',
    hover: '#FBBF24',
    glow: 'rgba(251, 191, 36, 0.25)',
    border: 'rgba(251, 191, 36, 0.3)',
    bgSubtle: 'rgba(245, 158, 11, 0.08)',
    text: '#FBBF24',
  },
};

const ThemeContext = createContext<ThemeContextType>({
  accent: 'cyan',
  setAccent: () => {},
  accentColors: ACCENT_MAP.cyan,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accent, setAccentState] = useState<AccentColor>(() => {
    try {
      const saved = localStorage.getItem('portfolio_accent');
      if (saved && ['cyan', 'emerald', 'violet', 'amber'].includes(saved)) {
        return saved as AccentColor;
      }
    } catch (e) {}
    return 'cyan';
  });

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
    try {
      localStorage.setItem('portfolio_accent', newAccent);
    } catch (e) {}
  };

  return (
    <ThemeContext.Provider value={{ accent, setAccent, accentColors: ACCENT_MAP[accent] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
