"use client";

import { motion } from "motion/react";
import Image from "next/image";

// The partner institutions backing and collaborating with ArkaShine Innovations:
// K-tech (Govt of Karnataka), Social Alpha (Tata Trusts), WRI India, Amrita TBI,
// AIC Pinnacle (Atal Innovation Mission), HPCL, HDFC Parivartan, IKP, Venture Centre
export const PARTNERS = [
  { name: "K-tech", color: "#ff9933" },
  { name: "Social Alpha", color: "#3b82f6" },
  { name: "WRI India", color: "#10b981" },
  { name: "Amrita TBI", color: "#f59e0b" },
  { name: "AIC Pinnacle", color: "#8b5cf6" },
  { name: "HPCL", color: "#ef4444" },
  { name: "HDFC Parivartan", color: "#0284c7" },
  { name: "IKP", color: "#16a34a" },
  { name: "Venture Centre", color: "#1d4ed8" },
];

export function PartnerMarquee() {
  return (
    <section className="relative overflow-hidden border-y border-ivory/12 bg-black/40 py-16 sm:py-20 text-ivory">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-forest-deep via-transparent to-forest-deep z-10" />

      <div className="container-site mb-10 text-center">
        <p className="eyebrow text-botanical font-mono uppercase tracking-[0.2em] text-xs font-semibold">
          ECOSYSTEM &amp; STRATEGIC PARTNERS
        </p>
        <h3 className="display mt-2 text-2xl sm:text-3xl font-semibold text-ivory">
          Backed by India&rsquo;s Foremost Innovation Institutions
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-ivory/80 max-w-[48ch] mx-auto">
          Collaborating with premier state innovation councils, national incubators, and impact corporations.
        </p>
      </div>

      {/* Infinite Scrolling Track */}
      <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <div className="flex shrink-0 animate-marquee items-center gap-6 py-4">
          {[...PARTNERS, ...PARTNERS].map((p, idx) => (
            <div
              key={`${p.name}-${idx}`}
              className="group relative flex h-16 w-44 sm:w-52 shrink-0 items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 backdrop-blur-sm transition-all duration-300 hover:border-botanical/50 hover:bg-white/[0.07] hover:-translate-y-1 shadow-lg"
            >
              <span className="font-display text-base font-bold tracking-tight text-ivory group-hover:text-botanical transition-colors">
                {p.name}
              </span>
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: p.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
