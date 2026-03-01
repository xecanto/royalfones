import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxDividerProps {
  text?: string;
}

const ParallaxDivider = ({ text }: ParallaxDividerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <div ref={ref} className="relative py-20 overflow-hidden">
      {/* Primary text row */}
      <motion.div
        style={{ x, opacity, scale }}
        className="flex items-center gap-8 whitespace-nowrap"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="font-display text-6xl sm:text-8xl lg:text-9xl font-bold text-primary/[0.05] select-none tracking-wider"
          >
            {text || "ROYAL FONES"}
          </span>
        ))}
      </motion.div>
      {/* Counter-moving secondary row for depth */}
      <motion.div
        style={{ x: x2, opacity }}
        className="flex items-center gap-8 whitespace-nowrap mt-2"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="font-display text-4xl sm:text-5xl font-bold text-primary/[0.03] select-none tracking-wider"
          >
            {text || "ROYAL FONES"}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default ParallaxDivider;
