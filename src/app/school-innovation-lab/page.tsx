import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles, BookOpen, ChevronRight, LayoutDashboard } from "lucide-react";
import { StudentDashboardShowcase } from "@/components/school/StudentDashboardShowcase";
import { Booklet3D } from "@/components/school/Booklet3D";
import { PortalScreens3D } from "@/components/school/PortalScreens3D";
import { SchoolCertificate } from "@/components/school/SchoolCertificate";
import { SnapScroll } from "@/components/school/SnapScroll";
import { FloatingLeaves } from "@/components/school/FloatingLeaves";
import { EnquiryButton } from "@/components/site/EnquiryButton";
import { ContactStrip } from "@/components/site/ContactStrip";

export const metadata: Metadata = {
  title: "School Innovation Lab | Summer Innovation Program — ArkaShine",
  description:
    "A 4-week summer STEM program where students learn soil science, test soil with SoiLenz 2.0 and advise local farmers.",
};

const STATS = [
  { val: "4 wks", label: "Program" },
  { val: "15–20", label: "Students" },
  { val: "8", label: "Modules" },
  { val: "14", label: "Soil parameters" },
];

/* every section fills one screen (below the 5rem header) and snaps into place */
const FRAME = "relative flex min-h-[calc(100svh-5rem)] snap-start items-center overflow-hidden";

export default function SchoolInnovationLabPage() {
  return (
    <div className="min-h-screen bg-[#F1F8EF] text-[#13201B] selection:bg-[#1E7A33] selection:text-[#fff]">
      <SnapScroll />

      <header className="sticky top-0 z-50 border-b border-ink/10 bg-[#F1F8EF]/90 backdrop-blur-md">
        <div className="container-site flex h-20 items-center justify-between">
          <Link href="/" className="group inline-flex items-center gap-2.5 transition-transform hover:scale-105" aria-label="Back to ArkaShine Home">
            <ArrowLeft className="h-4 w-4 text-emerald-900 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={1.75} />
            <Image
              src="/images/logo/arkashine-logo-bold-transparent.png"
              alt="ArkaShine"
              width={494} height={156}
              unoptimized
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>
          <EnquiryButton
            kind="partner"
            className="rounded-full bg-[#1E7A33] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-transform duration-300 hover:scale-105"
          >
            Partner with us
          </EnquiryButton>
        </div>
      </header>

      {/* 1 · Hero with both portal screens */}
      <section className={`${FRAME} bg-[#F1F8EF] py-10`}>
        <FloatingLeaves />
        <div className="container-site relative z-10 grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-botanical-dark/25 bg-white px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-botanical-dark shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              School Innovation Lab
            </div>

            <h1 className="display mt-6 text-[clamp(2.4rem,4.4vw,4.4rem)] font-bold leading-[1.05] tracking-tight text-forest [text-wrap:balance]">
              Young scientists. <span className="text-botanical-dark">Real farmland.</span>
            </h1>

            <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-ink/70 sm:text-lg">
              A 4-week summer lab: learn soil science, test soil, advise farmers.
            </p>

            <div className="mt-8 grid grid-cols-4 gap-3">
              {STATS.map((m) => (
                <div key={m.label} className="rounded-2xl border border-ink/5 bg-white px-3 py-3 shadow-[0_10px_30px_-12px_rgba(19,32,27,0.25)]">
                  <div className="font-mono text-xl font-bold text-botanical-dark sm:text-2xl">{m.val}</div>
                  <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#student-portal"
                className="inline-flex items-center gap-2 rounded-full bg-[#1E7A33] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <LayoutDashboard className="h-4 w-4" />
                Student portal
              </a>
              <a
                href="#interactive-booklet"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-forest transition-all hover:bg-ivory-2"
              >
                <BookOpen className="h-4 w-4 text-botanical-dark" />
                Open the booklet
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="mx-auto max-w-[min(100%,calc((100svh-9rem)*1.25))]">
              <PortalScreens3D />
            </div>
          </div>
        </div>
      </section>

      {/* 2 · Student dashboard */}
      <div id="student-portal" className="snap-start">
        <StudentDashboardShowcase />
      </div>

      {/* 3 · Highlights booklet, opens from the centre by itself */}
      <section
        id="interactive-booklet"
        className={`${FRAME} bg-white py-8`}
      >
        <div className="container-site relative w-full max-w-7xl">
          <div className="mx-auto mb-2 max-w-2xl text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-botanical-dark/25 bg-white px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-botanical-dark shadow-sm">
              <BookOpen className="h-3.5 w-3.5" />
              Student booklet
            </span>
            <h2 className="display text-3xl font-bold text-forest [text-wrap:balance] sm:text-5xl">The Young Soil Scientist&rsquo;s Playbook</h2>
            <p className="mt-2 text-sm text-ink/60">Key pages from the 63-page student activity book.</p>
          </div>
          <Booklet3D />
        </div>
      </section>

      {/* 4 · Certificate */}
      <SchoolCertificate />

      {/* 5 · Partner */}
      <section id="school-inquiry" className={`${FRAME} bg-[#eaf5dc] py-16`}>
        <FloatingLeaves />
        <div className="container-site relative max-w-4xl text-center">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-botanical-dark/25 bg-white px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-botanical-dark shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Summer 2026 intake
          </span>
          <h2 className="display text-4xl font-bold text-[#162a54] [text-wrap:balance] sm:text-6xl">Bring the lab to your school.</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#3f4f6b]">
            For schools, educational trusts and CSR programmes. We bring the kit, the training and the field support.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <EnquiryButton
              kind="proposal"
              className="inline-flex items-center gap-2 rounded-full bg-[#1E7A33] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-xl transition-all hover:scale-105"
            >
              Request a proposal
              <ChevronRight className="h-4 w-4" />
            </EnquiryButton>
            <EnquiryButton
              kind="message"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-forest transition-colors hover:bg-ivory-2"
            >
              Email us
            </EnquiryButton>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-3 border-t border-[#162a54]/10 pt-8 sm:grid-cols-3">
            {[
              ["Kit included", "SoiLenz 2.0, reagents and booklets"],
              ["Teacher training", "Hands-on sessions before day one"],
              ["Field support", "Village visits with our team"],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-ink/5 bg-white px-4 py-4 text-left shadow-[0_10px_30px_-14px_rgba(19,32,27,0.3)]">
                <div className="font-display text-base font-bold text-forest">{t}</div>
                <div className="mt-1 text-xs text-ink/60">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ContactStrip />
    </div>
  );
}
