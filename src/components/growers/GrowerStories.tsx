"use client";

/**
 * Strawberry & dragon fruit — a cover banner, then one field guide per crop:
 * a photo of growers at work, a practice gallery and a stage-by-stage agronomy plan.
 * Photos: Wikimedia Commons (CC BY-SA 4.0 / public domain, credited on each image).
 * Guidance is general agronomy, not quotes from named farmers.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, CheckCircle2, Droplets, FlaskConical, Leaf, MapPin, Scissors, ShieldCheck, Shovel, Sprout, Sun } from "lucide-react";

const WM = "https://upload.wikimedia.org/wikipedia/commons/thumb";
type Img = { src: string; alt: string; credit: string; href: string };

const img = (path: string, file: string, alt: string, credit: string): Img => ({
  src: `${WM}/${path}/${file}/1280px-${file}`,
  alt,
  credit,
  href: `https://commons.wikimedia.org/wiki/File:${decodeURIComponent(file)}`,
});

const RD = "Rangan Datta Wiki, CC BY-SA 4.0";
const VR = "Vikas Rana, CC BY 2.0";
const EB = "eclicks_by_bunny, CC BY-SA 4.0";
const PJ = "PJeganathan, CC BY-SA 3.0";
const MP = "Mike Prince, CC BY 2.0";
const NDL = (code: string, path: string, alt: string) =>
  img(path, `Dragaonfruit_%28Pitaya%29_farm_in_Nandyal_District_%28${code}%29.jpg`, alt, PJ);

/* every photo below is from an Indian farm */
const P = {
  sKashmir: img("7/78", "Packing_Strawberries_%2814574895731%29.jpg", "Farmers sorting freshly picked strawberries in Jammu and Kashmir", MP),
  sSorting: img("4/43", "At_Strawberry_Fields%2C_Mahabaleshwar_%284662726736%29.jpg", "Farm worker sorting freshly picked strawberries into trays", VR),
  sPolyhouse: img("0/04", "Strawberry_Farm%2C_Mahabaleshwar_3.jpg", "Farm workers tending mulched strawberry beds inside a polyhouse", RD),
  sBeds: img("3/35", "Strawberry_farm_in_Lambasinghi.jpg", "Raised strawberry beds with plastic mulch at Lambasingi, Andhra Pradesh", EB),
  sDrip: img("2/2b", "Strawberry_Fields%2C_Mahabaleshwar_%284662719512%29.jpg", "Strawberry rows on mulch with drip lines", VR),
  dHarvest: NDL("46880", "5/51", "Farm worker emptying a basket of freshly harvested dragon fruit, Nandyal district, Andhra Pradesh"),
  dRows: img("4/47", "Dragonfruit_farm_in_Andhra_Pradesh_IMG_20251123_132312908.jpg", "Dragon fruit rows on concrete posts with drip lines, Andhra Pradesh", "PJeganathan, CC BY-SA 4.0"),
  dPosts: NDL("54636", "b/b1", "Young dragon fruit plants trained up concrete posts, Nandyal district"),
  dDrip: NDL("80597", "d/d0", "Drip irrigation filter unit on a dragon fruit farm, Nandyal district"),
  dShed: NDL("75338", "a/a8", "Freshly harvested dragon fruit spread out for sorting in the farm shed, Nandyal district"),
};

type Practice = { icon: typeof Leaf; stage: string; t: string; d: string };

const CROPS = [
  {
    id: "strawberry",
    crop: "Strawberry",
    region: "",
    color: "#dc2626",
    soft: "#fee2e2",
    hero: P.sPolyhouse,
    title: "Strawberry",
    lede: "Strawberry rewards slightly acidic, airy, living soil. Test before you plant, feed the soil rather than just the plant, and keep fruit off the ground.",
    gallery: [
      { img: P.sBeds, label: "Raised, mulched beds" },
      { img: P.sDrip, label: "Drip under mulch" },
      { img: P.sSorting, label: "Sorted by hand" },
    ],
    facts: [
      ["Soil pH", "5.5 – 6.5"],
      ["Season", "Sep–Oct planting · Dec–Apr harvest"],
      ["Spacing", "30 × 30 cm, 2–4 rows per bed"],
      ["Water", "Drip, little and often"],
    ],
    practices: [
      { icon: FlaskConical, stage: "Before planting", t: "Test the soil", d: "Check pH, organic carbon and N-P-K. Correct pH and add well-rotted FYM or vermicompost (8–10 t/acre) during land preparation." },
      { icon: Shovel, stage: "Land prep", t: "Raised beds", d: "Beds about 15–20 cm high and 90–100 cm wide give drainage and root air. Lay drip lines before the mulch." },
      { icon: Leaf, stage: "Planting", t: "Healthy runners + mulch", d: "Plant disease-free runners with the crown at soil level. Cover beds with straw or plastic mulch to save water and keep berries clean." },
      { icon: Droplets, stage: "Growth", t: "Steady moisture, living soil", d: "Drip irrigate lightly; never waterlog. Give a Jeevamrutham drench through drip every 15–20 days to keep soil biology active." },
      { icon: ShieldCheck, stage: "Protection", t: "Prevent before you spray", d: "Remove old leaves and runners, keep airflow in polyhouses, and use Neemastra at the first sign of sucking pests." },
      { icon: Scissors, stage: "Harvest", t: "Pick every 2–3 days", d: "Harvest in the cool morning when berries are three-quarters to fully red. Handle by the stalk and cool quickly." },
    ] as Practice[],
  },
  {
    id: "dragon",
    crop: "Dragon fruit",
    region: "Andhra Pradesh",
    color: "#d97706",
    soft: "#fef3c7",
    hero: P.dRows,
    title: "Strong posts, light soil, steady feeding",
    lede: "Dragon fruit is a climbing cactus: it needs sturdy support, free-draining soil and organic matter at every post — and it hates standing water.",
    gallery: [
      { img: P.dPosts, label: "Young plants on posts" },
      { img: P.dDrip, label: "Filtered drip water" },
      { img: P.dShed, label: "Harvest sorted in the shed" },
    ],
    facts: [
      ["Soil pH", "6.0 – 7.0, well drained"],
      ["Spacing", "≈ 3 × 3 m, 4 plants per post"],
      ["First fruit", "12–18 months after planting"],
      ["Fruiting", "Jun–Nov, in flushes"],
    ],
    practices: [
      { icon: FlaskConical, stage: "Before planting", t: "Know your field", d: "Test pH, organic carbon and nutrients. Avoid low spots; raise the planting area if water stands after rain." },
      { icon: Shovel, stage: "Land prep", t: "Posts and pits", d: "Set concrete or wooden posts with a ring or frame on top. Fill each pit with topsoil, compost and a little sand." },
      { icon: Sprout, stage: "Planting", t: "Rooted cuttings", d: "Plant 3–4 healthy, cured cuttings around each post and tie them up as they climb. Remove side shoots until they reach the top." },
      { icon: Leaf, stage: "Nutrition", t: "Compost at every post", d: "Ring each post with vermicompost or FYM every season. Apply Ghanajeevamrutham and Panchagavya before the flowering flush." },
      { icon: Droplets, stage: "Water", t: "Light and regular", d: "Drip in small doses, more during flowering and fruit set, less in winter. Never let water stand at the base." },
      { icon: Sun, stage: "Harvest", t: "Pick at full colour", d: "Fruit is ready about 30–35 days after flowering, when the skin turns fully coloured. Prune old, crowded stems after harvest." },
    ] as Practice[],
  },
];

function Credit({ img }: { img: Img }) {
  return (
    <a href={img.href} target="_blank" rel="noopener noreferrer" className="absolute bottom-2 right-2 max-w-[92%] truncate rounded bg-black/45 px-2 py-0.5 text-[10px] text-[#fff] hover:underline">
      {img.credit}
    </a>
  );
}

function Photo({ img, className = "", eager = false }: { img: Img; className?: string; eager?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={img.src} alt={img.alt} className={`h-full w-full object-cover ${className}`} loading={eager ? "eager" : "lazy"} />
  );
}

function CropGuide({ c, flip }: { c: (typeof CROPS)[number]; flip: boolean }) {
  const [open, setOpen] = useState(0);
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: "spring", stiffness: 80, damping: 16 }}
      className="overflow-hidden rounded-[28px] border border-[#162a54]/10 bg-[#fff] shadow-[0_30px_60px_-40px_rgba(22,42,84,0.45)]"
    >
      <div className={`grid grid-cols-1 lg:grid-cols-2 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
        {/* photos */}
        <div className="relative">
          <div className="group relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-[420px]">
            <Photo img={c.hero} className="transition-transform duration-[2s] group-hover:scale-105" />
            <span className="absolute left-4 top-4 rounded-full px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#fff] shadow" style={{ background: c.color }}>
              {c.crop}
            </span>
            {c.region && (
              <span className="absolute bottom-9 left-4 inline-flex items-center gap-1 rounded-full bg-[#fff]/95 px-2.5 py-1 text-xs font-semibold text-[#162a54]">
                <MapPin className="h-3.5 w-3.5" style={{ color: c.color }} /> {c.region}
              </span>
            )}
            <Credit img={c.hero} />
          </div>
          <div className="grid grid-cols-3 gap-1 bg-[#fff] p-1">
            {c.gallery.map((g, i) => (
              <motion.figure
                key={g.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg"
              >
                <Photo img={g.img} className="transition-transform duration-700 group-hover:scale-110" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2 pb-1.5 pt-6 text-[11px] font-semibold leading-tight text-[#fff] sm:text-xs">
                  {g.label}
                </figcaption>
                <a href={g.img.href} target="_blank" rel="noopener noreferrer" className="absolute inset-0" aria-label={`Photo credit: ${g.img.credit}`} title={g.img.credit} />
              </motion.figure>
            ))}
          </div>
        </div>

        {/* guide */}
        <div className="p-6 sm:p-8">
          <h3 className="font-display text-2xl font-bold text-[#162a54] sm:text-3xl">{c.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-[#3f4f6b]">{c.lede}</p>

          <dl className="mt-5 grid grid-cols-2 gap-2">
            {c.facts.map(([k, v]) => (
              <div key={k} className="rounded-xl border border-[#162a54]/10 bg-[#fbf7ee] px-3 py-2">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#5b6575]">{k}</dt>
                <dd className="mt-0.5 text-sm font-semibold text-[#162a54]">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#162a54]">
            <CalendarDays className="h-4 w-4" style={{ color: c.color }} /> Agronomy practices, stage by stage
          </p>
          <ol className="mt-3 space-y-2">
            {c.practices.map((p, k) => {
              const Icon = p.icon;
              const on = open === k;
              return (
                <li key={p.t}>
                  <button
                    type="button"
                    onClick={() => setOpen(on ? -1 : k)}
                    aria-expanded={on}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${on ? "border-transparent" : "border-[#162a54]/10 hover:bg-[#fbf7ee]"}`}
                    style={on ? { background: c.soft } : undefined}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#fff]" style={{ background: c.color }}>
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#5b6575]">
                        0{k + 1} · {p.stage}
                      </span>
                      <span className="block font-semibold text-[#162a54]">{p.t}</span>
                    </span>
                    <span className={`text-lg text-[#162a54] transition-transform ${on ? "rotate-45" : ""}`}>+</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden px-3 text-sm leading-relaxed text-[#3f4f6b]"
                      >
                        <span className="block pb-2 pl-12 pt-2">{p.d}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ol>

          <p className="mt-5 flex items-start gap-2 rounded-xl bg-[#e7f4f3] px-3 py-2.5 text-sm text-[#162a54]">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" />
            Test the soil with SoiLenz before each season and adjust these doses to your report.
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export function GrowerStories() {
  return (
    <section className="relative overflow-hidden bg-[#fff] py-20 sm:py-24">
      <div className="container-site relative max-w-6xl">
        {/* cover banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 70, damping: 16 }}
          className="relative grid h-[360px] grid-cols-2 overflow-hidden rounded-[32px] shadow-[0_40px_80px_-40px_rgba(22,42,84,0.5)] sm:h-[460px]"
        >
          {[P.sKashmir, P.dHarvest].map((im) => (
            <div key={im.src} className="group relative overflow-hidden">
              <Photo img={im} eager className="transition-transform duration-[2s] group-hover:scale-110" />
            </div>
          ))}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0e1f40]/85 via-[#0e1f40]/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fff]/95 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#162a54]">
              <Sprout className="h-3.5 w-3.5 text-[#d97706]" /> Grower field guides
            </span>
            <h2 className="display mt-3 max-w-[20ch] text-3xl font-bold text-[#fff] sm:text-5xl">Strawberry &amp; dragon fruit, grown naturally.</h2>
            <p className="mt-2 max-w-xl text-sm text-[#fff]/90 sm:text-base">From soil test to harvest: how Indian growers raise these crops, season by season.</p>
          </div>
          <span className="absolute left-4 top-4 rounded-full bg-[#dc2626] px-3 py-1 font-mono text-xs font-bold uppercase text-[#fff] shadow">Strawberry</span>
          <span className="absolute right-4 top-4 rounded-full bg-[#d97706] px-3 py-1 font-mono text-xs font-bold uppercase text-[#fff] shadow">Dragon fruit</span>
        </motion.div>
        <p className="mt-2 text-right text-[11px] text-[#5b6575]">
          Photos:{" "}
          <a className="underline" href={P.sKashmir.href} target="_blank" rel="noopener noreferrer">{P.sKashmir.credit}</a>
          {" · "}
          <a className="underline" href={P.dHarvest.href} target="_blank" rel="noopener noreferrer">{P.dHarvest.credit}</a>
          {" · via Wikimedia Commons"}
        </p>

        <div className="mt-10 space-y-10">
          {CROPS.map((c, i) => (
            <CropGuide key={c.id} c={c} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
