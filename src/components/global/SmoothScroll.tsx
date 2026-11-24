"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

/** Smooth scroll to an element id or absolute y, falling back to native scrolling. */
export function scrollToTarget(target: string | number, duration = 1.6) {
  const el = typeof target === "string" ? document.getElementById(target) : null;
  const y = typeof target === "number" ? target : el ? el.getBoundingClientRect().top + window.scrollY : 0;
  if (lenisInstance) lenisInstance.scrollTo(y, { duration });
  else window.scrollTo({ top: y, behavior: "smooth" });
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
