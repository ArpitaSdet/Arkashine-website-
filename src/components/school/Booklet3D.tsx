"use client";

/**
 * Highlights booklet — a 3D book that opens from the centre.
 *
 * Closed: the cover sits in the middle of the stage. Opening: the cover
 * splits down its centre into two doors that swing outward, and the first
 * spread unfolds from the spine. The spine never moves.
 * Inside: only the key pages (welcome, contents, tools, activities and the
 * eight module openers), turned with spring-driven 3D sheets. Drag a page,
 * click it, or use the arrow keys.
 */

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { BookOpen, ChevronLeft, ChevronRight, Hand, Maximize2, Minimize2, RotateCcw, Sprout, X } from "lucide-react";

const COVER = 1;
/** Key pages only, in reading order (page 2 sits on the left of the first spread). */
const BOOK = [2, 3, 4, 13, 14, 15, 21, 27, 32, 38, 44, 50, 56];
const LEAVES = (BOOK.length - 1) / 2; // 6 sheets
const SPREADS = ["Welcome", "Tools", "Activities", "Sampling · Testing", "Reports · Crops", "Fertiliser · Plants", "Harvest"];
const pageSrc = (n: number) => `/images/booklet/page_${String(n).padStart(2, "0")}.png`;

/* ------------------------------------------------------------------ */

interface LeafProps {
  index: number;
  pageW: number;
  pageH: number;
  target: number;
  delay: number;
  dragAngle: MotionValue<number>;
  dragging: boolean;
}

const Leaf = memo(function Leaf({ index, pageW, pageH, target, delay, dragAngle, dragging }: LeafProps) {
  const rot = useSpring(target, { stiffness: 58, damping: 15 });

  useEffect(() => {
    if (dragging) return;
    if (delay <= 0) return void rot.set(target);
    const t = setTimeout(() => rot.set(target), delay);
    return () => clearTimeout(t);
  }, [target, delay, dragging, rot]);

  useEffect(() => {
    if (!dragging) return;
    return dragAngle.on("change", (v) => rot.set(v));
  }, [dragging, dragAngle, rot]);

  const zR = (LEAVES - index) * 0.8 + 1;
  const zL = (index + 1) * 0.8 + 1;
  const transform = useTransform(rot, (r) => {
    const t = Math.min(1, Math.max(0, -r / 180));
    return `translateZ(${zR + (zL - zR) * t + Math.sin(t * Math.PI) * 46}px) rotateY(${r}deg)`;
  });
  const frontShade = useTransform(rot, [0, -90], [0, 0.55]);
  const backShade = useTransform(rot, [-90, -180], [0.55, 0]);
  const gloss = useTransform(rot, [-8, -55, -100], [0, 0.5, 0]);
  const glossX = useTransform(rot, [0, -100], ["-60%", "120%"]);

  const front = BOOK[index * 2 + 1];
  const back = BOOK[index * 2 + 2];

  return (
    <motion.div
      className="absolute top-0"
      style={{ left: pageW, width: pageW, height: pageH, transformOrigin: "0% 50%", transformStyle: "preserve-3d", transform }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-r-[4px] bg-[#f5f1e6]" style={{ backfaceVisibility: "hidden" }}>
        <Image src={pageSrc(front)} alt={`Booklet page ${front}`} fill sizes={`${Math.round(pageW)}px`} className="object-cover" draggable={false} />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[14%] bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
        <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: frontShade }} />
        <motion.div className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent" style={{ opacity: gloss, left: glossX }} />
      </div>
      <div className="absolute inset-0 overflow-hidden rounded-l-[4px] bg-[#f5f1e6]" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
        <Image src={pageSrc(back)} alt={`Booklet page ${back}`} fill sizes={`${Math.round(pageW)}px`} className="object-cover" draggable={false} />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[14%] bg-gradient-to-l from-black/35 via-black/10 to-transparent" />
        <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: backShade }} />
      </div>
    </motion.div>
  );
});

/* ------------------------------------------------------------------ */

export function Booklet3D() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fsRef = useRef<HTMLDivElement>(null);

  const [box, setBox] = useState({ w: 960, h: 800 });
  const [opened, setOpened] = useState(false);
  // `from` remembers where the last turn started, so multi-page jumps riffle in order
  const [nav, setNav] = useState({ f: 0, from: 0 });
  const flipped = nav.f;
  const setFlipped = useCallback(
    (v: number | ((f: number) => number)) => setNav((n) => ({ f: typeof v === "function" ? v(n.f) : v, from: n.f })),
    []
  );
  const [awake, setAwake] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomIdx, setZoomIdx] = useState<number | null>(null);
  const [peek, setPeek] = useState<"next" | "prev" | null>(null);
  const [dragLeaf, setDragLeaf] = useState(-1);
  const [hinted, setHinted] = useState(false);
  const [fanning, setFanning] = useState(false); // pages fan up from the spine right after opening
  const [userHold, setUserHold] = useState(false); // autoplay stops once the reader takes over
  const [hovering, setHovering] = useState(false);

  const dragAngle = useMotionValue(0);

  const inView = useInView(wrapRef, { amount: 0.45, once: true });
  const onScreen = useInView(wrapRef, { amount: 0.3 });

  /* size: fit the width AND the screen height so the section stays in one frame */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: window.innerHeight });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  const maxByHeight = ((box.h - (isFullscreen ? 160 : 330)) * 16) / 9 * 2;
  const spreadW = Math.max(300, Math.min(box.w - 8, isFullscreen ? 1600 : 1120, maxByHeight));
  const pageW = spreadW / 2;
  const pageH = (pageW * 9) / 16;

  /* intro: rise off the desk, then open from the centre */
  useEffect(() => {
    if (!inView) return;
    const a = setTimeout(() => setAwake(true), reduce ? 0 : 100);
    const b = setTimeout(() => setOpened(true), reduce ? 0 : 1000);
    const f1 = reduce ? 0 : setTimeout(() => setFanning(true), 1500);
    const f2 = reduce ? 0 : setTimeout(() => setFanning(false), 3300);
    const c = setTimeout(() => setHinted(true), 4200);
    return () => [a, b, c, f1, f2].forEach((t) => t && clearTimeout(t));
  }, [inView, reduce]);

  const go = useCallback((n: number) => {
    setUserHold(true);
    setOpened(true);
    setFlipped(Math.max(0, Math.min(LEAVES, n)));
  }, [setFlipped]);
  const next = useCallback(() => {
    setUserHold(true);
    if (!opened) return setOpened(true);
    setFlipped((f) => Math.min(LEAVES, f + 1));
  }, [opened, setFlipped]);
  const prev = useCallback(() => {
    setUserHold(true);
    if (opened && flipped === 0) return setOpened(false);
    setFlipped((f) => Math.max(0, f - 1));
  }, [opened, flipped, setFlipped]);
  const closeBook = () => {
    setFlipped(0);
    setTimeout(() => setOpened(false), flipped > 0 ? 700 : 0);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (zoomIdx !== null) {
        if (e.key === "Escape") setZoomIdx(null);
        if (e.key === "ArrowRight") setZoomIdx((z) => (z !== null && z < BOOK.length - 1 ? z + 1 : z));
        if (e.key === "ArrowLeft") setZoomIdx((z) => (z !== null && z > 0 ? z - 1 : z));
        return;
      }
      if (!onScreen) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomIdx, onScreen, next, prev]);

  /* turns pages on its own while on screen; loops back to the start */
  useEffect(() => {
    if (!opened || fanning || !onScreen || userHold || hovering || zoomIdx !== null || dragLeaf >= 0 || reduce) return;
    const t = setTimeout(() => setFlipped((f) => (f >= LEAVES ? 0 : f + 1)), flipped >= LEAVES ? 3200 : 3600);
    return () => clearTimeout(t);
  }, [opened, fanning, onScreen, userHold, hovering, zoomIdx, dragLeaf, reduce, flipped, setFlipped]);

  const delays = useMemo(() => {
    const from = nav.from;
    const d = new Array(LEAVES).fill(0);
    if (flipped > from) for (let i = from; i < flipped; i++) d[i] = (i - from) * 90;
    else for (let i = flipped; i < from; i++) d[i] = (from - 1 - i) * 90;
    return d;
  }, [flipped, nav.from]);

  /* drag a page */
  const drag = useRef<{ x: number; leaf: number; dir: 1 | -1; moved: boolean } | null>(null);
  const centreX = () => {
    const r = stageRef.current!.getBoundingClientRect();
    return r.left + r.width / 2;
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if (!opened) return void setOpened(true);
    const right = e.clientX > centreX();
    if (right && flipped < LEAVES) drag.current = { x: e.clientX, leaf: flipped, dir: 1, moved: false };
    else if (!right && flipped > 0) drag.current = { x: e.clientX, leaf: flipped - 1, dir: -1, moved: false };
    else return;
    setUserHold(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) {
      if (!opened) return;
      const rel = (e.clientX - centreX()) / pageW;
      setPeek(rel > 0.7 && rel < 1.05 && flipped < LEAVES ? "next" : rel < -0.7 && rel > -1.05 && flipped > 0 ? "prev" : null);
      return;
    }
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      setPeek(null);
      dragAngle.set(d.dir === 1 ? 0 : -180);
      setDragLeaf(d.leaf);
    }
    if (d.moved) {
      const k = (dx / spreadW) * 180 * 1.15;
      dragAngle.set(Math.max(-180, Math.min(0, d.dir === 1 ? k : -180 + k)));
    }
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!d.moved) return d.dir === 1 ? next() : prev();
    const a = dragAngle.get();
    if (d.dir === 1 && a < -55) setFlipped((f) => f + 1);
    if (d.dir === -1 && a > -125) setFlipped((f) => f - 1);
    setDragLeaf(-1);
  };

  /* cursor tilt */
  const tiltX = useSpring(0, { stiffness: 60, damping: 16 });
  const tiltY = useSpring(0, { stiffness: 60, damping: 16 });
  const onStageMove = (e: React.MouseEvent) => {
    if (reduce || drag.current) return;
    const r = stageRef.current!.getBoundingClientRect();
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 6);
    tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 5);
  };

  /* fullscreen */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) fsRef.current?.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  };
  useEffect(() => {
    const f = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", f);
    return () => document.removeEventListener("fullscreenchange", f);
  }, []);

  const finished = flipped === LEAVES;
  const leftIdx = flipped * 2;
  const rightIdx = flipped * 2 + 1 < BOOK.length ? flipped * 2 + 1 : null;
  const label = opened ? SPREADS[flipped] : "Cover";
  const doorSpring = { type: "spring" as const, stiffness: 42, damping: 13 };

  return (
    <div ref={wrapRef} className="relative w-full">
      <div ref={fsRef} className={`relative mx-auto w-full ${isFullscreen ? "flex h-screen flex-col justify-center bg-ivory p-6" : ""}`}>
        {/* stage */}
        <div
          ref={stageRef}
          onMouseMove={onStageMove}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => {
            setHovering(false);
            tiltX.set(0);
            tiltY.set(0);
            setPeek(null);
          }}
          className="relative mx-auto w-full"
          style={{ perspective: 2400, height: pageH + 90 }}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(140,191,95,0.28),transparent_65%)]" />
          <motion.div
            className="pointer-events-none absolute left-1/2 rounded-[50%] bg-ink/30 blur-2xl"
            style={{ top: pageH + 46, height: 30, x: "-50%" }}
            animate={{ width: opened ? spreadW * 0.95 : pageW * 0.95, opacity: awake ? 1 : 0.3 }}
            transition={doorSpring}
          />
          {!reduce && <Spores />}

          <motion.div
            className="absolute left-1/2 top-[30px]"
            style={{
              width: spreadW,
              height: pageH,
              marginLeft: -spreadW / 2,
              transformStyle: "preserve-3d",
              rotateX: tiltX,
              rotateY: tiltY,
              touchAction: "pan-y",
              cursor: dragLeaf >= 0 ? "grabbing" : peek ? "grab" : "pointer",
            }}
            initial={false}
            animate={awake ? { y: 0, scale: 1, opacity: 1 } : { y: 60, scale: 0.86, opacity: 0 }}
            transition={{ type: "spring", stiffness: 55, damping: 15 }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <motion.div
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d", transformOrigin: "50% 100%" }}
              initial={false}
              animate={{ rotateX: awake ? (fanning ? 24 : 14) : 70, y: awake && !reduce ? [0, -6, 0] : 0 }}
              transition={{ rotateX: { type: "spring", stiffness: 45, damping: 14 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
            >
              {/* ---------- the inside: unfolds from the spine ---------- */}
              <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
                {/* hard boards + page blocks grow outward from the spine */}
                <motion.div
                  className="absolute rounded-[12px] bg-gradient-to-br from-[#2a5a43] to-[#143326] shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                  style={{ top: -6, height: pageH + 12, transform: "translateZ(-2px)" }}
                  initial={false}
                  animate={{ left: opened ? -8 : pageW / 2, width: opened ? spreadW + 16 : pageW }}
                  transition={doorSpring}
                />
                <motion.div
                  className="absolute rounded-l-[5px]"
                  style={{ top: 0, height: pageH + 3, background: "repeating-linear-gradient(0deg,#efe9da 0 1px,#d6cdb8 1px 2px)" }}
                  initial={false}
                  animate={{ left: opened ? -4 : pageW, width: opened ? pageW + 4 : 0 }}
                  transition={doorSpring}
                />
                <motion.div
                  className="absolute rounded-r-[5px]"
                  style={{ left: pageW, top: 0, height: pageH + 3, background: "repeating-linear-gradient(0deg,#efe9da 0 1px,#d6cdb8 1px 2px)" }}
                  initial={false}
                  animate={{ width: opened ? pageW + 4 : 0 }}
                  transition={doorSpring}
                />

                {/* static left page (first spread) and closing page on the right */}
                <motion.div
                  className="absolute left-0 top-0 overflow-hidden rounded-l-[4px] bg-[#f5f1e6]"
                  style={{ width: pageW, height: pageH, transformOrigin: "100% 50%", transform: "translateZ(0.5px)" }}
                  initial={false}
                  animate={{ rotateY: opened ? 0 : 90 }}
                  transition={doorSpring}
                >
                  <Image src={pageSrc(BOOK[0])} alt={`Booklet page ${BOOK[0]}`} fill sizes={`${Math.round(pageW)}px`} className="object-cover" priority />
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-[14%] bg-gradient-to-l from-black/35 via-black/10 to-transparent" />
                </motion.div>
                <motion.div
                  className="absolute top-0 overflow-hidden rounded-r-[4px]"
                  style={{ left: pageW, width: pageW, height: pageH, transformOrigin: "0% 50%", z: 0.5 }}
                  initial={false}
                  animate={{ rotateY: opened ? 0 : -90 }}
                  transition={doorSpring}
                >
                  <EndPage onInspect={() => setZoomIdx(0)} />
                </motion.div>

                {Array.from({ length: LEAVES }, (_, i) => {
                  let target = i < flipped ? -180 : 0;
                  if (dragLeaf < 0 && peek === "next" && i === flipped) target = -16;
                  if (dragLeaf < 0 && peek === "prev" && i === flipped - 1) target = -164;
                  if (fanning) {
                    // fan like a book dropped open: sheets spread across the arc from the spine
                    const t = (i + 0.5) / LEAVES;
                    target = -(18 + t * 144);
                  }
                  if (!opened) target = -90; // folded up at the spine until the cover opens
                  return (
                    <Leaf key={i} index={i} pageW={pageW} pageH={pageH} target={target} delay={fanning ? i * 70 : delays[i]} dragAngle={dragAngle} dragging={dragLeaf === i} />
                  );
                })}

                {/* ribbon */}
                <motion.div
                  className="pointer-events-none absolute"
                  style={{ left: pageW - 7, top: pageH - 6, width: 14, transform: "translateZ(20px)", transformOrigin: "50% 0%" }}
                  animate={{ height: opened ? 54 : 0, rotateZ: [0, 3, -2, 0] }}
                  transition={{ height: { duration: 0.6, delay: 0.8 }, rotateZ: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
                >
                  <div className="h-full w-full bg-gradient-to-b from-[#ef7b3b] to-[#c2410c] [clip-path:polygon(0_0,100%_0,100%_100%,50%_82%,0_100%)]" />
                </motion.div>
              </div>

              {/* ---------- the cover: splits down the centre, doors swing outward ---------- */}
              {(["left", "right"] as const).map((side) => (
                <motion.div
                  key={side}
                  className="absolute top-0 overflow-hidden"
                  style={{
                    left: side === "left" ? pageW / 2 : pageW,
                    width: pageW / 2,
                    height: pageH,
                    transformOrigin: side === "left" ? "0% 50%" : "100% 50%",
                    borderRadius: side === "left" ? "10px 0 0 10px" : "0 10px 10px 0",
                    backgroundImage: `url(${pageSrc(COVER)})`,
                    backgroundSize: "200% 100%",
                    backgroundPosition: side === "left" ? "0% 0%" : "100% 0%",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.45)",
                    pointerEvents: opened ? "none" : "auto",
                  }}
                  initial={false}
                  animate={{
                    rotateY: opened ? (side === "left" ? -115 : 115) : 0,
                    z: opened ? 40 : 30,
                    opacity: opened ? 0 : 1,
                  }}
                  transition={{ ...doorSpring, opacity: { duration: 0.5, delay: opened ? 0.55 : 0 } }}
                >
                  {/* centre seam + light catching the edge */}
                  <div className={`absolute inset-y-0 w-[6px] ${side === "left" ? "right-0 bg-gradient-to-l" : "left-0 bg-gradient-to-r"} from-black/40 to-transparent`} />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/15" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {!opened && awake && (
              <motion.button
                type="button"
                onClick={() => setOpened(true)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-0 left-1/2 z-[400] inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#1E7A33] px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#fff] shadow-[0_10px_30px_rgba(140,191,95,0.5)]"
              >
                <BookOpen className="h-4 w-4" /> Open
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {hinted && opened && flipped === 0 && dragLeaf < 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute z-[400] flex items-center gap-2 rounded-full border border-ink/5 bg-white/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink shadow backdrop-blur-md"
                style={{ right: `calc(50% - ${pageW}px + 14px)`, top: 42 }}
              >
                <motion.span animate={{ x: [0, -10, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                  <Hand className="h-3.5 w-3.5 text-botanical-dark" />
                </motion.span>
                drag
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* controls: one row */}
        <div className="mx-auto mt-4 flex max-w-3xl items-center gap-3 font-mono text-xs">
          <button type="button" onClick={prev} disabled={!opened} aria-label="Previous" className="rounded-full border border-ink/15 bg-white p-2.5 text-ink transition hover:bg-ivory-2 active:scale-95 disabled:opacity-30">
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex flex-1 items-center justify-center gap-2">
            {SPREADS.map((s, i) => {
              const active = opened && flipped === i;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => go(i)}
                  title={s}
                  aria-label={`Go to ${s}`}
                  className="group relative flex h-6 items-center"
                >
                  <motion.span
                    className="block h-2 rounded-full"
                    animate={{ width: active ? 30 : 8, backgroundColor: active ? "#4f7d2e" : "rgba(19,32,27,0.15)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  />
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="hidden w-36 text-center text-[11px] font-semibold uppercase tracking-wider text-botanical-dark sm:block"
            >
              {label}
            </motion.span>
          </AnimatePresence>

          <button type="button" onClick={() => setZoomIdx(rightIdx ?? leftIdx)} disabled={!opened} className="rounded-full p-2 text-ink/70 hover:bg-ink/5 disabled:opacity-30" title="Read up close">
            <Maximize2 className="h-4 w-4" />
          </button>
          <button type="button" onClick={closeBook} disabled={!opened} className="rounded-full p-2 text-ink/70 hover:bg-ink/5 disabled:opacity-30" title="Close the book">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button type="button" onClick={toggleFullscreen} className="hidden rounded-full p-2 text-ink/70 hover:bg-ink/5 sm:block" title="Fullscreen">
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
          </button>

          <button type="button" onClick={next} disabled={finished} aria-label="Next" className="rounded-full bg-forest p-2.5 text-ivory transition hover:brightness-125 active:scale-95 disabled:opacity-30">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* reader */}
      <AnimatePresence>
        {zoomIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-10"
            onClick={() => setZoomIdx(null)}
          >
            <motion.div
              key={zoomIdx}
              initial={{ opacity: 0, rotateY: -25, scale: 0.94 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="relative aspect-[16/9] w-full max-w-6xl overflow-hidden rounded-xl border border-white/20 bg-black shadow-2xl"
              style={{ transformPerspective: 1200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={pageSrc(BOOK[zoomIdx])} alt={`Booklet page ${BOOK[zoomIdx]}`} fill sizes="1600px" className="object-contain" priority />
            </motion.div>
            <button type="button" onClick={() => setZoomIdx(null)} className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-ivory hover:bg-white/20" title="Close (Esc)">
              <X className="h-5 w-5" />
            </button>
            {zoomIdx > 0 && (
              <button type="button" onClick={(e) => { e.stopPropagation(); setZoomIdx(zoomIdx - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-3 text-white hover:bg-botanical hover:text-forest-deep" title="Previous page">
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}
            {zoomIdx < BOOK.length - 1 && (
              <button type="button" onClick={(e) => { e.stopPropagation(); setZoomIdx(zoomIdx + 1); }} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-3 text-white hover:bg-botanical hover:text-forest-deep" title="Next page">
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* closing page on the right of the last spread */
function EndPage({ onInspect }: { onInspect: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3%] bg-gradient-to-br from-[#1b4332] via-[#173a2b] to-[#0f2a1f] text-center">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[14%] bg-gradient-to-r from-black/40 to-transparent" />
      <Sprout className="h-[14%] w-[14%] text-botanical" strokeWidth={1.4} />
      <div className="font-display text-[clamp(14px,2.4vw,30px)] font-bold text-ivory">8 modules · 63 pages</div>
      <div className="font-mono text-[clamp(8px,0.9vw,11px)] uppercase tracking-[0.18em] text-botanical">Healthy soils. Brighter tomorrows.</div>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onInspect();
        }}
        className="mt-[2%] rounded-full border border-botanical/50 px-4 py-1.5 font-mono text-[clamp(8px,0.9vw,11px)] uppercase tracking-wider text-ivory hover:bg-botanical hover:text-forest-deep"
      >
        Read up close
      </button>
    </div>
  );
}

function Spores() {
  const dots = useMemo(
    () => Array.from({ length: 20 }, (_, i) => ({ left: (i * 37) % 100, size: 2 + ((i * 7) % 4), dur: 9 + ((i * 13) % 9), delay: (i * 0.7) % 8, green: i % 3 !== 0 })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{ left: `${d.left}%`, width: d.size, height: d.size, background: d.green ? "rgba(140,191,95,0.55)" : "rgba(176,128,82,0.5)" }}
          animate={{ y: [0, -460], opacity: [0, 1, 0], x: [0, i % 2 ? 18 : -18] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}
