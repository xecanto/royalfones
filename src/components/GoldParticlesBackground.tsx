import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 350;
const DUST_COUNT = 150;

/** Generate a soft circular texture for round particles */
const createCircleTexture = (size = 64, color = "#c9a84c") => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const half = size / 2;
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.4, color);
  gradient.addColorStop(0.7, `${color}88`);
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(half, half, half, 0, Math.PI * 2);
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const GoldParticles = () => {
  const meshRef = useRef<THREE.Points>(null);

  const { positions, speeds, offsets, sizes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT);
    const offsets = new Float32Array(PARTICLE_COUNT);
    const sizes = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      speeds[i] = 0.08 + Math.random() * 0.25;
      offsets[i] = Math.random() * Math.PI * 2;
      sizes[i] = 0.03 + Math.random() * 0.06;
    }
    return { positions, speeds, offsets, sizes };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, sizes]);

  const circleMap = useMemo(() => createCircleTexture(64, "#c9a84c"), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    const t = clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3 + 1] += speeds[i] * 0.007;
      arr[i * 3] += Math.sin(t * 0.25 + offsets[i]) * 0.004;
      arr[i * 3 + 2] += Math.cos(t * 0.15 + offsets[i]) * 0.002;
      if (arr[i * 3 + 1] > 12) {
        arr[i * 3 + 1] = -12;
        arr[i * 3] = (Math.random() - 0.5) * 24;
      }
    }
    posAttr.needsUpdate = true;
    meshRef.current.rotation.y = t * 0.015;
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        size={0.08}
        map={circleMap}
        color="#c9a84c"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const GoldDust = () => {
  const ref = useRef<THREE.Points>(null);

  const { positions } = useMemo(() => {
    const positions = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return { positions };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const circleMap = useMemo(() => createCircleTexture(32, "#e8d48b"), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = -t * 0.012;
    ref.current.rotation.x = Math.sin(t * 0.08) * 0.06;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        map={circleMap}
        color="#e8d48b"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const GoldGlow = () => {
  const ref = useRef<THREE.Points>(null);

  const { positions } = useMemo(() => {
    const positions = new Float32Array(30 * 3);
    for (let i = 0; i < 30; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return { positions };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const circleMap = useMemo(() => createCircleTexture(128, "#d4a843"), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.008;
    ref.current.rotation.z = Math.sin(t * 0.05) * 0.03;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.25}
        map={circleMap}
        color="#d4a843"
        transparent
        opacity={0.15}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const GoldParticlesBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <GoldParticles />
        <GoldDust />
        <GoldGlow />
      </Canvas>
    </div>
  );
};

export default GoldParticlesBackground;
