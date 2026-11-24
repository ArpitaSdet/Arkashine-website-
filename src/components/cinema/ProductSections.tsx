"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { FocusImage } from "./FocusImage";
import { SoilenzStage } from "./SoilenzStage";

import { CAPSULE_IMAGE, appScreens, processSteps, sensorParts, soillenzFeatures } from "@/lib/cinema-content";

/** Cycles an index every `ms` while in view, until the user picks one. */
function useAutoCycle(count: number, ms: number) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  useEffect(() => {
    if (!inView || locked) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), ms);
    return () => window.clearInterval(id);
  }, [inView, locked, count, ms]);
  const pick = (i: number) => {
    setLocked(true);
    setIndex(i);
  };
  return { ref, index, pick, inView };
}

const ease = [0.22, 1, 0.36, 1] as const;
const reveal = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: (i = 0) => ({ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease, delay: i * 0.08 } }),
};

/* ------------------------------------------------------------------ */
/* 06 · SoiLenz 2.0 reveal                                            */
/* ------------------------------------------------------------------ */

export function ProductReveal({ onBookDemo, onQuote }: { onBookDemo: () => void; onQuote: () => void }) {
  const { ref, index, pick } = useAutoCycle(soillenzFeatures.length, 4800);
  const active = soillenzFeatures[index];
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const lift = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const glow = useTransform(scrollYProgress, [0.2, 1], [0, 1]);

  return (
    <section ref={ref} id="soillenz" className="relative flex min-h-0 items-center overflow-hidden bg-forest-deep py-10 md:py-14 lg:py-16" aria-labelledby="soillenz-title">
      {/* studio light */}
      <motion.div
        aria-hidden
        style={{ opacity: glow }}
        className="pointer-events-none absolute -left-[10%] top-[10%] h-[80%] w-[75%] rounded-full bg-[radial-gradient(closest-side,rgba(140,191,95,0.16),rgba(13,43,43,0.25)_55%,transparent)] blur-2xl"
      />
      <div className="container-site relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <motion.div style={{ y: lift }} className="lg:col-span-7">
          <SoilenzStage caption={`${active.no} · ${active.title}`} />
        </motion.div>

        <div className="lg:col-span-5">
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }} variants={reveal} className="eyebrow text-ivory/85">
            Hardware · 01
          </motion.p>
          <motion.h2
            id="soillenz-title"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            variants={reveal}
            custom={1}
            className="display mt-2 text-[clamp(2.2rem,4vw,3.5rem)] text-ivory"
          >
            SoiLenz 2.0
          </motion.h2>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} custom={2} className="mt-2 text-xl font-light leading-snug text-ivory/85">
            A laboratory.
            <br />
            Built for the field.
          </motion.p>

          <ul className="mt-6" role="tablist" aria-label="SoiLenz features">
            {soillenzFeatures.map((f, i) => {
              const on = i === index;
              return (
                <li key={f.id} className="border-t border-ivory/12 last:border-b">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => pick(i)}
                    onMouseEnter={() => pick(i)}
                    className="group flex w-full items-start gap-4 py-3 text-left md:py-3.5"
                  >
                    <span className={`mt-0.5 font-mono text-xs tracking-[0.16em] transition-colors ${on ? "text-botanical" : "text-ivory/70"}`}>{f.no}</span>
                    <span className="flex-1">
                      <span className={`block text-base transition-colors md:text-lg ${on ? "text-ivory" : "text-ivory/80 group-hover:text-ivory/80"}`}>{f.title}</span>
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.span
                            className="block overflow-hidden text-sm text-ivory/85"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.45, ease }}
                          >
                            <span className="block pt-1.5">{f.line}</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span className={`mt-1.5 h-2 w-2 rounded-full transition-all duration-500 ${on ? "bg-botanical shadow-[0_0_12px_3px_rgba(140,191,95,0.55)]" : "bg-ivory/15"}`} />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 inline-flex items-stretch overflow-hidden rounded-2xl border border-botanical/50 bg-botanical/10 shadow-[0_0_30px_-8px_rgba(140,191,95,0.6)]">
            <span className="flex flex-col justify-center px-5 py-3">
              <span className="font-mono text-3xl font-bold leading-none text-botanical">15 min</span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory/80">complete analysis</span>
            </span>
            <span className="w-px bg-botanical/40" />
            <span className="flex flex-col justify-center px-5 py-3">
              <span className="font-mono text-3xl font-bold leading-none text-botanical">14</span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory/80">parameters output</span>
            </span>
          </div>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-ivory/80">5 g sample · Printer · Bluetooth</p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            <button type="button" onClick={onBookDemo} className="inline-flex items-center gap-2 rounded-full bg-[#1E7A33] px-5 py-2.5 text-sm font-semibold text-[#fff] transition-transform duration-300 hover:-translate-y-0.5">
              Book a live demo <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button type="button" onClick={onQuote} className="inline-flex items-center gap-2 border-b border-ivory/30 pb-1 text-sm text-ivory/85 transition-colors hover:border-botanical hover:text-botanical">
              Request a quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 07 · pH & EC capsule                                                */
/* ------------------------------------------------------------------ */

export function SensorShowcase() {
  const { ref, index, pick } = useAutoCycle(sensorParts.length, 4200);
  const active = sensorParts[index];
  return (
    <section ref={ref} id="ph-ec" className="home-keep relative bg-ivory py-24 text-ink md:py-36" aria-labelledby="phec-title">
      <div className="container-site grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-[28px] shadow-[0_40px_90px_-40px_rgba(19,32,27,0.55)]">
            <FocusImage
              src={CAPSULE_IMAGE.src}
              alt="ArkaShine pH and EC capsule with electrode probe"
              natural={{ w: CAPSULE_IMAGE.w, h: CAPSULE_IMAGE.h }}
              focus={active.focus}
              sizes="(min-width:1024px) 720px, 100vw"
            />
          </div>
        </div>

        <div className="lg:col-span-5">
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} className="eyebrow text-ink/80">
            Hardware · 02 · pH &amp; EC capsule
          </motion.p>
          <motion.h2
            id="phec-title"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={reveal}
            custom={1}
            className="display mt-6 text-[clamp(2.4rem,4.6vw,4.4rem)] text-forest"
          >
            Precision beyond
            <br />
            <span className="font-light">nutrients.</span>
          </motion.h2>

          <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-b border-ink/12" role="tablist" aria-label="Capsule parts">
            {sensorParts.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={i === index}
                type="button"
                onClick={() => pick(i)}
                className={`relative pb-4 text-[15px] transition-colors md:text-base ${i === index ? "text-forest" : "text-ink/75 hover:text-ink/75"}`}
              >
                {p.title}
                {i === index && <motion.span layoutId="sensor-underline" className="absolute inset-x-0 -bottom-px h-[2px] bg-botanical-dark" />}
              </button>
            ))}
          </div>
          <div className="relative mt-8 min-h-[4.5rem]">
            <AnimatePresence mode="wait">
              <motion.p
                key={active.id}
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease }}
                className="max-w-[34ch] text-xl leading-snug text-ink/80 md:text-2xl"
              >
                {active.line}
              </motion.p>
            </AnimatePresence>
          </div>
          <p className="mt-10 font-mono text-xs uppercase tracking-[0.16em] text-ink/75">Soil pH · Electrical conductivity · 60 s</p>
          <p className="mt-4 max-w-[36ch] text-[14px] leading-relaxed text-ink/80">
            Reads pH and EC only. SoiLenz 2.0 reads the other 12 nutrients.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 08 · How SoiLenz works (scroll-linked, vertical progress)          */
/* ------------------------------------------------------------------ */

/* Media for each step, in the order the client shared them:
   01 Connect = real SoiLenz 2.0 photo paired to the app · 02 Prepare + 03 Analyze = the first clip
   (0–46 s filter & pour, 47–62 s cartridge in, lid closed) · 04 Report = the printed-report clip. */
const STEP_MEDIA = [
  { kind: "photo" as const },
  { kind: "video" as const, src: "/video/step-prepare-analyze.mp4", poster: "/video/step-prepare-poster.webp", from: 0, to: 46, rate: 1.6 },
  { kind: "video" as const, src: "/video/step-prepare-analyze.mp4", poster: "/video/step-analyze-poster.webp", from: 47, to: 62, rate: 1 },
  { kind: "video" as const, src: "/video/step-report.mp4", poster: "/video/step-report-poster.webp", from: 0, to: 15, rate: 1 },
];

function StepVideo({ src, poster, from, to, rate, playing }: { src: string; poster: string; from: number; to: number; rate: number; playing: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const start = () => {
      v.currentTime = from;
      v.playbackRate = rate;
      if (playing) v.play().catch(() => {});
    };
    if (v.readyState >= 1) start();
    else v.addEventListener("loadedmetadata", start, { once: true });
    if (!playing) v.pause();
  }, [from, rate, playing]);
  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      src={src}
      poster={poster}
      muted
      playsInline
      preload="metadata"
      onTimeUpdate={(e) => {
        const v = e.currentTarget;
        if (v.currentTime >= to || v.currentTime < from - 0.5) v.currentTime = from; // loop just this step's part
      }}
      aria-hidden
    />
  );
}

function ConnectScene() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,#1d4a40_0%,#123630_45%,#0a221f_100%)]">
      {/* real device photo */}
      <motion.div
        className="absolute left-[7%] top-[22%] h-[50%] w-[52%] overflow-hidden rounded-2xl shadow-[0_24px_40px_-14px_rgba(0,0,0,0.7)] ring-1 ring-white/15"
        initial={{ opacity: 0, x: -20, rotate: -3 }}
        animate={{ opacity: 1, x: 0, rotate: -2 }}
        transition={{ duration: 0.7, ease }}
      >
        <Image src="/images/products/soillenz-2-studio.webp" alt="SoiLenz 2.0 unit" fill sizes="240px" className="object-cover object-[50%_55%]" />
      </motion.div>
      {/* phone with the Soil Partner app */}
      <motion.div
        className="absolute right-[7%] top-[28%] w-[30%] rounded-[18px] bg-[#0c1411] p-1 shadow-[0_24px_40px_-14px_rgba(0,0,0,0.7)]"
        initial={{ opacity: 0, x: 20, rotate: 4 }}
        animate={{ opacity: 1, x: 0, rotate: 3 }}
        transition={{ duration: 0.7, ease, delay: 0.15 }}
      >
        <div className="relative aspect-[9/19] overflow-hidden rounded-[14px] bg-white">
          <Image src="/images/app/connect.webp" alt="Soil Partner app pairing screen" fill sizes="140px" className="object-cover object-top" />
        </div>
        <motion.span
          className="absolute -top-9 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-botanical/70 bg-[#0d2b26] font-mono text-xs font-bold text-botanical"
          animate={{ boxShadow: ["0 0 0 0 rgba(140,191,95,0.6)", "0 0 0 10px rgba(140,191,95,0)"] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          BT
        </motion.span>
      </motion.div>
      {/* pairing dots travelling device → phone */}
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="absolute top-[46%] h-2 w-2 rounded-full bg-[#86efac]"
          initial={{ left: "57%", opacity: 0 }}
          animate={{ left: ["57%", "64%"], opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  const [desktop, setDesktop] = useState<boolean | null>(null);
  const near = useInView(ref, { margin: "200px 0px" });
  const lineScale = useTransform(scrollYProgress, [0, 0.92], [0, 1]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // desktop: the pinned scroll picks the step
  useEffect(
    () =>
      scrollYProgress.on("change", (v) => {
        if (window.innerWidth < 768) return;
        setStep(Math.min(processSteps.length - 1, Math.floor(v * processSteps.length * 0.999)));
      }),
    [scrollYProgress],
  );

  // phones: auto-advance until the user taps a step
  const [locked, setLocked] = useState(false);
  useEffect(() => {
    if (desktop !== false || locked || !near) return;
    const id = window.setInterval(() => setStep((i) => (i + 1) % processSteps.length), 6000);
    return () => window.clearInterval(id);
  }, [desktop, locked, near]);

  const s = processSteps[step];
  const media = STEP_MEDIA[step];

  return (
    <section ref={ref} id="how" className="relative bg-soilteal md:h-[340vh]" aria-labelledby="how-title">
      <div className="md:sticky md:top-0 md:flex md:h-[100svh] md:items-center">
        <div className="container-site grid w-full gap-10 py-24 md:grid-cols-12 md:gap-8 md:py-0">
          <div className="md:col-span-4">
            <p className="eyebrow text-ivory/85">How SoiLenz works</p>
            <h2 id="how-title" className="display mt-6 text-[clamp(2.2rem,3.8vw,3.6rem)] text-ivory">
              Four steps.
              <br />
              <span className="font-light">One visit.</span>
            </h2>

            <ol className="relative mt-12 hidden pl-8 md:block">
              <span aria-hidden className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px bg-ivory/15" />
              <motion.span aria-hidden style={{ scaleY: lineScale }} className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-botanical" />
              {processSteps.map((p, i) => (
                <li key={p.id} className="relative py-4">
                  <span
                    className={`absolute -left-8 top-[1.35rem] h-[11px] w-[11px] rounded-full border transition-all duration-500 ${
                      i <= step ? "border-botanical bg-botanical" : "border-ivory/30 bg-soilteal"
                    } ${i === step ? "shadow-[0_0_0_5px_rgba(140,191,95,0.18)]" : ""}`}
                  />
                  <span className={`font-mono text-xs tracking-[0.16em] ${i === step ? "text-botanical" : "text-ivory/70"}`}>0{i + 1}</span>
                  <span className={`ml-4 text-xl uppercase tracking-[0.04em] transition-colors duration-500 ${i === step ? "text-ivory" : "text-ivory/70"}`}>{p.title}</span>
                </li>
              ))}
            </ol>

            {/* phones: tap a step */}
            <div className="mt-8 flex flex-wrap gap-2 md:hidden">
              {processSteps.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setStep(i);
                    setLocked(true);
                  }}
                  className={`rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-wider ${i === step ? "border-botanical bg-[#1E7A33] text-[#fff]" : "border-ivory/20 text-ivory/85"}`}
                >
                  0{i + 1} {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* arch stage: one photo / clip per step */}
          <div className="h-[460px] md:col-span-5 md:h-[78svh]" role="img" aria-label={`SoiLenz 2.0 — ${s.title}`}>
            <div className="relative h-full w-full overflow-hidden rounded-[999px_999px_28px_28px] border border-ivory/10 bg-[#0a221f] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.7)]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={step}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.6, ease }}
                >
                  {media.kind === "photo" ? (
                    <ConnectScene />
                  ) : (
                    <StepVideo src={media.src} poster={media.poster} from={media.from} to={media.to} rate={media.rate} playing={near} />
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0a221f]/90 to-transparent" />
                </motion.div>
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center gap-2 px-4">
                <AnimatePresence mode="popLayout">
                  {s.facts.map((f, i) => (
                    <motion.span
                      key={`${s.id}-${f}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1 font-mono text-xs uppercase tracking-wider text-ivory backdrop-blur-md"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-botanical" /> {f}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* step detail */}
          <div className="md:col-span-3 md:self-end md:pb-[14svh]">
            <AnimatePresence mode="wait">
              <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease }}>
                <p className="font-mono text-6xl text-botanical md:text-7xl">0{step + 1}</p>
                <h3 className="mt-4 text-2xl uppercase tracking-[0.04em] text-ivory">{s.title}</h3>
                <p className="mt-3 max-w-[24ch] text-[15px] leading-relaxed text-ivory/85">{s.line}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AppShowcase() {
  const { ref, index, pick } = useAutoCycle(appScreens.length, 5200);
  const screen = appScreens[index];
  return (
    <section ref={ref} id="app" className="home-keep relative overflow-hidden bg-ivory-2 py-24 text-ink md:py-36" aria-labelledby="app-title">
      <div className="container-site grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-ink/80">Soil Partner app</p>
          <h2 id="app-title" className="display mt-6 text-[clamp(2.4rem,4.6vw,4.4rem)] text-forest">
            Every test.
            <br />
            <span className="font-light">In your pocket.</span>
          </h2>
          <ul className="mt-14" role="tablist" aria-label="App screens">
            {appScreens.map((a, i) => (
              <li key={a.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  onClick={() => pick(i)}
                  className="group flex w-full items-center gap-5 py-4 text-left"
                >
                  <span className="relative h-px w-10 overflow-hidden bg-ink/15">
                    {i === index && (
                      <motion.span
                        layoutId="app-indicator"
                        className="absolute inset-0 bg-botanical-dark"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </span>
                  <span className={`text-xl transition-colors md:text-2xl ${i === index ? "text-forest" : "text-ink/70 group-hover:text-ink/85"}`}>{a.title}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-[13px] text-ink/80">Screens from a sample SoiLenz advisory report.</p>
          <p className="mt-2 text-[13px] text-ink/80">pH &amp; EC from the pH/EC Bottle · everything else from SoiLenz 2.0.</p>
        </div>

        <div className="relative lg:col-span-6 lg:col-start-7">
          <div aria-hidden className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(140,191,95,0.22),transparent)]" />
          {/* phone */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotate: -4 }}
            whileInView={{ opacity: 1, y: 0, rotate: -2 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease }}
            className="relative mx-auto w-[min(64vw,250px,calc((100svh-11rem)*0.45))] rounded-[40px] bg-[#0c1411] p-2.5 shadow-[0_60px_120px_-30px_rgba(19,32,27,0.55),inset_0_0_0_1.5px_rgba(255,255,255,0.08)]"
          >
            <div className="absolute left-1/2 top-4 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
            <div className="relative aspect-[9/19.5] overflow-hidden rounded-[32px] bg-white">
              <div className="absolute inset-x-0 top-0 z-10 flex h-12 items-end justify-between bg-[#1d5c2e] px-4 pb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/90">
                <span>Soil Partner</span>
                <span className="font-mono">{String(index + 1).padStart(2, "0")}/03</span>
              </div>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={screen.id}
                  className="absolute inset-x-0 bottom-0 top-12 overflow-hidden bg-white"
                  initial={{ opacity: 0, x: 40, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -40, scale: 0.98 }}
                  transition={{ duration: 0.55, ease }}
                >
                  {/* full screenshot, never cropped — a mismatched aspect ratio was cutting off text */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.035, 1] }}
                    transition={{ duration: 14, ease: "easeInOut", repeat: Infinity, delay: 1.2 }}
                  >
                    <Image src={screen.src} alt={`Soil Partner app — ${screen.title}`} fill sizes="250px" className="object-contain object-top" />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
