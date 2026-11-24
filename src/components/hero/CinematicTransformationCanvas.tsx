"use client";

import { useEffect, useRef } from "react";

/**
 * CINEMATIC SOIL TRANSFORMATION CANVAS (10-SECOND CONTINUOUS LOOP)
 * 
 * Connected 4-Phase Journey:
 * Phase 1 (0.0s - 2.5s): Dry Agricultural Soil (extreme macro, cracked clods)
 * Phase 2 (2.5s - 5.5s): Microscopic Soil Particles & Pore Channels
 * Phase 3 (5.5s - 7.5s): Fertile Soil Transformation, Rich Humus & Healthy Young Roots
 * Phase 4 (7.5s - 10.0s): Lush Green Farm Landscape, Thriving Crops & Horizon
 * Seamless loop wraps back into Phase 1 at 10.0s -> 0.0s with continuous camera momentum.
 */

interface Props {
  onPhaseChange?: (phase: number) => void;
}

const DURATION = 10.0; // Seconds

const SCENE_SRCS = [
  "/images/generated/hero_scene_1_dry_soil.jpg",
  "/images/generated/hero_scene_2_microscopic_nutrients.jpg",
  "/images/generated/hero_scene_3_healthy_soil_roots.jpg",
  "/images/generated/hero_scene_4_lush_green_field.jpg",
];

// Fallbacks if images are loading
const FALLBACK_SRCS = [
  "/images/soil-macro.jpg",
  "/images/soil-macro.jpg",
  "/images/soil-roots-cinematic.jpg",
  "/images/field-wide.webp",
];

export function CinematicTransformationCanvas({ onPhaseChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId = 0;
    let isVisible = true;
    const startTime = performance.now();

    // Resize canvas
    const handleResize = () => {
      if (!container || !canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Load Image Elements
    const images: HTMLImageElement[] = [];
    SCENE_SRCS.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onerror = () => {
        // Fallback gracefully if path is temporarily missing
        img.src = FALLBACK_SRCS[idx];
      };
      images.push(img);
    });

    let currentPhase = -1;

    // Smoothstep transition helper
    const smoothstep = (min: number, max: number, value: number) => {
      const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
    };

    /**
     * Draw an image with Ken Burns camera framing (scale + pan)
     */
    const drawFramedImage = (
      img: HTMLImageElement,
      alpha: number,
      scale: number,
      panX: number,
      panY: number
    ) => {
      if (!img.complete || img.naturalWidth === 0 || alpha <= 0.001) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Cover-fit base
      const baseScale = Math.max(cw / iw, ch / ih);
      const dw = iw * baseScale * scale;
      const dh = ih * baseScale * scale;

      const dx = (cw - dw) / 2 + panX * cw;
      const dy = (ch - dh) / 2 + panY * ch;

      ctx.save();
      ctx.globalAlpha = Math.min(1, Math.max(0, alpha));
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      const now = performance.now();
      const elapsed = (now - startTime) / 1000;
      const tau = elapsed % DURATION; // [0, 10.0)

      // Determine active phase for callback
      let phaseIdx = 0;
      if (tau < 2.5) phaseIdx = 0;
      else if (tau < 5.5) phaseIdx = 1;
      else if (tau < 7.5) phaseIdx = 2;
      else phaseIdx = 3;

      if (phaseIdx !== currentPhase) {
        currentPhase = phaseIdx;
        onPhaseChange?.(phaseIdx);
      }

      ctx.fillStyle = "#100B08";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ----------------------------------------------------
      // PHASE OPACITIES & KEN BURNS MOTIONS
      // ----------------------------------------------------

      // 1. Dry Soil: 0.0s - 2.5s (fades in from 4 at 9.4s -> 10.0s, fades out to 2 at 2.5s -> 3.3s)
      let a1 = 0;
      if (tau < 2.5) {
        a1 = 1;
      } else if (tau < 3.4) {
        a1 = 1 - smoothstep(2.5, 3.4, tau);
      } else if (tau > 9.2) {
        a1 = smoothstep(9.2, 10.0, tau);
      }
      const s1 = 1.0 + (tau < 3.5 ? tau / 3.5 : (tau - 9.2) / 0.8) * 0.12;
      const p1x = Math.sin(tau * 0.3) * 0.02;
      const p1y = Math.cos(tau * 0.3) * 0.015;

      // 2. Microscopic Nutrients: 2.5s - 5.5s (fades in 2.5s -> 3.4s, fades out 5.5s -> 6.3s)
      let a2 = 0;
      if (tau >= 2.5 && tau < 6.3) {
        if (tau < 3.4) a2 = smoothstep(2.5, 3.4, tau);
        else if (tau < 5.5) a2 = 1;
        else a2 = 1 - smoothstep(5.5, 6.3, tau);
      }
      const s2 = 1.05 + ((tau - 2.5) / 3.8) * 0.15;
      const p2x = -0.02 + ((tau - 2.5) / 3.8) * 0.035;
      const p2y = 0.01 - ((tau - 2.5) / 3.8) * 0.02;

      // 3. Healthy Soil & Roots: 5.5s - 7.5s (fades in 5.5s -> 6.3s, fades out 7.5s -> 8.3s)
      let a3 = 0;
      if (tau >= 5.5 && tau < 8.3) {
        if (tau < 6.3) a3 = smoothstep(5.5, 6.3, tau);
        else if (tau < 7.5) a3 = 1;
        else a3 = 1 - smoothstep(7.5, 8.3, tau);
      }
      const s3 = 1.02 + ((tau - 5.5) / 2.8) * 0.12;
      const p3x = 0.015 - ((tau - 5.5) / 2.8) * 0.03;
      const p3y = -0.01 + ((tau - 5.5) / 2.8) * 0.02;

      // 4. Lush Green Farm: 7.5s - 10.0s (fades in 7.5s -> 8.3s, fades out 9.2s -> 10.0s)
      let a4 = 0;
      if (tau >= 7.5) {
        if (tau < 8.3) a4 = smoothstep(7.5, 8.3, tau);
        else if (tau < 9.2) a4 = 1;
        else a4 = 1 - smoothstep(9.2, 10.0, tau);
      }
      // Camera pulls back (dolly out) across green fields
      const s4 = 1.14 - ((tau - 7.5) / 2.5) * 0.12;
      const p4x = -0.01 + ((tau - 7.5) / 2.5) * 0.02;
      const p4y = 0.015 - ((tau - 7.5) / 2.5) * 0.02;

      // Draw active layers in visual order
      drawFramedImage(images[0], a1, s1, p1x, p1y);
      drawFramedImage(images[1], a2, s2, p2x, p2y);
      drawFramedImage(images[2], a3, s3, p3x, p3y);
      drawFramedImage(images[3], a4, s4, p4x, p4y);

      // Subtle atmospheric vignette & depth shading
      const grad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.2,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );
      grad.addColorStop(0, "rgba(16, 11, 8, 0)");
      grad.addColorStop(0.7, "rgba(16, 11, 8, 0.45)");
      grad.addColorStop(1, "rgba(16, 11, 8, 0.8)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    animId = requestAnimationFrame(render);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [onPhaseChange]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-[#100B08]">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
