"use client";

import { useEffect, useRef } from "react";

/**
 * Autoplaying "living soil" film for the hero, drawn on one canvas.
 * A dry soil → B organic soil + moisture → C nutrient uptake → D healthy soil
 * → E brush-reveal of farmers → F camera pulls back over the field. Loops forever.
 * Plates and floating aggregates are cut from real soil photographs (no 3D blocks).
 */

const LOOP = 42; // seconds
const SRC = {
  dry: "/images/soil-macro.jpg",
  roots: "/images/soil-roots-cinematic.jpg",
  field: "/images/who-officer.jpg",
  farmers: "/images/happy-farmers-cinematic.jpg",
} as const;
type PlateKey = keyof typeof SRC;

type Cam = { s: number; x: number; y: number };
type Shot = {
  plate: PlateKey;
  start: number;
  end: number;
  fade: number;
  from: Cam;
  to: Cam;
  filter: string;
  brush?: boolean;
};

// The cut list. Camera moves are slow dolly-ins, pull-backs and lateral drifts.
const SHOTS: Shot[] = [
  { plate: "dry", start: 0, end: 8.5, fade: 1.4, from: { s: 1.22, x: 0.02, y: 0 }, to: { s: 1.42, x: -0.03, y: 0.015 }, filter: "saturate(0.65) sepia(0.28) brightness(0.78) contrast(1.05)" },
  { plate: "roots", start: 7, end: 22, fade: 1.6, from: { s: 1.45, x: 0.03, y: -0.01 }, to: { s: 1.12, x: -0.025, y: 0.01 }, filter: "saturate(0.95) brightness(0.82) contrast(1.05)" },
  { plate: "field", start: 21, end: 28.6, fade: 1.6, from: { s: 1.32, x: -0.02, y: 0.02 }, to: { s: 1.08, x: 0.02, y: 0 }, filter: "saturate(1.05) brightness(0.9)" },
  { plate: "farmers", start: 27.4, end: 41.2, fade: 2.6, from: { s: 1.38, x: 0.0, y: -0.03 }, to: { s: 1.0, x: 0, y: 0 }, filter: "saturate(1.05) brightness(0.95)", brush: true },
];

// Weights for the overlay layers over time (piecewise linear keyframes).
const W_AGGREGATES: [number, number][] = [[0, 1], [12, 0.85], [19, 0.6], [23, 0.2], [26, 0], [40.6, 0], [42, 1]];
const W_MOISTURE: [number, number][] = [[0, 0], [7.5, 0], [10, 1], [21, 1], [24, 0], [42, 0]];
const W_NUTRIENTS: [number, number][] = [[0, 0], [13.5, 0], [15.5, 1], [21.5, 1], [24, 0], [42, 0]];

export const SCENE_CAPTIONS: [number, string][] = [
  [0, "Dry soil · macro view"],
  [7.5, "Organic matter & moisture"],
  [14.5, "Nutrient uptake · N P K Ca Mg S Fe Mn Cu Zn B"],
  [21.5, "Living soil, healthy crop"],
  [28.5, "The farmers"],
  [35, "Healthy fields"],
];

const NUTRIENTS = [
  { sym: "N", color: "168,213,181" },
  { sym: "P", color: "232,196,138" },
  { sym: "K", color: "230,211,179" },
  { sym: "Ca", color: "240,236,226" },
  { sym: "Mg", color: "190,222,176" },
  { sym: "S", color: "236,222,150" },
  { sym: "Fe", color: "201,139,107" },
  { sym: "Mn", color: "199,160,184" },
  { sym: "Cu", color: "217,160,102" },
  { sym: "Zn", color: "184,196,200" },
  { sym: "B", color: "207,224,168" },
];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function keyed(keys: [number, number][], t: number) {
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i];
    const [t1, v1] = keys[i + 1];
    if (t >= t0 && t <= t1) return lerp(v0, v1, ease((t - t0) / (t1 - t0 || 1)));
  }
  return keys[keys.length - 1][1];
}

/** Deterministic random so every visit sees the same film. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/** Cover-fit an image into the frame with a camera scale and offset (fractions of the frame). */
function drawPlate(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number, cam: Cam) {
  const base = Math.max(w / img.naturalWidth, h / img.naturalHeight) * cam.s;
  const dw = img.naturalWidth * base;
  const dh = img.naturalHeight * base;
  const maxX = (dw - w) / 2;
  const maxY = (dh - h) / 2;
  const ox = Math.max(-maxX, Math.min(maxX, cam.x * w));
  const oy = Math.max(-maxY, Math.min(maxY, cam.y * h));
  ctx.drawImage(img, (w - dw) / 2 + ox, (h - dh) / 2 + oy, dw, dh);
}

/** Irregular, shaded soil aggregates cut from a real soil photo, each in 3 focus levels. */
function makeAggregates(texture: HTMLImageElement, count: number) {
  const rand = rng(11);
  const sprites: HTMLCanvasElement[][] = [];
  for (let n = 0; n < count; n++) {
    const size = 180;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d")!;
    const pts = 16;
    const r0 = size * 0.36;
    const radii = Array.from({ length: pts }, () => r0 * (0.72 + rand() * 0.42));
    g.beginPath();
    for (let i = 0; i <= pts; i++) {
      const a = (i / pts) * Math.PI * 2;
      const r = radii[i % pts];
      const nx = size / 2 + Math.cos(a) * r;
      const ny = size / 2 + Math.sin(a) * r * (0.8 + rand() * 0.15);
      if (i === 0) g.moveTo(nx, ny);
      else {
        const pa = ((i - 0.5) / pts) * Math.PI * 2;
        const pr = (radii[(i - 1) % pts] + r) / 2 * (0.95 + rand() * 0.12);
        g.quadraticCurveTo(size / 2 + Math.cos(pa) * pr, size / 2 + Math.sin(pa) * pr, nx, ny);
      }
    }
    g.closePath();
    g.save();
    g.clip();
    // Sample a random patch of real soil texture.
    const tw = texture.naturalWidth;
    const th = texture.naturalHeight;
    const patch = 140 + rand() * 160;
    const sx = rand() * (tw - patch);
    const sy = th * 0.35 + rand() * (th * 0.6 - patch);
    g.drawImage(texture, sx, Math.max(0, sy), patch, patch, 0, 0, size, size);
    // Macro lighting: warm key from top-left, deep shadow bottom-right.
    const shade = g.createRadialGradient(size * 0.32, size * 0.28, size * 0.05, size * 0.55, size * 0.6, size * 0.62);
    shade.addColorStop(0, "rgba(255,214,170,0.28)");
    shade.addColorStop(0.55, "rgba(40,24,12,0.05)");
    shade.addColorStop(1, "rgba(8,4,2,0.75)");
    g.fillStyle = shade;
    g.fillRect(0, 0, size, size);
    // Mineral grains and humus flecks.
    for (let k = 0; k < 26; k++) {
      g.fillStyle = rand() > 0.7 ? `rgba(230,205,160,${0.25 + rand() * 0.35})` : `rgba(10,6,3,${0.3 + rand() * 0.4})`;
      g.beginPath();
      g.arc(size * (0.2 + rand() * 0.6), size * (0.2 + rand() * 0.6), 0.6 + rand() * 1.8, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();

    const levels = [0, 2.5, 7].map((blur) => {
      if (!blur) return c;
      const b = document.createElement("canvas");
      b.width = b.height = size;
      const bg = b.getContext("2d")!;
      bg.filter = `blur(${blur}px)`;
      bg.drawImage(c, 0, 0);
      return b;
    });
    sprites.push(levels);
  }
  return sprites;
}

type Aggregate = { x: number; y: number; z: number; vx: number; vy: number; vz: number; rot: number; vr: number; size: number; sprite: number; wet: boolean };
type Nutrient = { x: number; y: number; tx: number; ty: number; t: number; speed: number; curl: number; kind: number; label: boolean; r: number };
type Drop = { x: number; y: number; r: number; phase: number };

export function LivingSoilFilm({ captionRef }: { captionRef?: React.RefObject<HTMLSpanElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    const rand = rng(29);

    const images = {} as Record<PlateKey, HTMLImageElement>;
    let ready = 0;
    let sprites: HTMLCanvasElement[][] = [];
    let raf = 0;
    let visible = true;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const mask = document.createElement("canvas");
    const buffer = document.createElement("canvas");

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      for (const c of [canvas, mask, buffer]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    // Scene layers.
    const aggregates: Aggregate[] = Array.from({ length: small ? 18 : 36 }, (_, i) => ({
      x: (rand() * 2 - 1) * 1.6,
      y: (rand() * 2 - 1) * 1.0,
      z: 0.5 + rand() * 3.5,
      vx: (rand() - 0.5) * 0.02,
      vy: -0.006 - rand() * 0.018,
      vz: -0.05 - rand() * 0.09,
      rot: rand() * Math.PI * 2,
      vr: (rand() - 0.5) * 0.25,
      size: 0.08 + rand() * 0.16,
      sprite: i,
      wet: rand() > 0.55,
    }));
    const roots = [
      [0.36, 0.44],
      [0.52, 0.58],
      [0.66, 0.38],
      [0.44, 0.7],
      [0.78, 0.62],
    ];
    const spawnNutrient = (n: Partial<Nutrient> = {}): Nutrient => {
      const target = roots[Math.floor(rand() * roots.length)];
      const edge = rand();
      return {
        x: edge < 0.5 ? rand() : edge < 0.75 ? -0.05 : 1.05,
        y: edge < 0.5 ? 1.05 : rand(),
        tx: target[0] + (rand() - 0.5) * 0.05,
        ty: target[1] + (rand() - 0.5) * 0.05,
        t: 0,
        speed: 0.05 + rand() * 0.07,
        curl: (rand() - 0.5) * 0.6,
        kind: Math.floor(rand() * NUTRIENTS.length),
        label: rand() < 0.16,
        r: 1 + rand() * 2.2,
        ...n,
      };
    };
    const nutrients: Nutrient[] = Array.from({ length: small ? 70 : 150 }, () => spawnNutrient({ t: rand() }));
    const drops: Drop[] = Array.from({ length: small ? 14 : 28 }, () => ({ x: rand(), y: 0.25 + rand() * 0.7, r: 1.5 + rand() * 4, phase: rand() * Math.PI * 2 }));

    // Brush strokes for the farmer reveal: sweeps across the frame.
    const strokes = Array.from({ length: 7 }, (_, i) => {
      const y0 = 0.05 + i * 0.15 + (rand() - 0.5) * 0.06;
      const ltr = i % 2 === 0;
      return {
        delay: i * 0.07,
        pts: Array.from({ length: 24 }, (_, k) => ({
          x: ltr ? -0.1 + (k / 23) * 1.2 : 1.1 - (k / 23) * 1.2,
          y: y0 + Math.sin(k * 0.5 + i) * 0.04,
          r: 0.09 + rand() * 0.05,
        })),
      };
    });

    let captionIdx = -1;
    const setCaption = (t: number) => {
      if (!captionRef?.current) return;
      let idx = 0;
      SCENE_CAPTIONS.forEach(([at], i) => {
        if (t >= at) idx = i;
      });
      if (idx !== captionIdx) {
        captionIdx = idx;
        const el = captionRef.current;
        el.style.opacity = "0";
        setTimeout(() => {
          el.textContent = SCENE_CAPTIONS[idx][1];
          el.style.opacity = "1";
        }, 400);
      }
    };

    const camAt = (shot: Shot, t: number): Cam => {
      const k = ease(clamp01((t - shot.start) / (shot.end - shot.start)));
      // Gentle orbital sway on top of the dolly.
      const sway = Math.sin(t * 0.35) * 0.006;
      return { s: lerp(shot.from.s, shot.to.s, k), x: lerp(shot.from.x, shot.to.x, k) + sway, y: lerp(shot.from.y, shot.to.y, k) + Math.cos(t * 0.27) * 0.004 };
    };

    const drawShot = (shot: Shot, t: number) => {
      const img = images[shot.plate];
      if (!img?.complete || !img.naturalWidth) return;
      const local = t - shot.start;
      if (local < 0 || t > shot.end + 0.01) return;
      const fadeOut = shot === SHOTS[SHOTS.length - 1] ? clamp01((shot.end - t) / 1.4) : 1;
      const cam = camAt(shot, t);

      if (shot.brush && local < shot.fade) {
        // Organic brush-mask reveal.
        const p = local / shot.fade;
        const m = mask.getContext("2d")!;
        m.setTransform(dpr, 0, 0, dpr, 0, 0);
        m.clearRect(0, 0, w, h);
        m.fillStyle = "#fff";
        for (const s of strokes) {
          const sp = clamp01((p - s.delay) / 0.62);
          const upto = Math.floor(sp * s.pts.length);
          for (let k = 0; k < upto; k++) {
            const pt = s.pts[k];
            m.beginPath();
            m.ellipse(pt.x * w, pt.y * h, pt.r * w * (0.8 + 0.4 * Math.sin(k)), pt.r * h * 0.9, k * 0.4, 0, Math.PI * 2);
            m.fill();
          }
        }
        const b = buffer.getContext("2d")!;
        b.setTransform(dpr, 0, 0, dpr, 0, 0);
        b.globalCompositeOperation = "source-over";
        b.clearRect(0, 0, w, h);
        b.filter = shot.filter;
        drawPlate(b, img, w, h, cam);
        b.filter = "none";
        b.globalCompositeOperation = "destination-in";
        b.setTransform(1, 0, 0, 1, 0, 0);
        b.drawImage(mask, 0, 0);
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = fadeOut;
        ctx.drawImage(buffer, 0, 0);
        ctx.restore();
        return;
      }

      const fadeIn = shot.start === 0 ? 1 : clamp01(local / shot.fade);
      ctx.save();
      ctx.globalAlpha = Math.min(fadeIn, fadeOut);
      ctx.filter = shot.filter;
      drawPlate(ctx, img, w, h, cam);
      ctx.restore();
    };

    const drawAggregates = (weight: number, dt: number, wet: number) => {
      if (weight <= 0.01 || !sprites.length) return;
      const f = Math.min(w, h) * 0.9;
      const focus = 1.7;
      const sorted = [...aggregates].sort((a, b) => b.z - a.z);
      for (const a of sorted) {
        a.x += a.vx * dt;
        a.y += a.vy * dt;
        a.z += a.vz * dt;
        a.rot += a.vr * dt;
        if (a.z < 0.35 || a.y < -1.4) {
          a.z = 3.6 + rand() * 0.6;
          a.x = (rand() * 2 - 1) * 1.6;
          a.y = (rand() * 2 - 1) * 1.0;
        }
        const sx = w / 2 + (a.x / a.z) * f;
        const sy = h / 2 + (a.y / a.z) * f;
        const size = (a.size / a.z) * f;
        if (sx < -size || sx > w + size || sy < -size || sy > h + size) continue;
        const dof = Math.abs(a.z - focus);
        const level = dof < 0.5 ? 0 : dof < 1.3 ? 1 : 2;
        const nearFade = clamp01((a.z - 0.35) / 0.35);
        const farFade = clamp01((4.2 - a.z) / 0.8);
        ctx.save();
        ctx.globalAlpha = weight * nearFade * farFade;
        ctx.translate(sx, sy);
        ctx.rotate(a.rot);
        ctx.drawImage(sprites[a.sprite % sprites.length][level], -size / 2, -size / 2, size, size);
        if (a.wet && wet > 0.05 && level < 2) {
          // Moisture bead catching the key light.
          const g = ctx.createRadialGradient(-size * 0.12, -size * 0.16, 0, -size * 0.12, -size * 0.16, size * 0.07);
          g.addColorStop(0, `rgba(255,255,255,${0.9 * wet})`);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(-size * 0.12, -size * 0.16, size * 0.07, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    };

    const drawDrops = (weight: number, t: number) => {
      if (weight <= 0.01) return;
      for (const d of drops) {
        const shimmer = 0.6 + 0.4 * Math.sin(t * 1.4 + d.phase);
        const x = d.x * w;
        const y = d.y * h + Math.sin(t * 0.3 + d.phase) * 4;
        const g = ctx.createRadialGradient(x - d.r * 0.3, y - d.r * 0.3, 0, x, y, d.r * 1.6);
        g.addColorStop(0, `rgba(255,255,255,${0.75 * weight * shimmer})`);
        g.addColorStop(0.5, `rgba(220,235,240,${0.25 * weight})`);
        g.addColorStop(1, "rgba(220,235,240,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, d.r * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawNutrients = (weight: number, dt: number) => {
      if (weight <= 0.01) return;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.font = "500 10px ui-monospace, SFMono-Regular, Menlo, monospace";
      for (let i = 0; i < nutrients.length; i++) {
        const n = nutrients[i];
        n.t += n.speed * dt;
        if (n.t >= 1) {
          nutrients[i] = spawnNutrient();
          continue;
        }
        const k = ease(n.t);
        // Curved path toward a root, like uptake along moisture films.
        const bend = Math.sin(k * Math.PI) * n.curl;
        const x = lerp(n.x, n.tx, k) + bend * (n.ty - n.y) * 0.3;
        const y = lerp(n.y, n.ty, k) - bend * (n.tx - n.x) * 0.3;
        const fade = Math.min(clamp01(n.t / 0.15), clamp01((1 - n.t) / 0.2));
        const { color, sym } = NUTRIENTS[n.kind];
        const a = weight * fade;
        const g = ctx.createRadialGradient(x * w, y * h, 0, x * w, y * h, n.r * 4);
        g.addColorStop(0, `rgba(${color},${0.9 * a})`);
        g.addColorStop(1, `rgba(${color},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x * w, y * h, n.r * 4, 0, Math.PI * 2);
        ctx.fill();
        if (n.label && !small) {
          ctx.fillStyle = `rgba(${color},${0.55 * a})`;
          ctx.fillText(sym, x * w + 6, y * h - 6);
        }
      }
      ctx.restore();
    };

    const vignette = () => {
      const g = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.3, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
      g.addColorStop(0, "rgba(20,14,9,0)");
      g.addColorStop(1, "rgba(20,14,9,0.55)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    const frame = (t: number, dt: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#1A130D";
      ctx.fillRect(0, 0, w, h);
      // The loop's opening shot also fades in over the end of the previous loop.
      for (const shot of SHOTS) drawShot(shot, t);
      if (t > LOOP - SHOTS[0].fade) {
        ctx.save();
        ctx.globalAlpha = clamp01((t - (LOOP - SHOTS[0].fade)) / SHOTS[0].fade);
        ctx.filter = SHOTS[0].filter;
        if (images.dry?.naturalWidth) drawPlate(ctx, images.dry, w, h, camAt(SHOTS[0], 0));
        ctx.restore();
      }
      const wet = keyed(W_MOISTURE, t);
      drawAggregates(keyed(W_AGGREGATES, t), dt, wet);
      drawDrops(wet * 0.8, t);
      drawNutrients(keyed(W_NUTRIENTS, t), dt);
      vignette();
      setCaption(t);
    };

    let start = performance.now();
    let last = start;
    let paused = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) {
        paused += now - last;
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (((now - start - paused) / 1000) % LOOP + LOOP) % LOOP;
      frame(t, dt);
    };

    const onLoaded = () => {
      ready += 1;
      if (images.dry.complete && images.dry.naturalWidth && !sprites.length) sprites = makeAggregates(images.dry, 12);
      if (ready === Object.keys(SRC).length || (images.dry.complete && images.dry.naturalWidth)) {
        if (reduced) {
          // Still frame: the farmers in the healthy field.
          frame(38, 0);
        } else if (!raf) {
          start = performance.now();
          last = start;
          raf = requestAnimationFrame(tick);
        }
      }
    };
    (Object.keys(SRC) as PlateKey[]).forEach((key) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        onLoaded();
        if (reduced) frame(38, 0);
      };
      img.src = SRC[key];
      images[key] = img;
    });

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting && !document.hidden), { threshold: 0.01 });
    io.observe(canvas);
    const onVis = () => (visible = !document.hidden);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
    };
  }, [captionRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
