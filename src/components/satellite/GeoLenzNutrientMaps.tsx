"use client";

/**
 * GeoLenz nutrient maps: SoiLenz ticket values go into GeoLenz, which turns
 * them into field-wide N, P, K, pH and organic-matter maps. Shown as four
 * steps beside the matching map view. Images are reference layouts.
 */

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { FileDown, Layers, MapPin, Receipt } from "lucide-react";

const STEPS = [
  {
    icon: Receipt,
    title: "Tickets come in",
    line: "Each SoiLenz test prints a ticket with 14 parameters for one sample point.",
    img: "/images/geolenz/geolenz-platform.webp",
    pos: "50% 50%",
  },
  {
    icon: MapPin,
    title: "Values entered in GeoLenz",
    line: "We enter each ticket's values against its sample point on the field boundary.",
    img: "/images/geolenz/geolenz-platform.webp",
    pos: "60% 50%",
  },
  {
    icon: Layers,
    title: "Nutrient maps",
    line: "GeoLenz maps N, P, K, pH and organic matter across the whole field, zone by zone.",
    img: "/images/geolenz/geolenz-precision-map.webp",
    pos: "50% 50%",
  },
  {
    icon: FileDown,
    title: "Field report and plan",
    line: "A mapping report with soil health scores and zone-wise fertiliser recommendations.",
    img: "/images/geolenz/geolenz-mapping-report.webp",
    pos: "50% 40%",
  },
] as const;

export function GeoLenzNutrientMaps() {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  return (
    <div className="grid gap-6 text-[#fff] lg:grid-cols-12">
      <div className="lg:col-span-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#a7d48a]">GeoLenz · from tickets to maps</p>
        <h2 className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl">Every ticket becomes part of a field map.</h2>
        <ol className="mt-6 space-y-2">
          {STEPS.map((s, k) => {
            const Icon = s.icon;
            const on = k === i;
            return (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => setI(k)}
                  onMouseEnter={() => setI(k)}
                  aria-pressed={on}
                  className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-colors ${on ? "border-[#8CBF5F] bg-[#8CBF5F]/15" : "border-[#fff]/15 hover:border-[#fff]/35"}`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${on ? "bg-[#8CBF5F] text-[#06201e]" : "bg-[#fff]/10 text-[#fff]/80"}`}>
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <span>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#a7d48a]">Step 0{k + 1}</span>
                    <span className="block text-[15px] font-semibold">{s.title}</span>
                    <span className="mt-0.5 block text-[13px] leading-relaxed text-[#fff]/75">{s.line}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="lg:col-span-8">
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-[#fff] shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div key={step.img + i} className="absolute inset-0" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
              <Image src={step.img} alt={`GeoLenz: ${step.title}`} fill sizes="(min-width:1024px) 800px, 100vw" className="object-contain" style={{ objectPosition: step.pos }} />
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[#fff]/60">Reference layout · sample data</p>
      </div>
    </div>
  );
}
