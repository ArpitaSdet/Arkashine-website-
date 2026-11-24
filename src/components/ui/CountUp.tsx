"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

interface CountUpProps {
  value: number | string;
  decimals?: number;
  duration?: number;
  className?: string;
  suffix?: string;
}

export function CountUp({
  value,
  decimals = 0,
  duration = 1.6,
  className,
  suffix = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduced = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<string>(
    typeof value === "number" ? "0" : value
  );

  useEffect(() => {
    if (typeof value !== "number") {
      setDisplayValue(value);
      return;
    }

    if (reduced) {
      setDisplayValue(value.toFixed(decimals));
      return;
    }

    if (!isInView) return;

    let start = 0;
    const end = value;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    let animId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * ease;
      setDisplayValue(current.toFixed(decimals));

      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        setDisplayValue(end.toFixed(decimals));
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isInView, value, decimals, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
      {suffix}
    </span>
  );
}
