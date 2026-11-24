"use client";

/**
 * Student dashboard — one screen, lots happening:
 * a laptop that flips between the two portal screens in 3D, live widgets
 * orbiting it (progress ring, videos watched, farms advised, quiz score),
 * and the 8-step soil journey lighting up step by step underneath.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "motion/react";
import {
  Activity,
  BookOpen,
  BarChart3,
  ClipboardList,
  FileText,
  FlaskConical,
  Lightbulb,
  MapPin,
  Maximize2,
  Play,
  Shovel,
  Sparkles,
  Sprout,
  Trophy,
  X,
} from "lucide-react";
import { PORTAL_SCREENS } from "./PortalScreens3D";
import { FloatingLeaves } from "./FloatingLeaves";

const ease = [0.22, 1, 0.36, 1] as const;

const JOURNEY = [
  { icon: Shovel, label: "Collect" },
  { icon: FlaskConical, label: "Prepare" },
  { icon: Activity, label: "Test" },
  { icon: ClipboardList, label: "Record" },
  { icon: BarChart3, label: "Analyze" },
  { icon: Lightbulb, label: "Interpret" },
  { icon: FileText, label: "Report" },
  { icon: Sprout, label: "Apply" },
];

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.4, ease, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}</span>;
}

function Widget({ className, delay, children }: { className: string; delay: number; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`absolute z-20 hidden w-48 rounded-2xl border border-ink/5 bg-white/95 p-3.5 shadow-[0_20px_45px_-18px_rgba(19,32,27,0.45)] backdrop-blur-md xl:block ${className}`}
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 180, damping: 14, delay }}
    >
      <motion.div animate={reduce ? undefined : { y: [0, -6, 0] }} transition={{ duration: 4 + delay * 2, repeat: Infinity, ease: "easeInOut" }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

function Ring({ value, max }: { value: number; max: number }) {
  const c = 2 * Math.PI * 22;
  return (
    <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
      <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(19,32,27,0.08)" strokeWidth="6" />
      <motion.circle
        cx="28"
        cy="28"
        r="22"
        fill="none"
        stroke="#4f7d2e"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        whileInView={{ strokeDashoffset: c * (1 - value / max) }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease, delay: 0.6 }}
      />
    </svg>
  );
}

export function StudentDashboardShowcase() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);
  const [step, setStep] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);

  useEffect(() => {
    if (!inView || hold || reduce) return;
    const t = setInterval(() => setActive((a) => (a + 1) % PORTAL_SCREENS.length), 4500);
    return () => clearInterval(t);
  }, [inView, hold, reduce]);

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setStep((s) => (s + 1) % (JOURNEY.length + 2)), 900);
    return () => clearInterval(t);
  }, [inView]);

  useEffect(() => {
    if (zoom === null) return;
    const f = (e: KeyboardEvent) => e.key === "Escape" && setZoom(null);
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [zoom]);

  const screen = PORTAL_SCREENS[active];
  const lit = Math.min(step, JOURNEY.length);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[calc(100svh-5rem)] snap-start items-center overflow-hidden bg-[#DCEBD3] py-8 text-ink"
    >
      <FloatingLeaves count={10} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(79,125,46,0.25)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      <div className="container-site relative z-10 w-full max-w-7xl">
        {/* heading + tabs */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-botanical-dark/25 bg-white px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-botanical-dark shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" /> Student dashboard
          </motion.div>
          <h2 className="display mt-3 text-3xl font-bold tracking-tight text-forest [text-wrap:balance] sm:text-[2.8rem]">
            Learn it on screen. <span className="text-botanical-dark">Prove it in the field.</span>
          </h2>
          <div className="mt-4 inline-flex rounded-full border border-ink/10 bg-white p-1 shadow-sm">
            {PORTAL_SCREENS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActive(i);
                  setHold(true);
                }}
                className={`relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  active === i ? "text-ivory" : "text-ink/60 hover:text-ink"
                }`}
              >
                {active === i && <motion.span layoutId="dash-tab" className="absolute inset-0 rounded-full bg-[#1E7A33]" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                <span className="relative">{i === 0 ? <Activity className="h-3.5 w-3.5" /> : i === 1 ? <Play className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}</span>
                <span className="relative">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* laptop + widgets */}
        <div className="relative mx-auto mt-5 w-full max-w-[min(860px,calc((100svh-23rem)*1.85))]" style={{ perspective: 1800 }}>
          <Widget className="-left-56 top-2" delay={0.3}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Ring value={22} max={28} />
                <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-forest">22</span>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink/50">Programme</div>
                <div className="text-sm font-bold text-forest">Day 22 of 28</div>
              </div>
            </div>
          </Widget>

          <Widget className="-left-60 bottom-6" delay={0.5}>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink/50">Videos watched</div>
            <div className="mt-2 flex gap-1.5">
              {Array.from({ length: 6 }, (_, i) => (
                <motion.span
                  key={i}
                  className="flex h-6 flex-1 items-center justify-center rounded-md"
                  initial={{ backgroundColor: "rgba(19,32,27,0.07)" }}
                  whileInView={{ backgroundColor: i < 3 ? "#8b5cf6" : "rgba(19,32,27,0.07)" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 + i * 0.15 }}
                >
                  <Play className={`h-3 w-3 ${i < 3 ? "text-white" : "text-ink/25"}`} />
                </motion.span>
              ))}
            </div>
            <div className="mt-1.5 text-sm font-bold text-forest">3 of 6</div>
          </Widget>

          <Widget className="-right-56 top-0" delay={0.4}>
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink/50">Farms advised</div>
              <MapPin className="h-4 w-4 text-[#d08a1f]" />
            </div>
            <div className="mt-1 font-mono text-3xl font-bold text-forest">
              <Count to={28} />
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {Array.from({ length: 14 }, (_, i) => (
                <motion.span
                  key={i}
                  className="h-2 rounded-full bg-botanical"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.8 + i * 0.05 }}
                />
              ))}
            </div>
          </Widget>

          <Widget className="-right-60 bottom-4" delay={0.6}>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff4dc] text-[#d08a1f]">
                <Trophy className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink/50">Soil quiz</div>
                <div className="text-sm font-bold text-forest">9 / 10 · Badge earned</div>
              </div>
            </div>
          </Widget>

          {/* the laptop */}
          <motion.div
            initial={{ opacity: 0, rotateX: 25, y: 40 }}
            whileInView={{ opacity: 1, rotateX: 6, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 60, damping: 16 }}
            style={{ transformStyle: "preserve-3d", transformOrigin: "50% 100%" }}
          >
            <div className="relative rounded-[18px] bg-[#1d2420] p-2.5 shadow-[0_40px_80px_-30px_rgba(19,32,27,0.6)]">
              <span className="absolute left-1/2 top-1 h-1 w-1 -translate-x-1/2 rounded-full bg-white/30" />
              <button
                type="button"
                onClick={() => setZoom(active)}
                className="group relative block aspect-[1912/912] w-full overflow-hidden rounded-lg bg-black"
                aria-label={`Enlarge ${screen.label}`}
                style={{ perspective: 1400 }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={screen.id}
                    className="absolute inset-0"
                    initial={{ rotateY: 70, opacity: 0, scale: 0.92 }}
                    animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                    exit={{ rotateY: -70, opacity: 0, scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 70, damping: 16 }}
                  >
                    <Image src={screen.src} alt={screen.alt} fill sizes="(max-width: 1024px) 95vw, 860px" className="object-cover object-top" priority />
                  </motion.div>
                </AnimatePresence>
                <span className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-[420%]" />
                <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 font-mono text-[10px] font-semibold text-ink shadow">
                  <Maximize2 className="h-3 w-3" /> Enlarge
                </span>
              </button>
            </div>
            <div className="mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-[14px] bg-gradient-to-b from-[#cfd3cd] to-[#a9aea6] shadow-[0_18px_30px_-12px_rgba(19,32,27,0.5)]" />
            <div className="mx-auto h-1.5 w-24 rounded-b-md bg-[#9aa097]" />
          </motion.div>
        </div>

        {/* 8-step journey lighting up */}
        <div className="relative mx-auto mt-7 max-w-4xl">
          <div className="absolute left-[6%] right-[6%] top-5 h-1 rounded-full bg-ink/10" />
          <motion.div
            className="absolute left-[6%] top-5 h-1 rounded-full bg-gradient-to-r from-botanical to-botanical-dark"
            animate={{ width: `${(Math.max(0, lit - 1) / (JOURNEY.length - 1)) * 88}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
          <div className="relative grid grid-cols-8">
            {JOURNEY.map((j, i) => {
              const on = i < lit;
              const now = i === lit - 1;
              const Icon = j.icon;
              return (
                <div key={j.label} className="flex flex-col items-center gap-1.5">
                  <motion.span
                    className="relative flex h-11 w-11 items-center justify-center rounded-full border-2"
                    animate={{
                      backgroundColor: on ? "#4f7d2e" : "#ffffff",
                      borderColor: on ? "#4f7d2e" : "rgba(19,32,27,0.12)",
                      color: on ? "#ffffff" : "rgba(19,32,27,0.4)",
                      scale: now ? 1.18 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    {now && (
                      <motion.span
                        className="absolute inset-0 rounded-full border-2 border-botanical"
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: 1.7, opacity: 0 }}
                        transition={{ duration: 0.9 }}
                      />
                    )}
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.7} />
                  </motion.span>
                  <span className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${on ? "font-bold text-forest" : "text-ink/75"}`}>{j.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {zoom !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink/80 p-4 backdrop-blur-md sm:p-8"
            onClick={() => setZoom(null)}
          >
            <motion.div
              initial={{ scale: 0.9, rotateX: 12 }}
              animate={{ scale: 1, rotateX: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
              className="relative aspect-[1912/912] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/20 shadow-2xl"
            >
              <Image src={PORTAL_SCREENS[zoom].src} alt={PORTAL_SCREENS[zoom].alt} fill sizes="1400px" className="object-contain" priority />
            </motion.div>
            <button type="button" onClick={() => setZoom(null)} className="absolute right-5 top-5 rounded-full bg-white/15 p-2 text-white hover:bg-white/25" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
