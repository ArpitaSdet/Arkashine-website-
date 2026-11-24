"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

export function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [stage, setStage] = useState<"drawing" | "splitting" | "done">("drawing");

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStage("splitting");
    }, 1300);

    const t2 = setTimeout(() => {
      setStage("done");
      if (onComplete) onComplete();
    }, 1900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  if (stage === "done") return null;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
      {/* Top Half Curtain */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: stage === "splitting" ? "-100%" : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 h-1/2 bg-[#16262C] border-b border-white/5"
      />

      {/* Bottom Half Curtain */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: stage === "splitting" ? "100%" : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#16262C] border-t border-white/5"
      />

      {/* Center Minimal Wordmark Reveal */}
      <AnimatePresence>
        {stage !== "splitting" && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto z-10"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center">
                <Image
                  src="/images/logo/arkashine-logo-bold-white.png"
                  alt="ArkaShine"
                  width={220}
                  height={82}
                  unoptimized
                  priority
                  className="h-14 sm:h-16 w-auto object-contain"
                />
              </div>
              <span className="text-xs text-[#8F99B0] tracking-widest font-mono uppercase mt-1">
                Soil intelligence, made in India
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
