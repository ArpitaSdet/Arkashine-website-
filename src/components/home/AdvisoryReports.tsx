"use client";

/**
 * Advisory reports — what a farmer gets after a SoiLenz test.
 * Left: the real 8-page advisory report (sample: Bhanu D, onion, Karnataka)
 * as a fanned 3D stack that deals itself page by page.
 * Right: live numbers from that report, the 4-step service flow, reach
 * counters, and an open advisory card (no test or report needed) that hands off to WhatsApp.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, animate, motion, useInView } from "motion/react";
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  FileText,
  FlaskConical,
  Grid3x3,
  Leaf,
  MessageCircle,
  Microscope,
  Users,
  X,
} from "lucide-react";
import { company } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

const PAGES = [
  { src: "/images/advisory/report-p1-bhanu.webp", title: "Soil health score" },
  { src: "/images/advisory/report-p2.webp", title: "14-parameter results" },
  { src: "/images/advisory/report-p3.webp", title: "Field grid heatmaps" },
  { src: "/images/advisory/report-p4.webp", title: "Fertiliser plan" },
  { src: "/images/advisory/report-p5.webp", title: "Crop suitability" },
  { src: "/images/advisory/report-p6.webp", title: "Dose per crop" },
  { src: "/images/advisory/report-p7.webp", title: "Organic & natural inputs" },
  { src: "/images/advisory/report-p8.webp", title: "Carbon impact" },
];

/* values from the sample report (page 1–2) — Bhanu D · Onion · 1 Acre */
const READINGS = [
  { k: "pH", v: 7.84, d: 2, unit: "", status: "Basic", tone: "#E8A13A", pct: 0.68 },
  { k: "EC", v: 0.3224, d: 4, unit: "dS/m", status: "Medium", tone: "#E8A13A", pct: 0.52 },
  { k: "N", v: 130.14, d: 0, unit: "kg/ha", status: "Medium", tone: "#E8A13A", pct: 0.5 },
  { k: "P", v: 56.08, d: 1, unit: "kg/ha", status: "Suff", tone: "#8cbf5f", pct: 0.72 },
  { k: "K", v: 101.05, d: 0, unit: "kg/ha", status: "Low", tone: "#C2410C", pct: 0.38 },
  { k: "OC", v: 0.52, d: 2, unit: "%", status: "Medium", tone: "#E8A13A", pct: 0.5 },
];

const STEPS = [
  { icon: CalendarCheck, title: "Request advisory" },
  { icon: Grid3x3, title: "Grid sampling" },
  { icon: FlaskConical, title: "14-parameter test" },
  { icon: FileText, title: "Advisory report" },
];

const REACH = [
  { n: 25000, suffix: "+", label: "Farmers reached" },
  { n: 4000, suffix: "+", label: "Soil tests completed" },
  { n: 8, suffix: "", label: "Pages per report" },
];


function Count({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease, onUpdate: setV });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/* ---------------- report stack ---------------- */

function ReportStack({ onOpen }: { onOpen: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [top, setTop] = useState(0);
  const [fan, setFan] = useState(false);

  useEffect(() => {
    if (!inView || fan) return;
    const t = setInterval(() => setTop((p) => (p + 1) % PAGES.length), 2400);
    return () => clearInterval(t);
  }, [inView, fan]);

  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-[1190/1540] w-full max-w-[min(420px,calc((100svh-14rem)*0.77))]"
      style={{ perspective: 1600 }}
      onMouseEnter={() => setFan(true)}
      onMouseLeave={() => setFan(false)}
    >
      {PAGES.map((p, i) => {
        const depth = (i - top + PAGES.length) % PAGES.length; // 0 = front
        const fanX = (i - (PAGES.length - 1) / 2) * 26;
        return (
          <motion.button
            key={p.src}
            type="button"
            onClick={() => onOpen(i)}
            aria-label={`Open report page ${i + 1}: ${p.title}`}
            className="absolute inset-0 overflow-hidden rounded-xl border border-black/10 bg-[#fff] text-left shadow-[0_20px_50px_rgba(0,0,0,0.45)] focus-visible:outline-3 focus-visible:outline-botanical"
            style={{ zIndex: fan ? i : PAGES.length - depth, transformOrigin: "50% 100%" }}
            initial={false}
            animate={
              fan
                ? { x: fanX * 0.7, y: Math.abs(fanX) * 0.4, rotateZ: fanX * 0.28, rotateY: 0, scale: 0.76, opacity: 1 }
                : {
                    x: depth * 10,
                    y: depth * -10,
                    rotateZ: depth === 0 ? -2 : depth * 1.6,
                    rotateY: depth === 0 ? -8 : -14,
                    scale: 1 - depth * 0.03,
                    opacity: depth > 4 ? 0 : 1,
                  }
            }
            whileHover={fan ? { y: -36, scale: 0.8, rotateZ: 0, zIndex: 50 } : undefined}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <Image src={p.src} alt={`Sample advisory report, page ${i + 1}: ${p.title}`} fill sizes="420px" className="object-cover object-top" />
            {/* light sweep on the front page */}
            {depth === 0 && !fan && (
              <motion.span
                key={top}
                className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                initial={{ left: "-40%" }}
                animate={{ left: "130%" }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
            )}
          </motion.button>
        );
      })}

      {/* page label */}
      <div className="absolute -bottom-12 left-0 right-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={fan ? "fan" : top}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-full border border-[#162a54]/15 bg-[#fff] px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-[#3f4f6b]"
          >
            {fan ? "Click a page to read" : `${String(top + 1).padStart(2, "0")} · ${PAGES[top].title}`}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------- advisory for everyone ---------------- */

function OpenAdvisory() {
  const msg = encodeURIComponent("Hi ArkaShine, I'd like advisory for my land. I don't have a soil test report yet.");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease }}
      className="relative overflow-hidden rounded-3xl border border-[#162a54]/15 bg-[linear-gradient(150deg,#ffffff,#eaf5dc)] p-5"
    >
      <motion.span
        aria-hidden
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#8CBF5F]/25 blur-2xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <div className="relative flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#1E7A33]">
        <Microscope className="h-4 w-4" strokeWidth={1.6} /> Advisory for everyone
      </div>
      <h3 className="relative mt-3 font-display text-xl font-bold leading-snug text-[#162a54]">No machine? No report? You can still get expert advice.</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-[#3f4f6b]">
        Anyone can ask for advisory, with or without a SoiLenz test or a soil report. We help you understand your land, and our team of scientists consults with you directly.
      </p>
      <ul className="relative mt-3 space-y-1.5 text-sm text-[#162a54]">
        {["Know your land's details", "One-to-one consultation with our scientists", "Crop and fertiliser guidance"].map((t) => (
          <li key={t} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1E7A33]" /> {t}
          </li>
        ))}
      </ul>
      <motion.a
        href={`https://wa.me/91${company.phoneRaw}?text=${msg}`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="group relative mt-4 flex items-center justify-between gap-3 rounded-full bg-[#1E7A33] py-2 pl-5 pr-2 font-semibold text-[#fff] shadow-[0_10px_30px_rgba(30,122,51,0.3)]"
      >
        <span className="text-sm">Talk to our scientists</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff] text-[#1E7A33] transition-transform group-hover:translate-x-1">
          <MessageCircle className="h-4 w-4" />
        </span>
      </motion.a>
    </motion.div>
  );
}

/* ---------------- section ---------------- */

export function AdvisoryReports() {
  const [reader, setReader] = useState<number | null>(null);

  useEffect(() => {
    if (reader === null) return;
    const f = (e: KeyboardEvent) => {
      if (e.key === "Escape") setReader(null);
      if (e.key === "ArrowRight") setReader((r) => (r === null ? r : Math.min(PAGES.length - 1, r + 1)));
      if (e.key === "ArrowLeft") setReader((r) => (r === null ? r : Math.max(0, r - 1)));
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [reader]);

  return (
    <section id="advisory" aria-labelledby="advisory-title" className="relative overflow-hidden bg-[#fbf7ee] py-24 text-[#162a54] md:py-32">
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[480px] w-[480px] rounded-full bg-botanical/15 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#E8A13A]/10 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(#162a54_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="container-site relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease }}
          className="max-w-3xl"
        >
          <p className="eyebrow text-[#3f4f6b]">Advisory services</p>
          <h2 id="advisory-title" className="display mt-5 text-[clamp(2.3rem,5vw,4.8rem)] leading-[1.02] text-[#162a54] [text-wrap:balance]">
            Every test becomes <span className="text-[#1E7A33]">a farm plan.</span>
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-10">
          {/* report */}
          <div className="lg:col-span-5">
            <ReportStack onOpen={setReader} />
            <p className="mt-16 text-center font-mono text-xs uppercase tracking-[0.14em] text-[#3f4f6b]">
              Sample report · Bhanu D · Onion · 1 Acre · Eastern Dry Zone
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-7">
            {/* live readings */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease }}
              className="grid grid-cols-1 items-center justify-items-center gap-6 rounded-3xl sm:grid-cols-[auto_1fr] sm:justify-items-stretch border border-[#162a54]/15 bg-[#fff] p-5"
            >
              <ScoreGauge score={53} />
              <div className="w-full space-y-2.5">
                {READINGS.map((r, i) => (
                  <div key={r.k} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-[#3f4f6b]">{r.k}</span>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#162a54]/10">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: r.tone }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${r.pct * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease, delay: 0.2 + i * 0.1 }}
                      />
                    </div>
                    <span className="text-right font-mono text-xs sm:w-32 text-[#162a54]">
                      <Count to={r.v} decimals={r.d} /> <span className="text-[#3f4f6b]">{r.unit}</span>
                      <span className="ml-2 text-xs uppercase" style={{ color: r.tone }}>
                        {r.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* how it works */}
            <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-4">
              <motion.div
                className="absolute left-[12%] right-[12%] top-7 hidden h-px origin-left bg-gradient-to-r from-botanical via-botanical/60 to-[#E8A13A] sm:block"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease }}
              />
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.2 + i * 0.15 }}
                    className="relative flex flex-col items-center gap-2 text-center"
                  >
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-botanical/40 bg-[#fff] text-[#1E7A33]">
                      <motion.span
                        className="absolute inset-0 rounded-full border border-botanical/50"
                        animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.5 }}
                      />
                      <Icon className="h-6 w-6" strokeWidth={1.5} />
                    </span>
                    <span className="font-mono text-xs text-[#3f4f6b]">0{i + 1}</span>
                    <span className="text-sm font-semibold text-[#162a54]">{s.title}</span>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1.2fr]">
              {/* reach */}
              <div className="grid grid-cols-1 gap-3">
                {REACH.map((r, i) => (
                  <motion.div
                    key={r.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease, delay: i * 0.1 }}
                    className="flex items-center gap-4 rounded-2xl border border-[#162a54]/15 bg-[#fff] px-4 py-3"
                  >
                    {i === 0 ? <Users className="h-5 w-5 text-[#1E7A33]" strokeWidth={1.5} /> : i === 1 ? <Leaf className="h-5 w-5 text-[#1E7A33]" strokeWidth={1.5} /> : <FileText className="h-5 w-5 text-[#1E7A33]" strokeWidth={1.5} />}
                    <span className="font-mono text-2xl font-bold text-[#162a54]">
                      <Count to={r.n} suffix={r.suffix} />
                    </span>
                    <span className="ml-auto font-mono text-xs uppercase tracking-[0.14em] text-[#3f4f6b]">{r.label}</span>
                  </motion.div>
                ))}
              </div>

              <OpenAdvisory />
            </div>
          </div>
        </div>
      </div>

      {/* reader */}
      <AnimatePresence>
        {reader !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setReader(null)}
          >
            <motion.div
              key={reader}
              initial={{ opacity: 0, rotateY: -20, scale: 0.94 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 130, damping: 18 }}
              className="relative aspect-[1190/1540] h-[88vh] max-w-full overflow-hidden rounded-xl bg-[#fff] shadow-2xl"
              style={{ transformPerspective: 1200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={PAGES[reader].src} alt={`Sample advisory report, page ${reader + 1}`} fill sizes="900px" className="object-contain" priority />
            </motion.div>
            <button type="button" onClick={() => setReader(null)} className="absolute right-5 top-5 rounded-full bg-white/15 p-2 text-[#fff] hover:bg-white/25" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            {reader > 0 && (
              <button type="button" onClick={(e) => { e.stopPropagation(); setReader(reader - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-3 text-[#fff] hover:bg-[#1E7A33]" aria-label="Previous page">
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}
            {reader < PAGES.length - 1 && (
              <button type="button" onClick={(e) => { e.stopPropagation(); setReader(reader + 1); }} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-3 text-[#fff] hover:bg-[#1E7A33]" aria-label="Next page">
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const r = 46;
  const c = Math.PI * r; // half circle
  return (
    <div className="relative flex w-32 flex-col items-center">
      <svg viewBox="0 0 120 70" className="w-full">
        <defs>
          <linearGradient id="adv-g" x1="0" x2="1">
            <stop offset="0" stopColor="#C2410C" />
            <stop offset="0.5" stopColor="#E8A13A" />
            <stop offset="1" stopColor="#8cbf5f" />
          </linearGradient>
        </defs>
        <path d="M14 62 A46 46 0 0 1 106 62" fill="none" stroke="rgba(22,42,84,0.1)" strokeWidth="10" strokeLinecap="round" />
        <motion.path
          d="M14 62 A46 46 0 0 1 106 62"
          fill="none"
          stroke="url(#adv-g)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - score / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease }}
        />
      </svg>
      <div className="-mt-6 font-mono text-3xl font-bold text-[#E8A13A]">
        <Count to={score} />
      </div>
      <div className="font-mono text-xs uppercase tracking-[0.14em] text-[#3f4f6b]">Soil health / 100</div>
    </div>
  );
}
