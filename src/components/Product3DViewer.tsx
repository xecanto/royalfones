import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
  Html,
  useProgress,
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Box, RotateCcw, Maximize2 } from "lucide-react";
import * as THREE from "three";
import { resolveLocalGlb } from "@/lib/localGlbMap";

/* ─── Loading progress overlay ─── */
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 select-none">
        <div className="relative w-12 h-12">
          <svg viewBox="0 0 48 48" className="w-12 h-12 -rotate-90">
            <circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke="hsl(43 74% 49% / 0.15)"
              strokeWidth="2"
            />
            <circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke="hsl(43 74% 49%)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${(progress / 100) * 125.7} 125.7`}
              style={{ transition: "stroke-dasharray 0.3s ease" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-body font-bold tracking-widest text-[hsl(43,74%,49%)]">
            {Math.round(progress)}%
          </span>
        </div>
        <p className="text-[9px] font-body tracking-[0.3em] uppercase text-[hsl(43,74%,49%)/0.7]">
          Loading Model
        </p>
      </div>
    </Html>
  );
}

/* ─── Actual GLB model (only mounted when URL is provided) ─── */
function ModelMesh({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} dispose={null} />
    </Center>
  );
}

/* ─── Decorative placeholder when no model is available ─── */
function PlaceholderMesh() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.5;
  });

  const gold = new THREE.MeshStandardMaterial({
    color: new THREE.Color("hsl(43, 74%, 49%)"),
    metalness: 0.9,
    roughness: 0.25,
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh material={gold} castShadow>
        <boxGeometry args={[0.7, 1.42, 0.085]} />
      </mesh>
      {/* Screen bezel inset */}
      <mesh position={[0, 0.02, 0.048]} material={
        new THREE.MeshStandardMaterial({ color: "#0a0a0a", roughness: 0.05, metalness: 0.3 })
      }>
        <planeGeometry args={[0.58, 1.1]} />
      </mesh>
    </group>
  );
}

/* ─── Main Viewer Component ─── */
interface Product3DViewerProps {
  modelUrl?: string | null;
  productName: string;
  /** Phone model string used to look up a local GLB if modelUrl is not set */
  phoneModel?: string | null;
}

const Product3DViewer = ({ modelUrl, productName, phoneModel }: Product3DViewerProps) => {
  // Prefer explicit modelUrl; fall back to local asset matched by phoneModel or productName
  const resolvedUrl =
    modelUrl ??
    resolveLocalGlb(phoneModel) ??
    resolveLocalGlb(productName);
  const [resetKey, setResetKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsRef = useRef<any>(null);

  const reset = () => {
    setResetKey((k) => k + 1);
  };

  const toggleFullscreen = () => setIsFullscreen((v) => !v);

  return (
    <AnimatePresence>
      <motion.div
        key={isFullscreen ? "full" : "inline"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={
          isFullscreen
            ? "fixed inset-0 z-[200] bg-background"
            : "relative aspect-square w-full"
        }
      >
        {/* Canvas */}
        <Canvas
          key={resetKey}
          shadows
          camera={{ position: [0, 0.6, 2.8], fov: 40 }}
          style={{ background: "transparent" }}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          {/* Lights */}
          <ambientLight intensity={0.25} />
          <directionalLight
            position={[3, 6, 3]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
            color="hsl(43, 74%, 80%)"
          />
          <pointLight position={[-3, 2, -2]} intensity={0.6} color="hsl(43, 74%, 49%)" />

          <Environment preset="studio" />

          <Suspense fallback={<Loader />}>
            {resolvedUrl ? (
              <ModelMesh url={resolvedUrl} />
            ) : (
              <PlaceholderMesh />
            )}

            <ContactShadows
              position={[0, -0.82, 0]}
              opacity={0.35}
              scale={3}
              blur={2.5}
              far={2}
              color="hsl(43, 74%, 30%)"
            />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            autoRotate
            autoRotateSpeed={1.2}
            enableZoom
            enablePan={false}
            minDistance={1.2}
            maxDistance={6}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Canvas>

        {/* Overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top-left label */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-background/70 border border-primary/30 backdrop-blur-sm">
              <Box size={9} className="text-primary" />
              <span className="font-body text-[9px] tracking-[0.25em] uppercase text-primary/80">
                3D View
              </span>
            </div>
          </div>

          {/* Controls hint (bottom-center) */}
          {!resolvedUrl && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 bg-background/70 border border-border backdrop-blur-sm font-body text-[8px] tracking-[0.25em] uppercase text-muted-foreground">
                3D model coming soon — preview above
              </span>
            </div>
          )}

          {resolvedUrl && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 bg-background/70 border border-border backdrop-blur-sm font-body text-[8px] tracking-[0.25em] uppercase text-muted-foreground">
                Drag to rotate · Scroll to zoom
              </span>
            </div>
          )}
        </div>

        {/* Action buttons (top-right) – pointer-events enabled */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={reset}
            title="Reset view"
            className="w-8 h-8 flex items-center justify-center bg-background/70 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all backdrop-blur-sm"
          >
            <RotateCcw size={12} />
          </button>
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            className="w-8 h-8 flex items-center justify-center bg-background/70 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all backdrop-blur-sm"
          >
            <Maximize2 size={12} />
          </button>
        </div>

        {/* Fullscreen close */}
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-6 right-6 px-4 py-2 bg-background/80 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all font-body text-[9px] tracking-[0.3em] uppercase backdrop-blur-sm"
          >
            Close
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Product3DViewer;
