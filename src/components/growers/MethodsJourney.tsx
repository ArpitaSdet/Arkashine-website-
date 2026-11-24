"use client";

/**
 * The 19 natural methods as a winding field path.
 * As you scroll, the path draws itself and each method pops up as a step
 * (photo, number, name), coloured by group. Click a step to open its card.
 */

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring } from "motion/react";
import { Bug, Microscope, Sprout } from "lucide-react";

export interface JourneyMethod {
  id: number;
  name: string;
  category: "nutrition" | "pest" | "bio";
  type: string;
  photo?: string;
}

const GROUP = {
  nutrition: { label: "Soil nutrition", color: "#4f7d2e", soft: "#d6eac8", icon: Sprout },
  pest: { label: "Natural pest defence", color: "#a8650f", soft: "#fff3dc", icon: Bug },
  bio: { label: "Bio-inputs", color: "#2f7f86", soft: "#e2f2f2", icon: Microscope },
} as const;

const PER_ROW = 5;

export function MethodsJourney({
  methods,
  selectedId,
  onSelect,
}: {
  methods: JourneyMethod[];
  selectedId?: number;
  onSelect: (id: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rows = Math.ceil(methods.length / PER_ROW);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 70%"] });
  const draw = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });

  // serpentine path through the step centres, in a 1000 x (rows*200) box
  const W = 1000;
  const RH = 200;
  const pts = methods.map((_, i) => {
    const r = Math.floor(i / PER_ROW);
    const c = i % PER_ROW;
    const col = r % 2 === 0 ? c : PER_ROW - 1 - c;
    return { x: 100 + col * 200, y: 100 + r * RH };
  });
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    if (a.y === b.y) d += ` L ${b.x} ${b.y}`;
    else {
      const out = a.x > 500 ? 90 : -90;
      d += ` C ${a.x + out * 1.4} ${a.y}, ${b.x + out * 1.4} ${b.y}, ${b.x} ${b.y}`;
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#DCEBD3] py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(79,125,46,0.22)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="container-site relative max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-emerald-900 shadow-sm"
          >
            <Sprout className="h-3.5 w-3.5 text-emerald-600" /> The 19-step natural path
          </motion.span>
          <h2 className="display mt-4 text-4xl font-bold tracking-tight text-emerald-950 [text-wrap:balance] sm:text-5xl">
            From seed to harvest, <span className="text-emerald-700">naturally.</span>
          </h2>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {(Object.keys(GROUP) as (keyof typeof GROUP)[]).map((k) => {
              const g = GROUP[k];
              const Icon = g.icon;
              return (
                <span key={k} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-semibold" style={{ background: g.soft, color: g.color }}>
                  <Icon className="h-3.5 w-3.5" /> {g.label} · {methods.filter((m) => m.category === k).length}
                </span>
              );
            })}
          </div>
        </div>

        <div ref={ref} className="relative mx-auto mt-14 w-full" style={{ aspectRatio: `${W} / ${rows * RH}` }}>
          {/* the path */}
          <svg viewBox={`0 0 ${W} ${rows * RH}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            <path d={d} fill="none" stroke="rgba(79,125,46,0.15)" strokeWidth="14" strokeLinecap="round" />
            <path d={d} fill="none" stroke="rgba(79,125,46,0.25)" strokeWidth="2" strokeDasharray="2 12" strokeLinecap="round" />
            <motion.path d={d} fill="none" stroke="url(#mj-grad)" strokeWidth="8" strokeLinecap="round" style={{ pathLength: draw }} />
            <defs>
              <linearGradient id="mj-grad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#8cbf5f" />
                <stop offset="0.5" stopColor="#4f7d2e" />
                <stop offset="1" stopColor="#2f7f86" />
              </linearGradient>
            </defs>
          </svg>

          {methods.map((m, i) => {
            const g = GROUP[m.category];
            const p = pts[i];
            const below = Math.floor(i / PER_ROW) % 2 === 0 ? i % 2 === 0 : i % 2 === 1;
            const isSelected = m.id === selectedId;
            return (
              <motion.button
                key={m.id}
                type="button"
                onClick={() => {
                  onSelect(m.id);
                  const el = document.getElementById("protocol-viewer");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center focus-visible:outline-none"
                style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / (rows * RH)) * 100}%` }}
                initial={{ opacity: 0, scale: 0.3, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8, margin: "0px 0px -15% 0px" }}
                transition={{ type: "spring", stiffness: 260, damping: 15, delay: (i % PER_ROW) * 0.08 }}
                whileHover={{ scale: 1.12 }}
                aria-label={`Step ${i + 1}: ${m.name}`}
              >
                {/* Active glow halo */}
                {isSelected && (
                  <span className="absolute inset-0 -m-3 animate-ping rounded-full opacity-40" style={{ backgroundColor: g.color }} />
                )}

                <span
                  className={`relative block h-[clamp(76px,10vw,110px)] w-[clamp(76px,10vw,110px)] overflow-hidden rounded-full border-4 bg-white transition-all ${
                    isSelected
                      ? "ring-4 ring-offset-2 ring-emerald-500 shadow-[0_16px_36px_rgba(19,32,27,0.5)] scale-105"
                      : "shadow-[0_12px_28px_-8px_rgba(19,32,27,0.4)] group-hover:shadow-[0_18px_40px_-8px_rgba(19,32,27,0.55)]"
                  }`}
                  style={{ borderColor: g.color }}
                >
                  {m.photo ? (
                    <Image
                      src={m.photo}
                      alt={m.name}
                      fill
                      unoptimized
                      sizes="140px"
                      className="object-cover transition-transform duration-500 group-hover:scale-115"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center" style={{ background: g.soft, color: g.color }}>
                      <g.icon className="h-1/2 w-1/2" strokeWidth={1.4} />
                    </span>
                  )}
                </span>
                <span
                  className={`absolute left-1/2 w-[clamp(100px,15vw,160px)] -translate-x-1/2 text-center ${below ? "top-full mt-2" : "bottom-full mb-2"}`}
                >
                  <span className={`block text-[clamp(10px,1.2vw,13px)] font-bold leading-tight ${isSelected ? "text-emerald-700 underline underline-offset-2" : "text-emerald-950"}`}>
                    <span className="font-mono text-emerald-800 mr-1 font-bold">#{String(i + 1).padStart(2, "0")}</span>
                    {m.name.replace(/\s*\(.*\)/, "")}
                  </span>
                  <span className="mt-0.5 hidden font-mono text-[10px] text-zinc-500 sm:block">{m.type}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
