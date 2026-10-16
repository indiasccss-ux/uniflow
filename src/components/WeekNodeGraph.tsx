import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  CalendarDays, 
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
  Layers
} from 'lucide-react';

export interface WeekNode {
  id: string;
  order: number;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  timeSlot: string;
  courseCode: string;
  title: string;
  subtitle: string;
  type: 'Lecture' | 'Lab' | 'Deep Work' | 'Milestone';
  room: string;
  instructor?: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  x: number;
  y: number;
  width: number;
  color: string;
  metric?: { label: string; value: string };
  inputs: string[];
  outputs: string[];
}

export const INITIAL_WEEK_NODES: WeekNode[] = [
  // MONDAY
  {
    id: 'week-mon-1',
    order: 1,
    day: 'Mon',
    timeSlot: '10:00 - 11:30 AM',
    courseCode: 'CS 229',
    title: 'Sparse Attention & Transformer Laws',
    subtitle: 'Compute bounds & memory coalescing foundations',
    type: 'Lecture',
    room: 'Skilling 191',
    instructor: 'Prof. Andrew Ng',
    status: 'completed',
    x: 40,
    y: 80,
    width: 250,
    color: '#4f46e5', // Indigo
    metric: { label: 'Foundation', value: 'Lecture Video Archived' },
    inputs: [],
    outputs: ['week-tue-2', 'week-wed-2'],
  },
  {
    id: 'week-mon-2',
    order: 2,
    day: 'Mon',
    timeSlot: '01:30 - 03:30 PM',
    courseCode: 'CS 229',
    title: 'High-Throughput GPU Cluster Lab',
    subtitle: 'Slurm cluster partition initialization',
    type: 'Lab',
    room: 'Gates B24 Cluster',
    instructor: 'TA Alex Rivera',
    status: 'completed',
    x: 40,
    y: 350,
    width: 250,
    color: '#4f46e5',
    metric: { label: 'Allocated Node', value: '8x H100 SXM5 SXM' },
    inputs: [],
    outputs: ['week-tue-2'],
  },

  // TUESDAY
  {
    id: 'week-tue-1',
    order: 3,
    day: 'Tue',
    timeSlot: '11:00 AM - 12:30 PM',
    courseCode: 'NEUR 210',
    title: 'Synaptic Plasticity & Spiking Models',
    subtitle: 'STDP temporal dynamics & silicon neurons',
    type: 'Lecture',
    room: 'Clark S360',
    instructor: 'Prof. K. Shen',
    status: 'completed',
    x: 350,
    y: 70,
    width: 260,
    color: '#0891b2', // Cyan
    metric: { label: 'Biological Circuit', value: 'Hebbian Synapse Model' },
    inputs: [],
    outputs: ['week-wed-1', 'week-thu-1'],
  },
  {
    id: 'week-tue-2',
    order: 4,
    day: 'Tue',
    timeSlot: '02:00 - 05:00 PM',
    courseCode: 'DEEP WORK',
    title: 'FlashAttention Kernel Optimization',
    subtitle: 'Hopper H100 shared memory tiling & warp reduction',
    type: 'Deep Work',
    room: 'Gates CS Turing Pod 4B',
    status: 'in-progress',
    x: 350,
    y: 340,
    width: 260,
    color: '#8b5cf6', // Violet
    metric: { label: 'Kernel Throughput', value: '3.42x speedup vs baseline' },
    inputs: ['week-mon-1', 'week-mon-2'],
    outputs: ['week-wed-2', 'week-thu-2'],
  },

  // WEDNESDAY
  {
    id: 'week-wed-1',
    order: 5,
    day: 'Wed',
    timeSlot: '09:30 - 11:30 AM',
    courseCode: 'NEUR 210',
    title: 'Bio-X Fellowship Defense Deck Prep',
    subtitle: '5-page thesis defense slides for committee review',
    type: 'Milestone',
    room: 'Clark B100',
    status: 'upcoming',
    x: 670,
    y: 70,
    width: 260,
    color: '#0891b2',
    metric: { label: 'Committee', value: '3 Faculty Reviewers' },
    inputs: ['week-tue-1'],
    outputs: ['week-fri-1'],
  },
  {
    id: 'week-wed-2',
    order: 6,
    day: 'Wed',
    timeSlot: '02:00 - 04:00 PM',
    courseCode: 'CS 229',
    title: 'cuBLAS vs Triton Kernel Benchmark',
    subtitle: 'Submission to Stanford MLSys benchmark leaderboard',
    type: 'Lab',
    room: 'Huang Engineering',
    status: 'upcoming',
    x: 670,
    y: 350,
    width: 260,
    color: '#4f46e5',
    metric: { label: 'Leaderboard', value: 'Rank #1 Target' },
    inputs: ['week-mon-1', 'week-tue-2'],
    outputs: ['week-thu-2'],
  },

  // THURSDAY
  {
    id: 'week-thu-1',
    order: 7,
    day: 'Thu',
    timeSlot: '10:30 AM - 01:00 PM',
    courseCode: 'DESIGN 314',
    title: 'Spatial VisionOS Shader Studio',
    subtitle: 'High-fidelity glass physics & spatial gesture tracking',
    type: 'Lab',
    room: 'd.school Studio 2',
    instructor: 'Elena Rostova',
    status: 'upcoming',
    x: 990,
    y: 80,
    width: 260,
    color: '#e11d48', // Rose
    metric: { label: 'RealityKit 4', value: '60 FPS Metal Compute' },
    inputs: ['week-tue-1'],
    outputs: ['week-fri-2'],
  },
  {
    id: 'week-thu-2',
    order: 8,
    day: 'Thu',
    timeSlot: '04:30 - 07:00 PM',
    courseCode: 'TREEHACKS',
    title: 'TreeHacks 2026 Core Infrastructure Sync',
    subtitle: 'Autonomous agent swarm engine integration & deployment',
    type: 'Milestone',
    room: 'Huang Basement',
    status: 'upcoming',
    x: 990,
    y: 350,
    width: 260,
    color: '#d97706', // Amber
    metric: { label: 'Hackathon Roster', value: '4 Engineers Synced' },
    inputs: ['week-tue-2', 'week-wed-2'],
    outputs: ['week-fri-2'],
  },

  // FRIDAY
  {
    id: 'week-fri-1',
    order: 9,
    day: 'Fri',
    timeSlot: '10:00 - 11:30 AM',
    courseCode: 'NEUR 210',
    title: 'Bio-X Fellowship Defense Presentation',
    subtitle: 'Live committee defense @ Clark S360 Auditorium',
    type: 'Milestone',
    room: 'Clark S360',
    status: 'upcoming',
    x: 1310,
    y: 80,
    width: 260,
    color: '#0891b2',
    metric: { label: 'Defense Verdict', value: 'High Honors Target' },
    inputs: ['week-wed-1'],
    outputs: [],
  },
  {
    id: 'week-fri-2',
    order: 10,
    day: 'Fri',
    timeSlot: '01:30 - 04:30 PM',
    courseCode: 'CAPSTONE',
    title: 'Autonomous Systems Capstone Deployment',
    subtitle: 'Live end-to-end telemetry demonstration & graduation milestone',
    type: 'Milestone',
    room: 'Gates CS Common',
    status: 'upcoming',
    x: 1310,
    y: 350,
    width: 260,
    color: '#059669', // Emerald
    metric: { label: 'Final Output', value: 'Production Verification' },
    inputs: ['week-thu-1', 'week-thu-2'],
    outputs: [],
  },
];

export const WeekNodeGraph: React.FC = () => {
  const { themeConfig, activeTab } = useTheme();

  const [nodes, setNodes] = useState<WeekNode[]>(INITIAL_WEEK_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('week-tue-2');
  const [zoom, setZoom] = useState<number>(0.95);
  const [flowActive, setFlowActive] = useState<boolean>(true);

  // Staggered sequential reveal state: shows cards one-by-one slowly across the week!
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
      setRevealedCount(INITIAL_WEEK_NODES.length);
    }
  };

  // Synchronize activeTabRef and immediately cancel if user switches away from planner
  useEffect(() => {
    activeTabRef.current = activeTab;
    if (activeTab !== 'planner') {
      stopAssembly(true);
    }
  }, [activeTab]);

  // Sequential reveal launcher
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

      if (step >= INITIAL_WEEK_NODES.length) {
        stopAssembly(false);
        if (isMountedRef.current && activeTabRef.current === 'planner' && !document.hidden) {
          sound.playSuccess();
          confetti({
            particleCount: 90,
            spread: 85,
            origin: { y: 0.6 },
            colors: ['#4f46e5', '#0891b2', '#8b5cf6', '#e11d48', '#059669'],
          });
        }
      }
    }, 500); // 500ms per node for slow, elegant assembly
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
    const newX = Math.max(20, Math.min(1700, (e.clientX - canvasRect.left) / zoom - dragOffset.x));
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

  const handleNodeMouseDown = (e: React.MouseEvent, node: WeekNode) => {
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
    source: WeekNode;
    target: WeekNode;
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

  const dayColumns = [
    { label: 'Monday', code: 'Mon', x: 40, width: 270, tag: 'Foundations' },
    { label: 'Tuesday', code: 'Tue', x: 350, width: 280, tag: 'TODAY • Active Sprints' },
    { label: 'Wednesday', code: 'Wed', x: 670, width: 280, tag: 'Mid-Week Defense' },
    { label: 'Thursday', code: 'Thu', x: 990, width: 280, tag: 'VisionOS & Swarm' },
    { label: 'Friday', code: 'Fri', x: 1310, width: 280, tag: 'Capstone Deliverable' },
  ];

  return (
    <div className="vadim-glass-card rounded-3xl border border-slate-200/90 overflow-hidden flex flex-col relative shadow-sm">
      
      {/* Top Controls Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 z-20">
        
        {/* Left: Title & Assembly Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <h3 className="text-xl sm:text-2xl font-instrument italic text-slate-900 tracking-tight font-normal">
              Faculty Weekly Topics & Prerequisite Connected Graph
            </h3>
          </div>

          {/* Staggered Reveal Progress Chip */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-slate-100 border border-slate-200 text-slate-700">
            {isAssembling ? (
              <>
                <RefreshCw className="w-3 h-3 text-indigo-600 animate-spin" />
                <span>Assembling Topic Nodes {revealedCount}/{nodes.length}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Weekly Faculty Syllabus Connected</span>
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold border transition-all btn-tactile cursor-pointer ${
              isAssembling 
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs'
            }`}
            title="Replay slow one-by-one card reveal animation"
          >
            <Play className={`w-3 h-3 ${isAssembling ? 'opacity-50' : 'text-indigo-600'}`} />
            <span>Replay Flow Sequence</span>
          </button>

          {/* Flow Cable Energy Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setFlowActive((prev) => !prev);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold border transition-all btn-tactile cursor-pointer ${
              flowActive 
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-xs' 
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Zap className={`w-3 h-3 ${flowActive ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Energy Flow</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center rounded-xl bg-slate-100 border border-slate-200 p-0.5">
            <button
              onClick={() => {
                sound.playClick(1000);
                setZoom((prev) => Math.min(1.2, prev + 0.1));
              }}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-slate-700 font-medium">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => {
                sound.playClick(900);
                setZoom((prev) => Math.max(0.65, prev - 0.1));
              }}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setZoom(0.95);
                setNodes(INITIAL_WEEK_NODES);
              }}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
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
        className="w-full h-[620px] overflow-auto relative select-none bg-[#F8FAFC] canvas-dot-grid cursor-grab active:cursor-grabbing border-b border-slate-200/90"
      >
        <div 
          className="relative min-w-[1620px] min-h-[600px] transition-transform duration-75 origin-top-left"
          style={{ transform: `scale(${zoom})` }}
        >
          
          {/* Day Columns Backdrop Guides */}
          {dayColumns.map((col) => {
            const isToday = col.code === 'Tue';
            return (
              <div 
                key={col.code}
                className={`absolute top-3 bottom-3 rounded-3xl border pointer-events-none transition-all ${
                  isToday 
                    ? 'border-indigo-400/30 bg-indigo-50/50 text-indigo-900' 
                    : 'border-slate-200/80 bg-slate-100/40 text-slate-800'
                }`}
                style={{
                  left: `${col.x - 10}px`,
                  width: `${col.width + 10}px`,
                }}
              >
                <div className="p-3 border-b border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                      {col.label}
                    </span>
                    {isToday && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                        TODAY
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {col.tag}
                  </span>
                </div>
              </div>
            );
          })}

          {/* SVG Cable Energy Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
            <defs>
              <filter id="week-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
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
                  {/* Subtle Cable Track */}
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
                    filter={conn.active ? 'url(#week-glow)' : undefined}
                  />

                  {/* Port Connection Dots */}
                  <circle cx={x1} cy={y1} r={4} fill={conn.color} className="shadow-md" />
                  <circle cx={x2} cy={y2} r={4} fill={conn.target.color} className="shadow-md" />
                </g>
              );
            })}
          </svg>

          {/* Interactive Nodes Layer */}
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
                    ? 'ring-2 ring-indigo-500/40 shadow-xl border-indigo-500 bg-white vadim-glass-card'
                    : 'border-slate-200/90 hover:border-slate-300 shadow-sm bg-white/95 vadim-glass-card'
                } ${isCurrentlyDragging ? 'scale-105 shadow-2xl cursor-grabbing' : 'cursor-grab'}`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: `${node.width}px`,
                  backdropFilter: 'blur(16px)',
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
                    className="absolute -left-2 top-[60px] w-3.5 h-3.5 rounded-full bg-white border-2 shadow-sm flex items-center justify-center ring-1 ring-slate-200"
                    style={{ borderColor: node.color }}
                    title="Input Connection"
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: node.color }} />
                  </div>
                )}

                {/* Right Output Port Socket */}
                {node.outputs.length > 0 && (
                  <div 
                    className="absolute -right-2 top-[60px] w-3.5 h-3.5 rounded-full bg-white border-2 shadow-sm flex items-center justify-center ring-1 ring-slate-200"
                    style={{ borderColor: node.color }}
                    title="Output Flow Cable"
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: node.color }} />
                  </div>
                )}

                <div className="p-3.5 pl-4 space-y-2">
                  
                  {/* Card Header: Day & Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-600">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{node.timeSlot}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span 
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold"
                        style={{ backgroundColor: `${node.color}20`, color: node.color }}
                      >
                        {node.courseCode}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-mono uppercase font-medium border border-slate-200">
                        {node.type}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 tracking-tight leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {node.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                      {node.subtitle}
                    </p>
                  </div>

                  {/* Metric Chip */}
                  {node.metric && (
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between text-[10px] font-mono text-slate-600">
                      <span className="text-slate-400">{node.metric.label}:</span>
                      <span className="font-bold text-slate-800 truncate max-w-[140px]">{node.metric.value}</span>
                    </div>
                  )}

                  {/* Room & Status */}
                  <div className="pt-1 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1 truncate max-w-[140px]">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{node.room}</span>
                    </span>

                    {node.status === 'completed' && (
                      <span className="flex items-center gap-1 text-emerald-600 font-medium text-[10px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Done
                      </span>
                    )}

                    {node.status === 'in-progress' && (
                      <span className="flex items-center gap-1 text-indigo-600 font-medium text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> Today
                      </span>
                    )}

                    {node.status === 'upcoming' && (
                      <span className="text-slate-400 font-mono text-[9px] uppercase">
                        Prerequisite
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
        <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-white/95 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 z-20">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md flex-shrink-0 border border-slate-200"
              style={{ backgroundColor: selectedNode.color }}
            >
              <Share2 className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                  style={{ backgroundColor: `${selectedNode.color}20`, color: selectedNode.color }}
                >
                  {selectedNode.courseCode}
                </span>
                <span className="text-xs font-mono text-slate-600 font-medium">
                  {selectedNode.day} • {selectedNode.timeSlot}
                </span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs font-mono text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-indigo-500" /> {selectedNode.room}
                </span>
                {selectedNode.instructor && (
                  <>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs font-mono text-slate-600 flex items-center gap-1">
                      <User className="w-3 h-3 text-cyan-600" /> {selectedNode.instructor}
                    </span>
                  </>
                )}
              </div>
              <h4 className="text-xl sm:text-2xl font-instrument italic text-slate-900 mt-1 font-normal">
                {selectedNode.title}
              </h4>
              <p className="text-xs text-slate-500 font-normal">
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
              className="px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-xs transition-all btn-tactile cursor-pointer"
            >
              Validate Prerequisites
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
              className="px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold text-white transition-all btn-tactile cursor-pointer border border-transparent shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${themeConfig.primary}, #8b5cf6)`,
                boxShadow: `0 4px 15px ${themeConfig.glow}`,
              }}
            >
              Export Linked Milestone
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
