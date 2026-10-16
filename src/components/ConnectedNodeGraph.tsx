import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Box, 
  Code2, 
  Activity, 
  Clock, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Play,
  CheckCircle2, 
  Zap,
  Terminal,
  Share2,
  RefreshCw
} from 'lucide-react';

export interface GraphNode {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  type: 'Lecture' | 'Lab' | 'Deep Work' | 'Milestone' | 'Hackathon';
  courseCode: string;
  x: number;
  y: number;
  width: number;
  color: string;
  icon: 'code' | 'box' | 'wave' | 'clock' | 'sparkle' | 'terminal';
  status: 'completed' | 'in-progress' | 'upcoming';
  codeSnippet?: string;
  sliderValue?: number;
  sliderLabel?: string;
  metrics?: { label: string; value: string };
  inputs: string[];  // source node IDs
  outputs: string[]; // target node IDs
}

export const INITIAL_NODES: GraphNode[] = [
  {
    id: 'node-1',
    order: 1,
    title: 'CS 229: Sparse Attention Scaling',
    subtitle: 'Transformer scaling laws & kernel theory',
    type: 'Lecture',
    courseCode: 'CS 229',
    x: 60,
    y: 80,
    width: 250,
    color: '#4f46e5', // Indigo
    icon: 'box',
    status: 'completed',
    metrics: { label: 'Cognitive Load', value: '4.5 hrs • 98% Mastery' },
    inputs: [],
    outputs: ['node-2', 'node-3'],
  },
  {
    id: 'node-3',
    order: 2,
    title: 'NEUR 210: Synaptic Plasticity',
    subtitle: 'Spike-timing dependent plasticity model',
    type: 'Lecture',
    courseCode: 'NEUR 210',
    x: 60,
    y: 340,
    width: 250,
    color: '#0891b2', // Cyan
    icon: 'wave',
    status: 'completed',
    sliderLabel: 'Synaptic Conductance (nS)',
    sliderValue: 74,
    inputs: [],
    outputs: ['node-5'],
  },
  {
    id: 'node-2',
    order: 3,
    title: 'FlashAttention Kernel Optimization',
    subtitle: 'Hopper H100 CUDA memory coalescing',
    type: 'Deep Work',
    courseCode: 'DEEP WORK',
    x: 390,
    y: 50,
    width: 270,
    color: '#8b5cf6', // Violet
    icon: 'code',
    status: 'in-progress',
    codeSnippet: '__global__ void flash_fwd(...) {\n  #pragma unroll\n  for(int i=0; i<BLOCK; ++i)\n    acc += Q[i] * K[i];\n}',
    inputs: ['node-1'],
    outputs: ['node-4'],
  },
  {
    id: 'node-5',
    order: 4,
    title: 'Patch-Clamp Silicon Simulator',
    subtitle: 'Action potential spiking kinetics in Silicon',
    type: 'Lab',
    courseCode: 'NEUR 210',
    x: 390,
    y: 330,
    width: 270,
    color: '#0891b2',
    icon: 'wave',
    status: 'in-progress',
    metrics: { label: 'Resting Potential', value: '-65.4 mV (Calibrated)' },
    inputs: ['node-3'],
    outputs: ['node-6', 'node-7'],
  },
  {
    id: 'node-4',
    order: 5,
    title: 'CUDA Tensor Core Acceleration Lab',
    subtitle: 'Benchmark against cuBLAS v12.4',
    type: 'Lab',
    courseCode: 'CS 229',
    x: 740,
    y: 60,
    width: 260,
    color: '#4f46e5',
    icon: 'terminal',
    status: 'upcoming',
    metrics: { label: 'Gradescope Speedup', value: '3.42x vs naive (Top 1%)' },
    inputs: ['node-2'],
    outputs: ['node-6'],
  },
  {
    id: 'node-7',
    order: 6,
    title: 'Bio-X Fellowship Defense Deck',
    subtitle: 'Mandatory 5-page defense @ Clark S360',
    type: 'Milestone',
    courseCode: 'NEUR 210',
    x: 740,
    y: 340,
    width: 260,
    color: '#d97706', // Amber
    icon: 'clock',
    status: 'upcoming',
    metrics: { label: 'Deadline Horizon', value: 'Friday • 4:00 PM' },
    inputs: ['node-5'],
    outputs: ['node-8'],
  },
  {
    id: 'node-6',
    order: 7,
    title: 'Stanford TreeHacks: Spatial AI Track',
    subtitle: 'Neural-Symbolic VisionOS coprocessor',
    type: 'Hackathon',
    courseCode: 'TREEHACKS',
    x: 1090,
    y: 160,
    width: 270,
    color: '#ec4899', // Pink
    icon: 'sparkle',
    status: 'in-progress',
    metrics: { label: 'Prize Track', value: '₹4,00,000+ Finalist Sandbox' },
    inputs: ['node-4', 'node-5'],
    outputs: ['node-8'],
  },
  {
    id: 'node-8',
    order: 8,
    title: 'Senior Honors Capstone Convergence',
    subtitle: 'Stanford AI & Neuroscience Dual Degree Thesis',
    type: 'Milestone',
    courseCode: 'HONORS',
    x: 1440,
    y: 220,
    width: 280,
    color: '#059669', // Emerald
    icon: 'box',
    status: 'upcoming',
    metrics: { label: 'Graduation XP', value: '4,000 / 4,000 XP (Mastery)' },
    inputs: ['node-6', 'node-7'],
    outputs: [],
  },
];

export const ConnectedNodeGraph: React.FC = () => {
  const { themeConfig, setActiveTab, activeTab } = useTheme();

  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-2');
  const [zoom, setZoom] = useState<number>(1);
  const [flowSpeed, setFlowSpeed] = useState<boolean>(true);
  
  // Staged sequential reveal state: shows cards one-by-one slowly!
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
      setRevealedCount(INITIAL_NODES.length);
    }
  };

  // Synchronize activeTabRef and immediately cancel if user switches away from planner
  useEffect(() => {
    activeTabRef.current = activeTab;
    if (activeTab !== 'planner') {
      stopAssembly(true);
    }
  }, [activeTab]);

  // Start sequential one-by-one animation
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

      if (step >= INITIAL_NODES.length) {
        stopAssembly(false);
        if (isMountedRef.current && activeTabRef.current === 'planner' && !document.hidden) {
          sound.playSuccess();
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#4f46e5', '#0891b2', '#ec4899', '#059669'],
          });
        }
      }
    }, 600);
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

  // Mouse move handler for dragging nodes
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.min(1800, (e.clientX - canvasRect.left) / zoom - dragOffset.x));
    const newY = Math.max(20, Math.min(800, (e.clientY - canvasRect.top) / zoom - dragOffset.y));

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

  const handleNodeMouseDown = (e: React.MouseEvent, node: GraphNode) => {
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

  // Build connections list: source node -> target node
  const connections: Array<{
    id: string;
    source: GraphNode;
    target: GraphNode;
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
        
        // A cable is visible only when BOTH its source and target nodes have been revealed!
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

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[1];
  const isFullyAssembled = revealedCount >= nodes.length;

  return (
    <div className="space-y-4">
      
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl vadim-glass-card border border-slate-200/90 shadow-xs">
        
        {/* Assembly Progression Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isAssembling ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-800">
              {isAssembling ? 'Constructing Curriculum Pipeline...' : '✦ Semester Curriculum Subjects & Topics Assembled'}
            </span>
          </div>

          {/* Sequential Step Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-mono font-medium text-slate-700 border border-slate-200">
            <span>{Math.min(nodes.length, revealedCount)} / {nodes.length} Subject Topics</span>
            {isFullyAssembled && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />}
          </div>

          {/* Progress bar line */}
          <div className="w-24 sm:w-32 h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${(revealedCount / nodes.length) * 100}%` }}
            />
          </div>
        </div>

        {/* View Zoom, Flow & Replay Controls */}
        <div className="flex items-center gap-2">
          
          {/* Replay Sequence Button */}
          <button
            onClick={startAssemblySequence}
            disabled={isAssembling}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold border transition-all btn-tactile cursor-pointer ${
              isAssembling
                ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-50'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 shadow-xs'
            }`}
            title="Replay the slow sequential graph assembly animation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAssembling ? 'animate-spin text-amber-600' : 'text-amber-600'}`} />
            <span>{isAssembling ? 'Assembling...' : 'Replay Flow Sequence'}</span>
          </button>

          {/* Animated Flow Toggle */}
          <button
            onClick={() => {
              sound.playPop();
              setFlowSpeed((prev) => !prev);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold border transition-all btn-tactile cursor-pointer ${
              flowSpeed
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
            title="Toggle Flow Cable Energy Animation"
          >
            <Zap className={`w-3.5 h-3.5 ${flowSpeed ? 'text-amber-500 animate-pulse' : ''}`} />
            <span className="hidden sm:inline">{flowSpeed ? 'PULSE: ON' : 'PULSE: OFF'}</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => {
                sound.playClick();
                setZoom((z) => Math.max(0.65, z - 0.1));
              }}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all btn-tactile"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs font-mono font-medium text-slate-700 tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => {
                sound.playClick();
                setZoom((z) => Math.min(1.3, z + 0.1));
              }}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all btn-tactile"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setZoom(1);
              }}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all btn-tactile"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Main Node Graph Canvas Workspace */}
      <div 
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative w-full h-[580px] rounded-3xl canvas-dot-grid border border-slate-200/90 overflow-hidden select-none cursor-grab active:cursor-grabbing bg-[#F8FAFC]"
      >
        {/* Zoomable Container */}
        <div 
          className="absolute inset-0 transition-transform duration-75 origin-top-left"
          style={{
            transform: `scale(${zoom})`,
            width: '1850px',
            height: '750px',
          }}
        >
          {/* SVG Connecting Wires Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
            <defs>
              {connections.map((conn) => (
                <linearGradient
                  key={`grad-${conn.id}`}
                  id={`grad-${conn.id}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor={conn.source.color} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={conn.target.color} stopOpacity={0.9} />
                </linearGradient>
              ))}
            </defs>

            {connections.map((conn) => {
              if (!conn.visible) return null;

              const startX = conn.source.x + conn.source.width;
              const startY = conn.source.y + 36;
              const endX = conn.target.x;
              const endY = conn.target.y + 36;

              const deltaX = Math.max(60, (endX - startX) * 0.5);
              const pathData = `M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`;
              const isHighlighted = conn.active;

              return (
                <g key={conn.id} className="transition-opacity duration-700 opacity-100 animate-in fade-in">
                  {/* Background Glow Shadow Line */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={conn.source.color}
                    strokeWidth={isHighlighted ? 6 : 4}
                    strokeOpacity={isHighlighted ? 0.35 : 0.15}
                    strokeLinecap="round"
                  />

                  {/* Main Bezier Cable */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={`url(#grad-${conn.id})`}
                    strokeWidth={isHighlighted ? 2.5 : 2}
                    strokeLinecap="round"
                    className={flowSpeed ? 'animate-cable-flow' : ''}
                  />

                  {/* Traveling Pulse Particle along wire */}
                  {flowSpeed && (
                    <circle r={isHighlighted ? 4 : 3} fill="#ffffff" stroke={conn.source.color} strokeWidth={2}>
                      <animateMotion
                        path={pathData}
                        dur={isHighlighted ? '1.8s' : '2.6s'}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Node Cards: Animate Slowly & Show One by One! */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isRevealed = node.order <= revealedCount;

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: `${node.width}px`,
                  opacity: isRevealed ? 1 : 0,
                  transform: isRevealed 
                    ? 'translateY(0) scale(1)' 
                    : 'translateY(28px) scale(0.85)',
                  pointerEvents: isRevealed ? 'auto' : 'none',
                  transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className={`absolute z-20 rounded-2xl vadim-glass-card border cursor-pointer select-none group ${
                  isSelected
                    ? 'border-indigo-500 shadow-[0_12px_36px_-6px_rgba(79,70,229,0.25)] ring-1 ring-indigo-500/40'
                    : 'border-slate-200/90 shadow-sm hover:border-slate-300'
                }`}
              >
                {/* Left Input Port */}
                {node.inputs.length > 0 && (
                  <div
                    className="absolute -left-[7px] top-8 w-3.5 h-3.5 rounded-full border-2 border-white ring-1 ring-slate-300 shadow-xs transition-transform group-hover:scale-125"
                    style={{ backgroundColor: node.color }}
                    title={`Input: ${node.inputs.length} dependencies`}
                  />
                )}

                {/* Right Output Port */}
                {node.outputs.length > 0 && (
                  <div
                    className="absolute -right-[7px] top-8 w-3.5 h-3.5 rounded-full border-2 border-white ring-1 ring-slate-300 shadow-xs transition-transform group-hover:scale-125"
                    style={{ backgroundColor: node.color }}
                    title={`Output: connects to ${node.outputs.length} next nodes`}
                  />
                )}

                {/* Node Card Header */}
                <div 
                  className="p-3 border-b border-slate-200/80 flex items-center justify-between rounded-t-2xl"
                  style={{
                    borderTop: `3px solid ${node.color}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="p-1 rounded-lg"
                      style={{ backgroundColor: `${node.color}15`, color: node.color }}
                    >
                      {node.icon === 'code' && <Code2 className="w-3.5 h-3.5" />}
                      {node.icon === 'box' && <Box className="w-3.5 h-3.5" />}
                      {node.icon === 'wave' && <Activity className="w-3.5 h-3.5" />}
                      {node.icon === 'clock' && <Clock className="w-3.5 h-3.5" />}
                      {node.icon === 'sparkle' && <Sparkles className="w-3.5 h-3.5" />}
                      {node.icon === 'terminal' && <Terminal className="w-3.5 h-3.5" />}
                    </div>

                    <span 
                      className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full"
                      style={{ backgroundColor: `${node.color}15`, color: node.color }}
                    >
                      {node.courseCode}
                    </span>
                  </div>

                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                    {node.type}
                  </span>
                </div>

                {/* Node Card Body */}
                <div className="p-3.5 space-y-2.5">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {node.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5 font-normal">
                      {node.subtitle}
                    </p>
                  </div>

                  {/* Code Block Content inside Node */}
                  {node.codeSnippet && (
                    <div className="p-2 rounded-xl bg-slate-900 text-[10px] font-mono text-cyan-300 leading-relaxed overflow-x-hidden border border-slate-800 shadow-inner">
                      <pre className="whitespace-pre">{node.codeSnippet}</pre>
                    </div>
                  )}

                  {/* Slider Content inside Node */}
                  {node.sliderLabel && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-600">
                        <span>{node.sliderLabel}</span>
                        <span className="font-bold text-slate-900 font-mono">{node.sliderValue}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={node.sliderValue}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setNodes((prev) =>
                            prev.map((n) => (n.id === node.id ? { ...n, sliderValue: val } : n))
                          );
                        }}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  )}

                  {/* Metrics Badge */}
                  {node.metrics && (
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-500">{node.metrics.label}</span>
                      <span className="font-bold text-slate-900 truncate max-w-[130px]">{node.metrics.value}</span>
                    </div>
                  )}

                  {/* Footer status pill */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[10px] font-mono">
                    <span className="text-slate-500">Step {node.order} / 8</span>
                    <span className={`font-semibold flex items-center gap-1 ${
                      node.status === 'completed'
                        ? 'text-emerald-700'
                        : node.status === 'in-progress'
                        ? 'text-amber-800'
                        : 'text-slate-400'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {node.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Mini-Map */}
        <div className="absolute bottom-4 right-4 z-30 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl pointer-events-none w-44 h-28 hidden sm:flex flex-col justify-between">
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 font-semibold uppercase tracking-wider">
            <span>Workflow Radar</span>
            <span className="text-indigo-600 font-bold">{revealedCount}/8 ACTIVE</span>
          </div>

          {/* Mini preview canvas */}
          <div className="relative w-full h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
            {nodes.map((n) => {
              const isRevealed = n.order <= revealedCount;
              return (
                <div
                  key={`mini-${n.id}`}
                  style={{
                    left: `${(n.x / 1800) * 100}%`,
                    top: `${(n.y / 700) * 100}%`,
                    backgroundColor: n.color,
                    opacity: isRevealed ? 1 : 0.1,
                  }}
                  className={`absolute w-3 h-2 rounded-xs shadow-xs transition-opacity duration-500 ${
                    selectedNodeId === n.id ? 'ring-2 ring-indigo-500 scale-125' : ''
                  }`}
                />
              );
            })}
          </div>

          <div className="text-[8px] font-mono text-slate-500 text-center font-medium">
            {isFullyAssembled ? '✦ Graph Synchronized' : 'Assembling Nodes...'}
          </div>
        </div>

        {/* Bottom Left Canvas Instruction */}
        <div className="absolute bottom-4 left-4 z-30 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xs text-[11px] font-mono text-slate-600 flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${isFullyAssembled ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
          <span>{isFullyAssembled ? 'All 8 nodes connected • Drag cards to reroute' : 'Assembling pipeline flow...'}</span>
        </div>

      </div>

      {/* Selected Node Deep Inspector Panel */}
      {selectedNode && isFullyAssembled && (
        <div className="vadim-glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-300 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span 
                className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold"
                style={{ backgroundColor: `${selectedNode.color}15`, color: selectedNode.color }}
              >
                {selectedNode.courseCode}
              </span>
              <span className="text-xs font-mono text-slate-500 uppercase">
                {selectedNode.type}
              </span>
              <span className="text-xs font-mono text-slate-300">•</span>
              <span className="text-xs font-mono text-emerald-700 font-bold uppercase">
                {selectedNode.status}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-instrument italic text-slate-900 mt-1 font-normal">{selectedNode.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Connected upstream to {selectedNode.inputs.length} prerequisites, driving {selectedNode.outputs.length} dependent milestones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playSuccess();
                confetti({ particleCount: 40, spread: 50 });
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors btn-tactile cursor-pointer"
            >
              Mark Node Output Validated
            </button>

            <button
              onClick={() => {
                sound.playSuccess();
                confetti({
                  particleCount: 60,
                  spread: 70,
                  origin: { y: 0.7 },
                  colors: [themeConfig.primary, '#10b981', '#06b6d4'],
                });
                setNodes((prev) =>
                  prev.map((n) =>
                    n.id === selectedNode.id ? { ...n, status: 'completed' as const } : n
                  )
                );
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold text-white transition-all btn-tactile cursor-pointer border border-white/15"
              style={{
                background: `linear-gradient(135deg, ${themeConfig.primary}, #06b6d4)`,
                boxShadow: `0 4px 15px ${themeConfig.glow}`,
              }}
            >
              Execute & Validate Node Flow
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
