import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Wand2, 
  CalendarDays, 
  Compass, 
  Share2, 
  ArrowRight,
  ChevronDown,
  Box,
  Layers,
  Eye,
  Maximize2,
  X
} from 'lucide-react';

interface Spatial3DHeroProps {
  onExplore3D?: () => void;
}

export const Spatial3DHero: React.FC<Spatial3DHeroProps> = ({ onExplore3D }) => {
  const { themeConfig, setActiveTab } = useTheme();

  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);

  const [activePreset, setActivePreset] = useState<'torus' | 'sphere' | 'octahedron'>('torus');
  const [show3DStage, setShow3DStage] = useState<boolean>(false);

  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const width = canvasContainerRef.current.clientWidth || 340;
    const height = canvasContainerRef.current.clientHeight || 300;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    canvasContainerRef.current.replaceChildren(renderer.domElement);

    // Ambient and point lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const primaryLight = new THREE.PointLight(themeConfig.primary, 3.5, 30);
    primaryLight.position.set(4, 4, 4);
    scene.add(primaryLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 2.5, 30);
    cyanLight.position.set(-4, -3, 2);
    scene.add(cyanLight);

    const meshGroup = new THREE.Group();
    scene.add(meshGroup);
    meshGroupRef.current = meshGroup;

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

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (meshGroupRef.current) {
        meshGroupRef.current.rotation.y += 0.007;
        meshGroupRef.current.rotation.x += 0.003;
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
  }, [show3DStage]);

  // Update 3D Geometry
  useEffect(() => {
    if (!meshGroupRef.current) return;

    while (meshGroupRef.current.children.length > 0) {
      const obj = meshGroupRef.current.children[0];
      meshGroupRef.current.remove(obj);
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
    }

    const primaryColor = new THREE.Color(themeConfig.primary);

    if (activePreset === 'torus') {
      const geo = new THREE.TorusKnotGeometry(1.4, 0.38, 120, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: primaryColor,
        roughness: 0.2,
        metalness: 0.9,
        wireframe: false,
        emissive: primaryColor,
        emissiveIntensity: 0.25,
      });
      const mesh = new THREE.Mesh(geo, mat);
      meshGroupRef.current.add(mesh);

      const wireMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
      const wireMesh = new THREE.Mesh(geo, wireMat);
      wireMesh.scale.set(1.02, 1.02, 1.02);
      meshGroupRef.current.add(wireMesh);
    } else if (activePreset === 'sphere') {
      const geo = new THREE.IcosahedronGeometry(1.6, 2);
      const mat = new THREE.MeshStandardMaterial({
        color: primaryColor,
        roughness: 0.1,
        metalness: 0.8,
        wireframe: true,
        emissive: primaryColor,
        emissiveIntensity: 0.4,
      });
      const mesh = new THREE.Mesh(geo, mat);
      meshGroupRef.current.add(mesh);

      const innerGeo = new THREE.SphereGeometry(0.8, 24, 24);
      const innerMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
      const inner = new THREE.Mesh(innerGeo, innerMat);
      meshGroupRef.current.add(inner);
    } else {
      const geo = new THREE.OctahedronGeometry(1.7, 1);
      const mat = new THREE.MeshPhysicalMaterial({
        color: primaryColor,
        roughness: 0.1,
        metalness: 0.3,
        transmission: 0.9,
        wireframe: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      meshGroupRef.current.add(mesh);

      const wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true }));
      wire.scale.set(1.03, 1.03, 1.03);
      meshGroupRef.current.add(wire);
    }
  }, [activePreset, themeConfig.primary, show3DStage]);

  const handleScrollDown = () => {
    sound.playClick();
    const target = document.getElementById('command-deck-content') || document.getElementById('command-content');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  const handleAppStoreClick = (storeName: string) => {
    sound.playSuccess();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: [themeConfig.primary, '#06b6d4', '#10b981'],
    });
  };

  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[88vh] flex flex-col justify-between items-center overflow-hidden border-b border-slate-200">
      
      {/* 1. Full-Bleed Grand Library Background Image */}
      <img 
        src="/images/library-hall.jpg" 
        alt="Stanford Grand Library Hall Study Space"
        className="absolute inset-0 w-full h-full object-cover object-center select-none"
        priority-high="true"
      />

      {/* 2. Deep Photographic Vignette Gradient (matching Zomato reference screenshot) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/90 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(0,0,0,0.65)_100%)] pointer-events-none" />

      {/* Top Academic Accents Bar */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider bg-black/50 text-white backdrop-blur-md border border-white/20 flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            STANFORD ACADEMIC OS • SPRING 2026
          </span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setShow3DStage((prev) => !prev);
          }}
          className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-white bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 transition-all btn-tactile cursor-pointer flex items-center gap-2 shadow-lg"
        >
          <Box className="w-3.5 h-3.5 text-cyan-300" />
          <span>{show3DStage ? 'Hide 3D Viewport' : '✦ Interactive 3D Model'}</span>
        </button>
      </div>

      {/* Center Hero: Exact Zomato-Style Editorial Branding */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center my-auto py-10 flex flex-col items-center">
        
        {/* Logo: Italic lowercase bold 'uniflow' exactly matching Zomato branding */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black italic tracking-tighter text-white drop-shadow-xl select-none">
          uniflow
        </h1>

        {/* Primary Headline: Silicon Valley's #1 Student Life OS */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] mt-4 drop-shadow-xl max-w-3xl">
          Silicon Valley’s #1 <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-cyan-200">
            Student Life OS
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl font-medium mt-4 leading-relaxed drop-shadow-md">
          Experience fast & effortless AI notice synthesis, interactive 3D spatial models & connected schedule graphs on Uniflow.
        </p>

        {/* Dual App Store Buttons (Official Badges matching Zomato Screenshot) */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          
          {/* GET IT ON Google Play */}
          <button
            onClick={() => handleAppStoreClick('Google Play')}
            className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-black/85 hover:bg-black text-white border border-white/25 hover:border-white/50 backdrop-blur-md shadow-2xl transition-all btn-tactile cursor-pointer group"
          >
            {/* Authentic Google Play Multi-Color Triangle Icon */}
            <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24">
              <path d="M3.6 1.8A1.8 1.8 0 0 0 3 3.3v17.4c0 .6.2 1.1.6 1.5l.1.1 9.8-9.8v-.2L3.7 2.5l-.1-.7Z" fill="#2196F3"/>
              <path d="m16.8 15.6-3.3-3.3v-.3l3.3-3.3.1.1 3.9 2.2c1.1.6 1.1 1.7 0 2.3l-3.9 2.3-.1-.1Z" fill="#FFC107"/>
              <path d="m13.5 12.3-9.8 9.9c.4.4 1 .4 1.7 0l11.4-6.5-3.3-3.4Z" fill="#4CAF50"/>
              <path d="m13.5 11.7-9.8-9.9c.4-.4 1-.4 1.7 0l8.1 4.6 3.3 3.3-3.3 2Z" fill="#F44336"/>
            </svg>
            <div className="text-left leading-none">
              <div className="text-[9px] font-sans font-medium uppercase tracking-wider text-slate-300">
                GET IT ON
              </div>
              <div className="text-sm sm:text-base font-bold tracking-tight text-white mt-0.5">
                Google Play
              </div>
            </div>
          </button>

          {/* Download on the App Store */}
          <button
            onClick={() => handleAppStoreClick('App Store')}
            className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-black/85 hover:bg-black text-white border border-white/25 hover:border-white/50 backdrop-blur-md shadow-2xl transition-all btn-tactile cursor-pointer group"
          >
            {/* Authentic Apple Logo Icon */}
            <svg className="w-6 h-6 fill-current flex-shrink-0 text-white" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.84.94-2.91-1 .04-2.17.67-2.82 1.43-.58.67-1.09 1.76-.95 2.81 1.11.09 2.2-.56 2.83-1.33z"/>
            </svg>
            <div className="text-left leading-none">
              <div className="text-[9px] font-sans font-medium text-slate-300">
                Download on the
              </div>
              <div className="text-sm sm:text-base font-bold tracking-tight text-white mt-0.5">
                App Store
              </div>
            </div>
          </button>

        </div>

        {/* Feature Quick Jump Links */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8 max-w-2xl">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('synthesizer');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-md transition-all btn-tactile cursor-pointer flex items-center gap-1.5"
          >
            <Wand2 className="w-3.5 h-3.5 text-cyan-300" />
            <span>AI Notice Studio</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('planner');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-md transition-all btn-tactile cursor-pointer flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-300" />
            <span>Connected Timeline Graph</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('spatial');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-md transition-all btn-tactile cursor-pointer flex items-center gap-1.5"
          >
            <Box className="w-3.5 h-3.5 text-amber-300" />
            <span>3D Model Studio</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('campus');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-md transition-all btn-tactile cursor-pointer flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-300" />
            <span>Campus Radar</span>
          </button>
        </div>

      </div>

      {/* Floating Interactive 3D Model Stage (When toggled on) */}
      {show3DStage && (
        <div className="relative z-20 w-full max-w-md mx-auto mb-6 p-4 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-white/20 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono font-bold text-white uppercase">INTERACTIVE 3D WEBGL STAGE</span>
            </div>
            
            <div className="flex items-center gap-1">
              {(['torus', 'sphere', 'octahedron'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    sound.playClick();
                    setActivePreset(preset);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold transition-all cursor-pointer ${
                    activePreset === preset 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              ))}
              <button
                onClick={() => setShow3DStage(false)}
                className="ml-2 text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div ref={canvasContainerRef} className="w-full h-56 cursor-grab active:cursor-grabbing" />

          <div className="text-center text-[10px] font-mono text-slate-400 pt-1">
            Drag to rotate • Real-time WebGL shader rendering
          </div>
        </div>
      )}

      {/* 3. Bottom Centered "Scroll down ⌵" Prompt (Exact match to Zomato Reference Screenshot) */}
      <div className="relative z-10 pb-8 flex flex-col items-center">
        <button
          onClick={handleScrollDown}
          className="group flex flex-col items-center gap-1 text-white/90 hover:text-white transition-all cursor-pointer select-none"
        >
          <span className="text-xs sm:text-sm font-medium tracking-wide drop-shadow">
            Scroll down
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-white/90 group-hover:text-white" />
        </button>
      </div>

    </section>
  );
};
