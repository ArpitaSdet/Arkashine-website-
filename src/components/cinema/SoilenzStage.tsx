"use client";

/**
 * SoiLenz 2.0 product stage — the real device photo (eye-level three-quarter view:
 * front and side visible, no top view) sitting on a reflective studio floor, same look as the pH/EC shot.
 * Scrolling gives a slow push-in; moving the cursor adds a small 3D tilt.
 */

import { useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;
export const SOILENZ_STUDIO = { src: "/images/products/soillenz-2-studio.webp", w: 1376, h: 768 };

export function SoilenzStage({ caption }: { caption: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.6 });
  const scale = useTransform(p, [0, 0.5, 1], reduce ? [1, 1, 1] : [1.08, 1.02, 1.06]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 120, damping: 18 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="relative mx-auto w-full max-w-[640px] [perspective:1200px]">
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative aspect-[16/10] w-full overflow-hidden rounded-[28px] bg-[#06201e] shadow-[0_40px_80px_-30px_rgba(6,32,30,0.75)] ring-1 ring-white/10"
      >
        <motion.div className="absolute inset-0" style={{ scale, transformOrigin: "50% 50%" }}>
          <Image
            src={SOILENZ_STUDIO.src}
            alt="SoiLenz 2.0 portable soil lab sitting on its base, seen at an angle with the built-in printer at the front"
            fill
            priority
            sizes="(min-width:1024px) 640px, 100vw"
            className="object-cover"
          />
        </motion.div>

        {/* light sweep */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
          initial={{ left: "-30%" }}
          animate={reduce ? undefined : { left: ["-30%", "130%"] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
        />

        <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/25 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fff]/85 backdrop-blur-md">
          SoiLenz 2.0 · Made in India
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={caption}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease }}
            className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-black/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#fff] backdrop-blur-md"
          >
            {caption}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
