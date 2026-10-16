import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Sun, 
  Volume2, 
  VolumeX, 
  Activity, 
  Layers, 
  RotateCw, 
  Zap, 
  Box, 
  ArrowUpRight, 
  X, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Calendar, 
  Sliders,
  ChevronRight,
  Maximize2
} from 'lucide-react';

export type Vadim3DModel = 'quantum-knot' | 'tesseract-crystal' | 'neural-dyson' | 'silicon-monolith';

interface NoticeItem {
  id: string;
  category: string;
  title: string;
  source: string;
  time: string;
  priority: 'CRITICAL' | 'HIGH' | 'INFO';
  summary: string;
  action: string;
}

const NOTICES: NoticeItem[] = [
  {
    id: 'n1',
    category: 'DEAN OF ACADEMICS',
    title: 'CS 231N: Final Project Presentations & Poster Session',
    source: 'Stanford AI Lab • Gates Hall',
    time: '12m ago',
    priority: 'CRITICAL',
    summary: 'Submissions for the deep learning visual recognition capstone are due Friday at 23:59 PST. Live demonstration scheduled at Packard Auditorium.',
    action: 'Add to Schedule Block',
  },
  {
    id: 'n2',
    category: 'QUANTUM INITIATIVE',
    title: 'Superconducting Qubit Architecture Symposium',
    source: 'Ginzton Laboratory',
    time: '45m ago',
    priority: 'HIGH',
    summary: 'Keynote by Prof. Vuckovic on topological error mitigation and microwave resonators. Limited seats for undergraduate fellows.',
    action: 'RSVP Stanford Pass',
  },
  {
    id: 'n3',
    category: 'CAMPUS TELEMETRY',
    title: 'Green Library Rotunda Night Study Extension',
    source: 'Stanford University Libraries',
    time: '2h ago',
    priority: 'INFO',
    summary: '24-hour access granted for mid-quarter synthesis. High-speed fiber nodes and silent study carrels available.',
    action: 'Check Live Seats',
  },
];

export const VadimCarazanExperience: React.FC = () => {
  const { toggleExperienceMode, soundEnabled, setSoundEnabled } = useTheme();

  // 3D Canvas Refs
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const starsGroupRef = useRef<THREE.Points | null>(null);

  // Sub-element references for multi-axis animation
  const midMeshRef = useRef<THREE.Object3D | null>(null);
  const innerCoreRef = useRef<THREE.Object3D | null>(null);
  const gimbalRef = useRef<THREE.Object3D | null>(null);

  // Interaction State
  const [activeModel, setActiveModel] = useState<Vadim3DModel>('quantum-knot');
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.007);
  const [fps, setFps] = useState<number>(60);
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(NOTICES[0]);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Mouse Parallax target & current
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Live Stanford PST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/Los_Angeles',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mouse Parallax Listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current.targetX = (e.clientX / innerWidth - 0.5) * 1.5;
      mouseRef.current.targetY = (e.clientY / innerHeight - 0.5) * 1.5;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Keyboard shortcut ESC to close inspector
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setInspectorOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 1. Initialize Three.js Scene
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const width = canvasContainerRef.current.clientWidth;
    const height = canvasContainerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    canvasContainerRef.current.replaceChildren(renderer.domElement);

    // Studio Obsidian Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Key Light: Crisp Titanium White
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    // Rim Light: Deep Electric Indigo
    const rimLight1 = new THREE.PointLight(0x6366f1, 4.5, 40);
    rimLight1.position.set(-8, -4, 5);
    scene.add(rimLight1);

    // Rim Light: Warm Solar Gold
    const rimLight2 = new THREE.PointLight(0xf59e0b, 3.8, 40);
    rimLight2.position.set(8, -6, -4);
    scene.add(rimLight2);

    // Model Container
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Ambient Starfield Dust
    const starCount = 650;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 26;
      starPositions[i + 1] = (Math.random() - 0.5) * 26;
      starPositions[i + 2] = (Math.random() - 0.5) * 26;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.045,
      transparent: true,
      opacity: 0.4,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);
    starsGroupRef.current = starPoints;

    // Handle Resize
    const handleResize = () => {
      if (!canvasContainerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = canvasContainerRef.current.clientWidth;
      const h = canvasContainerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render Loop with Eased Mouse Parallax & Counter-Rotation
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      const time = now * 0.001;

      // Smooth Mouse Parallax Easing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      if (cameraRef.current) {
        cameraRef.current.position.x = mouseRef.current.x * 0.8;
        cameraRef.current.position.y = -mouseRef.current.y * 0.8;
        cameraRef.current.lookAt(0, 0, 0);
      }

      // Sculptures rotation
      if (autoRotate && modelGroupRef.current) {
        modelGroupRef.current.rotation.y += rotationSpeed * 0.7;

        if (midMeshRef.current) {
          midMeshRef.current.rotation.y += rotationSpeed;
          midMeshRef.current.rotation.x += rotationSpeed * 0.35;
        }

        if (innerCoreRef.current) {
          innerCoreRef.current.rotation.y -= rotationSpeed * 1.5;
          innerCoreRef.current.rotation.z += rotationSpeed * 0.6;
          const s = 1 + Math.sin(time * 3.5) * 0.06;
          innerCoreRef.current.scale.set(s, s, s);
        }

        if (gimbalRef.current) {
          gimbalRef.current.rotation.z -= rotationSpeed * 0.8;
          gimbalRef.current.rotation.x += rotationSpeed * 0.45;
        }
      }

      if (starsGroupRef.current) {
        starsGroupRef.current.rotation.y -= 0.0006;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  // 2. Build Selected 3D Model
  useEffect(() => {
    if (!modelGroupRef.current) return;

    while (modelGroupRef.current.children.length > 0) {
      const obj = modelGroupRef.current.children[0];
      modelGroupRef.current.remove(obj);
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
    }

    midMeshRef.current = null;
    innerCoreRef.current = null;
    gimbalRef.current = null;

    const indigo = new THREE.Color(0x6366f1);
    const cyan = new THREE.Color(0x06b6d4);
    const gold = new THREE.Color(0xf59e0b);
    const platinum = new THREE.Color(0xf1f5f9);

    if (activeModel === 'quantum-knot') {
      // Model 1: Celtic 5-Fold Torus Knot with Inner Gyroscope Gimbal
      const knotContainer = new THREE.Group();
      modelGroupRef.current.add(knotContainer);
      midMeshRef.current = knotContainer;

      const knotGeo = new THREE.TorusKnotGeometry(1.4, 0.4, 260, 36, 2, 5);
      const knotMat = new THREE.MeshPhysicalMaterial({
        color: 0x1e1b4b,
        roughness: 0.12,
        metalness: 0.95,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        wireframe: wireframe,
        emissive: 0x312e81,
        emissiveIntensity: 0.35,
      });
      const knotMesh = new THREE.Mesh(knotGeo, knotMat);
      knotContainer.add(knotMesh);

      // Neon Cyan Outer Wireframe Accents
      const wireGeo = new THREE.TorusKnotGeometry(1.415, 0.405, 140, 18, 2, 5);
      const wireMat = new THREE.MeshBasicMaterial({
        color: cyan,
        wireframe: true,
        transparent: true,
        opacity: 0.65,
      });
      const wireMesh = new THREE.Mesh(wireGeo, wireMat);
      knotContainer.add(wireMesh);

      // Pulsing Stellar Core
      const coreGroup = new THREE.Group();
      modelGroupRef.current.add(coreGroup);
      innerCoreRef.current = coreGroup;

      const coreGeo = new THREE.DodecahedronGeometry(0.7, 1);
      const coreMat = new THREE.MeshStandardMaterial({
        color: gold,
        roughness: 0.15,
        metalness: 0.85,
        emissive: gold,
        emissiveIntensity: 0.95,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      coreGroup.add(core);

      const coreLight = new THREE.PointLight(gold, 3.0, 8);
      coreGroup.add(coreLight);

      // Gyroscope Gimbal Rings
      const gimbalGroup = new THREE.Group();
      modelGroupRef.current.add(gimbalGroup);
      gimbalRef.current = gimbalGroup;

      const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(2.4, 0.035, 16, 120),
        new THREE.MeshStandardMaterial({ color: cyan, metalness: 0.9, roughness: 0.15, emissive: cyan, emissiveIntensity: 0.3 })
      );
      ring1.rotation.x = Math.PI / 2.5;
      gimbalGroup.add(ring1);

      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(2.75, 0.03, 16, 120),
        new THREE.MeshStandardMaterial({ color: indigo, metalness: 0.9, roughness: 0.15, emissive: indigo, emissiveIntensity: 0.3 })
      );
      ring2.rotation.y = Math.PI / 3;
      gimbalGroup.add(ring2);

    } else if (activeModel === 'tesseract-crystal') {
      // Model 2: Hyper-Tesseract 4D Crystal
      const tesseractGroup = new THREE.Group();
      modelGroupRef.current.add(tesseractGroup);
      midMeshRef.current = tesseractGroup;

      const outerGeo = new THREE.IcosahedronGeometry(1.85, 0);
      const outerMat = new THREE.MeshPhysicalMaterial({
        color: platinum,
        metalness: 0.2,
        roughness: 0.05,
        transmission: 0.92,
        ior: 1.65,
        thickness: 1.2,
        wireframe: wireframe,
        transparent: true,
        opacity: 0.88,
      });
      const outerCrystal = new THREE.Mesh(outerGeo, outerMat);
      tesseractGroup.add(outerCrystal);

      const cageMat = new THREE.MeshBasicMaterial({ color: indigo, wireframe: true, transparent: true, opacity: 0.75 });
      tesseractGroup.add(new THREE.Mesh(outerGeo, cageMat));

      const innerGroup = new THREE.Group();
      modelGroupRef.current.add(innerGroup);
      innerCoreRef.current = innerGroup;

      const innerGeo = new THREE.OctahedronGeometry(1.05, 0);
      const innerMat = new THREE.MeshPhysicalMaterial({
        color: cyan,
        roughness: 0.1,
        metalness: 0.9,
        emissive: cyan,
        emissiveIntensity: 0.8,
      });
      innerGroup.add(new THREE.Mesh(innerGeo, innerMat));

    } else if (activeModel === 'neural-dyson') {
      // Model 3: Neural Dyson Sphere Core
      const dysonGroup = new THREE.Group();
      modelGroupRef.current.add(dysonGroup);
      midMeshRef.current = dysonGroup;

      const coreGeo = new THREE.SphereGeometry(1.1, 48, 48);
      const coreMat = new THREE.MeshStandardMaterial({
        color: gold,
        roughness: 0.1,
        metalness: 0.95,
        emissive: 0xd97706,
        emissiveIntensity: 0.85,
        wireframe: wireframe,
      });
      dysonGroup.add(new THREE.Mesh(coreGeo, coreMat));

      const ringGroup = new THREE.Group();
      modelGroupRef.current.add(ringGroup);
      gimbalRef.current = ringGroup;

      for (let r = 0; r < 3; r++) {
        const ringGeo = new THREE.TorusGeometry(1.8 + r * 0.45, 0.04, 16, 120);
        const ringMat = new THREE.MeshStandardMaterial({
          color: r === 0 ? indigo : r === 1 ? cyan : gold,
          metalness: 0.92,
          roughness: 0.1,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.set((r * Math.PI) / 3, (r * Math.PI) / 4, 0);
        ringGroup.add(ringMesh);
      }

    } else if (activeModel === 'silicon-monolith') {
      // Model 4: Mirrored Dark-Matter Monolith
      const monolithGroup = new THREE.Group();
      modelGroupRef.current.add(monolithGroup);
      midMeshRef.current = monolithGroup;

      const boxGeo = new THREE.BoxGeometry(1.2, 3.4, 0.45);
      const boxMat = new THREE.MeshPhysicalMaterial({
        color: 0x050508,
        metalness: 0.98,
        roughness: 0.05,
        clearcoat: 1.0,
        wireframe: wireframe,
        emissive: 0x111827,
        emissiveIntensity: 0.4,
      });
      monolithGroup.add(new THREE.Mesh(boxGeo, boxMat));

      const haloGeo = new THREE.TorusGeometry(2.1, 0.03, 16, 100);
      const haloMat = new THREE.MeshBasicMaterial({ color: cyan });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = Math.PI / 2.2;
      monolithGroup.add(halo);
    }
  }, [activeModel, wireframe]);

  const modelMeta = {
    'quantum-knot': {
      title: 'QUANTUM CYBER-KNOT',
      subtitle: 'Celtic 5-Fold Torus with Gyroscopic Gimbal',
      vertices: '18,480 Polygons',
      renderTime: '0.42 ms',
      physics: 'Lorentz Magnetic Drift',
    },
    'tesseract-crystal': {
      title: 'HYPER-TESSERACT CRYSTAL',
      subtitle: '4D Dual-Nested Icosahedron with Dispersion',
      vertices: '12,240 Polygons',
      renderTime: '0.38 ms',
      physics: 'Non-Euclidean Refraction',
    },
    'neural-dyson': {
      title: 'NEURAL DYSON CORE',
      subtitle: 'Triple Geodesic Shells Encasing Stellar Core',
      vertices: '22,600 Polygons',
      renderTime: '0.51 ms',
      physics: 'Stellar Fusion Confinement',
    },
    'silicon-monolith': {
      title: 'SILICON OBSIDIAN MONOLITH',
      subtitle: 'Dark-Matter Obelisk with Quantum Orbital Rings',
      vertices: '9,840 Polygons',
      renderTime: '0.31 ms',
      physics: 'Zero-Point Reflection',
    },
  }[activeModel];

  return (
    <div className="relative min-h-screen bg-[#0a0a0b] text-[#f2f2f2] font-inter-tight selection:bg-amber-400/30 selection:text-amber-200 overflow-x-hidden flex flex-col justify-between">
      
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-indigo-900/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[350px] bg-cyan-900/10 rounded-full blur-[120px]" />
        {/* Subtle Hairline Grid */}
        <div 
          className="absolute inset-0 opacity-[0.035]" 
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      {/* =========================================================================
          TOP GALLERY CARD BAR (Vadim Carazan's Trademark 5-Column Grid)
          ========================================================================= */}
      <header className="relative z-30 w-full border-b border-white/[0.08] bg-[#0a0a0b]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center text-xs">
            
            {/* Col 1: Monogram & Identity */}
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <div className="font-mono tracking-wider font-semibold text-white/90">
                UNIFLOW <span className="text-white/40 font-normal">/ 2026</span>
              </div>
            </div>

            {/* Col 2: Currently Role */}
            <div className="hidden md:block">
              <span className="text-white/40 font-mono uppercase text-[10px] block">Currently</span>
              <span className="text-white/80 font-medium truncate block">Stanford Academic OS</span>
            </div>

            {/* Col 3: Based in & Live Clock */}
            <div className="hidden md:block">
              <span className="text-white/40 font-mono uppercase text-[10px] block">Based in</span>
              <span className="text-white/80 font-mono tabular-nums font-medium">
                Stanford, CA • {currentTime || '12:00:00'} PST
              </span>
            </div>

            {/* Col 4: Quick Anchor Nav */}
            <div className="hidden lg:flex items-center gap-3 font-mono text-[11px] text-white/60">
              <a href="#deck-section" className="hover:text-white transition-colors">01. DECK</a>
              <span className="text-white/20">/</span>
              <a href="#studio-section" className="hover:text-white transition-colors">02. 3D</a>
              <span className="text-white/20">/</span>
              <a href="#notices-section" className="hover:text-white transition-colors">03. SYNTH</a>
            </div>

            {/* Col 5: Actions & Switch to Light Mode Button */}
            <div className="flex items-center justify-end gap-2.5 col-span-1">
              
              {/* Sound Toggle */}
              <button
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  sound.enabled = next;
                  if (next) sound.playClick(1100);
                }}
                className="p-1.5 rounded-full border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-all cursor-pointer"
                title={soundEnabled ? 'Mute Audio FX' : 'Enable Audio FX'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-white/40" />}
              </button>

              {/* Inspector Slide Toggle */}
              <button
                onClick={() => {
                  sound.playPop();
                  setInspectorOpen((prev) => !prev);
                }}
                className="px-2.5 py-1 rounded-full border border-white/10 hover:border-white/30 text-white/70 hover:text-white font-mono text-[10px] tracking-wide transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Layers className="w-3 h-3 text-cyan-400" />
                <span className="hidden sm:inline">INSPECTOR</span>
              </button>

              {/* The Golden Light OS Switcher Pill */}
              <button
                onClick={() => {
                  sound.playCelebration();
                  toggleExperienceMode();
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-semibold bg-white text-black hover:bg-slate-200 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-105 btn-tactile"
                title="Switch back to Clean Light OS"
              >
                <Sun className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>LIGHT OS</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* =========================================================================
          HERO & FULL-BLEED 3D WEBGL SCENE
          ========================================================================= */}
      <section className="relative min-h-[82vh] flex flex-col justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-8 sm:pt-14 pb-8 z-10">
        
        {/* Full-screen 3D Canvas Centered */}
        <div 
          ref={canvasContainerRef} 
          className="absolute inset-0 pointer-events-auto cursor-grab active:cursor-grabbing z-0"
          title="Drag to orbit • Mouse parallax active"
        />

        {/* Top Editorial Narrative & Nudge CTA */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pointer-events-none">
          
          {/* Narrative lead statement */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md mb-4 text-[10px] font-mono text-white/60 tracking-widest uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Stanford Autonomous Academic Environment</span>
            </div>
            
            <h1 className="font-instrument italic text-3xl sm:text-5xl lg:text-6xl text-white/95 font-normal leading-[1.08] tracking-tight">
              A high-precision operating canvas for scholars shaping tomorrow's frontiers.
            </h1>

            <p className="mt-4 text-xs sm:text-sm text-white/55 font-inter-tight max-w-xl leading-relaxed">
              Synthesizing real-time Stanford faculty circulars, spatial computational models, and dynamic cognitive schedules into a singular dark glass obsidian realm.
            </p>
          </div>

          {/* Right Floating Quick Telemetry Badge */}
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end pointer-events-auto">
            <div className="vadim-glass-card rounded-2xl p-4 w-full max-w-xs border border-white/[0.09]">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="font-mono text-[10px] uppercase text-white/50 tracking-wider">3D ENGINE</span>
                </div>
                <span className="font-mono text-[10px] text-cyan-300 font-bold tabular-nums">{fps} FPS</span>
              </div>
              <div className="mt-3 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between text-white/70">
                  <span className="text-white/40">Active Artifact:</span>
                  <span className="text-white font-semibold">{modelMeta.title.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span className="text-white/40">Mesh Geometry:</span>
                  <span>{modelMeta.vertices}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span className="text-white/40">Frametime:</span>
                  <span className="text-emerald-400 font-semibold">{modelMeta.renderTime}</span>
                </div>
              </div>
              
              {/* Button to inspect in glass box */}
              <button
                onClick={() => {
                  sound.playClick(1200);
                  setInspectorOpen(true);
                }}
                className="mt-3.5 w-full py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-mono text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Examine Mesh Specs</span>
                <ArrowUpRight className="w-3 h-3 text-cyan-400" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Giant Margin-to-Margin Typography: UNIFLOW */}
        <div className="relative z-10 pt-16 sm:pt-24 pointer-events-none select-none">
          <div className="flex items-end justify-between border-t border-white/[0.08] pt-4">
            
            <div className="font-instrument text-[18vw] leading-[0.76] tracking-[-0.035em] text-[#f2f2f2] font-normal">
              UNIFLOW
            </div>

            <div className="hidden sm:flex flex-col items-end pb-3 pointer-events-auto">
              <a 
                href="#bento-section"
                onClick={() => sound.playClick(900)}
                className="w-12 h-12 rounded-full border border-white/20 hover:border-white/60 bg-white/[0.03] backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white transition-all hover:scale-110 cursor-pointer"
                title="Scroll down to Bento Modules"
              >
                <ChevronRight className="w-5 h-5 rotate-90" />
              </a>
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/40 mt-2">
                Explore Modules
              </span>
            </div>

          </div>
        </div>

      </section>

      {/* =========================================================================
          BENTO GRID ARCHITECTURE (Vadim Carazan Luxury Dark Bento Layout)
          ========================================================================= */}
      <section id="bento-section" className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.08]">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 block mb-1">
              Curated Capabilities
            </span>
            <h2 className="font-instrument italic text-3xl sm:text-4xl text-white font-normal">
              Unified Campus Architecture
            </h2>
          </div>
          <p className="text-xs text-white/50 font-inter-tight max-w-md">
            Engineered with deep obsidian glass, micro-friction haptics, and instant neural synthesis.
          </p>
        </div>

        {/* Bento Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Bento Card 1: 3D Studio Artifact Switcher */}
          <div id="studio-section" className="vadim-glass-card rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="vadim-badge">3D ARTIFACT ENGINE</span>
                <span className="text-[10px] font-mono text-cyan-400">WEBGL 2.0</span>
              </div>
              <h3 className="font-instrument italic text-2xl text-white font-normal mb-2">
                Spatial Sculptures
              </h3>
              <p className="text-xs text-white/60 leading-relaxed mb-4">
                Switch between 4 ultra-pro mathematical geometries rendered in real-time with metallic PBR reflections.
              </p>

              {/* 4 Model Switcher Tabs */}
              <div className="space-y-2">
                {[
                  { id: 'quantum-knot', label: 'Quantum Knot', tag: 'Torus 5-Fold' },
                  { id: 'tesseract-crystal', label: 'Tesseract 4D', tag: 'Icosahedron' },
                  { id: 'neural-dyson', label: 'Dyson Sphere', tag: 'Geodesic Core' },
                  { id: 'silicon-monolith', label: 'Dark Monolith', tag: 'Obelisk' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      sound.playPop();
                      setActiveModel(item.id as Vadim3DModel);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      activeModel === item.id
                        ? 'bg-white text-black font-semibold shadow-lg'
                        : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.09] hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`text-[10px] ${activeModel === item.id ? 'text-black/60' : 'text-white/40'}`}>
                      {item.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Wireframe & Auto-rotate Toggles */}
            <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
              <button
                onClick={() => {
                  sound.playClick(1000);
                  setWireframe((prev) => !prev);
                }}
                className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
                  wireframe ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'text-white/50 border-white/10'
                }`}
              >
                Wireframe: {wireframe ? 'ON' : 'OFF'}
              </button>

              <button
                onClick={() => {
                  sound.playClick(1000);
                  setAutoRotate((prev) => !prev);
                }}
                className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
                  autoRotate ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50' : 'text-white/50 border-white/10'
                }`}
              >
                Spin: {autoRotate ? 'AUTO' : 'PAUSED'}
              </button>
            </div>
          </div>

          {/* Bento Card 2: AI Notice Studio */}
          <div id="notices-section" className="vadim-glass-card rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="vadim-badge">NEURAL SYNTHESIS</span>
                <span className="text-[10px] font-mono text-amber-400">3 UNREAD</span>
              </div>
              <h3 className="font-instrument italic text-2xl text-white font-normal mb-2">
                Notice Synthesizer
              </h3>
              <p className="text-xs text-white/60 leading-relaxed mb-4">
                Official circulars condensed by neural models into bulleted action plans.
              </p>

              {/* Notice List */}
              <div className="space-y-2.5">
                {NOTICES.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      sound.playClick(1150);
                      setSelectedNotice(n);
                      setInspectorOpen(true);
                    }}
                    className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="text-amber-400 font-semibold">{n.category}</span>
                      <span className="text-white/40">{n.time}</span>
                    </div>
                    <div className="text-xs text-white/90 font-medium group-hover:text-amber-300 transition-colors line-clamp-1">
                      {n.title}
                    </div>
                    <div className="text-[11px] text-white/50 mt-1 line-clamp-1">
                      {n.summary}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-[11px] font-mono text-white/50">Stanford Gates AI Mesh</span>
              <button
                onClick={() => {
                  sound.playPop();
                  setSelectedNotice(NOTICES[0]);
                  setInspectorOpen(true);
                }}
                className="text-xs font-mono text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
              >
                <span>Read Full Brief</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Card 3: Academic Telemetry & GPS Radar */}
          <div id="deck-section" className="vadim-glass-card rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="vadim-badge">STUDENT TELEMETRY</span>
                <span className="text-[10px] font-mono text-emerald-400">ACTIVE SESSION</span>
              </div>
              <h3 className="font-instrument italic text-2xl text-white font-normal mb-2">
                Scholar Profile
              </h3>
              
              {/* Profile Card */}
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-4 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Alex Mercer"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                />
                <div>
                  <div className="text-xs font-semibold text-white">Alex Mercer</div>
                  <div className="text-[10px] font-mono text-white/50">B.S. CS + Quantum AI • Stanford '26</div>
                </div>
              </div>

              {/* Stats readout */}
              <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] text-white/40 block">Cumulative GPA</span>
                  <span className="text-sm font-bold text-emerald-400">3.96 / 4.0</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] text-white/40 block">Focus Streak</span>
                  <span className="text-sm font-bold text-amber-400">24 Days</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] text-white/40 block">Units Completed</span>
                  <span className="text-sm font-bold text-cyan-400">142 / 180</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] text-white/40 block">Study Blocks</span>
                  <span className="text-sm font-bold text-indigo-400">6 Scheduled</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-[11px] font-mono text-white/50">Next: CS231N Lab in 1h 20m</span>
              <button
                onClick={() => {
                  sound.playCelebration();
                  confetti({ particleCount: 40, spread: 60, origin: { y: 0.85 } });
                }}
                className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono cursor-pointer hover:bg-emerald-500/30 transition-colors"
              >
                Log Attendance
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* =========================================================================
          SLIDING FROSTED GLASS INSPECTOR DRAWER (Vadim Carazan's aside.box)
          ========================================================================= */}
      {inspectorOpen && (
        <aside 
          className="fixed top-0 right-0 h-full w-full sm:w-[480px] lg:w-[540px] z-50 vadim-glass-drawer p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
        >
          <div>
            {/* Header with Close */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.1]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="font-mono text-xs uppercase tracking-wider text-white/70">
                  INSPECTION CONSOLE
                </span>
              </div>
              <button
                onClick={() => {
                  sound.playPop();
                  setInspectorOpen(false);
                }}
                className="p-1.5 rounded-full border border-white/20 hover:border-white/50 text-white/70 hover:text-white transition-all cursor-pointer"
                title="Close Drawer (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selected Notice or 3D Geometry Section */}
            {selectedNotice && (
              <div className="mt-6">
                <div className="inline-block px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[10px] font-mono mb-3">
                  {selectedNotice.priority} • {selectedNotice.category}
                </div>
                <h3 className="font-instrument italic text-2xl text-white font-normal leading-snug">
                  {selectedNotice.title}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-xs font-mono text-white/50">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedNotice.source} • {selectedNotice.time}</span>
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">
                    Executive Brief
                  </div>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    {selectedNotice.summary}
                  </p>
                </div>

                <div className="mt-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">
                    Action Directives
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-xs text-white/70">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Sync milestones directly into Dynamic Planner timeline</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-white/70">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                      <span>Verify Stanford smart card permissions at Packard Hall</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3D Geometry Telemetry Breakdown */}
            <div className="mt-6 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-3">
                WebGL Model Specs ({modelMeta.title})
              </div>
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-white/40 block">Polygon Complexity</span>
                  <span className="text-white font-semibold">{modelMeta.vertices}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block">Physics Model</span>
                  <span className="text-cyan-300 font-semibold">{modelMeta.physics}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block">Shader Passes</span>
                  <span className="text-white">PBR Transmission + IOR</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block">Device Pixel Ratio</span>
                  <span className="text-white">2.0 Retina</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons at bottom of drawer */}
          <div className="pt-6 border-t border-white/[0.1] space-y-2.5">
            <button
              onClick={() => {
                sound.playCelebration();
                confetti({ particleCount: 60, spread: 80, origin: { x: 0.8, y: 0.8 } });
              }}
              className="w-full py-3 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>{selectedNotice?.action || 'Execute Action'}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick(1000);
                toggleExperienceMode();
              }}
              className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 font-mono text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Switch to Light OS Mode</span>
            </button>
          </div>
        </aside>
      )}

      {/* Backdrop overlay for inspector */}
      {inspectorOpen && (
        <div 
          onClick={() => setInspectorOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        />
      )}

      {/* =========================================================================
          FLOATING FLYBAR (Fixed Bottom Navigation inspired by vadimcarazan.com)
          ========================================================================= */}
      <nav 
        aria-label="Vadim Flybar"
        className="fixed bottom-4 sm:bottom-6 left-4 sm:left-8 right-4 sm:right-8 z-40 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto flex items-end justify-between">
          
          {/* Left Index Indicator */}
          <div className="pointer-events-auto vadim-glass-card px-4 py-2 rounded-full border border-white/10 hidden sm:flex items-center gap-3">
            <span className="font-mono text-xs text-white/50">
              {activeModel === 'quantum-knot' && '01 / 04'}
              {activeModel === 'tesseract-crystal' && '02 / 04'}
              {activeModel === 'neural-dyson' && '03 / 04'}
              {activeModel === 'silicon-monolith' && '04 / 04'}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="font-mono text-xs font-semibold text-white tracking-wider">
              {modelMeta.title}
            </span>
          </div>

          {/* Center Quick Switcher Pills */}
          <div className="pointer-events-auto vadim-glass-card p-1.5 rounded-full border border-white/10 flex items-center gap-1 mx-auto sm:mx-0 shadow-2xl">
            {(['quantum-knot', 'tesseract-crystal', 'neural-dyson', 'silicon-monolith'] as Vadim3DModel[]).map((m, i) => (
              <button
                key={m}
                onClick={() => {
                  sound.playPop();
                  setActiveModel(m);
                }}
                className={`px-3 py-1.5 rounded-full font-mono text-[11px] transition-all cursor-pointer ${
                  activeModel === m
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.08]'
                }`}
                title={`Switch to Model 0${i + 1}`}
              >
                0{i + 1}
              </button>
            ))}

            <div className="w-[1px] h-4 bg-white/15 mx-1" />

            {/* Quick Light OS switch */}
            <button
              onClick={() => {
                sound.playCelebration();
                toggleExperienceMode();
              }}
              className="px-3 py-1.5 rounded-full font-mono text-[11px] font-semibold bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 transition-all cursor-pointer flex items-center gap-1"
              title="Return to Clean Light OS"
            >
              <Sun className="w-3 h-3 text-amber-400" />
              <span>LIGHT OS</span>
            </button>
          </div>

          {/* Right Jump Top Action */}
          <div className="pointer-events-auto hidden md:block">
            <button
              onClick={() => {
                sound.playClick(1300);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="vadim-glass-card p-2.5 rounded-full border border-white/10 text-white/60 hover:text-white transition-all cursor-pointer hover:scale-110"
              title="Scroll to Top"
            >
              <ArrowUpRight className="w-4 h-4 -rotate-45" />
            </button>
          </div>

        </div>
      </nav>

      {/* Deep Dark Footer */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#070708] py-8 text-center text-xs font-mono text-white/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            UNIFLOW LABS • STANFORD UNIVERSITY • SPRING 2026
          </div>
          <div className="flex items-center gap-3">
            <span>INSPIRED BY VADIM CARAZAN ARCHITECTURE</span>
            <span className="text-white/20">•</span>
            <button
              onClick={() => toggleExperienceMode()}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              SWITCH TO LIGHT OS
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
