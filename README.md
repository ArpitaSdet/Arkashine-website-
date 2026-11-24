# ArkaShine Website

Website for **ArkaShine Innovations Pvt Ltd** (Bidar, Karnataka): soil intelligence devices (SoiLenz 2.0, pH/EC bottle), GeoLenz, advisory reports and partner programmes.

Built with **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS 4** and **Motion** for animation.

---

## Run it on your computer

You need **Node.js 20 or newer** (tested on Node 22).

```bash
npm install        # first time only
npm run dev        # start the site
```

Then open **http://localhost:3000**.

| Command | What it does |
|---|---|
| `npm run dev` | Development server with live reload |
| `npm run build` | Production build (run this before going live) |
| `npm start` | Serve the production build |
| `npm run lint` | Check the code for problems |

---

## Pages

| URL | Page |
|---|---|
| `/` | Home: hero film → How we work (5 steps) → SoiLenz 2.0 → pH/EC → app → field impact → advisory reports → who we work with → patents → blog → FAQ, contact |
| `/products` | SoiLenz 2.0, pH/EC bottle and upcoming devices |
| `/skill-development` | CSR initiatives: skill development for young professionals |
| `/soil-partners` | Soil Partner products (LeafLENZ, HarvestLENZ, Carbon) |
| `/growers` | Natural and organic farming protocols |
| `/school-innovation-lab` | School Innovation Lab and summer programme |
| `/research` | Ionolytix spectral research |
| `/satellite` | GeoLenz soil map and water content |
| `/privacy-policy`, `/shipping-policy`, `/cancellation-refund-policy` | Policy pages |

Every page ends with the **Contact us** strip (`src/components/site/ContactStrip.tsx`).

---

## Where things live

```
src/
  app/                      one folder per page (page.tsx), plus api/ for the forms
  components/
    cinema/                 home page sections (hero film, SoiLenz, stories, nav)
    home/                   home sections (HowWeWork, AdvisoryReports, blog…)
    products/ partners/ growers/ school/ research/ satellite/   page-specific parts
    site/                   shared pieces (ContactStrip, buttons, logo, policy layout)
  lib/
    content.ts              company details (phone, email, address) and copy
    cinema-content.ts       home page text, features, FAQ
    field-wall.json         list of real field photos
public/
  images/                   all images (see PHOTO_CREDITS.md)
    products/               product photos, main SoiLenz image: soillenz-2-studio.webp
    journey/                photos for the "How we work" steps
    advisory/               the 8 advisory report pages (page 1: report-p1-photo-name.webp)
    field/ field-wall/      real ArkaShine field photos
    logo/                   ArkaShine logos (navy, light, green)
  video/                    videos used on the site
```

### Common edits

- **Phone, email, address:** `src/lib/content.ts`
- **"How we work" steps (text, photos, cards):** `src/components/home/HowWeWork.tsx`
- **SoiLenz product photo:** replace `public/images/products/soillenz-2-studio.webp` (keep the name, or update the references)
- **Advisory report pages:** `public/images/advisory/` and `src/components/home/AdvisoryReports.tsx`
- **Hero "From the field" photos:** `FIELD_PHOTOS` in `src/components/cinema/SoilToFarmHero.tsx`

> Tip: when you replace an image, give the new file a **new name** and update the reference. Browsers and Next.js cache images by name, so an image replaced under the same name can keep showing the old version.

---

## Forms (Book a demo, enquiries)

Form submissions are emailed through **FormSubmit** (no account needed) by `src/lib/send-enquiry.ts`.

- Set the receiving address with the environment variable **`ENQUIRY_EMAIL`** (for example in a `.env.local` file, or in your hosting settings). If it is not set, the address written in `send-enquiry.ts` is used.
- The **first** submission sends a one-time "Activate form" email to that inbox. Click it once; after that, messages arrive normally.

## Settings (environment variables)

| Variable | Used for | Default |
|---|---|---|
| `ENQUIRY_EMAIL` | Inbox that receives form submissions | address in `src/lib/send-enquiry.ts` |
| `SCISPECTRUM_URL` | Separate research app (Flask, `app.py`) that sub-pages under `/research/...` are forwarded to | `http://127.0.0.1:5000` |

Put them in a `.env.local` file in this folder for local work, and in your hosting dashboard for the live site.

---

## Images and licences

All photo sources are listed in **`public/images/PHOTO_CREDITS.md`**:

- **Unsplash** and **Pexels** photos: free for commercial use, no credit required.
- **ArkaShine's own photos** (field visits, product image, farmer photos).
- Some photos were supplied by the team and may come from stock sites. **Please confirm their licence before launch** (noted in `PHOTO_CREDITS.md`).

Do not use images copied from Google Images. Most of them are copyrighted.

---

## Before going live

- [ ] Fix the type errors in `src/components/school/InteractiveFlipbook.tsx` (see Notes), then run `npm run build`
- [ ] Set `ENQUIRY_EMAIL` and activate FormSubmit (see above)
- [ ] Set `SCISPECTRUM_URL` if the research app is used
- [ ] Replace text still in `[square brackets]` with confirmed figures
- [ ] Confirm the licences of team-supplied photos
- [ ] Check every page on a phone

---

## Notes

- Large source files (the 10-second SoiLenz videos and the modules PowerPoint) are **not** part of the website. They were moved out to `Downloads/ArkaShine source files (moved from website)`.
- `node_modules/` and `.next/` are created automatically and are never uploaded.
- **Known issue:** `src/components/school/InteractiveFlipbook.tsx` has TypeScript type errors (an older problem). The site runs fine with `npm run dev`, but **`npm run build` will stop on these errors** until they are fixed.
