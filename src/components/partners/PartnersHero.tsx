"use client";

/**
 * Soil Partners hero: SoiLenz data at the centre, three product phones
 * orbiting it on a tilted 3D ring, linked by pulsing data lines.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Award, Layers, Scan, Smartphone, Sprout, TrendingUp } from "lucide-react";

const PRODUCTS = [
  { name: "LeafLENZ", tag: "Plant health", src: "/images/app/soil-partners/leaflenz-diagnosis.jpg", color: "#059669", icon: Scan },
  { name: "HarvestLENZ", tag: "Harvest value", src: "/images/app/soil-partners/harvestlenz-result.jpg", color: "#b45309", icon: TrendingUp },
  { name: "Carbon Intelligence", tag: "Carbon credits", src: "/images/app/soil-partners/carbon-metrics.jpg", color: "#4f7d2e", icon: Award },
];

export function PartnersHero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);

  // slow orbit; each product takes the front in turn
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setAngle((a) => a - 120), 3800);
    return () => clearInterval(t);
  }, [reduce]);
  const front = (((Math.round(-angle / 120) % 3) + 3) % 3);

  const spin = useSpring(0, { stiffness: 40, damping: 14 });
  useEffect(() => spin.set(angle), [angle, spin]);

  const mx = useSpring(0, { stiffness: 50, damping: 14 });
  const tilt = useTransform(mx, (v) => v * 10);

  return (
    <section className="relative overflow-hidden bg-[#F1F8EF] pb-16 pt-12 lg:pb-20 lg:pt-16">
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(5,150,105,0.18)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_70%_50%,black,transparent_70%)]" />

      <div className="container-site relative z-10 grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-emerald-900 shadow-sm"
          >
            <Smartphone className="h-3.5 w-3.5 text-emerald-600" /> Soil Partners
          </motion.div>
          <h1 className="display mt-6 text-[clamp(2.4rem,4.8vw,4.6rem)] font-bold leading-[1.05] tracking-tight text-emerald-950 [text-wrap:balance]">
            {["One", "soil", "test."].map((w, i) => (
              <motion.span key={w} className="mr-[0.25em] inline-block" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 120, damping: 14 }}>
                {w}
              </motion.span>
            ))}
            <br />
            {["Three", "new", "services."].map((w, i) => (
              <motion.span key={w} className="mr-[0.25em] inline-block text-emerald-700" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 120, damping: 14 }}>
                {w}
              </motion.span>
            ))}
          </h1>
          <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-emerald-900/75 sm:text-lg">
            With our hardware SoiLenz 2.0 and pH / EC bottle, you get these 3 services: Plant health (LeafLENZ), harvest grading (HarvestLENZ) and carbon credits (Carbon Intelligence) — for soil entrepreneurs and FPOs.
          </p>

          <div className="mt-8 flex flex-col gap-2.5">
            {PRODUCTS.map((p, i) => {
              const Icon = p.icon;
              const on = i === front;
              return (
                <motion.button
                  key={p.name}
                  type="button"
                  onClick={() => setAngle(-i * 120 + Math.round(angle / 360) * 360)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="relative flex items-center gap-3 overflow-hidden rounded-2xl border bg-white px-4 py-3 text-left shadow-sm transition-colors"
                  style={{ borderColor: on ? p.color : "rgba(6,78,59,0.1)" }}
                >
                  {on && <motion.span layoutId="hero-prod" className="absolute inset-0 opacity-[0.08]" style={{ background: p.color }} />}
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: p.color }}>
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.7} />
                  </span>
                  <span className="relative">
                    <span className="block text-sm font-bold text-emerald-950">{p.name}</span>
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-zinc-500">{p.tag}</span>
                  </span>
                  {on && (
                    <motion.span className="relative ml-auto h-1.5 w-16 overflow-hidden rounded-full bg-emerald-100">
                      <motion.span key={angle} className="absolute inset-y-0 left-0 rounded-full" style={{ background: p.color }} initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3.8, ease: "linear" }} />
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#partner-inquiry" className="rounded-full bg-[#1E7A33] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:scale-105 hover:bg-[#17642a]">
              Become a partner
            </a>
            <a href="#product-deep-dive" className="inline-flex items-center gap-2 rounded-full border border-emerald-900/15 bg-white px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#162a54] transition hover:bg-emerald-50">
              <Layers className="h-4 w-4 text-emerald-700" /> See the products
            </a>
          </div>
        </div>

        {/* orbit stage */}
        <div
          ref={ref}
          className="relative h-[520px] lg:col-span-7"
          style={{ perspective: 1400 }}
          onMouseMove={(e) => {
            const r = ref.current!.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
          }}
          onMouseLeave={() => mx.set(0)}
        >
          {/* rings */}
          <motion.div className="absolute inset-0" style={{ rotateY: tilt, transformStyle: "preserve-3d" }}>
            <div className="absolute left-1/2 top-[80%] h-[220px] w-[min(560px,92%)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 border-dashed border-emerald-700/20" style={{ transform: "translate(-50%,-50%) rotateX(72deg)" }} />
            <motion.div
              className="absolute left-1/2 top-[80%] h-[300px] w-[min(700px,100%)] rounded-[50%] border border-emerald-600/15"
              style={{ x: "-50%", y: "-50%", rotateX: 72 }}
              animate={reduce ? undefined : { rotateZ: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />

            {/* hub */}
            <div className="absolute left-1/2 top-[95%] z-[500] -translate-x-1/2 -translate-y-1/2">
              <motion.span
                className="absolute inset-0 rounded-full bg-emerald-400/30"
                animate={reduce ? undefined : { scale: [1, 2.2], opacity: [0.6, 0] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              />
              <span className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-[0_20px_40px_-12px_rgba(6,78,59,0.6)] text-center px-1">
                <Sprout className="h-6 w-6" strokeWidth={1.6} />
                <span className="mt-0.5 font-mono text-[9px] font-bold uppercase tracking-wider leading-tight">SoiLenz 2.0 + pH Bottle</span>
              </span>
            </div>

            {/* orbiting phones */}
            {PRODUCTS.map((p, i) => (
              <OrbitPhone key={p.name} index={i} spin={spin} product={p} front={front === i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function OrbitPhone({
  index,
  spin,
  product,
  front,
}: {
  index: number;
  spin: ReturnType<typeof useSpring>;
  product: (typeof PRODUCTS)[number];
  front: boolean;
}) {
  const a = useTransform(spin, (s) => ((s + index * 120) * Math.PI) / 180);
  const x = useTransform(a, (r) => Math.round(Math.sin(r) * 230));
  const z = useTransform(a, (r) => Math.round(Math.cos(r) * 160));
  const y = useTransform(a, (r) => Math.round(Math.cos(r) * 30));
  const scale = useTransform(z, (v) => Math.round((0.835 + (v / 160) * 0.215) * 100) / 100);
  const opacity = useTransform(z, (v) => Math.round((0.775 + (v / 160) * 0.225) * 100) / 100);
  const zIndex = useTransform(z, (v) => Math.round(v + 200));
  const rotateY = useTransform(a, (r) => Math.round(-Math.sin(r) * 28));

  return (
    <motion.div className="absolute left-1/2 top-[39%] -ml-[78px] -mt-[170px] w-[156px]" style={{ x, y, scale, opacity, zIndex, rotateY }}>
      <div className="rounded-[26px] bg-gradient-to-b from-neutral-700 via-neutral-900 to-black p-1.5 shadow-[0_30px_50px_-18px_rgba(6,78,59,0.55)]">
        <div className="relative aspect-[9/20] overflow-hidden rounded-[21px] bg-black">
          <Image src={product.src} alt={`${product.name} app screen`} fill sizes="160px" className="object-cover object-top" unoptimized />
          {front && (
            <motion.span
              className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-white/40 to-transparent"
              initial={{ top: "-15%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>
      </div>
      <div className="mt-2 text-center">
        <span className="inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow" style={{ background: product.color }}>
          {product.name}
        </span>
      </div>
    </motion.div>
  );
}
