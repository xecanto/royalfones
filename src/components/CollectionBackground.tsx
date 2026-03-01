import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Pre-seeded floating orbs & particle positions (stable, no random on each render)
const ORBS = [
  { cx: "12%",  cy: "20%", r: 320, delay: 0,    dur: 14 },
  { cx: "85%",  cy: "70%", r: 260, delay: 3,    dur: 18 },
  { cx: "50%",  cy: "50%", r: 400, delay: 1.5,  dur: 22 },
  { cx: "72%",  cy: "15%", r: 180, delay: 5,    dur: 16 },
  { cx: "20%",  cy: "80%", r: 210, delay: 2,    dur: 20 },
];

const PARTICLES = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  left: `${(i * 2.77 + 1.3) % 100}%`,
  top: `${(i * 3.13 + 0.9) % 100}%`,
  size: 1 + (i % 3),
  delay: (i * 0.27) % 6,
  dur: 8 + (i % 8),
}));

/** Animated diamond / hexagonal lattice SVG — pure CSS, no canvas */
const DiamondLattice = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.045] pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="diamond-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        {/* Diamond shape */}
        <polygon
          points="30,2 58,30 30,58 2,30"
          fill="none"
          stroke="hsl(43 74% 49%)"
          strokeWidth="0.8"
        />
        {/* Inner accent dot */}
        <circle cx="30" cy="30" r="1.5" fill="hsl(43 74% 49%)" opacity="0.6" />
      </pattern>

      {/* Radial fade so the grid vignettes out at edges */}
      <radialGradient id="grid-fade" cx="50%" cy="50%" r="55%">
        <stop offset="0%"   stopColor="white" stopOpacity="1" />
        <stop offset="60%"  stopColor="white" stopOpacity="0.6" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <mask id="grid-mask">
        <rect width="100%" height="100%" fill="url(#grid-fade)" />
      </mask>
    </defs>
    <rect width="100%" height="100%" fill="url(#diamond-grid)" mask="url(#grid-mask)" />
  </svg>
);

const CollectionBackground = () => {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none z-0">

      {/* === 1. Diamond Lattice === */}
      <DiamondLattice />

      {/* === 2. Deep radial gradient base === */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 50%, hsl(43 74% 49% / 0.06) 0%, transparent 70%)",
        }}
      />

      {/* === 3. Animated Orbs === */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: orb.cx,
            top: orb.cy,
            width: orb.r,
            height: orb.r,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, hsl(43 74% 49% / 0.09) 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: orb.dur,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* === 4. Gold dust particles === */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: 0,
          }}
          animate={{
            opacity: [0, 0.7, 0],
            y: [0, -30, -60],
            scale: [0.8, 1.3, 0.6],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* === 5. Corner ornamental lines === */}
      <svg
        className="absolute top-0 left-0 w-40 h-40 opacity-20 pointer-events-none"
        viewBox="0 0 160 160"
      >
        <path d="M 0 40 L 0 0 L 40 0" fill="none" stroke="hsl(43 74% 49%)" strokeWidth="1" />
        <path d="M 0 20 L 0 0 L 20 0" fill="none" stroke="hsl(43 74% 49%)" strokeWidth="0.5" />
      </svg>
      <svg
        className="absolute top-0 right-0 w-40 h-40 opacity-20 pointer-events-none"
        viewBox="0 0 160 160"
      >
        <path d="M 160 40 L 160 0 L 120 0" fill="none" stroke="hsl(43 74% 49%)" strokeWidth="1" />
        <path d="M 160 20 L 160 0 L 140 0" fill="none" stroke="hsl(43 74% 49%)" strokeWidth="0.5" />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-40 h-40 opacity-20 pointer-events-none"
        viewBox="0 0 160 160"
      >
        <path d="M 0 120 L 0 160 L 40 160" fill="none" stroke="hsl(43 74% 49%)" strokeWidth="1" />
        <path d="M 0 140 L 0 160 L 20 160" fill="none" stroke="hsl(43 74% 49%)" strokeWidth="0.5" />
      </svg>
      <svg
        className="absolute bottom-0 right-0 w-40 h-40 opacity-20 pointer-events-none"
        viewBox="0 0 160 160"
      >
        <path d="M 160 120 L 160 160 L 120 160" fill="none" stroke="hsl(43 74% 49%)" strokeWidth="1" />
        <path d="M 160 140 L 160 160 L 140 160" fill="none" stroke="hsl(43 74% 49%)" strokeWidth="0.5" />
      </svg>
    </div>
  );
};

export default CollectionBackground;
