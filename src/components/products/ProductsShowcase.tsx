"use client";

/**
 * Products page: the two devices available today, each as a feature panel,
 * then the upcoming products on a dark-green "coming soon" band.
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Bluetooth, Clock, Droplets, FlaskConical, Microscope, Printer, Sparkles, Timer, Waves } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EnquiryButton } from "@/components/site/EnquiryButton";
import { ContactStrip } from "@/components/site/ContactStrip";

const ease = [0.22, 1, 0.36, 1] as const;

const HERO_SLIDES = [
  { src: "/images/products/soillenz-2-studio.webp", name: "SoiLenz 2.0", tag: "Available now" },
  { src: "/images/products/ph-ec-bottle.webp", name: "pH / EC Bottle", tag: "Available now" },
  { src: "/images/products/universal-extractant-acidic-nobg.webp", name: "Universal Extractant – Acidic Soils", tag: "Available now" },
  { src: "/images/products/universal-extractant-alkaline-nobg.webp", name: "Universal Extractant – Alkaline Soils", tag: "Available now" },
  { src: "/images/products/soil-sparsh.webp", name: "Soil Sparsh", tag: "Coming soon" },
];

type Spec = { icon: LucideIcon; k: string; v: string };

const AVAILABLE: {
  id: string;
  no: string;
  name: string;
  line: string;
  body: string;
  img: string;
  specs: Spec[];
  chipsTitle: string;
  chips: string[];
}[] = [
  {
    id: "soillenz",
    no: "01",
    name: "SoiLenz 2.0",
    line: "A laboratory, built into one device.",
    body: "A portable soil lab that completes the full analysis in 15 minutes, giving 14 parameters from a single 5 g sample. It prints the report on the spot and syncs it to the Soil Partner app.",
    img: "/images/products/soillenz-2-studio.webp",
    specs: [
      { icon: Clock, k: "Full analysis", v: "15 min · 14 parameters" },
      { icon: FlaskConical, k: "Sample", v: "5 g soil + 40 ml extractant" },
      { icon: Timer, k: "Mixing", v: "60 s automated" },
      { icon: Clock, k: "Filtering", v: "~5 min in-device" },
      { icon: Printer, k: "Report", v: "Built-in thermal printer" },
      { icon: Bluetooth, k: "App", v: "Bluetooth to Soil Partner app" },
      { icon: Waves, k: "Coverage", v: "Every Soil Health Card parameter + Ca, Mg" },
    ],
    chipsTitle: "14 parameters",
    chips: ["pH", "EC", "OC", "N", "P", "K", "Ca", "Mg", "S", "Fe", "Mn", "Cu", "Zn", "B"],
  },
  {
    id: "ph-ec",
    no: "02",
    name: "pH / EC Bottle",
    line: "Soil chemistry in 60 seconds.",
    body: "A sealed bottle with an electrode probe that reads soil pH and electrical conductivity. It works alongside SoiLenz 2.0, which reads the other 12 parameters.",
    img: "/images/products/ph-ec-bottle.webp",
    specs: [
      { icon: FlaskConical, k: "Sample", v: "5 g soil + 50 ml extractant" },
      { icon: Timer, k: "Mixing", v: "60 s" },
      { icon: Droplets, k: "Reads", v: "Soil pH and EC" },
      { icon: Sparkles, k: "Works with", v: "SoiLenz 2.0" },
    ],
    chipsTitle: "Measures",
    chips: ["pH", "Electrical conductivity"],
  },
  {
    id: "extractant-acidic",
    no: "03",
    name: "Universal Extractant – Acidic Soils",
    line: "For efficient extraction of soil nutrients and parameters.",
    body: "A pre-measured reagent packet designed for use with SoiLenz 2.0 on acidic soils. Each pack contains 20 tests worth of extractant. ArkaShine Soil Health Solutions.",
    img: "/images/products/universal-extractant-acidic-nobg.webp",
    specs: [
      { icon: FlaskConical, k: "Soil type", v: "For Acidic Soils" },
      { icon: Timer, k: "Tests per pack", v: "20 tests" },
      { icon: Sparkles, k: "Works with", v: "SoiLenz 2.0" },
      { icon: Waves, k: "Purpose", v: "Soil nutrient and parameter extraction" },
    ],
    chipsTitle: "Details",
    chips: ["Acidic Soils", "20 Tests", "Soil Health Solutions"],
  },
  {
    id: "extractant-alkaline",
    no: "04",
    name: "Universal Extractant – Alkaline Soils",
    line: "Reagents 1 & 2 — for alkaline soil conditions.",
    body: "A pre-measured dual-reagent packet (Reagents 1 & 2) designed for use with SoiLenz 2.0 on alkaline soils. Each pack covers 20 tests. ArkaShine Soil Health Solutions.",
    img: "/images/products/universal-extractant-alkaline-nobg.webp",
    specs: [
      { icon: FlaskConical, k: "Soil type", v: "For Alkaline Soils" },
      { icon: Timer, k: "Tests per pack", v: "20 tests" },
      { icon: Sparkles, k: "Works with", v: "SoiLenz 2.0" },
      { icon: Waves, k: "Contents", v: "Reagents 1 & 2" },
    ],
    chipsTitle: "Details",
    chips: ["Alkaline Soils", "Reagents 1 & 2", "20 Tests", "Soil Health Solutions"],
  },
];

const UPCOMING: { name: string; line: string; tags: string[]; img?: string; icon: LucideIcon; tint: string }[] = [
  {
    name: "Soil Sparsh",
    line: "A plug-in field probe that shows soil moisture, soil temperature, air temperature and sunlight at a glance.",
    tags: ["Moisture", "Soil temp", "Air temp", "Light"],
    img: "/images/products/soil-sparsh.webp",
    icon: Sparkles,
    tint: "#f59e0b",
  },
  {
    name: "Soil Life",
    line: "Insight into the living side of soil — biology, microbial activity and organic matter health.",
    tags: ["Soil biology"],
    icon: Microscope,
    tint: "#a78bfa",
  },
  {
    name: "Water Testing Device",
    line: "Quick quality checks for irrigation and drinking water in the field.",
    tags: ["Water quality"],
    icon: Droplets,
    tint: "#38bdf8",
  },
];

function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % HERO_SLIDES.length), 3800);
    return () => clearInterval(t);
  }, []);
  const s = HERO_SLIDES[i];
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[620px]">
      {/* stacked cards behind */}
      {[2, 1].map((k) => (
        <div
          key={k}
          aria-hidden
          className="absolute inset-0 rounded-[28px] border border-[#162a54]/10 bg-[#fff] shadow-sm"
          style={{ transform: `translate(${k * 14}px, ${k * -14}px) rotate(${k * 2}deg)`, opacity: 1 - k * 0.25 }}
        />
      ))}
      <div
        className={`absolute inset-0 overflow-hidden rounded-[28px] transition-colors duration-500 shadow-[0_40px_80px_-40px_rgba(22,42,84,0.6)] ${
          s.src.includes("universal-extractant") ? "bg-white border border-slate-200" : "bg-[#0b2a28]"
        }`}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={s.src}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 1.08, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.96, x: -40 }}
            transition={{ duration: 0.8, ease }}
          >
            <Image
              src={s.src}
              alt={s.name}
              fill
              priority
              sizes="(min-width:1024px) 620px, 100vw"
              className={s.src.includes("universal-extractant") ? "object-contain p-6 sm:p-8" : "object-cover"}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5">
          <AnimatePresence mode="wait">
            <motion.div key={s.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#a7d48a]">{s.tag}</p>
              <p className="font-display text-2xl font-bold text-[#fff]">{s.name}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-1.5">
            {HERO_SLIDES.map((h, k) => (
              <button
                key={h.name}
                type="button"
                onClick={() => setI(k)}
                aria-label={`Show ${h.name}`}
                className={`h-2 rounded-full transition-all ${k === i ? "w-6 bg-[#fff]" : "w-2 bg-[#fff]/50"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductsShowcase() {
  return (
    <div className="min-h-screen bg-[#fbf7ee] text-[#162a54]">
      <header className="sticky top-0 z-50 border-b border-[#162a54]/10 bg-[#fbf7ee]/90 backdrop-blur-md">
        <div className="container-site flex h-16 items-center justify-between sm:h-20">
          <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="Back to ArkaShine home">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <Image src="/images/logo/arkashine-logo-bold-transparent.png" alt="ArkaShine" width={494} height={156} unoptimized priority className="h-8 w-auto" />
          </Link>
          <EnquiryButton
            kind="partner"
            audience="general"
            className="rounded-full bg-[#1E7A33] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#fff] transition-transform hover:scale-105 hover:bg-[#17642a]"
          >
            Request a quote
          </EnquiryButton>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute -right-32 top-0 h-[460px] w-[460px] rounded-full bg-[#cfe8b4]/60 blur-[120px]" />
        <div className="container-site relative grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#1E7A33]">
              Our products
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease }}
              className="display mt-4 text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.98]"
            >
              Made in India.
              <br />
              <span className="font-light">Built for every field.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5 max-w-[46ch] text-lg text-[#3f4f6b]">
              ArkaShine designs and manufactures soil intelligence devices. Two are in the field today, and more are on the way.
            </motion.p>
            <div className="mt-7 flex flex-wrap gap-2">
              {[
                { t: "4 available now", on: true },
                { t: "3 coming soon", on: false },
                { t: "4 granted patents", on: false },
              ].map((c, k) => (
                <motion.span
                  key={c.t}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + k * 0.1, type: "spring", stiffness: 260, damping: 16 }}
                  className={`rounded-full px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.12em] ${c.on ? "bg-[#1E7A33] text-[#fff]" : "border border-[#162a54]/15 bg-[#fff] text-[#162a54]"}`}
                >
                  {c.t}
                </motion.span>
              ))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.9, ease }} className="lg:col-span-6">
            <HeroCarousel />
          </motion.div>
        </div>
      </section>

      {/* available now */}
      <section className="bg-[#fff] py-16 sm:py-24" aria-label="Available now">
        <div className="container-site space-y-20 sm:space-y-28">
          {AVAILABLE.map((p, idx) => {
            const isExtractant = p.id.startsWith("extractant");
            const cardBg = isExtractant ? "bg-white border border-slate-200" : "bg-[#0b2a28]";
            return (
              <div key={p.id} id={p.id} className="grid scroll-mt-24 items-center gap-10 lg:grid-cols-12 lg:gap-14">
                <motion.div
                  className={`lg:col-span-7 ${idx % 2 ? "lg:order-2" : ""}`}
                  initial={{ opacity: 0, x: idx % 2 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, ease }}
                >
                  <div className={`group relative overflow-hidden rounded-[28px] ${cardBg} shadow-[0_40px_90px_-40px_rgba(19,32,27,0.6)]`}>
                    <div className={`relative ${isExtractant ? "aspect-[4/3] sm:aspect-[16/10] p-4 sm:p-6 flex items-center justify-center" : "aspect-[16/9]"}`}>
                      <Image
                        src={p.img}
                        alt={p.name}
                        fill
                        sizes="(min-width:1024px) 720px, 100vw"
                        className={`${isExtractant ? "object-contain p-3 sm:p-5" : "object-cover"} transition-transform duration-[1.6s] ease-out group-hover:scale-[1.04]`}
                      />
                    </div>
                    <motion.span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      initial={{ left: "-30%" }}
                      animate={{ left: ["-30%", "130%"] }}
                      transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 4 + idx, ease: "easeInOut" }}
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-[#1E7A33] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#fff]">Available now</span>
                  </div>
                </motion.div>

              <div className="lg:col-span-5">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#1E7A33]">Product {p.no}</p>
                <h2 className="display mt-3 text-[clamp(2.2rem,4vw,3.6rem)] leading-none">{p.name}</h2>
                <p className="mt-3 text-xl font-light">{p.line}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-[#3f4f6b]">{p.body}</p>

                <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {p.specs.map((s, k) => {
                    const Icon = s.icon;
                    return (
                      <motion.div
                        key={s.k}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: k * 0.06, duration: 0.5, ease }}
                        className="flex items-start gap-3 rounded-2xl border border-[#162a54]/10 bg-[#fbf7ee] p-3"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1E7A33] text-[#fff]">
                          <Icon className="h-4 w-4" strokeWidth={1.8} />
                        </span>
                        <span>
                          <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#5b6575]">{s.k}</span>
                          <span className="block text-sm font-semibold">{s.v}</span>
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                <p className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#5b6575]">{p.chipsTitle}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.chips.map((c, k) => (
                    <motion.span
                      key={c}
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + k * 0.04, type: "spring", stiffness: 300, damping: 15 }}
                      className="rounded-lg border border-[#1E7A33]/25 bg-[#eaf5dc] px-2.5 py-1 font-mono text-xs font-bold text-[#162a54]"
                    >
                      {c}
                    </motion.span>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <EnquiryButton
                    kind="partner"
                    audience="general"
                    className="inline-flex items-center gap-2 rounded-full bg-[#1E7A33] px-6 py-3 text-sm font-semibold text-[#fff] transition-transform hover:-translate-y-0.5 hover:bg-[#17642a]"
                  >
                    Request a quote <ArrowRight className="h-4 w-4" />
                  </EnquiryButton>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </section>

      {/* coming soon */}
      <section className="relative overflow-hidden bg-[#12352f] py-20 text-[#fff] sm:py-28" aria-labelledby="upcoming-title">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(140,191,95,0.2),transparent_55%)]" />
        <div className="container-site relative">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#a7d48a]">Coming soon</p>
          <h2 id="upcoming-title" className="display mt-3 text-[clamp(2.2rem,4.4vw,4rem)] leading-none">
            What&rsquo;s next from ArkaShine.
          </h2>

          <div className="relative mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* connecting line */}
            <motion.span
              aria-hidden
              className="absolute left-[8%] right-[8%] top-[118px] hidden h-px origin-left bg-gradient-to-r from-[#f59e0b] via-[#a78bfa] to-[#38bdf8] md:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease }}
            />
            {UPCOMING.map((u, k) => {
              const Icon = u.icon;
              return (
                <motion.article
                  key={u.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 120, damping: 16, delay: k * 0.12 }}
                  className="relative flex flex-col overflow-hidden rounded-[26px] border border-white/15 bg-white/[0.06] backdrop-blur-sm"
                >
                  <div className="relative aspect-[4/3] overflow-hidden" style={{ background: `radial-gradient(circle at 50% 40%, ${u.tint}33, transparent 70%)` }}>
                    {u.img ? (
                      <Image src={u.img} alt={`${u.name} (coming soon)`} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover object-[50%_40%]" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <motion.span
                          className="flex h-20 w-20 items-center justify-center rounded-3xl text-[#fff] shadow-lg"
                          style={{ background: `linear-gradient(135deg, ${u.tint}, ${u.tint}99)` }}
                          animate={{ y: [0, -8, 0], rotate: [0, -4, 0] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Icon className="h-9 w-9" strokeWidth={1.5} />
                        </motion.span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#fff]/75">Photo coming soon</span>
                      </div>
                    )}
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#fff] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#162a54]">
                      <Sparkles className="h-3 w-3 text-[#b45309]" /> Upcoming
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-2xl font-bold">{u.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[#fff]/80">{u.line}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {u.tags.map((t) => (
                        <span key={t} className="rounded-full border border-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-[#fff]/90">
                          {t}
                        </span>
                      ))}
                    </div>
                    <EnquiryButton
                      kind="message"
                      audience="general"
                      className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#fff] px-5 py-2.5 text-sm font-semibold text-[#162a54] transition-transform hover:-translate-y-0.5"
                    >
                      Notify me <ArrowRight className="h-4 w-4" />
                    </EnquiryButton>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <ContactStrip />
    </div>
  );
}
