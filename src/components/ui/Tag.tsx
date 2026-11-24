import React from "react";
import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  variant?: "dark" | "light";
  className?: string;
}

export function Tag({ children, variant = "dark", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-colors",
        variant === "dark"
          ? "bg-white/10 text-white/90 border border-white/20 backdrop-blur-md shadow-sm"
          : "bg-mint text-navy border border-leaf/25",
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-leaf shrink-0 shadow-[0_0_6px_#2F9E44]" />
      <span>{children}</span>
    </span>
  );
}
