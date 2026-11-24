"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Sparkles,
  Sprout,
  Leaf,
  Bug,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Droplet,
  Beaker,
  Calendar,
  Layers,
  ArrowRight,
  Sun,
  Home,
  X,
  ChevronRight,
  ChevronLeft,
  Info,
  Maximize2,
  FlaskConical,
  Search,
  LayoutGrid,
  Tv,
  Table as TableIcon,
  Microscope,
  Check,
  SlidersHorizontal,
  Eye,
  BookOpen,
  Zap,
} from "lucide-react";
import { MethodsJourney } from "@/components/growers/MethodsJourney";
import { GrowerStories } from "@/components/growers/GrowerStories";
import { LivingProtocolViewer } from "@/components/growers/LivingProtocolViewer";
import { ContactStrip } from "@/components/site/ContactStrip";

interface StepPhoto {
  title: string;
  src: string;
  alt: string;
  caption: string;
}

interface MethodItem {
  id: number;
  name: string;
  category: "nutrition" | "pest" | "bio";
  type: string;
  readyIn: string;
  quantity: string;
  frequency: string;
  purpose: string;
  ingredients: { item: string; qty: string }[];
  steps: string[];
  application: {
    field: string;
    garden: string;
    timing: string;
  };
  shelfLife: string;
  precautions: string[];
  photos: StepPhoto[];
}

const METHODS: MethodItem[] = [
  {
    id: 1,
    name: "Beejamrutham",
    category: "nutrition",
    type: "Natural Seed Treatment",
    readyIn: "12–24 hours",
    quantity: "Coats seeds for 1 Acre",
    frequency: "Once, at sowing",
    purpose: "Protects seeds and seedlings from soil-borne diseases, fungal rots and stimulates rapid uniform germination.",
    ingredients: [
      { item: "Fresh Desi Cow Dung", qty: "5 kg" },
      { item: "Fresh Desi Cow Urine", qty: "5 L" },
      { item: "Slaked Lime (Chuna)", qty: "50 g" },
      { item: "Unchlorinated Water", qty: "20 L" },
      { item: "Native Field Bund Soil", qty: "1 handful" },
    ],
    steps: [
      "Tie 5 kg cow dung in a porous cloth and suspend it inside 20 L water for 12 hours.",
      "Squeeze the cloth bag thoroughly so the essence and soluble beneficial microbes dissolve into water.",
      "Dissolve 50 g lime in 1 L water in a separate earthen cup; let it settle overnight and take the clear supernatant.",
      "Add bund soil, cow urine and clear lime water into the dung solution and stir clockwise with a wooden stick.",
      "Ready in 12–24 hours. Coat seeds gently by hand or dip seedlings briefly before sowing.",
    ],
    application: {
      field: "Coat required seed quantity for 1 acre by hand. Dry in shade for 15–30 minutes, then sow same day.",
      garden: "Treat 100 g vegetable or flower seeds by lightly sprinkling 10–20 ml solution and drying in shade.",
      timing: "Always apply on sowing day. Do not store prepared solution.",
    },
    shelfLife: "Use fresh within 24 hours. Do not store.",
    precautions: [
      "Coat pulses and legume seeds very lightly to prevent seed coat splitting.",
      "Always shade-dry; never expose inoculated seeds to direct hot sunlight.",
    ],
    photos: [
    {
      title: "Beejamrutham Seed Coating Inoculum",
      src: "/images/organic-methods/01_Beejamrutham.jpg",
      alt: "Beejamrutham preparation with indigenous cow dung, urine, lime, and native soil for seed coating",
      caption: "Fresh indigenous cow dung, urine, slaked lime, and virgin bund soil prepared for protective seed coating.",
    },
  ],
  },
  {
    id: 2,
    name: "Jeevamrutham",
    category: "nutrition",
    type: "Soil Microbe Booster",
    readyIn: "5–7 days",
    quantity: "200 L per Acre",
    frequency: "Every 15–20 days",
    purpose: "Multiplies billions of beneficial soil bacteria and fungi, builds root biomass, and solubilizes locked soil nutrients.",
    ingredients: [
      { item: "Fresh Desi Cow Dung", qty: "10 kg" },
      { item: "Fresh Desi Cow Urine", qty: "10 L" },
      { item: "Organic Jaggery (Gud)", qty: "2 kg" },
      { item: "Pulse Flour (Besan/Gram)", qty: "2 kg" },
      { item: "Virgin Field Bund Soil", qty: "1 handful" },
      { item: "Unchlorinated Water", qty: "200 L" },
    ],
    steps: [
      "Fill a 200 L plastic drum or cement tank with unchlorinated well or rainwater.",
      "Add 10 kg cow dung, 10 L cow urine, 2 kg jaggery, 2 kg pulse flour, and a handful of fertile bund soil.",
      "Stir the liquid clockwise for 5–10 minutes using a clean wooden stick.",
      "Cover the drum mouth with breathable gunny cloth and store in shade, protected from direct rain.",
      "Stir clockwise morning and evening for 5–7 days (3–4 days in peak summer, up to 8 days in winter).",
      "Ready when a sweet fermented aroma develops with a surface froth.",
    ],
    application: {
      field: "Let 200 L per acre flow through irrigation channels, or apply as 10% filtered foliar spray (10 L in 100 L water).",
      garden: "Dilute 1 part Jeevamrutham in 10 parts water (1:10) and pour 100–200 ml per pot or grow bag every 2 weeks.",
      timing: "Apply only in early morning or late evening on moist soil.",
    },
    shelfLife: "Best used within 7–10 days of fermentation. Ferment fresh batch every 2 weeks.",
    precautions: [
      "Never use metal drums as natural fermentation acids react with metal.",
      "Always filter through fine muslin cloth before pouring into spray equipment.",
      "Do not mix with chemical fertilizers or synthetic fungicides.",
    ],
    photos: [
    {
      title: "Jeevamrutham Microbial Ferment (200 L)",
      src: "/images/organic-methods/02_Jeevamrutham.jpg",
      alt: "Jeevamrutham preparation in shaded barrel with cow dung, urine, jaggery, and pulse flour",
      caption: "Aerobic microbial fermentation multiplying billions of beneficial soil bacteria and fungi in 5–7 days.",
    },
  ],
  },
  {
    id: 3,
    name: "Ghanajeevamrutham",
    category: "nutrition",
    type: "Solid Microbe Base",
    readyIn: "7–10 days",
    quantity: "200 kg per Acre",
    frequency: "Basal (last ploughing)",
    purpose: "Storable solid form of Jeevamrutham; infuses dormant aerobic microbes along with rich organic matter into the topsoil.",
    ingredients: [
      { item: "Desi Cow Dung or FYM", qty: "100 kg" },
      { item: "Organic Jaggery", qty: "1 kg" },
      { item: "Pulse Flour (Besan)", qty: "1 kg" },
      { item: "Desi Cow Urine", qty: "5 L" },
      { item: "Virgin Bund Soil", qty: "1 handful" },
    ],
    steps: [
      "Mix all ingredients thoroughly into a dense paste on a clean cement floor or tarp.",
      "Heap into a mound and cover with moist gunny bags for 48 hours, turning once daily.",
      "Spread thinly in shade and allow to dry for 2–3 days.",
      "Break dry lumps into fine granules and pack into breathable gunny bags.",
    ],
    application: {
      field: "Broadcast 200 kg per acre during land preparation or last ploughing before seed sowing.",
      garden: "Mix 2–3 handfuls into potting mix or apply as top-dressing around plant stems.",
      timing: "Apply at planting or as basal dose for seasonal vegetable beds.",
    },
    shelfLife: "Stores up to 6 months in a cool, dry, shaded shed.",
    precautions: [
      "Never dry in direct sunlight as UV rays destroy beneficial microbial spores.",
      "Store in moisture-proof gunny bags away from rodents.",
    ],
    photos: [
    {
      title: "Ghanajeevamrutham Granular Base",
      src: "/images/organic-methods/03_Ghanajeevamrutham.jpg",
      alt: "Ghanajeevamrutham solid microbial granules prepared with cow dung, jaggery and pulse flour",
      caption: "Storable solid form of Jeevamrutham infusing dormant aerobic microbes into the topsoil during basal ploughing.",
    },
  ],
  },
  {
    id: 4,
    name: "Panchagavya",
    category: "nutrition",
    type: "Organic Growth Promoter",
    readyIn: "18–30 days",
    quantity: "20–25 L per season (3% spray)",
    frequency: "Every 10–15 days",
    purpose: "Boosts vegetative vigor, induces prolific flowering, prevents flower/fruit drop, and stimulates systemic immunity.",
    ingredients: [
      { item: "Fresh Desi Cow Dung", qty: "5 kg" },
      { item: "Pure Desi Cow Ghee", qty: "1 kg" },
      { item: "Desi Cow Urine", qty: "3 L" },
      { item: "Fresh Cow Milk", qty: "2 L" },
      { item: "Fresh Cow Curd", qty: "2 L" },
      { item: "Tender Coconut Water", qty: "3 L" },
      { item: "Organic Jaggery", qty: "1 kg" },
      { item: "Ripe Yellow Bananas", qty: "12 mashed" },
      { item: "Water", qty: "10 L" },
    ],
    steps: [
      "Mix 5 kg cow dung with 1 kg ghee in an earthen pot; stir twice daily for 3 days.",
      "Add 3 L cow urine and 10 L water; stir twice daily for 15 days.",
      "Add milk, curd, tender coconut water, jaggery syrup and mashed bananas.",
      "Ferment in shade for another 15 days, covered with a net, stirring twice daily.",
    ],
    application: {
      field: "Apply as a 3% foliar spray (30 ml per liter water; 6 L in 200 L tank per acre). For soil drenching, use 20 L/acre with irrigation.",
      garden: "Mix 15 ml in 1 liter of water and mist over balcony vegetables, flowering roses, and fruit trees.",
      timing: "Spray in the cool evening during pre-flowering and fruit set stages.",
    },
    shelfLife: "Shelf life of 30–60 days in a cool, shaded container.",
    precautions: [
      "Strain through double-layer muslin cloth to prevent sprayer nozzle blockage.",
      "Keep mouth of pot covered with net to prevent housefly egg-laying.",
    ],
    photos: [
    {
      title: "Panchagavya 5-Cow Bio-Promoter",
      src: "/images/organic-methods/04_Panchagavya.jpg",
      alt: "Traditional preparation combining 5 cow elements, tender coconut water, jaggery, and bananas",
      caption: "Powerful vegetative growth promoter combining 5 sacred cow elements, tender coconut water, jaggery, and bananas.",
    },
  ],
  },
  {
    id: 5,
    name: "Compost / Farmyard Manure (FYM)",
    category: "nutrition",
    type: "Soil Humus & Aeration",
    readyIn: "90–120 days",
    quantity: "5–10 tonnes per Acre",
    frequency: "Once, basal dose",
    purpose: "Builds deep soil organic carbon (SOC), creates spongy crumb structure, and restores microbial biodiversity.",
    ingredients: [
      { item: "Chopped Crop Residues & Leaves", qty: "1–2 tonnes" },
      { item: "Cattle Shed Waste & Dung", qty: "1 tonne" },
      { item: "Rich Topsoil Sprinkle", qty: "50 kg" },
      { item: "Water", qty: "As needed (60% moisture)" },
    ],
    steps: [
      "Dig a pit 1 m deep and 1.5 m wide in a shaded, raised area away from standing water.",
      "Add alternating layers: 15 cm crop waste, 5 cm cattle dung slurry, and a light soil sprinkle.",
      "Moisten to 60% and cover with thatch or gunny sheeting.",
      "Turn the heap every 15–20 days to aerate. Ready when dark brown, crumbly, and sweet-smelling.",
    ],
    application: {
      field: "Spread 5–10 tonnes per acre evenly and incorporate during summer ploughing.",
      garden: "Blend 30% compost with 50% garden soil and 20% cocopeat for ideal potting mix.",
      timing: "Apply 45 days before sowing or at initial bed preparation.",
    },
    shelfLife: "Stable indefinitely if kept protected from direct sun and heavy rain.",
    precautions: ["Never let compost dry out completely; maintain hand-squeeze moisture."],
    photos: [
    {
      title: "Farmyard Manure (FYM) & Aerated Compost",
      src: "/images/organic-methods/05_Compost_Farmyard_Manure_FYM.jpg",
      alt: "Rich decomposed farmyard manure and aerated compost heap",
      caption: "Dark crumbly organic humus restoring soil porosity, moisture holding, and deep soil organic carbon (SOC).",
    },
  ],
  },
  {
    id: 6,
    name: "Vermicompost",
    category: "nutrition",
    type: "Earthworm Bio-Castings",
    readyIn: "45–60 days",
    quantity: "1–2 tonnes per Acre",
    frequency: "Basal or top-dress",
    purpose: "Concentrated microbial castings packed with plant growth enzymes, humic acids, and bio-available micro-nutrients.",
    ingredients: [
      { item: "Pre-decomposed Cow Dung & Farm Biomass", qty: "100 kg" },
      { item: "Eisenia fetida Earthworms", qty: "1 kg (approx 1000 worms)" },
      { item: "Dry Paddy Husk & Straw Bedding", qty: "10 kg" },
    ],
    steps: [
      "Pre-decompose dung and farm biomass for 15–20 days until thermophilic heat dissipates.",
      "Lay a 6 cm coarse bedding base of straw/husk, then add 15–20 cm pre-decomposed material.",
      "Introduce Eisenia fetida worms (1 kg per 100 kg feed), cover with gunny and maintain 60–70% moisture.",
      "Stop watering for 2–3 days after 45 days so worms move downward. Skim and sieve top castings.",
    ],
    application: {
      field: "Apply 1–2 tonnes per acre in furrows or as top-dress around fruit tree drip lines.",
      garden: "Add 1–2 cups per pot monthly; sprinkle around root zones of tomatoes, peppers, and roses.",
      timing: "Can be applied anytime during growing season.",
    },
    shelfLife: "Use within 3 months; keep moist in shade.",
    precautions: [
      "Protect worm beds from ants, rats, predatory birds, and harsh sunlight.",
      "Never add fresh hot cow dung directly to active worm beds.",
    ],
    photos: [
    {
      title: "Vermicompost Earthworm Castings",
      src: "/images/organic-methods/06_Vermicompost.jpg",
      alt: "Vermicompost tank with Eisenia fetida red worms and sifted fine bio-castings",
      caption: "Eisenia fetida red worms actively breaking down farm biomass into enzyme-rich organic worm castings.",
    },
  ],
  },
  {
    id: 7,
    name: "Green Manuring",
    category: "nutrition",
    type: "In-Situ Biomass & Nitrogen",
    readyIn: "45–55 days",
    quantity: "20–25 kg seed per Acre",
    frequency: "Once per year / pre-monsoon",
    purpose: "Fixes 60–80 kg biological nitrogen per acre and incorporates 8–15 tonnes of tender green biomass directly into the root zone.",
    ingredients: [
      { item: "Sunhemp (Crotalaria juncea) or Dhaincha seed", qty: "20–25 kg / acre" },
    ],
    steps: [
      "Broadcast Sunhemp or Dhaincha seed with early pre-monsoon showers.",
      "Allow crop to grow vigorously for 45–50 days until 50% flowering occurs.",
      "Plough or rotavate directly into soil while succulent and tender.",
      "Wait 7–10 days for decomposition before sowing the main cash crop.",
    ],
    application: {
      field: "Incorporate with rotavator into moist soil before paddy, cotton, sugarcane or maize.",
      garden: "Grow cowpea or fenugreek in empty beds and chop into soil 1 week before planting.",
      timing: "45 days before main crop season.",
    },
    shelfLife: "N/A (in-situ live crop).",
    precautions: ["Incorporate strictly before stems turn woody and fibrous."],
    photos: [
    {
      title: "Sunnhemp & Dhaincha Green Cover Crop",
      src: "/images/organic-methods/07_Green_Manure.jpg",
      alt: "Lush flowering Sunnhemp and Dhaincha green manure cover crop in agricultural field",
      caption: "Leguminous in-situ green cover crop ploughed at 50% flowering to incorporate 15–20 tonnes of biomass and fix nitrogen.",
    },
  ],
  },
  {
    id: 8,
    name: "Neemastra",
    category: "pest",
    type: "Natural Pest Repellent",
    readyIn: "2 days",
    quantity: "200 L spray per Acre",
    frequency: "As needed on early pests",
    purpose: "Controls soft-bodied sucking insects: aphids, jassids, whiteflies, mealybugs and small first-instar caterpillars.",
    ingredients: [
      { item: "Crushed Fresh Neem Leaves", qty: "5 kg" },
      { item: "Fresh Desi Cow Dung", qty: "5 kg" },
      { item: "Fresh Desi Cow Urine", qty: "5 L" },
      { item: "Water", qty: "100 L (top up to 200 L)" },
    ],
    steps: [
      "Crush 5 kg fresh neem leaves into a coarse mash.",
      "Mix crushed leaves, 5 kg cow dung, and 5 L cow urine in 100 L water inside a drum.",
      "Ferment for 48 hours in shade, stirring clockwise 2–3 times daily.",
      "Filter thoroughly through fine cloth and dilute with water to 200 L total volume.",
    ],
    application: {
      field: "Spray 200 L per acre over both upper and lower leaf surfaces.",
      garden: "Fill hand trigger sprayer with filtered Neemastra and mist affected leaves thoroughly.",
      timing: "Spray in early evening when sucking pests are active.",
    },
    shelfLife: "Best used fresh within 5–7 days of preparation.",
    precautions: ["Always filter through fine muslin cloth to protect spray nozzles."],
    photos: [
    {
      title: "Neemastra Natural Azadirachtin Spray",
      src: "/images/organic-methods/08_Neemastra.jpg",
      alt: "Neemastra botanical preparation with crushed fresh neem leaves, cow dung and urine",
      caption: "Freshly harvested neem leaves crushed and fermented to release azadirachtin repellent targeting soft-bodied sucking pests.",
    },
  ],
  },
  {
    id: 9,
    name: "Agniastra",
    category: "pest",
    type: "Potent Borer & Caterpillar Spray",
    readyIn: "3 days",
    quantity: "6–8 L in 200 L water",
    frequency: "On heavy pest infestation",
    purpose: "Knocks down tough agricultural pests: stem borers, pod borers, leaf folders, and large voracious caterpillars.",
    ingredients: [
      { item: "Desi Cow Urine", qty: "20 L" },
      { item: "Neem Leaf Paste", qty: "2 kg" },
      { item: "Tobacco Powder", qty: "500 g" },
      { item: "Hot Green Chilli Paste", qty: "500 g" },
      { item: "Crushed Garlic Paste", qty: "50 g" },
    ],
    steps: [
      "Add neem paste, tobacco powder, chilli paste, and garlic into 20 L cow urine in a pot.",
      "Bring to a gentle boil while stirring continuously; simmer until volume reduces by half.",
      "Cool and ferment for 48 hours in shade, stirring twice daily.",
      "Filter through cloth. Concentrate is ready.",
    ],
    application: {
      field: "Mix 6–8 L concentrate in 200 L water and spray over crop canopy in late evening.",
      garden: "Dilute 30–40 ml concentrate in 1 L water for severe garden caterpillar outbreaks.",
      timing: "Apply upon first sighting of caterpillars or leaf folding.",
    },
    shelfLife: "Stores up to 3 months in a tightly capped container.",
    precautions: [
      "Wear gloves and eye protection when boiling and handling chilli/tobacco mixtures.",
      "Keep safely away from children and domestic pets.",
    ],
    photos: [
    {
      title: "Agniastra Potent Hot Botanical Decoction",
      src: "/images/organic-methods/09_Agniastra.jpg",
      alt: "Agniastra preparation with crushed garlic, green chilli, tobacco and neem leaves boiled in cow urine",
      caption: "Intense hot extract combining capsaicin, nicotine, and azadirachtin to penetrate tough borers and caterpillars.",
    },
  ],
  },
  {
    id: 10,
    name: "Brahmastra",
    category: "pest",
    type: "Broad-Spectrum Botanical",
    readyIn: "3 days",
    quantity: "6–8 L in 100–200 L water",
    frequency: "When pests appear",
    purpose: "Broad-spectrum pest deterrent controlling sucking pests, beetles, fruit flies, and leaf miners.",
    ingredients: [
      { item: "Desi Cow Urine", qty: "20 L" },
      { item: "Neem Leaf Paste", qty: "3 kg" },
      { item: "Custard Apple Leaf Paste", qty: "2 kg" },
      { item: "Papaya Leaf Paste", qty: "2 kg" },
      { item: "Pomegranate Leaf Paste", qty: "2 kg" },
      { item: "Guava Leaf Paste", qty: "2 kg" },
    ],
    steps: [
      "Pound all 5 botanical leaf varieties into fine pastes.",
      "Mix leaf pastes into 20 L cow urine and boil on low flame until reduced to half.",
      "Ferment 48 hours in shade with daily stirring, then filter through muslin cloth.",
    ],
    application: {
      field: "Mix 6–8 L concentrate in 100–200 L water per acre and spray crop thoroughly.",
      garden: "Dilute 40 ml in 1 L water for ornamental and vegetable garden insect control.",
      timing: "Spray in the cool evening hours.",
    },
    shelfLife: "Stores up to 6 months in a sealed glass or plastic carboy.",
    precautions: ["Ensure fine cloth filtration before adding to sprayers."],
    photos: [
    {
      title: "Brahmastra 5-Leaf Synergistic Extract",
      src: "/images/organic-methods/10_Brahmastra.jpg",
      alt: "Five bitter and astringent botanical leaves boiled in cow urine for broad-spectrum crop defense",
      caption: "Synergistic botanical extract utilizing 5 distinct pest-repellent alkaloid sources for broad-spectrum deterrent.",
    },
  ],
  },
  {
    id: 11,
    name: "Dashaparni Ark",
    category: "pest",
    type: "10-Leaf Botanical Armor",
    readyIn: "30 days",
    quantity: "3 L in 100 L water",
    frequency: "Preventive, every 15–20 days",
    purpose: "Universal natural preventative armor against fungal blights, viral vectors, and broad-spectrum insect infestations.",
    ingredients: [
      { item: "Neem Leaves", qty: "3 kg" },
      { item: "9 Other Pest-Repellent Leaves (Custard Apple, Papaya, Tulsi, Guava, Nirgundi, Calotropis, Castor, Lantana, Karanj)", qty: "2 kg each" },
      { item: "Desi Cow Dung", qty: "5 kg" },
      { item: "Desi Cow Urine", qty: "5 L" },
      { item: "Water", qty: "200 L" },
    ],
    steps: [
      "Crush all 10 leaf varieties into coarse paste.",
      "Combine crushed leaves, dung, and urine in 200 L water inside a shaded drum.",
      "Cover and ferment for 30 days in shade, stirring twice daily with a wooden stick.",
      "Filter thoroughly through fine cloth. Potent extract is ready.",
    ],
    application: {
      field: "Dilute 3 L extract in 100 L water per acre; apply as regular preventative spray.",
      garden: "Mix 30 ml in 1 L water and spray every 2 weeks on garden perennials and vegetable beds.",
      timing: "Preventative application during peak pest seasons.",
    },
    shelfLife: "Stores for 6 months in tightly closed containers.",
    precautions: ["Do not mix with chemical pesticides or synthetic fungicides."],
    photos: [
    {
      title: "Dashaparni Ark 10-Leaf Botanical Armor",
      src: "/images/organic-methods/11_Dashaparni_Ark.jpg",
      alt: "Dashaparni Ark fermentation barrel with ten distinct medicinal and insect-repellent plant leaves",
      caption: "Full-spectrum 30-day botanical fermentation providing universal systemic pest and fungal resistance.",
    },
  ],
  },
  {
    id: 12,
    name: "Rhizobium",
    category: "bio",
    type: "Symbiotic Nitrogen Fixer",
    readyIn: "Certified ready culture",
    quantity: "200–250 g per Acre",
    frequency: "Once, at seed sowing",
    purpose: "Colonizes roots of legumes (groundnut, soybean, gram, pulses) to form nodules and fix atmospheric nitrogen.",
    ingredients: [
      { item: "Certified Rhizobium Bio-Culture", qty: "200–250 g" },
      { item: "Jaggery (for adhesive slurry)", qty: "100 g in 500 ml boiled water" },
    ],
    steps: [
      "Boil 100 g jaggery in 500 ml water; cool completely to ambient room temperature.",
      "Mix 200–250 g Rhizobium culture into the jaggery water to make an adhesive slurry.",
      "Pour slurry over 1 acre of legume seed; mix gently so every seed receives a uniform coat.",
      "Dry in shade for 15–30 minutes and sow immediately into moist soil.",
    ],
    application: {
      field: "Seed inoculation at sowing for all pulse crops, beans, peas, and groundnut.",
      garden: "Treat bean and pea seeds before planting in containers.",
      timing: "Sow on the same day within 2–3 hours of coating.",
    },
    shelfLife: "6 months from manufacture date (check packet).",
    precautions: [
      "Never mix culture into hot jaggery water; heat destroys live bacteria.",
      "Keep packet away from direct sunlight and chemical fertilizer bags.",
    ],
    photos: [
    {
      title: "Rhizobium Legume Symbiotic Culture",
      src: "/images/organic-methods/12_Rhizobium.jpg",
      alt: "Rhizobium root nodules fixing nitrogen on legume roots and seed coating preparation",
      caption: "Symbiotic root-nodule bacterium that fixes 50–100 kg atmospheric nitrogen per hectare in pulse and legume crops.",
    },
  ],
  },
  {
    id: 13,
    name: "Azotobacter / Azospirillum",
    category: "bio",
    type: "Free-Living Nitrogen Fixer",
    readyIn: "Certified ready culture",
    quantity: "200–250 g seed or 2 kg soil",
    frequency: "Sowing / basal application",
    purpose: "Fixes biological nitrogen in non-legume crops (paddy, maize, wheat, millets, vegetables) and synthesizes root stimulants.",
    ingredients: [
      { item: "Azotobacter or Azospirillum Culture", qty: "200 g seed / 2 kg soil" },
      { item: "Moist FYM / Compost (for soil application)", qty: "50–100 kg" },
    ],
    steps: [
      "For Seed: Coat 200–250 g culture on seeds using cooled jaggery water; shade dry.",
      "For Soil: Mix 2 kg culture with 50–100 kg moist FYM; keep under shade overnight.",
      "Broadcast soil mix evenly before final ploughing or planting.",
    ],
    application: {
      field: "Broadcast before planting or apply with irrigation for cereals, sugarcane, and vegetables.",
      garden: "Mix 10–20 g into potting soil around active root zones.",
      timing: "At sowing or early vegetative stage.",
    },
    shelfLife: "6 months in cool shade.",
    precautions: ["Store below 30°C away from chemical inputs."],
    photos: [
    {
      title: "Azotobacter & Azospirillum Free-Living Culture",
      src: "/images/organic-methods/13_Azotobacter_Azospirillum.jpg",
      alt: "Azotobacter chroococcum bio-inoculant for non-leguminous cereals, millets and vegetables",
      caption: "Non-symbiotic nitrogen-fixing bacteria synthesizing natural auxins and gibberellins for cereals, vegetables and orchards.",
    },
  ],
  },
  {
    id: 14,
    name: "PSB (Phosphate Solubilizing Bacteria)",
    category: "bio",
    type: "Phosphorus Mobilizer",
    readyIn: "Certified ready culture",
    quantity: "200–250 g seed or 2 kg soil",
    frequency: "Sowing / basal application",
    purpose: "Converts locked, insoluble tricalcium and iron phosphates in soil into plant-accessible soluble orthophosphate.",
    ingredients: [
      { item: "Certified PSB Bio-Culture", qty: "200 g seed or 2 kg soil" },
      { item: "Moist Vermicompost / FYM", qty: "50 kg" },
    ],
    steps: [
      "Mix 2 kg PSB into 50 kg moist vermicompost or FYM.",
      "Cover with moist gunny cloth in shade for 24 hours to multiply.",
      "Broadcast evenly over moist field during planting.",
    ],
    application: {
      field: "Universal for all crops; highly effective in phosphorus-fixing soils.",
      garden: "Add 1 tablespoon per pot mixed into topsoil.",
      timing: "At sowing or root development phase.",
    },
    shelfLife: "6 months from packaging.",
    precautions: ["Never apply simultaneously with chemical DAP or superphosphate."],
    photos: [
    {
      title: "PSB Phosphate Solubilizing Bio-Culture",
      src: "/images/organic-methods/14_PSB_Phosphate_Solubilizing_Bacteria.jpg",
      alt: "Phosphate solubilizing bacteria culture converting locked soil phosphorus into plant-accessible forms",
      caption: "Secretes natural organic acids (citric, gluconic) to dissolve chemically locked insoluble soil phosphorus into bioavailable forms.",
    },
  ],
  },
  {
    id: 15,
    name: "Trichoderma viride / harzianum",
    category: "bio",
    type: "Beneficial Bio-Fungicide",
    readyIn: "Certified bio-formulation",
    quantity: "4–10 g/kg seed; 2.5 kg soil",
    frequency: "Seed coat or soil broadcast",
    purpose: "Aggressively parasitizes wilt, root rot, damping-off, and collar rot fungal pathogens (Fusarium, Rhizoctonia, Pythium).",
    ingredients: [
      { item: "Trichoderma Bio-Powder (2x10^6 cfu/g)", qty: "4–10 g/kg seed or 2.5 kg / acre" },
      { item: "Moist FYM / Compost", qty: "100 kg" },
    ],
    steps: [
      "Seed: Moisten seed lightly, mix 4–10 g/kg powder, dry in shade, and sow.",
      "Soil Enrichment: Mix 2.5 kg with 100 kg moist FYM; maintain 50% moisture under gunny in shade for 7–15 days.",
      "Green fungal mycelium develops over compost; broadcast over field.",
    ],
    application: {
      field: "Broadcast enriched FYM or dip seedling roots in 10 g/L solution for 30 min before transplanting.",
      garden: "Mix 1 teaspoon per container to safeguard seedlings from damping-off.",
      timing: "Pre-planting or early nursery stage.",
    },
    shelfLife: "1–2 years in cool storage.",
    precautions: ["Never apply chemical fungicides within 7 days of Trichoderma application."],
    photos: [
    {
      title: "Trichoderma viride Bio-Fungicide Mycelium",
      src: "/images/organic-methods/15_Trichoderma.jpg",
      alt: "Trichoderma harzianum and viride green fungal culture actively parasitizing soil pathogens",
      caption: "Beneficial predatory fungus that aggressively colonizes rhizosphere, shielding roots against Fusarium and Pythium rots.",
    },
  ],
  },
  {
    id: 16,
    name: "Pseudomonas fluorescens",
    category: "bio",
    type: "Bio-Bacterium & Plant Shield",
    readyIn: "Certified bio-culture",
    quantity: "10 g/kg seed; 5 g/L foliar",
    frequency: "At sowing & every 15 days",
    purpose: "Shields against bacterial wilt, blight, and fungal leaf spot diseases while producing siderophores and growth auxins.",
    ingredients: [
      { item: "Pseudomonas fluorescens Culture", qty: "10 g/kg seed; 5 g/L spray" },
      { item: "Moist FYM", qty: "2.5 kg in 50 kg FYM for soil" },
    ],
    steps: [
      "Seed Coat: Mix 10 g per kg seed with light moisture.",
      "Seedling Dip: Dissolve 10 g per liter water; dip seedling roots for 30 minutes.",
      "Foliar Spray: Dissolve 5 g/L water; spray on foliage in evening.",
    ],
    application: {
      field: "Spray over crop canopy or soil drench around infected root zones.",
      garden: "Mist vegetables every 2 weeks to prevent leaf spots and bacterial wilts.",
      timing: "Evening application with gentle humidity.",
    },
    shelfLife: "Check packet (typically 6–12 months).",
    precautions: ["Store below 25°C away from chemical copper fungicides."],
    photos: [
    {
      title: "Pseudomonas fluorescens Bio-Bactericide",
      src: "/images/organic-methods/16_Pseudomonas_fluorescens.jpg",
      alt: "Pseudomonas fluorescens bacterial culture producing fluorescent siderophores on agar",
      caption: "Produces fluorescent iron-chelating siderophores and phenazine antibiotics that suppress bacterial wilt and blast.",
    },
  ],
  },
  {
    id: 17,
    name: "Beauveria bassiana",
    category: "bio",
    type: "Entomopathogenic Fungus",
    readyIn: "Certified formulation",
    quantity: "3–5 g or ml / L foliar",
    frequency: "Every 10–15 days",
    purpose: "Fungal spores adhere to and penetrate whiteflies, thrips, aphid cuticles and soil grubs, destroying them naturally.",
    ingredients: [
      { item: "Beauveria bassiana Bio-Pesticide", qty: "3–5 g or ml per Liter water" },
    ],
    steps: [
      "Mix 3–5 g/ml per liter of water; add a few drops of organic surfactant or jaggery.",
      "Agitate thoroughly to suspend spores uniformly.",
      "Spray on infested plants, ensuring underside leaf coverage.",
    ],
    application: {
      field: "Foliar spray for sucking pests; soil drench (1–2 L/acre) for subterranean white grubs.",
      garden: "Spray over outdoor ornamental plants and vegetables with thrip or whitefly infestation.",
      timing: "Late evening when relative humidity is higher.",
    },
    shelfLife: "1–2 years in cool storage.",
    precautions: ["Spores are sensitive to harsh midday sunlight; spray only after 4:30 PM."],
    photos: [
    {
      title: "Beauveria bassiana Entomopathogenic Spores",
      src: "/images/organic-methods/17_Beauveria_bassiana.jpg",
      alt: "Beauveria bassiana entomopathogenic fungal culture on insect pupa and agar plate",
      caption: "Microscopic white muscardine fungal spores that adhere to and penetrate insect cuticles, eliminating borers and thrips.",
    },
  ],
  },
  {
    id: 18,
    name: "Bacillus thuringiensis (Bt)",
    category: "bio",
    type: "Larvicidal Bio-Protein",
    readyIn: "Certified bio-powder",
    quantity: "1–2 g per Liter water",
    frequency: "Every 7–10 days on young larvae",
    purpose: "Produces crystalline endotoxin that paralyzes caterpillar gut upon ingestion; targets borers and loopers.",
    ingredients: [
      { item: "Bt Bio-Powder (Bacillus thuringiensis)", qty: "200–400 g in 200 L tank per acre" },
    ],
    steps: [
      "Mix 1–2 g per liter of clean water in the spray tank.",
      "Stir to ensure complete powder dispersion.",
      "Spray directly on tender foliage where early instar caterpillars are feeding.",
    ],
    application: {
      field: "Spray early instar larvae (1st–2nd instar) covering undersides of leaves.",
      garden: "Mist over cabbage, cauliflower, tomato, and chilli plants during caterpillar season.",
      timing: "Spray in the evening for maximum larval consumption overnight.",
    },
    shelfLife: "Check packet label (1–2 years).",
    precautions: [
      "Do not mix with alkaline water or copper fungicides.",
      "Ineffective on older, large burrowed borers; target young larvae early.",
    ],
    photos: [
    {
      title: "Bacillus thuringiensis (Bt) Larvicidal Protein",
      src: "/images/organic-methods/18_Bacillus_thuringiensis_Bt.jpg",
      alt: "Bacillus thuringiensis biological larvicide targeting caterpillar and looper pests",
      caption: "Naturally occurring bacterium producing selective Cry protein endotoxins that paralyze caterpillar midguts upon ingestion.",
    },
  ],
  },
  {
    id: 19,
    name: "NPV (Nuclear Polyhedrosis Virus)",
    category: "bio",
    type: "Selective Viral Biocontrol",
    readyIn: "Certified bio-suspension",
    quantity: "250–500 LE in 200 L water / Acre",
    frequency: "Repeat after 7–10 days",
    purpose: "Highly specific viral bio-agent exclusively targeting Helicoverpa pod borer (HaNPV) and Spodoptera armyworm (SlNPV).",
    ingredients: [
      { item: "HaNPV or SlNPV Viral Formulation", qty: "250–500 Larval Equivalents (LE)" },
      { item: "Jaggery (phagostimulant)", qty: "1 kg in 200 L water (0.5%)" },
      { item: "Organic Sticker", qty: "Few drops" },
    ],
    steps: [
      "Mix 250–500 LE in 200 L water per acre.",
      "Add 0.5% jaggery (acts as feeding stimulant attracting larvae) and sticker.",
      "Spray during late evening hours when larvae emerge to feed.",
    ],
    application: {
      field: "Gram, pigeonpea, cotton, tomato, and groundnut fields during pod borer emergence.",
      garden: "Target garden tomatoes and beans infested with fruit/pod borers.",
      timing: "Strictly late evening; sunlight UV breaks down virus particles rapidly.",
    },
    shelfLife: "Store refrigerated at 2–8°C away from direct sunlight.",
    precautions: [
      "Infected larvae turn limp and liquefy in 5–7 days; do not expect immediate knock-down.",
      "Harmless to honeybees, ladybird beetles, and human handlers.",
    ],
    photos: [
    {
      title: "NPV Host-Specific Viral Biocontrol",
      src: "/images/organic-methods/19_NPV_HaNPV_SlNPV.jpg",
      alt: "Nuclear Polyhedrosis Virus formulation targeting Helicoverpa armigera and Spodoptera litura larvae",
      caption: "Host-specific insect virus (HaNPV & SlNPV) causing lethal liquefaction in pod borers and armyworms without harming bees.",
    },
  ],
  },
];

const GOLDEN_RULES = [
  {
    title: "Indigenous Desi Cow Inputs",
    desc: "Use fresh cow dung and urine collected within 1–2 days. Indigenous breeds host exceptional microbial diversity.",
    icon: Droplet,
  },
  {
    title: "Living Unchlorinated Water",
    desc: "Use well, borewell, or rainwater. Chlorine in tap water kills beneficial fermentation microbes.",
    icon: Sprout,
  },
  {
    title: "Clockwise Daily Stirring",
    desc: "Stir clockwise morning and evening with a wooden stick to aerate cultures and activate aerobic bacteria.",
    icon: Clock,
  },
  {
    title: "Ferment in Gentle Shade",
    desc: "Keep in earthen pots, cement tanks, or plastic drums covered with breathable gunny cloth. Never use metal.",
    icon: Home,
  },
  {
    title: "Fine Cloth Filtration",
    desc: "Always strain botanical extracts and Jeevamrutham through fine muslin cloth to avoid sprayer nozzle clogging.",
    icon: Beaker,
  },
  {
    title: "Cool Twilight Application",
    desc: "Spray only in early morning or cool late evening. Never apply in scorching afternoon sun or rainfall.",
    icon: Sun,
  },
];

const CATEGORY_META = {
  nutrition: {
    label: "Soil & Crop Nutrition",
    badgeLabel: "Soil Nutrition",
    code: "SOP-NUT",
    border: "border-emerald-300",
    text: "text-emerald-800",
    bg: "bg-emerald-50",
    glow: "rgba(16, 185, 129, 0.18)",
    accent: "#059669",
    icon: Sprout,
    count: 7,
  },
  pest: {
    label: "Botanical Crop Defense",
    badgeLabel: "Crop Defense",
    code: "SOP-PST",
    border: "border-amber-300",
    text: "text-amber-800",
    bg: "bg-amber-50",
    glow: "rgba(217, 119, 6, 0.18)",
    accent: "#d97706",
    icon: ShieldCheck,
    count: 4,
  },
  bio: {
    label: "Biological Micro-Inoculants",
    badgeLabel: "Bio-Inoculant",
    code: "SOP-BIO",
    border: "border-teal-300",
    text: "text-teal-800",
    bg: "bg-teal-50",
    glow: "rgba(13, 148, 136, 0.18)",
    accent: "#0d9488",
    icon: Microscope,
    count: 8,
  },
};

const ease = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/* PROTOCOL SPOTLIGHT CARD (FRESH LIGHT PALETTE)                              */
/* -------------------------------------------------------------------------- */
function ProtocolSpotlightCard({
  method,
  index,
  onOpen,
}: {
  method: MethodItem;
  index: number;
  onOpen: (m: MethodItem) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const meta = CATEGORY_META[method.category];
  const Icon = meta.icon;
  const coverPhoto = method.photos[0] || null;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpen(method)}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease, delay: Math.min((index % 6) * 0.04, 0.24) }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease } }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-sm transition-all duration-300 hover:border-emerald-600/50 hover:shadow-[0_16px_36px_rgba(16,50,30,0.1)] flex flex-col justify-between"
    >
      {/* Light botanical cursor spotlight sheen */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${meta.glow}, transparent 70%)`,
          }}
        />
      )}

      <div>
        {/* Visual Cover Banner with Photo */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-emerald-50 border-b border-emerald-900/5">
          {coverPhoto && (
            <Image
              src={coverPhoto.src}
              alt={coverPhoto.alt}
              fill
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Top Status Bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-emerald-900 border border-emerald-300 shadow-sm">
              SOP #{String(method.id).padStart(2, "0")}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border backdrop-blur-md bg-white/95 shadow-sm ${meta.border} ${meta.text}`}
            >
              <Icon className="h-3 w-3" />
              {method.type}
            </span>
          </div>

          {/* Photo count indicator */}
          {method.photos.length > 0 && (
            <div className="absolute bottom-2.5 right-3 z-10 font-mono text-[10px] px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-emerald-900 font-medium border border-emerald-200 flex items-center gap-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              {method.photos.length} {method.photos.length === 1 ? "Photo" : "Photos"}
            </div>
          )}
        </div>

        {/* Card Content Body */}
        <div className="p-5 pt-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-700 font-bold">
              {meta.code}
            </span>
            <span className="text-zinc-300">&bull;</span>
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
              Natural Formulation
            </span>
          </div>

          <h3 className="font-display text-xl font-bold text-zinc-900 transition-colors duration-200 group-hover:text-emerald-700 leading-snug">
            {method.name}
          </h3>

          <p className="mt-2 text-xs text-zinc-600 leading-relaxed line-clamp-2 font-normal">
            {method.purpose}
          </p>

          {/* Quick Metrics Bar in fresh clean pills */}
          <div className="mt-4 pt-3.5 border-t border-zinc-100 grid grid-cols-3 gap-2 text-[11px] font-mono">
            <div className="rounded-xl bg-emerald-50/60 p-2.5 border border-emerald-100">
              <div className="flex items-center gap-1 text-emerald-800/70 text-[9px] uppercase tracking-wider mb-0.5 font-semibold">
                <Clock className="h-2.5 w-2.5 text-emerald-600" />
                <span>Ready In</span>
              </div>
              <strong className="text-emerald-900 font-bold truncate block text-xs">{method.readyIn}</strong>
            </div>
            <div className="rounded-xl bg-emerald-50/60 p-2.5 border border-emerald-100">
              <div className="flex items-center gap-1 text-emerald-800/70 text-[9px] uppercase tracking-wider mb-0.5 font-semibold">
                <Droplet className="h-2.5 w-2.5 text-emerald-600" />
                <span>Dosage</span>
              </div>
              <strong className="text-emerald-900 font-medium truncate block text-xs">{method.quantity}</strong>
            </div>
            <div className="rounded-xl bg-emerald-50/60 p-2.5 border border-emerald-100">
              <div className="flex items-center gap-1 text-emerald-800/70 text-[9px] uppercase tracking-wider mb-0.5 font-semibold">
                <Calendar className="h-2.5 w-2.5 text-emerald-600" />
                <span>Schedule</span>
              </div>
              <strong className="text-emerald-900 font-medium truncate block text-xs">{method.frequency}</strong>
            </div>
          </div>

          {/* Key Ingredients Pill Previews */}
          <div className="mt-3.5 flex items-center gap-1.5 flex-wrap">
            {method.ingredients.slice(0, 3).map((ing, i) => (
              <span
                key={i}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200 truncate max-w-[130px]"
              >
                {ing.item}
              </span>
            ))}
            {method.ingredients.length > 3 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-100 text-[#162a54] border border-emerald-200 font-semibold">
                +{method.ingredients.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-3.5 border-t border-zinc-100 flex items-center justify-between text-xs font-mono font-semibold text-emerald-800">
        <span className="group-hover:translate-x-0.5 transition-transform">Inspect Full Steps &amp; Photos</span>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[#162a54] border border-emerald-200 transition-all duration-300 group-hover:bg-[#2F9E44] group-hover:text-white group-hover:scale-110 shadow-sm">
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* KEYNOTE PRESENTATION STAGE (FRESH LIGHT PALETTE)                            */
/* -------------------------------------------------------------------------- */
function PresentationStage({
  methods,
  currentIndex,
  onIndexChange,
  onOpenModal,
}: {
  methods: MethodItem[];
  currentIndex: number;
  onIndexChange: (idx: number) => void;
  onOpenModal: (m: MethodItem) => void;
}) {
  const current = methods[currentIndex] || methods[0];
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  useEffect(() => {
    setPhotoIndex(0);
  }, [currentIndex]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      onIndexChange((currentIndex + 1) % methods.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, currentIndex, methods.length, onIndexChange]);

  if (!current) return null;

  const meta = CATEGORY_META[current.category];
  const Icon = meta.icon;
  const activePhoto = current.photos[photoIndex] || current.photos[0] || null;
  const progressPercent = ((currentIndex + 1) / methods.length) * 100;

  return (
    <div className="relative rounded-3xl border border-emerald-900/10 bg-gradient-to-b from-white via-[#e8f3e0] to-[#edf4ea] p-6 lg:p-10 shadow-xl overflow-hidden">
      {/* Light botanical ambient glow */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[450px] w-[450px] rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: meta.accent }}
      />

      {/* Progress Bar */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-100">
        <div
          className="h-full bg-emerald-600 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Top Deck Presentation Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-emerald-900/10">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-emerald-100 text-[#162a54] border border-emerald-300 font-bold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            Deck Slide {currentIndex + 1} of {methods.length}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-emerald-800 bg-white border border-emerald-200">
            {meta.code} &bull; {current.type}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Autoplay Toggle */}
          <button
            type="button"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all flex items-center gap-1.5 border ${
              isAutoPlaying
                ? "bg-[#1E7A33] text-white border-emerald-700 font-bold shadow-sm"
                : "bg-white text-[#162a54] border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            {isAutoPlaying ? "Auto-Play: ON" : "Auto-Play: OFF"}
          </button>

          {/* Prev / Next */}
          <button
            type="button"
            onClick={() => onIndexChange((currentIndex - 1 + methods.length) % methods.length)}
            className="p-2 rounded-xl bg-white border border-emerald-200 text-[#162a54] hover:text-emerald-950 hover:bg-emerald-50 transition-all shadow-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-xs text-emerald-900 font-bold px-2">
            #{String(current.id).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => onIndexChange((currentIndex + 1) % methods.length)}
            className="p-2 rounded-xl bg-white border border-emerald-200 text-[#162a54] hover:text-emerald-950 hover:bg-emerald-50 transition-all shadow-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Layout */}
      <div className="relative z-10 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: High-Res Photo Display (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-emerald-900/15 bg-white shadow-lg group">
            {activePhoto && (
              <Image
                src={activePhoto.src}
                alt={activePhoto.alt}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 520px"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

            <div className="absolute top-3.5 left-3.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold border backdrop-blur-md bg-white/95 shadow-sm ${meta.border} ${meta.text}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {current.type}
              </span>
            </div>

            <div className="absolute top-3.5 right-3.5 font-mono text-[10px] uppercase tracking-widest text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
              Field Tested
            </div>

            {activePhoto && (
              <div className="absolute bottom-3 left-3 right-3 text-xs text-white bg-black/75 backdrop-blur-md p-3 rounded-xl border border-white/10 font-sans shadow-md">
                <div className="flex items-center gap-1.5 mb-0.5 font-mono text-[10px] uppercase text-emerald-300 font-bold">
                  <Info className="h-3 w-3" />
                  <span>{activePhoto.title}</span>
                </div>
                <p className="line-clamp-2 text-white/90 text-[11px] leading-relaxed">
                  {activePhoto.caption}
                </p>
              </div>
            )}
          </div>

          {/* Photo Thumbnails Switcher */}
          {current.photos.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {current.photos.map((p, idx) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => setPhotoIndex(idx)}
                  className={`relative h-16 w-24 rounded-xl overflow-hidden border transition-all shrink-0 shadow-sm ${
                    photoIndex === idx
                      ? "border-emerald-600 ring-2 ring-emerald-500/40 scale-105"
                      : "border-zinc-200 opacity-80 hover:opacity-100"
                  }`}
                >
                  <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="96px" />
                </button>
              ))}
            </div>
          )}

          {/* Action button */}
          <button
            type="button"
            onClick={() => onOpenModal(current)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1E7A33] text-white font-mono text-xs uppercase tracking-wider font-bold shadow-md transition-all hover:bg-[#17642a] hover:scale-[1.01]"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Inspect Detailed Formulation &amp; Steps
          </button>
        </div>

        {/* Right Column: Key Details & Dossier (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="font-mono text-xs font-bold text-[#162a54] px-2.5 py-0.5 rounded-md bg-emerald-100 border border-emerald-300">
                SOP #{String(current.id).padStart(2, "0")}
              </span>
              <span className="text-zinc-300">&bull;</span>
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
                {meta.label}
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
              {current.name}
            </h2>

            <p className="mt-3 text-sm sm:text-base text-zinc-700 leading-relaxed font-normal">
              {current.purpose}
            </p>

            {/* 4-Point Quick Metrics Strip */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-900/10 shadow-sm">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Ready In</span>
                <strong className="text-emerald-800 font-mono text-sm font-bold block">{current.readyIn}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-900/10 shadow-sm">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Standard Dose</span>
                <span className="text-zinc-900 font-mono text-xs font-semibold block truncate">{current.quantity}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-900/10 shadow-sm">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Frequency</span>
                <span className="text-zinc-900 font-mono text-xs font-semibold block truncate">{current.frequency}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-900/10 shadow-sm">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Shelf Life</span>
                <span className="text-zinc-900 font-mono text-xs font-semibold block truncate">{current.shelfLife}</span>
              </div>
            </div>

            {/* Ingredients Formulation Preview */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="font-mono text-xs uppercase tracking-wider text-emerald-900 font-bold flex items-center gap-1.5">
                  <FlaskConical className="h-3.5 w-3.5 text-emerald-700" />
                  Exact Ingredients ({current.ingredients.length} Items)
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">1-Acre Formulation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {current.ingredients.map((ing) => (
                  <div
                    key={ing.item}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-emerald-900/10 shadow-xs text-xs font-mono"
                  >
                    <span className="text-zinc-800">{ing.item}</span>
                    <strong className="text-emerald-800 font-bold">{ing.qty}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Procedure Stepper */}
            <div className="mt-6">
              <h3 className="font-mono text-xs uppercase tracking-wider text-emerald-900 font-bold mb-3 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-emerald-700" />
                Preparation Summary ({current.steps.length} Steps)
              </h3>
              <div className="space-y-2">
                {current.steps.slice(0, 3).map((st, i) => (
                  <div
                    key={st}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-emerald-900/10 text-xs text-zinc-700 shadow-xs"
                  >
                    <span className="h-5 w-5 rounded-md bg-[#1E7A33] text-white flex items-center justify-center font-mono text-[11px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="line-clamp-2 leading-relaxed">{st}</p>
                  </div>
                ))}
                {current.steps.length > 3 && (
                  <button
                    type="button"
                    onClick={() => onOpenModal(current)}
                    className="text-xs font-mono text-emerald-800 font-semibold hover:underline flex items-center gap-1 pt-1"
                  >
                    +{current.steps.length - 3} more steps in full dossier &rarr;
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Filmstrip Carousel Navigation */}
      <div className="relative z-10 mt-10 pt-6 border-t border-emerald-900/10">
        <div className="flex items-center justify-between mb-3.5">
          <span className="font-mono text-xs uppercase tracking-wider text-emerald-950 font-bold flex items-center gap-2">
            <span>Jump to Protocol</span>
            <span className="text-zinc-400">&bull;</span>
            <span className="text-emerald-700 font-normal">Use &larr; &rarr; keys</span>
          </span>

          <div className="flex items-center gap-1">
            {methods.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onIndexChange(i)}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === i ? "w-6 bg-[#1E7A33]" : "w-1.5 bg-emerald-200 hover:bg-emerald-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {methods.map((m, i) => {
            const isSelected = i === currentIndex;
            const photo = m.photos[0] || null;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onIndexChange(i)}
                className={`group relative flex items-center gap-3 p-2.5 rounded-2xl border transition-all text-left shrink-0 w-64 shadow-xs ${
                  isSelected
                    ? "bg-white border-emerald-600 ring-2 ring-emerald-500/40 shadow-md"
                    : "bg-white/80 border-emerald-900/10 hover:border-emerald-600/50 hover:bg-white"
                }`}
              >
                <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-emerald-50 border border-emerald-100">
                  {photo && <Image src={photo.src} alt={m.name} fill className="object-cover" sizes="48px" />}
                </div>
                <div className="overflow-hidden">
                  <span className="font-mono text-[10px] text-emerald-800 font-bold block">
                    #{String(m.id).padStart(2, "0")} &bull; {m.type}
                  </span>
                  <strong className="text-xs text-zinc-900 truncate block group-hover:text-emerald-700 transition-colors">
                    {m.name}
                  </strong>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TECHNICAL COMPARISON TABLE (FRESH LIGHT PALETTE)                           */
/* -------------------------------------------------------------------------- */
function ComparisonTable({
  methods,
  onOpenModal,
}: {
  methods: MethodItem[];
  onOpenModal: (m: MethodItem) => void;
}) {
  return (
    <div className="rounded-2xl border border-emerald-900/10 bg-white overflow-hidden shadow-sm">
      <div className="p-4 bg-emerald-50/70 border-b border-emerald-900/10 flex items-center justify-between flex-wrap gap-2">
        <span className="font-mono text-xs uppercase tracking-wider text-emerald-950 font-bold flex items-center gap-2">
          <TableIcon className="h-4 w-4 text-emerald-700" />
          Technical Agronomy Matrix &bull; All 19 Protocols
        </span>
        <span className="font-mono text-xs text-zinc-500">
          Showing {methods.length} Protocols
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#e8f3e0] border-b border-emerald-900/10 text-emerald-950 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-4 px-4 font-semibold">#</th>
              <th className="py-4 px-4 font-semibold">Protocol Name</th>
              <th className="py-4 px-4 font-semibold">Category</th>
              <th className="py-4 px-4 font-semibold">Ready In</th>
              <th className="py-4 px-4 font-semibold">Dosage / Acre</th>
              <th className="py-4 px-4 font-semibold">Frequency</th>
              <th className="py-4 px-4 font-semibold">Shelf Life</th>
              <th className="py-4 px-4 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-800">
            {methods.map((m) => {
              const meta = CATEGORY_META[m.category];
              return (
                <tr
                  key={m.id}
                  onClick={() => onOpenModal(m)}
                  className="hover:bg-emerald-50/50 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 font-bold text-emerald-800">
                    #{String(m.id).padStart(2, "0")}
                  </td>
                  <td className="py-3.5 px-4 font-display font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors">
                    {m.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${meta.border} ${meta.text} ${meta.bg}`}>
                      {m.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-800 font-medium">{m.readyIn}</td>
                  <td className="py-3.5 px-4 text-zinc-700">{m.quantity}</td>
                  <td className="py-3.5 px-4 text-zinc-700">{m.frequency}</td>
                  <td className="py-3.5 px-4 text-zinc-500">{m.shelfLife}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-800 font-bold hover:underline">
                      View Steps &rarr;
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN GROWERS PAGE EXPORT (FRESH, LIGHT, ORGANIC PALETTE)                   */
/* -------------------------------------------------------------------------- */
export default function GrowersPage() {
  const [selectedMethodId, setSelectedMethodId] = useState<number>(2); // Default to Jeevamrutham (#02)

  return (
    <div className="min-h-screen bg-[#F1F8EF] text-[#13201B] selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      {/* Top Header / Nav (Clean Fresh Light) */}
      <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-[#F1F8EF]/90 backdrop-blur-md">
        <div className="container-site flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="group inline-flex items-center gap-2.5 transition-transform hover:scale-105" aria-label="Back to ArkaShine Home">
              <ArrowLeft className="h-4 w-4 text-emerald-900 transition-transform group-hover:-translate-x-1" />
              <Image
                src="/images/logo/arkashine-logo-bold-transparent.png"
                alt="ArkaShine"
                width={494} height={156}
                unoptimized
                priority
                className="h-8 w-auto object-contain"
              />
            </Link>
            <span className="text-zinc-300">/</span>
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-800 font-bold">
              Natural &amp; Organic Regenerative Farming Practices
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-emerald-100 text-[#162a54] border border-emerald-200 font-semibold">
              <Leaf className="h-3 w-3 text-emerald-600" />
              19 Natural Protocols
            </span>
            <Link
              href="/#contact"
              className="rounded-full bg-[#1E7A33] px-5 py-2 text-xs font-mono uppercase tracking-wider font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-[#17642a] shadow-sm"
            >
              Book SoiLenz Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Fresh Light Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-emerald-900/10 bg-[#F1F8EF]">
        <div className="pointer-events-none absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-emerald-300/25 blur-[120px]" />
        <div className="container-site relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-12">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-emerald-900 font-bold shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Natural Farming &bull; Smallholders &amp; Home Gardeners
          </div>

          {/* Heading */}
          <h1 className="display mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-emerald-950 max-w-5xl leading-[1.12]">
            Natural and Organic <br />
            <span className="text-emerald-700">Regenerative Farming Practices.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-3xl text-base sm:text-lg text-emerald-900/80 font-normal leading-relaxed">
            From rural smallholders to urban rooftop and kitchen gardeners: complete field-tested
            guidelines for natural nutrition, bio-fertilizers, and chemical-free pest defense.
            <strong className="text-emerald-950 font-semibold"> Select any protocol below to inspect its living preparation, exact dosage, and field photographs.</strong>
          </p>

          {/* 4-Card Fresh KPI Bar */}
          <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-4 [&>div]:animate-[kpi-in_0.7s_cubic-bezier(0.22,1,0.36,1)_both] [&>div:nth-child(2)]:[animation-delay:0.08s] [&>div:nth-child(3)]:[animation-delay:0.16s] [&>div:nth-child(4)]:[animation-delay:0.24s] [&>div]:transition-transform [&>div:hover]:-translate-y-1.5">
            <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
              <div className="font-mono text-3xl font-bold text-emerald-700">19</div>
              <div className="text-xs font-mono text-emerald-950 font-bold mt-1">Certified Protocols</div>
              <div className="text-[10px] font-mono text-zinc-500 mt-0.5">Field-Tested Formulations</div>
            </div>
            <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
              <div className="font-mono text-3xl font-bold text-emerald-700">100%</div>
              <div className="text-xs font-mono text-emerald-950 font-bold mt-1">Chemical-Free Bio</div>
              <div className="text-[10px] font-mono text-zinc-500 mt-0.5">Indigenous Ingredients</div>
            </div>
            <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
              <div className="font-mono text-3xl font-bold text-amber-600">₹0</div>
              <div className="text-xs font-mono text-emerald-950 font-bold mt-1">Costly Synthetic Inputs</div>
              <div className="text-[10px] font-mono text-zinc-500 mt-0.5">Farmyard Circularity</div>
            </div>
            <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
              <div className="font-mono text-3xl font-bold text-teal-700">20 min</div>
              <div className="text-xs font-mono text-emerald-950 font-bold mt-1">SoiLenz Lab Test</div>
              <div className="text-[10px] font-mono text-zinc-500 mt-0.5">Rapid Carbon &amp; NPK</div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* 19 methods as an animated winding step path */}
      <MethodsJourney
        methods={METHODS.map((m) => ({
          id: m.id,
          name: m.name,
          category: m.category,
          type: m.type,
          photo: m.photos[0]?.src,
        }))}
        selectedId={selectedMethodId}
        onSelect={(id) => setSelectedMethodId(id)}
      />

      {/* Living Protocol Field Laboratory & Interactive Visualizer (No generic cards) */}
      <LivingProtocolViewer
        methods={METHODS}
        selectedId={selectedMethodId}
        onSelect={(id) => setSelectedMethodId(id)}
      />

      {/* two grower stories */}
      <GrowerStories />

      <section className="py-14 sm:py-20 border-b border-emerald-900/10 bg-[#fbf7ee]">
        <div className="container-site max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-800 font-bold">
              Agronomy Best Practices
            </p>
            <h2 className="display mt-2 text-3xl sm:text-4xl text-emerald-950 font-bold">
              6 Golden Rules for Maximum Biological Efficacy
            </h2>
            <p className="mt-2 text-xs font-mono text-emerald-900/70 max-w-md mx-auto">
              Essential agronomic rules for sustaining beneficial micro-organisms and enzyme integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GOLDEN_RULES.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 30, rotateX: -25 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ type: "spring", stiffness: 110, damping: 15, delay: (i % 3) * 0.1 + Math.floor(i / 3) * 0.15 }}
                  whileHover={{ y: -8, rotateZ: i % 2 ? 0.8 : -0.8 }}
                  style={{ transformPerspective: 800 }}
                  className="group relative overflow-hidden rounded-3xl border border-emerald-900/10 bg-white p-6 flex flex-col gap-3 shadow-sm hover:border-emerald-600/40 hover:shadow-lg"
                >
                  <span className="pointer-events-none absolute -right-2 -top-6 font-display text-[92px] font-bold leading-none text-emerald-900/[0.05] transition-colors group-hover:text-emerald-600/15">0{i + 1}</span>
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-emerald-500 to-lime-400 transition-transform duration-500 group-hover:scale-x-100" />
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#162a54] shrink-0 border border-emerald-200 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-800">Rule 0{i + 1}</span>
                  </div>
                  <h4 className="font-display text-base font-bold text-zinc-900">{r.title}</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed font-normal">{r.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hardware Link: Test Living Soil with SoiLenz 2.0 */}
      <section className="py-16 sm:py-20 bg-[#e7f4f3]">
        <div className="container-site max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-emerald-900 font-bold mb-6 shadow-xs">
            <Sprout className="h-3.5 w-3.5 text-emerald-600" />
            Validate Organic Soil Intelligence
          </div>

          <h2 className="display text-3xl sm:text-4xl font-bold text-emerald-950 tracking-tight">
            Verify Soil Organic Carbon (OC) &amp; Available NPK in 20 Minutes
          </h2>

          <p className="mt-4 text-base text-emerald-900/80 max-w-2xl mx-auto leading-relaxed">
            Natural farming succeeds when living biology restores soil organic carbon. With SoiLenz 2.0, verify Organic Carbon, pH, EC, and 14 parameters on-site with real-time printed reports.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-full bg-[#1E7A33] px-7 py-3.5 text-xs font-mono uppercase tracking-wider font-bold text-white shadow-md transition-all hover:bg-[#17642a] hover:scale-105"
            >
              Book SoiLenz Live Demo &rarr;
            </Link>
            <Link
              href="/soil-partners"
              className="rounded-full border border-emerald-900/15 bg-white px-7 py-3.5 text-xs font-mono uppercase tracking-wider font-semibold text-[#162a54] transition-colors hover:bg-emerald-50"
            >
              Explore 3 Field Products
            </Link>
          </div>
        </div>
      </section>

      {/* Card modal removed in favor of LivingProtocolViewer */}
      <ContactStrip />
    </div>
  );
}
