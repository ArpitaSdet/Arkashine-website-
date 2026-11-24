"use client";

import { motion } from "motion/react";

/**
 * REFINED MINIMAL NUTRIENT BUBBLE OVERLAY
 * Displays only the 4 primary essential indicators: N, P, K, and pH
 * Translucent glass-like spheres with soft highlights and natural float dynamics.
 */

interface BubbleConfig {
  id: string;
  symbol: string;
  color: string;
  rimColor: string;
  size: number;
  xPct: number;
  yPct: number;
  floatSpeed: number;
}

const PRIMARY_BUBBLES: BubbleConfig[] = [
  {
    id: "n",
    symbol: "N",
    color: "rgba(135, 196, 94, 0.4)",
    rimColor: "rgba(234, 244, 226, 0.9)",
    size: 74,
    xPct: 26,
    yPct: 46,
    floatSpeed: 4.8,
  },
  {
    id: "p",
    symbol: "P",
    color: "rgba(224, 122, 95, 0.38)",
    rimColor: "rgba(255, 200, 180, 0.85)",
    size: 68,
    xPct: 74,
    yPct: 40,
    floatSpeed: 5.2,
  },
  {
    id: "k",
    symbol: "K",
    color: "rgba(163, 136, 238, 0.35)",
    rimColor: "rgba(220, 205, 255, 0.85)",
    size: 70,
    xPct: 34,
    yPct: 66,
    floatSpeed: 4.4,
  },
  {
    id: "ph",
    symbol: "pH",
    color: "rgba(110, 195, 201, 0.4)",
    rimColor: "rgba(210, 245, 250, 0.9)",
    size: 66,
    xPct: 68,
    yPct: 62,
    floatSpeed: 4.9,
  },
];

export function NutrientBubblesOverlay({ activePhase }: { activePhase: number }) {
  // Bubbles emerge in Phase 1 (Microscopic) and dissolve in Phase 3
  const isVisible = activePhase === 1 || activePhase === 2;

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-20 overflow-hidden transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {PRIMARY_BUBBLES.map((bubble, i) => (
        <motion.div
          key={bubble.id}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={
            isVisible
              ? {
                  opacity: 1,
                  scale: 1,
                  y: ["0px", "-18px", "0px"],
                  x: ["0px", i % 2 === 0 ? "8px" : "-8px", "0px"],
                }
              : { opacity: 0, scale: 0.4 }
          }
          transition={{
            opacity: { duration: 1.2, delay: i * 0.15 },
            scale: { duration: 1.2, delay: i * 0.15 },
            y: {
              duration: bubble.floatSpeed,
              repeat: Infinity,
              ease: "easeInOut",
            },
            x: {
              duration: bubble.floatSpeed * 1.3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          style={{
            left: `${bubble.xPct}%`,
            top: `${bubble.yPct}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        >
          {/* Outer Glass Sphere with Natural Glow Ring */}
          <div
            style={{
              background: `radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.45) 0%, ${bubble.color} 45%, rgba(4, 39, 41, 0.6) 90%)`,
              boxShadow: `0 0 24px ${bubble.color}, inset 0 0 14px ${bubble.rimColor}, inset -4px -4px 10px rgba(0, 0, 0, 0.5)`,
              border: `1px solid ${bubble.rimColor}`,
            }}
            className="relative flex h-full w-full items-center justify-center rounded-full backdrop-blur-xs"
          >
            {/* Curved Highlight Glint */}
            <div className="absolute top-[12%] left-[18%] h-[30%] w-[38%] rounded-full bg-gradient-to-br from-white/80 via-white/20 to-transparent blur-[0.5px] transform -rotate-25 pointer-events-none" />

            {/* Scientific Symbol */}
            <span
              style={{
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.8), 0 0 8px rgba(255, 255, 255, 0.4)",
              }}
              className="font-mono font-bold leading-none text-[#F7F8F4] text-base sm:text-lg"
            >
              {bubble.symbol}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
