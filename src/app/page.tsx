"use client";

import { useState } from "react";
import { SmoothScroll } from "@/components/global/SmoothScroll";
import { SiteNav } from "@/components/cinema/SiteNav";
import { SoilToFarmHero } from "@/components/cinema/SoilToFarmHero";
import { AppShowcase, ProductReveal, SensorShowcase } from "@/components/cinema/ProductSections";
import { HowItWorksVideo } from "@/components/cinema/HowItWorksVideo";
import { EarthDeployments } from "@/components/cinema/EarthDeployments";
import { EcosystemRibbon, FaqContact, FarmerImpact } from "@/components/cinema/StorySections";
import { PatentShowcase } from "@/components/cinema/PatentShowcase";
import { PartnerShowcase } from "@/components/home/PartnerShowcase";
import { AdvisoryReports } from "@/components/home/AdvisoryReports";
import { HomeBlogSection } from "@/components/home/HomeBlogSection";
import { HowWeWork } from "@/components/home/HowWeWork";
import { DemoModal } from "@/components/modals/DemoModal";
import { company } from "@/lib/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: company.name,
      telephone: "+91-" + company.phoneRaw,
      address: { "@type": "PostalAddress", streetAddress: "38, 1st Main Rd, 3rd Stage, 4th Block, SBI Staff Colony, Basaveshwar Nagar", addressLocality: "Bengaluru", addressRegion: "Karnataka", postalCode: "560079", addressCountry: "IN" },
      slogan: company.signOff,
    },
    {
      "@type": "Product",
      name: "SoiLenz 2.0",
      brand: { "@type": "Brand", name: "ArkaShine" },
      description: "Portable soil intelligence lab: pH, EC, OC and 11 nutrients, built-in thermal printer, Bluetooth app.",
      image: "/images/products/soillenz-2-studio.webp",
    },
  ],
};

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);
  const openDemo = () => setDemoOpen(true);

  return (
    <SmoothScroll>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav onBookDemo={openDemo} />
      <main id="main-content" className="home-light relative w-full overflow-x-clip">
        <SoilToFarmHero />
        <HowWeWork onBookSlot={openDemo} />
        <ProductReveal onBookDemo={openDemo} onQuote={openDemo} />
        <SensorShowcase />
        <HowItWorksVideo />
        <AppShowcase />
        <EarthDeployments />
        <FarmerImpact />
        <AdvisoryReports />
        <EcosystemRibbon />
        <PartnerShowcase />
        <PatentShowcase />
        <HomeBlogSection />
        <FaqContact onBookDemo={openDemo} onQuote={openDemo} />
      </main>
      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </SmoothScroll>
  );
}
