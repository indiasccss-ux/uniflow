import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  MapPin, 
  User, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  Zap, 
  Share2, 
  RefreshCw,
  Code2,
  Sliders,
  CalendarDays
} from 'lucide-react';

export interface DayNode {
  id: string;
  order: number;
  timeSlot: string;
  courseCode: string;
  title: string;
  subtitle: string;
  type: 'Preparation' | 'Lecture' | 'Deep Work' | 'Lab' | 'Milestone';
  room: string;
  instructor?: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  x: number;
  y: number;
  width: number;
  color: string;
  codeSnippet?: string;
  sliderLabel?: string;
  sliderValue?: number;
  metric?: { label: string; value: string };
  inputs: string[];
  outputs: string[];
}

export const INITIAL_DAY_NODES: DayNode[] = [
  {
    id: 'day-node-1',
    order: 1,
    timeSlot: '08:30 - 09:45 AM',
    courseCode: 'RESEARCH',
    title: 'Morning ArXiv & Benchmark Digest',
    subtitle: 'FlashAttention-3 papers & Triton kernel architecture',
    type: 'Preparation',
    room: 'Green Library West 204',
    status: 'completed',
    x: 40,
    y: 190,
    width: 260,
    color: '#059669', // Emerald
    metric: { label: 'Digest Status', value: '4 ArXiv Papers Synthesized' },
    inputs: [],
    outputs: ['day-node-2', 'day-node-3'],
  },
  {
    id: 'day-node-2',
    order: 2,
    timeSlot: '10:00 - 11:30 AM',
    courseCode: 'CS 229',
    title: 'Sparse Attention & Transformer Scaling',
    subtitle: 'Theoretical compute bounds & memory coalescing',
    type: 'Lecture',
    room: 'Skilling Auditorium 191',
    instructor: 'Prof. Andrew Ng',
    status: 'completed',
    x: 370,
    y: 60,
    width: 270,
    color: '#4f46e5', // Indigo
    metric: { label: 'Cognitive Score', value: '98% Concept Mastery' },
    inputs: ['day-node-1'],
    outputs: ['day-node-4'],
  },
  {
    id: 'day-node-3',
    order: 3,
    timeSlot: '11:45 AM - 01:00 PM',
    courseCode: 'NEUR 210',
    title: 'Synaptic Plasticity & Spiking Models',
    subtitle: 'Hodgkin-Huxley equations & STDP temporal dynamics',
    type: 'Lecture',
    room: 'Clark Center S360',
    instructor: 'Prof. K. Shen',
    status: 'completed',
    x: 370,
    y: 330,
    width: 270,
    color: '#0891b2', // Cyan
    sliderLabel: 'Synaptic Weighting Conductance',
    sliderValue: 82,
    inputs: ['day-node-1'],
    outputs: ['day-node-5'],
  },
  {
    id: 'day-node-4',
    order: 4,
    timeSlot: '01:30 - 03:45 PM',
    courseCode: 'DEEP WORK',
    title: 'CUDA Tensor Core Coalescing Sprint',
    subtitle: 'Hopper H100 shared memory tiling & warp reduction',
    type: 'Deep Work',
    room: 'Gates CS Turing Pod 4B',
    status: 'in-progress',
    x: 720,
    y: 50,
    width: 280,
    color: '#8b5cf6', // Violet
    codeSnippet: '__device__ void warp_tile(float* smem) {\n  #pragma unroll 4\n  for (int k = 0; k < 16; ++k)\n    acc += Q[threadIdx.x] * K[k];\n}',
    inputs: ['day-node-2'],
    outputs: ['day-node-6'],
  },
  {
    id: 'day-node-5',
    order: 5,
    timeSlot: '04:00 - 05:30 PM',
    courseCode: 'NEUR 210',
    title: 'Patch-Clamp Silicon Simulator Lab',
    subtitle: 'Action potential spiking kinetics on FPGA accelerator',
    type: 'Lab',
    room: 'Bio-X Clark B100',
    instructor: 'Dr. Marcus Vance',
    status: 'upcoming',
    x: 720,
    y: 340,
    width: 270,
    color: '#0891b2', // Cyan
    metric: { label: 'Membrane Potential', value: '-65.4 mV (Stable Target)' },
    inputs: ['day-node-3'],
    outputs: ['day-node-6'],
  },
  {
    id: 'day-node-6',
    order: 6,
    timeSlot: '06:00 - 08:30 PM',
    courseCode: 'TREEHACKS',
    title: 'TreeHacks 2026 Core Infrastructure Lock',
    subtitle: 'Autonomous agent swarm engine integration & deployment',
    type: 'Milestone',
    room: 'Huang Engineering Center',
    status: 'upcoming',
    x: 1070,
    y: 190,
    width: 280,
    color: '#d97706', // Amber
    metric: { label: 'Milestone Priority', value: 'Critical • Roster Submission' },
    inputs: ['day-node-4', 'day-node-5'],
    outputs: [],
  },
];

export const DailyNodeGraph: React.FC = () => {
  const { themeConfig, activeTab } = useTheme();

  const [nodes, setNodes] = useState<DayNode[]>(INITIAL_DAY_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('day-node-4');
  const [zoom, setZoom] = useState<number>(1);
  const [flowActive, setFlowActive] = useState<boolean>(true);

  // Sequential reveal state: cards animate in slowly one by one
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [isAssembling, setIsAssembling] = useState<boolean>(true);

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<any>(null);
  const isMountedRef = useRef<boolean>(true);
  const activeTabRef = useRef<string>(activeTab);

  const stopAssembly = (revealAll = false) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsAssembling(false);
    if (revealAll) {
      setRevealedCount(INITIAL_DAY_NODES.length);
    }
  };

  // Synchronize activeTabRef and immediately cancel if user switches away from planner
  useEffect(() => {
    activeTabRef.current = activeTab;
    if (activeTab !== 'planner') {
      stopAssembly(true);
    }
  }, [activeTab]);

  // Assembly sequence launcher
  const startAssemblySequence = () => {
    if (activeTabRef.current !== 'planner') {
      stopAssembly(true);
      return;
    }

    stopAssembly(false);
    setIsAssembling(true);
    setRevealedCount(0);
    sound.playClick(800);

    let step = 0;
    timerRef.current = setInterval(() => {
      // Abort immediately with NO sound if user switched away, window hidden, or unmounted
      if (!isMountedRef.current || activeTabRef.current !== 'planner' || (typeof document !== 'undefined' && document.hidden)) {
        stopAssembly(true);
        return;
      }

      step++;
      setRevealedCount(step);
      sound.playPop();

      if (step >= INITIAL_DAY_NODES.length) {
        stopAssembly(false);
        if (isMountedRef.current && activeTabRef.current === 'planner' && !document.hidden) {
          sound.playSuccess();
          confetti({
            particleCount: 75,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#4f46e5', '#0891b2', '#8b5cf6', '#d97706'],
          });
        }
      }
    }, 550);
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (activeTab === 'planner') {
      startAssemblySequence();
    } else {
      stopAssembly(true);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAssembly(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMountedRef.current = false;
      stopAssembly(false);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Dragging handlers
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.min(1500, (e.clientX - canvasRect.left) / zoom - dragOffset.x));
    const newY = Math.max(20, Math.min(650, (e.clientY - canvasRect.top) / zoom - dragOffset.y));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
    );
  };

  const handleMouseUp = () => {
    if (draggingNodeId) {
      sound.playPop();
      setDraggingNodeId(null);
    }
  };

  const handleNodeMouseDown = (e: React.MouseEvent, node: DayNode) => {
    e.stopPropagation();
    sound.playClick();
    setSelectedNodeId(node.id);
    setDraggingNodeId(node.id);

    if (canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const clickCanvasX = (e.clientX - canvasRect.left) / zoom;
      const clickCanvasY = (e.clientY - canvasRect.top) / zoom;
      setDragOffset({
        x: clickCanvasX - node.x,
        y: clickCanvasY - node.y,
      });
    }
  };

  // Build connections list
  const connections: Array<{
    id: string;
    source: DayNode;
    target: DayNode;
    color: string;
    active: boolean;
    visible: boolean;
  }> = [];

  nodes.forEach((sourceNode) => {
    sourceNode.outputs.forEach((targetId) => {
      const targetNode = nodes.find((n) => n.id === targetId);
      if (targetNode) {
        const isConnectedToSelected =
          selectedNodeId === sourceNode.id || selectedNodeId === targetNode.id;
        
        // Cable visible only when both source and target have been revealed
        const isVisible = sourceNode.order <= revealedCount && targetNode.order <= revealedCount;

        connections.push({
          id: `${sourceNode.id}->${targetNode.id}`,
          source: sourceNode,
          target: targetNode,
          color: sourceNode.color,
          active: isConnectedToSelected,
          visible: isVisible,
        });
      }
    });
  });

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[3];
  const isFullyAssembled = revealedCount >= nodes.length;

  return (
    <div className="vadim-glass-card rounded-3xl border border-slate-200/90 overflow-hidden flex flex-col relative shadow-xs">
      
      {/* Top Controls Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-white/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 z-20">
        
        {/* Left: Title & Assembly Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base sm:text-lg font-instrument italic text-slate-900 font-normal tracking-tight">
              Daily Lecture Concepts & Chronological Pipeline
            </h3>
          </div>

          {/* Staggered Reveal Progress Chip */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 border border-slate-200 text-slate-700">
            {isAssembling ? (
              <>
                <RefreshCw className="w-3 h-3 text-cyan-600 animate-spin" />
                <span>Assembling Concept {revealedCount}/{nodes.length}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-medium">Daily Lecture Concepts Synchronized</span>
              </>
            )}
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2">
          
          {/* Replay Sequence Button */}
          <button
            onClick={startAssemblySequence}
            disabled={isAssembling}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all btn-tactile cursor-pointer ${
              isAssembling 
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 shadow-xs'
            }`}
            title="Replay slow one-by-one card reveal animation"
          >
            <Play className={`w-3 h-3 ${isAssembling ? 'opacity-50' : 'text-cyan-600'}`} />
            <span>Replay Flow Sequence</span>
          </button>

          {/* Flow Cable Energy Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setFlowActive((prev) => !prev);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all btn-tactile cursor-pointer ${
              flowActive 
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Zap className={`w-3 h-3 ${flowActive ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Energy Flow</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center rounded-xl bg-slate-100 border border-slate-200 p-0.5">
            <button
              onClick={() => {
                sound.playClick(1000);
                setZoom((prev) => Math.min(1.3, prev + 0.1));
              }}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-slate-700 font-semibold tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => {
                sound.playClick(900);
                setZoom((prev) => Math.max(0.7, prev - 0.1));
              }}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setZoom(1);
                setNodes(INITIAL_DAY_NODES);
              }}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
              title="Reset Layout & Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Drag & Flow Canvas */}
      <div 
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-[580px] overflow-auto relative select-none bg-[#F8FAFC] cursor-grab active:cursor-grabbing"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.25) 1px, transparent 0),
            radial-gradient(ellipse 60% 40% at 50% 20%, rgba(79, 70, 229, 0.04), transparent)
          `,
          backgroundSize: '24px 24px, 100% 100%',
        }}
      >
        <div 
          className="relative min-w-[1450px] min-h-[560px] transition-transform duration-75 origin-top-left"
          style={{ transform: `scale(${zoom})` }}
        >
          
          {/* SVG Cable Energy Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
            <defs>
              <linearGradient id="day-cable-gradient-indigo" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="day-cable-gradient-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0891b2" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
              </linearGradient>
              <filter id="day-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {connections.map((conn) => {
              if (!conn.visible) return null;

              const x1 = conn.source.x + conn.source.width;
              const y1 = conn.source.y + 65;
              const x2 = conn.target.x;
              const y2 = conn.target.y + 65;
              const dx = Math.abs(x2 - x1) * 0.5;
              const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

              return (
                <g key={conn.id} className="transition-all duration-300">
                  {/* Subtle Base Cable Track */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth={conn.active ? 3.5 : 2}
                    strokeLinecap="round"
                    opacity={conn.active ? 0.7 : 0.4}
                  />

                  {/* Flowing Animated Energy Cable */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={conn.color}
                    strokeWidth={conn.active ? 3 : 2}
                    strokeLinecap="round"
                    strokeDasharray={flowActive ? '6 6' : 'none'}
                    className={flowActive ? 'animate-cable-flow' : ''}
                    opacity={conn.active ? 1 : 0.75}
                    filter={conn.active ? 'url(#day-glow)' : undefined}
                  />

                  {/* Port Connection Dots */}
                  <circle cx={x1} cy={y1} r={4} fill={conn.color} className="shadow-md" />
                  <circle cx={x2} cy={y2} r={4} fill={conn.target.color} className="shadow-md" />
                </g>
              );
            })}
          </svg>

          {/* Interactive Cards Layer */}
          {nodes.map((node) => {
            const isRevealed = node.order <= revealedCount;
            const isSelected = selectedNodeId === node.id;
            const isCurrentlyDragging = draggingNodeId === node.id;

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
                className={`absolute z-20 rounded-2xl border transition-all duration-300 ${
                  isRevealed
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-90 pointer-events-none'
                } ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 shadow-[0_0_25px_rgba(79,70,229,0.2)] border-indigo-500 vadim-glass-card'
                    : 'border-slate-200/90 hover:border-slate-300 shadow-sm vadim-glass-card'
                } ${isCurrentlyDragging ? 'scale-105 shadow-xl cursor-grabbing' : 'cursor-grab'}`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: `${node.width}px`,
                  backdropFilter: 'blur(20px)',
                  transitionProperty: isCurrentlyDragging ? 'none' : 'all',
                }}
              >
                {/* Left Colored Accent Stripe */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
                  style={{ backgroundColor: node.color }}
                />

                {/* Left Input Port Socket */}
                {node.inputs.length > 0 && (
                  <div 
                    className="absolute -left-2 top-[60px] w-3.5 h-3.5 rounded-full bg-white border-2 shadow-xs flex items-center justify-center ring-2 ring-slate-200"
                    style={{ borderColor: node.color }}
                    title="Input Port"
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: node.color }} />
                  </div>
                )}

                {/* Right Output Port Socket */}
                {node.outputs.length > 0 && (
                  <div 
                    className="absolute -right-2 top-[60px] w-3.5 h-3.5 rounded-full bg-white border-2 shadow-xs flex items-center justify-center ring-2 ring-slate-200"
                    style={{ borderColor: node.color }}
                    title="Output Flow Port"
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: node.color }} />
                  </div>
                )}

                <div className="p-3.5 pl-4 space-y-2">
                  
                  {/* Card Header: Time & Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-700">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{node.timeSlot}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span 
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold"
                        style={{ backgroundColor: `${node.color}15`, color: node.color }}
                      >
                        {node.courseCode}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-mono uppercase font-semibold border border-slate-200">
                        {node.type}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug line-clamp-1">
                      {node.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {node.subtitle}
                    </p>
                  </div>

                  {/* Interactive Code Snippet Preview (for Deep Work) */}
                  {node.codeSnippet && (
                    <div className="p-2 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[10px] overflow-hidden leading-relaxed shadow-inner">
                      <div className="text-[9px] text-slate-400 border-b border-slate-800 pb-1 mb-1 flex items-center justify-between">
                        <span>H100_WARP_KERNEL</span>
                        <span className="text-indigo-400">CUDA C++</span>
                      </div>
                      <pre className="line-clamp-2 overflow-x-hidden text-slate-200">
                        {node.codeSnippet}
                      </pre>
                    </div>
                  )}

                  {/* Interactive Slider Preview */}
                  {node.sliderLabel && (
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-600 font-mono">
                        <span className="truncate max-w-[150px]">{node.sliderLabel}</span>
                        <span className="font-bold text-slate-900">{node.sliderValue} nS</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ width: `${node.sliderValue}%`, backgroundColor: node.color }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Metric or Instructor Chip */}
                  <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1 truncate max-w-[140px]">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{node.room}</span>
                    </span>

                    {node.status === 'completed' && (
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[10px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Done
                      </span>
                    )}

                    {node.status === 'in-progress' && (
                      <span className="flex items-center gap-1 text-indigo-700 font-semibold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> Active
                      </span>
                    )}

                    {node.status === 'upcoming' && (
                      <span className="text-slate-400 font-mono text-[9px] uppercase">
                        Queued
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Selected Node Inspector Drawer */}
      {selectedNode && (
        <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-white/95 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 z-20">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md flex-shrink-0"
              style={{ backgroundColor: selectedNode.color }}
            >
              <Share2 className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                  style={{ backgroundColor: `${selectedNode.color}15`, color: selectedNode.color }}
                >
                  {selectedNode.courseCode}
                </span>
                <span className="text-xs font-mono text-slate-700 font-semibold">
                  {selectedNode.timeSlot}
                </span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs text-slate-600 flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-slate-400" /> {selectedNode.room}
                </span>
              </div>
              <h4 className="text-base font-instrument italic text-slate-900 mt-0.5 font-normal">
                {selectedNode.title}
              </h4>
              <p className="text-xs text-slate-500">
                {selectedNode.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playSuccess();
                confetti({
                  particleCount: 50,
                  spread: 60,
                  origin: { y: 0.7 },
                  colors: [selectedNode.color, '#10b981'],
                });
                setNodes((prev) =>
                  prev.map((n) =>
                    n.id === selectedNode.id ? { ...n, status: 'completed' as const } : n
                  )
                );
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-mono font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all btn-tactile cursor-pointer"
            >
              Mark Node Slot Attended
            </button>

            <button
              onClick={() => {
                sound.playSuccess();
                confetti({
                  particleCount: 80,
                  spread: 70,
                  origin: { y: 0.7 },
                  colors: [themeConfig.primary, '#8b5cf6', '#06b6d4'],
                });
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 transition-all btn-tactile cursor-pointer shadow-md"
            >
              Sync Node with Canvas LMS
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
