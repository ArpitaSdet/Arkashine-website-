"use client";

import { motion } from "motion/react";

interface StopIndicatorProps {
  currentStop: number; // 0 to 5
  showScrollCue: boolean;
}

export function StopIndicator({ currentStop, showScrollCue }: StopIndicatorProps) {
  return (
    <>
      {/* 5 Dots indicator on right edge */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2.5 pointer-events-none">
        {[1, 2, 3, 4, 5].map((index) => {
          const isActive = currentStop === index;
          return (
            <motion.div
              key={index}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`rounded-full transition-colors duration-300 ${
                isActive
                  ? "w-3 h-10 bg-leaf shadow-[0_0_12px_#2F9E44]"
                  : "w-3 h-3 bg-white/25 hover:bg-white/40"
              }`}
            />
          );
        })}
      </div>

      {/* Scroll cue at bottom center */}
      {showScrollCue && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 font-semibold">
            Scroll
          </span>
          <div className="w-5 h-9 rounded-full border-[1.5px] border-white/40 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1 h-2 rounded-full bg-leaf shadow-[0_0_6px_#2F9E44]"
            />
          </div>
        </motion.div>
      )}
    </>
  );
}
