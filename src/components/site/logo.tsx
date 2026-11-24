import Image from "next/image";
import { cn } from "@/lib/utils";

export function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <path d="M16 29c0-9 3-15 12-19-1 10-5 16-12 19Z" fill="#2f9e44" />
      <path d="M16 29C15 20 11 14 3 12c1 9 6 15 13 17Z" fill="#1e6fd9" />
      <path d="M16 29V14" stroke="#0f1b4c" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  className,
  inverted = false,
  width = 150,
  height = 54,
}: {
  className?: string;
  inverted?: boolean;
  width?: number;
  height?: number;
}) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src={inverted ? "/images/logo/arkashine-logo-bold-white.png" : "/images/logo/arkashine-logo-bold-transparent.png"}
        alt="ArkaShine"
        width={width}
        height={height}
        unoptimized
        priority
        className="h-8 sm:h-9 w-auto object-contain"
      />
    </span>
  );
}
