import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { ConnectedNodeGraph } from './ConnectedNodeGraph';
import { DailyNodeGraph } from './DailyNodeGraph';
import { WeekNodeGraph } from './WeekNodeGraph';
import { AnimatedCard } from './AnimatedCard';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Download,
  Share2,
  CalendarDays,
  Clock,
  Sparkles,
  GitBranch,
  Users,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

export const DynamicPlanner: React.FC = () => {
  const { themeConfig } = useTheme();

  // Three interconnected graph views: Week Timeline Graph, Daily Timeline Graph, and Curriculum Pipeline Graph
  const [viewMode, setViewMode] = useState<'week' | 'day' | 'graph'>('week');

  return (
    <div className="space-y-8 pb-36">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold border border-amber-300 bg-amber-50 text-amber-800">
              ✦ UNIFLOW VISUALIZED CURRICULUM
            </span>
            <span className="text-[11px] font-mono text-slate-500 font-medium">VISUAL PEDAGOGY • REAL-WORLD APPLICATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-instrument italic text-slate-900 tracking-tight mt-1.5 flex items-center gap-3 font-normal">
            <span>Visual Curriculum & Academic Pipeline</span>
            <span className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-amber-800 border border-slate-200 tracking-wider">
              BEZIER FLOW
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal leading-relaxed">
            Faculty weekly topics, daily lecture concepts, and semester subject pipelines mapped visually to master concepts for real-world application.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200 flex items-center gap-1 backdrop-blur-xl">
            
            {/* Week Timeline Graph */}
            <button
              onClick={() => {
                sound.playClick();
                setViewMode('week');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer btn-tactile flex items-center gap-2 ${
                viewMode === 'week'
                  ? 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <CalendarDays className={`w-3.5 h-3.5 ${viewMode === 'week' ? 'text-amber-600' : 'text-slate-400'}`} />
              <span>Weekly Topics</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                viewMode === 'week' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-200 text-slate-500'
              }`}>
                FACULTY
              </span>
            </button>

            {/* Daily Timeline Graph */}
            <button
              onClick={() => {
                sound.playClick();
                setViewMode('day');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer btn-tactile flex items-center gap-2 ${
                viewMode === 'day'
                  ? 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Clock className={`w-3.5 h-3.5 ${viewMode === 'day' ? 'text-cyan-600' : 'text-slate-400'}`} />
              <span>Daily Concepts</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                viewMode === 'day' ? 'bg-cyan-100 text-cyan-800 border border-cyan-300' : 'bg-slate-200 text-slate-500'
              }`}>
                TODAY
              </span>
            </button>

            {/* Curriculum Pipeline Graph */}
            <button
              onClick={() => {
                sound.playClick();
                setViewMode('graph');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer btn-tactile flex items-center gap-2 ${
                viewMode === 'graph'
                  ? 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <GitBranch className={`w-3.5 h-3.5 ${viewMode === 'graph' ? 'text-purple-600' : 'text-slate-400'}`} />
              <span>Curriculum Pipeline</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                viewMode === 'graph' ? 'bg-purple-100 text-purple-800 border border-purple-300' : 'bg-slate-200 text-slate-500'
              }`}>
                SEMESTER
              </span>
            </button>
          </div>

          <button
            onClick={() => {
              sound.playSuccess();
              confetti({ particleCount: 35, spread: 55 });
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors shadow-xs cursor-pointer btn-tactile"
            title="Export iCal / Google Calendar"
          >
            <Download className="w-3.5 h-3.5 text-amber-600" />
            <span>Export iCal</span>
          </button>
        </div>
      </div>

      {/* Stanford Academic Continuum Panoramic Banner (Page 3 Featured Image - MEDIUM) */}
      <AnimatedCard index={0} className="vadim-glass-card rounded-3xl border border-slate-200/90 overflow-hidden relative group shadow-xs">
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <img 
            src="/images/library-hall.jpg" 
            alt="Uniflow High-Density Research Library & Visual Archives"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/95 via-[#0a0a0b]/60 to-transparent p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/70 text-emerald-400 backdrop-blur-md border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                UNIFLOW RESEARCH LIBRARY • SILENT STUDY CONTINUUM
              </span>
            </div>

            <div className="max-w-xl">
              <h3 className="text-2xl sm:text-3xl font-instrument italic text-white tracking-tight drop-shadow-sm font-normal">
                Uniflow Research Library & Study Continuum
              </h3>
              <p className="text-xs sm:text-sm text-white/80 mt-1 line-clamp-2 font-normal leading-relaxed">
                Physical high-density research library where students apply visual concepts, equipped with institute laptops and silent study sanctuaries.
              </p>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* RENDER ACTIVE CONNECTED GRAPH VIEW WITH BEAUTIFUL SLOW TRANSITION */}
      <AnimatedCard index={1}>
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 18, filter: 'blur(8px)', scale: 0.99 }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, y: -14, filter: 'blur(6px)', scale: 0.995 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {viewMode === 'week' && <WeekNodeGraph />}
            {viewMode === 'day' && <DailyNodeGraph />}
            {viewMode === 'graph' && <ConnectedNodeGraph />}
          </motion.div>
        </AnimatePresence>
      </AnimatedCard>

      {/* Cohort Curriculum Synchronization & Stacks Study Group (Page 3 Featured Image 2 - BIG & IMMERSIVE) */}
      <AnimatedCard index={2} className="vadim-glass-card rounded-3xl border border-slate-200/90 overflow-hidden grid grid-cols-1 md:grid-cols-12 items-center shadow-xs">
        
        {/* Left Column (6 cols): The library-group.jpg photograph */}
        <div className="md:col-span-6 relative h-80 sm:h-96 md:h-[400px] overflow-hidden border-b md:border-b-0 md:border-r border-slate-200/80 group">
          <img 
            src="/images/library-group.jpg" 
            alt="Uniflow Cohort Collaborating in Research Stacks with Provided Hardware"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/95 via-[#0a0a0b]/40 to-transparent p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-black/70 text-emerald-400 backdrop-blur-md border border-emerald-500/30 flex items-center gap-1.5 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                COHORT SYNC • HARDWARE LAB
              </span>
              <span className="text-xs font-mono text-white/80 bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full font-medium border border-white/10">
                UNIFLOW STACKS
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-2xl sm:text-3xl font-instrument italic text-white drop-shadow-sm leading-snug font-normal">
                Academic Research Cohort & Hardware Stacks
              </h4>
              <p className="text-xs sm:text-sm text-white/80 font-normal leading-relaxed">
                Interdisciplinary student cohort • High-performance computing laptops provided by Uniflow • Concept mastery & real-world project sprint
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): Shared Timeline & Prerequisite Milestones */}
        <div className="md:col-span-6 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-amber-600" />
                COHORT CONTINUUM
              </span>
              <span className="text-xs font-mono text-slate-500">Live Peer Graph</span>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ● 4 OF 5 MILESTONES MET
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-instrument italic text-slate-900 tracking-tight font-normal">
            Group Milestone Alignment & Peer Milestones
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Every connected node in your schedule above can be linked to your study group. Stay in lockstep for problem set deadlines, lab sign-offs, and final defense submissions.
          </p>

          {/* Synchronized Milestones */}
          <div className="space-y-2 pt-1">
            {[
              { title: 'CS 229 FlashAttention Benchmark', status: '88% Complete', due: 'Tomorrow 11:59 PM', done: true },
              { title: 'Bio-X Literature Synthesis Matrix', status: '65% Complete', due: 'Thursday 05:00 PM', done: true },
              { title: 'Capstone Defense Slide Review', status: 'Planning Phase', due: 'Next Monday', done: false },
            ].map((milestone) => (
              <div key={milestone.title} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className={`w-4 h-4 ${milestone.done ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div>
                    <span className="font-semibold text-slate-900 block font-mono text-xs">{milestone.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">Due: {milestone.due}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  {milestone.status}
                </span>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sound.playSuccess();
                confetti({ particleCount: 50, spread: 65 });
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold text-white transition-all btn-tactile cursor-pointer border border-white/15 flex items-center gap-1.5"
              style={{
                background: `linear-gradient(135deg, ${themeConfig.primary}, #6366f1)`,
                boxShadow: `0 4px 15px ${themeConfig.glow}`,
              }}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Synchronize Cohort Milestones</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setViewMode('graph');
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 transition-all btn-tactile cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <GitBranch className="w-3.5 h-3.5 text-amber-600" />
              <span>Explore Prerequisite Pipeline</span>
            </button>
          </div>
        </div>

      </AnimatedCard>

    </div>
  );
};
