import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Activity, X, ChevronUp } from 'lucide-react';
import { sound } from '../utils/audio';

const SIMULATED_EVENTS = [
  {
    source: 'Gradescope Autograder',
    message: 'CS 229 FlashAttention v3 CUDA benchmark completed • Latency: 1.14ms (Top 0.8%)',
    badge: 'BENCHMARK PASS',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  {
    source: 'Stanford Canvas Sync',
    message: 'Dr. Elena Rostova uploaded Lecture 7 slides: "Synaptic Plasticity & Spike Timing"',
    badge: 'NEW RESOURCE',
    color: 'text-cyan-700 bg-cyan-50 border-cyan-200',
  },
  {
    source: 'TreeHacks 2026 Portal',
    message: 'Alex Mercer confirmed for Spatial AI & BCI Track • NVIDIA B200 sandbox granted',
    badge: 'HACKATHON VIP',
    color: 'text-purple-700 bg-purple-50 border-purple-200',
  },
  {
    source: 'Dean of Research Portal',
    message: 'Senior Bio-X fellowship defense time confirmed for Friday 4:00 PM @ Clark S360',
    badge: 'CALENDAR SYNC',
    color: 'text-amber-800 bg-amber-50 border-amber-200',
  },
  {
    source: 'Focus Sanctuary Engine',
    message: 'Binaural deep work block completed (+250 XP earned • 24 Day streak preserved)',
    badge: 'SPRINT STREAK',
    color: 'text-pink-700 bg-pink-50 border-pink-200',
  },
];

export const SimulationTicker: React.FC = () => {
  const { simulationActive, themeConfig } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    if (!simulationActive) return;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % SIMULATED_EVENTS.length);
        setVisible(true);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, [simulationActive]);

  if (!simulationActive) return null;

  const current = SIMULATED_EVENTS[currentIndex];

  if (minimized) {
    return (
      <aside aria-label="Live academic telemetry" className="fixed bottom-24 right-4 sm:right-6 z-40 animate-in fade-in duration-200">
        <button
          onClick={() => {
            sound.playPop();
            setMinimized(false);
          }}
          className="vadim-glass-card px-3 py-1.5 rounded-full border border-slate-200/90 shadow-md flex items-center gap-2 text-xs font-mono font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
          title="Expand Live Telemetry Feed"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>LIVE TELEMETRY</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </aside>
    );
  }

  return (
    <aside aria-label="Live academic telemetry" className="fixed bottom-24 right-4 sm:right-6 sm:max-w-sm z-40 animate-in slide-in-from-bottom-3 duration-300">
      <div 
        className="vadim-glass-card p-3 rounded-2xl border border-slate-200/90 shadow-[0_12px_36px_rgba(15,23,42,0.08)] flex items-center justify-between gap-3 relative group"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex-shrink-0">
            <Activity className="w-4 h-4 text-emerald-600 animate-spin" />
          </div>

          <div className={`transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'} overflow-hidden`}>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider truncate font-semibold">
                {current.source}
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-slate-200 bg-slate-100 text-slate-700">
                {current.badge}
              </span>
            </div>
            <p className="text-xs text-slate-800 font-medium truncate mt-0.5">
              {current.message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[10px] font-mono text-emerald-700 font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300">
            LIVE
          </span>
          <button
            onClick={() => {
              sound.playClick();
              setMinimized(true);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Minimize Telemetry Ticker"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
