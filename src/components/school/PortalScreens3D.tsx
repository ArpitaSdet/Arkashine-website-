"use client";

/**
 * Both Student Portal screens on the hero, floating in 3D:
 * two browser windows layered in depth, tilting toward the cursor,
 * with live-looking UI chips orbiting them. Click the back window
 * (or wait) and the two swap places.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { CheckCircle2, MapPin, PlayCircle, Sprout } from "lucide-react";

export const PORTAL_SCREENS = [
  {
    id: "journey",
    label: "8-Step Soil Journey",
    url: "sil.arkashine.in/student/journey",
    src: "/images/school/portal-journey-hd.webp",
    alt: "Student Portal: Hands-on Soil Testing Journey dashboard with field samples, SoiLenz tests and farmers advised",
  },
  {
    id: "videos",
    label: "Learning Videos",
    url: "sil.arkashine.in/student/videos",
    src: "/images/school/portal-videos-hd.webp",
    alt: "Student Portal: Learning Videos player with animated soil science explainers",
  },
  {
    id: "modules",
    label: "Study Modules",
    url: "sil.arkashine.in/student/modules",
    src: "/images/school/portal-modules-hd.webp",
    alt: "Student Portal: six curriculum study modules from living soil science to farmer advisory",
  },
] as const;

export function BrowserFrame({ url, src, alt, priority }: { url: string; src: string; alt: string; priority?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0c1f18] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.65)]">
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#13291f] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ef6b5b]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e8b23a]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#5fbf6b]" />
        <span className="ml-2 flex-1 truncate rounded-md bg-black/30 px-2.5 py-0.5 font-mono text-[10px] text-ivory/55">{url}</span>
      </div>
      <div className="relative aspect-[1912/912] w-full">
        <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 95vw, 720px" className="object-cover object-top" priority={priority} draggable={false} />
      </div>
    </div>
  );
}

export function PortalScreens3D() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [front, setFront] = useState(0);
  const [hover, setHover] = useState(false);

  const mx = useSpring(0, { stiffness: 50, damping: 14 });
  const my = useSpring(0, { stiffness: 50, damping: 14 });
  const rotY = useTransform(mx, (v) => -14 + v * 12);
  const rotX = useTransform(my, (v) => 8 - v * 8);
  const chipX = useTransform(mx, (v) => v * 18);
  const chipY = useTransform(my, (v) => v * 14);

  useEffect(() => {
    if (hover || reduce) return;
    const t = setInterval(() => setFront((f) => (f + 1) % PORTAL_SCREENS.length), 4200);
    return () => clearInterval(t);
  }, [hover, reduce]);

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        mx.set(0);
        my.set(0);
      }}
      className="relative mx-auto aspect-[5/4] w-full max-w-[720px]"
      style={{ perspective: 1600 }}
    >
      {/* glow */}
      <div className="pointer-events-none absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgba(140,191,95,0.35),transparent_65%)] blur-2xl" />

      <motion.div className="absolute inset-0" style={{ rotateY: rotY, rotateX: rotX, transformStyle: "preserve-3d" }}>
        {PORTAL_SCREENS.map((s, i) => {
          const depth = (i - front + PORTAL_SCREENS.length) % PORTAL_SCREENS.length;
          const isFront = depth === 0;
          const pos = [
            { left: "0%", top: "26%", z: 60, b: 1, r: 0 },
            { left: "8%", top: "13%", z: -50, b: 0.78, r: 1.5 },
            { left: "16%", top: "0%", z: -140, b: 0.6, r: 3 },
          ][depth];
          return (
            <motion.button
              key={s.id}
              type="button"
              aria-label={`Show ${s.label}`}
              onClick={() => setFront(i)}
              className="absolute w-[86%] text-left focus-visible:outline-3 focus-visible:outline-botanical"
              style={{ transformStyle: "preserve-3d", zIndex: 10 - depth }}
              initial={{ opacity: 0, y: 60 }}
              animate={{
                opacity: 1,
                left: pos.left,
                top: pos.top,
                z: pos.z,
                y: 0,
                rotateZ: pos.r,
                filter: `brightness(${pos.b})`,
              }}
              transition={{ type: "spring", stiffness: 70, damping: 16, opacity: { duration: 0.6, delay: 0.2 + i * 0.15 } }}
            >
              <motion.div animate={reduce ? undefined : { y: [0, isFront ? -6 : -4, 0] }} transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}>
                <BrowserFrame url={s.url} src={s.src} alt={s.alt} priority />
              </motion.div>
              <span
                className={`absolute -top-3 ${isFront ? "left-4" : depth === 1 ? "right-28" : "right-4"} rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider shadow-lg transition-colors ${
                  isFront ? "bg-forest text-ivory" : "bg-white text-ink/70 shadow"
                }`}
              >
                {s.label}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* orbiting UI chips (parallax a little more than the screens) */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ x: chipX, y: chipY }}>
        <Chip className="-left-2 top-[8%] sm:-left-6" delay={0.8}>
          <PlayCircle className="h-4 w-4 text-[#b18cff]" />
          <span>Watched 3 of 6</span>
          <span className="relative h-1.5 w-12 overflow-hidden rounded-full bg-ink/10">
            <motion.span className="absolute inset-y-0 left-0 rounded-full bg-[#b18cff]" initial={{ width: 0 }} animate={{ width: "50%" }} transition={{ delay: 1.4, duration: 1.2 }} />
          </span>
        </Chip>
        <Chip className="-right-2 top-[54%] sm:-right-6" delay={1.0}>
          <MapPin className="h-4 w-4 text-[#d08a1f]" />
          <span>28 farms advised</span>
        </Chip>
        <Chip className="bottom-[2%] left-[6%]" delay={1.2}>
          <CheckCircle2 className="h-4 w-4 text-botanical-dark" />
          <span>Day 22 of 28</span>
        </Chip>
        <Chip className="right-[10%] -top-1" delay={1.4}>
          <Sprout className="h-4 w-4 text-botanical-dark" />
          <span>Live SoiLenz</span>
          <span className="h-2 w-2 animate-pulse rounded-full bg-botanical" />
        </Chip>
      </motion.div>
    </div>
  );
}

function Chip({ children, className, delay }: { children: React.ReactNode; className: string; delay: number }) {
  return (
    <motion.div
      className={`absolute z-10 flex items-center gap-2 rounded-full border border-ink/5 bg-white/90 px-3 py-1.5 font-mono text-[10px] font-semibold text-ink shadow-[0_12px_30px_-10px_rgba(19,32,27,0.35)] backdrop-blur-md sm:text-[11px] ${className}`}
      initial={{ opacity: 0, scale: 0.6, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
      transition={{
        opacity: { delay, duration: 0.4 },
        scale: { delay, type: "spring", stiffness: 260, damping: 14 },
        y: { delay: delay + 0.4, duration: 3.6, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      {children}
    </motion.div>
  );
}
