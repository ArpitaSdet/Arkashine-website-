"use client";

/**
 * Creative, card-free interactive protocol visualizer.
 * Displays authentic organic farming method photographs with:
 * - ZERO text on the images (completely unobstructed, pure photography)
 * - Large, prominent, crystal-clear high-resolution presentation (2000x1585 original quality)
 * - Uncompressed unoptimized rendering for maximum sharpness
 * - Full-screen high-clarity inspector
 * - Dynamic dosage scaler (1 Acre, 2.5 Acres, 5 Acres, Kitchen Garden)
 * - Living preparation vine connecting steps organically (no generic cards)
 */

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  Sparkles,
  Sprout,
  Bug,
  Microscope,
  Clock,
  Droplet,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ShieldCheck,
  Zap,
  Sun,
  X,
  ZoomIn,
} from "lucide-react";


/* natural size of each infographic, so the frame always matches the image (never cropped) */
const PHOTO_DIMS: Record<string, [number, number]> = {
  "/images/organic-methods/01_Beejamrutham.jpg": [2000, 1585],
  "/images/organic-methods/02_Jeevamrutham.jpg": [2000, 1585],
  "/images/organic-methods/03_Ghanajeevamrutham.jpg": [2000, 1585],
  "/images/organic-methods/04_Panchagavya.jpg": [2000, 1585],
  "/images/organic-methods/05_Compost_Farmyard_Manure_FYM.jpg": [2000, 1585],
  "/images/organic-methods/06_Vermicompost.jpg": [2000, 1585],
  "/images/organic-methods/07_Green_Manure.jpg": [2000, 1585],
  "/images/organic-methods/08_Neemastra.jpg": [2000, 1585],
  "/images/organic-methods/09_Agniastra.jpg": [2000, 1645],
  "/images/organic-methods/10_Brahmastra.jpg": [2000, 1585],
  "/images/organic-methods/11_Dashaparni_Ark.jpg": [2000, 2175],
  "/images/organic-methods/12_Rhizobium.jpg": [2000, 995],
  "/images/organic-methods/13_Azotobacter_Azospirillum.jpg": [2000, 995],
  "/images/organic-methods/14_PSB_Phosphate_Solubilizing_Bacteria.jpg": [2000, 995],
  "/images/organic-methods/15_Trichoderma.jpg": [2000, 1585],
  "/images/organic-methods/16_Pseudomonas_fluorescens.jpg": [2000, 995],
  "/images/organic-methods/17_Beauveria_bassiana.jpg": [2000, 1585],
  "/images/organic-methods/18_Bacillus_thuringiensis_Bt.jpg": [2000, 1055],
  "/images/organic-methods/19_NPV_HaNPV_SlNPV.jpg": [2000, 1055],
};

export interface MethodItem {
  id: number;
  name: string;
  category: "nutrition" | "pest" | "bio";
  type: string;
  readyIn: string;
  quantity: string;
  frequency: string;
  purpose: string;
  ingredients: { item: string; qty: string }[];
  steps: string[];
  application: {
    field: string;
    garden: string;
    timing: string;
  };
  shelfLife: string;
  precautions: string[];
  photos: {
    title: string;
    src: string;
    alt: string;
    caption: string;
  }[];
}

const CATEGORY_THEMES = {
  nutrition: {
    label: "Soil & Crop Nutrition",
    color: "#2e7d32",
    lightBg: "rgba(46, 125, 50, 0.08)",
    glow: "rgba(76, 175, 80, 0.35)",
    icon: Sprout,
    pillBg: "bg-emerald-100 text-[#162a54] border-emerald-300",
  },
  pest: {
    label: "Botanical Crop Defense",
    color: "#d97706",
    lightBg: "rgba(217, 119, 6, 0.08)",
    glow: "rgba(245, 158, 11, 0.35)",
    icon: Bug,
    pillBg: "bg-amber-100 text-amber-950 border-amber-300",
  },
  bio: {
    label: "Biological Micro-Inoculants",
    color: "#0f766e",
    lightBg: "rgba(15, 118, 110, 0.08)",
    glow: "rgba(20, 184, 166, 0.35)",
    icon: Microscope,
    pillBg: "bg-teal-100 text-teal-950 border-teal-300",
  },
} as const;

export function LivingProtocolViewer({
  methods,
  selectedId,
  onSelect,
}: {
  methods: MethodItem[];
  selectedId: number;
  onSelect: (id: number) => void;
}) {
  const activeMethod = methods.find((m) => m.id === selectedId) || methods[0];
  const [scaleFactor, setScaleFactor] = useState<"1acre" | "2.5acres" | "5acres" | "garden">("1acre");
  const [appMode, setAppMode] = useState<"field" | "garden">("field");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const theme = CATEGORY_THEMES[activeMethod.category];
  const Icon = theme.icon;
  const photo = activeMethod.photos[0];

  // Close fullscreen on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Dynamic dosage scaler for ingredients
  const scaledIngredients = useMemo(() => {
    const mult =
      scaleFactor === "1acre"
        ? 1
        : scaleFactor === "2.5acres"
        ? 2.5
        : scaleFactor === "5acres"
        ? 5
        : 0.05; // 5% for small balcony / kitchen garden

    return activeMethod.ingredients.map((ing) => {
      const match = ing.qty.match(/^([\d.]+)\s*(kg|g|L|ml|tonnes|handful|mash|mashed)?(.*)$/i);
      if (!match) return ing;
      const val = parseFloat(match[1]);
      if (isNaN(val)) return ing;
      const unit = match[2] || "";
      const rest = match[3] || "";
      const scaledVal = val * mult;

      let formatted = scaledVal < 1 ? scaledVal.toFixed(2) : scaledVal.toFixed(1);
      if (formatted.endsWith(".0")) formatted = formatted.slice(0, -2);
      if (scaleFactor === "garden" && unit.toLowerCase() === "kg" && scaledVal < 1) {
        return { item: ing.item, qty: `${Math.round(scaledVal * 1000)} g ${rest}`.trim() };
      }
      if (scaleFactor === "garden" && unit.toLowerCase() === "l" && scaledVal < 1) {
        return { item: ing.item, qty: `${Math.round(scaledVal * 1000)} ml ${rest}`.trim() };
      }
      return { item: ing.item, qty: `${formatted} ${unit} ${rest}`.trim() };
    });
  }, [activeMethod, scaleFactor]);

  const handleNext = () => {
    const curIdx = methods.findIndex((m) => m.id === activeMethod.id);
    const nextIdx = (curIdx + 1) % methods.length;
    onSelect(methods[nextIdx].id);
  };

  const handlePrev = () => {
    const curIdx = methods.findIndex((m) => m.id === activeMethod.id);
    const prevIdx = (curIdx - 1 + methods.length) % methods.length;
    onSelect(methods[prevIdx].id);
  };

  return (
    <section id="protocol-viewer" className="relative overflow-hidden bg-white py-14 sm:py-20 border-b border-emerald-900/10">
      {/* Ambient botanical backdrop glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[650px] w-[1000px] -translate-x-1/2 rounded-full opacity-20 blur-[140px] transition-colors duration-1000"
        style={{ background: theme.glow }}
      />

      <div className="container-site max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-emerald-900 font-bold shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Living Protocol Field Laboratory</span>
          </div>
          <h2 className="display mt-3 text-3xl sm:text-5xl font-bold text-emerald-950 tracking-tight [text-wrap:balance]">
            Select Any Protocol to Inspect Its <span className="text-emerald-700">Live Formulation</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-emerald-900/70 max-w-2xl font-normal">
            Authentic field photography, real-time dosage scaling, and step-by-step preparation flow for all 19 organic protocols.
          </p>
        </div>

        {/* 1 · TOP SELECTOR RIBBON: 19 Protocols with Clear Uncompressed Thumbnails */}
        <div className="mb-10 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-900/15 bg-white text-[#162a54] transition-all hover:bg-emerald-100 hover:scale-105 active:scale-95 shadow-xs"
            aria-label="Previous protocol"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex flex-1 items-center gap-3 overflow-x-auto py-2.5 px-1 scrollbar-none">
            {methods.map((m) => {
              const isSelected = m.id === activeMethod.id;
              const mPhoto = m.photos[0];
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onSelect(m.id)}
                  className={`group relative flex items-center gap-2.5 rounded-2xl border p-2 text-left shrink-0 transition-all duration-300 ${
                    isSelected
                      ? "border-emerald-600 bg-white shadow-md scale-105 ring-2 ring-emerald-500/40"
                      : "border-emerald-900/10 bg-white/70 hover:border-emerald-600/40 hover:bg-white"
                  }`}
                >
                  {/* Clean thumbnail with zero text on it */}
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-emerald-900/10 bg-white shadow-2xs">
                    {mPhoto && (
                      <Image
                        src={mPhoto.src}
                        alt={m.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="48px"
                      />
                    )}
                  </div>
                  <div className="flex flex-col pr-2">
                    <span className="font-mono text-[10px] font-bold text-emerald-800">
                      #{String(m.id).padStart(2, "0")}
                    </span>
                    <span className="text-xs font-bold text-zinc-900 truncate max-w-[130px] group-hover:text-emerald-700">
                      {m.name.replace(/\s*\(.*\)/, "")}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-900/15 bg-white text-[#162a54] transition-all hover:bg-emerald-100 hover:scale-105 active:scale-95 shadow-xs"
            aria-label="Next protocol"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* 2 · CENTER: The Fluid Organic Field Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMethod.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid grid-cols-1 items-start gap-10 lg:grid-cols-12"
          >
            {/* LEFT COLUMN: Large, Prominent, Crystal-Clear Image Showcase (NO TEXT ON IMAGE) */}
            <div className="lg:col-span-6 flex flex-col gap-3">
              {/* Controls bar CLEANLY OUTSIDE and ABOVE the image */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border shadow-2xs ${theme.pillBg}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{activeMethod.type}</span>
                  </span>
                  <span className="font-mono text-xs text-emerald-900/70 font-bold">
                    Protocol #{String(activeMethod.id).padStart(2, "0")}
                  </span>
                </div>

                {/* Button to expand full-screen view */}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/15 bg-white px-3 py-1 font-mono text-xs font-bold text-[#162a54] shadow-2xs transition-all hover:bg-emerald-100 hover:scale-105"
                  title="View full-resolution photograph"
                >
                  <ZoomIn className="h-3.5 w-3.5 text-emerald-700" />
                  <span>View Full Size</span>
                </button>
              </div>

              {/* THE IMAGE FRAME: 100% CLEAN - ZERO TEXT, ZERO BADGES, ZERO GRADIENTS */}
              <div
                onClick={() => setIsFullscreen(true)}
                className="relative w-full overflow-hidden rounded-[24px] border border-emerald-900/15 bg-white shadow-xl cursor-zoom-in group transition-all duration-300 hover:shadow-2xl hover:border-emerald-600/40"
                style={{ aspectRatio: `${(PHOTO_DIMS[photo?.src ?? ""] ?? [2000, 1585]).join(" / ")}` }}
                title="Click to view full screen"
              >
                {photo && (
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    priority
                    unoptimized
                    className="object-contain object-center"
                    sizes="(max-width: 1024px) 100vw, 680px"
                  />
                )}
                <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-950/75 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  <ZoomIn className="h-3.5 w-3.5" /> Full screen
                </span>
              </div>

              {/* Caption & Photo Details CLEANLY OUTSIDE and BELOW the image */}
              {photo && (
                <div className="flex items-center justify-between px-2 pt-1 font-mono text-xs text-emerald-950/70">
                  <span className="font-bold text-emerald-950 truncate max-w-[70%]">
                    {photo.title}
                  </span>
                  <span className="text-zinc-500 text-[11px]">
                    {(PHOTO_DIMS[photo.src] ?? [2000, 1585]).join(" × ")} px &bull; Full image
                  </span>
                </div>
              )}

              {/* Quick Specification Strip Below Image (Outside frame) */}
              <div className="mt-2 grid grid-cols-3 gap-2.5 rounded-2xl border border-emerald-900/10 bg-white/90 p-3 shadow-2xs text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Ready In</span>
                  <strong className="text-emerald-800 text-sm font-bold">{activeMethod.readyIn}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Field Dose</span>
                  <span className="text-zinc-900 font-semibold truncate block">{activeMethod.quantity}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Frequency</span>
                  <span className="text-zinc-900 font-semibold truncate block">{activeMethod.frequency}</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Creative Formulation & Living Pathway (NO CARDS) */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {/* Header: Title, Category & Purpose */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-lg bg-emerald-200/80 px-2.5 py-0.5 font-mono text-xs font-bold text-[#162a54] border border-emerald-300">
                    Protocol #{String(activeMethod.id).padStart(2, "0")} of 19
                  </span>
                  <span className="text-emerald-900/30">&bull;</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-emerald-800 font-semibold">
                    {theme.label}
                  </span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl font-bold text-emerald-950 tracking-tight">
                  {activeMethod.name}
                </h3>

                <p className="mt-3 text-base text-emerald-900/80 leading-relaxed font-normal">
                  {activeMethod.purpose}
                </p>
              </div>

              {/* INTERACTIVE BATCH DOSAGE SCALER */}
              <div className="rounded-3xl border border-emerald-900/15 bg-white/80 p-5 shadow-xs backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-900/10">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-emerald-700 animate-pulse" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-950">
                      Batch Dosage Scaler
                    </span>
                  </div>
                  {/* Preset dosage scale buttons */}
                  <div className="flex items-center gap-1.5">
                    {[
                      { key: "1acre", label: "1 Acre" },
                      { key: "2.5acres", label: "2.5 Acres" },
                      { key: "5acres", label: "5 Acres" },
                      { key: "garden", label: "Kitchen Garden" },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setScaleFactor(tab.key as any)}
                        className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold transition-all ${
                          scaleFactor === tab.key
                            ? "bg-[#1E7A33] text-white shadow-xs scale-105"
                            : "bg-emerald-50 text-[#162a54] hover:bg-emerald-100"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scaled Ingredients Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {scaledIngredients.map((ing, i) => (
                    <motion.div
                      key={`${ing.item}-${scaleFactor}`}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="inline-flex items-center gap-2 rounded-2xl border border-emerald-900/10 bg-white px-3.5 py-2 shadow-2xs"
                    >
                      <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      <span className="text-xs font-semibold text-emerald-950">{ing.item}:</span>
                      <strong className="font-mono text-xs font-bold text-emerald-700">{ing.qty}</strong>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* LIVING PREPARATION VINE (Steps connected by organic stem, NO CARDS!) */}
              <div>
                <h4 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-emerald-900 mb-4 flex items-center gap-2">
                  <Sprout className="h-4 w-4 text-emerald-600" />
                  <span>Preparation Flow (SOP Steps)</span>
                </h4>

                <div className="relative pl-6 space-y-4">
                  {/* Organic continuous vertical vine line */}
                  <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-500 via-emerald-400 to-teal-500" />

                  {activeMethod.steps.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Leaf Node Marker */}
                      <div className="absolute -left-6 mt-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-emerald-600 bg-white font-mono text-[10px] font-bold text-emerald-900 shadow-2xs">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1 pl-3 text-sm text-emerald-950 leading-relaxed font-normal">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* APPLICATION & DOSING GUIDELINES */}
              <div className="border-t border-emerald-900/10 pt-5">
                <div className="flex items-center justify-between pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-950">
                      Application Guidelines
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <button
                      type="button"
                      onClick={() => setAppMode("field")}
                      className={`px-3 py-1 rounded-full font-semibold transition-all ${
                        appMode === "field"
                          ? "bg-emerald-800 text-white shadow-xs"
                          : "bg-white text-emerald-900 border border-emerald-200"
                      }`}
                    >
                      Field Crops
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppMode("garden")}
                      className={`px-3 py-1 rounded-full font-semibold transition-all ${
                        appMode === "garden"
                          ? "bg-emerald-800 text-white shadow-xs"
                          : "bg-white text-emerald-900 border border-emerald-200"
                      }`}
                    >
                      Home Garden
                    </button>
                  </div>
                </div>

                <p className="text-sm text-emerald-950 leading-relaxed">
                  {appMode === "field" ? activeMethod.application.field : activeMethod.application.garden}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-xs text-emerald-900/70">
                  <span className="inline-flex items-center gap-1.5">
                    <Sun className="h-3.5 w-3.5 text-amber-600" />
                    <span><strong>Timing:</strong> {activeMethod.application.timing}</span>
                  </span>
                  <span>&bull;</span>
                  <span><strong>Shelf Life:</strong> {activeMethod.shelfLife}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3 · FULL-RESOLUTION MODAL LIGHTBOX: Crystal Clear 2000x1585 Specimen (ZERO TEXT ON IMAGE) */}
      <AnimatePresence>
        {isFullscreen && photo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFullscreen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 flex h-full w-full max-w-[98vw] flex-col items-center"
            >
              {/* Top controls CLEANLY OUTSIDE the image */}
              <div className="w-full flex items-center justify-between pb-3 text-white">
                <div className="font-mono text-xs">
                  <span className="font-bold text-emerald-400">
                    Protocol #{String(activeMethod.id).padStart(2, "0")}:
                  </span>{" "}
                  <span className="text-white/90">{activeMethod.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-mono text-xs transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Close [Esc]</span>
                </button>
              </div>

              {/* The pure, unadulterated, large image */}
              <div className="relative w-full flex-1 overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  unoptimized
                  priority
                  className="object-contain w-full h-full"
                  sizes="100vw"
                />
              </div>

              {/* Bottom details CLEANLY OUTSIDE the image */}
              <div className="w-full pt-3 text-center text-white/70 font-mono text-xs">
                {photo.title} &bull; {(PHOTO_DIMS[photo.src] ?? [2000, 1585]).join(" × ")} px
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
