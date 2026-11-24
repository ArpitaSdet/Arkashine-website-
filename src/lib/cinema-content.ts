// Homepage copy & data for the cinematic redesign.
// Figures come only from the ArkaShine corporate deck / project brief.
// Anything unconfirmed is wrapped in [square brackets].

export const KIT_IMAGE = { src: "/images/soilenz-field.webp", w: 1600, h: 1042 };
export const SOILLENZ_IMAGE = { src: "/images/products/soillenz-2-studio.webp", w: 1376, h: 768 };
export const CAPSULE_IMAGE = { src: "/images/products/ph-ec-bottle.webp", w: 1080, h: 603 };

export const soillenzFeatures = [
  {
    id: "nutrients",
    no: "01",
    title: "14-Parameter Soil Analysis",
    line: "Measures 12 nutrients, pH, EC and organic carbon from one 5 g sample.",
    focus: { x: 15, y: 54, s: 1.08 },
  },
  {
    id: "mixing",
    no: "02",
    title: "Automated Mixing",
    line: "60-second auto-mix and in-device filtering.",
    focus: { x: 86, y: 33, s: 1.08 },
  },
  {
    id: "printing",
    no: "03",
    title: "Thermal Printing",
    line: "The report prints on the spot. It stays with the farmer.",
    focus: { x: 55, y: 52, s: 1.08 },
  },
  {
    id: "bluetooth",
    no: "04",
    title: "Bluetooth Connectivity",
    line: "Pairs with the Soil Partner app. Every test, saved.",
    focus: { x: 50, y: 9, s: 1.08 },
  },
] as const;

export const sensorParts = [
  {
    id: "housing",
    title: "Sensor Housing",
    line: "Sealed white housing. Built for daily field use.",
    focus: { x: 54, y: 28, s: 1.35 },
  },
  {
    id: "chamber",
    title: "Reaction Chamber",
    line: "5 g soil + 50 ml extractant, mixed for 60 seconds.",
    focus: { x: 54, y: 68, s: 1.4 },
  },
  {
    id: "probe",
    title: "Electrode Probe",
    line: "Reads pH and EC directly in the mixed sample.",
    focus: { x: 39, y: 50, s: 1.5 },
  },
] as const;

export const processSteps = [
  {
    id: "connect",
    facts: ["Bluetooth", "ArkaShine Verified pairing"],
    title: "Connect",
    line: "Pair SoiLenz with the Soil Partner app over Bluetooth.",
    focus: { x: 82, y: 62, s: 2.1 },
  },
  {
    id: "prepare",
    facts: ["5 g soil", "40 ml extractant"],
    title: "Prepare",
    line: "5 g of soil. 40 ml of extractant. One sample setter.",
    focus: { x: 18, y: 72, s: 2.0 },
  },
  {
    id: "analyze",
    facts: ["60 s auto-mix", "~5 min filtering"],
    title: "Analyze",
    line: "Automated mixing, filtering and 14-parameter analysis.",
    focus: { x: 56, y: 52, s: 1.6 },
  },
  {
    id: "report",
    facts: ["Built-in printer", "Synced to app"],
    title: "Report",
    line: "Printed in the field. Synced to the app.",
    focus: { x: 47, y: 66, s: 2.6 },
  },
] as const;

export const appScreens = [
  { id: "dashboard", title: "Soil Health Dashboard", src: "/images/app/dashboard-bhanu.webp", w: 430, h: 623 },
  { id: "nutrients", title: "Nutrient Results", src: "/images/app/nutrients.webp", w: 637, h: 845 },
  { id: "advisory", title: "Crop Advisory", src: "/images/app/advisory.webp", w: 632, h: 766 },
] as const;

export const deployments = [
  {
    id: "karnataka",
    name: "Karnataka",
    region: "South India",
    lat: 15.3173,
    lng: 75.7139,
    line: "Home of ArkaShine. Farmer demonstrations, FPOs and KVKs across the state.",
    photo: "/images/field/farmers-with-soillenz.webp",
  },
  {
    id: "kerala",
    name: "Kerala",
    region: "South India",
    lat: 10.8505,
    lng: 76.2711,
    line: "Soil health programmes with farmer groups and partners.",
    photo: "/images/field/demo-group.webp",
  },
  {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    region: "South India",
    lat: 11.1271,
    lng: 78.6569,
    line: "Field demonstrations with farmers and agri partners.",
    photo: "/images/field/maize-field-day.webp",
  },
  {
    id: "andhra-pradesh",
    name: "Andhra Pradesh",
    region: "South India",
    lat: 15.9129,
    lng: 79.74,
    line: "Village soil-health camps with printed farmer reports.",
    photo: "/images/field/village-meeting.webp",
  },
  {
    id: "odisha",
    name: "Odisha",
    region: "East India",
    lat: 20.9517,
    lng: 85.0985,
    line: "Foundation-supported programmes and trainings with smallholder farmers.",
    photo: "/images/people/odisha-training-hall.webp",
  },
  {
    id: "west-bengal",
    name: "West Bengal",
    region: "East India",
    lat: 22.9868,
    lng: 87.855,
    line: "Soil testing outreach with farmer groups.",
    photo: "/images/field/odisha-field-meeting.webp",
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    region: "North-West India",
    lat: 27.0238,
    lng: 74.2179,
    line: "Training young professionals to run SoiLenz in their villages.",
    photo: "/images/people/young-professionals-training.webp",
  },
  {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    region: "North India",
    lat: 26.8467,
    lng: 80.9462,
    line: "Soil Partner centres and gram panchayat awareness sessions.",
    photo: "/images/people/soil-partner-women-up.webp",
  },
] as const;

export const impactMetrics = [
  { value: "25,000+", label: "Farmer Outreach" },
  { value: "4,000+", label: "Soil Tests Completed" },
  { value: "8 states", label: "Agricultural Reach" },
  { value: "KA · KL · TN · AP · OD · WB · RJ · UP", label: "Field Deployment" },
] as const;

export const ecosystem = [
  "FPOs",
  "Government & KVKs",
  "Agricultural Universities",
  "CSR Initiatives",
  "Agri-Input Companies",
  "Distributors & Dealers",
  "Soil Testing Entrepreneurs",
] as const;

/* granted patents, from the Patent Office grant certificates */
export const patents = [
  {
    id: "p1",
    number: "IN 387972",
    application: "202141028625",
    title: "Apparatus and method for soil testing",
    filed: "25 Jun 2021",
    date: "31 Jan 2022",
    status: "Granted",
    note: "Main patent for the ArkaShine soil-testing apparatus and method.",
  },
  {
    id: "p2",
    number: "IN 419926",
    application: "202142041007",
    title: "Apparatus and method for soil testing",
    filed: "25 Jun 2021",
    date: "31 Jan 2023",
    status: "Granted",
    note: "Apparatus and method for soil testing.",
  },
  {
    id: "p3",
    number: "IN 559652",
    application: "202441011559",
    title: "Apparatus for testing soil",
    filed: "19 Feb 2024",
    date: "6 Feb 2025",
    status: "Granted",
    note: "Current-generation soil-testing apparatus.",
  },
  {
    id: "p4",
    number: "IN 589161",
    application: "202343034432",
    title: "Portable apparatus for testing soil",
    filed: "17 May 2023",
    date: "12 May 2026",
    status: "Granted · Patent of addition",
    note: "Patent of addition to main patent IN 387972.",
  },
] as const;

/* further patents: filed/pending applications from the official patent table */
export const morePatents = [
  {
    id: "m1",
    no: "01",
    application: "202141038183",
    title: "Recommendation System and Method (AI based)",
    date: "23 Aug 2021",
    status: "Abandoned",
  },
  {
    id: "m2",
    no: "02",
    application: "202341001891",
    title: "Apparatus and Method for Analysis (quantum dots)",
    date: "09 Jan 2023",
    status: "Examination pending",
  },
  {
    id: "m3",
    no: "03",
    application: "202141044532",
    title: "Nanofiber Based Pheromones and a Method for Preparation Thereof",
    date: "01 Oct 2021",
    status: "Abandoned",
  },
  {
    id: "m4",
    no: "04",
    application: "202341072887",
    title: "System and Device for Analysing Perishable Item (storage box)",
    date: "26 Oct 2023",
    status: "Examination pending",
  },
  {
    id: "m5",
    no: "05",
    application: "202141044570",
    title: "A Nano-Emulsion Based Biopesticide Formulation and a Method for Preparation Thereof",
    date: "01 Oct 2021",
    status: "Abandoned",
  },
  {
    id: "m6",
    no: "06",
    application: "202341001892",
    title: "Apparatus for Electrical Analysis",
    date: "09 Jan 2023",
    status: "Examination pending",
  },
  {
    id: "m7",
    no: "07",
    application: "202343034432",
    title: "Recommendation System",
    date: "17 May 2023",
    status: "Awaiting Grant",
  },
  {
    id: "m8",
    no: "08",
    application: "202341069355",
    title: "Apparatus for Testing Soil",
    date: "14 Oct 2023",
    status: "Awaiting Examination Report",
  },
  {
    id: "m9",
    no: "09",
    application: "202543123472",
    title: "Recommendation System and Method",
    date: "08 Dec 2025",
    status: "Awaiting Examination Report",
  },
  {
    id: "m10",
    no: "10",
    application: "202643027718",
    title: "Soil Testing Kit",
    date: "09 Mar 2026",
    status: "Awaiting Examination Report",
  },
];

export const faqs = [
  {
    q: "What does SoiLenz 2.0 measure?",
    a: "pH, EC, OC, N, P, K, Ca, Mg, S, Fe, Mn, Cu, plus extra 2 parameters (+Zn and +B).",
  },
  {
    q: "How much soil does a test need?",
    a: "10 g of soil total for the full analysis with our pre-measured extractant and test solutions.",
  },
  {
    q: "How do farmers receive results?",
    a: "The built-in thermal printer prints the report in the field. Results also sync to the Soil Partner app over Bluetooth and can be shared instantly with farmers via WhatsApp.",
  },
  {
    q: "How has it been validated?",
    a: "Cross-validated against NABL-accredited laboratories, with field trials at UAS Dharwad.*",
  },
] as const;
