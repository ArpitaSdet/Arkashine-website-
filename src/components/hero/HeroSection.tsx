"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { NutrientBubblesOverlay } from "./NutrientBubblesOverlay";

// Client-only cinematic 4-phase transformation canvas
const CinematicTransformationCanvas = dynamic(
  () =>
    import("./CinematicTransformationCanvas").then(
      (m) => m.CinematicTransformationCanvas
    ),
  { ssr: false }
);

export function HeroSection() {
  const [activePhase, setActivePhase] = useState(0);

  const scrollToNext = () => {
    const nextSec = document.getElementById("soillenz");
    if (nextSec) {
      nextSec.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#042729] text-[#F7F8F4]"
    >
      {/* Layer 1: Full-Screen 10-Second Continuous Cinematic Transformation Canvas */}
      <div className="absolute inset-0 z-0">
        <CinematicTransformationCanvas onPhaseChange={setActivePhase} />
      </div>

      {/* Layer 2: Subtle Deep Teal Readability Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#042729]/95 via-[#004752]/30 to-[#042729]/50"
        aria-hidden="true"
      />

      {/* Layer 3: Floating Scientific Nutrient Indicators (N, P, K, pH, etc.) */}
      <NutrientBubblesOverlay activePhase={activePhase} />

      {/* Layer 4: Centered Editorial Typography */}
      <div className="relative z-30 flex h-full w-full flex-col items-center justify-center px-6 text-center pointer-events-none">
        <div className="max-w-5xl flex flex-col items-center">
          
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] text-[#87C45E] mb-6 font-semibold"
          >
            ARKASHINE · SOIL INTELLIGENCE HARDWARE
          </motion.p>

          {/* Large Two-Line Heading */}
          <h1 className="font-display font-bold text-[clamp(2.75rem,7vw,6.5rem)] leading-[1.04] tracking-[-0.035em] text-[#F7F8F4] drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)]">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              SOIL IS MORE THAN
            </motion.span>
            <motion.span
              className="block mt-1 sm:mt-2 text-[#EAF4E2] font-semibold"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              WHAT YOU SEE.
            </motion.span>
          </h1>

          {/* Small Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 sm:mt-8 max-w-xl text-base sm:text-lg text-[#EAF4E2]/85 font-normal leading-relaxed"
          >
            Advanced soil intelligence hardware engineered for agricultural applications.
          </motion.p>

          {/* Minimal CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-10 pointer-events-auto"
          >
            <button
              onClick={scrollToNext}
              className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#87C45E] hover:bg-[#72b04b] text-[#042729] font-medium text-sm sm:text-base tracking-wide transition-all duration-300 shadow-[0_4px_24px_rgba(135,196,94,0.3)] hover:shadow-[0_6px_32px_rgba(135,196,94,0.45)] cursor-pointer"
            >
              <span>EXPLORE OUR TECHNOLOGY</span>
              <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </motion.div>
        </div>

        {/* Layer 5: Small Scroll Indicator */}
        <motion.button
          onClick={scrollToNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="group pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
          aria-label="Scroll to explore SoiLenz 2.0"
        >
          <div className="relative flex h-8 w-4 justify-center rounded-full border border-white/30 p-1">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1 rounded-full bg-[#87C45E]"
            />
          </div>
        </motion.button>
      </div>
    </section>
  );
}
