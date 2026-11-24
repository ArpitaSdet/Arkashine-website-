import { cn } from "@/lib/utils";

/** Small dot + lowercase label that opens each section. */
export function SectionLabel({ children, dark = false, className }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <p className={cn("flex items-center gap-2", dark ? "label-dark" : "label", className)}>
      <span className="size-1.5 rounded-full bg-leaf ring-2 ring-leaf/30" aria-hidden="true" />
      {children}
    </p>
  );
}
