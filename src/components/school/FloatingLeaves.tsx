"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Leaf, Sprout } from "lucide-react";

/** Soft leaves and soil specks drifting across a light section. */
export function FloatingLeaves({ count = 12 }: { count?: number }) {
  const reduce = useReducedMotion();
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 53) % 100,
        top: (i * 31) % 90,
        size: 14 + ((i * 7) % 18),
        dur: 10 + ((i * 11) % 10),
        delay: (i * 0.9) % 6,
        rot: (i * 47) % 360,
        kind: i % 4,
      })),
    [count]
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((d, i) =>
        d.kind === 3 ? (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[#b08052]/30"
            style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size / 3, height: d.size / 3 }}
            animate={reduce ? undefined : { y: [0, -40, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <motion.span
            key={i}
            className="absolute text-botanical/45"
            style={{ left: `${d.left}%`, top: `${d.top}%` }}
            initial={{ rotate: d.rot }}
            animate={reduce ? undefined : { y: [0, -30, 0], x: [0, i % 2 ? 20 : -20, 0], rotate: [d.rot, d.rot + 40, d.rot] }}
            transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            {d.kind === 0 ? <Sprout style={{ width: d.size, height: d.size }} strokeWidth={1.3} /> : <Leaf style={{ width: d.size, height: d.size }} strokeWidth={1.3} />}
          </motion.span>
        )
      )}
    </div>
  );
}
