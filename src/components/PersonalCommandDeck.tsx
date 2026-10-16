import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { INITIAL_USER, COURSES, INITIAL_TASKS, RAW_NOTICES, TaskItem } from '../data/mockData';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Interactive3DGraph } from './Interactive3DGraph';
import { FullScreenHero3D } from './FullScreenHero3D';
import { AnimatedCard } from './AnimatedCard';
import { 
  Flame, 
  Award, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ArrowUpRight, 
  Wand2, 
  CalendarDays,
  Compass, 
  BookOpen, 
  TrendingUp, 
  BellRing, 
  GraduationCap,
  Share2,
  Box,
  Users,
  BarChart3,
  Sparkles
} from 'lucide-react';


interface GrowthYearData {
  year: string;
  milestone: string;
  users: string;
  rawUsers: number;
  campuses: number;
  studyHours: string;
  growth: string;
  heightPercent: number;
  isCurrent?: boolean;
}

const UNIFLOW_GROWTH_TIMELINE: GrowthYearData[] = [
  {
    year: '2022',
    milestone: 'Genesis • Uniflow Visual Lab',
    users: '2.4K',
    rawUsers: 2400,
    campuses: 1,
    studyHours: '420 Topics',
    growth: 'Inception',
    heightPercent: 24,
  },
  {
    year: '2023',
    milestone: 'Visual Curriculum & Hardware Labs',
    users: '14.8K',
    rawUsers: 14800,
    campuses: 6,
    studyHours: '1.8K Topics',
    growth: '+516%',
    heightPercent: 42,
  },
  {
    year: '2024',
    milestone: 'Multi-Campus Research Network',
    users: '48.2K',
    rawUsers: 48200,
    campuses: 24,
    studyHours: '6.4K Topics',
    growth: '+225%',
    heightPercent: 62,
  },
  {
    year: '2025',
    milestone: '3D Spatial Pedagogy Engine',
    users: '124K',
    rawUsers: 124000,
    campuses: 58,
    studyHours: '18.5K Topics',
    growth: '+157%',
    heightPercent: 82,
  },
  {
    year: '2026',
    milestone: 'Global Visualized Learning Institute',
    users: '290K',
    rawUsers: 290000,
    campuses: 94,
    studyHours: '42K Topics',
    growth: '+134%',
    heightPercent: 100,
    isCurrent: true,
  },
];

export const PersonalCommandDeck: React.FC = () => {
  const { themeConfig, setActiveTab } = useTheme();
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [userXp, setUserXp] = useState(INITIAL_USER.xp);
  const [activeCourseId, setActiveCourseId] = useState<string>('cs229');
  const [taskFilter, setTaskFilter] = useState<'all' | 'high' | 'pending'>('all');
  const [selectedGrowthYear, setSelectedGrowthYear] = useState<string>('2026');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          if (nextState) {
            sound.playSuccess();
            setUserXp((xp) => xp + t.xpReward);
            confetti({
              particleCount: 60,
              spread: 70,
              origin: { y: 0.7 },
              colors: [t.color, themeConfig.primary, '#4f46e5'],
            });
          } else {
            sound.playPop();
            setUserXp((xp) => Math.max(INITIAL_USER.xp, xp - t.xpReward));
          }
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const sprintProgress = Math.round((completedCount / tasks.length) * 100);

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'high') return t.priority === 'high';
    if (taskFilter === 'pending') return !t.completed;
    return true;
  });

  return (
    <div id="command-deck-content" className="w-full m-0 p-0">
      {/* Full-Screen Laptop Hero Showcase (Silicon Valley #1 Student Life OS + 3D Quantum Cyber-Knot) */}
      <FullScreenHero3D />

      {/* Main Dashboard Metrics Section */}
      <div id="academic-vitality-bento" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-36 space-y-8 scroll-mt-6">
        
        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Academic Vitality Rings & Next Class Radar */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Bento Sub-row 1: Vitality Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            
            {/* Metric 1: Syllabus Completion */}
            <AnimatedCard 
              index={0}
              onMouseMove={handleMouseMove}
              className="vadim-glass-card p-6 rounded-3xl relative overflow-hidden group border border-slate-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-slate-500 tracking-wider font-semibold">Syllabus Completion</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    EXAM PREP ACTIVE
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums">14</span>
                  <span className="text-sm font-mono text-slate-400">/ 18 Topics</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>78% of semester syllabus completed</span>
                </div>
                <div className="mt-2.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
            </AnimatedCard>

            {/* Metric 2: Deep Work Flow Tracker */}
            <AnimatedCard 
              index={1}
              onMouseMove={handleMouseMove}
              className="vadim-glass-card p-6 rounded-3xl relative overflow-hidden group border border-slate-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-slate-500 tracking-wider font-semibold">Deep Work</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold">
                    81% GOAL
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums">28.5</span>
                  <span className="text-sm font-mono text-slate-400">/ 35 hrs</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-cyan-600" />
                  <span>6.5 hrs remaining this week</span>
                </div>
                <div className="mt-2.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '81%' }} />
                </div>
              </div>
            </AnimatedCard>

            {/* Metric 3: Exam Milestone Tasks */}
            <AnimatedCard 
              index={2}
              onMouseMove={handleMouseMove}
              className="vadim-glass-card p-6 rounded-3xl relative overflow-hidden group border border-slate-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-slate-500 tracking-wider font-semibold">Exam Milestone Tasks</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                    {sprintProgress}% COMPLETE
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                    {completedCount} <span className="text-xl text-slate-400 font-normal">/ {tasks.length}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-500">Cleared</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>{tasks.length - completedCount} objectives pending</span>
                </div>
                <div className="mt-2.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${sprintProgress}%` }} />
                </div>
              </div>
            </AnimatedCard>

          </div>

          {/* Flagship Interactive 3D Academic Velocity & Vector Field Graph */}
          <AnimatedCard index={3}>
            <Interactive3DGraph />
          </AnimatedCard>

          {/* Up Next: Upcoming Classes */}
          <AnimatedCard 
            index={4}
            onMouseMove={handleMouseMove}
            className="vadim-glass-card p-6 rounded-3xl border border-slate-200/90 relative overflow-hidden shadow-xs"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
                  UPCOMING CLASSES • COMMENCING IN 42 MIN
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500 font-semibold tabular-nums">TODAY • 01:15 PM</span>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                  NEUR 210
                </span>
                <span className="text-xs text-slate-600 font-medium">Clark Bio-X Auditorium S360</span>
              </div>
              <h3 className="mt-1.5 text-lg sm:text-xl font-instrument italic text-slate-900 font-normal">
                Computational Synaptic Dynamics & Patch-Clamp Modeling
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Dr. Elena Rostova • Bring calculated conductance graphs from Lab 4
              </p>
            </div>
          </AnimatedCard>

          {/* Interactive Priority Action Queue */}
          <AnimatedCard index={5} className="vadim-glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
              <div>
                <h3 className="text-xl font-instrument italic text-slate-900 flex items-center gap-2 font-normal">
                  <span>Upcoming Exams & Evaluation Queue</span>
                  <span className="text-xs font-mono font-normal text-slate-500">
                    ({tasks.filter((t) => !t.completed).length} upcoming)
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upcoming institute midterm evaluations, practical examinations & syllabus defenses
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                <button
                  onClick={() => setTaskFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    taskFilter === 'all' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({tasks.length})
                </button>
                <button
                  onClick={() => setTaskFilter('high')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    taskFilter === 'high' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  High Priority
                </button>
                <button
                  onClick={() => setTaskFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    taskFilter === 'pending' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group btn-tactile ${
                    task.completed
                      ? 'bg-slate-50/60 border-slate-200/60 opacity-60'
                      : 'bg-white hover:bg-slate-50 border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <button className="text-slate-400 group-hover:text-slate-600 transition-colors shrink-0">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
                          style={{
                            backgroundColor: `${task.color}15`,
                            color: task.color,
                            border: `1px solid ${task.color}35`,
                          }}
                        >
                          {task.courseCode}
                        </span>
                        <span className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 group-hover:text-indigo-600'}`}>
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" /> {task.dueTime}
                        </span>
                        <span>•</span>
                        <span>{task.estMinutes} mins</span>
                        <span>•</span>
                        <span className="text-amber-700 font-mono font-bold">+{task.xpReward} XP</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-bold shrink-0 ${
                    task.difficulty === 'Hard'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : task.difficulty === 'Medium'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {task.difficulty}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedCard>

        </div>

        {/* Right Column (4 cols): Course Radar & Unresolved Notices */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Active Courses Syllabus Progress */}
          <AnimatedCard index={6} className="vadim-glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80">
              <h3 className="text-sm font-instrument italic text-slate-900 flex items-center gap-2 font-normal">
                <BookOpen className="w-4 h-4 text-cyan-600" />
                <span>Institute Curricula • Courses Taught (4)</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500 font-semibold">COURSES OFFERED</span>
            </div>

            <div className="mt-4 space-y-3">
              {COURSES.map((course) => {
                const isSelected = activeCourseId === course.id;
                return (
                  <div
                    key={course.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveCourseId(course.id);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer btn-tactile ${
                      isSelected
                        ? 'bg-white border-slate-300 shadow-xs ring-1 ring-slate-300'
                        : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: course.color }}
                        />
                        <span className="text-xs font-mono font-bold text-slate-900">{course.code}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        Active Course
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 font-medium mt-1 truncate">
                      {course.name}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Syllabus Completion</span>
                      <span className="font-mono text-slate-900 font-bold tabular-nums">{course.progress}%</span>
                    </div>
                    <div className="mt-1 w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${course.progress}%`,
                          backgroundColor: course.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </AnimatedCard>

          {/* Unresolved Announcements Callout Card */}
          <AnimatedCard index={7} className="vadim-glass-card p-6 sm:p-7 rounded-3xl border border-amber-300 bg-amber-50/20 relative overflow-hidden group shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-amber-600 animate-bounce" />
                <h3 className="text-sm font-instrument italic text-slate-900 font-normal">Pending Announcements</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                3 UNPARSED
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
              Faculty memos & WhatsApp notices contain deadline shifts not yet in your schedule.
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs font-mono text-slate-800 line-clamp-3 leading-relaxed">
              "{RAW_NOTICES[0].rawText.slice(0, 115)}..."
            </div>

            <button
              onClick={() => {
                sound.playScan();
                setActiveTab('synthesizer');
              }}
              className="mt-4 w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center justify-center gap-2 transition-all btn-tactile cursor-pointer shadow-md font-mono uppercase tracking-wider"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Synthesize with AI</span>
            </button>
          </AnimatedCard>

          {/* Late-Night Deep Work Focus Pod (Page 1 Featured Image - Proportionate Height) */}
          <AnimatedCard index={8} className="vadim-glass-card rounded-3xl border border-slate-200/90 overflow-hidden group shadow-xs">
            <div className="relative h-56 sm:h-64 overflow-hidden">
              <img 
                src="/images/night-library.jpg" 
                alt="Uniflow High-Density Library Late-Night Focus Sanctuary"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/40 to-transparent p-5 sm:p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-black/60 text-emerald-400 backdrop-blur-md border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    POD 4B • ACTIVE
                  </span>
                  <span className="text-xs font-mono text-white/90 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-semibold">
                    UNIFLOW LIBRARY
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-instrument italic text-white drop-shadow-sm leading-snug font-normal">
                    Atmospheric Deep Work & Library Sanctuary
                  </h4>
                  <p className="text-xs text-white/80 font-medium leading-relaxed font-inter-tight">
                    Quiet study sanctuary • High-performance laptops & hardware provided by Uniflow • Concept learning & exam preparation
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between gap-3 text-xs border-t border-slate-200/80 bg-white">
              <div className="text-[11px] text-slate-500 font-mono">
                <span>14 Uniflow scholars in silent flow</span>
              </div>
              <button
                onClick={() => {
                  sound.playSuccess();
                  confetti({ particleCount: 40, spread: 50 });
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 transition-all btn-tactile cursor-pointer"
              >
                Log 2h Sprint
              </button>
            </div>
          </AnimatedCard>

          {/* Animated 2D Bar Graph: Uniflow Annual Growth & Student Adoption (Fills the column gap seamlessly) */}
          <AnimatedCard index={9} className="vadim-glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between relative overflow-hidden group">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shadow-2xs">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-instrument italic text-slate-900 font-normal flex items-center gap-2">
                      <span>Growth of the Institute</span>
                      <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                        +134% YoY
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 font-inter-tight">
                      Active scholars and campus expansion across years
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200/90">
                  2022 – 2026
                </span>
              </div>

              {/* Dynamic Interactive Metric Highlight Box */}
              {(() => {
                const currentData = UNIFLOW_GROWTH_TIMELINE.find((d) => d.year === selectedGrowthYear) || UNIFLOW_GROWTH_TIMELINE[4];
                return (
                  <div className="mt-3.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div>
                      <span className="text-[9.5px] text-slate-400 block uppercase">Year {currentData.year}</span>
                      <span className="text-xs font-bold text-slate-900">{currentData.users} Scholars</span>
                    </div>
                    <div className="border-x border-slate-200">
                      <span className="text-[9.5px] text-slate-400 block uppercase">Campuses</span>
                      <span className="text-xs font-bold text-indigo-600">{currentData.campuses} Hubs</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-slate-400 block uppercase">YoY Trajectory</span>
                      <span className="text-xs font-bold text-emerald-600">{currentData.growth}</span>
                    </div>
                  </div>
                );
              })()}

              {/* 2D Animated Bar Graph Canvas Area */}
              <div className="relative mt-5 pt-2 pb-1">
                {/* Subtle Background Dashed Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                  <div className="w-full border-b border-dashed border-slate-200" />
                  <div className="w-full border-b border-dashed border-slate-200" />
                  <div className="w-full border-b border-dashed border-slate-200" />
                  <div className="w-full border-b border-dashed border-slate-200" />
                </div>

                {/* Bars Container */}
                <div className="relative h-44 flex items-end justify-between gap-2 sm:gap-3 px-1 pt-6">
                  {UNIFLOW_GROWTH_TIMELINE.map((item, index) => {
                    const isSelected = selectedGrowthYear === item.year;
                    const isCurrent = item.isCurrent;

                    return (
                      <div
                        key={item.year}
                        onClick={() => {
                          sound.playClick(850 + index * 80);
                          setSelectedGrowthYear(item.year);
                        }}
                        className="flex-1 flex flex-col items-center justify-end h-full relative group/bar cursor-pointer"
                        title={`${item.year}: ${item.users} Active Students • ${item.growth}`}
                      >
                        {/* Numerical Value Tag hovering on top of bar */}
                        <motion.span
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                          className={`text-[10px] font-mono font-bold mb-1.5 transition-colors ${
                            isSelected || isCurrent ? 'text-indigo-600 font-extrabold scale-105' : 'text-slate-500'
                          }`}
                        >
                          {item.users}
                        </motion.span>

                        {/* Animated Bar Column */}
                        <div className="w-full max-w-[42px] sm:max-w-[46px] h-full flex items-end justify-center">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${item.heightPercent}%` }}
                            transition={{
                              duration: 0.85,
                              delay: 0.15 + index * 0.1,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className={`w-full rounded-t-xl transition-all duration-300 relative group-hover/bar:brightness-110 ${
                              isCurrent
                                ? 'shadow-[0_4px_16px_rgba(79,70,229,0.35)] ring-1 ring-indigo-400/50'
                                : isSelected
                                ? 'shadow-sm ring-1 ring-indigo-300'
                                : 'opacity-85 hover:opacity-100'
                            }`}
                            style={{
                              background: isCurrent
                                ? `linear-gradient(to top, #4f46e5 0%, #6366f1 50%, #06b6d4 100%)`
                                : isSelected
                                ? `linear-gradient(to top, #64748b 0%, #818cf8 100%)`
                                : `linear-gradient(to top, #cbd5e1 0%, #cbd5e1 30%, #e0e7ff 100%)`,
                            }}
                          >
                            {/* Glowing tip indicator on current year */}
                            {isCurrent && (
                              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300 ring-2 ring-white shadow-[0_0_8px_#22d3ee] animate-pulse" />
                            )}
                          </motion.div>
                        </div>

                        {/* X-Axis Year & Growth Label */}
                        <div className="mt-2.5 text-center flex flex-col items-center">
                          <span
                            className={`text-[11px] font-mono transition-colors ${
                              isCurrent || isSelected
                                ? 'font-bold text-slate-900'
                                : 'font-medium text-slate-600'
                            }`}
                          >
                            {item.year}
                          </span>
                          <span
                            className={`text-[9px] font-mono leading-none mt-0.5 ${
                              isCurrent
                                ? 'text-indigo-600 font-bold'
                                : 'text-slate-400'
                            }`}
                          >
                            {item.growth}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Exponential 4-Year S-Curve Adoption</span>
              </span>

              <button
                onClick={() => {
                  sound.playSuccess();
                  confetti({ particleCount: 50, spread: 60 });
                }}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Telemetry Audit</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </AnimatedCard>

        </div>

      </div>

      {/* Stanford Peer Study Squad & Capstone Sync Hub (Page 1 Featured Image 2 - MEDIUM-TO-BIG) */}
      <AnimatedCard index={10} className="vadim-glass-card rounded-3xl border border-slate-200/90 overflow-hidden grid grid-cols-1 md:grid-cols-12 items-center shadow-xs">
        
        {/* Left Column (6 cols): The student-collab.jpg photograph */}
        <div className="md:col-span-6 relative h-72 sm:h-80 md:h-[360px] overflow-hidden border-b md:border-b-0 md:border-r border-slate-200/80 group">
          <img 
            src="/images/student-collab.jpg" 
            alt="Uniflow Cohort Collaborating in Hardware Lab with Provided Workstations"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/30 to-transparent p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-black/60 text-emerald-400 backdrop-blur-md border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                HARDWARE LAB • LIVE
              </span>
              <span className="text-xs font-mono text-white/90 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-semibold">
                UNIFLOW HARDWARE LAB
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-xl sm:text-2xl font-instrument italic text-white drop-shadow-sm leading-snug font-normal">
                Hardware Lab & Student Capstone Cohort
              </h4>
              <p className="text-xs text-white/80 font-medium leading-relaxed font-inter-tight">
                Hands-on concept application • Laptops & hardware workstations provided by Uniflow • Peer visual collaboration & benchmark sprint
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): Interactive Study Squad Roster & Shared Workspace */}
        <div className="md:col-span-6 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1">
                <Users className="w-3 h-3 text-cyan-600" />
                ACTIVE POD (3/4)
              </span>
              <span className="text-xs font-mono text-slate-500 font-semibold">Stanford CS Cohort</span>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ● 100% SPRINT ALIGNED
            </span>
          </div>

          <h3 className="text-2xl font-instrument italic text-slate-900 tracking-tight font-normal">
            Peer Accountability & Live Knowledge Sharing
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed font-normal font-inter-tight">
            Your study pod shares synchronized lecture notes, Gradescope submission test benches, and Google Colab GPU instances with zero friction.
          </p>

          {/* Pod Members Roster */}
          <div className="space-y-2 pt-1">
            {[
              { name: 'Alex Mercer', role: 'CUDA Benchmark Engineer', status: 'Profiling PyTorch Traces', color: '#6366f1' },
              { name: 'Maya Lin', role: 'Transformer Theory Lead', status: 'Drafting Proof Section 3', color: '#06b6d4' },
              { name: 'Marcus Vance', role: 'Data Pipeline Specialist', status: 'Cleaned Pile Subsets', color: '#10b981' },
            ].map((member) => (
              <div key={member.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: member.color }} />
                  <span className="font-semibold text-slate-900">{member.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">• {member.role}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-600 font-medium">{member.status}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sound.playSuccess();
                confetti({ particleCount: 45, spread: 60 });
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 transition-all btn-tactile cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Sync Shared Workspace</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('planner');
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-mono text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all btn-tactile cursor-pointer flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-600" />
              <span>View Group Timeline</span>
            </button>
          </div>
        </div>

      </AnimatedCard>

      </div>

    </div>
  );
};
