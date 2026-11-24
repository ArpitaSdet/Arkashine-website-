"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

/** Solid bar, 52 px. Follows the cursor slightly (magnetic), lifts on hover, presses in. */
export function PrimaryButton({
  href,
  children,
  tone = "ink",
  className,
}: {
  href: string;
  children: React.ReactNode;
  tone?: "ink" | "white";
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 18 });
  const y = useSpring(my, { stiffness: 260, damping: 18 });

  return (
    <MotionLink
      ref={ref}
      href={href}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - r.left - r.width / 2) * 0.18);
        my.set((e.clientY - r.top - r.height / 2) * 0.25 - 2);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group inline-flex h-[52px] cursor-pointer items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-semibold transition-colors duration-200",
        tone === "ink" ? "bg-night text-white hover:bg-leaf-dark" : "bg-white text-night hover:bg-leaf-soft",
        className,
      )}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2} aria-hidden="true" />
    </MotionLink>
  );
}

/** Outlined pill; fill grows left → right on hover. */
export function SecondaryButton({
  href,
  children,
  tone = "dark",
  className,
}: {
  href: string;
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex h-[52px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border px-6 text-[15px] font-semibold transition-colors duration-300 active:scale-[0.97]",
        dark ? "border-white/40 text-white hover:text-night" : "border-night/20 text-night hover:text-white",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100",
          dark ? "bg-white" : "bg-night",
        )}
      />
      <span className="relative">{children}</span>
    </Link>
  );
}
