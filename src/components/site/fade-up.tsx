"use client";

import { motion, type HTMLMotionProps } from "motion/react";

/** Standard entrance (CLAUDE.md §6): opacity, y 24 → 0, scale 0.96 → 1, spring. */
export function FadeUp({ delay = 0, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ type: "spring", stiffness: 160, damping: 22, delay }}
      {...props}
    />
  );
}
