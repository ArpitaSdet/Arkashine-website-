"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface DustParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  depth: number;
}

export function AmbientParticles() {
  const [particles, setParticles] = useState<DustParticle[]>([]);

  useEffect(() => {
    // Generate 26 sparse drifting amber dust particles across 3 depths
    const items: DustParticle[] = Array.from({ length: 26 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1.2,
      color: i % 3 === 0 ? "rgba(232, 177, 93, 0.45)" : i % 3 === 1 ? "rgba(224, 164, 88, 0.35)" : "rgba(91, 140, 255, 0.25)", // amber dust with subtle faint blue speck
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 6,
      depth: (i % 3) + 1, // depth 1 (far), 2 (mid), 3 (near)
    }));
    setParticles(items);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * (p.depth === 3 ? 1.4 : p.depth === 1 ? 0.8 : 1.1),
            height: p.size * (p.depth === 3 ? 1.4 : p.depth === 1 ? 0.8 : 1.1),
            backgroundColor: p.color,
            borderRadius: "50%",
            boxShadow: p.depth === 3 ? "0 0 8px rgba(232, 177, 93, 0.6)" : "none",
          }}
          animate={{
            y: [0, -140 * p.depth],
            x: [0, Math.sin(p.id * 1.5) * 24 * p.depth],
            opacity: [0, 0.65, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: p.duration,
            delay: p.delay,
            ease: "easeInOut",
          }}
          className="absolute blur-[0.4px]"
        />
      ))}
    </div>
  );
}
