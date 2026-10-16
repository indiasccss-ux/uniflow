import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/audio';
import { 
  LayoutDashboard, 
  Wand2, 
  CalendarDays, 
  Box,
  Compass, 
  Sparkles
} from 'lucide-react';

export const FloatingDock: React.FC = () => {
  const { activeTab, setActiveTab, themeConfig, toggleExperienceMode } = useTheme();

  const dockItems = [
    { id: 'command' as const, label: 'Command Deck', icon: LayoutDashboard, shortcut: '1' },
    { id: 'synthesizer' as const, label: 'AI Notice Studio', icon: Wand2, shortcut: '2', badge: 'AI' },
    { id: 'planner' as const, label: 'Dynamic Planner', icon: CalendarDays, shortcut: '3' },
    { id: 'spatial' as const, label: '3D Spatial Studio', icon: Box, shortcut: '4', badge: '3D' },
    { id: 'campus' as const, label: 'Campus Radar', icon: Compass, shortcut: '5' },
  ];

  return (
    <nav 
      aria-label="Floating flybar dock" 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-6 duration-500"
    >
      <div className="vadim-glass-card p-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
        
        {dockItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick(1100);
                setActiveTab(item.id);
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
              }}
              className={`relative group px-3.5 py-2.5 rounded-full transition-all duration-300 btn-tactile cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xl scale-105 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={`${item.label} (⌘${item.shortcut})`}
            >
              <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              
              <span className={`text-[11px] font-mono font-medium ${isActive ? 'inline text-white' : 'hidden md:inline'}`}>
                {item.label.split(' ')[0]}
              </span>

              {/* AI Badge on Notice Studio */}
              {item.badge && (
                <span 
                  className={`px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider ${
                    isActive ? 'bg-white/20 text-amber-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Active illuminated dot */}
              {isActive && (
                <span 
                  className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]"
                />
              )}

              {/* Hover Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl vadim-glass-card border border-slate-200 text-[11px] font-mono text-slate-900 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap flex items-center gap-1.5">
                <span className="text-slate-400">0{index + 1}</span>
                <span>{item.label}</span>
                <span className="keycap text-[9px] px-1 py-0">{item.shortcut}</span>
              </div>
            </button>
          );
        })}

        {/* Divider */}
        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Full 3D Immersive Experience Launch Button */}
        <button
          onClick={() => {
            sound.playCelebration();
            setActiveTab('spatial');
          }}
          className="relative group px-3 py-2 rounded-full transition-all duration-300 btn-tactile cursor-pointer flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-300 shadow-xs"
          title="Open Full 3D Spatial Canvas"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="font-mono text-[11px] font-semibold text-amber-900">
            3D ENGINE
          </span>
        </button>

      </div>
    </nav>
  );
};
