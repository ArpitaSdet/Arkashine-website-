"use client";

/**
 * Soil Map — the app flow from the demo video, animated on real satellite imagery:
 * search → drop reference pin → plot box (50 m / 100 m) → Analyse (satellite scan)
 * → Soil Analysis: fertility, nutrient bars, environmental factors.
 * Values are the sample result shown in the app video.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "motion/react";
import { Crosshair, Layers, LocateFixed, MapPin, Pencil, Satellite, Search, Square, Upload, X } from "lucide-react";
import { SatTiles } from "./SatTiles";
import { coordLabel, fmt, plotCorners, useFieldLocation } from "./fieldLocation";

const NUTRIENTS = [
  { k: "Phosphorus (P)", v: 20.3, u: "kg/ha", s: "Low", c: "#f59e0b", p: 0.3 },
  { k: "Potassium (K)", v: 258.9, u: "kg/ha", s: "Med", c: "#38bdf8", p: 0.6 },
  { k: "Organic Carbon", v: 0.298, u: "%", s: "Low", c: "#a3a3a3", p: 0.25, d: 3 },
  { k: "Sulfur (S)", v: 14.6, u: "ppm", s: "Low", c: "#facc15", p: 0.35 },
  { k: "Iron (Fe)", v: 6.249, u: "ppm", s: "Low", c: "#f97316", p: 0.3, d: 3 },
  { k: "Copper (Cu)", v: 1.397, u: "ppm", s: "Low", c: "#2dd4bf", p: 0.3, d: 3 },
  { k: "Manganese (Mn)", v: 5.863, u: "ppm", s: "Low", c: "#a855f7", p: 0.35, d: 3 },
  { k: "Boron (B)", v: 0.453, u: "ppm", s: "Low", c: "#dc2626", p: 0.25, d: 3 },
];

const ENV = [
  { k: "NDVI", v: 0.55, d: 3, u: "", c: "#4ade80" },
  { k: "Temp", v: 26.9, d: 1, u: "°C", c: "#fbbf24" },
  { k: "Rainfall", v: 732, d: 0, u: "mm", c: "#60a5fa" },
  { k: "Elevation", v: 245, d: 0, u: "m", c: "#4ade80" },
  { k: "Clay", v: 42.2, d: 1, u: "%", c: "#cbd5e1" },
  { k: "Sand", v: 19.7, d: 1, u: "%", c: "#fb923c" },
];

type Phase = "search" | "pin" | "box" | "scan" | "result";
const ORDER: Phase[] = ["search", "pin", "box", "scan", "result"];
const DURATION: Record<Phase, number> = { search: 2200, pin: 1600, box: 1800, scan: 2600, result: 9000 };

function Num({ to, d = 1 }: { to: number; d?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const c = animate(0, to, { duration: 1.3, ease: [0.22, 1, 0.36, 1], onUpdate: setV });
    return () => c.stop();
  }, [to]);
  return <>{v.toFixed(d)}</>;
}

export function SoilMapDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [phase, setPhase] = useState<Phase>(reduce ? "result" : "search");
  const [box, setBox] = useState<50 | 100>(50);
  const [typed, setTyped] = useState("");
  const { loc, status, locateMe } = useFieldLocation();
  const corners = plotCorners(loc, box);

  // auto-play the flow while on screen, then loop
  useEffect(() => {
    if (!inView || reduce) return;
    const t = setTimeout(() => {
      const i = ORDER.indexOf(phase);
      setPhase(ORDER[(i + 1) % ORDER.length]);
    }, DURATION[phase]);
    return () => clearTimeout(t);
  }, [phase, inView, reduce]);

  // typing effect in the search bar
  useEffect(() => {
    if (phase !== "search") return;
    const text = loc.name;
    let i = 0;
    setTyped("");
    const t = setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, 55);
    return () => clearInterval(t);
  }, [phase, loc.name]);

  // a new location restarts the flow there
  useEffect(() => {
    if (!reduce) setPhase("search");
  }, [loc.lat, loc.lon, reduce]);

  const step = ORDER.indexOf(phase);
  const boxPct = box === 50 ? 16 : 26;

  return (
    <div ref={ref} className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      {/* map */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/15 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)] lg:col-span-7">
        <SatTiles key={coordLabel(loc)} lat={loc.lat} lon={loc.lon} zoom={16} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b2520]/50 via-transparent to-[#0b2520]/60" />

        {/* top bar: search + tools */}
        <div className="absolute inset-x-4 top-4 space-y-2.5">
          <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#0d2b26]/85 px-4 py-2.5 text-sm text-white backdrop-blur-md">
            <Search className="h-4 w-4 text-botanical" />
            <span className="min-w-0 flex-1 truncate">
              {phase === "search" ? typed : loc.name}
              {phase === "search" && <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-white align-middle" />}
            </span>
            <button
              type="button"
              onClick={locateMe}
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white hover:bg-white/20"
              title="Centre the map on where you are"
            >
              <LocateFixed className={`h-3.5 w-3.5 text-botanical ${status === "locating" ? "animate-spin" : ""}`} />
              {status === "locating" ? "Locating…" : loc.mine ? "Located" : "Use my location"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { i: Pencil, t: "Draw" },
              { i: Square, t: "4-Pts / Box", on: step >= 2 },
              { i: MapPin, t: "Ref Pin", on: step >= 1 },
            ].map(({ i: Icon, t, on }) => (
              <span key={t} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] backdrop-blur-md ${on ? "border-botanical bg-botanical/25 text-white" : "border-white/15 bg-[#0d2b26]/75 text-white/80"}`}>
                <Icon className="h-3.5 w-3.5 text-botanical" /> {t}
              </span>
            ))}
          </div>
          <AnimatePresence>
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-3 rounded-2xl border border-botanical/50 bg-[#0d2b26]/85 px-3 py-2 backdrop-blur-md"
              >
                <span className="font-mono text-[10px] uppercase tracking-wider text-botanical">Reference anchor</span>
                <span className="font-mono text-xs text-white">{coordLabel(loc)}</span>
                {[50, 100].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBox(b as 50 | 100)}
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${box === b ? "border-botanical bg-[#1E7A33] text-[#fff]" : "border-white/20 text-white/80"}`}
                  >
                    {b}m Box
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* pin + plot box */}
        <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2">
          <AnimatePresence>
            {step >= 2 && (
              <motion.div
                key={box}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-botanical bg-botanical/20 shadow-[0_0_30px_rgba(140,191,95,0.6)]"
                style={{ width: `${boxPct}vmin`, height: `${boxPct}vmin`, maxWidth: 220, maxHeight: 220 }}
                initial={{ scale: 0, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 160, damping: 14 }}
              >
                {[0, 1, 2, 3].map((c) => (
                  <motion.span
                    key={c}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.25 + c * 0.12, type: "spring", stiffness: 300, damping: 14 }}
                    className="absolute flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#1E7A33] font-mono text-[7px] font-bold text-[#fff]"
                    style={{ left: c % 2 ? "calc(100% - 8px)" : -8, top: c < 2 ? -8 : "calc(100% - 8px)" }}
                  >
                    {c + 1}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {step >= 1 && (
              <motion.div
                className="relative z-10 flex flex-col items-center"
                initial={{ y: -120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 13 }}
              >
                <span className="mb-1 rounded-md bg-[#1E7A33] px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-[#fff]">Reference</span>
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#0ea5b7]/80">
                  <Crosshair className="h-4 w-4 text-white" />
                  <motion.span className="absolute inset-0 rounded-full border-2 border-white" animate={{ scale: [1, 2.2], opacity: [0.8, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* satellite scan */}
        <AnimatePresence>
          {phase === "scan" && (
            <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div
                className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#5eead4]/45 to-transparent"
                initial={{ top: "-20%" }}
                animate={{ top: "110%" }}
                transition={{ duration: 1.3, repeat: 1, ease: "easeInOut" }}
              />
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-9 opacity-40">
                {Array.from({ length: 108 }, (_, i) => (
                  <motion.span
                    key={i}
                    className="border border-[#5eead4]/20"
                    initial={{ backgroundColor: "rgba(94,234,212,0)" }}
                    animate={{ backgroundColor: ["rgba(94,234,212,0)", `rgba(${i % 3 ? "245,158,11" : "74,222,128"},0.35)`, "rgba(94,234,212,0)"] }}
                    transition={{ duration: 1.6, delay: (i % 12) * 0.05 + Math.floor(i / 12) * 0.04 }}
                  />
                ))}
              </div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-[#0d2b26]/90 px-6 py-4 text-center backdrop-blur-md">
                <Satellite className="mx-auto h-6 w-6 animate-pulse text-botanical" />
                <div className="mt-2 font-semibold text-white">Analysing soil</div>
                <div className="text-xs text-white/60">Processing satellite &amp; ground data…</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* plot corner points */}
        <AnimatePresence>
          {step >= 2 && step < 4 && (
            <motion.ol
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-[4.25rem] right-4 hidden space-y-0.5 rounded-xl border border-white/15 bg-[#0d2b26]/85 px-3 py-2 font-mono text-[10px] text-white backdrop-blur-md sm:block"
            >
              <li className="mb-1 uppercase tracking-wider text-botanical">{box} m plot · 4 points</li>
              {corners.map((c, i) => (
                <li key={i}>
                  <span className="text-botanical">P{i + 1}</span> {fmt(c.lat)}, {fmt(c.lon)}
                </li>
              ))}
            </motion.ol>
          )}
        </AnimatePresence>
        {(status === "denied" || status === "unavailable") && (
          <p className="absolute bottom-[4.25rem] left-4 max-w-[60%] rounded-lg bg-[#0d2b26]/85 px-2.5 py-1 text-[11px] text-white/85">
            {status === "denied" ? "Location permission is off — showing Bengaluru." : "Location not available — showing Bengaluru."}
          </p>
        )}

        {/* bottom actions */}
        <div className="absolute inset-x-4 bottom-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPhase("search")}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/15 bg-[#0d2b26]/85 py-2.5 font-mono text-xs text-white backdrop-blur-md"
          >
            <X className="h-4 w-4" /> Clear
          </button>
          <button
            type="button"
            onClick={() => setPhase("scan")}
            className={`inline-flex items-center justify-center gap-1.5 rounded-2xl py-2.5 font-mono text-xs font-bold text-forest-deep transition-transform ${step >= 2 && step < 3 ? "scale-105 bg-[#4ade80] shadow-[0_0_25px_rgba(74,222,128,0.6)]" : "bg-[#4ade80]/85"}`}
          >
            <Upload className="h-4 w-4" /> Analyse
          </button>
        </div>
      </div>

      {/* results */}
      <div className="lg:col-span-5">
        {/* step tracker */}
        <div className="mb-4 flex items-center gap-1.5">
          {["Search", "Pin", "Plot", "Scan", "Result"].map((t, i) => (
            <div key={t} className="flex-1">
              <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full bg-botanical" animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
              </div>
              <div className={`mt-1 font-mono text-[10px] uppercase tracking-wider ${i === step ? "text-botanical" : "text-white/40"}`}>{t}</div>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {phase === "result" ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="rounded-[24px] border border-white/15 bg-[#1b4a40] p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Soil Analysis</h3>
                  <p className="font-mono text-[10px] text-white/50">{loc.mine ? "Your location" : loc.name} · {coordLabel(loc)}</p>
                </div>
                <span className="rounded-full border border-[#f87171]/50 bg-[#f87171]/15 px-3 py-1 font-mono text-[11px] font-bold text-[#fca5a5]">Low fertility</span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {NUTRIENTS.map((n, i) => (
                  <motion.div
                    key={n.k}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.07 }}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5 text-white/85">
                        <span className="h-2 w-2 rounded-full" style={{ background: n.c }} /> {n.k}
                      </span>
                      <span className={`rounded px-1.5 font-mono text-[9px] ${n.s === "Low" ? "bg-[#f87171]/15 text-[#fca5a5]" : "bg-[#fbbf24]/15 text-[#fcd34d]"}`}>{n.s}</span>
                    </div>
                    <div className="mt-1 font-mono text-sm font-bold" style={{ color: n.c }}>
                      <Num to={n.v} d={n.d ?? 1} /> <span className="text-[10px] font-normal text-white/50">{n.u}</span>
                    </div>
                    <div className="mt-1 h-1 rounded-full bg-white/10">
                      <motion.div className="h-full rounded-full" style={{ background: n.c }} initial={{ width: 0 }} animate={{ width: `${n.p * 100}%` }} transition={{ delay: 0.3 + i * 0.07, duration: 0.9 }} />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-white/70">
                <Layers className="h-3.5 w-3.5 text-botanical" /> Environmental factors
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {ENV.map((e, i) => (
                  <motion.div
                    key={e.k}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.07, type: "spring", stiffness: 220, damping: 15 }}
                    className="rounded-xl border border-white/10 bg-white/[0.04] py-2 text-center"
                  >
                    <div className="font-mono text-base font-bold" style={{ color: e.c }}>
                      <Num to={e.v} d={e.d} />
                      {e.u}
                    </div>
                    <div className="font-mono text-[9px] uppercase text-white/50">{e.k}</div>
                  </motion.div>
                ))}
              </div>
              <p className="mt-3 font-mono text-[10px] text-white/40">Sample result from the Soil Partner app. For lab-accurate results, confirm with a SoiLenz test.</p>
            </motion.div>
          ) : (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-[24px] border border-dashed border-white/20 bg-white/[0.03] p-6"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-botanical">How it works</p>
              <ol className="mt-3 space-y-2.5 text-sm text-white/80">
                {["Search a village, field or landmark", "Drop a reference pin — like booking a ride", "Pick a 50 m or 100 m plot, or draw your own", "Tap Analyse: satellite + ground data combine"].map((t, i) => (
                  <li key={t} className={`flex gap-3 transition-opacity ${i <= step ? "opacity-100" : "opacity-40"}`}>
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] ${i <= step ? "bg-[#1E7A33] text-[#fff]" : "bg-white/10 text-white/60"}`}>{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
