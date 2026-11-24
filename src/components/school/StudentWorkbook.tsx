"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle2, Sparkles, FileText } from "lucide-react";

export interface PageContent {
  moduleNum: string;
  moduleTitle: string;
  tagline: string;
  hours: string;
  image: string;
  imageCaption: string;
  theoryTopics: string[];
  practicalChallenge: string;
  activityWorkbookPage: string;
  keyTakeaway: string;
  stamp: string;
}

export const BOOKLET_PAGES: PageContent[] = [
  {
    moduleNum: "01",
    moduleTitle: "Agriculture & Soil Science Fundamentals",
    tagline: "The living chemistry under our feet",
    hours: "18 Hours · Theory & Lab",
    image: "/images/soil-macro.jpg",
    imageCaption: "Soil Horizons & Physical Texture Profile",
    theoryTopics: [
      "Soil origin, weathering, and pedogenesis",
      "Horizons O, A, B, C & structural profile layers",
      "Physical texture: Sand, Silt, Clay & sedimentation jar test",
      "Biological ecosystem: Microbes, organic carbon, and worms",
    ],
    practicalChallenge: "Perform the jar sedimentation test on 3 school campus soil samples to calculate sand-silt-clay ratios.",
    activityWorkbookPage: "Workbook Worksheet #12: Horizon Diagramming & Sedimentation Graphing",
    keyTakeaway: "Soil is not dirt; it is a bio-chemical reactor determining plant nutrition and food security.",
    stamp: "MODULE 1 COMPLETED",
  },
  {
    moduleNum: "02",
    moduleTitle: "Scientific Soil Sampling Protocols",
    tagline: "Precision in the field determines accuracy in the lab",
    hours: "18 Hours · Field Practical",
    image: "/images/school/students_with_farmer.jpg",
    imageCaption: "Quadrant Core Sampling in Rural Fields",
    theoryTopics: [
      "Representative sampling: Zig-zag & quadrant methodology",
      "Sampling depth protocol: 0–15 cm for field crops",
      "Composite sampling, quartering method & air-drying",
      "Barcode tagging, GPS location recording, and farmer registry",
    ],
    practicalChallenge: "Extract 5 sub-samples across a 1-acre plot, composite-mix, label with unique QR code, and log farm GPS coordinates.",
    activityWorkbookPage: "Workbook Worksheet #24: Field GPS Log & Composite Quartering Flowchart",
    keyTakeaway: "An inaccurate sample produces an invalid report. The science begins at the spade.",
    stamp: "MODULE 2 COMPLETED",
  },
  {
    moduleNum: "03",
    moduleTitle: "Soil Testing with SoiLENZ 2.0",
    tagline: "Operating India's patented optical lab instrument",
    hours: "18 Hours · Hardware Hands-On",
    image: "/images/school/lab_students.jpg",
    imageCaption: "Direct SoiLenz 2.0 Multi-Parameter Diagnostics",
    theoryTopics: [
      "Physics of spectrophotometry & optical absorbance",
      "Electrochemical sensor analysis: Soil pH and Electrical Conductivity (EC)",
      "Automated 60-second chemical extraction & reagent preparation",
      "Diagnosing 14 parameters: N, P, K, Organic Carbon, Micronutrients",
    ],
    practicalChallenge: "Calibrate SoiLENZ 2.0, extract sample with chemical reagent, run optical reading, and print thermal diagnostic strip.",
    activityWorkbookPage: "Workbook Worksheet #38: Spectrometric Absorption Curves & Optical Calibration",
    keyTakeaway: "Moving from 45-day laboratory delays to 5-minute precision doorstep diagnostics.",
    stamp: "MODULE 3 COMPLETED",
  },
  {
    moduleNum: "04",
    moduleTitle: "Soil Health Cards & Agronomic Advisory",
    tagline: "Translating data into actionable farmer prosperity",
    hours: "18 Hours · Outreach & Capstone",
    image: "/images/school/curriculum_booklet.jpg",
    imageCaption: "Official Soil Health Report & Advisory Generation",
    theoryTopics: [
      "Deciphering Soil Health Card metrics vs. ICAR standards",
      "Macronutrient balance: Nitrogen, Phosphorus, Potassium ratios",
      "Fertilizer dose formulation: Urea, DAP, MOP tailored to target yield",
      "Communicating diagnostics effectively to vernacular farmers",
    ],
    practicalChallenge: "Generate 5 customized Soil Health Cards and present real agronomic recommendations to farming families.",
    activityWorkbookPage: "Workbook Worksheet #50: Capstone Soil Card & Agronomic Advisory Sheet",
    keyTakeaway: "Empowered students bridge the trust deficit between agricultural technology and rural farmers.",
    stamp: "HONORS CERTIFIED",
  },
];

export function StudentWorkbook() {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = BOOKLET_PAGES.length;
  const page = BOOKLET_PAGES[currentPage];

  const goToNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    // 1-Frame container: fits fully in 1 viewport screen without needing to scroll
    <div className="w-full max-w-5xl mx-auto">
      {/* Module Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-botanical" />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ivory font-semibold">
            Student Curriculum Workbook &middot; 4 Modules
          </span>
        </div>

        {/* Module Tab Selector */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
          {BOOKLET_PAGES.map((p, idx) => (
            <button
              key={p.moduleNum}
              type="button"
              onClick={() => setCurrentPage(idx)}
              className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition-all ${
                currentPage === idx
                  ? "bg-[#1E7A33] text-[#fff] shadow-md font-bold"
                  : "text-ivory/60 hover:text-ivory hover:bg-white/5"
              }`}
            >
              Module {p.moduleNum}
            </button>
          ))}
        </div>
      </div>

      {/* The Physical Book / Binder Container (1-Frame Compact Height) */}
      <div className="relative rounded-3xl border-2 border-white/15 bg-gradient-to-b from-[#11231c] via-[#0d1d17] to-[#081510] shadow-2xl p-4 sm:p-6 lg:p-7 overflow-hidden">
        {/* Book spine spiral binding visual */}
        <div className="absolute top-0 bottom-0 left-3 sm:left-5 w-3 flex flex-col justify-between py-5 pointer-events-none z-20">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-2.5 w-4 -ml-1.5 rounded-full border border-white/30 bg-gradient-to-r from-gray-400 via-gray-100 to-gray-500 shadow-sm transform -rotate-12"
            />
          ))}
        </div>

        {/* Module Content Surface */}
        <div className="relative pl-5 sm:pl-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 backdrop-blur-md"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-md bg-botanical/20 text-ivory font-bold border border-botanical/30">
                      MODULE {page.moduleNum} OF 04
                    </span>
                    <span className="font-mono text-xs text-ivory/50">{page.hours}</span>
                  </div>
                  <h3 className="display mt-1.5 text-xl sm:text-2xl font-bold text-ivory">
                    {page.moduleTitle}
                  </h3>
                  <p className="text-xs text-botanical italic">
                    "{page.tagline}"
                  </p>
                </div>

                {/* Stamp */}
                <div className="self-start sm:self-auto px-3 py-1.5 rounded-xl border border-dashed border-botanical/50 bg-botanical/5 text-center">
                  <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-botanical font-bold">
                    {page.stamp}
                  </div>
                  <div className="text-[8px] text-ivory/50 font-mono">ARKASHINE STEM LAB</div>
                </div>
              </div>

              {/* 2-Column Split */}
              <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Column: Real photo & Hands-on Challenge */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/15 shadow-md">
                    <Image
                      src={page.image}
                      alt={page.imageCaption}
                      fill
                      sizes="(max-width: 1024px) 100vw, 360px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <p className="absolute bottom-2 left-2 right-2 text-[11px] font-mono text-ivory/90 bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
                      {page.imageCaption}
                    </p>
                  </div>

                  <div className="rounded-xl border border-botanical/30 bg-botanical/10 p-3">
                    <div className="flex items-center gap-1.5 text-botanical font-mono text-[11px] uppercase tracking-wider font-semibold">
                      <Sparkles className="h-3.5 w-3.5" />
                      Practical Challenge
                    </div>
                    <p className="mt-1 text-xs text-ivory/90 leading-relaxed">
                      {page.practicalChallenge}
                    </p>
                  </div>
                </div>

                {/* Right Column: Theory Topics & Exercise */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ivory/60 mb-2 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-botanical" />
                      Core Syllabus &amp; Lab Concepts
                    </h4>
                    <div className="space-y-1.5">
                      {page.theoryTopics.map((topic, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-botanical shrink-0 mt-0.5" />
                          <span className="text-xs text-ivory/85 leading-snug">
                            {topic}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Workbook & Mindset */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs text-ivory/70 bg-black/30 px-3 py-1.5 rounded-lg border border-white/10">
                      <span className="font-mono text-[10px] text-botanical font-semibold">
                        STUDENT EXERCISE
                      </span>
                      <span className="font-mono text-[10px] text-ivory/80 truncate ml-2">
                        {page.activityWorkbookPage}
                      </span>
                    </div>

                    <div className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10">
                      <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-ivory/50">
                        Core Takeaway:
                      </span>
                      <span className="ml-1 text-[11px] text-ivory/90 italic">
                        "{page.keyTakeaway}"
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Bar: Module Navigation & Progress */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={goToPrev}
                  disabled={currentPage === 0}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    currentPage === 0
                      ? "opacity-30 cursor-not-allowed text-ivory/40"
                      : "bg-white/10 text-ivory hover:bg-white/20 active:scale-95"
                  }`}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous Module
                </button>

                <div className="flex items-center gap-2 font-mono text-xs text-ivory/60">
                  <span>Module {currentPage + 1} of {totalPages}</span>
                  <div className="w-14 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-botanical transition-all duration-300"
                      style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={goToNext}
                  disabled={currentPage === totalPages - 1}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    currentPage === totalPages - 1
                      ? "opacity-30 cursor-not-allowed text-ivory/40"
                      : "bg-[#1E7A33] text-[#fff] hover:bg-[#17642a] active:scale-95 shadow"
                  }`}
                >
                  Next Module
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
