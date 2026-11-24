"use client";

import { motion } from "motion/react";

interface KineticTextProps {
  text: string;
  className?: string;
  highlightWords?: string[];
  highlightClassName?: string;
  delay?: number;
}

export function KineticText({
  text,
  className = "",
  highlightWords = [],
  highlightClassName = "text-[#234338]",
  delay = 0,
}: KineticTextProps) {
  const words = text.split(" ");

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}
    >
      {words.map((word, i) => {
        const isHighlighted = highlightWords.some((hw) =>
          word.toLowerCase().includes(hw.toLowerCase())
        );

        return (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              variants={{
                hidden: { y: "100%", opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                    delay: delay + i * 0.035,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
              className={`inline-block ${isHighlighted ? highlightClassName : ""}`}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </motion.span>
  );
}