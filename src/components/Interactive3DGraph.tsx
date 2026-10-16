import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/audio';
import { 
  BarChart3, 
  Activity, 
  RotateCw, 
  Maximize2, 
  Layers, 
  Zap, 
  RefreshCw,
  Sparkles
} from 'lucide-react';

export type GraphMode = 'matrix' | 'terrain' | 'synaptic';

interface HoverData {
  title: string;
  value: string;
  sub: string;
  category: string;
}

export const Interactive3DGraph: React.FC = () => {
  const { themeConfig } = useTheme();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const graphGroupRef = useRef<THREE.Group | null>(null);
  
  // Animated Sheet References
  const sheetMeshRef = useRef<THREE.Mesh | null>(null);
  const scanLineRef = useRef<THREE.Mesh | null>(null);
  const pedestalDiscRef = useRef<THREE.Mesh | null>(null);
  const groundGridRef = useRef<THREE.GridHelper | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  const barsRef = useRef<THREE.Mesh[]>([]);
  const baseHeightsRef = useRef<number[]>([]);

  const [activeMode, setActiveMode] = useState<GraphMode>('matrix');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [hoveredData, setHoveredData] = useState<HoverData | null>({
    title: 'CS 229 FlashAttention GPU Sprint',
    value: '98.4% Efficiency',
    sub: '16.5 hrs logged • 4,820 TFLOPS',
    category: 'DEEP WORK PEAK',
  });

  const mouseRef = useRef<{ x: number; y: number; ndcX: number; ndcY: number }>({ x: 0, y: 0, ndcX: 0, ndcY: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.42, y: 0.65 });

  // 1. Setup Three.js Canvas & Animation Loop
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 5.5, 9.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;

    containerRef.current.replaceChildren(renderer.domElement);

    // Studio Lighting for Crisp White Aesthetic
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambientLight);

    const primaryColor = new THREE.Color(themeConfig.primary);
    const cyanColor = new THREE.Color('#06b6d4');

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(primaryColor, 4.5, 25);
    fillLight.position.set(-6, 3, 5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(cyanColor, 3.5, 25);
    rimLight.position.set(5, -2, -6);
    scene.add(rimLight);

    // Light Green Up-Light from the ground sheet
    const greenUpLight = new THREE.PointLight(0x22c55e, 2.0, 14);
    greenUpLight.position.set(0, -1.8, 0);
    scene.add(greenUpLight);

    // =========================================================================
    // ANIMATED 3D GRAPH SHEET (Light Green Small Boxes on White Theme)
    // =========================================================================

    // Static Precision Light Green Engineering Graph Sheet with Small Boxes
    // 12 units size, 48 divisions = neat small 0.25u millimeter boxes on white sheet
    const groundGrid = new THREE.GridHelper(12, 48, 0x16a34a, 0x4ade80);
    groundGrid.position.y = -1.2;
    scene.add(groundGrid);
    groundGridRef.current = groundGrid;

    // Static Light Green Pedestal Ring on Floor
    const pedestalGeo = new THREE.RingGeometry(0.1, 5.0, 64);
    pedestalGeo.rotateX(-Math.PI / 2);
    const pedestalMat = new THREE.MeshBasicMaterial({
      color: 0x4ade80,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });
    const pedestalDisc = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalDisc.position.y = -1.205;
    scene.add(pedestalDisc);
    pedestalDiscRef.current = pedestalDisc;

    // Subtle Ambient Floating Dust Particles (Light Green Micro-Coordinate Points)
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 100;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 14;
      particlePositions[i + 1] = Math.random() * 5 - 1.2;
      particlePositions[i + 2] = (Math.random() - 0.5) * 14;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x16a34a,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    const graphGroup = new THREE.Group();
    graphGroup.rotation.x = targetRotationRef.current.x;
    graphGroup.rotation.y = targetRotationRef.current.y;
    scene.add(graphGroup);
    graphGroupRef.current = graphGroup;

    // Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Main 60FPS Render Loop (Sheet stays static, 3D models remain interactive)
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slowly rotate ambient floating particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.015;
      }

      // Rotate 3D Graph Model Group
      if (graphGroupRef.current) {
        if (autoRotate && !isDraggingRef.current) {
          targetRotationRef.current.y += 0.0035;
        }

        // Damped smooth rotation toward target
        graphGroupRef.current.rotation.x += (targetRotationRef.current.x - graphGroupRef.current.rotation.x) * 0.08;
        graphGroupRef.current.rotation.y += (targetRotationRef.current.y - graphGroupRef.current.rotation.y) * 0.08;

        // Dynamic Wave Motion for Matrix Bars
        if (activeMode === 'matrix' && barsRef.current.length > 0) {
          barsRef.current.forEach((bar, idx) => {
            const baseH = baseHeightsRef.current[idx] || 1;
            const px = bar.position.x;
            const pz = bar.position.z;
            
            // Traveling 3D ripple wave based on coordinates and mouse distance
            const wave = Math.sin(elapsedTime * 2.5 + px * 0.8 + pz * 0.8) * 0.35;
            const mouseDist = Math.hypot(px - mouseRef.current.x, pz - mouseRef.current.y);
            const mouseLift = Math.max(0, 1 - mouseDist * 0.5) * 0.6;
            
            const currentScaleY = bar.scale.y;
            const targetY = Math.max(0.2, baseH + wave + mouseLift);
            bar.scale.y += (targetY - currentScaleY) * 0.12;
            bar.position.y = (bar.scale.y * 1.4) / 2 - 1.2;
          });
        }

        // Gentle Floating Pulse for Terrain / Synaptic
        if (activeMode === 'terrain') {
          const terrainMesh = graphGroupRef.current.getObjectByName('terrainMesh') as THREE.Mesh;
          if (terrainMesh && terrainMesh.geometry) {
            const posAttr = terrainMesh.geometry.attributes.position;
            for (let i = 0; i < posAttr.count; i++) {
              const u = posAttr.getX(i);
              const v = posAttr.getY(i);
              const z = Math.sin(u * 1.5 + elapsedTime * 2) * 0.3 + Math.cos(v * 1.5 + elapsedTime * 1.5) * 0.25;
              posAttr.setZ(i, z);
            }
            posAttr.needsUpdate = true;
          }
        }

        if (activeMode === 'synaptic') {
          const nodes = graphGroupRef.current.getObjectByName('synapticNodes') as THREE.Group;
          if (nodes) {
            nodes.children.forEach((child, i) => {
              child.position.y += Math.sin(elapsedTime * 3 + i) * 0.003;
            });
          }
        }
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
  }, []);

  // 2. Build 3D Visualizations - Preserving Original App Theme Colors
  useEffect(() => {
    if (!graphGroupRef.current || !sceneRef.current) return;

    // Clear previous objects
    while (graphGroupRef.current.children.length > 0) {
      const obj = graphGroupRef.current.children[0];
      graphGroupRef.current.remove(obj);
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
    }
    barsRef.current = [];
    baseHeightsRef.current = [];

    // Retain 100% original theme color hierarchy
    const primaryColor = new THREE.Color(themeConfig.primary);
    const cyanColor = new THREE.Color('#06b6d4');
    const goldColor = new THREE.Color('#f59e0b');
    const emeraldColor = new THREE.Color('#10b981');

    if (activeMode === 'matrix') {
      // 3D HOLOGRAPHIC BAR MATRIX (7 cols x 5 rows)
      const cols = 7;
      const rows = 5;
      const spacingX = 0.72;
      const spacingZ = 0.72;
      const offsetX = ((cols - 1) * spacingX) / 2;
      const offsetZ = ((rows - 1) * spacingZ) / 2;

      const barGeometry = new THREE.BoxGeometry(0.44, 1.4, 0.44);
      const edgesGeometry = new THREE.EdgesGeometry(barGeometry);
      const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const normX = c / cols;
          
          // Color ramp from Theme Primary -> Cyan -> Gold
          const barColor = new THREE.Color();
          if (normX < 0.5) {
            barColor.lerpColors(primaryColor, cyanColor, normX * 2);
          } else {
            barColor.lerpColors(cyanColor, goldColor, (normX - 0.5) * 2);
          }

          const barMaterial = new THREE.MeshPhysicalMaterial({
            color: barColor,
            metalness: 0.85,
            roughness: 0.12,
            clearcoat: 1.0,
            clearcoatRoughness: 0.08,
            emissive: barColor,
            emissiveIntensity: 0.35,
            transparent: true,
            opacity: 0.95,
          });

          const bar = new THREE.Mesh(barGeometry, barMaterial);
          const posX = c * spacingX - offsetX;
          const posZ = r * spacingZ - offsetZ;
          bar.position.set(posX, 0, posZ);
          bar.castShadow = true;
          bar.receiveShadow = true;

          // Wireframe outline for technical cyber-aesthetic
          const wireframe = new THREE.LineSegments(edgesGeometry, edgeMaterial);
          bar.add(wireframe);

          // Glowing cap plate on top of each pillar
          const capGeo = new THREE.BoxGeometry(0.46, 0.05, 0.46);
          const capMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.95,
          });
          const cap = new THREE.Mesh(capGeo, capMat);
          cap.position.y = 0.71;
          bar.add(cap);

          // Data height distribution
          const rawH = 0.6 + Math.sin(c * 0.8) * 0.5 + Math.cos(r * 1.1) * 0.4 + (c === 4 && r === 2 ? 1.2 : 0);
          baseHeightsRef.current.push(Math.max(0.4, rawH));
          bar.scale.y = 0.1; // will animate up

          graphGroupRef.current.add(bar);
          barsRef.current.push(bar);
        }
      }

      // Smooth initial growth animation
      const startTime = performance.now();
      const growBars = () => {
        const elapsed = (performance.now() - startTime) / 600;
        if (elapsed < 1) {
          const ease = 1 - Math.pow(1 - elapsed, 3);
          barsRef.current.forEach((bar, i) => {
            bar.scale.y = (baseHeightsRef.current[i] || 1) * ease;
            bar.position.y = (bar.scale.y * 1.4) / 2 - 1.2;
          });
          requestAnimationFrame(growBars);
        }
      };
      requestAnimationFrame(growBars);

    } else if (activeMode === 'terrain') {
      // 3D TOPOLOGICAL VELOCITY SURFACE (Continuous Wave Terrain)
      const terrainGroup = new THREE.Group();
      terrainGroup.name = 'terrainGroup';

      const gridX = 36;
      const gridY = 28;
      const planeGeo = new THREE.PlaneGeometry(6.5, 4.8, gridX, gridY);
      planeGeo.rotateX(-Math.PI / 2);

      const pos = planeGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const y = Math.sin(x * 1.4) * 0.45 + Math.cos(z * 1.8) * 0.35 + Math.sin(Math.hypot(x, z) * 2.2) * 0.3;
        pos.setY(i, y);
      }
      planeGeo.computeVertexNormals();

      const terrainMat = new THREE.MeshStandardMaterial({
        color: primaryColor,
        roughness: 0.15,
        metalness: 0.85,
        emissive: primaryColor,
        emissiveIntensity: 0.3,
        wireframe: false,
        side: THREE.DoubleSide,
      });

      const terrainMesh = new THREE.Mesh(planeGeo, terrainMat);
      terrainMesh.name = 'terrainMesh';
      terrainMesh.position.y = -0.6;
      terrainMesh.castShadow = true;
      terrainMesh.receiveShadow = true;
      terrainGroup.add(terrainMesh);

      // Cyan Wireframe Overlay on top of surface
      const wireMat = new THREE.MeshBasicMaterial({
        color: cyanColor,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      });
      const wireMesh = new THREE.Mesh(planeGeo, wireMat);
      wireMesh.position.y = -0.58;
      terrainGroup.add(wireMesh);

      // 3 Milestone floating pin beacons
      const beacons = [
        { x: -1.8, z: -1.0, label: 'Midterm 1', color: goldColor },
        { x: 0.4, z: 0.6, label: 'FlashAttention Benchmark', color: cyanColor },
        { x: 1.9, z: -0.8, label: 'Capstone Release', color: emeraldColor },
      ];

      beacons.forEach((b) => {
        const poleGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8);
        const poleMat = new THREE.MeshBasicMaterial({ color: b.color });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(b.x, 0.2, b.z);
        terrainGroup.add(pole);

        const orbGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const orbMat = new THREE.MeshStandardMaterial({
          color: b.color,
          emissive: b.color,
          emissiveIntensity: 0.95,
        });
        const orb = new THREE.Mesh(orbGeo, orbMat);
        orb.position.set(b.x, 0.8, b.z);
        terrainGroup.add(orb);
      });

      graphGroupRef.current.add(terrainGroup);

    } else if (activeMode === 'synaptic') {
      // 3D SYNAPTIC KNOWLEDGE GRAPH (Connected Nodes & Orbital Cables)
      const synapticGroup = new THREE.Group();
      synapticGroup.name = 'synapticNodes';

      const nodeData = [
        { id: 'cs229', name: 'CS 229 Machine Learning', color: primaryColor, pos: [0, 0.8, 0], size: 0.45 },
        { id: 'neur210', name: 'NEUR 210 Cellular Dynamics', color: cyanColor, pos: [-2.2, -0.2, 1.2], size: 0.35 },
        { id: 'stats214', name: 'STATS 214 High-Dim Inference', color: goldColor, pos: [2.0, -0.4, 1.0], size: 0.35 },
        { id: 'biox', name: 'Bio-X GPU Accelerator', color: emeraldColor, pos: [-0.6, -1.0, -1.8], size: 0.38 },
        { id: 'capstone', name: 'Autonomous Vision Capstone', color: new THREE.Color('#ec4899'), pos: [1.8, 0.6, -1.5], size: 0.32 },
      ];

      const nodes: THREE.Mesh[] = [];

      nodeData.forEach((n) => {
        const sphereGeo = new THREE.IcosahedronGeometry(n.size, 2);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: n.color,
          metalness: 0.9,
          roughness: 0.1,
          emissive: n.color,
          emissiveIntensity: 0.65,
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.set(n.pos[0], n.pos[1], n.pos[2]);

        // Outer Wireframe Halo Ring
        const ringGeo = new THREE.RingGeometry(n.size * 1.3, n.size * 1.45, 24);
        const ringMat = new THREE.MeshBasicMaterial({ color: n.color, side: THREE.DoubleSide, transparent: true, opacity: 0.75 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        sphere.add(ring);

        synapticGroup.add(sphere);
        nodes.push(sphere);
      });

      // Interconnecting 3D Laser Tubes between all nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const p1 = nodes[i].position;
          const p2 = nodes[j].position;
          const curve = new THREE.LineCurve3(p1, p2);
          const tubeGeo = new THREE.TubeGeometry(curve, 16, 0.025, 8, false);
          const tubeMat = new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            emissive: cyanColor,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.65,
          });
          const tube = new THREE.Mesh(tubeGeo, tubeMat);
          synapticGroup.add(tube);
        }
      }

      graphGroupRef.current.add(synapticGroup);
    }

  }, [activeMode, themeConfig.primary]);

  // Mouse Orbit / Touch Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouseRef.current = { x: x * 3.5, y: -y * 3.5, ndcX: x, ndcY: y };

    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.008;
      targetRotationRef.current.x = Math.max(-0.2, Math.min(1.2, targetRotationRef.current.x + deltaY * 0.008));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    }

    // Dynamic Hover Telemetry Trigger
    if (Math.abs(x) < 0.3 && Math.abs(y) < 0.3) {
      setHoveredData({
        title: 'FlashAttention Kernel Optimization',
        value: '99.4% Peak Memory Bandwidth',
        sub: 'SRAM Cache utilization • CS 229 Sprint',
        category: 'STANFORD GPU CLUSTER',
      });
    } else if (x > 0.3) {
      setHoveredData({
        title: 'Patch-Clamp Electrophysiology Modeling',
        value: '16/18 Modules Done',
        sub: 'Clark Bio-X Auditorium • Lab 4 Done',
        category: 'NEUR 210 CONCEPTS',
      });
    } else if (x < -0.3) {
      setHoveredData({
        title: 'High-Dimensional Matrix Completion',
        value: '14/16 Modules Done',
        sub: 'STATS 214 Theory & Rigor',
        category: 'EXAM TOPICS',
      });
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const resetView = () => {
    sound.playClick();
    targetRotationRef.current = { x: 0.42, y: 0.65 };
  };

  return (
    <div className="vadim-glass-card rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs relative flex flex-col group">
      
      {/* 3D Graph Top Header */}
      <div className="p-5 sm:p-6 border-b border-slate-200/80 bg-white/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 z-20">
        
        {/* Title & Status */}
        <div className="flex items-center gap-3.5">
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md transition-all shrink-0"
            style={{
              background: `linear-gradient(135deg, ${themeConfig.primary}, #06b6d4)`,
              boxShadow: `0 4px 14px ${themeConfig.glow}`,
            }}
          >
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                EXAM TOPICS & CONCEPTS
              </span>
              <span className="hidden sm:inline text-[10px] font-mono text-slate-400">
                3D SURFACE • CONCEPT VISUALIZATION
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-instrument italic text-slate-900 tracking-tight mt-0.5 font-normal">
              Exam Concepts & Syllabus Visual Surface
            </h3>
          </div>
        </div>

        {/* View Switchers & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Graph Visualization Modes */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => {
                sound.playClick();
                setActiveMode('matrix');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer btn-tactile ${
                activeMode === 'matrix'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>3D Bar Matrix</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveMode('terrain');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer btn-tactile ${
                activeMode === 'terrain'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-600" />
              <span>Surface Topography</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveMode('synaptic');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer btn-tactile ${
                activeMode === 'synaptic'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Synaptic Nodes</span>
            </button>
          </div>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => {
              sound.playPop();
              setAutoRotate((r) => !r);
            }}
            className={`p-2 rounded-xl border transition-all btn-tactile cursor-pointer ${
              autoRotate ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
            title={autoRotate ? 'Auto-rotation ON' : 'Auto-rotation PAUSED'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>

          {/* Reset Camera Angle */}
          <button
            onClick={resetView}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors btn-tactile cursor-pointer"
            title="Reset 3D Perspective"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

      {/* 3D WebGL Canvas Viewport - Clean White Theme with Animated Light Green Small Boxes Graph Sheet */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-72 sm:h-80 md:h-[400px] relative cursor-grab active:cursor-grabbing select-none overflow-hidden bg-white"
        style={{
          // Millimeter precision engineering paper small boxes in light green
          backgroundImage: `
            linear-gradient(to right, rgba(22, 163, 74, 0.14) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(22, 163, 74, 0.14) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      >
        {/* Soft Ambient Radiance Aura in Pale Mint/Green */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.15) 0%, rgba(248, 250, 252, 0.6) 65%, #ffffff 100%)',
          }}
        />

        {/* Floating HUD Tooltip Overlay (Frosted Glass Card on White Sheet) */}
        {hoveredData && (
          <div className="absolute top-4 left-4 z-20 p-3.5 rounded-2xl border border-emerald-300/80 bg-white/95 text-slate-900 shadow-xl backdrop-blur-xl pointer-events-none max-w-xs animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                {hoveredData.category}
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-900 mt-1 font-inter-tight leading-snug">
              {hoveredData.title}
            </div>
            <div className="text-xs font-mono font-bold text-emerald-600 mt-0.5">
              {hoveredData.value}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
              {hoveredData.sub}
            </div>
          </div>
        )}

        {/* Static Sheet Tag (Top Right of Canvas) */}
        <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-white/90 text-emerald-800 border border-emerald-300 shadow-xs backdrop-blur-md text-[10px] font-mono pointer-events-none flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>SHEET: WHITE / LIGHT GREEN BOXES (0.25u)</span>
        </div>

        {/* Drag Hint Pill (Bottom Right of Canvas) */}
        <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-slate-900/85 text-white border border-slate-700 backdrop-blur-md text-[10px] font-mono pointer-events-none flex items-center gap-1.5 shadow-sm">
          <Maximize2 className="w-2.5 h-2.5 text-emerald-400" />
          <span>Click & Drag to Orbit 3D Axis</span>
        </div>

      </div>

      {/* 3D Telemetry HUD Footer */}
      <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-white/95 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        
        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Exam Readiness</div>
          <div className="mt-1 flex items-baseline gap-1 text-slate-900 font-bold text-sm">
            <span>High Mastery</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Active</span>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Deep Focus Study</div>
          <div className="mt-1 flex items-baseline gap-1 text-slate-900 font-bold text-sm">
            <span>28.5h</span>
            <span className="text-[10px] text-cyan-600 font-semibold">/ wk</span>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Concepts Visualized</div>
          <div className="mt-1 flex items-baseline gap-1 text-slate-900 font-bold text-sm">
            <span>48 Topics</span>
            <span className="text-[10px] text-amber-600 font-semibold">Mastered</span>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Syllabus Completion</div>
          <div className="mt-1 flex items-baseline gap-1 text-slate-900 font-bold text-sm">
            <span>14 / 18</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Modules</span>
          </div>
        </div>

      </div>

    </div>
  );
};
