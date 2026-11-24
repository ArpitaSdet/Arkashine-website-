"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, History, Layers, Satellite } from "lucide-react";
import { SoilMapDemo } from "@/components/satellite/SoilMapDemo";
import { GeoLenzNutrientMaps } from "@/components/satellite/GeoLenzNutrientMaps";
import { SatTiles } from "@/components/satellite/SatTiles";
import { AppRecording } from "@/components/satellite/AppRecording";
import { ContactStrip } from "@/components/site/ContactStrip";

const TABS = [
  { id: "maps", label: "GeoLenz Nutrient Maps", icon: Layers },
  { id: "soil", label: "TerraMap · Land History", icon: History },
] as const;

export default function SatellitePage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("maps");

  return (
    <div className="home-light min-h-screen bg-[#fff] text-ivory">
      <header className="sticky top-0 z-50 border-b border-[#162a54]/10 bg-[#fff]/90 backdrop-blur-md">
        <div className="container-site flex h-20 items-center justify-between">
          <Link href="/" className="group inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em] text-ivory/80 hover:text-botanical">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.75} />
            <Image src="/images/logo/arkashine-logo-bold-transparent.png" alt="ArkaShine" width={494} height={156} unoptimized className="h-8 w-auto" />
          </Link>
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-botanical">
            <Satellite className="h-4 w-4" /> GeoLenz
          </span>
        </div>
      </header>

      {/* hero over live imagery */}
      <section className="home-keep relative overflow-hidden">
        <SatTiles lat={13.139} lon={77.487} zoom={15} span={7} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e2a21]/45 via-[#0e2a21]/35 to-[#0e2a21]/70" />
        {/* orbiting satellite */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-[8%] top-10 h-56 w-56 rounded-full border border-dashed border-white/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-[#1E7A33] text-[#fff] shadow-[0_0_20px_rgba(140,191,95,0.8)]">
            <Satellite className="h-4 w-4" />
          </span>
        </motion.div>
        <div className="container-site relative max-w-6xl py-20 sm:py-28">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="eyebrow text-botanical">
            GeoLenz · satellite field intelligence
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="display mt-5 max-w-[16ch] text-[clamp(2.4rem,5vw,4.4rem)] text-ivory"
          >
            Read every field <span className="text-botanical">from space.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-5 max-w-[46ch] text-base text-ivory/75 sm:text-lg">
            SoiLenz ticket values become nutrient maps of the whole field. TerraMap adds the land's history.
          </motion.p>
        </div>
      </section>

      {/* tabs */}
      <section className="bg-[#eaf5dc] pb-24 pt-10">
        <div className="container-site max-w-7xl">
          <div className="mb-8 inline-flex flex-wrap rounded-full border border-[#162a54]/15 bg-[#fff] p-1 shadow-sm">
            {TABS.map((t) => {
              const Icon = t.icon;
              const on = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors ${on ? "text-[#fff]" : "text-[#162a54]/70 hover:text-[#162a54]"}`}
                >
                  {on && <motion.span layoutId="sat-tab" className="absolute inset-0 rounded-full bg-botanical" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                  <Icon className="relative h-4 w-4" />
                  <span className="relative">{t.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
              {/* the demo is an app "screen": its own teal panel on the light page */}
              <div className="home-keep rounded-[32px] bg-[linear-gradient(160deg,#1f5246,#164039)] p-4 shadow-[0_40px_80px_-40px_rgba(22,42,84,0.5)] sm:p-6">
                {tab === "maps" ? <GeoLenzNutrientMaps /> : <SoilMapDemo />}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* the real app, in a phone */}
          <div className="mt-20 grid grid-cols-1 items-center gap-10 rounded-[32px] bg-[#fbf7ee] p-8 shadow-sm sm:p-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="eyebrow text-botanical">In the Soil Partner app</p>
              <h2 className="display mt-4 text-3xl text-ivory sm:text-5xl">Search. Pin. Analyse.</h2>
              <p className="mt-4 max-w-[42ch] text-ivory/70">The same flow, recorded in the app on a real field.</p>
            </div>
            <motion.div
              className="mx-auto w-[min(64vw,250px,calc((100svh-10rem)*0.46))] rounded-[38px] bg-[#0c1411] p-2.5 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)] lg:col-span-6"
              initial={{ opacity: 0, y: 40, rotate: -4 }}
              whileInView={{ opacity: 1, y: 0, rotate: -2 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: "spring", stiffness: 70, damping: 16 }}
            >
              <div className="relative aspect-[480/1046] overflow-hidden rounded-[30px] bg-[#000]">
                <AppRecording className="absolute inset-0" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <ContactStrip />
    </div>
  );
}
