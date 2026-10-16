import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { AnimatedCard } from './AnimatedCard';
import { 
  Sparkles, 
  RotateCw, 
  Layers, 
  Zap, 
  Eye, 
  Maximize2, 
  Sliders, 
  RefreshCcw,
  Cpu,
  Brain,
  Atom,
  Gem,
  Camera,
  Video,
  Box,
  Glasses
} from 'lucide-react';

export type ModelType = 'quantum-knot' | 'tesseract-crystal' | 'neural-dyson' | 'silicon-monolith';

// Mathematical Curve for DNA Double Helix
class HelixCurve extends THREE.Curve<THREE.Vector3> {
  radius: number;
  pitch: number;
  turns: number;
  phase: number;

  constructor(radius = 1.45, pitch = 0.52, turns = 2.4, phase = 0) {
    super();
    this.radius = radius;
    this.pitch = pitch;
    this.turns = turns;
    this.phase = phase;
  }

  getPoint(t: number): THREE.Vector3 {
    const angle = t * Math.PI * 2 * this.turns + this.phase;
    const x = this.radius * Math.cos(angle);
    const z = this.radius * Math.sin(angle);
    const y = (t - 0.5) * (this.turns * 2 * this.pitch);
    return new THREE.Vector3(x, y, z);
  }
}

export const Spatial3DStudio: React.FC = () => {
  const { themeConfig } = useTheme();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Sub-element references for complex cinematic multi-axis motion
  const innerCoreRef = useRef<THREE.Object3D | null>(null);
  const midMeshRef = useRef<THREE.Object3D | null>(null);
  const gimbalRef = useRef<THREE.Object3D | null>(null);
  const laserPlaneRef = useRef<THREE.Mesh | null>(null);

  // Studio UI state
  const [activeModel, setActiveModel] = useState<ModelType>('quantum-knot');
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const rotationSpeed = 0.008;
  const particleDensity = 1400;
  const [fps, setFps] = useState<number>(60);

  // Mouse / Touch interaction state
  const isDraggingRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 1. Initialize Scene, Camera & Renderer
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    containerRef.current.replaceChildren(renderer.domElement);

    // Dynamic 3-Point Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(themeConfig.primary, 4.0, 50);
    pointLight1.position.set(6, 6, 6);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 3.2, 50);
    pointLight2.position.set(-6, -5, 4);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xf59e0b, 2.8, 50);
    pointLight3.position.set(0, -6, -4);
    scene.add(pointLight3);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop with Multi-Axis Dynamic Rotation
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // FPS counter
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      const time = now * 0.001;

      // Independent multi-axis counter-rotations
      if (autoRotate && !isDraggingRef.current) {
        if (modelGroupRef.current) {
          modelGroupRef.current.rotation.y += rotationSpeed * 0.6;
        }

        // Main middle sculpture spin
        if (midMeshRef.current) {
          midMeshRef.current.rotation.y += rotationSpeed;
          midMeshRef.current.rotation.x += rotationSpeed * 0.4;
        }

        // Inner glowing core pulse & counter-rotation
        if (innerCoreRef.current) {
          innerCoreRef.current.rotation.y -= rotationSpeed * 1.4;
          innerCoreRef.current.rotation.z += rotationSpeed * 0.6;
          const s = 1 + Math.sin(time * 3.5) * 0.06;
          innerCoreRef.current.scale.set(s, s, s);
        }

        // Outer gimbal gyroscope rings counter-spin
        if (gimbalRef.current) {
          gimbalRef.current.rotation.z -= rotationSpeed * 0.9;
          gimbalRef.current.rotation.x += rotationSpeed * 0.5;
        }

        // Laser scan plane sweeping motion
        if (laserPlaneRef.current) {
          laserPlaneRef.current.position.y = Math.sin(time * 2.2) * 0.8 + 0.3;
        }
      }

      // Rotate ambient starfield nebula
      if (particlesRef.current) {
        particlesRef.current.rotation.y -= 0.0015;
        particlesRef.current.rotation.x += 0.0008;
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

  // 2. Build 4 Ultra-Pro Attractive 3D Models
  useEffect(() => {
    if (!modelGroupRef.current || !sceneRef.current) return;

    // Clear existing children & dispose geometries
    while (modelGroupRef.current.children.length > 0) {
      const obj = modelGroupRef.current.children[0];
      modelGroupRef.current.remove(obj);
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
    }

    innerCoreRef.current = null;
    midMeshRef.current = null;
    gimbalRef.current = null;
    laserPlaneRef.current = null;

    const primaryColor = new THREE.Color(themeConfig.primary);
    const cyanColor = new THREE.Color(0x06b6d4); // Electric Cyan
    const goldColor = new THREE.Color(0xf59e0b); // Solar Amber Gold
    const magentaColor = new THREE.Color(0xec4899); // Neon Pink/Magenta

    // =========================================================================
    // MODEL 1: QUANTUM CYBER-KNOT & 3D GYROSCOPE GIMBAL
    // =========================================================================
    if (activeModel === 'quantum-knot') {
      const knotContainer = new THREE.Group();
      modelGroupRef.current.add(knotContainer);
      midMeshRef.current = knotContainer;

      // 1. Celtic 5-Fold Intertwined Torus Knot
      const knotGeo = new THREE.TorusKnotGeometry(1.35, 0.38, 240, 32, 2, 5);
      const knotMat = new THREE.MeshPhysicalMaterial({
        color: primaryColor,
        roughness: 0.1,
        metalness: 0.92,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        wireframe: wireframe,
        emissive: primaryColor,
        emissiveIntensity: 0.28,
      });
      const knotMesh = new THREE.Mesh(knotGeo, knotMat);
      knotContainer.add(knotMesh);

      // Neon Cyan Outer Wireframe Ribbons
      const wireGeo = new THREE.TorusKnotGeometry(1.365, 0.385, 140, 16, 2, 5);
      const wireMat = new THREE.MeshBasicMaterial({
        color: cyanColor,
        wireframe: true,
        transparent: true,
        opacity: 0.7,
      });
      const wireMesh = new THREE.Mesh(wireGeo, wireMat);
      knotContainer.add(wireMesh);

      // 2. Inner Glowing Pulsating Core
      const coreGroup = new THREE.Group();
      modelGroupRef.current.add(coreGroup);
      innerCoreRef.current = coreGroup;

      const innerDodecaGeo = new THREE.DodecahedronGeometry(0.65, 1);
      const innerDodecaMat = new THREE.MeshStandardMaterial({
        color: goldColor,
        roughness: 0.1,
        metalness: 0.8,
        emissive: goldColor,
        emissiveIntensity: 0.9,
      });
      const innerCore = new THREE.Mesh(innerDodecaGeo, innerDodecaMat);
      coreGroup.add(innerCore);

      // Core internal point light radiating through knot gaps
      const coreLight = new THREE.PointLight(goldColor, 2.5, 7);
      coreGroup.add(coreLight);

      // 3. Concentric 3-Axis Gyroscope Gimbal Rings
      const gimbalGroup = new THREE.Group();
      modelGroupRef.current.add(gimbalGroup);
      gimbalRef.current = gimbalGroup;

      // Gimbal Ring X (Cyan)
      const ring1Geo = new THREE.TorusGeometry(2.35, 0.035, 16, 120);
      const ring1Mat = new THREE.MeshStandardMaterial({
        color: cyanColor,
        metalness: 0.9,
        roughness: 0.15,
        emissive: cyanColor,
        emissiveIntensity: 0.3,
      });
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      ring1.rotation.x = Math.PI / 2.5;
      gimbalGroup.add(ring1);

      // Gimbal Ring Y (Theme Color)
      const ring2Geo = new THREE.TorusGeometry(2.68, 0.03, 16, 120);
      const ring2Mat = new THREE.MeshStandardMaterial({
        color: primaryColor,
        metalness: 0.9,
        roughness: 0.15,
        emissive: primaryColor,
        emissiveIntensity: 0.3,
      });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.y = Math.PI / 3;
      gimbalGroup.add(ring2);

      // Gimbal Ring Z (Gold with Quantum Nodes)
      const ring3Geo = new THREE.TorusGeometry(3.0, 0.025, 16, 120);
      const ring3Mat = new THREE.MeshStandardMaterial({
        color: goldColor,
        metalness: 0.95,
        roughness: 0.1,
        emissive: goldColor,
        emissiveIntensity: 0.4,
      });
      const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
      ring3.rotation.z = Math.PI / 4;
      gimbalGroup.add(ring3);

      // 12 Orbiting Photonic Energy Nodes along Outer Ring
      for (let i = 0; i < 12; i++) {
        const theta = (i / 12) * Math.PI * 2;
        const beadGeo = new THREE.SphereGeometry(0.09, 14, 14);
        const beadMat = new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? cyanColor : goldColor,
          emissive: i % 2 === 0 ? cyanColor : goldColor,
          emissiveIntensity: 0.9,
        });
        const bead = new THREE.Mesh(beadGeo, beadMat);
        bead.position.set(Math.cos(theta) * 3.0, Math.sin(theta) * 3.0, 0);
        ring3.add(bead);
      }
    }

    // =========================================================================
    // MODEL 2: HYPER-TESSERACT CRYSTAL & OPTICAL REFRACTOR
    // =========================================================================
    else if (activeModel === 'tesseract-crystal') {
      const crystalContainer = new THREE.Group();
      modelGroupRef.current.add(crystalContainer);
      midMeshRef.current = crystalContainer;

      // 1. Outer Translucent Diamond Glass Icosahedron
      const outerGeo = new THREE.IcosahedronGeometry(1.68, 0);
      const outerMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.04,
        metalness: 0.05,
        transmission: 0.93, // True Volumetric Glass
        thickness: 1.8,
        ior: 1.76, // Diamond Refraction
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        wireframe: wireframe,
        emissive: primaryColor,
        emissiveIntensity: 0.15,
      });
      const outerCrystal = new THREE.Mesh(outerGeo, outerMat);
      crystalContainer.add(outerCrystal);

      // Electric Cyan Wireframe Edge Framework
      const cageGeo = new THREE.IcosahedronGeometry(1.7, 0);
      const cageMat = new THREE.MeshBasicMaterial({
        color: cyanColor,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      });
      const cage = new THREE.Mesh(cageGeo, cageMat);
      crystalContainer.add(cage);

      // 2. Nested Inverted Reverse-Rotating Metallic Polyhedron
      const innerGroup = new THREE.Group();
      modelGroupRef.current.add(innerGroup);
      innerCoreRef.current = innerGroup;

      const innerOctaGeo = new THREE.OctahedronGeometry(1.15, 1);
      const innerOctaMat = new THREE.MeshPhysicalMaterial({
        color: primaryColor,
        metalness: 0.95,
        roughness: 0.12,
        clearcoat: 1.0,
        emissive: magentaColor,
        emissiveIntensity: 0.35,
      });
      const innerOcta = new THREE.Mesh(innerOctaGeo, innerOctaMat);
      innerGroup.add(innerOcta);

      // 3. Central Luminous Quantum Singularity Sphere
      const singGeo = new THREE.SphereGeometry(0.48, 32, 32);
      const singMat = new THREE.MeshStandardMaterial({
        color: goldColor,
        emissive: goldColor,
        emissiveIntensity: 1.2,
        roughness: 0.1,
      });
      const singularity = new THREE.Mesh(singGeo, singMat);
      innerGroup.add(singularity);

      const coreLight = new THREE.PointLight(cyanColor, 3.5, 9);
      innerGroup.add(coreLight);

      // 4. Orbiting Sacred Geometry Diamond Shards
      const shardGroup = new THREE.Group();
      modelGroupRef.current.add(shardGroup);
      gimbalRef.current = shardGroup;

      for (let i = 0; i < 10; i++) {
        const theta = (i / 10) * Math.PI * 2;
        const radius = 2.55;
        const shardGeo = new THREE.OctahedronGeometry(0.18, 0);
        const shardMat = new THREE.MeshPhysicalMaterial({
          color: primaryColor,
          metalness: 0.9,
          roughness: 0.1,
          transmission: 0.6,
          emissive: cyanColor,
          emissiveIntensity: 0.5,
        });
        const shard = new THREE.Mesh(shardGeo, shardMat);
        shard.position.set(
          Math.cos(theta) * radius,
          Math.sin(theta * 2) * 0.45,
          Math.sin(theta) * radius
        );
        shard.rotation.set(theta, theta * 2, 0);
        shardGroup.add(shard);
      }

      // Dual Planar Laser Horizon Coordinate Rings
      const horizon1Geo = new THREE.RingGeometry(2.35, 2.38, 64);
      const horizon1Mat = new THREE.MeshBasicMaterial({ color: cyanColor, side: THREE.DoubleSide });
      const horizon1 = new THREE.Mesh(horizon1Geo, horizon1Mat);
      horizon1.rotation.x = Math.PI / 2;
      shardGroup.add(horizon1);
    }

    // =========================================================================
    // MODEL 3: NEURAL DYSON CORE & DNA DOUBLE HELIX ACCELERATOR
    // =========================================================================
    else if (activeModel === 'neural-dyson') {
      const dysonContainer = new THREE.Group();
      modelGroupRef.current.add(dysonContainer);
      midMeshRef.current = dysonContainer;

      // 1. Central Geodesic Synaptic Cortex
      const coreGroup = new THREE.Group();
      modelGroupRef.current.add(coreGroup);
      innerCoreRef.current = coreGroup;

      const cortexGeo = new THREE.IcosahedronGeometry(1.15, 2);
      const cortexMat = new THREE.MeshPhysicalMaterial({
        color: primaryColor,
        roughness: 0.15,
        metalness: 0.88,
        clearcoat: 1.0,
        wireframe: wireframe,
        emissive: primaryColor,
        emissiveIntensity: 0.35,
      });
      const cortex = new THREE.Mesh(cortexGeo, cortexMat);
      coreGroup.add(cortex);

      // Outer Gold Synaptic Wireframe Lattice
      const wireCortexGeo = new THREE.IcosahedronGeometry(1.18, 2);
      const wireCortexMat = new THREE.MeshBasicMaterial({
        color: goldColor,
        wireframe: true,
        transparent: true,
        opacity: 0.75,
      });
      const wireCortex = new THREE.Mesh(wireCortexGeo, wireCortexMat);
      coreGroup.add(wireCortex);

      // 2. Intertwined DNA Double Helix Tubes
      const curve1 = new HelixCurve(1.65, 0.52, 2.4, 0);
      const curve2 = new HelixCurve(1.65, 0.52, 2.4, Math.PI);

      const tubeGeo1 = new THREE.TubeGeometry(curve1, 120, 0.055, 12, false);
      const tubeMat1 = new THREE.MeshStandardMaterial({
        color: cyanColor,
        metalness: 0.9,
        roughness: 0.15,
        emissive: cyanColor,
        emissiveIntensity: 0.5,
      });
      const tube1 = new THREE.Mesh(tubeGeo1, tubeMat1);
      dysonContainer.add(tube1);

      const tubeGeo2 = new THREE.TubeGeometry(curve2, 120, 0.055, 12, false);
      const tubeMat2 = new THREE.MeshStandardMaterial({
        color: magentaColor,
        metalness: 0.9,
        roughness: 0.15,
        emissive: magentaColor,
        emissiveIntensity: 0.5,
      });
      const tube2 = new THREE.Mesh(tubeGeo2, tubeMat2);
      dysonContainer.add(tube2);

      // Connecting DNA Horizontal Base-Pair Rungs
      const rungCount = 18;
      const rungMat = new THREE.MeshStandardMaterial({
        color: goldColor,
        metalness: 0.95,
        roughness: 0.1,
        emissive: goldColor,
        emissiveIntensity: 0.6,
      });

      for (let i = 0; i <= rungCount; i++) {
        const t = i / rungCount;
        const p1 = curve1.getPoint(t);
        const p2 = curve2.getPoint(t);
        const dir = new THREE.Vector3().subVectors(p2, p1);
        const len = dir.length();

        const rungGeo = new THREE.CylinderGeometry(0.028, 0.028, len, 8);
        const rung = new THREE.Mesh(rungGeo, rungMat);
        rung.position.copy(p1).addScaledVector(dir, 0.5);
        rung.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        dysonContainer.add(rung);

        // Glowing Node Bead on each strand
        const nodeBeadGeo = new THREE.SphereGeometry(0.08, 12, 12);
        const nodeBead1 = new THREE.Mesh(nodeBeadGeo, tubeMat1);
        nodeBead1.position.copy(p1);
        dysonContainer.add(nodeBead1);

        const nodeBead2 = new THREE.Mesh(nodeBeadGeo, tubeMat2);
        nodeBead2.position.copy(p2);
        dysonContainer.add(nodeBead2);
      }

      // 3. Saturn-Style Equatorial Dyson Accretion Disk
      const dysonRingGroup = new THREE.Group();
      modelGroupRef.current.add(dysonRingGroup);
      gimbalRef.current = dysonRingGroup;

      const diskGeo = new THREE.RingGeometry(2.35, 2.7, 64);
      const diskMat = new THREE.MeshBasicMaterial({
        color: primaryColor,
        side: THREE.DoubleSide,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
      });
      const disk = new THREE.Mesh(diskGeo, diskMat);
      disk.rotation.x = Math.PI / 2.3;
      dysonRingGroup.add(disk);
    }

    // =========================================================================
    // MODEL 4: QUANTUM SILICON SUPERCOMPUTING MONOLITH
    // =========================================================================
    else {
      const monolithContainer = new THREE.Group();
      modelGroupRef.current.add(monolithContainer);
      midMeshRef.current = monolithContainer;

      // 1. Dark Interposer Substrate Base
      const subGeo = new THREE.BoxGeometry(3.3, 0.18, 3.3);
      const subMat = new THREE.MeshStandardMaterial({
        color: 0x090d16,
        roughness: 0.35,
        metalness: 0.85,
        wireframe: wireframe,
      });
      const substrate = new THREE.Mesh(subGeo, subMat);
      monolithContainer.add(substrate);

      // Gold Edge Bus Contacts (32 pins)
      const pinMat = new THREE.MeshStandardMaterial({
        color: goldColor,
        metalness: 0.95,
        roughness: 0.1,
        emissive: goldColor,
        emissiveIntensity: 0.4,
      });

      for (let i = -1.45; i <= 1.45; i += 0.42) {
        const pinNorth = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.28, 8), pinMat);
        pinNorth.position.set(i, -0.1, -1.6);
        monolithContainer.add(pinNorth);

        const pinSouth = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.28, 8), pinMat);
        pinSouth.position.set(i, -0.1, 1.6);
        monolithContainer.add(pinSouth);

        const pinEast = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.28, 8), pinMat);
        pinEast.position.set(1.6, -0.1, i);
        pinEast.rotation.z = Math.PI / 2;
        monolithContainer.add(pinEast);

        const pinWest = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.28, 8), pinMat);
        pinWest.position.set(-1.6, -0.1, i);
        pinWest.rotation.z = Math.PI / 2;
        monolithContainer.add(pinWest);
      }

      // 2. Central Tensor Compute Core Die (Metallic Indigo Luster)
      const coreGroup = new THREE.Group();
      monolithContainer.add(coreGroup);
      innerCoreRef.current = coreGroup;

      const dieGeo = new THREE.BoxGeometry(2.0, 0.25, 2.0);
      const dieMat = new THREE.MeshPhysicalMaterial({
        color: primaryColor,
        roughness: 0.08,
        metalness: 0.95,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        wireframe: wireframe,
        emissive: primaryColor,
        emissiveIntensity: 0.45,
      });
      const die = new THREE.Mesh(dieGeo, dieMat);
      die.position.y = 0.22;
      coreGroup.add(die);

      // 3. 4 HBM3e High-Bandwidth 3D Stacked Memory Cubes
      const hbmCoords = [
        [-1.15, 0.25, -1.15],
        [1.15, 0.25, -1.15],
        [-1.15, 0.25, 1.15],
        [1.15, 0.25, 1.15],
      ];

      hbmCoords.forEach(([x, y, z]) => {
        const hbmGeo = new THREE.BoxGeometry(0.68, 0.38, 0.68);
        const hbmMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          metalness: 0.9,
          roughness: 0.2,
          emissive: cyanColor,
          emissiveIntensity: 0.2,
          wireframe: wireframe,
        });
        const hbm = new THREE.Mesh(hbmGeo, hbmMat);
        hbm.position.set(x, y, z);
        monolithContainer.add(hbm);
      });

      // 4. Top Optical Engine Glass Prism
      const prismGeo = new THREE.CylinderGeometry(0.7, 0.95, 0.25, 8);
      const prismMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9,
        roughness: 0.05,
        metalness: 0.1,
        ior: 1.7,
        emissive: cyanColor,
        emissiveIntensity: 0.4,
      });
      const opticalEngine = new THREE.Mesh(prismGeo, prismMat);
      opticalEngine.position.y = 0.5;
      coreGroup.add(opticalEngine);

      // 5. Sweeping Laser Hologram Scanning Plane
      const laserGeo = new THREE.PlaneGeometry(3.6, 3.6);
      const laserMat = new THREE.MeshBasicMaterial({
        color: cyanColor,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      });
      const laserPlane = new THREE.Mesh(laserGeo, laserMat);
      laserPlane.rotation.x = Math.PI / 2;
      laserPlane.position.y = 0.3;
      monolithContainer.add(laserPlane);
      laserPlaneRef.current = laserPlane;

      // 6. 8 Floating Magnetic Levitation Qubits in Elliptical Orbit
      const qubitGroup = new THREE.Group();
      modelGroupRef.current.add(qubitGroup);
      gimbalRef.current = qubitGroup;

      for (let i = 0; i < 8; i++) {
        const theta = (i / 8) * Math.PI * 2;
        const qGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
        const qMat = new THREE.MeshStandardMaterial({
          color: goldColor,
          metalness: 0.95,
          roughness: 0.1,
          emissive: goldColor,
          emissiveIntensity: 0.7,
        });
        const qubit = new THREE.Mesh(qGeo, qMat);
        qubit.position.set(Math.cos(theta) * 2.5, 0.5 + Math.sin(theta * 2) * 0.3, Math.sin(theta) * 2.5);
        qubitGroup.add(qubit);
      }
    }

    // 3. Ambient Dynamic Particle Nebula
    if (particlesRef.current) {
      sceneRef.current.remove(particlesRef.current);
      particlesRef.current.geometry.dispose();
    }

    const particleCount = particleDensity;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() - 0.5) * 18;
      particlePositions[idx + 1] = (Math.random() - 0.5) * 18;
      particlePositions[idx + 2] = (Math.random() - 0.5) * 18;

      const pickColor = Math.random() > 0.5 ? primaryColor : (Math.random() > 0.5 ? cyanColor : goldColor);
      particleColors[idx] = pickColor.r;
      particleColors[idx + 1] = pickColor.g;
      particleColors[idx + 2] = pickColor.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    sceneRef.current.add(particles);
    particlesRef.current = particles;

    // Slow, beautiful entrance scale animation when 3D model is switched
    if (modelGroupRef.current) {
      modelGroupRef.current.scale.set(0.05, 0.05, 0.05);
      const startScaleTime = performance.now();
      const animateModelEntrance = () => {
        const elapsed = (performance.now() - startScaleTime) / 800; // 800ms slow smooth reveal
        if (elapsed < 1) {
          const ease = 1 - Math.pow(1 - elapsed, 3);
          if (modelGroupRef.current) {
            modelGroupRef.current.scale.set(ease, ease, ease);
          }
          requestAnimationFrame(animateModelEntrance);
        } else {
          if (modelGroupRef.current) {
            modelGroupRef.current.scale.set(1, 1, 1);
          }
        }
      };
      requestAnimationFrame(animateModelEntrance);
    }

  }, [activeModel, wireframe, particleDensity, themeConfig.primary]);

  // Mouse / Touch Drag Controls with Inertia
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !modelGroupRef.current) return;
    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;

    modelGroupRef.current.rotation.y += deltaX * 0.008;
    modelGroupRef.current.rotation.x += deltaY * 0.008;

    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch Support for Mobile / iPad
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !modelGroupRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - prevMousePosRef.current.x;
    const deltaY = e.touches[0].clientY - prevMousePosRef.current.y;

    modelGroupRef.current.rotation.y += deltaX * 0.008;
    modelGroupRef.current.rotation.x += deltaY * 0.008;

    prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Shockwave Pulse Trigger
  const triggerQuantumShockwave = () => {
    sound.playSuccess();
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.55 },
      colors: [themeConfig.primary, '#06b6d4', '#f59e0b', '#ec4899'],
    });

    if (modelGroupRef.current) {
      modelGroupRef.current.scale.set(1.28, 1.28, 1.28);
      setTimeout(() => {
        modelGroupRef.current?.scale.set(1, 1, 1);
      }, 320);
    }
  };

  const modelDefinitions = [
    {
      id: 'quantum-knot' as ModelType,
      label: 'Quantum Cyber-Knot',
      subtitle: 'Intertwined 5-Fold Torus Helix & Gimbal Rings',
      icon: Atom,
      color: '#4f46e5',
      badge: 'HYPER-GEOMETRY',
    },
    {
      id: 'tesseract-crystal' as ModelType,
      label: 'Hyper-Tesseract Crystal',
      subtitle: 'Volumetric Optical Glass Polychoron & Singularity',
      icon: Gem,
      color: '#06b6d4',
      badge: 'REFRACTIVE GLASS',
    },
    {
      id: 'neural-dyson' as ModelType,
      label: 'Neural Dyson Core',
      subtitle: 'Bio-Digital Synaptic Cortex & DNA Double Helix',
      icon: Brain,
      color: '#8b5cf6',
      badge: 'BIO-SYNTHETIC',
    },
    {
      id: 'silicon-monolith' as ModelType,
      label: 'Quantum Silicon Monolith',
      subtitle: 'Stacked Tensor Supercomputer & Floating Qubits',
      icon: Cpu,
      color: '#f59e0b',
      badge: 'SUPERCOMPUTING',
    },
  ];

  return (
    <div className="space-y-8 pb-36">
      
      <AnimatedCard index={0} className="vadim-glass-card rounded-3xl border border-slate-200/90 overflow-hidden flex flex-col relative shadow-sm">
        
        {/* Studio Header & Ultra-Pro Model Switcher Tabs */}
        <div className="p-5 sm:p-6 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl flex flex-wrap items-center justify-between gap-5 z-20">
          
          {/* Left: Branding & Active Model Info */}
          <div className="flex items-center gap-3.5">
            <div 
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md transition-all border border-transparent shrink-0"
              style={{
                background: `linear-gradient(135deg, ${themeConfig.primary}, #06b6d4)`,
                boxShadow: `0 4px 15px ${themeConfig.glow}`,
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  ✦ VISUAL PEDAGOGY & STUDENT 3D SHOWCASE
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  FACULTY MODELS & STUDENT CREATIONS
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-instrument italic text-slate-900 tracking-tight mt-1 font-normal">
                Interactive 3D Visual Learning Studio
              </h3>
            </div>
          </div>

          {/* 4 Ultra-Pro Model Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 overflow-x-auto no-scrollbar shrink-0">
            {modelDefinitions.map((m) => {
              const Icon = m.icon;
              const isActive = activeModel === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    sound.playClick(1100);
                    setActiveModel(m.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all btn-tactile cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{m.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Main 3D Canvas Area */}
        <div 
          className="w-full h-[480px] sm:h-[540px] relative select-none cursor-grab active:cursor-grabbing bg-gradient-to-b from-slate-100 via-white to-slate-100 overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Subtle Ambient Radial Glow behind the model */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-[110px] pointer-events-none opacity-20 transition-all duration-700"
            style={{
              background: `radial-gradient(circle, ${themeConfig.primary} 0%, rgba(6,182,212,0.3) 50%, transparent 80%)`,
            }}
          />

          {/* Three.js Canvas Mount */}
          <div ref={containerRef} className="w-full h-full" />

          {/* Top Left Live Telemetry HUD */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
            <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-xs text-[11px] font-mono text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>LIVE RENDER: <strong className="text-slate-900">{fps} FPS</strong></span>
              <span className="text-slate-300">|</span>
              <span>PARALLEL SHADERS</span>
            </div>

            <div className="px-3 py-1 rounded-full bg-white/90 text-slate-800 backdrop-blur-md border border-slate-200/90 shadow-xs text-[10px] font-mono flex items-center gap-2">
              <span className="text-emerald-600 font-bold">● REFLECTION: DIELECTRIC</span>
              <span className="text-slate-300">|</span>
              <span className="text-indigo-600 font-semibold">CLEARCOAT 1.0</span>
            </div>
          </div>

          {/* Top Right Floating Toolbar */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            
            {/* Wireframe Toggle */}
            <button
              onClick={() => {
                sound.playClick();
                setWireframe((prev) => !prev);
              }}
              className={`p-2.5 rounded-xl border text-xs font-mono uppercase tracking-wider font-semibold transition-all btn-tactile cursor-pointer shadow-xs flex items-center gap-1.5 ${
                wireframe 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-indigo-100' 
                  : 'bg-white/90 hover:bg-white text-slate-700 border-slate-200'
              }`}
              title="Toggle Wireframe Grid"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">{wireframe ? 'Solid' : 'Wireframe'}</span>
            </button>

            {/* Auto Rotation Toggle */}
            <button
              onClick={() => {
                sound.playClick();
                setAutoRotate((prev) => !prev);
              }}
              className={`p-2.5 rounded-xl border text-xs font-mono uppercase tracking-wider font-semibold transition-all btn-tactile cursor-pointer shadow-xs flex items-center gap-1.5 ${
                autoRotate 
                  ? 'bg-slate-900 text-white border-slate-800' 
                  : 'bg-white/90 hover:bg-white text-slate-700 border-slate-200'
              }`}
              title="Toggle Auto Multi-Axis Spin"
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin text-white' : ''}`} />
              <span className="hidden sm:inline text-[10px]">Auto Spin</span>
            </button>

            {/* Quantum Shockwave Trigger Button */}
            <button
              onClick={triggerQuantumShockwave}
              className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-indigo-700 border border-slate-200 transition-all btn-tactile cursor-pointer shadow-xs flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider font-semibold"
              title="Trigger Quantum Energy Shockwave"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline text-[10px]">Pulse</span>
            </button>
          </div>

        </div>

        {/* Bottom Model Inspector & Parameter Tuner */}
        <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-white/95 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 z-20">
          
          {/* Model Details */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                {modelDefinitions.find((m) => m.id === activeModel)?.label}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-mono">
                {modelDefinitions.find((m) => m.id === activeModel)?.subtitle}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Interactive multi-layer geometry rendered with custom dielectric specular reflections, sub-pixel clearcoat, and real-time counter-rotating gyroscope physics.
            </p>
          </div>

          {/* Export Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                sound.playSuccess();
                confetti({ particleCount: 50, spread: 60 });
              }}
              className="px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold text-white transition-all btn-tactile cursor-pointer border border-transparent shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${themeConfig.primary}, #8b5cf6)`,
                boxShadow: `0 4px 15px ${themeConfig.glow}`,
              }}
            >
              Export 3D USDZ / GLTF
            </button>
          </div>

        </div>
      </AnimatedCard>

      {/* Volumetric Architectural Environment Reference (Page 4 Featured Image 1 - MEDIUM-TO-BIG) */}
      <AnimatedCard index={1} className="vadim-glass-card rounded-3xl border border-slate-200/90 overflow-hidden grid grid-cols-1 md:grid-cols-12 items-center shadow-sm">
        <div className="md:col-span-6 relative h-72 md:h-full min-h-[300px] md:min-h-[360px] overflow-hidden border-b md:border-b-0 md:border-r border-slate-200/80 group">
          <img 
            src="/images/curved-library.png" 
            alt="Parametric Curved Wood Architecture & Spatial Lighting"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white/90 text-indigo-900 backdrop-blur-md border border-slate-200 shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            PARAMETRIC SPATIAL ENVIRONMENT
          </div>
        </div>

        <div className="md:col-span-6 p-6 sm:p-8 space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              PHYSICS & LIGHT DISPERSION
            </span>
            <span className="text-xs font-mono text-slate-400">VisionOS Volumetric Standard</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-instrument italic text-slate-900 tracking-tight font-normal">
            Architectural Volumetric Lighting & Acoustic Modeling
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Inspired by Stanford d.school's curved wood spatial acoustic pavilions and the Apple Vision Pro volumetric glass engine. Every 3D node above inherits real-world dielectric specular reflections, metallic roughness maps, and dynamic shadow culling.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="px-3 py-1 rounded-xl bg-slate-100 text-[11px] font-mono text-slate-700 font-medium border border-slate-200">
              60 FPS Metal Shaders
            </div>
            <div className="px-3 py-1 rounded-xl bg-slate-100 text-[11px] font-mono text-slate-700 font-medium border border-slate-200">
              Sub-Pixel Glass Physics
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Stanford d.school Spatial Prototyping Bay & Creative Media Lab (Page 4 Featured Image 2 - BIG & IMMERSIVE) */}
      <AnimatedCard index={2} className="vadim-glass-card rounded-3xl border border-slate-200/90 overflow-hidden relative group shadow-sm">
        <div className="relative h-[380px] sm:h-[440px] md:h-[480px] overflow-hidden">
          <img 
            src="/images/media-lab.jpg" 
            alt="Stanford d.school Spatial Media Prototyping Bay with Neon Lighting and Creative Designers"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/98 via-[#0a0a0b]/60 to-[#0a0a0b]/20 p-6 sm:p-10 flex flex-col justify-between">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-black/70 text-pink-300 backdrop-blur-md border border-pink-400/30 shadow-lg flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-pink-400" />
                  UNIFLOW INSTITUTE • SPATIAL MEDIA LAB
                </span>
                <span className="hidden sm:inline-flex text-xs font-mono text-white/80 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                  TOP STUDENT 3D SHOWCASE & WORKSHOP
                </span>
              </div>

              <div className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-black/60 text-cyan-300 backdrop-blur-md border border-cyan-400/30 flex items-center gap-2">
                <Video className="w-3.5 h-3.5 text-cyan-400" />
                <span>4K 60FPS SHADER PIPELINE</span>
              </div>
            </div>

            {/* Bottom Content & CTAs */}
            <div className="space-y-4">
              <div className="max-w-2xl space-y-2">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-amber-300">
                  STUDENT 3D CREATION GALLERY • VISUAL PEDAGOGY
                </span>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-instrument italic text-white tracking-tight leading-[1.1] drop-shadow-lg font-normal">
                  Spatial Visual Prototyping & Student 3D Showcase
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal max-w-xl">
                  Where Uniflow faculty teach complex concepts visually and students who create top premium 3D models showcase their work, test spatial assets on Vision Pro headsets, and apply visual theory into real-world applications.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    sound.playSuccess();
                    confetti({ particleCount: 50, spread: 70 });
                  }}
                  className="px-6 py-3.5 rounded-2xl text-xs font-mono uppercase tracking-wider font-semibold text-white transition-all btn-tactile cursor-pointer border border-white/15 shadow-xl flex items-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${themeConfig.primary}, #ec4899)`,
                    boxShadow: `0 6px 20px ${themeConfig.glow}`,
                  }}
                >
                  <Glasses className="w-4 h-4" />
                  <span>Launch Live AR Spatial Simulator</span>
                </button>

                <div className="flex items-center gap-3 text-xs font-mono text-white/70 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-pink-400" />
                  <span>Sony FX3 Optical Rig Synchronized</span>
                  <span className="text-white/20">•</span>
                  <span className="text-amber-300 font-bold">128GB Unified GPU Memory</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </AnimatedCard>

    </div>
  );
};
