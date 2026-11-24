"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { scrollToTarget } from "@/components/global/SmoothScroll";

const LINKS = [
  { label: "Technology", id: "soillenz" },
  { label: "Process", id: "how" },
  { label: "Field", id: "field" },
  { label: "Impact", id: "impact" },
  { label: "Patents", id: "patents" },
  { label: "Who We Work With", id: "solutions" },
];

export function SiteNav({ onBookDemo }: { onBookDemo: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => {
      // stay transparent over the cinematic hero so the film is never boxed in
      const hero = document.getElementById("top");
      const limit = hero ? hero.offsetHeight - window.innerHeight * 0.6 : 40;
      setScrolled(window.scrollY > limit);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToTarget(id, 1.8);
  };

  return (
    <>
      <header
        className={`${scrolled ? "home-light" : "home-keep"} fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ${
          scrolled ? "border-b border-ivory/10 bg-forest-deep/90 shadow-sm backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <nav className="container-site flex h-[68px] items-center justify-between md:h-20" aria-label="Primary">
          <button
            type="button"
            onClick={() => go("top")}
            className="group flex shrink-0 items-center gap-2.5 py-1"
            aria-label="ArkaShine — back to top"
          >
          </button>

          <ul className="hidden items-center gap-4 xl:gap-7 lg:flex">
            <li>
              <a
                href="/products"
                className="group relative font-mono text-xs uppercase tracking-[0.14em] text-ivory/75 transition-colors hover:text-ivory whitespace-nowrap"
              >
                Products
                <span className="absolute -bottom-1.5 left-1/2 h-px w-0 -translate-x-1/2 bg-botanical transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
            {LINKS.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => go(l.id)}
                  className="group relative font-mono text-xs uppercase tracking-[0.14em] text-ivory/75 transition-colors hover:text-ivory whitespace-nowrap"
                >
                  {l.label}
                  <span className="absolute -bottom-1.5 left-1/2 h-px w-0 -translate-x-1/2 bg-botanical transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="/satellite"
              className="group hidden items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory/75 transition-colors hover:text-botanical md:inline-flex"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-botanical opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-botanical" />
              </span>
              GeoLenz
            </a>
            <button
              type="button"
              onClick={onBookDemo}
              className="hidden rounded-full bg-ivory px-5 py-2.5 text-[13px] font-semibold text-forest-deep transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-botanical sm:inline-flex"
            >
              Book a demo
            </button>
            {/* Right-side logo */}
            <button
              type="button"
              onClick={() => go("top")}
              className="group hidden lg:flex items-center rounded-xl bg-[#fff] px-3 py-1.5 shadow-[0_4px_18px_rgba(0,0,0,0.25)] ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105"
              aria-label="ArkaShine — back to top"
            >
              <Image
                src="/images/logo/arkashine-logo-bold-transparent.png"
                alt="ArkaShine — Innovation in agriculture"
                width={494}
                height={156}
                unoptimized
                priority
                className="h-9 w-auto max-w-none shrink-0 sm:h-11"
              />
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 text-ivory lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-forest-deep px-6 py-6"
            initial={{ opacity: 0, x: "8%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "8%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex justify-end">
              <button type="button" onClick={() => setOpen(false)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20" aria-label="Close menu">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <ul className="mt-10 flex flex-col gap-3">
              <li>
                <a href="/products" className="display text-5xl text-ivory">
                  Products
                </a>
              </li>
              {LINKS.map((l, i) => (
                <motion.li key={l.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i + 0.1 }}>
                  <button type="button" onClick={() => go(l.id)} className="display text-5xl text-ivory">
                    {l.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <a href="/satellite" className="mt-8 font-mono text-sm uppercase tracking-[0.18em] text-botanical">
              GeoLenz · nutrient maps &amp; land history
            </a>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onBookDemo();
              }}
              className="mt-auto rounded-full bg-[#1E7A33] py-4 font-semibold text-[#fff]"
            >
              Book a demo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
