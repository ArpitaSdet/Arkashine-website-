"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  Wheat,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  Maximize2,
  X,
} from "lucide-react";

export function FpoPartnerShowcase() {
  const [activePhoto, setActivePhoto] = useState<0 | 1>(0);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);

  const photos = [
    {
      src: "/images/partners/naragunda-fpo-demo.jpg",
      title: "On-Site Diagnostic Demonstration",
      caption: "ArkaShine agronomy specialist demonstrating SoiLenz digital soil testing with local farmers and staff at Naragunda FPO office.",
    },
    {
      src: "/images/partners/naragunda-fpo-setup.jpg",
      title: "Complete Field Hardware Deployment",
      caption: "SoiLenz 2.0 closed diagnostic unit with thermal printer, precision pH/EC electrode sensor, reagents, and field sampling apparatus.",
    },
  ];

  const activities = [
    "Soil sample collection and testing",
    "Soil health assessment and fertility mapping",
    "Crop-specific fertilizer recommendations",
    "Farmer awareness and capacity-building programmes",
    "Demonstration of SoiLenz technology",
    "Digital soil health record management",
  ];

  return (
    <section id="fpo-collaboration" className="relative overflow-hidden bg-[#F1F8EF] py-20 sm:py-28 border-y border-emerald-900/10">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[130px]" />

      <div className="container-site max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-emerald-900 shadow-xs mb-4">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>FPO Ecosystem Partnership</span>
          </div>

          <h2 className="display text-3xl sm:text-5xl font-bold text-emerald-950 tracking-tight [text-wrap:balance]">
            Partnering with <span className="text-emerald-700">Farmer Producer Organizations</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-emerald-900/80 leading-relaxed font-normal">
            Partnering with Farmer Producer Organizations to bring scientific soil testing, data-driven nutrient management, and sustainable agricultural practices closer to farming communities.
          </p>
        </div>

        {/* Featured Collaboration Card */}
        <div className="rounded-[32px] sm:rounded-[40px] border border-emerald-900/15 bg-white shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left 6 Cols: Authentic Photo Showcase */}
            <div className="lg:col-span-6 bg-[#E8F3E0] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-emerald-900/10">
              <div>
                {/* Photo Tabs */}
                <div className="flex items-center gap-2 mb-4">
                  {photos.map((p, idx) => (
                    <button
                      key={p.title}
                      type="button"
                      onClick={() => setActivePhoto(idx as 0 | 1)}
                      className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-bold transition-all ${
                        activePhoto === idx
                          ? "bg-[#1E7A33] text-white shadow-xs"
                          : "bg-white text-[#162a54] hover:bg-emerald-100"
                      }`}
                    >
                      Photo 0{idx + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFullscreenPhoto(photos[activePhoto].src)}
                    className="ml-auto flex items-center gap-1.5 font-mono text-xs text-emerald-800 hover:text-emerald-950 bg-white px-3 py-1.5 rounded-full shadow-2xs border border-emerald-200"
                    title="View full-size photo"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Enlarge</span>
                  </button>
                </div>

                {/* Main Photo View */}
                <div
                  onClick={() => setFullscreenPhoto(photos[activePhoto].src)}
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-900/15 bg-white shadow-md cursor-pointer group"
                >
                  <Image
                    src={photos[activePhoto].src}
                    alt={photos[activePhoto].title}
                    fill
                    unoptimized
                    priority
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 550px"
                  />
                </div>

                {/* Photo Caption */}
                <p className="mt-3 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                  {photos[activePhoto].caption}
                </p>
              </div>

              {/* Verified Institutional Endorsement Bar */}
              <div className="mt-6 pt-5 border-t border-emerald-900/15 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-emerald-900/80">
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-950">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  <span>NABARD Sponsored</span>
                </span>
                <span>•</span>
                <span>IDF Implementing Partner</span>
                <span>•</span>
                <span>CIN: U01400KA2021PTC149667</span>
              </div>
            </div>

            {/* Right 6 Cols: FPO Details & Partnership Highlights */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div>
                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-100 text-[#162a54] border border-emerald-300">
                    <Building2 className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Active FPO Partner</span>
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-950 border border-amber-300">
                    Est. 2021
                  </span>
                </div>

                {/* FPO Name in English & Kannada */}
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-emerald-950 tracking-tight">
                  Naragunda Farmers Producer Co. Ltd
                </h3>
                <p className="font-sans text-xs text-emerald-800 font-semibold mt-1">
                  ನರಗುಂದ ಫಾರ್ಮರ್ಸ್ ಪ್ರೊಡ್ಯೂಸರ್ ಕಂಪನಿ ಲಿಮಿಟೆಡ್
                </p>

                {/* Key Metadata Grid */}
                <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-[#F1F8EF] border border-emerald-900/10">
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-emerald-700" /> Location
                    </span>
                    <strong className="text-emerald-950 block mt-0.5 font-bold leading-tight">
                      Naragund, Gadag District, Karnataka
                    </strong>
                    <span className="text-[10px] text-zinc-500">PIN: 582207</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F1F8EF] border border-emerald-900/10">
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold flex items-center gap-1">
                      <Users className="h-3 w-3 text-emerald-700" /> Membership
                    </span>
                    <strong className="text-emerald-950 block mt-0.5 font-bold">
                      500+ Member Farmers
                    </strong>
                    <span className="text-[10px] text-zinc-500">Active Field Collective</span>
                  </div>

                  <div className="col-span-2 p-3 rounded-2xl bg-[#F1F8EF] border border-emerald-900/10">
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold flex items-center gap-1">
                      <Wheat className="h-3 w-3 text-emerald-700" /> Crops Covered
                    </span>
                    <span className="text-emerald-950 font-bold block mt-0.5">
                      Cotton &bull; Bengal Gram (Chana) &bull; Maize &bull; Jowar &bull; Wheat &bull; Groundnut
                    </span>
                  </div>
                </div>

                {/* Key Activities Highlight */}
                <div className="mt-6">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-emerald-900 mb-3 flex items-center gap-1.5">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
                    <span>Services &amp; Activities Undertaken</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activities.map((act) => (
                      <div key={act} className="flex items-start gap-2 p-2 rounded-xl bg-[#F1F8EF] border border-emerald-900/5 text-emerald-950">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{act}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Outcomes & Farmer Impact */}
                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-100/80 to-teal-50 border border-emerald-300/80">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-emerald-900 mb-2 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-emerald-700" />
                    <span>Outcomes &amp; Farmer Impact</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-950">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-700 shrink-0" />
                      <span><strong>Input Cost Savings:</strong> Elimination of excessive unprescribed urea and DAP purchases.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-700 shrink-0" />
                      <span><strong>20-Minute Diagnostics:</strong> Real-time testing at village gate with on-the-spot printed reports.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-700 shrink-0" />
                      <span><strong>Mobile Agronomy Advisory:</strong> Direct crop-specific fertilizer plans sent to farmers&apos; phones.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Inquiry Action */}
              <div className="pt-4 border-t border-emerald-900/10 flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-xs text-zinc-500">
                  Ready to deploy SoiLenz in your FPO cluster?
                </span>
                <a
                  href="#partner-inquiry"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#1E7A33] px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#17642a] hover:scale-105"
                >
                  <span>Connect with Us</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {fullscreenPhoto && (
        <div
          onClick={() => setFullscreenPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 cursor-pointer"
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setFullscreenPhoto(null)}
              className="self-end mb-2 flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-white font-mono text-xs hover:bg-white/30"
            >
              <X className="h-4 w-4" />
              <span>Close</span>
            </button>
            <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden border border-white/20 bg-black">
              <Image
                src={fullscreenPhoto}
                alt="Naragunda FPO Collaboration"
                fill
                unoptimized
                className="object-contain"
                sizes="100vw"
              />
            </div>
            <p className="mt-3 text-center text-white/80 font-mono text-xs">
              Naragunda Farmers Producer Co. Ltd &bull; Field Demonstration with ArkaShine SoiLenz
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
