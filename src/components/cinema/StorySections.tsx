"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, GraduationCap, HeartHandshake, Landmark, Leaf, Package, Plus, Sprout, Truck, Users, X, MessageCircle, Phone } from "lucide-react";
import { ecosystem, faqs, patents } from "@/lib/cinema-content";
import { company } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* 11 · Farmer impact — full-bleed field photography                    */
/* ------------------------------------------------------------------ */

export { FarmerImpact } from "./FarmerImpactWall";

/* ------------------------------------------------------------------ */
/* 12 · Institutional ecosystem ribbon                                  */
/* ------------------------------------------------------------------ */

// label → a real ArkaShine field photo + a line icon. The photo is decorative
// texture on click, not a claim about that specific partner type.
// full-bleed, so only the higher-resolution, landscape-aspect field photos
// are used here — the small ~400px-wide thumbnails looked soft and the
// portrait/near-square ones cropped to an unrecognisable close-up at this size.
interface SectorItem {
  name: string;
  line: string;
  photo: string;
  alt: string;
  Icon: typeof Users;
  href?: string;
  stats?: { value: string; label: string }[];
  /** extra photos that cycle in the showcase window */
  gallery?: { src: string; alt: string }[];
  source?: string;
  /** extra programme details shown under the active ribbon */
  points?: string[];
}

const SECTORS: SectorItem[] = [
  {
    name: "FPOs",
    line: "Profitable village soil testing hub.",
    photo: "/images/people/fpo-women-field.webp",
    alt: "Women farmers and FPO members at a village demonstration table with SoiLenz and ArkaShine brochures",
    Icon: Users,
  },
  {
    name: "Govt & KVKs",
    line: "Decentralized Soil Monitoring Health Card.",
    photo: "/images/people/kvk-presentation.webp",
    alt: "ArkaShine team presenting SoiLenz to farmers at a Krishi Vigyan Kendra",
    Icon: Landmark,
  },
  {
    name: "Agricultural Universities",
    line: "Precision agronomy research and trials.",
    photo: "/images/partners/agricultural-university.webp",
    alt: "ArkaShine precision agronomy demonstration and research trial at an agricultural university",
    Icon: GraduationCap,
  },
  {
    name: "CSR Initiatives",
    line: "Skill development programmes for young professionals.",
    photo: "/images/people/csr-cini-gujarat.webp",
    alt: "CSR programme team and young professionals with two SoiLenz devices and the testing kit",
    gallery: [
      { src: "/images/people/csr-cini-gujarat.webp", alt: "CSR programme team with two SoiLenz devices" },
      { src: "/images/people/odisha-training-hall.webp", alt: "CSR training session in Odisha with the SoiLenz kit" },
      { src: "/images/people/young-professionals-training.webp", alt: "Young professionals trained under a CSR programme" },
    ],
    Icon: HeartHandshake,
    href: "/skill-development",
  },
  {
    name: "Agri-Input Companies",
    line: "Targeted product positioning and dosage.",
    photo: "/images/people/agri-university-training.webp",
    alt: "ArkaShine SoiLenz being demonstrated for agri-input company representatives",
    Icon: Package,
  },
  {
    name: "School Innovation Labs & Summer Camps",
    line: "Experiential STEM & 4-week student rural soil health program.",
    // a real training photo, not the dense text infographic — that one only
    // works at full size with object-contain (see the dedicated page below);
    // forced into this full-bleed object-cover window it just crops to noise.
    photo: "/images/people/school-innovation.webp",
    alt: "Students at a school assembly during an ArkaShine School Innovation Lab session",
    Icon: GraduationCap,
    href: "/school-innovation-lab",
    stats: [
      { value: "15–20", label: "Students" },
      { value: "1,500+", label: "Farmers reached" },
      { value: "~750", label: "Soil tests run" },
    ],
  },
  {
    name: "Soil Partners",
    line: "With our hardware SoiLenz 2.0 and pH bottle, you get 3 services: LeafLENZ, HarvestLENZ, and Carbon Intelligence.",
    photo: "/images/people/youth-field-outreach.webp",
    alt: "An ArkaShine Soil Partner explaining soil testing to village youth holding ArkaShine leaflets",
    Icon: Sprout,
    href: "/soil-partners",
    stats: [
      { value: "SoiLenz 2.0 + pH", label: "Hardware" },
      { value: "3 Services", label: "Included" },
      { value: "Leaf · Harvest · Carbon", label: "Intelligence" },
    ],
  },
  {
    name: "Growers",
    line: "Natural & organic farming for smallholders, kitchen gardeners & natural growers.",
    photo: "/images/people/growers-field.webp",
    alt: "Field soil sampling and organic protocol testing with local growers",
    Icon: Leaf,
    href: "/growers",
    stats: [
      { value: "19", label: "Natural Methods" },
      { value: "100%", label: "Organic Inputs" },
      { value: "Living Soil", label: "Zero Chemical" },
    ],
  },
];

export function EcosystemRibbon() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const current = SECTORS[activeIndex];
  const [galleryIdx, setGalleryIdx] = useState(0);
  useEffect(() => {
    if (!current.gallery) return;
    const t = setInterval(() => setGalleryIdx((g) => g + 1), 2400);
    return () => clearInterval(t);
  }, [current.gallery]);

  // Auto-scroll sync: as user scrolls down, naturally step through the ribbons and showcase photo
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const scrolled = windowH * 0.65 - rect.top;
      const total = rect.height + windowH * 0.2;
      const progress = Math.min(Math.max(scrolled / total, 0), 0.999);
      const nextIndex = Math.min(Math.floor(progress * SECTORS.length), SECTORS.length - 1);
      setActiveIndex(nextIndex);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="home-keep relative min-h-[90vh] py-24 sm:py-32 overflow-hidden flex flex-col justify-center bg-[#12352f] text-ivory"
      aria-labelledby="eco-title"
    >
      <div className="container-site relative z-10 w-full max-w-6xl mx-auto">
        {/* Top 1-Line Clean Heading */}
        <div className="text-center mb-14 sm:mb-20">
          <p id="eco-title" className="eyebrow text-botanical font-mono uppercase tracking-[0.2em] text-xs font-semibold">
            Who we work with
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="display mt-3 text-[clamp(2.4rem,4.5vw,4.4rem)] font-semibold leading-tight text-ivory tracking-tight"
          >
            Built for those who feed India.
          </motion.h2>
        </div>

        {/* Elegant Two-Column Layout: Left Clean 1-Line Ribbons, Right Dynamic Showcase Window */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: 1-Line Interactive Ribbons with Underline */}
          <div className="lg:col-span-6 flex flex-col divide-y divide-ivory/15 border-y border-ivory/15">
            {SECTORS.map((sec, idx) => {
              const isActive = activeIndex === idx;
              const Icon = sec.Icon;
              return (
                <div
                  key={sec.name}
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`cursor-pointer group select-none py-5 px-3 sm:px-4 transition-all duration-300 ${
                    isActive ? "opacity-100" : "opacity-45 hover:opacity-85"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Icon
                        className={`h-5 w-5 sm:h-6 sm:w-6 shrink-0 transition-colors duration-300 ${
                          isActive ? "text-botanical" : "text-ivory/70 group-hover:text-ivory/85"
                        }`}
                        strokeWidth={1.5}
                      />
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span
                            className={`font-display text-xl sm:text-2xl lg:text-3xl font-semibold transition-all duration-300 block leading-tight ${
                              isActive ? "text-ivory translate-x-1" : "text-ivory/85 group-hover:text-ivory"
                            }`}
                          >
                            {sec.name}
                          </span>
                          {sec.href && (
                            <Link
                              href={sec.href}
                              onClick={(e: React.MouseEvent) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-[#1E7A33] text-[#fff] font-bold hover:bg-[#17642a] transition-transform hover:scale-105"
                            >
                              View details &rarr;
                            </Link>
                          )}
                        </div>
                        {isActive && sec.points && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.4, ease }}
                            className="mt-2 space-y-1.5 overflow-hidden"
                          >
                            {sec.points.map((pt, k) => (
                              <motion.li
                                key={pt}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + k * 0.08 }}
                                className="flex gap-2 text-xs leading-relaxed text-ivory/85 sm:text-sm"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-botanical" />
                                {pt}
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                        {isActive && (
                          <div className="flex items-center gap-3 mt-1.5">
                            <motion.p
                              initial={{ opacity: 0, y: 3 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs sm:text-sm text-botanical font-medium"
                            >
                              {sec.line}
                            </motion.p>
                            {sec.href && (
                              <Link
                                href={sec.href}
                                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                className="text-xs font-mono text-ivory/80 underline underline-offset-4 hover:text-botanical transition-colors"
                              >
                                Read full program details
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ribbon indicator */}
                    <div className="shrink-0 flex items-center">
                      {isActive ? (
                        <motion.div
                          layoutId="active-ribbon-bullet"
                          className="h-2 w-10 sm:w-14 bg-botanical rounded-full shadow-[0_0_12px_rgba(47,158,68,0.7)]"
                          transition={{ type: "spring", stiffness: 400, damping: 28 }}
                        />
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-ivory/20 group-hover:bg-ivory/40 transition-colors" />
                      )}
                    </div>
                  </div>

                  {/* Underline bar under active ribbon */}
                  {isActive && (
                    <motion.div
                      layoutId="active-ribbon-line"
                      className="h-[2px] bg-botanical/90 rounded-full mt-2.5 w-24 sm:w-32"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Focused Cinematic Farm Showcase Window */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-w-lg lg:max-w-none rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-[0_20px_60px_rgba(0,0,0,0.6)] group/card">
              {/* Photo Stack with Smooth Crossfade */}
              {SECTORS.map((sec, idx) => {
                const isSelected = activeIndex === idx;
                const content = sec.gallery ? (
                  <>
                    <AnimatePresence initial={false}>
                      {(() => {
                        const g = sec.gallery[galleryIdx % sec.gallery.length];
                        return (
                          <motion.div
                            key={g.src}
                            className="absolute inset-0"
                            initial={{ opacity: 0, scale: 1.12, rotate: 1.5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.9, ease }}
                          >
                            <Image
                              src={g.src}
                              alt=""
                              fill
                              sizes="(max-width: 1024px) 90vw, 550px"
                              className="object-cover object-center blur-2xl scale-110 opacity-30 pointer-events-none"
                              aria-hidden
                            />
                            <Image src={g.src} alt={g.alt} fill sizes="(max-width: 1024px) 90vw, 550px" className="object-contain object-center" />
                          </motion.div>
                        );
                      })()}
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                    {/* filmstrip of the report photos */}
                    <div className="absolute bottom-[5.5rem] right-4 z-10 flex gap-1.5">
                      {sec.gallery.map((g, gi) => (
                        <span
                          key={g.src}
                          className={`relative h-10 w-8 overflow-hidden rounded-md border transition-all duration-500 ${
                            gi === galleryIdx % sec.gallery!.length ? "-translate-y-1.5 border-botanical shadow-lg" : "border-white/30 opacity-60"
                          }`}
                        >
                          <Image src={g.src} alt="" fill sizes="32px" className="object-cover" />
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <Image
                      src={sec.photo}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 90vw, 550px"
                      className="object-cover object-center blur-2xl scale-110 opacity-30 pointer-events-none"
                      aria-hidden
                    />
                    <Image
                      src={sec.photo}
                      alt={sec.alt}
                      fill
                      sizes="(max-width: 1024px) 90vw, 550px"
                      className="object-contain object-center transition-transform duration-700 group-hover/card:scale-105"
                      priority={idx === 0}
                      unoptimized
                    />
                    {/* Subtle vignette gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25 pointer-events-none" />
                  </>
                );

                return sec.href ? (
                  <Link
                    key={sec.photo}
                    href={sec.href}
                    className={`absolute inset-0 transition-all duration-700 ease-out cursor-pointer ${
                      isSelected ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                    }`}
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={sec.photo}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                      isSelected ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                    }`}
                  >
                    {content}
                  </div>
                );
              })}

              {/* Floating stat badges — real figures from the program's own metrics */}
              {current.stats && (
                <div className="absolute left-4 right-4 top-4 z-20 flex flex-wrap gap-2 sm:gap-3 pointer-events-none">
                  {current.stats.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * i, duration: 0.4, ease }}
                      className="rounded-xl border border-botanical/30 bg-forest-deep/80 px-3 py-2 backdrop-blur-md"
                    >
                      <p className="font-display text-lg font-bold leading-none text-botanical sm:text-xl">{s.value}</p>
                      <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-ivory/85">{s.label}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Bottom Caption Pill inside the photo */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between p-3.5 rounded-xl bg-forest-deep/85 backdrop-blur-md border border-white/10">
                <div className="min-w-0 pr-2">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-botanical font-semibold">
                    DEPLOYMENT · {current.name.toUpperCase()}
                  </span>
                  <p className="font-display font-medium text-ivory text-xs sm:text-sm mt-0.5 truncate">
                    {current.line}
                  </p>
                  {current.source && <p className="mt-0.5 truncate font-mono text-xs text-ivory/80">Source: {current.source}</p>}
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  {current.href ? (
                    <Link
                      href={current.href}
                      className="px-3.5 py-1.5 rounded-lg bg-[#1E7A33] text-[#fff] text-xs font-semibold uppercase tracking-wider hover:bg-[#17642a] transition-transform hover:scale-105 flex items-center gap-1.5 shadow-md"
                    >
                      {current.name === "Soil Partners"
                        ? "Explore 3 Products"
                        : current.name === "Growers"
                        ? "Explore Organic Guide"
                        : current.name === "CSR Initiatives"
                        ? "View More Details"
                        : "View More"} &rarr;
                    </Link>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-botanical/20 border border-botanical/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-botanical animate-pulse" />
                      <span className="text-xs font-mono text-botanical font-semibold">LIVE</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 13 · Patents network                                                 */
/* ------------------------------------------------------------------ */

const NODES = [
  { x: 22, y: 30 },
  { x: 74, y: 22 },
  { x: 52, y: 78 },
];

export function PatentNetwork() {
  const [open, setOpen] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const p = open !== null ? patents[open] : null;

  return (
    <section id="patents" className="relative overflow-hidden bg-forest py-24 md:py-36" aria-labelledby="patents-title">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow text-ivory/85">Patents &amp; innovation</p>
          <h2 id="patents-title" className="display mt-6 text-[clamp(2.4rem,4.4vw,4.2rem)] text-ivory">
            Patented.
            <br />
            <span className="font-light">Precise. Portable.</span>
          </h2>
          <p className="mt-8 max-w-[30ch] text-ivory/85">Three granted Indian patents. Three registered designs.</p>
          <a
            href="https://iprsearch.ipindia.gov.in/PublicSearch/"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 border-b border-ivory/30 pb-1 text-sm text-ivory/80 transition-colors hover:border-botanical hover:text-botanical"
          >
            Verify on IP India <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
          </a>
        </div>

        <ol className="relative space-y-8 border-l border-ivory/20 pl-8 md:hidden">
          {patents.map((pt, i) => (
            <li key={pt.id} className="relative">
              <span className="absolute -left-[39px] top-1 h-4 w-4 rounded-full border-4 border-forest bg-botanical" />
              <button type="button" onClick={() => setOpen(i)} className="text-left">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-botanical">{pt.status} · {pt.date}</span>
                <span className="mt-1 block text-lg text-ivory">{pt.title}</span>
                <span className="mt-1 block font-mono text-xs text-ivory/75">App. {pt.application}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="relative hidden aspect-[4/3] md:block lg:col-span-8">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            {[
              [0, 1],
              [1, 2],
              [2, 0],
            ].map(([a, b], i) => (
              <motion.line
                key={i}
                x1={NODES[a].x}
                y1={NODES[a].y}
                x2={NODES[b].x}
                y2={NODES[b].y}
                stroke="rgba(242,237,225,0.28)"
                strokeWidth="0.25"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.6, ease, delay: 0.3 + i * 0.25 }}
              />
            ))}
            {/* travelling pulses */}
            {[0, 1, 2].map((i) => {
              const a = NODES[i], b = NODES[(i + 1) % 3];
              return (
                <motion.circle
                  key={i}
                  r="0.6"
                  fill="#8CBF5F"
                  animate={{ cx: [a.x, b.x], cy: [a.y, b.y], opacity: [0, 1, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, delay: i * 1.1, ease: "easeInOut" }}
                />
              );
            })}
          </svg>

          {NODES.map((n, i) => {
            const pt = patents[i];
            const on = open === i || hover === i;
            const labelRight = n.x < 60;
            return (
              <div key={pt.id} className="absolute" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
                <motion.button
                  type="button"
                  onClick={() => setOpen(i)}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  aria-label={`${pt.title} — ${pt.number}`}
                  className="relative -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.2 + i * 0.2 }}
                >
                  <span className={`absolute inset-0 -m-4 rounded-full border transition-all duration-500 ${on ? "scale-100 border-botanical/70" : "scale-75 border-ivory/15"}`} />
                  <span className="absolute inset-0 -m-4 animate-ping rounded-full border border-botanical/25 [animation-duration:3s]" />
                  <span className={`block h-5 w-5 rounded-full transition-colors ${on ? "bg-botanical" : "bg-ivory"}`} />
                </motion.button>
                <div
                  className={`pointer-events-none absolute top-0 w-[min(40vw,260px)] -translate-y-1/2 ${labelRight ? "left-7" : "right-7 text-right"}`}
                >
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-botanical">{pt.status} · {pt.date}</p>
                  <p className={`mt-1 text-[15px] leading-snug transition-colors md:text-lg ${on ? "text-ivory" : "text-ivory/85"}`}>{pt.title}</p>
                  <p className="mt-1 font-mono text-xs text-ivory/75">App. {pt.application}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* minimal information drawer */}
      <AnimatePresence>
        {p && (
          <>
            <motion.div
              className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={p.title}
              className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-md flex-col bg-forest-deep px-8 py-10 text-ivory"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 220, damping: 30 }}
            >
              <button type="button" onClick={() => setOpen(null)} className="self-end rounded-full border border-ivory/20 p-2.5" aria-label="Close">
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <p className="eyebrow mt-10 text-ivory/85">{p.status}</p>
              <h3 className="display mt-5 text-4xl">{p.title}</h3>
              <dl className="mt-10 space-y-5 text-[15px]">
                {[
                  ["Patent no.", p.number],
                  ["Application", p.application],
                  ["Date", p.date],
                  ["Scope", p.note],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 border-b border-ivory/10 pb-4">
                    <dt className="text-ivory/80">{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <a
                href="https://iprsearch.ipindia.gov.in/PublicSearch/"
                target="_blank"
                rel="noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#1E7A33] py-3.5 text-sm font-semibold text-[#fff]"
              >
                Verify on IP India <ArrowUpRight className="h-4 w-4" />
              </a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 15 · FAQ, closing, contact & footer                                  */
/* ------------------------------------------------------------------ */

export function FaqContact({ onBookDemo, onQuote }: { onBookDemo: () => void; onQuote: () => void }) {
  const [open, setOpen] = useState<number | null>(0);
  const [policyModal, setPolicyModal] = useState<string | null>(null);
  return (
    <>
      <section id="faq" className="bg-forest-deep py-24 md:py-36" aria-labelledby="faq-title">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-ivory/85">Frequently asked questions</p>
            <h2 id="faq-title" className="display mt-6 text-[clamp(2.6rem,4.6vw,4.4rem)] text-ivory">
              FAQ
            </h2>
          </div>
          <ul className="lg:col-span-7 lg:col-start-6">
            {faqs.map((f, i) => {
              const on = open === i;
              return (
                <li key={f.q} className="border-t border-ivory/12 last:border-b">
                  <button
                    type="button"
                    onClick={() => setOpen(on ? null : i)}
                    aria-expanded={on}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className={`text-lg transition-colors md:text-xl ${on ? "text-ivory" : "text-ivory/75"}`}>{f.q}</span>
                    <Plus className={`h-5 w-5 shrink-0 text-botanical transition-transform duration-300 ${on ? "rotate-45" : ""}`} strokeWidth={1.5} />
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
                        <p className="max-w-[56ch] pb-7 text-[15px] leading-relaxed text-ivory/85">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
            <p className="mt-6 text-[12px] text-ivory/70">* ArkaShine validation programme with UAS Dharwad, ongoing from January 2026.</p>
          </ul>
        </div>
      </section>

      <section id="contact" className="home-keep relative overflow-hidden bg-[#12352f] pb-16 pt-20 md:pt-28" aria-labelledby="close-title">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(140,191,95,0.18),transparent_60%)]" />
        <div className="container-site relative">
          <motion.h2
            id="close-title"
            initial={{ opacity: 0, y: 40, filter: "blur(14px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, ease }}
            className="display text-[clamp(2.8rem,8.6vw,9rem)] text-ivory"
          >
            Healthy soils.
            <br />
            <span className="font-light">Brighter tomorrows.</span>
          </motion.h2>

          <div className="mt-14 flex flex-wrap items-center gap-4">
            <button type="button" onClick={onBookDemo} className="inline-flex items-center gap-2 rounded-full bg-[#1E7A33] px-7 py-4 text-sm font-semibold text-[#fff] transition-transform duration-300 hover:-translate-y-0.5">
              Book a Demo <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button type="button" onClick={onQuote} className="rounded-full border border-ivory/35 px-7 py-4 text-sm text-ivory transition-colors hover:border-ivory hover:bg-ivory hover:text-forest-deep">
              Request a Quote
            </button>
            <a href={company.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-ivory/35 px-7 py-4 text-sm text-ivory transition-colors hover:border-botanical hover:text-botanical">
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} /> WhatsApp
            </a>
            <a href={company.phoneHref} className="inline-flex items-center gap-2 rounded-full border border-ivory/35 px-7 py-4 text-sm text-ivory transition-colors hover:border-botanical hover:text-botanical">
              <Phone className="h-4 w-4" strokeWidth={1.5} /> Call +91 {company.phone}
            </a>
          </div>

          {/* Master Footer matching ArkaShine official layout */}
          <footer className="mt-28 border-t border-ivory/15 pt-14 text-[14px] text-ivory/85">
            <div className="pb-8 mb-6 border-b border-ivory/10 flex items-center justify-between">
              <div className="overflow-hidden  inline-flex items-center">
                <Image
                  src="/images/logo/arkashine-logo-blue.png"
                  alt="ArkaShine"
                  width={494}
                  height={156}
                  unoptimized
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-ivory/70 hidden sm:inline-block">
                Innovation In Agriculture
              </span>
            </div>
            {/* Top Grid: Location · Policies · Direct Contact */}
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 pb-12 border-b border-ivory/10">
              {/* Col 1: Office Location */}
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-botanical font-semibold">
                  OUR OFFICE LOCATION
                </p>
                <p className="mt-3 text-ivory/80 leading-relaxed text-sm">
                  38, 1st Main Rd, 3rd Stage, 4th Block, SBI Staff Colony, Basaveshwar Nagar, Bengaluru, Karnataka 560079, India
                </p>
              </div>

              {/* Col 2: Institutional & Legal Links */}
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-botanical font-semibold">
                  POLICIES & TERMS
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ivory/75">
                  <li>
                    <Link href="/shipping-policy" className="hover:text-botanical transition-colors text-left">Shipping Policy</Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setPolicyModal("terms")}
                      className="hover:text-botanical transition-colors text-left font-medium text-ivory/90"
                    >
                      Terms & Conditions
                    </button>
                  </li>
                  <li>
                    <Link href="/privacy-policy" className="hover:text-botanical transition-colors text-left">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/cancellation-refund-policy" className="hover:text-botanical transition-colors text-left">Cancellation & Refund Policy</Link>
                  </li>
                </ul>
              </div>

              {/* Col 3: Direct Contact */}
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-botanical font-semibold">
                  CONTACT US
                </p>
                <div className="mt-3 space-y-1.5 text-sm text-ivory/85">
                  <p>
                    <a href="tel:+919611297893" className="inline-flex items-center gap-2 hover:text-botanical transition-colors font-medium">
                      <Phone className="h-4 w-4" strokeWidth={1.6} /> Call · +91 96112 97893
                    </a>
                  </p>
                  <p>
                    <a href={company.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-botanical transition-colors font-medium">
                      <MessageCircle className="h-4 w-4" strokeWidth={1.6} /> WhatsApp · +91 96112 97893
                    </a>
                  </p>
                  <p>
                    <a href="mailto:karbari.rsudha@gmail.com" className="inline-flex items-center gap-2 hover:text-botanical transition-colors">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      karbari.rsudha@gmail.com
                    </a>
                  </p>
                  <p>
                    <a href="mailto:sudha.karbari@arkashine-innovations.com" className="inline-flex items-center gap-2 hover:text-botanical transition-colors">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      sudha.karbari@arkashine-innovations.com
                    </a>
                  </p>
                  <p className="text-xs text-ivory/80 pt-1">
                    Bengaluru, Karnataka, India · Mon–Sat 9:30 AM – 6:30 PM IST
                  </p>
                </div>
              </div>
            </div>

            {/* Middle Grid: Mission & Socials · Products · Newsletter */}
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 py-12 border-b border-ivory/10">
              {/* Col 1: About & Social */}
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-botanical font-semibold">
                  FOLLOW US
                </p>
                <p className="mt-3 text-sm text-ivory/75 leading-relaxed">
                  We are an Interdisciplinary Team of Scientists working towards providing sustainable grassroot solutions to Agri-Tech Sector.
                </p>
                {/* Social icons */}
                <div className="mt-5 flex items-center gap-3">
                  <a
                    href="https://x.com/ArkaShineInn"
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-ivory/20 bg-white/[0.04] text-ivory/80 transition-colors hover:border-botanical hover:bg-botanical hover:text-forest-deep"
                    aria-label="ArkaShine on X"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/89707450/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-ivory/20 bg-white/[0.04] text-ivory/80 transition-colors hover:border-botanical hover:bg-botanical hover:text-forest-deep"
                    aria-label="ArkaShine on LinkedIn"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a
                    href="https://www.instagram.com/arkashineinnovations"
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-ivory/20 bg-white/[0.04] text-ivory/80 transition-colors hover:border-botanical hover:bg-botanical hover:text-forest-deep"
                    aria-label="ArkaShine on Instagram"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                </div>
              </div>

              {/* Col 2: Products */}
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-botanical font-semibold">
                  OUR PRODUCTS
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ivory/80">
                  <li className="flex items-center gap-2 hover:text-botanical transition-colors cursor-pointer">
                    <span className="text-botanical">&rsaquo;</span> SoiLENZ 2.0
                  </li>
                  <li className="flex items-center gap-2 hover:text-botanical transition-colors cursor-pointer">
                    <span className="text-botanical">&rsaquo;</span> SOILIFE
                  </li>
                  <li className="flex items-center gap-2 hover:text-botanical transition-colors cursor-pointer">
                    <span className="text-botanical">&rsaquo;</span> SOILSPARSH
                  </li>
                  <li className="flex items-center gap-2 hover:text-botanical transition-colors cursor-pointer">
                    <span className="text-botanical">&rsaquo;</span> ARKASHINE-approved
                  </li>
                  <li className="flex items-center gap-2 hover:text-botanical transition-colors cursor-pointer">
                    <span className="text-botanical">&rsaquo;</span> LeafLenz
                  </li>
                  <li className="flex items-center gap-2 hover:text-botanical transition-colors cursor-pointer">
                    <span className="text-botanical">&rsaquo;</span> HarvestLenz
                  </li>
                  <li className="flex items-center gap-2 hover:text-botanical transition-colors cursor-pointer">
                    <span className="text-botanical">&rsaquo;</span> Carbon Credits
                  </li>
                </ul>
              </div>

              {/* Col 3: Newsletter */}
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-botanical font-semibold">
                  NEWSLETTER
                </p>
                <p className="mt-3 text-sm text-ivory/75">
                  Be the First to Know: Sign Up for Our Newsletter Now!
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Thank you for subscribing to ArkaShine newsletter!");
                  }}
                  className="mt-4 flex items-center overflow-hidden rounded-lg border border-ivory/20 bg-white/[0.06] focus-within:border-botanical"
                >
                  <input
                    type="email"
                    required
                    placeholder="Your Email Address"
                    className="w-full bg-transparent px-3.5 py-2.5 text-sm text-ivory placeholder-ivory/40 outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 bg-[#1E7A33] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#fff] transition-colors hover:bg-[#17642a]"
                  >
                    Sign Up
                  </button>
                </form>
              </div>
            </div>

            {/* Bottom Copyright & Legal row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 text-xs text-ivory/80">
              <p>© www.arkashine-innovations.com - All Rights Reserved · <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link></p>
              <p>Backed by DST NIDHI-EIR · Deshpande Startups, Hubli</p>
            </div>
          </footer>
        </div>
      </section>

      {/* Terms & Conditions / Policy Modal */}
      <AnimatePresence>
        {policyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPolicyModal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-xl w-full max-h-[85vh] overflow-y-auto rounded-2xl border border-white/15 bg-forest-deep p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-ivory"
            >
              {/* Close Button × */}
              <button
                type="button"
                onClick={() => setPolicyModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-ivory/80 hover:text-ivory hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              {policyModal === "terms" && (
                <div className="space-y-5">
                  <h3 className="font-display text-2xl font-semibold text-ivory">
                    Terms &amp; Conditions
                  </h3>
                  <p className="text-sm text-ivory/85 leading-relaxed">
                    By accessing or using our website and products, you agree to comply with these Terms and Conditions.
                  </p>

                  <div className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-display font-semibold text-base text-botanical">
                        Product Usage
                      </h4>
                      <ul className="mt-1.5 list-disc list-inside space-y-1 text-xs sm:text-sm text-ivory/80 leading-relaxed">
                        <li>SoiLENZ is intended for soil testing and advisory purposes only.</li>
                        <li>Results are indicative and should be used along with agronomic best practices.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-display font-semibold text-base text-botanical">
                        Pricing &amp; Payments
                      </h4>
                      <ul className="mt-1.5 list-disc list-inside space-y-1 text-xs sm:text-sm text-ivory/80 leading-relaxed">
                        <li>All prices are in INR and exclusive of applicable taxes unless stated otherwise.</li>
                        <li>Full payment must be made before dispatch.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-display font-semibold text-base text-botanical">
                        Intellectual Property
                      </h4>
                      <ul className="mt-1.5 list-disc list-inside space-y-1 text-xs sm:text-sm text-ivory/80 leading-relaxed">
                        <li>All content, designs, software, and algorithms are the property of ArkaShine Innovations Pvt. Ltd.</li>
                        <li>Unauthorized reproduction or usage is prohibited.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-display font-semibold text-base text-botanical">
                        Limitation of Liability
                      </h4>
                      <ul className="mt-1.5 list-disc list-inside space-y-1 text-xs sm:text-sm text-ivory/80 leading-relaxed">
                        <li>We are not responsible for crop loss or decisions made solely on SoiLENZ results.</li>
                        <li>Liability, if any, is limited to the product value paid.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {policyModal === "shipping" && (
                <div className="space-y-4">
                  <h3 className="font-display text-2xl font-semibold text-ivory">Shipping Policy</h3>
                  <p className="text-sm text-ivory/80 leading-relaxed">
                    Standard dispatch timelines are 3–7 business days upon order confirmation and full payment. Shipments are packaged in industrial-grade protective cases with tracking provided via SMS and email.
                  </p>
                </div>
              )}

              {policyModal === "privacy" && (
                <div className="space-y-4">
                  <h3 className="font-display text-2xl font-semibold text-ivory">Privacy Policy</h3>
                  <p className="text-sm text-ivory/80 leading-relaxed">
                    ArkaShine Innovations respects farmer and organizational data privacy. Field diagnostic readings are encrypted and strictly confidential, used solely for authorized Soil Health Card generation and agronomic advisory.
                  </p>
                </div>
              )}

              {policyModal === "cancellation" && (
                <div className="space-y-4">
                  <h3 className="font-display text-2xl font-semibold text-ivory">Cancellation &amp; Refund Policy</h3>
                  <p className="text-sm text-ivory/80 leading-relaxed">
                    Orders can be cancelled before dispatch with full refund. Hardware units come with manufacturer warranty against technical defects.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
