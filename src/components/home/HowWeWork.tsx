"use client";

/**
 * "How we work" — the ArkaShine story told as a farmer's journey, between the
 * hero video and the SoiLenz 2.0 section.
 *   01 TerraMap reads the land's history → 02 SoiLenz + pH/EC test the soil
 *   → 03 instant ticket + AI advisory report → 04 GeoLenz turns ticket values
 *   into nutrient maps → 05 book a slot → 06 soil amendment playbook
 * Desktop: a pinned, full-screen photo story; each scroll step is one chapter,
 * with a floating card that shows what ArkaShine does at that step.
 * Mobile: the chapters stack as photo cards.
 * Photos: /public/images/journey (Unsplash License, see PHOTO_CREDITS.md).
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, CalendarCheck, Check, FlaskConical, Layers, Receipt, Satellite, Sprout } from "lucide-react";
import { SatTiles } from "@/components/satellite/SatTiles";
import { BENGALURU } from "@/components/satellite/fieldLocation";

const ease = [0.22, 1, 0.36, 1] as const;

const CHAPTERS = [
  {
    no: "01",
    icon: Satellite,
    label: "TerraMap",
    photo: "/images/journey/02-land.webp",
    alt: "Aerial view of green farm fields and water channels in India",
    focus: "50% 50%",
    title: "We study the land's history.",
    story: "TerraMap reads years of satellite history: past crops, land use and weak zones. We know the field before we touch the soil.",
    proof: "geo",
  },
  {
    no: "02",
    icon: FlaskConical,
    label: "Soil test",
    photo: "/images/journey/02-farmer-soil-sample.webp",
    alt: "A farmer kneeling in his field, collecting a soil sample into a bag",
    focus: "65% 40%",
    title: "Soil tested on the farm.",
    story: "SoiLenz 2.0 completes the full analysis in 15 minutes: 14 parameters, right there in the village.",
    proof: "test",
  },
  {
    no: "03",
    icon: Receipt,
    label: "Ticket + report",
    photo: "/images/journey/03-farmer-with-ticket.webp",
    alt: "A farmer in Odisha holding his printed SoiLenz soil ticket next to the device",
    focus: "50% 22%",
    title: "Instant ticket. AI advisory report.",
    story: "A printed soil ticket in the farmer's hand at once, then an AI-generated advisory report on soil quality and the best crops to grow.",
    proof: "report",
  },
  {
    no: "04",
    icon: Layers,
    label: "GeoLenz",
    photo: "/images/field-wide.webp",
    alt: "Wide view of farm fields that GeoLenz maps zone by zone",
    focus: "50% 50%",
    title: "Tickets become nutrient maps.",
    story: "Every ticket's values go into GeoLenz. It maps N, P, K, pH and organic matter across the whole field, zone by zone.",
    proof: "geolenz",
  },
  {
    no: "05",
    icon: CalendarCheck,
    label: "Consult",
    photo: "/images/journey/01-book.webp",
    alt: "A farmer on a call with the ArkaShine team",
    focus: "50% 30%",
    title: "Speak with our team.",
    story: "Book a slot for a detailed, customised session. Together we plan your crop cycle for the seasons ahead.",
    proof: "book",
  },
  {
    no: "06",
    icon: Sprout,
    label: "Playbook",
    photo: "/images/journey/05-farmer-harvest.webp",
    alt: "A smiling woman farmer holding a healthy paddy harvest",
    focus: "35% 30%",
    title: "Soil Amendment Playbook.",
    story: "A week-by-week plan to rebuild the soil, so every crop grows stronger than the last.",
    proof: "playbook",
  },
] as const;

type Proof = (typeof CHAPTERS)[number]["proof"];

/* ------------------------------------------------------------------ */

export function HowWeWork({ onBookSlot }: { onBookSlot: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 });
  const bar = useTransform(smooth, [0, 1], [0.02, 1]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(CHAPTERS.length - 1, Math.max(0, Math.floor(v * CHAPTERS.length)))));
  const ch = CHAPTERS[active];

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (el.offsetHeight - window.innerHeight) * ((i + 0.5) / CHAPTERS.length), behavior: "smooth" });
  };

  return (
    <>
      {/* ---------------- desktop: pinned photo story ---------------- */}
      <section ref={ref} id="how-we-work" aria-labelledby="hww-title" className="home-keep relative hidden bg-[#06201e] lg:block" style={{ height: `${CHAPTERS.length * 90 + 30}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* full-bleed photos: all preloaded, the active one fades in with a slow push-in */}
          {CHAPTERS.map((c, i) => (
            <motion.div
              key={c.photo}
              aria-hidden={i !== active}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: i === active ? 1 : 0, scale: reduce ? 1.04 : i === active ? 1.02 : 1.12 }}
              transition={{ opacity: { duration: 0.9, ease }, scale: { duration: i === active ? 6 : 0.9, ease: "easeOut" } }}
            >
              <Image src={c.photo} alt={i === active ? c.alt : ""} fill priority={i < 2} loading={i < 2 ? undefined : "eager"} sizes="100vw" className="object-cover" style={{ objectPosition: c.focus }} />
            </motion.div>
          ))}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#041512]/90 via-[#041512]/55 to-[#041512]/10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#041512]/80 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#041512]/70 to-transparent" />

          {/* header + journey bar */}
          <div className="container-site relative z-10 pt-24">
            <div className="flex items-end justify-between gap-8">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#a7d48a]">Our story · How we work</p>
                <h2 id="hww-title" className="mt-2 font-display text-3xl font-bold tracking-tight text-[#fff] xl:text-4xl">
                  From the land&rsquo;s history <span className="font-light text-[#fff]/85">to a better harvest.</span>
                </h2>
              </div>
              <button type="button" onClick={onBookSlot} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#1E7A33] px-5 py-3 text-sm font-semibold text-[#fff] shadow-lg transition-transform duration-300 hover:-translate-y-0.5">
                Book a slot <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="relative mt-8">
              <div className="absolute left-5 right-5 top-5 h-[2px] rounded-full bg-[#fff]/15" />
              <motion.div className="absolute left-5 right-5 top-5 h-[2px] origin-left rounded-full bg-[#8CBF5F]" style={{ scaleX: bar }} />
              <ol className="relative flex justify-between">
                {CHAPTERS.map((c, i) => {
                  const on = i === active;
                  const done = i < active;
                  const Icon = c.icon;
                  return (
                    <li key={c.no}>
                      <button type="button" onClick={() => jump(i)} className="group flex flex-col items-center gap-2" aria-current={on ? "step" : undefined}>
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                            on ? "scale-110 border-[#8CBF5F] bg-[#8CBF5F] text-[#06201e] shadow-[0_0_0_8px_rgba(140,191,95,0.22)]" : done ? "border-[#8CBF5F] bg-[#06201e] text-[#8CBF5F]" : "border-[#fff]/30 bg-[#06201e]/80 text-[#fff]/70 group-hover:border-[#fff]/60"
                          }`}
                        >
                          {done ? <Check className="h-4 w-4" strokeWidth={3} /> : <Icon className="h-4 w-4" strokeWidth={1.8} />}
                        </span>
                        <span className={`font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${on ? "text-[#fff]" : "text-[#fff]/60"}`}>
                          {c.no} · {c.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* chapter text + proof card */}
          <div className="container-site absolute inset-x-0 bottom-0 z-10 grid grid-cols-12 items-end gap-8 pb-10">
            <div className="col-span-6">
              <AnimatePresence mode="wait">
                <motion.div key={ch.no} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.55, ease }}>
                  <span className="block font-display text-[clamp(3.5rem,7vh,5rem)] font-bold leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(167,212,138,0.8)]">{ch.no}</span>
                  <h3 className="mt-2 font-display text-[clamp(1.9rem,2.9vw,2.75rem)] font-bold leading-[1.05] tracking-tight text-[#fff] [text-wrap:balance]">{ch.title}</h3>
                  <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-[#fff]/85">{ch.story}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="col-span-6 flex justify-end">
              <AnimatePresence mode="wait">
                <motion.div
                  key={ch.proof}
                  initial={{ opacity: 0, y: 40, rotate: 2, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 160, damping: 20 }}
                  className="w-full max-w-[420px]"
                >
                  <ProofCard kind={ch.proof} onBookSlot={onBookSlot} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- mobile / tablet: stacked chapters ---------------- */}
      <section id="how-we-work-mobile" aria-labelledby="hww-title-m" className="home-keep bg-[#06201e] py-14 lg:hidden">
        <div className="container-site">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#a7d48a]">Our story · How we work</p>
          <h2 id="hww-title-m" className="mt-2 font-display text-[clamp(1.9rem,7vw,2.6rem)] font-bold leading-tight text-[#fff]">
            From the land&rsquo;s history <span className="font-light text-[#fff]/85">to a better harvest.</span>
          </h2>
          <ol className="mt-8 space-y-10">
            {CHAPTERS.map((c) => (
              <motion.li key={c.no} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease }}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[16/11]">
                  <Image src={c.photo} alt={c.alt} fill sizes="100vw" className="object-cover" style={{ objectPosition: c.focus }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041512]/95 via-[#041512]/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="block font-display text-6xl font-bold leading-none text-transparent [-webkit-text-stroke:1.2px_rgba(167,212,138,0.85)]">{c.no}</span>
                    <h3 className="mt-1 font-display text-2xl font-bold leading-tight text-[#fff]">{c.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#fff]/85">{c.story}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <ProofCard kind={c.proof} onBookSlot={onBookSlot} />
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* proof cards: what ArkaShine actually does at each step              */
/* ------------------------------------------------------------------ */

function CardShell({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#fff]/15 bg-[#0b2a26]/85 p-4 text-[#fff] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#a7d48a]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#8CBF5F]" /> {tag}
      </p>
      {children}
    </div>
  );
}

function ProofCard({ kind, onBookSlot }: { kind: Proof; onBookSlot: () => void }) {
  if (kind === "book") return <BookCard onBookSlot={onBookSlot} />;
  if (kind === "geo") return <GeoCard />;
  if (kind === "geolenz") return <GeoLenzCard />;
  if (kind === "test") return <TestCard />;
  if (kind === "report") return <ReportCard />;
  return <PlaybookCard />;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SLOTS = ["10:00 AM", "12:00 PM", "3:00 PM", "5:00 PM"];
const SEASONS = [
  { k: "Kharif", m: "Jun–Oct" },
  { k: "Rabi", m: "Nov–Mar" },
  { k: "Zaid", m: "Mar–Jun" },
];

function BookCard({ onBookSlot }: { onBookSlot: () => void }) {
  const [season, setSeason] = useState(0);
  const [d, setD] = useState(1);
  const [s, setS] = useState(0);
  return (
    <CardShell tag="Customised consultation">
      <p className="text-sm text-[#fff]/85">Plan your crop cycle with our agronomy team.</p>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {SEASONS.map((x, i) => (
          <button key={x.k} type="button" onClick={() => setSeason(i)} className={`rounded-xl border px-2 py-2 text-left transition-colors ${season === i ? "border-[#8CBF5F] bg-[#8CBF5F]/15" : "border-[#fff]/15 hover:border-[#fff]/35"}`}>
            <span className={`block text-[12px] font-semibold ${season === i ? "text-[#d9f99d]" : "text-[#fff]/85"}`}>{x.k}</span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.1em] text-[#fff]/60">{x.m}</span>
          </button>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-6 gap-1.5">
        {DAYS.map((x, i) => (
          <button key={x} type="button" onClick={() => setD(i)} className={`rounded-lg py-1.5 text-[11px] font-semibold transition-colors ${d === i ? "bg-[#8CBF5F] text-[#06201e]" : "bg-[#fff]/10 text-[#fff]/85 hover:bg-[#fff]/20"}`}>
            {x}
          </button>
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-4 gap-1.5">
        {SLOTS.map((x, i) => (
          <button key={x} type="button" onClick={() => setS(i)} className={`rounded-lg border py-1.5 text-[11px] transition-colors ${s === i ? "border-[#8CBF5F] bg-[#8CBF5F]/15 font-semibold text-[#d9f99d]" : "border-[#fff]/15 text-[#fff]/80 hover:border-[#fff]/35"}`}>
            {x}
          </button>
        ))}
      </div>
      <button type="button" onClick={onBookSlot} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E7A33] py-3 text-sm font-semibold text-[#fff] transition-colors hover:bg-[#17642a]">
        Book {SEASONS[season].k} plan · {DAYS[d]} {SLOTS[s]} <ArrowRight className="h-4 w-4" />
      </button>
    </CardShell>
  );
}

const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
const ZONES = [
  { x: 10, y: 14, w: 36, h: 34, c: "rgba(140,191,95,0.5)" },
  { x: 52, y: 10, w: 38, h: 36, c: "rgba(232,161,58,0.5)" },
  { x: 14, y: 54, w: 34, h: 34, c: "rgba(94,234,212,0.42)" },
  { x: 54, y: 52, w: 34, h: 36, c: "rgba(194,65,12,0.42)" },
];

function GeoCard() {
  const reduce = useReducedMotion();
  const [y, setY] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => setY((v) => (v + 1) % YEARS.length), 900);
    return () => window.clearInterval(t);
  }, [reduce]);
  return (
    <CardShell tag="TerraMap · land history">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
        <SatTiles lat={BENGALURU.lat} lon={BENGALURU.lon} zoom={16} span={5} />
        {ZONES.map((z, i) => (
          <motion.div
            key={i}
            className="absolute rounded-md border border-[#fff]/70"
            style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%`, background: z.c }}
            animate={{ opacity: (y + i) % 3 === 0 ? 0.35 : 0.9 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-[#fff]/75">
        <span>Crops · land use · weak zones</span>
        <span className="text-[#d9f99d]">{YEARS[y]}</span>
      </div>
      <div className="mt-1.5 flex gap-1">
        {YEARS.map((yr, i) => (
          <span key={yr} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= y ? "bg-[#8CBF5F]" : "bg-[#fff]/15"}`} />
        ))}
      </div>
    </CardShell>
  );
}

const READINGS = [
  { k: "pH", v: "6.8", u: "" },
  { k: "EC", v: "0.4", u: "dS/m" },
  { k: "N", v: "279", u: "kg/ha" },
];
const MORE = ["OC", "P", "K", "Ca", "Mg", "S", "Fe", "Mn", "Cu", "Zn", "B"];

function TestCard() {
  const devices = [
    { src: "/images/products/soillenz-2-studio.webp", name: "SoiLenz 2.0", what: "12 nutrients", pos: "50% 50%" },
    { src: "/images/products/ph-ec-bottle.webp", name: "pH/EC bottle", what: "pH & EC", pos: "48% 45%" },
  ];
  return (
    <CardShell tag="15-minute analysis · 14 parameters">
      <div className="grid grid-cols-2 gap-2">
        {devices.map((dv, i) => (
          <motion.div
            key={dv.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.15, type: "spring", stiffness: 240, damping: 20 }}
            className="overflow-hidden rounded-2xl border border-[#fff]/10 bg-[#06201e]"
          >
            <div className="relative aspect-[5/4]">
              <Image src={dv.src} alt={dv.name} fill sizes="200px" className="object-cover" style={{ objectPosition: dv.pos }} />
            </div>
            <div className="px-2.5 py-1.5">
              <p className="text-[12px] font-semibold text-[#fff]">{dv.name}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#a7d48a]">{dv.what}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {READINGS.map((r, i) => (
          <motion.div
            key={r.k}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 + i * 0.1, type: "spring", stiffness: 260, damping: 18 }}
            className="rounded-xl bg-[#fff]/10 px-2.5 py-1.5"
          >
            <span className="block font-mono text-[10px] text-[#fff]/70">{r.k}</span>
            <span className="font-mono text-sm font-bold text-[#d9f99d]">
              {r.v}
              {r.u && <span className="ml-1 text-[9px] font-normal text-[#fff]/60">{r.u}</span>}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {MORE.map((m, i) => (
          <motion.span
            key={m}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + i * 0.04 }}
            className="rounded-full border border-[#fff]/20 px-2 py-0.5 font-mono text-[10px] text-[#fff]/85"
          >
            {m}
          </motion.span>
        ))}
      </div>
    </CardShell>
  );
}

const PAGES = ["Soil health score", "14-parameter results", "Field grid heatmaps", "Fertiliser plan", "Crop suitability", "Dose per crop", "Organic & natural inputs", "Carbon impact"];

// Same layout as the real SoiLENZ thermal ticket. Values are a sample reading;
// the farmer's name and mobile are never shown on the website.
const TICKET = [
  { k: "OC", r: "0.5-0.75%", v: "0.7", l: "MED" },
  { k: "N", r: "280-560kg/ha", v: "236.7", l: "LOW" },
  { k: "P", r: "22.9-56.3kg/ha", v: "76.6", l: "HIGH" },
  { k: "K", r: "144-336kg/ha", v: "279.7", l: "MED" },
  { k: "Ca", r: "1.5-5.0meq", v: "4.0", l: "MED" },
  { k: "Mg", r: "1.0-3.0meq", v: "0.7", l: "LOW" },
  { k: "S", r: "10-20ppm", v: "13.8", l: "MED" },
  { k: "Fe", r: "4.5-10ppm", v: "21.7", l: "HIGH" },
  { k: "Mn", r: "2.0-4.0ppm", v: "14.4", l: "HIGH" },
  { k: "Cu", r: "0.2-0.4ppm", v: "2.1", l: "HIGH" },
  { k: "Zn", r: "0.6-1.2ppm", v: "0.8", l: "MED" },
  { k: "B", r: "0.5-1ppm", v: "6.0", l: "HIGH" },
] as const;
const LEVEL_COLOR = { LOW: "text-[#C2410C]", MED: "text-[#1E7A33]", HIGH: "text-[#B45309]" } as const;

const TEAR =
  "polygon(0 0,100% 0,100% calc(100% - 8px),92% 100%,84% calc(100% - 8px),76% 100%,68% calc(100% - 8px),60% 100%,52% calc(100% - 8px),44% 100%,36% calc(100% - 8px),28% 100%,20% calc(100% - 8px),12% 100%,4% calc(100% - 8px),0 100%)";

function ReportCard() {
  const reduce = useReducedMotion();
  const [p, setP] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => setP((v) => (v + 1) % PAGES.length), 1600);
    return () => window.clearInterval(t);
  }, [reduce]);
  return (
    <CardShell tag="Instant ticket + AI advisory report · sample">
      <div className="flex items-stretch gap-3">
        {/* the instant printed ticket — same format as the real SoiLENZ print */}
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.4, ease: "linear" }}
          className="w-[54%] shrink-0"
        >
          <div className="rounded-t-sm bg-[#fbfaf5] px-2.5 pb-4 pt-2.5 font-mono text-[#1d2a24] shadow-xl" style={{ clipPath: TEAR }}>
            <p className="text-center text-[9px] font-bold leading-tight">ARKASHINE INNOVATIONS</p>
            <p className="text-center text-[9px] leading-tight">Pvt Ltd · SoiLENZ</p>
            <div className="my-1.5 border-t border-dashed border-[#1d2a24]/35" />
            <p className="flex justify-between text-[8.5px]"><span>21-11-2026</span><span>10:30AM</span></p>
            <p className="text-[8.5px]">Farmer: Sample</p>
            <div className="my-1.5 border-t border-dashed border-[#1d2a24]/35" />
            {TICKET.map((t) => (
              <p key={t.k} className="flex justify-between gap-1 text-[8.5px] leading-[14px]">
                <span className="truncate">{t.k}({t.r}):</span>
                <span className="shrink-0">
                  {t.v}-<span className={`font-bold ${LEVEL_COLOR[t.l]}`}>{t.l}</span>
                </span>
              </p>
            ))}
            <div className="my-1.5 border-t border-dashed border-[#1d2a24]/35" />
            <p className="flex justify-between text-[8.5px] leading-[14px]"><span>pH (6.5-7.3):</span><span>6.8</span></p>
            <p className="flex justify-between text-[8.5px] leading-[14px]"><span>EC (0.8-1.6 dS/m):</span><span>0.4</span></p>
            <div className="my-1.5 border-t border-dashed border-[#1d2a24]/35" />
            <p className="text-center text-[8px] leading-tight">This is for your information</p>
            <p className="text-center text-[8px] leading-tight">Toll free PH : 9611297893</p>
          </div>
        </motion.div>
        {/* the AI advisory report */}
        <div className="relative flex-1">
          {[1, 0].map((o) => {
            const i = (p + o) % PAGES.length;
            return (
              <motion.div
                key={`r${o}`}
                className="absolute inset-y-0 left-1/2 aspect-[1190/1540] overflow-hidden rounded-md border border-[#fff]/30 bg-[#fff] shadow-2xl"
                initial={false}
                animate={{ x: o ? "-30%" : "-58%", rotate: o ? 6 : -3, scale: o ? 0.9 : 1, opacity: o ? 0.7 : 1 }}
                transition={{ type: "spring", stiffness: 170, damping: 22 }}
              >
                <Image src={i === 0 ? "/images/advisory/report-p1-bhanu.webp" : `/images/advisory/report-p${i + 1}.webp`} alt={`AI advisory report page ${i + 1}: ${PAGES[i]}`} fill sizes="160px" className="object-cover object-top" />
              </motion.div>
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[#fff]/80">
        AI report · <span className="text-[#d9f99d]">{PAGES[p]}</span>
      </p>
    </CardShell>
  );
}

const GEO_MAPS = [
  { src: "/images/geolenz/geolenz-platform.webp", k: "Nitrogen layer", pos: "70% 50%" },
  { src: "/images/geolenz/geolenz-precision-map.webp", k: "N · P · K · pH maps", pos: "50% 50%" },
  { src: "/images/geolenz/geolenz-mapping-report.webp", k: "Field mapping report", pos: "50% 45%" },
];
const GEO_FLOW = ["Ticket values", "Entered in GeoLenz", "Nutrient maps"];

function GeoLenzCard() {
  const reduce = useReducedMotion();
  const [m, setM] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => setM((v) => (v + 1) % GEO_MAPS.length), 2200);
    return () => window.clearInterval(t);
  }, [reduce]);
  return (
    <CardShell tag="GeoLenz · ticket values to nutrient maps">
      <div className="mb-3 flex items-center gap-1.5">
        {GEO_FLOW.map((f, i) => (
          <div key={f} className="flex flex-1 items-center gap-1.5">
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.2 }}
              className="flex-1 rounded-lg bg-[#fff]/10 px-2 py-1.5 text-center font-mono text-[9.5px] uppercase tracking-[0.08em] text-[#d9f99d]"
            >
              {f}
            </motion.span>
            {i < GEO_FLOW.length - 1 && <ArrowRight className="h-3 w-3 shrink-0 text-[#8CBF5F]" />}
          </div>
        ))}
      </div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#fff]">
        <AnimatePresence mode="wait">
          <motion.div key={m} className="absolute inset-0" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <Image src={GEO_MAPS[m].src} alt={`GeoLenz ${GEO_MAPS[m].k}`} fill sizes="420px" className="object-cover" style={{ objectPosition: GEO_MAPS[m].pos }} />
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[#fff]/80">
        GeoLenz · <span className="text-[#d9f99d]">{GEO_MAPS[m].k}</span>
      </p>
    </CardShell>
  );
}

const PLAYBOOK = [
  { w: "Week 1", t: "Correct pH with lime or gypsum" },
  { w: "Week 2", t: "Add compost and Jeevamrutham" },
  { w: "Week 4", t: "Split-dose nitrogen as per report" },
  { w: "Week 6", t: "Micronutrient foliar spray" },
  { w: "Week 8", t: "Re-test and plan the next crop" },
];

function PlaybookCard() {
  return (
    <CardShell tag="Soil Amendment Playbook">
      <ul className="space-y-1.5">
        {PLAYBOOK.map((s, i) => (
          <motion.li
            key={s.w}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.18, duration: 0.4, ease }}
            className="flex items-center gap-3 rounded-xl bg-[#fff]/8 px-3 py-2"
          >
            <motion.span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#8CBF5F]"
              initial={{ backgroundColor: "rgba(140,191,95,0)" }}
              animate={{ backgroundColor: "rgba(140,191,95,1)" }}
              transition={{ delay: 0.35 + i * 0.18 }}
            >
              <Check className="h-3 w-3 text-[#06201e]" strokeWidth={3.5} />
            </motion.span>
            <span className="w-14 shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-[#a7d48a]">{s.w}</span>
            <span className="text-[13px] text-[#fff]/90">{s.t}</span>
          </motion.li>
        ))}
      </ul>
      <p className="mt-3 rounded-xl bg-[#8CBF5F] px-3 py-2 text-center text-sm font-semibold text-[#06201e]">Healthier soil. Better harvest.</p>
    </CardShell>
  );
}
