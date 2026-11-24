"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  Scan,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Layers,
  Sprout,
  Activity,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

interface AppProduct {
  id: "leaflenz" | "harvestlenz" | "carbon";
  name: "LeafLENZ" | "HarvestLENZ" | "Carbon Intelligence";
  tabLabel: string;
  tagline: string;
  description: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  screens: {
    id: string;
    label: string;
    caption: string;
    image: string;
  }[];
}

const APP_PRODUCTS: AppProduct[] = [
  {
    id: "leaflenz",
    name: "LeafLENZ",
    tabLabel: "LeafLENZ",
    tagline: "Plant Pathology & Disease Diagnosis",
    description:
      "Field-ready plant disease identification, diagnostic pathology and curative treatment guidance.",
    accentColor: "text-emerald-400",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/30",
    screens: [
      {
        id: "home",
        label: "Leaf Scanner",
        caption: "Field camera intake & symptom capture",
        image: "/images/app/soil-partners/leaflenz-home.jpg",
      },
      {
        id: "diagnosis",
        label: "Pathology Diagnosis",
        caption: "Grape Black Measles (94.2% diagnostic confidence)",
        image: "/images/app/soil-partners/leaflenz-diagnosis.jpg",
      },
      {
        id: "treatment",
        label: "Treatment Prescription",
        caption: "Targeted curative chemical and organic dosage",
        image: "/images/app/soil-partners/leaflenz-treatment.jpg",
      },
    ],
  },
  {
    id: "harvestlenz",
    name: "HarvestLENZ",
    tabLabel: "HarvestLENZ",
    tagline: "Optical Fruit Grading & Valuation",
    description:
      "Optical fruit quality grading, commercial valuation and shelf-life insights.",
    accentColor: "text-amber-400",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/30",
    screens: [
      {
        id: "home",
        label: "Scan Station",
        caption: "Computer vision fruit intake & defect scanning",
        image: "/images/app/soil-partners/harvestlenz-home.jpg",
      },
      {
        id: "result",
        label: "Quality Grade",
        caption: "Grade: Good (75/100) · 4 days predicted shelf-life",
        image: "/images/app/soil-partners/harvestlenz-result.jpg",
      },
      {
        id: "report",
        label: "Commercial Value",
        caption: "Comprehensive mandi batch price estimation",
        image: "/images/app/soil-partners/harvestlenz-report.jpg",
      },
    ],
  },
  {
    id: "carbon",
    name: "Carbon Intelligence",
    tabLabel: "Carbon Intelligence",
    tagline: "Soil Carbon & ESG Monetization",
    description:
      "Farm sustainability assessment, carbon metrics, verified offset recommendations and certification.",
    accentColor: "text-botanical",
    accentBg: "bg-botanical/10",
    accentBorder: "border-botanical/30",
    screens: [
      {
        id: "assessment",
        label: "Farm Assessment",
        caption: "Multi-acre soil organic carbon baseline input",
        image: "/images/app/soil-partners/carbon-assessment.jpg",
      },
      {
        id: "metrics",
        label: "Carbon Metrics",
        caption: "25.55 ICU sequestered · ₹65,770 carbon revenue",
        image: "/images/app/soil-partners/carbon-metrics.jpg",
      },
      {
        id: "advice",
        label: "Agronomic Advisory",
        caption: "Regenerative soil roadmap for maximum credits",
        image: "/images/app/soil-partners/carbon-advice.jpg",
      },
      {
        id: "certificate",
        label: "Official Certificate",
        caption: "Verified Carbon Offset Registry Certificate",
        image: "/images/app/soil-partners/carbon-certificate.jpg",
      },
    ],
  },
];

export function SoilPartnersAppShowcase() {
  const [activeTab, setActiveTab] = useState<AppProduct["id"]>("leaflenz");
  const [screenIndex, setScreenIndex] = useState(0);

  const currentApp =
    APP_PRODUCTS.find((p) => p.id === activeTab) || APP_PRODUCTS[0];

  const handleTabChange = (id: AppProduct["id"]) => {
    setActiveTab(id);
    setScreenIndex(0);
  };

  const primaryScreen = currentApp.screens[screenIndex] || currentApp.screens[0];
  const secondaryIndex = (screenIndex + 1) % currentApp.screens.length;
  const secondaryScreen = currentApp.screens[secondaryIndex];

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl border border-emerald-900/10 bg-gradient-to-b from-white via-[#f7faf5] to-[#edf4ea] p-4 sm:p-7 shadow-xl overflow-hidden">
      {/* Decorative Ecosystem Circuit Nodes & Glowing Beams */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <svg
          className="h-full w-full stroke-emerald-700/25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="circuit-grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeDasharray="2 4"
              />
              <circle cx="0" cy="0" r="1.5" fill="#2F9E44" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-grid)" />
        </svg>
      </div>

      {/* Ambient Radial Spotlight */}
      <div className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-botanical/20 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-emerald-600/15 blur-[100px]" />

      <div className="relative z-10">
        {/* Header Block - New representation */}
        <div className="text-left mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-3 py-1 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-emerald-900 font-semibold">
            <Smartphone className="h-3.5 w-3.5" />
            SOIL PARTNERS PRODUCT SUITE
          </div>

          <h3 className="display mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-emerald-950">
            Three Products. One Farmland Ecosystem.
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-emerald-900/70 max-w-xl leading-relaxed">
            Precision field intelligence from soil to canopy: real-time plant pathology, optical harvest grading, and certified carbon offset monetization.
          </p>
        </div>

        {/* Product Switcher Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-2.5 p-1.5 rounded-2xl bg-emerald-100/70 border border-emerald-200 mb-5">
          {APP_PRODUCTS.map((prod) => {
            const isActive = prod.id === activeTab;
            return (
              <button
                key={prod.id}
                type="button"
                onClick={() => handleTabChange(prod.id)}
                className={`group relative flex-1 min-w-[110px] py-2 sm:py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? "text-white shadow-md"
                    : "text-emerald-900/70 hover:text-emerald-950 hover:bg-white/60"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 rounded-xl bg-emerald-700 shadow-[0_8px_20px_-6px_rgba(4,120,87,0.5)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  {prod.id === "leaflenz" && <Scan className="h-3.5 w-3.5" />}
                  {prod.id === "harvestlenz" && (
                    <TrendingUp className="h-3.5 w-3.5" />
                  )}
                  {prod.id === "carbon" && <Award className="h-3.5 w-3.5" />}
                  <span className="truncate">{prod.tabLabel}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Product Description Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentApp.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease }}
            className={`p-3 sm:p-4 rounded-xl border ${currentApp.accentBorder} ${currentApp.accentBg} backdrop-blur-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-900/60 font-semibold">
                  {currentApp.tagline}
                </span>
                <span className="h-1 w-1 rounded-full bg-emerald-600" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-700">
                  VERIFIED FIELD SCREENS
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                {currentApp.description}
              </p>
            </div>

            {/* Workflow Step Indicator */}
            <div className="shrink-0 flex items-center gap-1.5">
              {currentApp.screens.map((sc, i) => (
                <button
                  key={sc.id}
                  onClick={() => setScreenIndex(i)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all ${
                    screenIndex === i
                      ? "bg-emerald-700 text-white border border-emerald-700 font-bold"
                      : "bg-white text-emerald-900/60 hover:text-emerald-950 border border-emerald-200"
                  }`}
                  title={sc.label}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Apple-Style Interactive Smartphone Showcase Area */}
        <div className="relative pt-2 pb-4 flex items-center justify-center">
          {/* Connecting Glow Ring Behind Phones */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full border border-botanical/20 bg-gradient-to-tr from-botanical/10 via-transparent to-emerald-400/10 pointer-events-none blur-sm" />

          {/* SECONDARY SMARTPHONE (Tilted Back Layer / Peek Screen) */}
          {secondaryScreen && (
            <motion.div
              key={`sec-${currentApp.id}-${secondaryScreen.id}`}
              initial={{ opacity: 0, x: 40, scale: 0.8 }}
              animate={{ opacity: 0.82, x: 0, scale: 0.88 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.45, ease }}
              onClick={() => setScreenIndex(secondaryIndex)}
              className="hidden md:block absolute right-4 lg:right-8 top-6 z-10 w-[210px] cursor-pointer group"
              title="Click to bring this screen forward"
            >
              {/* Secondary Phone Frame */}
              <div className="relative rounded-[32px] p-2 bg-gradient-to-b from-neutral-700 via-neutral-900 to-black border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:scale-105 group-hover:opacity-100">
                {/* Secondary Screen Glass */}
                <div className="relative rounded-[24px] overflow-hidden bg-black aspect-[9/20]">
                  <Image
                    src={secondaryScreen.image}
                    alt={secondaryScreen.label}
                    fill
                    sizes="210px"
                    className="object-cover object-top"
                    unoptimized
                  />
                  {/* Frosted Layer Overlay */}
                  <div className="absolute inset-0 bg-forest-deep/20 backdrop-blur-[0.5px] transition-opacity group-hover:opacity-0" />
                  
                  {/* Tap to inspect badge */}
                  <div className="absolute bottom-3 left-2 right-2 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 p-2 text-center">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-botanical font-semibold flex items-center justify-center gap-1">
                      <Layers className="h-3 w-3" />
                      Next: {secondaryScreen.label}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PRIMARY SMARTPHONE (Apple-Style Flagship Frame) */}
          <div className="relative z-20 w-[260px] sm:w-[290px] lg:w-[310px]">
            {/* Ambient chassis drop-shadow & leaf glow */}
            <div className="absolute -inset-1 rounded-[44px] bg-gradient-to-tr from-botanical/30 via-transparent to-emerald-500/20 blur-xl opacity-75" />

            {/* Smartphone Outer Titanium Chassis */}
            <div className="relative rounded-[40px] sm:rounded-[44px] p-2 sm:p-2.5 bg-gradient-to-b from-neutral-700 via-neutral-900 to-black border border-white/25 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_35px_rgba(47,158,68,0.25)]">
              {/* Antenna lines / chassis side buttons styling accents */}
              <div className="absolute -left-[3px] top-20 h-8 w-[3px] rounded-l-sm bg-neutral-600/70" />
              <div className="absolute -left-[3px] top-32 h-12 w-[3px] rounded-l-sm bg-neutral-600/70" />
              <div className="absolute -right-[3px] top-24 h-14 w-[3px] rounded-r-sm bg-neutral-600/70" />

              {/* Inner Bezel Screen */}
              <div className="relative rounded-[32px] sm:rounded-[36px] overflow-hidden bg-black aspect-[9/20]">
                {/* Dynamic Island / Punch Hole */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center gap-1.5 h-4 w-20 rounded-full bg-black/90 border border-white/10 shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-neutral-900 border border-neutral-700" />
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-950/80" />
                </div>

                {/* Speaker Earpiece Slit */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 z-30 h-1 w-10 rounded-full bg-neutral-800" />

                {/* Animated Primary Screen Switcher */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentApp.id}-${primaryScreen.id}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.35, ease }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={primaryScreen.image}
                      alt={primaryScreen.caption}
                      fill
                      sizes="320px"
                      className="object-cover object-top"
                      priority
                      unoptimized
                    />

                    {/* Realistic Glass Edge Reflection Glare */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* Floating On-Screen Context Banner */}
                <div className="absolute bottom-3 left-3 right-3 z-30 rounded-xl bg-forest-deep/90 backdrop-blur-md border border-white/15 p-2.5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-botanical font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-botanical" />
                      {primaryScreen.label}
                    </span>
                    <span className="text-[9px] font-mono text-ivory/60">
                      Step {screenIndex + 1}/{currentApp.screens.length}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-ivory font-medium truncate">
                    {primaryScreen.caption}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Sub-Navigation / Quick Switcher */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-botanical animate-pulse" />
            <span className="font-mono text-[11px] text-emerald-900/80">
              Official Production Screenshots · ArkaShine Cloud Connected
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {currentApp.screens.map((sc, i) => (
              <button
                key={sc.id}
                onClick={() => setScreenIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  screenIndex === i
                    ? "w-6 bg-emerald-700"
                    : "w-2 bg-emerald-900/20 hover:bg-emerald-900/40"
                }`}
                aria-label={`View ${sc.label}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
