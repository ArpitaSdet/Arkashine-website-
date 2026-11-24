"use client";

import { motion, type Variants } from "motion/react";

interface SplitTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  wordClassName?: string;
}

export function SplitTextReveal({
  text,
  className = "",
  delay = 0,
  wordClassName = "",
}: SplitTextRevealProps) {
  const words = text.split(" ");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(3px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 240,
        damping: 24,
      },
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={`inline-block flex-wrap gap-x-2 ${className}`}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
          <motion.span variants={wordVariants} className={`inline-block ${wordClassName}`}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
