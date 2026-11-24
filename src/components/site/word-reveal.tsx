"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p";

/** Headline that reveals word by word when it enters the viewport. */
export function WordReveal({ text, as = "h2", className, id }: { text: string; as?: Tag; className?: string; id?: string }) {
  const Comp = motion[as];
  const words = text.split(" ");
  return (
    <Comp
      id={id}
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      transition={{ staggerChildren: 0.06 }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: "105%", opacity: 0 }, show: { y: "0%", opacity: 1 } }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Comp>
  );
}
