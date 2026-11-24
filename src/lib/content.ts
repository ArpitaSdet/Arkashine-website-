// ArkaShine Innovations — Unified Single Content File
// All copy and data conforming strictly to the Master Specification

export const company = {
  name: "ArkaShine Innovations Pvt Ltd",
  shortName: "ArkaShine",
  tagline: "Innovation in Agriculture for a Sustainable Future",
  signOff: "Healthy soils. Brighter tomorrows.",
  phone: "96112 97893",
  phoneRaw: "9611297893",
  phoneHref: "tel:+919611297893",
  whatsapp: "https://wa.me/919611297893?text=Hi%20ArkaShine,%20I%20would%20like%20to%20book%20a%20demo%20for%20SoiLenz%202.0",
  email: "karbari.rsudha@gmail.com",
  email2: "sudha.karbari@arkashine-innovations.com",
  address: "38, 1st Main Rd, 3rd Stage, 4th Block, SBI Staff Colony, Basaveshwar Nagar, Bengaluru, Karnataka 560079, India",
  backers: ["DST NIDHI-EIR", "Deshpande Startups (Hubli)"],
};

export const navLinks = [
  { label: "Hardware", href: "#hardware" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Patents", href: "#patents" },
  { label: "Field Outcomes", href: "#outcomes" },
  { label: "Solutions", href: "#solutions" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "ArkaShine · Bengaluru, India",
  headline: "Made in India. Built for Every Field.",
  sub: "ArkaShine designs and manufactures portable soil intelligence devices.",
  buttons: {
    primary: "Book a Live Demo",
    secondary: "Request a Quote",
  },
  proofTicker: [
    { value: "3", label: "granted patents" },
    { value: "14", label: "parameters" },
    { value: "20 min", label: "field test" },
    { value: "60 s", label: "electrochem mix" },
  ],
  angleChips: [
    { id: "front", label: "Front 3/4", target: "Thermal Slip" },
    { id: "top", label: "Top Lid", target: "Bluetooth BLE" },
    { id: "knob", label: "Control Dial", target: "One-Touch" },
    { id: "printer", label: "Printer Slot", target: "60 s pH & EC" },
  ],
};

export const problemScene = {
  headline: "Soil testing shouldn't need a lab visit.",
  labRoute: {
    title: "Conventional Lab Route",
    nodes: ["Collect", "Transport", "Wait", "Report", "Advise"],
    time: "15–30 Days Delay",
  },
  arkaRoute: {
    title: "ArkaShine On-Field Route",
    nodes: ["Collect", "Test", "Analyse", "Recommend", "Record"],
    time: "20 min*",
  },
};

export const hardwareStage = {
  label: "Proprietary Hardware Architecture",
  milestones: [
    {
      numeral: "01",
      name: "SOILENZ 2.0",
      category: "Portable Benchtop Lab",
      tagline: "14-parameter soil analysis with built-in thermal printing.",
      specs: [
        { label: "14 parameters", value: "Full Soil Health Card + Ca & Mg" },
        { label: "58 mm thermal printer", value: "Instant paper report" },
        { label: "5 g sample", value: "Zero laboratory acids" },
        { label: "20 min", value: "Complete field test cycle" },
      ],
      image: "/images/products/soillenz-2-studio.webp",
    },
    {
      numeral: "02",
      name: "pH / EC Bottle",
      category: "Electrochemistry Chamber",
      tagline: "Solid-state dual electrode for rapid pH and salinity testing.",
      specs: [
        { label: "0 to 14 pH", value: "±0.05 Calibrated Range" },
        { label: "0 to 20 dS/m EC", value: "Electrical Conductivity" },
        { label: "Push-button seal", value: "100% Leakproof design" },
        { label: "BLE sync", value: "Instant wireless handshake" },
      ],
      image: "/images/render-bottle.webp",
    },
    {
      numeral: "03",
      name: "Soil Setter",
      category: "Mechanical Vortex Mixer",
      tagline: "Automated 1,800 RPM vortex agitation for uniform sample prep.",
      specs: [
        { label: "1,800 RPM", value: "High-torque vortex cycle" },
        { label: "60 s auto-stop", value: "Standardized sedimentation" },
        { label: "Zero variance", value: "Operator-independent accuracy" },
        { label: "Rugged build", value: "Field-tested battery runtime" },
      ],
      image: "/images/products/soillenz-2-studio.webp",
    },
    {
      numeral: "04",
      name: "Thermal Slip Rollout",
      category: "On-Spot Physical Handover",
      tagline: "Instant printed Soil Health Card handed directly to the farmer.",
      specs: [
        { label: "58 mm thermal slip", value: "Instant physical printout" },
        { label: "GPS geotagged", value: "Field-level verified coordinates" },
        { label: "Crop fertilizer dosage", value: "Custom Kharif & Rabi schedules" },
        { label: "Zero cloud wait", value: "Prints directly from machine" },
      ],
      image: "/images/products/soillenz-2-studio.webp",
    },
  ],
};

export const howItWorksSteps = [
  {
    step: "01",
    tag: "Wireless Setup",
    title: "BLE Handshake",
    time: "10 s",
    desc: "Soil Partner app scans and connects to ESP32_S3_BLE. Cryptographic verification establishes ArkaShine Verified status.",
    mobileHeadline: "One-tap Bluetooth pairing in 10 seconds",
  },
  {
    step: "02",
    tag: "Rapid Electrochemistry",
    title: "EC & pH Mixing",
    time: "2 x 60 s",
    desc: "5 g soil + 50 ml extractant in reagent bottle. Automated 60 s vortex agitation captures EC (0–20 dS/m) then 60 s for pH (0–14).",
    mobileHeadline: "60-second vortex mix for instant pH and salinity",
  },
  {
    step: "03",
    tag: "Nutrient Measurement",
    title: "14-Parameter Scan",
    time: "5 to 15 min",
    desc: "In-device measurement settles particulates and measures Organic Carbon, N, P, K, Ca, Mg, S, Fe, Mn, Cu, Zn, and Boron.",
    mobileHeadline: "In-device measurement of 12 soil nutrients",
  },
  {
    step: "04",
    tag: "Instant Handover",
    title: "Thermal Slip & AI Advisory",
    time: "Instant",
    desc: "Machine ejects 58 mm formal Soil Health Card. Soil Partner app delivers AI-backed crop-specific fertilizer schedules.",
    mobileHeadline: "Instant physical printout handed to the farmer",
  },
];

export const soilPartnerAppScreens = [
  { id: "login", title: "Soil Partner Login", subtitle: "Secure role-based access for field officers & entrepreneurs" },
  { id: "dashboard", title: "Operational Dashboard", subtitle: "Live farmer testing counters, active batches, and sync queue" },
  { id: "register", title: "Register Farmer", subtitle: "Aadhaar KYC, GPS boundary mapping, and crop season selection" },
  { id: "timer", title: "Mixing & Diagnostic Timer", subtitle: "Automated countdown ring for 60 s agitation and optical cycles" },
  { id: "nutrients", title: "14-Parameter Results", subtitle: "Color-coded High / Normal / Low status with Soil Health score" },
  { id: "charts", title: "Interactive Agronomy Charts", subtitle: "Soil chemistry bar graphs compared against ICAR standards" },
  { id: "recs", title: "Crop-Specific Advisory", subtitle: "Tailored urea, DAP, and bio-fertilizer recommendations" },
];

export const whoItsForStrips = [
  {
    id: "fpo",
    title: "Farmer Producer Orgs (FPOs)",
    outcome: "Turn soil testing into a profitable village service network serving thousands of member farmers.",
    stat: "400+ tests/month · 2-month payback",
    image: "/images/soilenz-field.webp",
  },
  {
    id: "growers",
    title: "Growers & Organic Farmers",
    outcome: "Scientific 19-method natural farming and living soil management for smallholders, terrace & kitchen gardeners.",
    stat: "19 Natural Protocols · Zero Chemical",
    image: "/images/growers-organic-farming.jpg",
  },
  {
    id: "corporate",
    title: "Corporate Agriculture",
    outcome: "Verify soil deficiencies at scale before distributing high-value agricultural inputs.",
    stat: "Centralized GIS cloud monitoring",
    image: "/images/soilenz-field.webp",
  },
  {
    id: "csr",
    title: "CSR Programmes",
    outcome: "Deploy measurable agricultural uplift across remote village clusters with verifiable data.",
    stat: "Direct farmer livelihood impact",
    image: "/images/soilenz-field.webp",
  },
  {
    id: "ngo",
    title: "Non-Governmental Orgs (NGOs)",
    outcome: "Operate reliable on-field diagnostics in rural heartlands without relying on distant labs.",
    stat: "Complete field portability",
    image: "/images/soilenz-field.webp",
  },
  {
    id: "agri-input",
    title: "Agri-Input Companies",
    outcome: "Back seed, crop protection, and fertilizer recommendations with verified soil telemetry.",
    stat: "Precision agronomy engagement",
    image: "/images/soilenz-field.webp",
  },
  {
    id: "govt",
    title: "Government & KVKs",
    outcome: "Accelerate Soil Health Card saturation targets with rapid village-level testing camps.",
    stat: "Govt. SHC parameter compliant",
    image: "/images/soilenz-field.webp",
  },
  {
    id: "entrepreneurs",
    title: "Soil-Testing Entrepreneurs",
    outcome: "Launch a profitable rural soil-testing micro-enterprise with quick equipment amortization.",
    stat: "₹60,000/month gross potential",
    image: "/images/soilenz-field.webp",
  },
];

export const roiDefaults = {
  machineCost: 120000,
  chargePerTest: 150,
  testsPerDay: 20,
  workingDays: 20,
  testsPerMonth: 400,
  monthlyRevenue: 60000,
  paybackMonths: 2,
};

export const patentsData = [
  {
    number: "IN 387972",
    year: "2022",
    title: "Apparatus and Method for Soil Testing",
    protects: "Fluorescence-based capillary electrophoresis and modular soil-solution diagnostic chamber.",
    matters: "Enables multi-nutrient optical detection from a single 5 g sample without hazardous laboratory acids.",
    meansForYou: "Lab-grade precision miniaturized into a rugged 5 kg field unit.",
    link: "https://iprsearch.ipindia.gov.in/PublicSearch/",
  },
  {
    number: "IN 419926",
    year: "2023",
    title: "Apparatus and Method for Soil Nutrient Quantification",
    protects: "Dual electro-optical detection chamber with dynamic temperature and conductivity cross-compensation.",
    matters: "Powers real-time sensor calibration inside SoiLenz 2.0 across diverse soil textures and climates.",
    meansForYou: "Reliable testing in extreme Indian field temperatures from 10°C to 45°C.",
    link: "https://iprsearch.ipindia.gov.in/PublicSearch/",
  },
  {
    number: "IN 559652",
    year: "6 Feb 2025",
    title: "Apparatus for Automated In-Field Testing of Soil",
    protects: "Automated in-device filtration, particulate settling mechanism, and integrated field thermal reporting.",
    matters: "Protects the enclosed solid body with built-in printer slot and standardized extraction protocol.",
    meansForYou: "Zero operator tampering and instant physical report handover on the farm.",
    link: "https://iprsearch.ipindia.gov.in/PublicSearch/",
  },
];

export const fieldOutcomes = [
  {
    location: "Bidar, Karnataka",
    coords: { lat: 17.9104, lng: 77.5196 },
    tests: "4,000+ tests",
    metric: "22% less excess fertilizer",
    desc: "Deployed across local FPOs and cotton growers in Kandol and surrounding village clusters.",
  },
  {
    location: "Mayurbhanj, Odisha",
    coords: { lat: 21.9287, lng: 86.7416 },
    tests: "1,200 farmers",
    metric: "60-second on-field diagnostics",
    desc: "Live testing camps at regional Krushi Melas demonstrating rapid pH and salinity verification.",
  },
  {
    location: "Nabarangpur, Odisha",
    coords: { lat: 19.2314, lng: 82.5518 },
    tests: "14 village clusters",
    metric: "Instant thermal report handover",
    desc: "Empowering rural soil entrepreneurs to deliver verified soil intelligence at the farm gate.",
  },
];

export const faqs = [
  {
    q: "How accurate is SOILENZ 2.0 compared to conventional laboratory testing?",
    a: "SoiLenz 2.0 uses patented in-device sensors (IN 387972) and dual-probe electrochemistry with active temperature compensation. It correlates closely with standard laboratory methods while eliminating transport delays and reagent degradation.",
  },
  {
    q: "What training is required to operate the device?",
    a: "Zero chemistry background is required. Field officers, FPO staff, or village youth can be certified in under 30 minutes. The automated 60-second vortex mixer and in-device filtration prevent operator error.",
  },
  {
    q: "How are consumables, reagents, and filter papers restocked?",
    a: "ArkaShine supplies pre-measured extractant reagent bottles, standardized filter papers, and 58 mm thermal receipt rolls in convenient 100-test and 500-test refill packs dispatched nationwide.",
  },
  {
    q: "What warranty and Annual Maintenance Contract (AMC) are included?",
    a: "Every unit includes a 1-year comprehensive manufacturer warranty covering all internal optical sensors, printer mechanisms, and Bluetooth modules, backed by pan-India replacement support.",
  },
  {
    q: "What is the equipment pricing and payment structure?",
    a: "Institutional equipment pricing is ₹1,20,000 + GST for the complete kit (SOILENZ 2.0 + pH/EC Bottle + Soil Setter + Starter Consumables). Institutional purchase orders, CSR grants, and financing options are supported.",
  },
  {
    q: "Which regional languages does the Soil Partner app support?",
    a: "The app supports English, Kannada, Hindi, and regional Indic languages, allowing field technicians to generate soil health slips and advisory in the farmer's native language.",
  },
];
