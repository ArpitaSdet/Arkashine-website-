"use client";

import { useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
}

export function MagneticButton({
  children,
  onClick,
  className = "",
  variant = "primary",
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 180 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Magnetic pull distance (up to 12px)
    x.set((e.clientX - centerX) * 0.28);
    y.set((e.clientY - centerY) * 0.28);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const baseStyles =
    variant === "primary"
      ? "bg-[#1D4ED8] hover:bg-[#1E40AF] text-white shadow-md shadow-blue-800/20 border border-blue-600/30"
      : "bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-2xs";

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={`relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold overflow-hidden transition-colors cursor-pointer select-none interactive-item ${baseStyles} ${className}`}
    >
      {/* Shimmer Light Streak on Hover */}
      <motion.div
        initial={{ x: "-150%" }}
        animate={{ x: isHovered ? "150%" : "-150%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-0 -skew-x-25 bg-gradient-to-r from-transparent via-white/25 to-transparent w-full h-full"
      />

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}