import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  FlaskConical,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Shovel,
  Store,
  Tent,
  Users,
} from "lucide-react";
import { EnquiryButton } from "@/components/site/EnquiryButton";
import { ContactStrip } from "@/components/site/ContactStrip";

export const metadata: Metadata = {
  title: "Skill Development for Young Professionals | CSR Initiatives — ArkaShine",
  description:
    "ArkaShine CSR programmes train young professionals in soil sampling, SoiLenz testing and soil report reading, and help them start soil-testing micro-enterprises in their villages.",
};

const PILLARS = [
  {
    icon: GraduationCap,
    title: "Skill development",
    line: "Young professionals learn soil science and agri-tech, from soil basics to reading a full nutrient report.",
    photo: "/images/field-wall/ka-agri-conclave-03.webp",
    alt: "Young professionals learning about SoiLenz from the ArkaShine team",
  },
  {
    icon: Shovel,
    title: "Hands-on soil testing",
    line: "Trainees collect real samples in the field and run every step of the test on SoiLenz 2.0 themselves.",
    photo: "/images/field-wall/od-balasore-66.webp",
    alt: "Trainees collecting a soil sample from a farm in Arangapantei, Odisha",
  },
  {
    icon: Store,
    title: "Supporting micro-entrepreneurs",
    line: "Trained youth can become Soil Partners and run a soil-testing service for farmers in their own village.",
    photo: "/images/people/micro-entrepreneurs-soilenz.webp",
    alt: "Young micro-entrepreneurs standing with the SoiLenz soil testing kit and reagents",
  },
  {
    icon: Tent,
    title: "Field camps with farmers",
    line: "Programmes end in village camps, so trainees learn by doing and farmers get answers on the spot.",
    photo: "/images/field-wall/od-balasore-70.webp",
    alt: "A field camp: discussing soil results with farmers in Nilagiri, Odisha",
  },
];

const STEPS = [
  { icon: BookOpen, title: "Learn", line: "Soil basics, nutrients and the Soil Health Card." },
  { icon: Shovel, title: "Sample", line: "Collect, dry and sieve soil the right way." },
  { icon: FlaskConical, title: "Test", line: "Run SoiLenz 2.0 and the pH/EC bottle." },
  { icon: Users, title: "Advise", line: "Read the report and explain it to farmers." },
  { icon: Store, title: "Earn", line: "Start a village soil-testing micro-enterprise." },
];

const GALLERY = [
  { src: "/images/people/young-professionals-training.webp", place: "Rajasthan", alt: "Young professionals with their trainer after a SoiLenz training session" },
  { src: "/images/people/soil-training-hall.webp", place: "Training Centre", alt: "Certified soil testing training session and live practical demonstration" },
  { src: "/images/people/csr-cini-gujarat.webp", place: "CSR programme", alt: "Young professionals and programme staff with two SoiLenz devices and the testing kit" },
  { src: "/images/people/youth-field-outreach.webp", place: "Uttar Pradesh", alt: "A young professional explaining soil testing to village youth holding ArkaShine leaflets" },
  { src: "/images/people/fpo-farmers-field.webp", place: "Uttar Pradesh", alt: "A young professional speaking with farmers in a prepared field" },
  { src: "/images/people/soil-partner-women-up.webp", place: "Barabanki, Uttar Pradesh", alt: "A Soil Partner speaking with women farmers at a gram panchayat session" },
  { src: "/images/people/agri-university-training.webp", place: "Bengaluru, Karnataka", alt: "A trainer demonstrating SoiLenz to participants in a training room" },
  { src: "/images/people/kvk-presentation.webp", place: "Krishi Vigyan Kendra", alt: "ArkaShine team presenting SoiLenz to farmers at a KVK" },
  { src: "/images/field-wall/ka-agri-conclave-01.webp", place: "Karnataka Agri Conclave", alt: "Students trying a SoiLenz test at the Karnataka Agri Conclave" },
  { src: "/images/field-wall/od-bhadrak-04.webp", place: "Bhadrak, Odisha", alt: "Classroom training session for young professionals in Bhadrak" },
  { src: "/images/field-wall/od-balasore-54.webp", place: "Dahisahi, Odisha", alt: "Women farmers at a village soil camp" },
  { src: "/images/partners/naragunda-fpo-demo.jpg", place: "Naragunda FPO, Karnataka", alt: "Hands-on SoiLenz demonstration at Naragunda Farmers Producer Company" },
  { src: "/images/csr/lab-testing.webp", place: "ArkaShine lab", alt: "A trainee running soil tests in the lab" },
  { src: "/images/field-wall/od-balasore-64.webp", place: "Kumbhirgadi, Odisha", alt: "Trainees discussing soil sampling with farmers in the field" },
];

const OUTCOMES = [
  { val: "25,000+", label: "Farmers reached" },
  { val: "4,000+", label: "Soil tests completed" },
  { val: "8", label: "States reached" },
  { val: "KA · KL · TN · AP · OD · WB · RJ · UP", label: "Field programmes running" },
];

export default function SkillDevelopmentPage() {
  return (
    <div className="min-h-screen bg-[#F1F8EF] text-[#13201B] selection:bg-[#1E7A33] selection:text-[#fff]">
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-[#F1F8EF]/90 backdrop-blur-md">
        <div className="container-site flex h-20 items-center justify-between">
          <Link href="/" className="group inline-flex items-center gap-2.5 transition-transform hover:scale-105" aria-label="Back to ArkaShine Home">
            <ArrowLeft className="h-4 w-4 text-emerald-900 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={1.75} />
            <Image src="/images/logo/arkashine-logo-bold-transparent.png" alt="ArkaShine" width={494} height={156} unoptimized priority className="h-8 w-auto object-contain" />
          </Link>
          <EnquiryButton
            kind="partner"
            className="rounded-full bg-[#1E7A33] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-transform duration-300 hover:scale-105"
          >
            Partner a programme
          </EnquiryButton>
        </div>
      </header>

      <main id="main-content">
        {/* hero */}
        <section className="relative overflow-hidden py-14 sm:py-20">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#8CBF5F]/20 blur-[120px]" />
          <div className="container-site relative grid max-w-7xl items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1E7A33]/25 bg-white px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#1E7A33] shadow-sm">
                <HeartHandshake className="h-3.5 w-3.5" />
                CSR initiatives
              </div>
              <h1 className="display mt-6 text-[clamp(2.3rem,4.4vw,4.2rem)] font-bold leading-[1.05] tracking-tight text-[#162a54] [text-wrap:balance]">
                Skill development for <span className="text-[#1E7A33]">young professionals.</span>
              </h1>
              <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-[#13201B]/75">
                Our CSR programmes train rural youth in soil science and agri-tech. They learn by testing real soil with real farmers, and many go on to run their own soil-testing business.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <EnquiryButton
                  kind="partner"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1E7A33] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#17642a]"
                >
                  Partner a CSR programme <ArrowRight className="h-4 w-4" />
                </EnquiryButton>
                <a href="#programme" className="inline-flex items-center gap-2 rounded-full border border-[#162a54]/20 bg-white px-6 py-3.5 text-sm font-semibold text-[#162a54] transition-colors hover:border-[#1E7A33]">
                  How it works
                </a>
              </div>
            </div>

            {/* real-photo collage */}
            <div className="grid grid-cols-6 grid-rows-6 gap-3 sm:gap-4 lg:col-span-7 aspect-[5/4]">
              <figure className="relative col-span-4 row-span-4 overflow-hidden rounded-3xl shadow-xl">
                <Image src="/images/field-wall/ka-agri-conclave-02.webp" alt="Young professionals learning to run a SoiLenz test" fill priority sizes="(min-width:1024px) 520px, 66vw" className="object-cover" />
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white backdrop-blur-md">Training · Karnataka</figcaption>
              </figure>
              <figure className="relative col-span-2 row-span-3 overflow-hidden rounded-3xl shadow-xl">
                <Image src="/images/people/micro-entrepreneurs-soilenz.webp" alt="Young micro-entrepreneurs standing with SoiLenz" fill sizes="(min-width:1024px) 260px, 33vw" className="object-cover object-top" />
              </figure>
              <figure className="relative col-span-2 row-span-3 overflow-hidden rounded-3xl shadow-xl">
                <Image src="/images/field-wall/od-balasore-66.webp" alt="Trainees collecting a soil sample in the field" fill sizes="(min-width:1024px) 260px, 33vw" className="object-cover object-top" />
              </figure>
              <figure className="relative col-span-4 row-span-2 overflow-hidden rounded-3xl shadow-xl">
                <Image src="/images/field-wall/od-balasore-54.webp" alt="Women farmers at a village soil camp" fill sizes="(min-width:1024px) 520px, 66vw" className="object-cover object-[50%_30%]" />
              </figure>
            </div>
          </div>
        </section>

        {/* four pillars */}
        <section className="bg-white py-20 sm:py-28">
          <div className="container-site max-w-7xl">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#1E7A33]">What the programme covers</p>
            <h2 className="display mt-3 max-w-[22ch] text-[clamp(2rem,3.6vw,3.2rem)] font-bold leading-tight tracking-tight text-[#162a54]">
              Learn it. Do it. Earn from it.
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {PILLARS.map(({ icon: Icon, title, line, photo, alt }) => (
                <article key={title} className="group overflow-hidden rounded-3xl border border-[#162a54]/10 bg-[#F1F8EF] shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={photo} alt={alt} fill sizes="(min-width:640px) 50vw, 100vw" className="object-cover object-[50%_35%] transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex gap-4 p-6">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1E7A33] text-white">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-bold text-[#162a54]">{title}</h3>
                      <p className="mt-1.5 leading-relaxed text-[#13201B]/75">{line}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* programme steps */}
        <section id="programme" className="bg-[#12352f] py-20 text-white sm:py-28">
          <div className="container-site max-w-7xl">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#a7d48a]">How a programme runs</p>
            <h2 className="display mt-3 text-[clamp(2rem,3.6vw,3.2rem)] font-bold leading-tight tracking-tight">From trainee to young professional.</h2>
            <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {STEPS.map(({ icon: Icon, title, line }, i) => (
                <li key={title} className="relative rounded-3xl border border-white/12 bg-white/[0.05] p-6">
                  <span className="font-mono text-xs text-[#a7d48a]">0{i + 1}</span>
                  <Icon className="mt-4 h-7 w-7 text-[#8CBF5F]" strokeWidth={1.5} />
                  <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/75">{line}</p>
                  {i < STEPS.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-[#8CBF5F] lg:block" />}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* field gallery */}
        <section className="py-20 sm:py-28">
          <div className="container-site max-w-7xl">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#1E7A33]">Our young professionals</p>
            <h2 className="display mt-3 text-[clamp(2rem,3.6vw,3.2rem)] font-bold leading-tight tracking-tight text-[#162a54]">Trained. Certified. Field-ready.</h2>
            <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-4 [&>figure]:mb-4">
              {GALLERY.map((g, i) => (
                <figure key={g.src} className="group relative break-inside-avoid overflow-hidden rounded-3xl shadow-md">
                  <div className={`relative ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                    <Image src={g.src} alt={g.alt} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover object-[50%_30%] transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <figcaption className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white backdrop-blur-md">
                    <MapPin className="h-3 w-3" /> {g.place}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* outcomes + CTA */}
        <section className="bg-white py-20 sm:py-24">
          <div className="container-site max-w-7xl">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#1E7A33]">Clear outcomes for every programme</p>
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {OUTCOMES.map((o) => (
                <div key={o.label} className="rounded-3xl border border-[#162a54]/10 bg-[#F1F8EF] p-6">
                  <p className={`font-mono font-bold text-[#1E7A33] ${o.val.length > 8 ? "text-lg leading-snug sm:text-xl" : "text-3xl sm:text-4xl"}`}>{o.val}</p>
                  <p className="mt-2 text-sm text-[#5b6575]">{o.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#162a54] p-8 text-white sm:flex-row sm:items-center sm:p-10">
              <div>
                <h2 className="font-display text-2xl font-bold sm:text-3xl">Run a skill programme with ArkaShine.</h2>
                <p className="mt-2 text-white/75">For CSR teams, foundations, FPOs and training institutes.</p>
              </div>
              <EnquiryButton
                kind="partner"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#1E7A33] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#17642a]"
              >
                Partner with us <ArrowRight className="h-4 w-4" />
              </EnquiryButton>
            </div>
          </div>
        </section>
      </main>

      <ContactStrip />
    </div>
  );
}
