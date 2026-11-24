"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import type { SoilFilm } from "./soil-film/engine";
import { scrollToTarget } from "@/components/global/SmoothScroll";

const CHAPTERS = [
  { at: 0, label: "Living soil & mud" },
  { at: 0.08, label: "Underground soil" },
  { at: 0.17, label: "Root network" },
  { at: 0.27, label: "Nutrient particles" },
  { at: 0.38, label: "Golden sunlight" },
  { at: 0.55, label: "Green farm" },
];

// The 14 parameters SoiLenz 2.0 reads — they pop up during the nutrient chapter.
// x/y are % of the viewport; `m` = also shown on phones.
const NUTRIENTS = [
  { s: "N", n: "Nitrogen", x: 14, y: 22, m: true },
  { s: "P", n: "Phosphorus", x: 34, y: 14, m: true },
  { s: "K", n: "Potassium", x: 58, y: 20, m: true },
  { s: "pH", n: "Acidity", x: 24, y: 42, m: true },
  { s: "EC", n: "Conductivity", x: 72, y: 36, m: false },
  { s: "OC", n: "Org. carbon", x: 46, y: 36, m: true },
  { s: "S", n: "Sulphur", x: 8, y: 60, m: false },
  { s: "Ca", n: "Calcium", x: 62, y: 56, m: true },
  { s: "Mg", n: "Magnesium", x: 36, y: 62, m: false },
  { s: "Fe", n: "Iron", x: 80, y: 62, m: true },
  { s: "Mn", n: "Manganese", x: 18, y: 78, m: false },
  { s: "Zn", n: "Zinc", x: 50, y: 76, m: true },
  { s: "Cu", n: "Copper", x: 70, y: 80, m: false },
  { s: "B", n: "Boron", x: 86, y: 18, m: false },
];

// Real ArkaShine field photos (from the company deck).

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function SoilToFarmHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filmRef = useRef<SoilFilm | null>(null);
  const textARef = useRef<HTMLDivElement>(null);
  const textBRef = useRef<HTMLDivElement>(null);
  const dissolveRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const mudRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [chapter, setChapter] = useState(0);

  // WebGL film
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const off = new URLSearchParams(window.location.search).get("3d") === "0";
    if (off || !hasWebGL()) {
      setFallback(true);
      return;
    }
    let disposed = false;
    let film: SoilFilm | null = null;
    const quality = window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4 ? "low" : "high";

    const size = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      film?.resize(w, h);
    };
    const ro = new ResizeObserver(size);
    const io = new IntersectionObserver(([e]) => film?.setActive(e.isIntersecting), { rootMargin: "100px" });
    const onPointer = (e: PointerEvent) => {
      film?.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };

    import("./soil-film/engine")
      .then(({ createSoilFilm }) => {
        if (disposed) return;
        try {
          film = createSoilFilm(canvas, quality);
        } catch {
          setFallback(true);
          return;
        }
        filmRef.current = film;
        size();
        ro.observe(canvas);
        io.observe(section);
        window.addEventListener("pointermove", onPointer, { passive: true });
        film.setProgress(ScrollTrigger.getById("soil-film")?.progress ?? 0);
        film.ready.then(() => !disposed && setReady(true));
      })
      .catch(() => setFallback(true));

    return () => {
      disposed = true;
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      film?.dispose();
      filmRef.current = null;
    };
  }, []);

  // Scroll choreography (GSAP ScrollTrigger, scrubbed — normal scrolling is never hijacked)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // intro: staggered blur-to-sharp entrance of the soil headline
      gsap.fromTo(
        "[data-intro]",
        { opacity: 0, y: 28, filter: "blur(14px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, ease: "power3.out", stagger: 0.14, delay: 0.35 },
      );

      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      // 00 · the film opens on pristine natural fertile agricultural soil:
      // camera smoothly dives forward through the natural soil, dissolving into the 3D root particles
      tl.fromTo(
        "[data-mud-img]",
        { scale: 1.0, filter: "brightness(0.92) contrast(1.04) blur(0px)" },
        { scale: 1.35, filter: "brightness(1.05) contrast(1.08) blur(12px)", duration: 0.12, ease: "power1.inOut" },
        0.0,
      )
        .to(mudRef.current, { opacity: 0, duration: 0.05, ease: "power2.out" }, 0.08);
      tl.to(textARef.current, { opacity: 0, y: -48, filter: "blur(16px)", duration: 0.07 }, 0.07)
        .to(cueRef.current, { opacity: 0, duration: 0.03 }, 0.02)
        .fromTo(
          textBRef.current,
          { opacity: 0, y: 48, filter: "blur(18px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.07, ease: "power2.out" },
          0.73,
        )
        .fromTo("[data-farm-line]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.012, duration: 0.04 }, 0.76)
        .to(textBRef.current, { opacity: 0, y: -36, filter: "blur(12px)", duration: 0.05 }, 0.90)
        // ends exactly at progress 1 (no held black hold before the pin releases —
        // that was reading as an empty/blank stretch, worse once the section got taller)
        .fromTo(dissolveRef.current, { opacity: 0 }, { opacity: 1, duration: 0.025 }, 0.975)
        .to(railRef.current, { opacity: 0, duration: 0.04 }, 0.68)
        // nutrients pop out of the soil one by one, then drift up and away
        .fromTo(
          "[data-nutrient]",
          { opacity: 0, scale: 0.2, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.02, ease: "back.out(2.6)", stagger: 0.006 },
          0.23,
        )
        .fromTo("[data-nutrient-cap]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.03 }, 0.27)
        .to("[data-nutrient]", { opacity: 0, y: -60, scale: 0.85, duration: 0.04, stagger: 0.003 }, 0.43)
        .to("[data-nutrient-cap]", { opacity: 0, duration: 0.03 }, 0.44)
        // the green farm becomes a real farm photograph
        // swaps in under the surface-break flash, so the 3D farm is never seen
        .fromTo(photoRef.current, { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.69)
        .fromTo("[data-photo-img]", { scale: 1.06 }, { scale: 1, duration: 0.30 }, 0.69)
        .fromTo(
          "[data-field-photo]",
          { opacity: 0, y: 40, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.03, ease: "back.out(1.8)", stagger: 0.012 },
          0.78,
        )
        .set({}, {}, 1);

      if (fallbackRef.current) {
        const plates = fallbackRef.current.querySelectorAll<HTMLElement>("[data-plate]");
        plates.forEach((el, i) => {
          if (i === 0) return;
          tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.08 }, [0, 0.25, 0.5, 0.75][i] ?? 0.75);
        });
      }

      let last = -1;
      ScrollTrigger.create({
        id: "soil-film",
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          filmRef.current?.setProgress(p);
          tl.progress(p);
          let c = 0;
          for (let i = 0; i < CHAPTERS.length; i++) if (p >= CHAPTERS[i].at) c = i;
          if (c !== last) {
            last = c;
            setChapter(c);
          }
          railRef.current?.style.setProperty("--p", String(Math.min(1, p / 0.72)));
        },
      });
    }, section);

    return () => ctx.revert();
  }, [fallback]);

  const descend = () => {
    const s = sectionRef.current;
    if (!s) return;
    const top = s.getBoundingClientRect().top + window.scrollY;
    scrollToTarget(top + (s.offsetHeight - window.innerHeight) * 0.72, 7);
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="From living soil to green farms"
      className="home-keep relative h-[505vh] w-full bg-forest-deep md:h-[700vh]"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* poster while the film loads — pristine natural fertile agricultural soil */}
        <div
          aria-hidden
          className={`absolute inset-0 bg-[url('/images/hero-living-soil.webp')] bg-cover bg-center transition-opacity duration-[1600ms] ${
            ready ? "opacity-0" : "opacity-100"
          }`}
          style={{ filter: "brightness(0.92) contrast(1.05) blur(2px)", transform: "scale(1.02)" }}
        />

        <canvas
          ref={canvasRef}
          aria-hidden
          className={`absolute inset-0 h-full w-full transition-opacity duration-[1600ms] ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />

        {fallback && (
          <div ref={fallbackRef} aria-hidden className="absolute inset-0">
            {[
              "/images/hero-living-soil.webp",
              "/images/generated/hero_scene_3_healthy_soil_roots.jpg",
              "/images/generated/hero_scene_2_microscopic_nutrients.jpg",
              "/images/farm-sunrise.webp",
            ].map((src, i) => (
              <div
                key={src}
                data-plate
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${src})`,
                  opacity: i === 0 ? 1 : 0,
                  filter: i < 3 ? "brightness(0.75)" : undefined,
                }}
              />
            ))}
          </div>
        )}

        {/* 00 · Pristine Natural Fertile Agricultural Soil (Clean, Real Natural Earth) */}
        <div
          ref={mudRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
        >
          {/* Real natural fertile crumbly soil texture */}
          <div data-mud-img className="absolute inset-0 will-change-transform">
            <Image
              src="/images/hero-living-soil.webp"
              alt="Natural fertile agricultural soil"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[50%_55%]"
              style={{ filter: "brightness(0.9) contrast(1.06) saturate(1.05)" }}
            />
          </div>
          {/* Subtle warm morning sunlight vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,rgba(255,230,180,0.10)_0%,transparent_55%,rgba(20,14,8,0.55)_100%)]" />
          {/* readability: darken behind the headline (left / bottom) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
        </div>

        {/* real farm photograph takes over from the 3D farm */}
        <div ref={photoRef} aria-hidden className="absolute inset-0 overflow-hidden opacity-0">
          <div data-photo-img className="absolute inset-0 will-change-transform">
            <Image src="/images/farm-sunrise.webp" alt="" fill sizes="100vw" className="object-cover object-center" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
        </div>

        {/* nutrients popping out of the soil */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
          {NUTRIENTS.map((el, i) => (
            <div
              key={el.s}
              data-nutrient
              className={`absolute -translate-x-1/2 -translate-y-1/2 opacity-0 ${el.m ? "" : "hidden md:block"}`}
              style={{ left: `${el.x}%`, top: `${el.y}%` }}
            >
              <div
                className="nutrient-float flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full border border-botanical/50 bg-forest-deep/45 text-ivory shadow-[0_0_28px_4px_rgba(140,191,95,0.35),inset_0_0_18px_rgba(140,191,95,0.25)] backdrop-blur-md md:h-[84px] md:w-[84px]"
                style={{ animationDelay: `${(i % 5) * -0.9}s` }}
              >
                <span className="font-mono text-xl font-semibold leading-none md:text-2xl">{el.s}</span>
                <span className="mt-1 max-w-[64px] truncate text-center font-mono text-[11px] uppercase tracking-[0.08em] text-botanical md:text-xs">
                  {el.n}
                </span>
              </div>
            </div>
          ))}
          <p
            data-nutrient-cap
            className="absolute bottom-[12vh] left-1/2 -translate-x-1/2 whitespace-nowrap text-center font-mono text-xs uppercase tracking-[0.22em] text-ivory/85 opacity-0 md:text-[12px]"
          >
            14 soil parameters · one 5 g sample
          </p>
        </div>

        {/* legibility scrims — only where text sits, the soil stays visible */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/35 to-transparent" />

        {/* 01 — soil headline (bottom-left, leaves the roots visible) */}
        <div
          ref={textARef}
          className="absolute inset-x-0 bottom-0 z-10 pb-[max(4.5rem,9vh)]"
        >
          <div className="container-site">
            <div data-intro className="eyebrow mb-6 flex items-center gap-3 text-ivory/90">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-ivory/90">ArkaShine</span>
              <span className="text-ivory/80">&bull;</span>
              <span className="tracking-wider uppercase font-mono text-xs text-ivory/80">Soil intelligence</span>
            </div>
            <h1 className="display max-w-[15ch] text-[clamp(2.6rem,7.4vw,7.4rem)] text-ivory [text-shadow:0_6px_40px_rgba(0,0,0,0.45)]">
              <span data-intro className="block">Soil is more than</span>
              <span data-intro className="block font-light text-ivory/90">what you see.</span>
            </h1>
            <div data-intro className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-[34ch] text-base text-ivory/80 sm:text-lg">
                Advanced Soil Intelligence engineered for agriculture.
              </p>
              <button
                type="button"
                onClick={descend}
                className="group inline-flex w-fit items-center gap-3 border-b border-ivory/40 pb-2 font-mono text-[12px] uppercase tracking-[0.2em] text-ivory transition-colors hover:border-botanical hover:text-botanical"
              >
                Explore our technology
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* 06 — farm hero message */}
        <div ref={textBRef} className="absolute inset-0 z-10 flex items-start opacity-0" style={{ pointerEvents: "none" }}>
          <div aria-hidden className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#0b1a10]/70 via-[#0b1a10]/25 to-transparent md:w-[62%]" />
          <div className="container-site relative pt-[22vh] md:pt-[24vh]">
            <p data-farm-line className="eyebrow mb-6 text-ivory/85">
              Healthy soil · prosperous farms
            </p>
            <h2 className="display max-w-[11ch] text-[clamp(2.5rem,5.4vw,5.6rem)] text-ivory [text-shadow:0_6px_40px_rgba(0,0,0,0.35)] md:max-w-none">
              <span data-farm-line className="block">Healthy soils.</span>
              <span data-farm-line className="block font-light">Brighter</span>
              <span data-farm-line className="block font-light">tomorrows.</span>
            </h2>
            <p data-farm-line className="mt-8 max-w-[30ch] text-lg leading-snug text-ivory/85">
              Better soil intelligence.
              <br />
              Smarter agricultural decisions.
            </p>
            <button
              data-farm-line
              type="button"
              onClick={() => scrollToTarget("soillenz", 2)}
              style={{ pointerEvents: "auto" }}
              className="group mt-10 inline-flex items-center gap-3 border-b border-ivory/50 pb-2 font-mono text-[12px] uppercase tracking-[0.2em] text-ivory transition-colors hover:border-botanical hover:text-botanical"
            >
              Discover our technology
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* farm-only view — caption hidden */}
        <p
          data-field-photo
          className="hidden"
        >
          Real farmer · real report
        </p>

        {/* chapter rail */}
        <div
          ref={railRef}
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 md:right-10 md:block"
          style={{ ["--p" as string]: 0 }}
        >
          <div className="relative flex flex-col gap-5 pl-5">
            <span className="absolute left-0 top-0 h-full w-px bg-ivory/20" />
            <span className="absolute left-0 top-0 h-full w-px origin-top bg-botanical" style={{ transform: "scaleY(var(--p))" }} />
            {CHAPTERS.map((c, i) => (
              <span
                key={c.label}
                className={`font-mono text-xs uppercase tracking-[0.18em] transition-all duration-500 ${
                  i === chapter ? "translate-x-1 text-ivory" : "text-ivory/70"
                }`}
              >
                {String(i + 1).padStart(2, "0")}&nbsp;&nbsp;{c.label}
              </span>
            ))}
          </div>
        </div>
        <p aria-live="polite" className="sr-only">
          {CHAPTERS[chapter].label}
        </p>
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.2em] text-ivory/80 md:hidden">
          {String(chapter + 1).padStart(2, "0")} · {CHAPTERS[chapter].label}
        </div>

        {/* scroll cue */}
        <div ref={cueRef} aria-hidden className="pointer-events-none absolute bottom-6 right-1/2 z-10 hidden translate-x-1/2 flex-col items-center gap-3 md:flex">
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-ivory/85">Scroll to descend</span>
          <span className="relative block h-12 w-px bg-ivory/20">
            <span className="scroll-cue-line absolute inset-0 bg-ivory" />
          </span>
        </div>

        {/* farm dissolves into the dark studio */}
        <div ref={dissolveRef} aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-forest-deep opacity-0" />
      </div>
    </section>
  );
}
