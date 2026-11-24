# ArkaShine Website — Project Brief

This brief replaces all earlier briefs. When something here conflicts with earlier work, THIS FILE WINS.

---

## 1. TOOLS — USE ALL OF THEM

- **UI UX Pro Max skill** (`.agent/skills`): consult it for layout, spacing, type scale, colour contrast, accessibility on every section.
- **Motion** (motion.dev) skill + Motion MCP: every animation uses Motion (`motion/react`: `useScroll`, `useTransform`, `useSpring`, `whileInView`, `AnimatePresence`, `layout`, stagger). Check Motion MCP docs before writing animation code.
- **21st.dev** MCP + skills: search 21st.dev first for: navbar, bento grid, logo marquee, tabs, accordion, stats/counters, testimonial, footer, form. Adapt them to the brand below; do not ship their default styling.
- **Stack:** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui.
- **3D:** `three` + `@react-three/fiber` + `@react-three/drei`. 3D components are client-only (`"use client"`, loaded with `next/dynamic(..., { ssr: false })`). The `<Canvas>` parent MUST have an explicit height (e.g. `h-screen`) or nothing renders.

---

## 2. WHO WE ARE / POSITIONING

- **Company:** ArkaShine Innovations Pvt Ltd, Bidar, Karnataka, India.
- **What we are:** an Indian deep-tech company that **designs and manufactures soil intelligence devices**. We are a DEVICE MANUFACTURER. We are NOT a soil-testing service. Never write "we test your soil".
- **What we make:** SoiLenz 2.0 and the pH/EC Bottle (ONLY these 2 products on the site for now).
- **Who buys / partners:** Distributors & dealers · FPOs · CSR programmes · Government & KVKs · Agri-input companies · Research institutions & universities · Soil entrepreneurs (Soil Partners).
- **Backed by:** DST NIDHI-EIR · Deshpande Startups, Hubli.
- **Brand lines (from our manual):** "Innovation in Agriculture for a Sustainable Future" · "Healthy soils. Brighter tomorrows."
- **Mission (placeholder until confirmed):** [Every farmer's fertiliser decision backed by real soil data.]
- **Naming:** always write **SoiLenz** (current model "SoiLenz 2.0"). Category name: **soil intelligence devices** / **portable soil lab**. Avoid "soil testing machine" in headlines.

---

## 3. PRODUCTS (only 2)

### SoiLenz 2.0
- Bench-top portable soil lab. White rounded body, glossy black top lid with blue "ArkaShine" logo, front black printer slot with white paper, metal knob top-right, "SOILENZ 2.0" label with leaf icon, black bottom drawer.
- Built-in thermal printer · Bluetooth to the Soil Partner app ("ArkaShine Verified" pairing) · automated 60-second mixing · in-device filtering (~5 min).
- Parameters: pH · EC · OC · N · P · K · Ca · Mg · S · Fe · Mn · Cu · Zn · B (+ temperature). Covers every Soil Health Card parameter plus Ca and Mg.
- Sample: 5 g soil + 40 ml extractant.
- Price (from report, confirm): [₹1,20,000 + GST]

### pH/EC Bottle
- Clear cylindrical bottle with amber liquid, white collar, blue push-button cap.
- Used with SoiLenz for pH and EC: 5 g soil + 50 ml extractant, 60-second mix each.

### In the box (confirm)
SoiLenz 2.0 · pH/EC Bottle · Soil Setter · Filter papers · Extractant · [Power adapter] · [Manual]

---

## 4. HOMEPAGE COPY (use exactly; minimal words; lowercase section labels)

- **Hero eyebrow:** ArkaShine · Bidar, India
- **Hero giant name:** SoiLenz 2.0
- **Hero headline:** Engineered in India. Built for the field. Trusted by farmers.
- **Hero sub (one line):** ArkaShine designs and manufactures soil intelligence devices.
- **Hero buttons:** Become a partner (primary) · Request a quote · Book a live demo
- **Hero spec tags:** 12 nutrients + pH & EC · Built-in printer · Bluetooth app · 60 s auto-mix
- **Rotation stop cards:** Built-in printer · One-touch control · Bluetooth to app · 13 patents · pH & EC in 60 s
- **what we make:** "Two devices. One mission: healthier soil." — SoiLenz 2.0: "A lab, built into one device." — pH/EC Bottle: "Soil chemistry in 60 seconds."
- **sample reading tiles:** pH 6.8 · EC 0.4 dS/m · N 279 kg/ha · 25 °C (chip: "Sample reading")
- **process tabs:** Prepare · Test · Print
- **our technology:** "Patented. Precise. Portable."
- **impact:** 13 patents · [X] devices deployed · [X] farmers reached · [X] states · [X] soil tests
- **who we work with:** "Built for those who feed India."
- **stories:** "Every test has a farmer behind it." (Nabarangpur, Odisha · Mayurbhanj, Odisha · Bidar, Karnataka)
- **recognition:** "Backed by India's innovation ecosystem."
- **closing CTA:** "Healthy soils. Brighter tomorrows." — button: Partner with ArkaShine
- **footer line:** ArkaShine Innovations — soil intelligence, made in India.

Rule: max 6 words per headline, max ~12 words per sentence, homepage body text under 30 words total.

---

## 5. THE 3D DEVICE STAGE (most important part)

### STRICT RULE
SoiLenz NEVER opens. No exploded view, no lid lifting, no transparent / see-through body, no internal parts (sensors, chamber, motor, circuits). The device is always closed and solid. Only the outside is shown.

### 5.1 Models
- Build SoiLenz 2.0 and the pH/EC Bottle procedurally in react-three-fiber to match section 3 (rounded box with bevel via ExtrudeGeometry or drei `RoundedBox`; canvas textures for logo and label).
- Make the models swappable: if `/public/models/soillenz.glb` or `/public/models/ph-bottle.glb` exists, load it with `useGLTF` instead of the procedural model.
- Materials: body = white, roughness ~0.35 (soft matte sheen); lid = black, roughness ~0.15 (glossy, reflective); knob = metal; logo = emissive blue so it can glow.

### 5.2 Stage
- Full-screen section, background radial gradient: lighter navy behind the device (#16245F) to deep navy (#0A1236) at edges.
- Invisible floor with soft oval contact shadow (drei `ContactShadows`) and faint floor reflection.
- Thin circular "turntable" line around the device base.
- Background particles: tiny brown + green points drifting slowly upward; drift speed reacts slightly to scroll velocity.
- Lighting: soft white key light top-right; **leaf-green rim light** behind-left (green edge glow); environment map (drei `Environment preset="studio"`) for reflections on the black lid.
- Light sweep: a bright highlight streak slides across the body during each rotation step (animated spot light or moving env highlight).

### 5.3 Scroll-driven rotation (pinned)
The stage section is ~500vh tall with a sticky 100vh inner container. Map scroll progress (Motion `useScroll` on the section) through `useSpring` (stiffness ~80, damping ~20) so movement has weight and slight overshoot. Scrolling up reverses everything.

| Progress | Device | Camera | UI |
|---|---|---|---|
| 0.00 – rest | Y 25°, X tilt 10°, gentle float | medium distance | Giant "SoiLenz 2.0" text BEHIND the device (device overlaps it). 4 frosted-glass spec tags float around the device, linked to it by thin lines. Scroll cue at bottom centre. |
| 0.00–0.20 – side | rotate Y to 90° (knob side) | drift slightly right | spec tags fade out; card "One-touch control" slides in from the side facing the viewer |
| 0.20–0.40 – top | tilt X forward to 45° so top + logo face camera; logo emissive pulse (glow) | zoom in closer | Bluetooth pulse rings expand from the logo; card "Bluetooth to app" |
| 0.40–0.60 – back | rotate Y to 180° | pull back wider | card "13 patents"; a "13" badge pops near the device |
| 0.60–0.80 – other side | rotate Y to 270° | drift left | pH/EC Bottle flies in from the right spinning fast on its own axis (like a coin), lands upright beside SoiLenz with a spring bounce; ring pulse; card "pH & EC in 60 s" |
| 0.80–1.00 – front | rotate Y to 360° (= front), X back to 0, facing camera straight | centre, medium | white paper slides out of the printer slot; 4 reading tiles pop out of the paper one by one; card "Built-in printer" |
| after pin | stage unpins | — | user can drag to rotate freely (drei `PresentationControls` or OrbitControls with damping, no zoom, polar limits) with momentum and spring back |

Rotation feel:
- Ease between faces: slow at each face, faster between them.
- Add a small Z-axis lean (±4°) during turns so it does not look robotic.
- Constant breathing float: ±3 px equivalent up/down, ~4 s cycle, shadow scales with it.
- At rest (and between scrolls), device tilts 5–8° toward the mouse cursor.

Stage UI helpers:
- Stop indicator: 6 dots vertically on the right edge; active dot = leaf green and elongated.
- Feature cards: frosted glass (`backdrop-blur`, white/8% fill, 1px white/15% border), 320 px wide, line icon + title only. Enter: slide 40 px from their side + fade, 500 ms spring. Exit: reverse.
- Scroll cue: small animated line + "scroll", disappears after 5% progress.

### 5.4 Performance and fallbacks
- Render the hero text and a static PNG of the device first; fade the canvas in when the model is ready (drei `useProgress`).
- `dpr={[1, 1.75]}`, frameloop paused when the stage is off-screen.
- **Mobile (<768 px):** no 500vh pin. Device sits above the text, auto-rotates slowly, swipe to spin; bottle docks and paper prints once on load. Shorter, lighter.
- `prefers-reduced-motion`: no auto-rotation, no float, cards shown statically; scroll still works.

---

## 6. DESIGN SYSTEM

### Colours (Tailwind tokens)
- `navy` #0F1B4C — hero, dark sections, headings on light
- `night` #0A1236 — 3D backdrop, footer
- `leaf` #2F9E44 — primary buttons, active states, progress bar
- `leaf-dark` #1E7A33 — hover, green text on light
- `blue` #3B82F6 — logo glow, Bluetooth pulse ONLY (tiny accents)
- `mint` #F1F8EF — light section background
- `white` #FFFFFF — cards, surfaces
- `muted` #5B6575 — labels, captions
- status: green / amber #E8A13A / red #C2410C — reading tiles only
Proportion: ~70% navy + white, 20% mint, 10% green. Section rhythm alternates dark → light → dark.

### Typography (Google Fonts)
- Display: a characterful bold grotesk (e.g. "Bricolage Grotesque" or "Clash Display"-like via Google alternative). NOT Inter, NOT Space Grotesk.
- Body: "Figtree" or similar clean sans.
- Numbers/specs: "JetBrains Mono" (lab-instrument feel).
- Scale (desktop → mobile ≈ 60%): hero name 120–160 px · section headline 56–72 px · card title 22–28 px · body 16 px · numbers 32–64 px mono · labels 12 px uppercase, letter-spacing 0.14em.
- Headlines: tight letter-spacing (-0.02em to -0.04em), `text-wrap: balance`.

### Grid & spacing
- 12-column grid, max width 1280 px, 24 px gutters, min 16 px side padding.
- Section padding: 128–160 px desktop, 72 px mobile.
- Spacing scale only: 4 · 8 · 16 · 24 · 32 · 48 · 64 · 96 · 128.

### Shapes & surfaces
- Cards 24 px radius; buttons and tags full pill.
- Shadows very soft and wide on light; on navy use 1 px light border instead.
- Frosted glass for anything floating over 3D.
- Icons: thin line icons (lucide), 1.5 px stroke. NEVER emoji.

### Motion language (everywhere)
- Entrance: opacity 0→1, y 24→0, scale 0.96→1, 500–700 ms, spring.
- Pop-ups: spring with small bounce.
- Stagger groups: 80 ms.
- Scroll-linked items move exactly with scroll (no delay).
- Headlines: word-by-word reveal on enter.
- Page must look complete at rest: nothing permanently invisible waiting for an observer.

### Components
- **Primary button:** leaf pill, 52 px tall, white text + arrow icon. Hover: darker, arrow slides 4 px, lifts 2 px. Magnetic: follows cursor slightly. Press: scale 0.97.
- **Secondary button:** outlined (white on dark, navy on light); hover fill grows left→right.
- **Spec tag:** small pill, frosted on dark / thin border on light, tiny green dot before text.
- **Cards:** white, 24 px radius, soft shadow; hover lift 6 px.
- **Inputs:** 52 px tall, 14 px radius, mint fill; focus = green border + soft green glow.
- **Focus ring:** visible 3 px leaf outline on every interactive element.

---

## 7. HOMEPAGE — SECTION BY SECTION (after the 3D stage)

**Layout update (client request):** the homepage now follows the UI of https://aerosound.framer.website/ (light page, Poppins headlines, night bars instead of pills, dot labels), with ArkaShine colours and all rules in section 9. Order: hero + highlights on one pinned stage → our technology (dark) → technical specs → what we make (product picker) → who we work with (field photo rows) → how it works (bento) → stories (dark) → recognition → FAQ → closing CTA (dark, device over bars) → footer. Where the list below differs, this order wins.

1. **Navigation** — 72 px fixed. Transparent over hero (white logo/links); after scroll: navy + blur, 64 px, bottom hairline. Logo left · links centre (Products, Solutions, Technology, About, Blog) · "Book a demo" leaf pill right. Link hover: green underline grows from centre. 2 px leaf scroll-progress bar at very top. Mobile: hamburger → full-screen navy menu, big stacked links, slide-in.

2. **3D stage** — section 5.

3. **what we make (mint)** — 2 big cards side by side (6 cols each, ~520 px tall). Product floats ABOVE the card's top edge (breaks out). Bottom: name, 3 pill tags, round arrow button. Hover: product rises 12 px and turns 15°, shadow grows, arrow slides. Enter: cards slide up staggered, products drop in from above with bounce. Each card links to its product page.

4. **sample reading tiles (white)** — 4 tiles in a row. Thin status bar on top (green/amber/red). Big mono number + small unit + tiny label. "Sample reading" chip at section corner. Tiles pop one by one; numbers count up.

5. **process tabs (navy)** — centred pill tab bar (Prepare · Test · Print), sliding green active background (Motion `layoutId`). Below: large visual area — phone mockup tilted 15° in 3D (straightens on hover) showing the matching app screen, plus the device. Switching tabs cross-fades + slides the visual. Auto-advance every 4 s until user clicks.

6. **image ribbon (light)** — horizontal strip of tall 3:4 images (360 px wide, 24 px radius) that moves sideways as you scroll down (scroll-linked `x`). Centre image scaled 1.1, edges smaller and faded; each image straightens from a slight 3D tilt as it passes centre. Images: product angles, app screen, field photos ([placeholders] until provided). Mobile: swipe carousel with snap.

7. **our technology / impact (navy)** — headline "Patented. Precise. Portable." then 5 columns with thin vertical dividers: line icon (pops with bounce) above a giant mono number (counts up) and a tiny label. Very faint dotted India-map pattern in the background.

8. **who we work with (mint)** — bento grid: 2 large tiles (span 2 rows) + 5 small. Each: line icon in soft green circle, 2–3 word title, small corner arrow. Hover: 3D tilt toward cursor with depth layers (icon lifts forward), arrow slides. Enter: diagonal wave stagger. Each links to its solution page.

9. **stories (full-bleed)** — full-width photo with bottom dark gradient, location pill (pin icon) top-left, large italic quote bottom-left, name + role. Parallax (photo moves slower than scroll). Carousel arrows bottom-right.

10. **specs (white)** — 2 columns: left sticky product image, right spec rows (grey label left, bold value right, hairline dividers). Parameters as one pill row. "In the box" as a row of small product icons with names. Rows fade in one by one.

11. **recognition / partner logos** — infinite marquee, grey logos → colour on hover, faded edges (mask).

12. **closing CTA (navy)** — big centred headline, 3 buttons (leaf filled + 2 outlined), small slowly spinning SoiLenz in the bottom-right corner, soft green glow behind headline.

13. **footer (night)** — 4 columns (logo + line · Products · Company · Contact), newsletter input with green arrow button inside, bottom row copyright left + social icons right (green on hover). Phone: 9611297893. Address: Bidar, Karnataka 585403. Email: [contact email] (do NOT use the personal Gmail from the manual).

14. **Mobile sticky bar** — bottom bar with "Book a demo" + WhatsApp icon.

---

## 8. OTHER PAGES

- **/products/soillenz** and **/products/ph-ec-bottle** — shorter 3D stage (one rotation), sticky sub-nav (Overview · Specs · In the box · Downloads · FAQ), full spec table, sample report download card, [validation / accuracy data], warranty · AMC · training, FAQ accordion (+ rotates to ×, answer slides open), CTA.
- **/about** — SomniQ-style poster hero (one word per line), short origin story (Bidar), mission, 3 principles with big outlined numbers 01/02/03, team portraits 3:4 (grey → colour on hover), backers, **patents**: verified IN 387972 (2022, apparatus and method for soil testing, fluorescence-based capillary electrophoresis, application 202141028625), IN 419926 (2023), IN 559652 (granted 6 Feb 2025) + [10 more to confirm] — medallion row or rotating ring, click opens side panel with "Verify on IP India" link (https://iprsearch.ipindia.gov.in/PublicSearch/). Horizontal timeline of years.
- **/solutions/[fpo|csr|corporate|ngo|government|distributors|entrepreneurs]** — split hero (text left, device right), 3 benefit tiles, one story, CTA. FPO and entrepreneurs pages include the ROI calculator (sliders: price per test, tests per day, working days; machine cost [₹1,20,000]; live cumulative bar chart vs cost line; note "illustrative gross revenue") and an "FPO guide" download.
- **/case-studies** — Nabarangpur, Mayurbhanj, Bidar with [numbers].
- **/blog** — CropIQ-style: featured post full width, then 3-column grid (16:10 image, category pill, date, title; image zooms on hover).
- **/contact** (Partner / Quote / Demo) — 2 columns: contact info + map card left, form right. Fields: name, phone, organisation, organisation type as clickable pills (Distributor · FPO · CSR · Government/KVK · Agri-input · Research · Entrepreneur · Other), farmers served, states, interest (Partner · Quote · Demo · Pilot). Success state: form morphs into an animated green tick.

---

## 9. RULES

- Never show the inside of SoiLenz (section 5 strict rule).
- Only 2 products.
- We are a manufacturer; never claim to provide a soil-testing service.
- Minimal words; every section has one strong visual (product, number, photo or tile). If a section has more words than visuals, cut words.
- Placeholders in [square brackets] for anything unconfirmed: farmers reached, devices deployed, states, tests run, yield/profit %, test time, accuracy data, warranty/AMC, case-study numbers, price, the 10 unverified patents, "made in Bidar" manufacturing claim, mission, contact email.
- Manual screenshot values (e.g. pH 12.68) are demo data — never show them. Use only the sample values in section 4, labelled "Sample reading".
- Footnote every claim that needs evidence.
- Accessibility: WCAG AA contrast, keyboard reachable, visible focus, alt text, reduced-motion support.
- Performance: text first, 3D lazy-loaded, images lazy-loaded and optimised (next/image), target 60 fps.
- SEO: one H1 per page, meta title + description per page, semantic HTML.

---

## DEVELOPMENT NOTES
- Run: `npm run dev` → http://localhost:3000. Production check: `npm run build`.
- Next.js 16 with `cacheComponents` on: read `node_modules/next/dist/docs/` before using unfamiliar APIs.
- Copy and data live in `src/lib/content.ts`. Wrap unconfirmed claims in `[square brackets]`; `<Txt>` highlights them on the page.
- 3D stage: `src/components/stage/*` (closed device only). Pose keyframes live in `src/components/stage/timeline.ts`.
- `?3d=0` turns the 3D off (shows the static render). Never gate the 3D on screen width or prefers-reduced-motion: earlier the client never saw it because of that.
- Real models: drop `public/models/soillenz.glb` / `public/models/ph-bottle.glb` (detected at build time).
- Stage UI lives in `device-stage.tsx` and `highlight-rows.tsx`; sections in `src/components/home/*`.
- Static product renders in `public/images/render-*.webp` are captured from the procedural 3D models; re-capture if the models change.
- Forms validate and log to the server console only. Wire them to email/CRM before launch.
