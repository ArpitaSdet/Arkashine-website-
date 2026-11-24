"use client";

/**
 * One product, told in a single scroll beat: two phones swing in from the
 * side in 3D (step 1 → step 2), a live result chip pops out and counts up,
 * and the phones keep a gentle parallax with scroll.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useInView, useScroll, useTransform } from "motion/react";
import { ArrowRight, Award, Scan, TrendingUp } from "lucide-react";

const ICONS = { scan: Scan, trend: TrendingUp, award: Award };

export interface ProductStoryProps {
  index: string;
  name: string;
  tag: string;
  line: string;
  icon: keyof typeof ICONS;
  color: string;
  soft: string;
  screens: { src: string; label: string }[];
  points: string[];
  result: { prefix?: string; value: number; decimals?: number; suffix?: string; label: string };
  flip?: boolean;
}

function Count({ to, decimals = 0, prefix = "", suffix = "" }: { to: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: setV });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {prefix}
      {v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

export function ProductStory(p: ProductStoryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yB = useTransform(scrollYProgress, [0, 1], [120, -40]);
  const Icon = ICONS[p.icon];
  const shown = useInView(ref, { once: true, amount: 0.25 });
  const from = p.flip ? -1 : 1;

  return (
    <div ref={ref} className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
      {/* text */}
      <motion.div
        className={`lg:col-span-5 ${p.flip ? "lg:order-2" : ""}`}
        initial={{ opacity: 0, x: -30 * from }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ type: "spring", stiffness: 70, damping: 16 }}
      >
        <div className="flex items-center gap-3">
          <span className="font-display text-6xl font-bold leading-none" style={{ color: p.color, opacity: 0.18 }}>
            {p.index}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em]" style={{ background: p.soft, color: p.color }}>
            <Icon className="h-3.5 w-3.5" /> {p.tag}
          </span>
        </div>
        <h2 className="display mt-3 text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl">{p.name}</h2>
        <p className="mt-3 text-lg font-medium leading-relaxed" style={{ color: p.color }}>
          {p.line}
        </p>
        <ul className="mt-6 space-y-2.5">
          {p.points.map((pt, i) => (
            <motion.li
              key={pt}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-3 rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 text-sm font-medium text-emerald-950 shadow-sm"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold text-white" style={{ background: p.color }}>
                {i + 1}
              </span>
              {pt}
            </motion.li>
          ))}
        </ul>
        <a href="#partner-inquiry" className="group mt-6 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest" style={{ color: p.color }}>
          Offer {p.name} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </motion.div>

      {/* phones */}
      <div className={`relative flex h-[520px] items-center justify-center lg:col-span-7 ${p.flip ? "lg:order-1" : ""}`} style={{ perspective: 1400 }}>
        <div className="pointer-events-none absolute h-[420px] w-[420px] rounded-full blur-3xl" style={{ background: p.soft }} />
        <motion.div
          className="pointer-events-none absolute h-[380px] w-[380px] rounded-full border-2 border-dashed"
          style={{ borderColor: `${p.color}33` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />

        {p.screens.map((s, i) => (
          <motion.div
            key={s.src}
            className="absolute w-[200px] sm:w-[220px]"
            style={{ y: i === 0 ? yA : yB, zIndex: i }}
            initial={{ opacity: 0, rotateY: 70 * from, rotateZ: 0, x: (i === 0 ? -105 : 105) + 220 * from }}
            animate={shown ? { opacity: 1, x: i === 0 ? -105 : 105, rotateY: i === 0 ? 14 : -10, rotateZ: i === 0 ? -5 : 4 } : undefined}
            whileHover={{ rotateY: 0, rotateZ: 0, scale: 1.05, zIndex: 5 }}
            transition={{ type: "spring", stiffness: 60, damping: 14, delay: i * 0.18 }}
          >
            <div className="rounded-[30px] bg-gradient-to-b from-neutral-700 via-neutral-900 to-black p-2 shadow-[0_40px_60px_-25px_rgba(6,78,59,0.55)]">
              <div className="relative aspect-[9/20] overflow-hidden rounded-[23px] bg-black">
                <Image src={s.src} alt={`${p.name}: ${s.label}`} fill sizes="220px" className="object-cover object-top" unoptimized />
                {i === 0 && (
                  <motion.span
                    className="pointer-events-none absolute inset-x-0 h-12"
                    style={{ background: `linear-gradient(180deg, transparent, ${p.color}66, transparent)` }}
                    initial={{ top: "-10%" }}
                    animate={{ top: "105%" }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
                  />
                )}
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="rounded-full bg-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-950 shadow-sm">
                Step {i + 1} · {s.label}
              </span>
            </div>
          </motion.div>
        ))}

        {/* result chip */}
        <motion.div
          className={`absolute z-10 rounded-2xl border border-white bg-white/95 px-5 py-3.5 shadow-[0_25px_50px_-20px_rgba(6,78,59,0.5)] backdrop-blur ${p.flip ? "left-2 top-8" : "right-2 top-8"}`}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          viewport={{ once: true }}
          transition={{
            opacity: { delay: 0.7 },
            scale: { delay: 0.7, type: "spring", stiffness: 220, damping: 12 },
            y: { delay: 1.2, duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div className="font-mono text-3xl font-bold" style={{ color: p.color }}>
            <Count to={p.result.value} decimals={p.result.decimals} prefix={p.result.prefix} suffix={p.result.suffix} />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{p.result.label}</div>
        </motion.div>
      </div>
    </div>
  );
}
