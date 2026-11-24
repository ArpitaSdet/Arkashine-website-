"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  BookOpen,
  RotateCcw,
  Sparkles,
  ZoomIn,
  ZoomOut,
  X,
  Layers,
  Sprout,
  Activity,
  Award,
  CheckCircle2,
  Compass,
} from "lucide-react";

const TOTAL_PAGES = 63;

const PAGES = Array.from({ length: TOTAL_PAGES }, (_, i) => {
  const num = i + 1;
  const pad = String(num).padStart(2, "0");
  return {
    num,
    src: `/images/booklet/page_${pad}.png`,
  };
});

// Short Access Curriculum Milestones
const SHORT_ACCESS_MODULES = [
  { label: "Cover", page: 1, tag: "Playbook Cover", icon: BookOpen },
  { label: "Mod 1: Soil Biology", page: 4, tag: "Pages 4–17", icon: Sprout },
  { label: "Mod 2: Field Sampling", page: 18, tag: "Pages 18–33", icon: Compass },
  { label: "Mod 3: SoiLenz Lab", page: 34, tag: "Pages 34–47", icon: Activity },
  { label: "Mod 4: Farmer Advisory", page: 48, tag: "Pages 48–59", icon: Layers },
  { label: "Outcomes & Capstone", page: 60, tag: "Pages 60–63", icon: Award },
];

// Curated Short Access Takeaway Cards
const CORE_CURRICULUM_TAKEAWAYS = [
  {
    num: "01",
    title: "Living Soil Science & Biology",
    pages: "Pages 04–17 · 18 Hours",
    icon: Sprout,
    summary: "Origin of soil horizons (O, A, B, C), pedogenesis, living microbiology, and physical texture sedimentation jar test.",
    practical: "Jar sedimentation test on 3 school campus soil samples to calculate sand-silt-clay ratios.",
    jumpPage: 4,
  },
  {
    num: "02",
    title: "Scientific Field Sampling Protocols",
    pages: "Pages 18–33 · 18 Hours",
    icon: Compass,
    summary: "Precision field extraction, zig-zag quadrant methodology, 0–15 cm auger core depth, and composite quartering.",
    practical: "Extract 5 quadrant core sub-samples across 1 acre, composite-mix, label with unique QR code, and log farm GPS.",
    jumpPage: 18,
  },
  {
    num: "03",
    title: "SoiLenz 2.0 Digital Spectroscopy",
    pages: "Pages 34–47 · 18 Hours",
    icon: Activity,
    summary: "Operating patented spectrophotometry hardware: calibrating optical reagents, diagnosing NPK, pH, EC, and Organic Carbon.",
    practical: "Calibrate optical chamber, pipette soil extraction liquid, execute 20-min multi-wavelength spectral scan, print report.",
    jumpPage: 34,
  },
  {
    num: "04",
    title: "Doorstep Farmer Counseling & Advisory",
    pages: "Pages 48–59 · 18 Hours",
    icon: Layers,
    summary: "Translating laboratory analytics into actionable organic farming prescriptions: Beejamrutham, Jeevamrutham, and bio-fertilizer dosages.",
    practical: "Conduct field visit to rural host farm, present printed Soil Health Card, calculate fertilizer cost savings for farmer.",
    jumpPage: 48,
  },
];

export function InteractiveFlipbook() {
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const flipInstanceRef = useRef<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(TOTAL_PAGES);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("landscape");

  // Zoom / Lightbox Modal
  const [zoomPage, setZoomPage] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize PageFlip
  useEffect(() => {
    let flip: any = null;
    let isMounted = true;

    const origGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type: any, ...args: any[]) {
      const ctx = origGetContext.apply(this, [type, ...args]);
      if (type === "2d" && ctx) {
        const origFillRect = ctx.fillRect.bind(ctx);
        ctx.fillRect = function (x: number, y: number, w: number, h: number) {
          if (
            (ctx.fillStyle === "white" ||
              ctx.fillStyle === "#ffffff" ||
              ctx.fillStyle === "rgb(255, 255, 255)") &&
            x === 0 &&
            y === 0 &&
            w === ctx.canvas.width &&
            h === ctx.canvas.height
          ) {
            ctx.clearRect(0, 0, w, h);
            return;
          }
          return origFillRect(x, y, w, h);
        };
      }
      return ctx;
    };

    async function initPageFlip() {
      try {
        const mod = await import("page-flip");
        const PageFlipClass = (mod.default as any)?.PageFlip || (mod as any).PageFlip;
        if (!PageFlipClass || !bookContainerRef.current || !isMounted) return;

        bookContainerRef.current.innerHTML = "";

        // Compact, controlled dimensions (does NOT enlarge too much!)
        flip = new PageFlipClass(bookContainerRef.current, {
          width: 520, // compact page width
          height: 325, // 16:10 / 16:9 aspect ratio
          size: "stretch",
          minWidth: 280,
          maxWidth: 620,
          minHeight: 180,
          maxHeight: 390,
          maxShadowOpacity: 0.7,
          showCover: true,
          mobileScrollSupport: false,
          usePortrait: true,
          startPage: 0,
          drawShadow: true,
          flippingTime: 700,
          useMouseEvents: true,
          swipeDistance: 20,
          clickEventForward: true,
        });

        const images = PAGES.map((p) => p.src);
        flip.loadFromImages(images);

        flip.on("flip", (e: any) => {
          if (!isMounted) return;
          setCurrentPage(e.data + 1);
        });

        flip.on("changeOrientation", (e: any) => {
          if (!isMounted) return;
          setOrientation(e.data);
        });

        flip.on("init", () => {
          if (!isMounted) return;
          setIsLoaded(true);
          setTotalPages(flip.getPageCount() || TOTAL_PAGES);
          if (flip.getOrientation) {
            setOrientation(flip.getOrientation());
          }
        });

        flipInstanceRef.current = flip;
        setTimeout(() => {
          if (isMounted) setIsLoaded(true);
        }, 500);
      } catch (err) {
        console.error("Failed to initialize PageFlip:", err);
      }
    }

    initPageFlip();

    return () => {
      isMounted = false;
      HTMLCanvasElement.prototype.getContext = origGetContext;
      if (flip) {
        try {
          flip.destroy();
        } catch (_) {}
      }
      flipInstanceRef.current = null;
    };
  }, []);

  const handleNext = () => {
    if (flipInstanceRef.current) {
      try {
        flipInstanceRef.current.flipNext("bottom");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handlePrev = () => {
    if (flipInstanceRef.current) {
      try {
        flipInstanceRef.current.flipPrev("bottom");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const jumpToPage = (pageNum: number) => {
    if (flipInstanceRef.current) {
      try {
        flipInstanceRef.current.turnToPage(pageNum - 1);
        setCurrentPage(pageNum);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (zoomPage !== null) {
        if (e.key === "Escape") setZoomPage(null);
        if (e.key === "ArrowRight" && zoomPage < TOTAL_PAGES) setZoomPage(zoomPage + 1);
        if (e.key === "ArrowLeft" && zoomPage > 1) setZoomPage(zoomPage - 1);
        return;
      }
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomPage]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-4xl mx-auto flex flex-col justify-between select-none ${
        isFullscreen ? "h-screen bg-[#1c4434] p-4 sm:p-6 justify-center" : ""
      }`}
    >
      {/* Short Access Module Quick-Jump Tabs (Compact & Centered) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4 bg-[#234d3c]/90 border border-botanical/25 rounded-2xl px-4 py-2.5 backdrop-blur-md shadow-lg text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
          <span className="font-mono text-[10px] text-botanical uppercase tracking-wider font-bold mr-1 flex items-center gap-1 shrink-0">
            <BookOpen className="h-3.5 w-3.5" />
            Short Access:
          </span>
          {SHORT_ACCESS_MODULES.map((m) => {
            const isActive =
              m.page === 1
                ? currentPage === 1
                : currentPage >= m.page &&
                  (SHORT_ACCESS_MODULES[SHORT_ACCESS_MODULES.indexOf(m) + 1]
                    ? currentPage < SHORT_ACCESS_MODULES[SHORT_ACCESS_MODULES.indexOf(m) + 1].page
                    : true);
            return (
              <button
                key={m.label}
                type="button"
                onClick={() => jumpToPage(m.page)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all shrink-0 font-medium ${
                  isActive
                    ? "bg-botanical text-forest-deep font-bold shadow-xs scale-102"
                    : "text-ivory/70 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Page status & controls */}
        <div className="flex items-center gap-2.5 font-mono text-xs text-ivory/80 shrink-0">
          {currentPage === 1 ? (
            <span className="bg-botanical/20 text-botanical px-2.5 py-0.5 rounded-full font-bold text-[10px] border border-botanical/30">
              Front Cover (Centered)
            </span>
          ) : (
            <span>
              Page <strong className="text-botanical font-bold">{currentPage}</strong> / {TOTAL_PAGES}
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              setZoomPage(currentPage);
              setZoomScale(1);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-ivory/85 hover:text-white hover:bg-white/20 transition-all font-mono text-[11px]"
            title="Inspect current page in high resolution"
          >
            <ZoomIn className="h-3.5 w-3.5 text-botanical" />
            <span className="hidden sm:inline">Inspect</span>
          </button>

          <button
            type="button"
            onClick={() => jumpToPage(1)}
            className="p-1 rounded-lg text-ivory/60 hover:text-white hover:bg-white/10 transition-colors"
            title="Return to Cover"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1 rounded-lg text-ivory/60 hover:text-white hover:bg-white/10 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Reading"}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* 3D Realistic Physical Book Stage (Centered & Not Enlarged Too Much) */}
      <div className="relative w-full rounded-3xl border-2 border-botanical/30 bg-gradient-to-b from-[#1b4332] via-[#245240] to-[#1c4434] p-3 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col items-center justify-center">
        {/* Soft 3D floor shadow underneath book */}
        <div className="pointer-events-none absolute bottom-12 inset-x-12 h-10 rounded-[100%] bg-black/40 blur-xl" />

        {/* Center Stage Container with explicit balanced height */}
        <div className="relative w-full max-w-[660px] h-[340px] sm:h-[390px] md:h-[420px] flex items-center justify-center overflow-hidden">
          {/* Centered Canvas Mount */}
          <div
            ref={bookContainerRef}
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transform:
                orientation === "portrait"
                  ? "translateX(0)"
                  : currentPage === 1
                  ? "translateX(-25%)"
                  : currentPage >= totalPages
                  ? "translateX(25%)"
                  : "translateX(0)",
              transition: "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />

          {/* Centered "Open Booklet" button on Cover */}
          {currentPage === 1 && isLoaded && (
            <div className="absolute bottom-5 sm:bottom-7 z-30 flex items-center justify-center">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-botanical text-forest-deep font-mono text-xs font-bold uppercase tracking-wider shadow-[0_8px_25px_rgba(140,191,95,0.45)] hover:scale-105 active:scale-95 transition-all"
              >
                <BookOpen className="h-4 w-4" />
                <span>Open 63-Page Booklet &rarr;</span>
              </button>
            </div>
          )}

          {/* Loading spinner */}
          {!isLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#1e4838]/85 backdrop-blur-sm z-20">
              <div className="h-8 w-8 rounded-full border-3 border-botanical/30 border-t-botanical animate-spin" />
              <span className="font-mono text-xs text-botanical font-semibold tracking-wider">
                Loading 3D Center Booklet...
              </span>
            </div>
          )}
        </div>

        {/* Bottom Turn Navigation Bar */}
        <div className="w-full mt-3.5 pt-3 border-t border-botanical/20 flex items-center justify-between text-xs font-mono">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage <= 1}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all font-semibold ${
              currentPage <= 1
                ? "opacity-30 cursor-not-allowed text-ivory/40"
                : "bg-white/10 text-ivory hover:bg-white/20 active:scale-95 shadow-sm"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <span className="text-ivory/70 text-[11px] text-center hidden sm:inline">
            Drag corner or click edge to peel &amp; flip &middot; Arrow keys enabled &middot; Opens from centre
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage >= TOTAL_PAGES}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all font-bold ${
              currentPage >= TOTAL_PAGES
                ? "opacity-30 cursor-not-allowed text-ivory/40"
                : "bg-botanical text-forest-deep hover:bg-botanical/90 active:scale-95 shadow-md"
            }`}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Short Access Core Curriculum Cards (Takeaways without flipping all 63 pages) */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-botanical animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-botanical font-bold">
              Short Access Summary &bull; 4 Core Curriculum Modules
            </span>
          </div>
          <span className="text-xs font-mono text-ivory/60">Click any module to jump to page in 3D reader</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {CORE_CURRICULUM_TAKEAWAYS.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.num}
                onClick={() => jumpToPage(m.jumpPage)}
                className="group relative cursor-pointer rounded-2xl border border-botanical/25 bg-[#204938]/80 p-4 shadow-sm hover:border-botanical hover:bg-[#255240] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-botanical">Mod {m.num}</span>
                    <span className="text-[10px] font-mono text-ivory/60">{m.pages}</span>
                  </div>
                  <h4 className="font-display text-sm font-bold text-white group-hover:text-botanical transition-colors">
                    {m.title}
                  </h4>
                  <p className="mt-1.5 text-[11px] text-ivory/70 leading-relaxed line-clamp-2">
                    {m.summary}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-botanical/15 flex items-center justify-between text-[11px] font-mono text-botanical font-semibold">
                  <span>Jump in 3D Reader</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Slide Inspector Modal */}
      <AnimatePresence>
        {zoomPage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-6"
            onClick={() => setZoomPage(null)}
          >
            <div
              className="flex items-center justify-between pb-3 border-b border-white/15"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-botanical uppercase tracking-wider font-bold">
                  HIGH-RESOLUTION SLIDE INSPECTOR
                </span>
                <span className="font-mono text-xs text-ivory/80">
                  Slide {zoomPage} of {TOTAL_PAGES}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomScale((s) => Math.min(2.5, s + 0.25))}
                  className="p-1.5 rounded-lg bg-white/10 text-ivory hover:bg-white/20 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomScale((s) => Math.max(0.75, s - 0.25))}
                  className="p-1.5 rounded-lg bg-white/10 text-ivory hover:bg-white/20 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomScale(1)}
                  className="px-2 py-1 rounded-lg bg-white/10 text-[11px] font-mono text-ivory hover:bg-white/20 transition-colors"
                >
                  Reset ({Math.round(zoomScale * 100)}%)
                </button>

                <button
                  type="button"
                  onClick={() => setZoomPage(null)}
                  className="p-1.5 rounded-lg bg-white/10 text-ivory hover:bg-white/20 transition-colors ml-2"
                  title="Close (Esc)"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div
              className="relative flex-1 w-full overflow-auto flex items-center justify-center p-2 sm:p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  transform: `scale(${zoomScale})`,
                  transition: "transform 0.2s ease-out",
                }}
                className="relative aspect-[16/9] w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-black"
              >
                <Image
                  src={PAGES[zoomPage - 1].src}
                  alt={`Slide ${zoomPage}`}
                  fill
                  sizes="1920px"
                  className="object-contain"
                  priority
                />
              </div>

              {zoomPage > 1 && (
                <button
                  type="button"
                  onClick={() => setZoomPage(zoomPage - 1)}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 border border-white/20 text-white hover:bg-botanical hover:text-forest-deep transition-all shadow-2xl"
                  title="Previous Slide"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}
              {zoomPage < TOTAL_PAGES && (
                <button
                  type="button"
                  onClick={() => setZoomPage(zoomPage + 1)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 border border-white/20 text-white hover:bg-botanical hover:text-forest-deep transition-all shadow-2xl"
                  title="Next Slide"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
