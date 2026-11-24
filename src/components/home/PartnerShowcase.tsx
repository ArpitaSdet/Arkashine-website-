"use client";

import Image from "next/image";
import { ShieldCheck, Sparkles } from "lucide-react";

export interface Partner {
  id: string;
  name: string;
  logo: string;
}

export const PARTNERS: Partner[] = [
  {
    id: "ktech",
    name: "K-tech",
    logo: "/images/partners/ktech.png",
  },
  {
    id: "social-alpha",
    name: "Social Alpha",
    logo: "/images/partners/social-alpha.png",
  },
  {
    id: "wri-india",
    name: "WRI India",
    logo: "/images/partners/wri-india.png",
  },
  {
    id: "amrita-tbi",
    name: "Amrita TBI",
    logo: "/images/partners/amrita-tbi.png",
  },
  {
    id: "aic-pinnacle",
    name: "AIC Pinnacle",
    logo: "/images/partners/aic-pinnacle.png",
  },
  {
    id: "hpcl",
    name: "HPCL",
    logo: "/images/partners/hpcl.png",
  },
  {
    id: "hdfc-parivartan",
    name: "HDFC Parivartan",
    logo: "/images/partners/hdfc-parivartan.png",
  },
  {
    id: "ikp",
    name: "IKP",
    logo: "/images/partners/ikp.png",
  },
  {
    id: "venture-centre-main",
    name: "Venture Centre",
    logo: "/images/partners/venture-centre.png",
  },
];

export function PartnerShowcase() {
  return (
    // Single-frame section: strictly compact so all 7 logos appear ONCE in 1 single frame without scrolling
    <section id="partners" className="relative overflow-hidden border-y border-ivory/12 bg-black/40 py-10 lg:py-14 text-ivory">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(47,158,68,0.12),transparent)]" />

      <div className="container-site max-w-6xl relative z-10">
        {/* Compact 1-Line Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-botanical/30 bg-botanical/10 px-3 py-1 text-xs font-mono uppercase tracking-[0.18em] text-[#162a54] font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              INSTITUTIONAL ECOSYSTEM
            </span>
            <h2 className="display text-xl sm:text-2xl lg:text-3xl font-bold text-ivory">
              Backed by India's Innovation Ecosystem.
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-botanical">
            <Sparkles className="h-3.5 w-3.5" />
          <span>9 Premier Institutional Collaborations</span>
          </div>
        </div>

        {/* 1-Frame Unified Grid: All 9 Partner Logos shown EXACTLY ONCE */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
          {PARTNERS.map((partner) => (
            <div
              key={partner.id}
              className="group relative rounded-2xl border border-white/10 bg-forest p-3 transition-all duration-300 hover:border-botanical/50 hover:bg-soilteal hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center gap-3"
            >
              {/* Logo */}
              <div className="relative aspect-[16/10] w-full rounded-xl bg-[#fff] p-2 flex items-center justify-center shadow-sm overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  sizes="(max-width: 768px) 33vw, 120px"
                  className="object-contain p-1"
                />
              </div>

              {/* Name only */}
              <h3 className="font-display text-xs font-bold text-ivory text-center leading-tight group-hover:text-botanical transition-colors">
                {partner.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Compact In-Frame Footer Trust Note */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-ivory/80 text-center sm:text-left">
          <span>Supported through state deep-tech grants, pilot program &amp; CSR rural programs.</span>
          <span className="text-botanical font-medium">Bengaluru &middot; Karnataka &middot; India</span>
        </div>
      </div>
    </section>
  );
}
