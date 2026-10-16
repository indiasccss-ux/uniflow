import React, { createContext, useContext, useState, useEffect } from 'react';

export type AccentTheme = 'indigo' | 'cyan' | 'emerald' | 'rose' | 'amber';

interface ThemeConfig {
  id: AccentTheme;
  name: string;
  primary: string;
  glow: string;
  gradientText: string;
  badgeBg: string;
  borderActive: string;
}

export const THEMES: Record<AccentTheme, ThemeConfig> = {
  indigo: {
    id: 'indigo',
    name: 'Royal Indigo',
    primary: '#4f46e5',
    glow: 'rgba(79, 70, 229, 0.2)',
    gradientText: 'from-indigo-600 via-purple-600 to-pink-600',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    borderActive: 'border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.2)]',
  },
  cyan: {
    id: 'cyan',
    name: 'Electric Cyan',
    primary: '#0891b2',
    glow: 'rgba(8, 145, 178, 0.2)',
    gradientText: 'from-cyan-600 via-teal-600 to-sky-600',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    borderActive: 'border-cyan-500 shadow-[0_0_20px_rgba(8,145,178,0.2)]',
  },
  emerald: {
    id: 'emerald',
    name: 'Botanical Mint',
    primary: '#059669',
    glow: 'rgba(5, 150, 105, 0.2)',
    gradientText: 'from-emerald-600 via-teal-600 to-green-600',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    borderActive: 'border-emerald-500 shadow-[0_0_20px_rgba(5,150,105,0.2)]',
  },
  rose: {
    id: 'rose',
    name: 'Sunset Rose',
    primary: '#e11d48',
    glow: 'rgba(225, 29, 72, 0.2)',
    gradientText: 'from-rose-600 via-pink-600 to-orange-500',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    borderActive: 'border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.2)]',
  },
  amber: {
    id: 'amber',
    name: 'Warm Amber',
    primary: '#d97706',
    glow: 'rgba(217, 119, 6, 0.2)',
    gradientText: 'from-amber-600 via-orange-600 to-yellow-600',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    borderActive: 'border-amber-500 shadow-[0_0_20px_rgba(217,119,6,0.2)]',
  },
};

interface ThemeContextType {
  theme: AccentTheme;
  themeConfig: ThemeConfig;
  setTheme: (theme: AccentTheme) => void;
  simulationActive: boolean;
  setSimulationActive: (active: boolean | ((prev: boolean) => boolean)) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  activeTab: 'command' | 'synthesizer' | 'planner' | 'spatial' | 'campus';
  setActiveTab: (tab: 'command' | 'synthesizer' | 'planner' | 'spatial' | 'campus') => void;
  experienceMode: 'default' | 'vadim';
  setExperienceMode: (mode: 'default' | 'vadim') => void;
  toggleExperienceMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<AccentTheme>('indigo');
  const [simulationActive, setSimulationActive] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'command' | 'synthesizer' | 'planner' | 'spatial' | 'campus'>('command');
  const [experienceMode, setExperienceMode] = useState<'default' | 'vadim'>('default');

  const toggleExperienceMode = () => {
    setExperienceMode((prev) => (prev === 'default' ? 'vadim' : 'default'));
  };

  const handleSetActiveTab = (tab: 'command' | 'synthesizer' | 'planner' | 'spatial' | 'campus') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeConfig: THEMES[theme],
        setTheme,
        simulationActive,
        setSimulationActive,
        soundEnabled,
        setSoundEnabled,
        activeTab,
        setActiveTab: handleSetActiveTab,
        experienceMode,
        setExperienceMode,
        toggleExperienceMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
