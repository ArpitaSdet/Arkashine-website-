"use client";

import { motion } from "motion/react";
import { AmbientParticles } from "./AmbientParticles";

export function ContinuousBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#16262C]">
      {/* Glow 1: Deep Blue #1F3FFF at 18% top-right */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.18, 0.22, 0.18],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[20%] -right-[15%] w-[85vw] h-[85vw] max-w-[1200px] max-h-[1200px] rounded-full blur-[140px]"
        style={{
          background: "radial-gradient(circle, rgba(47, 111, 98, 0.24) 0%, rgba(47, 111, 98, 0.08) 50%, transparent 75%)",
        }}
      />

      {/* Glow 2: Warm Amber #E0A458 at 10% bottom-left */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.10, 0.14, 0.10],
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-[20%] -left-[15%] w-[75vw] h-[75vw] max-w-[1100px] max-h-[1100px] rounded-full blur-[130px]"
        style={{
          background: "radial-gradient(circle, rgba(224, 164, 88, 0.16) 0%, rgba(224, 164, 88, 0.05) 50%, transparent 75%)",
        }}
      />

      {/* 4% Film Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Sparse Drifting Amber Dust */}
      <AmbientParticles />
    </div>
  );
}
