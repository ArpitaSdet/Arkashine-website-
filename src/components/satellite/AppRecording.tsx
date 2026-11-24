"use client";

/**
 * The Soil Partner app screen recording, drawn frame by frame onto a canvas so the
 * searched place reads "Bengaluru" instead of the city typed in the original take.
 * Regions and timings are in the video's own pixels (480 × 1046) and seconds.
 */

import { useEffect, useRef } from "react";

const SRC = "/video/soil-map-app.mp4";
const POSTER = "/video/soil-map-app-poster.webp";
const W = 480;
const H = 1046;

const TYPE_START = 14.95; // first letter appears in the search bar
const TYPE_END = 15.55; // the typed word is complete
const SUGGEST_START = 17.1; // suggestion row under the search bar
const PICKED = 18.7; // the full place name is in the bar
const BAR_END = 61.95; // the map screen closes

const FIELD = { x: 140, y: 100, w: 258, h: 36, textX: 148, base: 124 };
const ROW = { x: 76, y: 132, w: 374, h: 52 };
const BG_SAMPLE = { x: 300, y: 100 };
const ROW_SAMPLE = { x: 440, y: 166 };
const NORMAL_LUMA = 19 * 0.3 + 33 * 0.59 + 55 * 0.11; // un-dimmed search bar colour

const WORD = "Bengaluru";
const PLACE = "Bengaluru, Karnataka";
const FONT = '"DM Sans", "Inter", system-ui, sans-serif';

function px(g: CanvasRenderingContext2D, x: number, y: number) {
  const d = g.getImageData(x, y, 1, 1).data;
  return [d[0], d[1], d[2]] as const;
}

function paint(g: CanvasRenderingContext2D, t: number) {
  if (t < TYPE_START || t >= BAR_END) return;
  const [r, gr, b] = px(g, BG_SAMPLE.x, BG_SAMPLE.y);
  const dim = Math.min(1, (r * 0.3 + gr * 0.59 + b * 0.11) / NORMAL_LUMA);
  const ink = (a: number) => `rgba(236,240,246,${(a * dim).toFixed(3)})`;

  // search bar text
  g.fillStyle = `rgb(${r},${gr},${b})`;
  g.fillRect(FIELD.x, FIELD.y, FIELD.w, FIELD.h);
  g.font = `500 17px ${FONT}`;
  g.textBaseline = "alphabetic";
  g.fillStyle = ink(0.95);
  if (t < PICKED) {
    const n = Math.max(1, Math.min(WORD.length, Math.ceil(((t - TYPE_START) / (TYPE_END - TYPE_START)) * WORD.length)));
    const text = WORD.slice(0, n);
    g.fillText(text, FIELD.textX, FIELD.base);
    // caret
    if (Math.floor(t * 2) % 2 === 0) g.fillRect(FIELD.textX + g.measureText(text).width + 2, FIELD.base - 15, 1.5, 19);
  } else {
    g.fillText(PLACE, FIELD.textX, FIELD.base);
  }

  // suggestion row
  if (t >= SUGGEST_START && t < PICKED) {
    const [rr, rg, rb] = px(g, ROW_SAMPLE.x, ROW_SAMPLE.y);
    g.fillStyle = `rgb(${rr},${rg},${rb})`;
    g.fillRect(ROW.x, ROW.y, ROW.w, ROW.h);
    g.fillStyle = ink(0.95);
    g.font = `600 15px ${FONT}`;
    g.fillText(WORD, 82, 151);
    g.fillStyle = ink(0.5);
    g.font = `400 13px ${FONT}`;
    g.fillText("Bengaluru Urban, Karnataka", 82, 175);
  }
}

export function AppRecording({ className = "relative" }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;
    const g = c.getContext("2d", { willReadFrequently: true });
    if (!g) return;

    let raf = 0;
    let vfc = 0;
    const draw = () => {
      if (v.readyState >= 2) {
        g.drawImage(v, 0, 0, W, H);
        paint(g, v.currentTime);
        c.style.opacity = "1";
      }
    };
    const hasVfc = "requestVideoFrameCallback" in v;
    const loop = () => {
      draw();
      if (hasVfc) vfc = v.requestVideoFrameCallback(loop);
      else raf = requestAnimationFrame(loop);
    };
    loop();

    // only play while the phone is on screen
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(c);
    v.addEventListener("seeked", draw);

    return () => {
      io.disconnect();
      v.removeEventListener("seeked", draw);
      cancelAnimationFrame(raf);
      if (hasVfc && vfc) v.cancelVideoFrameCallback(vfc);
    };
  }, []);

  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={POSTER} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        role="img"
        aria-label="Screen recording: soil map flow in the Soil Partner app"
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300"
      />
      <video ref={videoRef} src={SRC} muted loop playsInline preload="auto" className="pointer-events-none absolute h-px w-px opacity-0" aria-hidden />
    </div>
  );
}
