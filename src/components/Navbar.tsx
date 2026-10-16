import React, { useState, useEffect } from 'react';
import { useTheme, THEMES } from '../context/ThemeContext';
import { sound } from '../utils/audio';
import { 
  Volume2, 
  VolumeX, 
  Activity, 
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  variant?: 'light' | 'dark';
}

export const Navbar: React.FC<NavbarProps> = ({ variant = 'light' }) => {
  const isDark = variant === 'dark';
  const { 
    theme, 
    themeConfig, 
    setTheme, 
    simulationActive, 
    setSimulationActive, 
    soundEnabled, 
    setSoundEnabled,
    activeTab,
    setActiveTab,
  } = useTheme();

  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-colors duration-300 ${
        isDark 
          ? 'border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl text-white shadow-2xl' 
          : 'border-b border-slate-200/80 bg-white/90 backdrop-blur-2xl text-slate-900 shadow-xs'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-4">
            <div 
              onClick={() => {
                sound.playClick(1000);
                setActiveTab('command');
              }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span className={`font-instrument italic text-xl tracking-tight transition-colors ${
                isDark ? 'text-white group-hover:text-cyan-400' : 'text-slate-900 group-hover:text-indigo-600'
              }`}>
                UNIFLOW
              </span>
            </div>
          </div>

          {/* Center Navigation Pillars */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-slate-100/90 border border-slate-200/80 font-mono text-xs shadow-2xs">
            {[
              { id: 'command' as const, num: '01', label: 'DASHBOARD' },
              { id: 'synthesizer' as const, num: '02', label: 'NOTICES' },
              { id: 'planner' as const, num: '03', label: 'CURRICULUM' },
              { id: 'spatial' as const, num: '04', label: '3D STUDIO' },
              { id: 'campus' as const, num: '05', label: 'RADAR' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playClick(1100);
                    setActiveTab(tab.id);
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                  }}
                  className={`px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1.5 select-none ${
                    isActive 
                      ? isDark 
                        ? 'bg-white text-slate-950 font-bold shadow-lg scale-105' 
                        : 'bg-white text-slate-950 font-bold shadow-sm border border-slate-200/90 scale-105'
                      : isDark 
                        ? 'text-slate-300 hover:text-white hover:bg-white/10' 
                        : 'text-slate-600 hover:text-slate-950 hover:bg-white/60 font-medium'
                  }`}
                >
                  <span className={`text-[10px] font-bold ${
                    isActive 
                      ? isDark ? 'text-slate-500' : 'text-indigo-600' 
                      : isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {tab.num}.
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Control Cluster */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Simulation Status Toggle */}
            <button
              onClick={() => {
                sound.playPop();
                setSimulationActive((prev) => !prev);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono border transition-all btn-tactile cursor-pointer font-semibold ${
                simulationActive 
                  ? isDark
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs' 
                  : isDark
                    ? 'bg-white/10 text-slate-300 border-white/15'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
              title="Toggle Live Event Simulation"
            >
              <Activity className={`w-3.5 h-3.5 ${simulationActive ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{simulationActive ? 'LIVE' : 'PAUSED'}</span>
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                sound.enabled = next;
                if (next) sound.playClick(1200);
              }}
              className={`p-2 rounded-full border transition-all btn-tactile cursor-pointer ${
                soundEnabled 
                  ? isDark
                    ? 'bg-white/15 text-white border-white/25 hover:bg-white/20'
                    : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200' 
                  : isDark
                    ? 'bg-transparent text-slate-500 border-white/10'
                    : 'bg-transparent text-slate-400 border-slate-200'
              }`}
              title={soundEnabled ? 'Synthesized Audio: ON' : 'Synthesized Audio: MUTED'}
            >
              {soundEnabled ? (
                <Volume2 className={`w-4 h-4 ${isDark ? 'text-white' : 'text-slate-700'}`} />
              ) : (
                <VolumeX className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              )}
            </button>

            {/* Accent Theme Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  sound.playClick();
                  setThemeDropdownOpen((prev) => !prev);
                }}
                className={`flex items-center gap-1.5 p-1.5 pr-2 rounded-full border text-xs transition-all btn-tactile cursor-pointer ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/20 border-white/15 text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
                title="Change Accent Theme"
              >
                <span 
                  className="w-3.5 h-3.5 rounded-full ring-2 ring-slate-400/50 shadow-xs"
                  style={{ backgroundColor: themeConfig.primary }}
                />
                <ChevronDown className={`w-3 h-3 ${isDark ? 'text-slate-300' : 'text-slate-500'}`} />
              </button>

              {themeDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-2xl border p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl ${
                  isDark 
                    ? 'bg-slate-900/95 backdrop-blur-2xl border-white/15 text-white' 
                    : 'vadim-glass-card border-slate-200/90 text-slate-900'
                }`}>
                  <div className={`text-[10px] uppercase font-mono tracking-wider px-2 py-1 font-bold ${
                    isDark ? 'text-slate-400' : 'text-slate-400'
                  }`}>
                    Accent Palette
                  </div>
                  {Object.values(THEMES).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        sound.playClick(1300);
                        setTheme(t.id);
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-xl transition-colors cursor-pointer ${
                        theme === t.id 
                          ? isDark ? 'bg-white/15 text-white font-semibold' : 'bg-slate-100 text-slate-900 font-semibold' 
                          : isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shadow-xs" 
                          style={{ backgroundColor: t.primary }} 
                        />
                        <span>{t.name}</span>
                      </div>
                      {theme === t.id && (
                        <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-cyan-400' : 'text-indigo-600'}`}>
                          ACTIVE
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Sub-Navigation Strip (Visible on mobile screens) */}
      <div className="md:hidden flex items-center gap-1 px-3 py-1.5 overflow-x-auto no-scrollbar border-t border-slate-200/60 bg-white/95">
        {[
          { id: 'command' as const, num: '01', label: 'DASHBOARD' },
          { id: 'synthesizer' as const, num: '02', label: 'NOTICES' },
          { id: 'planner' as const, num: '03', label: 'CURRICULUM' },
          { id: 'spatial' as const, num: '04', label: '3D' },
          { id: 'campus' as const, num: '05', label: 'RADAR' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick(1100);
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                isActive
                  ? 'bg-white text-slate-950 font-bold shadow-xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100/80'
              }`}
            >
              <span className={`text-[10px] font-bold ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                {tab.num}.
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
