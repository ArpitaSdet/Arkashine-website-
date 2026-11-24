"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useScroll } from "motion/react";
import type { Globe } from "./earth/globe";
import { deployments } from "@/lib/cinema-content";

export function EarthDeployments() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<Globe | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [interactive, setInteractive] = useState(false);
  const [noGL, setNoGL] = useState(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    let disposed = false;
    let g: Globe | null = null;
    const ro = new ResizeObserver(() => g?.resize(canvas.clientWidth, canvas.clientHeight));
    const io = new IntersectionObserver(([e]) => g?.setActive(e.isIntersecting), { rootMargin: "200px" });
    import("./earth/globe")
      .then(({ createGlobe }) => {
        if (disposed) return;
        try {
          g = createGlobe(canvas, deployments.map(({ id, lat, lng }) => ({ id, lat, lng })));
        } catch {
          setNoGL(true);
          return;
        }
        globeRef.current = g;
        g.resize(canvas.clientWidth, canvas.clientHeight);
        g.onPick((id) => setActiveId(id));
        g.setIntro(scrollYProgress.get() / 0.75);
        ro.observe(canvas);
        io.observe(section);
      })
      .catch(() => setNoGL(true));
    return () => {
      disposed = true;
      ro.disconnect();
      io.disconnect();
      g?.dispose();
      globeRef.current = null;
    };
  }, [scrollYProgress]);

  useEffect(
    () =>
      scrollYProgress.on("change", (v) => {
        const intro = v / 0.75;
        globeRef.current?.setIntro(intro);
        const ok = intro > 0.86;
        setInteractive(ok);
        if (ok) setActiveId((id) => id ?? "karnataka");
      }),
    [scrollYProgress],
  );

  useEffect(() => {
    globeRef.current?.focus(interactive ? activeId : null);
  }, [activeId, interactive]);

  const active = deployments.find((d) => d.id === activeId) ?? null;

  return (
    <section ref={sectionRef} id="field" className="home-keep relative h-[260vh] bg-[#12352f]" aria-labelledby="field-title">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_35%_50%,rgba(13,43,43,0.9),transparent_65%)]" />
        <div className="container-site relative grid w-full items-center gap-6 lg:grid-cols-12">
          <div className="relative order-2 h-[52svh] lg:order-1 lg:col-span-7 lg:h-[86svh]">
            <canvas
              ref={canvasRef}
              className={`h-full w-full ${interactive ? "cursor-grab active:cursor-grabbing" : ""}`}
              aria-label="Interactive globe showing ArkaShine field deployments in India"
              role="img"
            />
            {noGL && (
              <div className="absolute inset-0 flex items-center justify-center text-ivory/80">3D view unavailable on this device.</div>
            )}
            <p
              className={`pointer-events-none absolute bottom-2 left-0 font-mono text-xs uppercase tracking-[0.2em] text-ivory/75 transition-opacity duration-700 ${
                interactive ? "opacity-100" : "opacity-0"
              }`}
            >
              Drag to rotate · tap a marker
            </p>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-5 lg:pl-6">
            <p className="eyebrow text-ivory/85">Field deployment</p>
            <h2 id="field-title" className="display mt-5 text-[clamp(2rem,3.6vw,3.4rem)] text-ivory">
              Where SoiLenz
              <br />
              <span className="font-light">works today.</span>
            </h2>

            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4 lg:mt-12 lg:grid-cols-2" aria-label="Deployment locations">
              {deployments.map((d) => {
                const on = d.id === activeId && interactive;
                return (
                  <li key={d.id}>
                    <button
                      type="button"
                      disabled={!interactive}
                      onClick={() => setActiveId(d.id)}
                      aria-pressed={on}
                      className={`group flex items-center gap-3 py-2 text-left transition-colors disabled:cursor-default ${
                        on ? "text-ivory" : "text-ivory/75 hover:text-ivory/80"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-500 ${on ? "scale-150 bg-botanical shadow-[0_0_10px_3px_rgba(140,191,95,0.6)]" : "bg-ivory/30"}`} />
                      <span className="text-[15px] lg:text-lg">{d.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 hidden min-h-[260px] lg:block">
              <AnimatePresence mode="wait">
                {active && interactive && (
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex gap-6"
                  >
                    {active.photo && (
                      <div className="relative h-[200px] w-[170px] shrink-0 overflow-hidden rounded-[18px]">
                        <Image src={active.photo} alt={`ArkaShine field work — ${active.region}`} fill sizes="170px" className="object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-botanical">{active.region}</p>
                      <p className="display mt-2 text-4xl text-ivory">{active.name}</p>
                      <p className="mt-3 max-w-[26ch] text-[15px] leading-relaxed text-ivory/85">{active.line}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {active && interactive && (
              <p className="mt-4 text-[14px] text-ivory/85 lg:hidden">
                <span className="text-ivory">{active.name}</span> — {active.line}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
