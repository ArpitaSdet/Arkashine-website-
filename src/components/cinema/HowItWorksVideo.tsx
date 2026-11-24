"use client";

/**
 * How SoiLenz works: the client's four-steps workflow film, shown exactly as supplied.
 * The section background matches the film's edge colour so the frame blends in.
 */

import { useEffect, useRef } from "react";

const BG = "#092321";

export function HowItWorksVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  // play only while on screen
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="how"
      className="home-keep relative flex min-h-[80vh] md:min-h-[88vh] lg:min-h-screen items-center justify-center overflow-hidden py-4 md:py-8"
      style={{ backgroundColor: BG }}
      aria-label="How SoiLenz works: Connect, Prepare, Analyze, Report"
    >
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-center px-4 sm:px-6">
        <div className="relative flex max-h-[84vh] w-full items-center justify-center overflow-hidden rounded-2xl border border-ivory/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]">
          <video
            ref={ref}
            className="block max-h-[80vh] w-full max-w-full object-contain"
            src="/video/soilenz-four-steps-workflow.mp4"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-label="SoiLenz in four steps: Connect, Prepare, Analyze, Report"
          />
        </div>
      </div>
    </section>
  );
}
