import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const SUBTITLE_WORDS = "A visualized institute where students master concepts through 3D spatial models, interactive curriculum pipelines, research libraries & real-world visual understanding.".split(" ");

const subtitleContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04, // Smooth sequential word flow
      delayChildren: 0.45,
    },
  },
};

const subtitleWordVariants = {
  hidden: {
    opacity: 0,
    y: 16,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export const FullScreenHero3D: React.FC = () => {
  const { themeConfig } = useTheme();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const midMeshRef = useRef<THREE.Group | null>(null);
  const innerCoreRef = useRef<THREE.Group | null>(null);
  const gimbalRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  const isDraggingRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.15, y: 0.35 });

  // 1. Build and Animate the 3D Quantum Cyber-Knot Model in Pristine Light Theme
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    containerRef.current.replaceChildren(renderer.domElement);

    // High-Dynamic Studio Lighting for Clean Light Background
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const primaryColor = new THREE.Color(themeConfig.primary);
    const cyanColor = new THREE.Color(0x0284c7); // Deep Sky / Electric Cyan
    const goldColor = new THREE.Color(0xf59e0b); // Radiant Solar Amber

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 6, 8);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(primaryColor, 4.2, 30);
    fillLight.position.set(-6, 3, 5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x06b6d4, 3.2, 30);
    rimLight.position.set(5, -4, -4);
    scene.add(rimLight);

    const modelGroup = new THREE.Group();
    // Offset model to the right side on laptop/desktop so text on left is crystal clear with zero overlap
    modelGroup.position.set(width >= 1024 ? 2.15 : 0, 0, 0);
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // =========================================================================
    // BUILD EXACT 3D QUANTUM CYBER-KNOT (From Image 1 - Light Theme Tuning)
    // =========================================================================
    const knotContainer = new THREE.Group();
    modelGroup.add(knotContainer);
    midMeshRef.current = knotContainer;

    // 1. Celtic 5-Fold Intertwined Torus Knot
    const knotGeo = new THREE.TorusKnotGeometry(1.4, 0.38, 260, 32, 2, 5);
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: primaryColor,
      roughness: 0.16,
      metalness: 0.88,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      emissive: primaryColor,
      emissiveIntensity: 0.15,
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    knotContainer.add(knotMesh);

    // Electric Cyan Outer Wireframe Ribbons
    const wireGeo = new THREE.TorusKnotGeometry(1.415, 0.385, 160, 16, 2, 5);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    knotContainer.add(wireMesh);

    // 2. Inner Glowing Pulsating Core (Solar Gold Dodecahedron)
    const coreGroup = new THREE.Group();
    modelGroup.add(coreGroup);
    innerCoreRef.current = coreGroup;

    const innerDodecaGeo = new THREE.DodecahedronGeometry(0.68, 1);
    const innerDodecaMat = new THREE.MeshStandardMaterial({
      color: goldColor,
      roughness: 0.15,
      metalness: 0.85,
      emissive: 0xd97706,
      emissiveIntensity: 0.7,
    });
    const innerCore = new THREE.Mesh(innerDodecaGeo, innerDodecaMat);
    coreGroup.add(innerCore);

    const coreLight = new THREE.PointLight(goldColor, 2.8, 8);
    coreGroup.add(coreLight);

    // 3. Concentric 3-Axis Gyroscope Gimbal Rings
    const gimbalGroup = new THREE.Group();
    modelGroup.add(gimbalGroup);
    gimbalRef.current = gimbalGroup;

    // Gimbal Ring X (Deep Cyan)
    const ring1Geo = new THREE.TorusGeometry(2.35, 0.035, 16, 120);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x0891b2,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x0891b2,
      emissiveIntensity: 0.25,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.5;
    gimbalGroup.add(ring1);

    // Gimbal Ring Y (Deep Indigo)
    const ring2Geo = new THREE.TorusGeometry(2.68, 0.03, 16, 120);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: primaryColor,
      metalness: 0.85,
      roughness: 0.2,
      emissive: primaryColor,
      emissiveIntensity: 0.25,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3;
    gimbalGroup.add(ring2);

    // Gimbal Ring Z (Amber Gold with Quantum Nodes)
    const ring3Geo = new THREE.TorusGeometry(3.0, 0.028, 16, 120);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.z = Math.PI / 4;
    gimbalGroup.add(ring3);

    // 12 Orbiting Photonic Energy Nodes along Outer Ring
    for (let i = 0; i < 12; i++) {
      const theta = (i / 12) * Math.PI * 2;
      const beadGeo = new THREE.SphereGeometry(0.1, 14, 14);
      const beadMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x0284c7 : 0xd97706,
        emissive: i % 2 === 0 ? 0x0284c7 : 0xd97706,
        emissiveIntensity: 0.6,
        roughness: 0.15,
      });
      const bead = new THREE.Mesh(beadGeo, beadMat);
      bead.position.set(Math.cos(theta) * 3.0, Math.sin(theta) * 3.0, 0);
      ring3.add(bead);
    }

    // 4. Ambient Photonic Particle Dust
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0x0284c7,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);

      if (modelGroupRef.current) {
        modelGroupRef.current.position.set(w >= 1024 ? 2.15 : 0, 0, 0);
      }
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop with Multi-Axis Gyroscope Rotations
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (modelGroupRef.current) {
        if (!isDraggingRef.current) {
          targetRotationRef.current.y += 0.005;
        }

        // Damped rotation
        modelGroupRef.current.rotation.x += (targetRotationRef.current.x - modelGroupRef.current.rotation.x) * 0.08;
        modelGroupRef.current.rotation.y += (targetRotationRef.current.y - modelGroupRef.current.rotation.y) * 0.08;

        // Counter-rotations
        if (midMeshRef.current) {
          midMeshRef.current.rotation.y += 0.008;
          midMeshRef.current.rotation.x += 0.003;
        }

        if (innerCoreRef.current) {
          innerCoreRef.current.rotation.y -= 0.012;
          const s = 1 + Math.sin(elapsedTime * 3.0) * 0.06;
          innerCoreRef.current.scale.set(s, s, s);
        }

        if (gimbalRef.current) {
          gimbalRef.current.rotation.z -= 0.007;
          gimbalRef.current.rotation.x += 0.004;
        }
      }

      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.02;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [themeConfig.primary]);

  // Mouse Drag Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;

    targetRotationRef.current.y += deltaX * 0.008;
    targetRotationRef.current.x = Math.max(-0.6, Math.min(0.8, targetRotationRef.current.x + deltaY * 0.008));

    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - prevMousePosRef.current.x;
    const deltaY = e.touches[0].clientY - prevMousePosRef.current.y;

    targetRotationRef.current.y += deltaX * 0.008;
    targetRotationRef.current.x = Math.max(-0.6, Math.min(0.8, targetRotationRef.current.x + deltaY * 0.008));

    prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <section 
      aria-label="Uniflow Hero Showcase"
      className="w-full h-screen min-h-screen relative overflow-hidden flex flex-col justify-between bg-[#f8fafc] text-slate-900 select-none rounded-none m-0 p-0"
    >
      
      {/* 1. Luminous Light High-Tech Atmosphere */}
      <div className="absolute inset-0 z-0 bg-[#f8fafc]">
        {/* Soft Radial Ambient Lighting Mesh directly behind 3D model */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 75% 50%, rgba(6, 182, 212, 0.16) 0%, rgba(99, 102, 241, 0.10) 40%, rgba(248, 250, 252, 0) 75%)`,
          }}
        />
        <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-transparent to-[#f8fafc]/70 pointer-events-none" />
      </div>

      {/* Top Spacer to preserve full-screen layout underneath fixed Navbar */}
      <div className="relative z-30 w-full h-14 sm:h-16 pointer-events-none" />

      {/* 3. Full-Screen Interactive 3D WebGL Canvas Layer */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing select-none"
        title="3D Visual Pedagogy Studio • Faculty interactive models & top student showcase • Click and drag to orbit"
      />

      {/* 4. Center-Left Editorial Headline & Subtitle (Positioned to the left with zero 3D collision) */}
      <div className="relative z-20 px-6 sm:px-10 lg:pl-16 lg:pr-4 max-w-xl xl:max-w-2xl pointer-events-none my-auto py-12">
        
        {/* Main Headline: Just uniflow with luxury dynamic light theme gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 32, filter: 'blur(16px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.95, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-instrument italic tracking-tight leading-[1.02] font-normal select-none"
        >
          <span 
            className="inline-block pr-4 pb-2 text-transparent bg-clip-text transition-all duration-700"
            style={{
              backgroundImage: `linear-gradient(135deg, #0f172a 0%, ${themeConfig.primary} 50%, #0284c7 80%, #06b6d4 100%)`,
              filter: `drop-shadow(0 6px 30px ${themeConfig.glow})`,
            }}
          >
            uniflow
          </span>
        </motion.h1>

        {/* Subtitle Text (Slow Word-by-Word Sequential Reveal Animation) */}
        <motion.p
          variants={subtitleContainerVariants}
          initial="hidden"
          animate="visible"
          className="text-base sm:text-lg lg:text-xl text-slate-600 mt-6 leading-relaxed font-normal max-w-lg flex flex-wrap"
        >
          {SUBTITLE_WORDS.map((word, i) => (
            <motion.span
              key={`sub-${i}`}
              variants={subtitleWordVariants}
              className="inline-block mr-[0.28em]"
            >
              {word}
            </motion.span>
          ))}
        </motion.p>

        {/* Call to action button to explore dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 pointer-events-auto flex items-center gap-4"
        >
          <button
            onClick={() => {
              document.querySelector('#academic-vitality-bento')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all cursor-pointer flex items-center gap-2 btn-tactile"
          >
            <span>Explore Command Deck</span>
            <span className="text-sm">↓</span>
          </button>
        </motion.div>

      </div>

      {/* Spacer to balance bottom area cleanly */}
      <div className="relative z-20 h-8 pointer-events-none" />

    </section>
  );
};
