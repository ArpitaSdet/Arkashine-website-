"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const trailId = useRef(0);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 22, stiffness: 380 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setEnabled(true);
    }

    let lastTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      if (target && target.closest("button, a, input, [role='button'], canvas, .interactive-item")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }

      // Add trail point every 40ms with guaranteed unique key
      const now = performance.now();
      if (now - lastTime > 40) {
        lastTime = now;
        trailId.current += 1;
        const uniqueKey = `point-${Date.now()}-${trailId.current}`;
        setTrail((prev) => [
          ...prev.slice(-5),
          { x: e.clientX, y: e.clientY, id: uniqueKey as unknown as number },
        ]);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* 1. Cursor Trail Points */}
      {trail.map((point, index) => {
        const opacity = (index + 1) / (trail.length + 1) * 0.45;
        const size = (index + 1) * 0.8 + 1.5;
        return (
          <div
            key={point.id}
            style={{
              left: point.x,
              top: point.y,
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              transform: "translate(-50%, -50%)",
            }}
            className="absolute rounded-full bg-[#83C65A] transition-opacity duration-300"
          />
        );
      })}

      {/* 2. Cursor Soft Spotlight / Glow */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="w-24 h-24 rounded-full bg-[radial-gradient(circle,rgba(131,198,90,0.15)_0%,transparent_70%)] blur-md"
      />

      {/* 3. Precision Botanical Core Dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicking ? 0.6 : isHovering ? 1.8 : 1,
        }}
        transition={{ duration: 0.15 }}
        className="w-2 h-2 bg-[#83C65A] rounded-full shadow-[0_0_8px_rgba(131,198,90,0.8)]"
      />

      {/* 4. Interactive Magnetic Morphing Outer Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicking ? 0.85 : isHovering ? 1.7 : 1,
          borderColor: isHovering ? "rgba(131, 198, 90, 0.8)" : "rgba(168, 182, 176, 0.4)",
          backgroundColor: isHovering ? "rgba(131, 198, 90, 0.08)" : "transparent",
        }}
        transition={{ duration: 0.2 }}
        className="w-7 h-7 rounded-full border border-slate-400/40"
      />
    </div>
  );
}