import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight, Sprout, Wrench, IndianRupee, GraduationCap } from "lucide-react";
import { PartnersHero } from "@/components/partners/PartnersHero";
import { ProductStory } from "@/components/partners/ProductStory";
import { EnquiryButton } from "@/components/site/EnquiryButton";
import { ContactStrip } from "@/components/site/ContactStrip";

export const metadata: Metadata = {
  title: "Soil Partners Ecosystem | Dedicated Field Products — ArkaShine",
  description:
    "LeafLENZ for plant health, HarvestLENZ for harvest grading and Carbon Intelligence for soil carbon credits — field products for ArkaShine Soil Partners.",
};

const PERKS = [
  { icon: Wrench, title: "Hardware package", body: "SoiLenz 2.0 + pH bottle" },
  { icon: IndianRupee, title: "Earn per test", body: "Revenue on every scan" },
  { icon: GraduationCap, title: "Full training", body: "Hands-on onboarding" },
];

export default function SoilPartnersPage() {
  return (
    <div className="min-h-screen bg-[#F1F8EF] font-sans text-[#13201B] selection:bg-emerald-200 selection:text-emerald-950">
      <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-[#F1F8EF]/90 backdrop-blur-md">
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
          <a
            href="#partner-inquiry"
            className="rounded-full bg-[#1E7A33] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 hover:bg-[#17642a]"
          >
            Become a partner
          </a>
        </div>
      </header>

      <PartnersHero />

      {/* three products */}
      <section id="product-deep-dive" className="relative overflow-hidden bg-white py-20 sm:py-28">
        <div className="container-site max-w-6xl space-y-24 sm:space-y-32">
          {/* Hardware & Services Integration */}
          <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-24">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-emerald-50 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-emerald-800">
              Hardware: SoiLenz 2.0 &amp; pH Bottle
            </span>
            <h2 className="display mt-3 text-3xl font-bold text-[#162a54] sm:text-4xl">
              3 Services Included with Your Hardware
            </h2>
            <p className="mt-3 text-sm text-[#3f4f6b]">
              With our hardware SoiLenz 2.0 and pH / EC bottle, you get these 3 field intelligence services:
            </p>
          </div>
          <ProductStory
            index="01"
            name="LeafLENZ"
            tag="Plant health"
            line="Scan a leaf. Get the disease and the cure."
            icon="scan"
            color="#059669"
            soft="#d1fae5"
            screens={[
              { src: "/images/app/soil-partners/leaflenz-home.jpg", label: "Scan" },
              { src: "/images/app/soil-partners/leaflenz-diagnosis.jpg", label: "Diagnosis" },
            ]}
            points={["Photo of the leaf", "Disease identified in seconds", "Organic or chemical treatment"]}
            result={{ value: 94.2, decimals: 1, suffix: "%", label: "Diagnosis confidence" }}
          />
          <ProductStory
            index="02"
            name="HarvestLENZ"
            tag="Harvest value"
            line="Grade the harvest. Protect the price."
            icon="trend"
            color="#d97706"
            soft="#fef3c7"
            flip
            screens={[
              { src: "/images/app/soil-partners/harvestlenz-home.jpg", label: "Intake" },
              { src: "/images/app/soil-partners/harvestlenz-result.jpg", label: "Grade" },
            ]}
            points={["Scan the fruit lot", "100-point quality grade", "Shelf-life and lot value"]}
            result={{ value: 75, suffix: "/100", label: "Quality grade" }}
          />
          <ProductStory
            index="03"
            name="Carbon Intelligence"
            tag="Carbon credits"
            line="Turn healthy soil into carbon income."
            icon="award"
            color="#4f7d2e"
            soft="#e3f0d6"
            screens={[
              { src: "/images/app/soil-partners/carbon-assessment.jpg", label: "Farm intake" },
              { src: "/images/app/soil-partners/carbon-metrics.jpg", label: "Credits" },
            ]}
            points={["Soil carbon from SoiLenz", "Credits per acre calculated", "Offset certificate issued"]}
            result={{ prefix: "₹", value: 65770, label: "Sample carbon revenue" }}
          />
        </div>
      </section>

      {/* partner CTA */}
      <section id="partner-inquiry" className="relative overflow-hidden bg-[#eaf5dc] py-24 sm:py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8CBF5F]/15 blur-[110px]" />
        <div className="container-site relative max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-emerald-900 shadow-sm">
            <Sprout className="h-4 w-4 text-emerald-600" />
            Partner with ArkaShine
          </div>
          <h2 className="display text-4xl font-bold text-[#162a54] [text-wrap:balance] sm:text-6xl">Bring field intelligence to your region.</h2>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {PERKS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="group rounded-3xl border border-emerald-900/10 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1.5 hover:border-emerald-600/40 hover:shadow-lg">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-[#162a54] transition-transform group-hover:-rotate-6 group-hover:scale-110">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <div className="mt-3 font-display text-lg font-bold text-emerald-950">{p.title}</div>
                  <div className="text-xs text-zinc-500">{p.body}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <EnquiryButton
              kind="partner"
              audience="soil-partner"
              className="inline-flex items-center gap-2 rounded-full bg-[#1E7A33] px-8 py-4 font-mono text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:scale-105 hover:bg-[#17642a]"
            >
              Request the partner pack
              <ChevronRight className="h-4 w-4" />
            </EnquiryButton>
            <EnquiryButton
              kind="message"
              audience="soil-partner"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-900/15 bg-white px-8 py-4 font-mono text-sm font-semibold uppercase tracking-wider text-[#162a54] transition-colors hover:bg-emerald-50"
            >
              Email us
            </EnquiryButton>
          </div>
        </div>
      </section>
      <ContactStrip />
    </div>
  );
}
