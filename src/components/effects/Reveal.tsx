"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

/** Section entrance effects. Each section picks a different one. Reduced motion shows content at rest. */

const ease = [0.16, 1, 0.3, 1] as const;
const once = { once: true, margin: "0px 0px -8% 0px" } as const;

// Jagged right edge for the brush wipe: the edge sweeps from off-left to off-right.
const BRUSH_EDGE = [0, 6, -4, 8, -2, 5, -6, 3, -3, 7, -5, 2];
function brushPolygon(x: number) {
  const edge = BRUSH_EDGE.map((j, k) => `${x + j}% ${(k / (BRUSH_EDGE.length - 1)) * 100}%`).join(", ");
  return `polygon(0% 0%, ${edge}, 0% 100%)`;
}

type Target = Record<string, string | number>;

/**
 * A clip-path reveal. The in-view check sits on an unclipped outer box: a fully clipped
 * element can read as "not visible" to the browser and would never start.
 */
function Masked({
  children,
  className,
  from,
  to,
  duration,
  delay,
  curve = ease,
}: {
  children: React.ReactNode;
  className?: string;
  from: Target;
  to: Target;
  duration: number;
  delay: number;
  curve?: readonly number[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, once);
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <div ref={ref} className={className}>
      <motion.div className="relative h-full w-full" initial={from} animate={inView ? to : from} transition={{ duration, delay, ease: curve as [number, number, number, number] }}>
        {children}
      </motion.div>
    </div>
  );
}

export function BrushReveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <Masked className={className} from={{ clipPath: brushPolygon(-12) }} to={{ clipPath: brushPolygon(115) }} duration={1.4} delay={delay} curve={[0.65, 0, 0.35, 1]}>
      {children}
    </Masked>
  );
}

/** Organic mask: an ellipse opens from the lower centre, like soil parting. */
export function OrganicReveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <Masked
      className={className}
      from={{ clipPath: "ellipse(0% 0% at 50% 70%)", scale: 1.08 }}
      to={{ clipPath: "ellipse(85% 90% at 50% 55%)", scale: 1 }}
      duration={1.5}
      delay={delay}
    >
      {children}
    </Masked>
  );
}

/** Rounded mask that opens to the full frame. */
export function MaskReveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <Masked
      className={className}
      from={{ clipPath: "inset(22% 18% 22% 18% round 48px)", opacity: 0.4 }}
      to={{ clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1 }}
      duration={1.3}
      delay={delay}
    >
      {children}
    </Masked>
  );
}

export function Lift({ children, className, delay = 0, y = 32 }: { children: React.ReactNode; className?: string; delay?: number; y?: number }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={once} transition={{ duration: 0.9, delay, ease }}>
      {children}
    </motion.div>
  );
}

/** Children appear one after another (use with motion children that read the `show` variant). */
export function Stagger({ children, className, gap = 0.09, delay = 0 }: { children: React.ReactNode; className?: string; gap?: number; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? "show" : "hidden"}
      whileInView="show"
      viewport={once}
      transition={{ staggerChildren: gap, delayChildren: delay }}
    >
      {children}
    </motion.div>
  );
}

export const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

/** Word-by-word headline reveal. */
export function WordsReveal({ text, className, as = "h2" }: { text: string; className?: string; as?: "h2" | "h3" | "p" }) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag className={className} aria-label={text} initial={reduced ? "show" : "hidden"} whileInView="show" viewport={once} transition={{ staggerChildren: 0.07 }}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.1em] align-bottom mr-[0.25em]">
          <motion.span className="inline-block" variants={{ hidden: { y: "105%" }, show: { y: "0%", transition: { duration: 0.9, ease } } }}>
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Scroll progress of an element through the viewport (0 entering bottom → 1 leaving top). */
export function useSectionProgress() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return { ref, progress: scrollYProgress };
}

export function useParallax(progress: MotionValue<number>, distance = 60) {
  const reduced = useReducedMotion();
  return useTransform(progress, [0, 1], reduced ? [0, 0] : [distance, -distance]);
}
