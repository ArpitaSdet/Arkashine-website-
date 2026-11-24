"use client";

/**
 * Farmer impact — a full-bleed wall of real field photos that never stops moving.
 * Columns drift up / down forever (plus the original scroll parallax).
 * Slide the cursor over any photo: it lifts out of the wall as a large preview
 * that follows the cursor, then sinks back into the background on its own.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";
import { MapPin } from "lucide-react";
import { impactMetrics } from "@/lib/cinema-content";
import wall from "@/lib/field-wall.json";

const ease = [0.22, 1, 0.36, 1] as const;

interface Photo {
  src: string;
  w: number;
  h: number;
  label: string;
}

const ZIP: Photo[] = (wall as { src: string; w: number; h: number; state: string; place: string }[]).map((p) => ({
  src: p.src,
  w: p.w,
  h: p.h,
  label: p.place ? `${p.place} · ${p.state}` : p.state,
}));

/* deterministic shuffle so states mix across the wall (same on server + client) */
function mix<T>(arr: T[]): T[] {
  const a = [...arr];
  let s = 7;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
/* only field-wall folder photos */
const ALL = mix([...ZIP]);
const COLS = 4;

interface Preview {
  photo: Photo;
  key: number;
  from: "left" | "right";
}

export function FarmerImpact() {
  const ref = useRef<HTMLElement>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSrc = useRef<string | null>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const colA = useTransform(scrollYProgress, [0, 1], ["4%", "-18%"]);
  const colB = useTransform(scrollYProgress, [0, 1], ["-16%", "6%"]);

  const cols = useMemo(() => Array.from({ length: COLS }, (_, c) => ALL.filter((_, i) => i % COLS === c)), []);

  /* preview card follows the cursor, on the side away from it */
  const px = useSpring(0, { stiffness: 160, damping: 24 });
  const py = useSpring(0, { stiffness: 160, damping: 24 });
  const side = useRef<"left" | "right">("right");

  const onMove = (e: React.PointerEvent) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cardW = Math.min(460, vw * 0.8);
    side.current = e.clientX > vw / 2 ? "left" : "right";
    const x = side.current === "right" ? e.clientX + 28 : e.clientX - cardW - 28;
    px.set(Math.max(12, Math.min(vw - cardW - 12, x)));
    py.set(Math.max(12, Math.min(vh - cardW * 0.8 - 12, e.clientY - cardW * 0.35)));
  };

  const clearTimers = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (showTimer.current) clearTimeout(showTimer.current);
  };

  const enter = useCallback((photo: Photo) => {
    if (lastSrc.current === photo.src) return;
    lastSrc.current = photo.src;
    clearTimers();
    showTimer.current = setTimeout(() => {
      setPreview({ photo, key: Date.now(), from: side.current });
      // sinks back into the wall on its own
      hideTimer.current = setTimeout(() => setPreview(null), 2600);
    }, 90);
  }, []);

  const leaveWall = () => {
    clearTimers();
    lastSrc.current = null;
    setPreview(null);
  };

  useEffect(() => () => clearTimers(), []);

  return (
    <section ref={ref} id="growers" className="home-keep relative min-h-[110svh] overflow-hidden bg-forest-deep" aria-labelledby="impact-title">
      <div id="impact" className="pointer-events-none absolute left-0 top-0" />

      {/* the moving wall */}
      <div className="absolute inset-0 z-0 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3" onPointerMove={onMove} onPointerLeave={leaveWall}>
        {cols.map((col, ci) => (
          <motion.div key={ci} style={{ y: ci % 2 ? colB : colA }} className={`relative ${ci > 1 ? "hidden md:block" : ""}`}>
            <div
              className={`flex flex-col gap-2 md:gap-3 ${ci % 2 ? "animate-[wall-down_linear_infinite]" : "animate-[wall-up_linear_infinite]"} motion-reduce:[animation-play-state:paused]`}
              style={{ animationDuration: `${col.length * 7}s` }}
            >
              {/* rendered twice for a seamless loop */}
              {[0, 1].map((copy) =>
                col.map((p, i) => (
                  <div
                    key={`${copy}-${i}`}
                    onPointerEnter={() => enter(p)}
                    aria-hidden={copy === 1}
                    className={`group relative w-full shrink-0 overflow-hidden rounded-lg transition-all duration-300 hover:z-20 hover:scale-[1.03] hover:shadow-2xl ${
                      preview?.photo.src === p.src ? "ring-2 ring-botanical" : ""
                    }`}
                    style={{ aspectRatio: `${p.w} / ${p.h}` }}
                  >
                    <Image
                      src={p.src}
                      alt={copy === 0 ? `ArkaShine field photo: ${p.label}` : ""}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover saturate-[0.85] transition-all duration-500 group-hover:brightness-110 group-hover:saturate-100"
                    />
                  </div>
                ))
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(18,53,47,0.60)_0%,rgba(18,53,47,0.30)_35%,rgba(18,53,47,0.35)_60%,rgba(18,53,47,0.75)_100%)]" />

      <div className="container-site pointer-events-none relative z-20 flex min-h-[110svh] flex-col justify-between py-28 md:py-36">
        <div>
          <p className="eyebrow text-ivory/75">Farmer impact</p>
          <motion.h2
            id="impact-title"
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.1, ease }}
            className="display mt-6 text-[clamp(2.5rem,6.2vw,6.2rem)] text-ivory"
          >
            Engineered for those
            <br />
            <span className="font-light">who feed India.</span>
          </motion.h2>
        </div>

        <dl className="mt-24 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {impactMetrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease, delay: i * 0.08 }}
              className="border-t border-ivory/25 pt-5"
            >
              <dt className="font-mono text-xs uppercase tracking-[0.18em] text-ivory/80">{m.label}</dt>
              <dd className="display mt-3 text-[clamp(2rem,3.8vw,3.6rem)] text-ivory">{m.value}</dd>
            </motion.div>
          ))}
        </dl>
        <p className="mt-8 text-[12px] text-ivory/75">
          {ALL.length} photos from ArkaShine field programmes across Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Odisha, West Bengal, Rajasthan and Uttar Pradesh. Hover any photo.
        </p>
      </div>

      {/* hover preview: lifts out of the wall, then sinks back */}
      <AnimatePresence>
        {preview && (
          <motion.div
            key={preview.key}
            className="pointer-events-none fixed left-0 top-0 z-50 w-[min(460px,80vw)] [perspective:900px]"
            style={{ x: px, y: py }}
            initial={{ opacity: 0, scale: 0.55, rotateY: preview.from === "right" ? -25 : 25, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.6, filter: "blur(14px)", transition: { duration: 0.55, ease } }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <div className="overflow-hidden rounded-2xl border border-white/20 bg-forest-deep shadow-[0_30px_80px_rgba(0,0,0,0.75)]">
              <div className="relative w-full bg-black" style={{ aspectRatio: `${Math.max(preview.photo.w / preview.photo.h, 0.8)}` }}>
                <Image src={preview.photo.src} alt={preview.photo.label} fill sizes="460px" className="object-contain" />
              </div>
              <div className="flex items-center gap-2 px-4 py-3">
                <MapPin className="h-4 w-4 shrink-0 text-botanical" strokeWidth={1.5} />
                <span className="truncate font-mono text-xs uppercase tracking-[0.14em] text-ivory">{preview.photo.label}</span>
              </div>
              <motion.div className="h-0.5 bg-botanical" initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 2.6, ease: "linear" }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
