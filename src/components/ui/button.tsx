"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline-dark";
  href?: string;
  icon?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  href,
  icon = true,
  children,
  className,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current || variant !== "primary") return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseStyles =
    "group inline-flex items-center justify-center gap-2.5 h-[52px] px-6 rounded-full font-medium text-base transition-all duration-200 select-none relative overflow-hidden focus-visible:outline-3 focus-visible:outline-leaf focus-visible:outline-offset-2";

  const variantStyles = {
    primary:
      "bg-leaf hover:bg-leaf-dark text-white shadow-lg shadow-leaf/20 hover:-translate-y-0.5 active:scale-[0.97]",
    secondary:
      "border-[1.5px] border-navy text-navy hover:bg-navy hover:text-white active:scale-[0.97]",
    "outline-dark":
      "border-[1.5px] border-white/40 text-white hover:bg-white/10 hover:border-white active:scale-[0.97]",
  };

  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <ArrowRight
          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
          strokeWidth={1.5}
        />
      )}
    </>
  );

  if (href) {
    return (
      <motion.div
        style={{ x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        <Link
          ref={ref}
          href={href}
          className={cn(baseStyles, variantStyles[variant], className)}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...(props as any)}
    >
      {content}
    </motion.button>
  );
}
