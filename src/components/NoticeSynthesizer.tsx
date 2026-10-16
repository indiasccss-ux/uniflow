import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { RAW_NOTICES, CollegeNotice } from '../data/mockData';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { AnimatedCard } from './AnimatedCard';
import { 
  Wand2, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Share2, 
  Copy, 
  Layers, 
  FileText, 
  MessageSquare, 
  Flame,
  Sun,
  BookOpen,
  UploadCloud
} from 'lucide-react';

export const NoticeSynthesizer: React.FC = () => {
  const { themeConfig, setActiveTab, activeTab } = useTheme();

  const [selectedNoticeId, setSelectedNoticeId] = useState<string>(RAW_NOTICES[0].id);
  const [customText, setCustomText] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [synthesizedNotice, setSynthesizedNotice] = useState<CollegeNotice | null>(RAW_NOTICES[0]);
  const [hasAddedToPlanner, setHasAddedToPlanner] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  const timeoutsRef = useRef<number[]>([]);
  const isMountedRef = useRef<boolean>(true);
  const activeTabRef = useRef<string>(activeTab);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  const stopSynthesizing = () => {
    clearAllTimeouts();
    setIsAnalyzing(false);
    setAnalysisStep(0);
  };

  // Synchronize activeTabRef and immediately cancel synthesis if user switches away
  useEffect(() => {
    activeTabRef.current = activeTab;
    if (activeTab !== 'synthesizer') {
      stopSynthesizing();
      setSynthesizedNotice((prev) => prev || RAW_NOTICES[0]);
    }
  }, [activeTab]);

  useEffect(() => {
    isMountedRef.current = true;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopSynthesizing();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMountedRef.current = false;
      stopSynthesizing();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const activeNotice = isCustom
    ? {
        id: 'custom',
        title: 'Custom Unformatted Notice',
        sender: 'User Input',
        channel: 'WhatsApp Forward' as const,
        date: 'Just now',
        rawText: customText || 'Paste any messy text here...',
        extracted: {
          courseCode: 'CS 229',
          actionItem: 'Complete Neural Network Problem Set & Run Validation Script',
          deadline: '2026-10-17T23:59:00',
          deadlineFormatted: 'This Friday • 11:59 PM',
          priority: 'CRITICAL' as const,
          estimatedHours: 3.5,
          tags: ['Extracted', 'Custom Notice', 'Priority'],
          summary: 'Auto-synthesized requirements from custom input text.',
          actionType: 'Assignment' as const,
        },
      }
    : RAW_NOTICES.find((n) => n.id === selectedNoticeId) || RAW_NOTICES[0];

  const handleSynthesize = () => {
    if (activeTabRef.current !== 'synthesizer') return;

    stopSynthesizing();
    setIsAnalyzing(true);
    setAnalysisStep(1);
    setSynthesizedNotice(null);
    setHasAddedToPlanner(false);
    sound.playScan();

    const t1 = window.setTimeout(() => {
      if (!isMountedRef.current || activeTabRef.current !== 'synthesizer' || document.hidden) {
        stopSynthesizing();
        return;
      }
      setAnalysisStep(2);
      sound.playClick(1000);
    }, 700);

    const t2 = window.setTimeout(() => {
      if (!isMountedRef.current || activeTabRef.current !== 'synthesizer' || document.hidden) {
        stopSynthesizing();
        return;
      }
      setAnalysisStep(3);
      sound.playClick(1200);
    }, 1400);

    const t3 = window.setTimeout(() => {
      if (!isMountedRef.current || activeTabRef.current !== 'synthesizer' || document.hidden) {
        stopSynthesizing();
        return;
      }
      setIsAnalyzing(false);
      setSynthesizedNotice(activeNotice);
      sound.playSuccess();
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: [themeConfig.primary, '#06b6d4', '#4f46e5'],
      });
    }, 2100);

    timeoutsRef.current = [t1, t2, t3];
  };

  const handleAddToPlanner = () => {
    sound.playSuccess();
    setHasAddedToPlanner(true);
    confetti({
      particleCount: 90,
      spread: 90,
      origin: { y: 0.7 },
      colors: ['#10b981', themeConfig.primary, '#ec4899'],
    });
  };

  const handleLaunchPlanner = () => {
    sound.playClick();
    setActiveTab('planner');
  };

  const handleCopyMarkdown = () => {
    if (!synthesizedNotice) return;
    const text = `### [${synthesizedNotice.extracted.courseCode}] ${synthesizedNotice.extracted.actionItem}\n- **Deadline**: ${synthesizedNotice.extracted.deadlineFormatted}\n- **Priority**: ${synthesizedNotice.extracted.priority}\n- **Est. Load**: ${synthesizedNotice.extracted.estimatedHours} hrs\n- **Summary**: ${synthesizedNotice.extracted.summary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    sound.playPop();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-36">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              ✦ TASK & DIRECTIVE SYNTHESIS
            </span>
            <span className="text-xs font-mono text-slate-500 font-medium">VISUAL PEDAGOGY ENGINE</span>
          </div>
          <h2 className="font-instrument italic text-3xl sm:text-4xl lg:text-5xl text-slate-900 font-normal tracking-tight mt-1.5">
            Faculty Task & Notice Synthesizer
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl font-inter-tight leading-relaxed">
            When faculty assign complex academic tasks, synthesize the notice to immediately distill the core idea into a clean, actionable, visualized format.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsCustom(false);
              setSelectedNoticeId(RAW_NOTICES[0].id);
              setSynthesizedNotice(RAW_NOTICES[0]);
              setHasAddedToPlanner(false);
              sound.playClick();
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors cursor-pointer btn-tactile"
          >
            Reset Preset
          </button>
        </div>
      </div>

      {/* Editorial Workspace & Notice Ingestion Banner (Page 2 Featured Image - BIG & CINEMATIC) */}
      <AnimatedCard index={0} className="vadim-glass-card rounded-3xl border border-slate-200/90 overflow-hidden relative group shadow-xs">
        <div className="relative h-72 sm:h-80 md:h-[360px] overflow-hidden">
          <img 
            src="/images/study-desk.png" 
            alt="Student Study Desk Workspace"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/40 to-transparent p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/60 text-white backdrop-blur-md border border-white/20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                STUDENT WORKSPACE DESK • ACTIVE SYNC
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/80 text-white backdrop-blur-md border border-indigo-400/30">
                VISUAL PEDAGOGY
              </span>
            </div>

            <div className="max-w-2xl space-y-2">
              <h3 className="text-2xl sm:text-3xl font-instrument italic text-white tracking-tight drop-shadow-sm leading-tight font-normal">
                Faculty Task & Assignment Directive Ingestion
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal font-inter-tight">
                Whenever faculty issue academic assignments, project briefs, or lab directives, paste or select the task below. Uniflow synthesizes the core idea into a visualized format with clear milestones and study requirements.
              </p>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Notice Selector Tabs: Uncluttered horizontal scrollable pill bar */}
      <AnimatedCard index={1} className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {RAW_NOTICES.map((notice) => {
          const isSelected = !isCustom && selectedNoticeId === notice.id;
          return (
            <button
              key={notice.id}
              onClick={() => {
                sound.playClick();
                setIsCustom(false);
                setSelectedNoticeId(notice.id);
                setSynthesizedNotice(notice);
                setHasAddedToPlanner(false);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap btn-tactile ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md font-bold scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-600" />
              <span>{notice.title.slice(0, 30)}...</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}>
                {notice.channel}
              </span>
            </button>
          );
        })}

        <button
          onClick={() => {
            sound.playClick();
            setIsCustom(true);
            setSynthesizedNotice(null);
            setHasAddedToPlanner(false);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap btn-tactile ${
            isCustom
              ? 'bg-slate-900 text-white shadow-md font-bold scale-[1.02]'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-amber-600" />
          <span>Paste Custom Raw Notice</span>
        </button>
      </AnimatedCard>

      {/* Main Interactive Split Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side (6 cols): The Raw Unstructured Notice */}
        <div className="lg:col-span-6 space-y-4">
          <AnimatedCard index={2} className="vadim-glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 relative shadow-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-700 font-semibold">
                  INPUT: RAW UNSTRUCTURED STREAM
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">{activeNotice.channel}</span>
            </div>

            {/* Notice Metadata Badge */}
            <div className="mt-3.5 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Source: <strong className="text-slate-800 font-medium">{activeNotice.sender}</strong></span>
              <span className="text-slate-500">{activeNotice.date}</span>
            </div>

            {/* The Raw Content Box with Code / Chat styling */}
            <div className="mt-3.5 relative rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-mono text-slate-800 leading-relaxed min-h-[220px]">
              {isCustom ? (
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Paste raw unformatted text from WhatsApp, Canvas, Discord or email here (e.g. 'Heads up class! Assignment 3 deadline is pushed to tomorrow at 5pm instead of Friday due to server crashes. Submit on Gradescope...')"
                  className="w-full h-44 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none resize-none leading-relaxed"
                />
              ) : (
                <div className="whitespace-pre-wrap">{activeNotice.rawText}</div>
              )}

              {/* Laser Scanning Overlay during analysis */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-amber-400/10 backdrop-blur-[1px] rounded-2xl overflow-hidden pointer-events-none">
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_15px_#f59e0b] animate-bounce" />
                </div>
              )}
            </div>

            {/* Action Trigger Button */}
            <div className="mt-5">
              <button
                onClick={handleSynthesize}
                disabled={isAnalyzing}
                className="w-full py-3.5 px-6 rounded-2xl text-xs font-mono uppercase tracking-wider font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 btn-tactile border border-white/15"
                style={{
                  background: `linear-gradient(135deg, ${themeConfig.primary}, #ec4899)`,
                  boxShadow: `0 6px 25px ${themeConfig.glow}`,
                }}
              >
                <Wand2 className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Synthesizing Notice...' : 'Synthesize Notice'}</span>
                {!isAnalyzing && <ArrowRight className="w-3.5 h-3.5 ml-1" />}
              </button>
            </div>

            {/* Dynamic Step Tracker when analyzing */}
            {isAnalyzing && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 space-y-2 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${analysisStep >= 1 ? 'bg-amber-500' : 'bg-slate-300'}`} />
                  <span className="text-[11px]">Stage 1: Removing conversational noise & signature headers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${analysisStep >= 2 ? 'bg-cyan-500' : 'bg-slate-300'}`} />
                  <span className="text-[11px]">Stage 2: Resolving temporal references (e.g. "This Thursday 11:59 PM")</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${analysisStep >= 3 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className="text-[11px]">Stage 3: Synthesizing Linear-style task ticket & study blocks</span>
                </div>
              </div>
            )}
          </AnimatedCard>
        </div>

        {/* Right Side (6 cols): The Synthesized Action Card */}
        <div className="lg:col-span-6 space-y-4">
          <AnimatedCard index={3} className="vadim-glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 relative min-h-[460px] flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-mono uppercase tracking-widest text-slate-700 font-semibold">
                    OUTPUT: VISUALIZED TASK SPEC & CORE IDEA
                  </span>
                </div>
                {synthesizedNotice && (
                  <button
                    onClick={handleCopyMarkdown}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] font-mono text-slate-700 transition-colors cursor-pointer btn-tactile"
                  >
                    <Copy className="w-3 h-3 text-amber-600" />
                    <span>{copied ? 'Copied!' : 'Copy Spec'}</span>
                  </button>
                )}
              </div>

              {/* Synthesized Output Display */}
              {!synthesizedNotice && !isAnalyzing ? (
                <div className="py-24 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                    <Layers className="w-7 h-7 text-amber-500/60" />
                  </div>
                  <h4 className="text-2xl font-instrument italic text-slate-900 font-normal">Ready for Task Synthesis</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto font-normal leading-relaxed">
                    Click "Synthesize Notice" on the left to distill what this academic task says into its core idea, milestones, and visual action format.
                  </p>
                </div>
              ) : isAnalyzing ? (
                <div className="py-24 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 animate-spin">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-instrument italic text-slate-900 font-normal">Distilling Faculty Task Directive...</h4>
                    <p className="text-xs font-mono text-amber-700 font-medium">Extracting core idea, visual milestones, and study hours</p>
                  </div>
                </div>
              ) : synthesizedNotice ? (
                /* The Final Synthesized Action Ticket */
                <div className="mt-4 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  
                  {/* Badge header */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold"
                      style={{
                        backgroundColor: `${themeConfig.primary}15`,
                        color: themeConfig.primary,
                        border: `1px solid ${themeConfig.primary}35`,
                      }}
                    >
                      {synthesizedNotice.extracted.courseCode}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      {synthesizedNotice.extracted.priority} DEADLINE
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono text-slate-700 bg-slate-100 border border-slate-200 font-medium">
                      {synthesizedNotice.extracted.actionType}
                    </span>
                  </div>

                  {/* Action Item Title */}
                  <h3 className="text-2xl sm:text-3xl font-instrument italic text-slate-900 leading-tight font-normal">
                    {synthesizedNotice.extracted.actionItem}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {synthesizedNotice.extracted.summary}
                  </p>

                  {/* Metadata Matrix */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] uppercase font-mono text-slate-500 font-medium flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-cyan-600" />
                        <span>Deadline Horizon</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-1 font-mono">
                        {synthesizedNotice.extracted.deadlineFormatted}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] uppercase font-mono text-slate-500 font-medium flex items-center gap-1.5">
                        <Flame className="w-3 h-3 text-amber-600" />
                        <span>Cognitive Load</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-1 font-mono">
                        {synthesizedNotice.extracted.estimatedHours}h Deep Focus Required
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {synthesizedNotice.extracted.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                </div>
              ) : null}
            </div>

            {/* Signature Bottom Action Flow */}
            {synthesizedNotice && !isAnalyzing && (
              <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToPlanner}
                  disabled={hasAddedToPlanner}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer btn-tactile ${
                    hasAddedToPlanner
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{hasAddedToPlanner ? '✓ Scheduled in Planner' : 'Add to Academic Planner'}</span>
                </button>

                <button
                  onClick={handleLaunchPlanner}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold text-white transition-all flex items-center justify-center gap-2 cursor-pointer btn-tactile border border-white/15"
                  style={{
                    background: `linear-gradient(135deg, ${themeConfig.primary}, #0891b2)`,
                    boxShadow: `0 4px 15px ${themeConfig.glow}`,
                  }}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Open In Connected Graph</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </AnimatedCard>
        </div>

      </div>

      {/* Mindful Syllabus & Quiet Ingestion Sanctuary (Page 2 Featured Image 2 - MEDIUM-TO-BIG) */}
      <AnimatedCard index={4} className="vadim-glass-card rounded-3xl border border-slate-200/90 overflow-hidden grid grid-cols-1 md:grid-cols-12 items-center shadow-xs">
        
        {/* Left Column (6 cols): The sunlit-study.png photograph */}
        <div className="md:col-span-6 relative h-72 sm:h-80 md:h-[340px] overflow-hidden border-b md:border-b-0 md:border-r border-slate-200/80 group">
          <img 
            src="/images/sunlit-study.png" 
            alt="Sunlit Morning Study Nook with Houseplants and Academic Notebooks"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/95 via-[#0a0a0b]/40 to-transparent p-6 sm:p-7 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-black/70 text-amber-300 backdrop-blur-md border border-amber-400/30 flex items-center gap-1.5 shadow-sm">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                MINDFUL FOCUS NOOK • 08:30 AM
              </span>
              <span className="text-xs font-mono text-white/80 bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full font-medium border border-white/10">
                CAMPUS ROW RESIDENCES
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-2xl sm:text-3xl font-instrument italic text-white drop-shadow-sm leading-snug font-normal">
                Quiet Offline Syllabus Digestion
              </h4>
              <p className="text-xs text-white/70 font-normal leading-relaxed">
                Natural morning sunlight • Zero notification interruption • Batch extract full 16-week curricula from PDFs
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): Batch Syllabus Document Ingestion */}
        <div className="md:col-span-6 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-amber-600" />
                SYLLABUS RADAR
              </span>
              <span className="text-xs font-mono text-slate-400">Offline Document Engine</span>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ● OCR v4.2 ACCELERATED
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-instrument italic text-slate-900 tracking-tight font-normal">
            Batch Syllabus & Lecture Slide Extraction
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Have a 40-page course syllabus or midterm review PDF? Drop it into Uniflow. Our neural pipeline maps every quiz date, required textbook chapter, and grading breakdown directly onto your Dynamic Planner.
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <UploadCloud className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="font-semibold block text-slate-900 font-mono text-xs">CS 229_Spring_2026_Syllabus.pdf</span>
                <span className="text-[10px] text-slate-500 font-mono">14 Deadlines extracted • 4 Midterm dates locked</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              SYNCHRONIZED
            </span>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sound.playSuccess();
                confetti({ particleCount: 40, spread: 55 });
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold text-white transition-all btn-tactile cursor-pointer border border-transparent shadow-md flex items-center gap-1.5"
              style={{
                background: `linear-gradient(135deg, ${themeConfig.primary}, #f59e0b)`,
                boxShadow: `0 4px 15px ${themeConfig.glow}`,
              }}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Import Full Syllabus PDF</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('planner');
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all btn-tactile cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>View On Planner</span>
            </button>
          </div>
        </div>

      </AnimatedCard>

    </div>
  );
};
