"use client";

/**
 * Patents: the four granted Indian patents up front, and a "10 more patents"
 * view where the further patents travel round a slowly rotating 3D ring.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Award, ChevronLeft, ChevronRight, FileCheck2, Pause, Play, ScrollText, X } from "lucide-react";
import { morePatents, patents } from "@/lib/cinema-content";

const ease = [0.22, 1, 0.36, 1] as const;
const IPINDIA = "https://iprsearch.ipindia.gov.in/PublicSearch/";

export function PatentShowcase() {
  const [open, setOpen] = useState<number | null>(null);
  const [more, setMore] = useState(false);
  const p = open !== null ? patents[open] : null;

  useEffect(() => {
    if (!more && open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMore(false);
        setOpen(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [more, open]);

  return (
    <section id="patents" className="relative overflow-hidden bg-[#e7f4f3] py-24 md:py-32" aria-labelledby="patents-title">
      <div aria-hidden className="pointer-events-none absolute -left-32 top-20 h-[380px] w-[380px] rounded-full bg-[#bfe3c4]/60 blur-[110px]" />
      <div className="container-site relative">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-[#3f4f6b]">Patents &amp; innovation</p>
            <h2 id="patents-title" className="display mt-5 text-[clamp(2.4rem,4.4vw,4.2rem)] leading-[1.02] text-[#162a54]">
              Patented.
              <br />
              <span className="font-light">Precise. Portable.</span>
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-end">
            <span className="rounded-full bg-[#1E7A33] px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#fff]">4 granted</span>
            <span className="rounded-full border border-[#162a54]/15 bg-[#fff] px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#162a54]">+10 more</span>
            <a href={IPINDIA} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#162a54] underline-offset-4 hover:underline">
              Verify on IP India <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* the four granted patents */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {patents.map((pt, i) => (
            <motion.button
              key={pt.id}
              type="button"
              onClick={() => setOpen(i)}
              initial={{ opacity: 0, y: 30, rotateX: 12 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 140, damping: 16, delay: i * 0.1 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#162a54]/10 bg-[#fff] p-6 text-left shadow-[0_24px_50px_-34px_rgba(22,42,84,0.5)] [transform-perspective:900px]"
            >
              <span aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#cfe8b4]/60 transition-transform duration-700 group-hover:scale-150" />
              <div className="relative flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1E7A33] text-[#fff] shadow-md">
                  <Award className="h-6 w-6" strokeWidth={1.6} />
                </span>
                <span className="font-mono text-4xl font-bold text-[#162a54]/10">0{i + 1}</span>
              </div>
              <p className="relative mt-5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#1E7A33]">{pt.status}</p>
              <p className="relative mt-1 font-display text-2xl font-bold text-[#162a54]">{pt.number}</p>
              <p className="relative mt-2 flex-1 text-[15px] leading-snug text-[#3f4f6b]">{pt.title}</p>
              <dl className="relative mt-5 grid grid-cols-2 gap-2 border-t border-[#162a54]/10 pt-4 text-xs">
                <div>
                  <dt className="font-mono uppercase tracking-wider text-[#5b6575]">Granted</dt>
                  <dd className="mt-0.5 font-semibold text-[#162a54]">{pt.date}</dd>
                </div>
                <div>
                  <dt className="font-mono uppercase tracking-wider text-[#5b6575]">Filed</dt>
                  <dd className="mt-0.5 font-semibold text-[#162a54]">{pt.filed}</dd>
                </div>
              </dl>
              <span className="relative mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1E7A33]">
                View certificate details <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.button>
          ))}
        </div>

        {/* open the further patents */}
        <motion.button
          type="button"
          onClick={() => setMore(true)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group relative mx-auto mt-10 flex w-full max-w-xl items-center justify-between gap-4 overflow-hidden rounded-full border border-[#162a54]/10 bg-[#fff] py-2.5 pl-3 pr-6 shadow-[0_20px_40px_-26px_rgba(22,42,84,0.6)]"
        >
          <span className="flex items-center gap-3">
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#162a54] text-[#fff]">
              <motion.span className="absolute inset-0 rounded-full border-2 border-dashed border-[#8CBF5F]" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
              <ScrollText className="h-5 w-5" />
            </span>
            <span className="text-left">
              <span className="block font-display text-lg font-bold text-[#162a54]">10 more patents</span>
              <span className="block text-xs text-[#5b6575]">Open the full patent portfolio</span>
            </span>
          </span>
          <ChevronRight className="h-5 w-5 text-[#1E7A33] transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>

      {/* details of a granted patent */}
      <AnimatePresence>
        {p && (
          <>
            <motion.div className="fixed inset-0 z-[70] bg-[#0e1f40]/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={`${p.number} ${p.title}`}
              className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-md flex-col overflow-y-auto bg-[#fff] px-8 py-10 text-[#162a54]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 220, damping: 30 }}
            >
              <button type="button" onClick={() => setOpen(null)} className="self-end rounded-full border border-[#162a54]/15 p-2.5 hover:bg-[#e7f4f3]" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
              <span className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1E7A33] text-[#fff]">
                <FileCheck2 className="h-7 w-7" strokeWidth={1.6} />
              </span>
              <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#1E7A33]">{p.status}</p>
              <h3 className="display mt-2 text-4xl">{p.number}</h3>
              <p className="mt-2 text-lg text-[#3f4f6b]">{p.title}</p>
              <dl className="mt-8 space-y-4 text-[15px]">
                {[
                  ["Patent no.", p.number],
                  ["Application no.", p.application],
                  ["Date of filing", p.filed],
                  ["Date of grant", p.date],
                  ["Patentee", "ArkaShine Innovations Pvt. Ltd."],
                  ["Note", p.note],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 border-b border-[#162a54]/10 pb-3">
                    <dt className="text-[#5b6575]">{k}</dt>
                    <dd className="text-right font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <a href={IPINDIA} target="_blank" rel="noreferrer" className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#1E7A33] py-3.5 text-sm font-semibold text-[#fff] hover:bg-[#17642a]">
                Verify on IP India <ArrowUpRight className="h-4 w-4" />
              </a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* the further patents, on a rotating ring */}
      <AnimatePresence>{more && <MorePatents onClose={() => setMore(false)} />}</AnimatePresence>
    </section>
  );
}

function MorePatents({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion();
  const n = morePatents.length;
  const [front, setFront] = useState(0);
  const [playing, setPlaying] = useState(!reduce);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setFront((f) => (f + 1) % n), 2600);
    return () => clearInterval(t);
  }, [playing, n]);

  const step = 360 / n;
  const current = morePatents[front];

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0e1f40]/55 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Further ArkaShine patents"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl overflow-hidden rounded-[32px] bg-[linear-gradient(160deg,#ffffff,#e7f4f3)] p-6 text-[#162a54] shadow-2xl sm:p-10"
        initial={{ y: 40, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 30, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
      >
        <button type="button" onClick={onClose} className="absolute right-5 top-5 z-10 rounded-full border border-[#162a54]/15 bg-[#fff] p-2.5 hover:bg-[#e7f4f3]" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#1E7A33]">Patent portfolio</p>
        <h3 className="display mt-2 text-3xl sm:text-4xl">10 more patents</h3>
        <p className="mt-2 max-w-xl text-sm text-[#3f4f6b]">Beyond the four granted patents, ArkaShine holds ten further patent applications covering soil diagnostics, agronomy AI, biopesticides and perishable item analysis.</p>

        {/* rotating 3D ring */}
        <div className="relative mx-auto mt-6 h-[300px] w-full [perspective:1100px] sm:h-[340px]">
          <motion.div
            className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]"
            animate={{ rotateY: -front * step }}
            transition={{ type: "spring", stiffness: 60, damping: 16 }}
          >
            {morePatents.map((m, i) => {
              const on = i === front;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setFront(i);
                    setPlaying(false);
                  }}
                  className="absolute left-0 top-0 h-[190px] w-[150px] [backface-visibility:hidden] sm:h-[210px] sm:w-[170px]"
                  style={{ transform: `translate(-50%,-50%) rotateY(${i * step}deg) translateZ(clamp(220px, 32vw, 330px))` }}
                  aria-label={`Patent ${m.no}`}
                >
                  <span
                    className={`flex h-full w-full flex-col justify-between rounded-[22px] border p-4 text-left shadow-[0_24px_40px_-24px_rgba(22,42,84,0.6)] transition-colors duration-500 ${
                      on ? "border-transparent bg-[#1E7A33] text-[#fff]" : "border-[#162a54]/10 bg-[#fff] text-[#162a54]"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <ScrollText className={`h-6 w-6 ${on ? "text-[#fff]" : "text-[#1E7A33]"}`} strokeWidth={1.6} />
                      <span className={`font-mono text-3xl font-bold ${on ? "text-[#fff]/40" : "text-[#162a54]/15"}`}>{m.no}</span>
                    </span>
                    <span>
                      <span className={`block font-mono text-[10px] uppercase tracking-[0.14em] ${on ? "text-[#fff]/80" : "text-[#5b6575]"}`}>App. {m.application}</span>
                      <span className="mt-1 block font-display text-sm font-bold leading-tight">{m.title}</span>
                      <span className={`mt-1 block text-[11px] leading-snug ${on ? "text-[#fff]/85" : "text-[#5b6575]"}`}>{m.status}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => { setFront((f) => (f - 1 + n) % n); setPlaying(false); }} className="rounded-full border border-[#162a54]/15 bg-[#fff] p-2.5 hover:bg-[#e7f4f3]" aria-label="Previous patent">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => setPlaying((v) => !v)} className="inline-flex items-center gap-2 rounded-full bg-[#162a54] px-5 py-2.5 text-sm font-semibold text-[#fff]">
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {playing ? "Pause" : "Rotate"}
          </button>
          <button type="button" onClick={() => { setFront((f) => (f + 1) % n); setPlaying(false); }} className="rounded-full border border-[#162a54]/15 bg-[#fff] p-2.5 hover:bg-[#e7f4f3]" aria-label="Next patent">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={current.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease }} className="mt-4 text-center text-sm text-[#3f4f6b]">
            App. No. {current.application} · {current.date} · {current.status}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
