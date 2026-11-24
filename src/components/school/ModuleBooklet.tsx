"use client";

// A "booklet" of the four curriculum modules — closed covers you click to
// open, like turning a page, instead of four walls of text shown at once.
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen, ChevronDown } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export interface ModuleData {
  num: string;
  title: string;
  hours: string;
  photo: string;
  photoAlt: string;
  summary: string;
  practical: string;
  assessment: string;
}

export function ModuleBooklet({ modules }: { modules: ModuleData[] }) {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a1f18] shadow-2xl" style={{ perspective: 1400 }}>
      {modules.map((m, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={m.num} className={i > 0 ? "border-t border-white/10" : ""}>
            {/* closed cover / spine — always visible, click to open this page */}
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className={`flex w-full items-center gap-4 px-5 py-5 text-left transition-colors sm:px-8 ${
                isOpen ? "bg-botanical/10" : "hover:bg-white/[0.03]"
              }`}
            >
              <div
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border transition-colors sm:h-16 sm:w-16 ${
                  isOpen ? "border-botanical" : "border-white/15"
                }`}
              >
                <Image src={m.photo} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-botanical">{m.num}</span>
                  <h3 className="truncate font-display text-base font-semibold text-ivory sm:text-xl">{m.title}</h3>
                </div>
                <span className="mt-1 inline-block font-mono text-[11px] text-ivory/50">{m.hours}</span>
              </div>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-ivory/50 transition-transform duration-300 ${isOpen ? "rotate-180 text-botanical" : ""}`}
                strokeWidth={2}
              />
            </button>

            {/* the page, falling open downward from the cover's hinge */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="page"
                  initial={{ rotateX: -90, opacity: 0, height: 0 }}
                  animate={{ rotateX: 0, opacity: 1, height: "auto" }}
                  exit={{ rotateX: -90, opacity: 0, height: 0 }}
                  transition={{ duration: 0.45, ease }}
                  style={{ transformOrigin: "top center" }}
                  className="origin-top overflow-hidden"
                >
                  <div className="grid grid-cols-1 gap-6 border-t border-white/10 bg-[#071712] px-5 py-6 sm:grid-cols-[1.1fr_1fr] sm:px-8 sm:py-8 lg:grid-cols-[1.3fr_1fr_1fr]">
                    <div className="relative order-first h-40 overflow-hidden rounded-xl sm:order-none sm:h-full sm:min-h-[180px]">
                      <Image src={m.photo} alt={m.photoAlt} fill sizes="(max-width: 1024px) 90vw, 360px" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-3">
                        <BookOpen className="h-3.5 w-3.5 text-botanical" strokeWidth={2} />
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ivory/85">Module {m.num}</span>
                      </div>
                    </div>
                    <div>
                      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-ivory/50">What students learn</span>
                      <p className="text-sm leading-relaxed text-ivory/80">{m.summary}</p>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-botanical">Hands-on &amp; outcome</span>
                      <p className="text-sm leading-relaxed text-ivory/80">{m.practical}</p>
                      <p className="mt-3 text-xs text-ivory/55">{m.assessment}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
