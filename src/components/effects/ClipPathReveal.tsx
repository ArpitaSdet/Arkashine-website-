"use client";

import { motion, type Variants } from "motion/react";
import { ReactNode } from "react";

interface ClipPathRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "bottom-to-top" | "left-to-right" | "circle-expand" | "diagonal";
  delay?: number;
  duration?: number;
}

export function ClipPathReveal({
  children,
  className = "",
  direction = "bottom-to-top",
  delay = 0.1,
  duration = 0.8,
}: ClipPathRevealProps) {
  const getClipVariants = (): Variants => {
    switch (direction) {
      case "left-to-right":
        return {
          hidden: { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)", opacity: 0 },
          visible: {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            opacity: 1,
            transition: { duration, delay, ease: "easeOut" },
          },
        };
      case "circle-expand":
        return {
          hidden: { clipPath: "circle(0% at 50% 50%)", opacity: 0 },
          visible: {
            clipPath: "circle(100% at 50% 50%)",
            opacity: 1,
            transition: { duration: duration * 1.1, delay, ease: "easeOut" },
          },
        };
      case "diagonal":
        return {
          hidden: { clipPath: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 100%)", opacity: 0 },
          visible: {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            opacity: 1,
            transition: { duration, delay, ease: "easeOut" },
          },
        };
      case "bottom-to-top":
      default:
        return {
          hidden: { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", opacity: 0 },
          visible: {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            opacity: 1,
            transition: { duration, delay, ease: "easeOut" },
          },
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={getClipVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}
