"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

export type Focus = { x: number; y: number; s: number };

/**
 * Photograph that glides/zooms so a focus point (in % of the *image*) sits at
 * the centre of the frame — "feature inspection". Works for any frame aspect
 * (the image always covers the frame, like object-fit: cover).
 */
export function FocusImage({
  src,
  alt,
  natural,
  frame,
  focus,
  priority,
  sizes,
  className = "",
  marker = true,
}: {
  src: string;
  alt: string;
  natural: { w: number; h: number };
  frame?: { w: number; h: number };
  focus: Focus | null;
  priority?: boolean;
  sizes?: string;
  className?: string;
  marker?: boolean;
}) {
  const reduce = useReducedMotion();
  const fr = frame ?? natural;
  const ai = natural.w / natural.h;
  const ac = fr.w / fr.h;
  // image box inside the frame, in frame %
  const W = ai > ac ? (ai / ac) * 100 : 100;
  const H = ai > ac ? 100 : (ac / ai) * 100;
  const L = (100 - W) / 2;
  const T = (100 - H) / 2;

  const f = focus ?? { x: 50, y: 50, s: 1 };
  const px = L + (f.x / 100) * W;
  const py = T + (f.y / 100) * H;
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const tx = clamp((50 - px) * f.s, 50 - (L + W - 50) * f.s, -50 - (L - 50) * f.s);
  const ty = clamp((50 - py) * f.s, 50 - (T + H - 50) * f.s, -50 - (T - 50) * f.s);
  const mx = 50 + (px - 50) * f.s + tx;
  const my = 50 + (py - 50) * f.s + ty;

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: `${fr.w} / ${fr.h}` }}>
      <motion.div
        className="absolute will-change-transform"
        style={{ left: `${L}%`, top: `${T}%`, width: `${W}%`, height: `${H}%` }}
        animate={{ scale: f.s, x: `${(tx / W) * 100}%`, y: `${(ty / H) * 100}%` }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 55, damping: 18, mass: 1 }}
      >
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes ?? "(min-width:1024px) 60vw, 100vw"} className="object-cover" />
      </motion.div>
      {marker && focus && (
        <motion.span
          key={`${focus.x}-${focus.y}`}
          aria-hidden
          className="pointer-events-none absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-botanical/90"
          style={{ left: `${mx}%`, top: `${my}%` }}
          initial={{ opacity: 0, scale: 1.8 }}
          animate={{ opacity: [0, 1, 0.75], scale: [1.8, 1, 1] }}
          transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-botanical shadow-[0_0_14px_4px_rgba(140,191,95,0.6)]" />
        </motion.span>
      )}
    </div>
  );
}
