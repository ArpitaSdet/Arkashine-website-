"use client";

/**
 * Product line-up: what ArkaShine makes today and what is coming next.
 * SoiLenz 2.0 and the pH/EC bottle are available; Soil Life, Soil Sparsh and the
 * water testing device are upcoming (only Soil Sparsh has a photo so far).
 */

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Droplets, Microscope, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Product = {
  name: string;
  line: string;
  tags: string[];
  status: "available" | "upcoming";
  img?: { src: string; fit: "cover" | "contain"; bg: string; pos?: string };
  icon?: LucideIcon;
  tint: string;
  href?: string;
};

const PRODUCTS: Product[] = [
  {
    name: "SoiLenz 2.0",
    line: "A portable soil lab: 14 parameters from one 5 g sample, with a built-in printer.",
    tags: ["14 parameters", "Printer", "Bluetooth"],
    status: "available",
    img: { src: "/images/products/soillenz-2-studio.webp", fit: "cover", bg: "#efe7e0", pos: "50% 60%" },
    tint: "#1E7A33",
    href: "#soillenz",
  },
  {
    name: "pH / EC Bottle",
    line: "Soil pH and electrical conductivity in 60 seconds, alongside SoiLenz.",
    tags: ["pH", "EC", "60 s"],
    status: "available",
    img: { src: "/images/products/ph-ec-bottle.webp", fit: "cover", bg: "#0b2a28", pos: "52% 45%" },
    tint: "#0f766e",
    href: "#ph-ec",
  },
  {
    name: "Soil Sparsh",
    line: "A plug-in field probe for soil moisture, soil temperature, air temperature and sunlight.",
    tags: ["Moisture", "Temperature", "Light"],
    status: "upcoming",
    img: { src: "/images/products/soil-sparsh.webp", fit: "cover", bg: "#cfe3b8", pos: "50% 45%" },
    tint: "#b45309",
  },
  {
    name: "Soil Life",
    line: "Insight into the living side of soil. [Details to be announced.]",
    tags: ["Soil biology", "Coming soon"],
    status: "upcoming",
    icon: Microscope,
    tint: "#7c3aed",
  },
  {
    name: "Water Testing Device",
    line: "Quick quality checks for irrigation and drinking water. [Details to be announced.]",
    tags: ["Water quality", "Coming soon"],
    status: "upcoming",
    icon: Droplets,
    tint: "#0369a1",
  },
];

export function ProductLineup() {
  return (
    <section id="products" className="relative overflow-hidden bg-[#fbf7ee] py-20 md:py-28" aria-labelledby="products-title">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-[#cfe8b4]/50 blur-[110px]" />
      <div className="container-site relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-[#3f4f6b]">Our products</p>
            <h2 id="products-title" className="display mt-5 text-[clamp(2.2rem,4.6vw,4.2rem)] leading-[1.02] text-[#162a54]">
              Made in India.
              <br />
              <span className="font-light">Built for every field.</span>
            </h2>
          </div>
          <div className="flex gap-2 font-mono text-[11px] uppercase tracking-[0.16em]">
            <span className="rounded-full bg-[#1E7A33] px-3 py-1 text-[#fff]">2 available</span>
            <span className="rounded-full border border-[#162a54]/20 bg-[#fff] px-3 py-1 text-[#162a54]">3 upcoming</span>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {PRODUCTS.map((p, i) => {
            const Icon = p.icon;
            const upcoming = p.status === "upcoming";
            const Card = (
              <motion.article
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 140, damping: 18, delay: i * 0.08 }}
                className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#162a54]/10 bg-[#fff] shadow-[0_24px_50px_-34px_rgba(22,42,84,0.45)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden" style={{ background: p.img?.bg ?? `${p.tint}14` }}>
                  {p.img ? (
                    <Image
                      src={p.img.src}
                      alt={`${p.name}${upcoming ? " (upcoming)" : ""}`}
                      fill
                      sizes="(min-width:1280px) 240px, (min-width:640px) 45vw, 90vw"
                      className="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
                      style={{ objectFit: p.img.fit, objectPosition: p.img.pos }}
                    />
                  ) : (
                    Icon && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <motion.span
                          aria-hidden
                          className="absolute h-40 w-40 rounded-full blur-2xl"
                          style={{ background: `${p.tint}33` }}
                          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.span
                          className="relative flex h-20 w-20 items-center justify-center rounded-3xl text-[#fff] shadow-lg"
                          style={{ background: `linear-gradient(135deg, ${p.tint}, ${p.tint}bb)` }}
                          animate={{ y: [0, -6, 0], rotate: [0, -3, 0] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Icon className="h-9 w-9" strokeWidth={1.5} />
                        </motion.span>
                        <span className="relative font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: p.tint }}>
                          Photo coming soon
                        </span>
                      </div>
                    )
                  )}
                  <span
                    className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] shadow-sm ${
                      upcoming ? "bg-[#fff] text-[#162a54]" : "bg-[#1E7A33] text-[#fff]"
                    }`}
                  >
                    {upcoming && <Sparkles className="h-3 w-3 text-[#b45309]" />}
                    {upcoming ? "Upcoming" : "Available now"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl font-bold text-[#162a54]">{p.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[#3f4f6b]">{p.line}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-full border border-[#162a54]/10 bg-[#fbf7ee] px-2.5 py-0.5 text-[11px] font-semibold text-[#162a54]">
                        {t}
                      </span>
                    ))}
                  </div>
                  {p.href && (
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1E7A33]">
                      Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </div>
              </motion.article>
            );
            return p.href ? (
              <a key={p.name} href={p.href} className="block h-full rounded-[24px] focus-visible:outline-3 focus-visible:outline-[#1E7A33]">
                {Card}
              </a>
            ) : (
              <div key={p.name} className="h-full">
                {Card}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
