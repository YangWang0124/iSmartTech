import type { Product } from "../types";

export type AlarmDetailContent = {
  descriptionTitle: string;
  description: string;
  features: Array<[string, string]>;
  overview: string;
  capabilities: Array<[string, string]>;
  recommendedApplications: Array<[string, string]>;
  why: string;
  specifications: Array<[string, string]>;
  idealUseCases: Array<[string, string]>;
};

type ComponentSource = {
  id: string;
  name: string;
  brand?: string;
  category: string;
  categoryIds: number[];
  sku: string;
  image: string;
  pdf: string;
  pdfLabel?: string;
  short: string;
  description: string;
  features: Array<[string, string]>;
  specs: Record<string, string>;
  badge?: string;
};

const base = {
  price: 0,
  priceOnRequest: true,
  rating: 0,
  reviews: 0,
  stock: 0,
  published: true,
  colors: ["White"] as string[],
  accent: "orange",
} as const;

const componentSources: ComponentSource[] = [
  {
    id: "paradox-mg5050-control-panel",
    name: "Paradox MG5050 Hybrid Alarm Control Panel",
    category: "Wired Alarm Control Panels",
    categoryIds: [5, 33, 35, 83],
    sku: "MG5050",
    image: "/assets/alarm/paradox-mg5050.jpg",
    pdf: "https://www.paradox.com/Downloader?ID=871",
    pdfLabel: "MG5050 User Guide",
    badge: "Hybrid Panel",
    short: "A flexible Paradox Magellan hybrid alarm panel for wired and compatible wireless security devices.",
    description: "The Paradox MG5050 is a hybrid alarm control panel for residential and small commercial security systems. It supports partitioned operation, user codes and Paradox StayD arming, with compatibility across the Magellan and Spectra ecosystem. Optional IP, cellular and voice modules allow a professional installer to configure communications around the site.",
    features: [
      ["Hybrid system", "Supports a mix of compatible wired and wireless alarm devices."],
      ["Partitioned protection", "Supports two independently controlled partitions."],
      ["User management", "Supports one system master, two partition masters and 29 additional user codes."],
      ["StayD operation", "Supports Paradox StayD for convenient perimeter and stay arming."],
      ["Expandable communication", "Supports compatible IP, cellular and voice communication modules."],
      ["Installer configuration", "Programmable zones and menu-driven controls support a tailored installation."],
    ],
    specs: { Model: "MG5050", "Product type": "Hybrid alarm control panel", Partitions: "2", "User codes": "32 total", "Arming modes": "Regular, Sleep, Stay and StayD", Communications: "Compatible IP, cellular and voice modules", Ecosystem: "Paradox Magellan / Spectra" },
  },
  {
    id: "paradox-sp4000-control-panel",
    name: "Paradox SP4000 4–32 Zone Alarm Control Panel",
    category: "Wired Alarm Control Panels",
    categoryIds: [5, 33, 35, 83],
    sku: "SP4000",
    image: "/assets/alarm/paradox-sp4000.jpg",
    pdf: "https://www.paradox.com/Downloader?ID=7511",
    pdfLabel: "SP4000 User Guide",
    badge: "Wired Panel",
    short: "A compact Paradox wired alarm panel with four onboard zones and expansion to 32 zones.",
    description: "The Paradox SP4000 is a compact wired alarm control panel for residential and small commercial systems. It provides four onboard zones, supports eight zones with ATZ and can expand to 32 zones using compatible wireless or hardwired expansion hardware. Two partitions, 32 user codes and wired-siren support provide a practical foundation that can grow over time.",
    features: [
      ["Expandable zones", "Four onboard zones, eight with ATZ and expansion to 32 zones."],
      ["Two partitions", "Separates the premises into independently armed areas."],
      ["User access", "Supports 32 user codes and up to 15 keypads on the expansion bus."],
      ["StayD mode", "Supports Paradox StayD for flexible everyday arming."],
      ["Communication options", "Supports PCS Series, IP150 and VDMP3 modules."],
      ["App support", "Compatible modules enable Insite GOLD app-based system control."],
    ],
    specs: { Model: "SP4000", "Onboard zones": "4 (8 with ATZ)", "Maximum zones": "32", PGMs: "Up to 12", Partitions: "2", "User codes": "32", "Expansion bus": "4-wire; up to 15 keypads", Sirens: "Supports wired sirens", "Firmware upgrade": "BabyWare" },
  },
  {
    id: "paradox-sp5500-control-panel",
    name: "Paradox SP5500+ 5–32 Zone Alarm Control Panel",
    category: "Wired Alarm Control Panels",
    categoryIds: [5, 33, 35, 83],
    sku: "SP5500+",
    image: "/assets/alarm/paradox-sp5500.jpg",
    pdf: "https://www.paradox.com/Downloader?ID=11652",
    pdfLabel: "SP5500+ User Guide",
    badge: "Wired Panel",
    short: "An expandable Paradox five-zone alarm panel with two partitions and support for up to 32 zones.",
    description: "The Paradox SP5500+ is a five-zone control panel that expands to 32 wireless or hardwired zones with compatible modules. It supports two partitions, 32 user codes, 32 remote controls and up to 16 programmable outputs, making it suitable for larger homes and small commercial premises that need room for future expansion.",
    features: [
      ["Expandable zones", "Five onboard zones with expansion to 32 wired or wireless zones."],
      ["Two partitions", "Independently manages two protected areas."],
      ["Flexible outputs", "Two onboard PGMs with expansion to 16 outputs."],
      ["User capacity", "Supports 32 user codes and 32 remote controls."],
      ["Dual serial ports", "Separate primary and backup communication channels."],
      ["StayD and BabyWare", "Supports StayD operation and in-field firmware upgrades through BabyWare."],
    ],
    specs: { Model: "SP5500+", "Onboard zones": "5", "Maximum zones": "32", PGMs: "2 onboard; expandable to 16", Partitions: "2", "User codes": "32", "Remote controls": "32", "Serial ports": "2", "BabyWare communication": "115K baud" },
  },
  {
    id: "paradox-k10h-keypad",
    name: "Paradox K10H 10-Zone Horizontal LED Keypad",
    category: "Alarm Accessories",
    categoryIds: [5, 33, 40, 83],
    sku: "K10H",
    image: "/assets/alarm/paradox-k10h.jpg",
    pdf: "https://www.paradox.com/Downloader?ID=871",
    pdfLabel: "K10H User Guide",
    short: "A horizontal ten-zone hardwired LED keypad for compatible Paradox Magellan and Spectra panels.",
    description: "The Paradox K10H is a horizontal ten-zone hardwired LED keypad that provides clear zone and partition status for compatible Magellan and Spectra systems. Dedicated Arm, Sleep, Stay and Off indicators, illuminated zone keys and one-touch controls make routine operation straightforward.",
    features: [
      ["Ten-zone display", "Dedicated LEDs show the state of up to ten zones."],
      ["Clear arming status", "Separate Arm, Sleep, Stay and Off LEDs for each partition."],
      ["Key Light display", "Zone buttons illuminate to identify an open zone."],
      ["Keypad zone input", "Provides one onboard zone input."],
      ["Quick actions", "Seven one-touch actions and three keypad panic alarms."],
      ["Four-wire bus", "Connects to the compatible panel communication bus."],
    ],
    specs: { Model: "K10H", Orientation: "Horizontal", Display: "10-zone LED", "Zone inputs": "1 keypad zone", "Panic alarms": "3", "One-touch actions": "7", Connection: "4-wire communication bus", Compatibility: "MG5000, MG5050, MG5075 and Spectra SP series" },
  },
  {
    id: "paradox-k10v-keypad",
    name: "Paradox K10V 10-Zone Vertical LED Keypad",
    category: "Alarm Accessories",
    categoryIds: [5, 33, 40, 83],
    sku: "K10V",
    image: "/assets/alarm/paradox-k10v.jpg",
    pdf: "https://www.paradox.com/Downloader?ID=8386",
    pdfLabel: "K10V Quick Start",
    short: "A vertical ten-zone hardwired LED keypad for compatible Paradox Magellan and Spectra panels.",
    description: "The Paradox K10V provides practical ten-zone LED operation in a space-saving vertical format. It connects to the panel's four-wire communication bus and provides dedicated arming indicators, illuminated zone keys, a keypad zone input and programmable one-touch actions.",
    features: [
      ["Vertical format", "A compact upright keypad for narrower mounting locations."],
      ["Ten-zone display", "Dedicated LEDs show zone status at a glance."],
      ["Clear arming status", "Separate Arm, Sleep, Stay and Off LEDs for each partition."],
      ["Key Light display", "Illuminated keys identify open zones."],
      ["Quick actions", "Seven one-touch actions and three keypad panic alarms."],
      ["Four-wire bus", "Connects directly to compatible Paradox panels."],
    ],
    specs: { Model: "K10V", Orientation: "Vertical", Display: "10-zone LED", "Zone inputs": "1 keypad zone", "Panic alarms": "3", "One-touch actions": "7", Connection: "4-wire communication bus", Compatibility: "MG5000, MG5050, MG5075 and Spectra SP series" },
  },
  {
    id: "paradox-tm50-touch-keypad",
    name: "Paradox TM50 5-inch Touchscreen Keypad",
    category: "Alarm Accessories",
    categoryIds: [5, 33, 40, 83],
    sku: "TM50",
    image: "/assets/alarm/paradox-tm50.jpg",
    pdf: "https://www.paradox.com/Downloader/?ID=5956",
    pdfLabel: "TM50 Product PDF",
    badge: "Touchscreen",
    short: "A slim five-inch colour touchscreen keypad with icon-based controls for compatible Paradox alarm systems.",
    description: "The Paradox TM50 is a slim, surface-mounted touchscreen keypad with a vivid five-inch colour display and intuitive icon-based menus. It provides fast access to everyday alarm functions, controls up to eight PGM outputs and supports customised labels, languages, firmware updates and media through its microSD card slot.",
    features: [
      ["Five-inch touchscreen", "Vivid 480 × 272 colour display with responsive icon-based menus."],
      ["User-friendly control", "Menu prompts simplify everyday arming and system operation."],
      ["PGM control", "Operates up to eight programmable outputs."],
      ["Zone input", "Includes one zone or temperature-sensor input."],
      ["microSD support", "Enables firmware upgrades, photos and configuration media."],
      ["Custom interface", "Supports editable zone, area, user and PGM labels."],
    ],
    specs: { Model: "TM50", Display: "5.0-inch / 12.7 cm colour touchscreen", Resolution: "480 × 272 pixels", PGMs: "Controls up to 8", Inputs: "1 zone / temperature input", Installation: "Surface mount", Dimensions: "14.4 × 9.6 × 1.4 cm", Media: "microSD card slot", Colour: "Pristine White" },
  },
  {
    id: "paradox-476-pir-detector",
    name: "Paradox 476 Pro Passive Infrared Detector",
    category: "Wired Alarm Sensors",
    categoryIds: [5, 33, 38, 83],
    sku: "476",
    image: "/assets/alarm/paradox-476.avif",
    pdf: "https://www.paradox.com/Downloader?ID=9514",
    pdfLabel: "476 Product PDF",
    short: "An 11 m by 11 m wired PIR detector with automatic temperature compensation and tamper protection.",
    description: "The Paradox 476 Pro is a passive infrared intruder detector designed to identify human movement within a protected area. Its single-element analogue sensor covers up to 11 by 11 metres with a 110-degree viewing angle, while automatic temperature compensation and a metal RF shield help maintain stable detection performance.",
    features: [
      ["Wide PIR coverage", "Covers up to 11 m × 11 m with a 110° viewing angle."],
      ["False-alarm stability", "Designed for stable detection of human body movement."],
      ["Temperature compensation", "Automatically adjusts detection as ambient temperature changes."],
      ["RF protection", "Metal shielding improves EMI and RFI immunity."],
      ["Tamper protection", "Built-in switch detects enclosure opening."],
      ["Panel powered", "Operates from the alarm panel's 12V DC supply."],
    ],
    specs: { Model: "476 Pro", "Detection method": "Analogue PIR; single-element sensor", Coverage: "11 m × 11 m", "Viewing angle": "110°", Power: "12V DC from alarm panel", Relay: "Solid state", Indicators: "LED", Protection: "Anti-tamper switch; EMI/RFI shield", Warranty: "3 years" },
  },
  {
    id: "paradox-nv5-pir-detector",
    name: "Paradox NV5 High-Performance PIR Motion Detector",
    category: "Wired Alarm Sensors",
    categoryIds: [5, 33, 38, 83],
    sku: "NV5",
    image: "/assets/alarm/paradox-nv5.jpg",
    pdf: "https://www.paradox.com/Downloader?ID=6486",
    pdfLabel: "NV5 Technical Brochure",
    short: "A compact high-performance PIR detector with five sensitivity levels and improved false-alarm immunity.",
    description: "The Paradox NV5 is a compact high-performance infrared motion detector designed for fast, even detection with strong false-alarm immunity. Auto Pulse Signal Processing, selectable edge processing, digital temperature compensation and five sensitivity levels allow the detector to be adjusted for the protected area.",
    features: [
      ["Reliable detection", "Designed for even coverage without dead zones within the protected range."],
      ["False-alarm immunity", "APSP and selectable edge processing balance detection speed and immunity."],
      ["Five sensitivity levels", "Adjusts response to suit the protected environment."],
      ["Temperature compensation", "Maintains catch performance across operating temperatures."],
      ["Hybrid Fresnel lens", "Cylindrical and spherical segments optimise far, medium and creep-zone beams."],
      ["Installer friendly", "Clip-in board design avoids routine PCB removal during installation."],
    ],
    specs: { Model: "NV5", "Product type": "High-performance infrared motion detector", Sensitivity: "5 selectable levels", Processing: "Auto Pulse Signal Processing; dual/single edge", Compensation: "Digital temperature compensation", Lens: "Hybrid cylindrical-spherical 3D LoDiff Fresnel", Compatibility: "EVO, Spectra, Magellan and third-party panels", Mounting: "Optional wall / ceiling bracket" },
  },
  {
    id: "ritar-rt1272-battery",
    name: "Ritar RT1272 12V 7.2Ah Sealed Lead-Acid Battery",
    brand: "Ritar",
    category: "Alarm Accessories",
    categoryIds: [5, 33, 40, 83],
    sku: "RT1272",
    image: "/assets/alarm/ritar-rt1272.jpg",
    pdf: "/assets/alarm/ritar-rt1272.pdf",
    short: "A maintenance-free 12V 7.2Ah sealed lead-acid standby battery with F2 terminals.",
    description: "The Ritar RT1272 is a general-purpose 12V 7.2Ah sealed lead-acid battery suited to alarm systems and other standby applications. Its sealed, maintenance-free construction, heavy-duty grids and low self-discharge are designed for reliable float or cyclic service.",
    features: [
      ["Sealed construction", "Maintenance-free SLA chemistry for practical standby use."],
      ["Reliable standby service", "Heavy-duty grids and low self-discharge support long service life."],
      ["12V 7.2Ah capacity", "Suitable for compatible alarm panels and backup applications."],
      ["F2 terminals", "Uses 6.35 mm tags for connection."],
      ["Broad applications", "Suitable for security systems, UPS/EPS and emergency equipment."],
      ["Standards", "Designed to meet IEC and JIS requirements."],
    ],
    specs: { Model: "RT1272", Voltage: "12V", Capacity: "7.2Ah (C20)", Chemistry: "Sealed lead acid (SLA)", Terminal: "F2, 6.35 mm", Dimensions: "151 × 65 × 94 mm", Weight: "2.15 kg", "Design life": "5-year float design life", Quantity: "1 battery" },
  },
  {
    id: "alarm-flush-mount-internal-siren",
    name: "Flush-Mount Internal Alarm Siren",
    brand: "Generic",
    category: "Wired Alarm Sirens",
    categoryIds: [5, 33, 39, 83],
    sku: "FM-INT-SIREN",
    image: "/assets/alarm/internal-siren.png",
    pdf: "/assets/alarm/internal-siren.pdf",
    short: "A compact white flush-mount 12V internal siren compatible with alarm control panels.",
    description: "This flush-mount internal siren provides a compact audible warning device for compatible alarm systems. It operates from a nominal 12V DC supply, works across a 6–15V DC range and produces a rated sound pressure level of 105 ±3 dB at 30 cm.",
    features: [
      ["Flush-mount design", "Fits neatly into a suitable internal mounting position."],
      ["Broad compatibility", "Designed to work with alarm control panels."],
      ["Audible warning", "Rated at 105 ±3 dB measured at 30 cm."],
      ["12V operation", "Nominal 12V DC with a 6–15V operating range."],
      ["Compact format", "59 mm × 76 mm body in a white finish."],
    ],
    specs: { "Product type": "Flush-mount internal siren", Current: "120 mA", Voltage: "12V DC nominal", "Operating range": "6–15V DC", "Sound pressure": "105 ±3 dB at 30 cm", Dimensions: "59 × 76 mm", Colour: "White", Warranty: "2 years" },
  },
  {
    id: "alarm-polycarbonate-external-siren",
    name: "Polycarbonate Teardrop External Alarm Siren with Strobe",
    brand: "Generic",
    category: "Wired Alarm Sirens",
    categoryIds: [5, 33, 39, 83],
    sku: "TEARDROP-EXT-SIREN",
    image: "/assets/alarm/external-siren.jpg",
    pdf: "/assets/alarm/external-siren.pdf",
    short: "A white polycarbonate external 12V alarm siren with an integrated blue strobe light.",
    description: "This polycarbonate teardrop external siren combines a high-output audible alarm with an integrated blue strobe. Designed for compatible alarm panels, it operates from a nominal 12V DC supply and produces a rated 114 ±5 dB at 30 cm for a clear external warning.",
    features: [
      ["Combined warning", "Integrates an external siren and blue strobe light."],
      ["High sound output", "Rated at 114 ±5 dB measured at 30 cm."],
      ["Polycarbonate enclosure", "Durable teardrop housing for external alarm applications."],
      ["Broad compatibility", "Designed to work with alarm control panels."],
      ["12V operation", "Nominal 12V DC with a 6–15V operating range."],
    ],
    specs: { "Product type": "Polycarbonate teardrop external siren", Strobe: "Integrated blue strobe", Current: "200 mA", Voltage: "12V DC nominal", "Operating range": "6–15V DC", "Sound pressure": "114 ±5 dB at 30 cm", Dimensions: "205 × 114 × 60 mm", Colour: "White with blue strobe", Warranty: "2 years" },
  },
];

const components: Product[] = componentSources.map((item) => ({
  ...base,
  id: item.id,
  name: item.name,
  brand: item.brand ?? "Paradox",
  category: item.category,
  categoryIds: item.categoryIds,
  tagIds: [],
  sku: item.sku,
  badge: item.badge,
  icon: item.category.includes("Sensors") ? "PIR" : item.category.includes("Sirens") ? "SIR" : item.sku.includes("K10") || item.sku === "TM50" ? "KEY" : item.sku === "RT1272" ? "BAT" : "ALM",
  image: item.image,
  datasheetUrl: item.pdfLabel ? undefined : item.pdf,
  specSheetLinks: item.pdfLabel ? [{ label: item.pdfLabel, url: item.pdf }] : undefined,
  shortDescription: item.short,
  description: item.description,
  features: item.features.map(([title, detail]) => `${title}: ${detail}`),
  specifications: item.specs,
}));

type KitDefinition = { id: string; name: string; sku: string; panel: string; keypad: string; detector: string };
const common = ["ritar-rt1272-battery", "alarm-flush-mount-internal-siren", "alarm-polycarbonate-external-siren"];
const kitDefinitions: KitDefinition[] = [
  { id: "paradox-mg5050-k10h-alarm-kit", name: "Paradox MG5050 Alarm Kit with K10H Keypad", sku: "MG5050-K10H-KIT", panel: "paradox-mg5050-control-panel", keypad: "paradox-k10h-keypad", detector: "paradox-476-pir-detector" },
  { id: "paradox-mg5050-k10v-alarm-kit", name: "Paradox MG5050 Alarm Kit with K10V Keypad", sku: "MG5050-K10V-KIT", panel: "paradox-mg5050-control-panel", keypad: "paradox-k10v-keypad", detector: "paradox-476-pir-detector" },
  { id: "paradox-sp4000-alarm-kit", name: "Paradox SP4000 Alarm Kit with K10H Keypad", sku: "SP4000-K10H-KIT", panel: "paradox-sp4000-control-panel", keypad: "paradox-k10h-keypad", detector: "paradox-476-pir-detector" },
  { id: "paradox-sp4000-k10v-alarm-kit", name: "Paradox SP4000 Alarm Kit with K10V Keypad", sku: "SP4000-K10V-KIT", panel: "paradox-sp4000-control-panel", keypad: "paradox-k10v-keypad", detector: "paradox-476-pir-detector" },
  { id: "paradox-mg5050-tm50-alarm-kit", name: "Paradox MG5050 Alarm Kit with TM50 Touchscreen", sku: "MG5050-TM50-KIT", panel: "paradox-mg5050-control-panel", keypad: "paradox-tm50-touch-keypad", detector: "paradox-nv5-pir-detector" },
  { id: "paradox-sp5500-alarm-kit", name: "Paradox SP5500+ Alarm Kit with K10H Keypad", sku: "SP5500-K10H-KIT", panel: "paradox-sp5500-control-panel", keypad: "paradox-k10h-keypad", detector: "paradox-476-pir-detector" },
  { id: "paradox-sp5500-k10v-alarm-kit", name: "Paradox SP5500+ Alarm Kit with K10V Keypad", sku: "SP5500-K10V-KIT", panel: "paradox-sp5500-control-panel", keypad: "paradox-k10v-keypad", detector: "paradox-476-pir-detector" },
  { id: "paradox-sp5500-tm50-alarm-kit", name: "Paradox SP5500+ Alarm Kit with TM50 Touchscreen", sku: "SP5500-TM50-KIT", panel: "paradox-sp5500-control-panel", keypad: "paradox-tm50-touch-keypad", detector: "paradox-nv5-pir-detector" },
];

const byId = new Map(components.map((product) => [product.id, product]));
export const alarmKitComponentIds: Record<string, string[]> = Object.fromEntries(
  kitDefinitions.map((kit) => [kit.id, [kit.panel, kit.keypad, kit.detector, ...common]])
);

const createKit = (kit: KitDefinition): Product => {
  const members = alarmKitComponentIds[kit.id].map((id) => byId.get(id)!).filter(Boolean);
  const [panel, keypad, detector] = members;
  const hybrid = panel.id.includes("mg5050");
  return {
    ...base,
    id: kit.id,
    name: kit.name,
    brand: "Paradox",
    category: hybrid ? "Wireless Alarm Kits" : "Hardwired Alarm Kits",
    categoryIds: hybrid ? [5, 34, 42, 82] : [5, 33, 36, 82],
    tagIds: [],
    sku: kit.sku,
    badge: "Alarm Kit",
    icon: "ALM",
    image: panel.image,
    galleryImages: members.slice(1).map((member) => member.image!).filter(Boolean),
    specSheetLinks: [panel, keypad, detector].flatMap((member) => member.specSheetLinks ?? (member.datasheetUrl ? [{ label: member.sku + " Product PDF", url: member.datasheetUrl }] : [])),
    subProducts: members.map((member) => ({ id: member.id, name: member.name, sku: member.sku })),
    shortDescription: `A complete Paradox alarm package built around the ${panel.sku} panel, ${keypad.sku} keypad and ${detector.sku} motion detector.`,
    description: `${kit.name} combines the ${panel.name}, ${keypad.name}, ${detector.name}, a Ritar RT1272 backup battery, a flush-mount internal siren and a polycarbonate external siren with strobe. The supplied components form a practical foundation for a professionally designed residential or small commercial alarm system.`,
    features: [
      `Matched Paradox controls: ${panel.sku} panel and ${keypad.sku} keypad provide a compatible operating platform.`,
      `Motion detection: Includes the ${detector.sku} PIR detector for protected-area movement detection.`,
      "Audible and visual warning: Includes an internal siren plus an external siren with blue strobe.",
      "Backup power: Includes a Ritar RT1272 12V 7.2Ah sealed lead-acid battery.",
      "Expandable system: Compatible panel expansion supports future zones and communication options.",
      "Installer-ready package: Core alarm devices are grouped for professional system design and installation.",
    ],
    specifications: {
      "Control panel": `${panel.name} (${panel.sku})`,
      Keypad: `${keypad.name} (${keypad.sku})`,
      "Motion detector": `${detector.name} (${detector.sku})`,
      "Backup battery": "Ritar RT1272, 12V 7.2Ah",
      "Internal warning": "Flush-mount internal siren",
      "External warning": "Polycarbonate teardrop siren with blue strobe",
      "System type": hybrid ? "Hybrid alarm system" : "Hardwired alarm system with compatible expansion",
      "Installation note": "System design, compatible modules, cabling and quantities should be confirmed for the site",
    },
  };
};

const kits = kitDefinitions.map(createKit);

type ArrowheadKitDefinition = {
  id: string;
  name: string;
  sku: string;
  image: string;
  pdf: string;
  keypad: string;
  keypadColour: "White" | "Black";
  includesCable: boolean;
};

const arrowheadKitDefinitions: ArrowheadKitDefinition[] = [
  { id: "arrowhead-ec-led-alarm-kit", name: "Arrowhead EC Alarm Kit with LED Keypad, 2 Detectors, Sirens and Cable", sku: "EC-KIT KP W", image: "/assets/alarm/arrowhead/ec-kit-led-with-cable.png", pdf: "/assets/alarm/arrowhead/ec-kit-led-with-cable.pdf", keypad: "white slimline LED keypad", keypadColour: "White", includesCable: true },
  { id: "arrowhead-ec-lcd-alarm-kit", name: "Arrowhead EC Alarm Kit with LCD Keypad, 2 Detectors, Sirens and Cable", sku: "EC-KIT LCD", image: "/assets/alarm/arrowhead/ec-kit-lcd-with-cable.png", pdf: "/assets/alarm/arrowhead/ec-kit-lcd-with-cable.pdf", keypad: "full-English vertical LCD keypad", keypadColour: "White", includesCable: true },
  { id: "arrowhead-ec-led-alarm-kit-no-cable", name: "Arrowhead EC Alarm Kit with LED Keypad, 2 Detectors and Sirens", sku: "EC-KIT KP W NC", image: "/assets/alarm/arrowhead/ec-kit-led-no-cable.png", pdf: "/assets/alarm/arrowhead/ec-kit-led-no-cable.pdf", keypad: "white slimline LED keypad", keypadColour: "White", includesCable: false },
  { id: "arrowhead-ec-lcd-alarm-kit-no-cable", name: "Arrowhead EC Alarm Kit with LCD Keypad, 2 Detectors and Sirens", sku: "EC-KIT LCD NC", image: "/assets/alarm/arrowhead/ec-kit-lcd-no-cable.png", pdf: "/assets/alarm/arrowhead/ec-kit-lcd-no-cable.pdf", keypad: "full-English vertical LCD keypad", keypadColour: "White", includesCable: false },
  { id: "arrowhead-ec-black-touchscreen-alarm-kit", name: "Arrowhead EC Alarm Kit with Black Touchscreen Keypad, 2 Detectors and Sirens", sku: "EC-KIT TOUCH B NC", image: "/assets/alarm/arrowhead/ec-kit-touch-black-no-cable.png", pdf: "/assets/alarm/arrowhead/ec-kit-touch-black-no-cable.pdf", keypad: "black touchscreen keypad", keypadColour: "Black", includesCable: false },
  { id: "arrowhead-ec-white-touchscreen-alarm-kit", name: "Arrowhead EC Alarm Kit with White Touchscreen Keypad, 2 Detectors and Sirens", sku: "EC-KIT TOUCH W NC", image: "/assets/alarm/arrowhead/ec-kit-touch-white-no-cable.png", pdf: "/assets/alarm/arrowhead/ec-kit-touch-white-no-cable.pdf", keypad: "white touchscreen keypad", keypadColour: "White", includesCable: false },
];

export const arrowheadKitIncludedItems: Record<string, Array<[string, string]>> = Object.fromEntries(
  arrowheadKitDefinitions.map((kit) => [kit.id, [
    ["Alarm panel", "1 x Arrowhead EC hardwired 8-zone alarm panel in a plastic cabinet with transformer and fuse assembly"],
    ["Keypad", `1 x ${kit.keypad}`],
    ["Backup battery", "1 x 7.0 Ah backup battery"],
    ["Motion detection", "2 x Optex FLX-S-ST pet-tolerant PIR detectors, suitable for pets up to 18 kg"],
    ["External warning", "1 x Arrowhead EC external siren"],
    ["Internal warning", "1 x flush-mount internal siren"],
    ...(kit.includesCable ? [["Alarm cable", "1 x 100 metre box of 0.2 alarm cable"] as [string, string]] : []),
  ]])
);

const createArrowheadKit = (kit: ArrowheadKitDefinition): Product => ({
  ...base,
  id: kit.id,
  name: kit.name,
  brand: "Arrowhead",
  category: "Hardwired Alarm Kits",
  categoryIds: [5, 33, 36, 82],
  tagIds: [],
  sku: kit.sku,
  badge: "Hardwired Kit",
  icon: "ALM",
  image: kit.image,
  datasheetUrl: kit.pdf,
  colors: [kit.keypadColour],
  shortDescription: `An expandable Arrowhead EC hardwired alarm package with a ${kit.keypad}, two pet-tolerant detectors, backup power and internal and external sirens${kit.includesCable ? ", plus a 100 m cable box" : ""}.`,
  description: `This Arrowhead EC kit brings together an 8-zone hardwired control panel, a ${kit.keypad}, two Optex pet-tolerant PIR detectors, a 7.0 Ah backup battery and indoor and outdoor audible warning devices. The panel can grow to 248 zones with compatible EC-Z8 expanders and can support optional app, monitoring and Infinity wireless functions when the required add-on modules are installed.${kit.includesCable ? " A 100 metre box of 0.2 alarm cable is also included." : " Cable is not listed as part of this package."}`,
  features: [
    "Expandable protection: Starts with 8 hardwired zones and supports expansion to 248 zones using compatible EC-Z8 input expanders.",
    `Matched user interface: Includes a ${kit.keypad} for daily system operation.`,
    "Pet-tolerant detection: Includes two Optex FLX-S-ST PIR detectors rated for pets up to 18 kg.",
    "Flexible system scale: Supports up to 32 areas, 32 keypads and 2,000 users, including up to 1,900 wireless users.",
    "Optional connected control: Elite Cloud app access and monitoring require the appropriate plug-on communication module.",
    "Future wireless expansion: A compatible Infinity Wireless Link can add wireless detectors, remotes, panic buttons and sirens.",
    "Integrated outputs: Four onboard outputs can expand to 32 using compatible EC-O4 output expanders.",
    "Five-year warranty: The supplied listing specifies five-year warranty coverage.",
  ],
  specifications: {
    "Control panel": "Arrowhead EC hardwired alarm panel in plastic cabinet with transformer and fuse assembly",
    "Onboard zones": "8",
    "Maximum zones": "248 with compatible EC-Z8 input expanders",
    "Areas and keypads": "Up to 32 areas and 32 keypads",
    "User capacity": "Up to 2,000 users, including up to 1,900 wireless users",
    "Access control": "Supports up to 32 doors",
    "Onboard outputs": "4; expandable to 32 with compatible EC-O4 output expanders",
    "Accessory power": "13.8V DC, 1A fused",
    Keypad: kit.keypad,
    Detection: "2 x Optex FLX-S-ST pet-tolerant PIR detectors, up to 18 kg",
    "Backup battery": "7.0 Ah",
    Sirens: "1 x Arrowhead EC external siren and 1 x flush-mount internal siren",
    Cable: kit.includesCable ? "100 metre box of 0.2 alarm cable included" : "Not listed as included",
    Communications: "Optional plug-on module required for monitoring or Elite Cloud app access",
    "Wireless expansion": "Optional Infinity Wireless Link supports compatible wireless devices",
    Warranty: "5 years",
  },
});

const arrowheadKits = arrowheadKitDefinitions.map(createArrowheadKit);
export const alarmProducts: Product[] = [...kits, ...arrowheadKits, ...components];
const alarmIds = new Set(alarmProducts.map((product) => product.id));

export function isAlarmProduct(product: Product) {
  return alarmIds.has(product.id);
}

export function alarmKitComponentDisplayName(kitId: string, component: Product) {
  if (kitId.startsWith("paradox-mg5050-") && component.id === "paradox-mg5050-control-panel") {
    return `1 \u00d7 Wireless Enabled Panel \u2014 ${component.name}`;
  }
  return component.name;
}

const featurePairs = (features: string[]): Array<[string, string]> => features.map((feature) => {
  const [title, ...detail] = feature.split(":");
  return [title, detail.join(":").trim() || title];
});

export function createAlarmDetailContent(product: Product): AlarmDetailContent | undefined {
  if (!isAlarmProduct(product)) return undefined;
  const hasLinkedComponents = Boolean(alarmKitComponentIds[product.id]);
  const isKit = hasLinkedComponents || Boolean(arrowheadKitIncludedItems[product.id]);
  const isDetector = product.category.includes("Sensors");
  const isSiren = product.category.includes("Sirens");
  const isPanel = product.category.includes("Control Panels");
  const applications: Array<[string, string]> = isKit
    ? [["Residential alarm systems", "A practical core package for professionally designed home intrusion protection."], ["Small commercial premises", "Suitable as the starting point for offices, retail spaces and other compact sites."], ["Expandable installations", "The selected alarm platform can accept compatible zones and communication modules as requirements grow."]]
    : isDetector
      ? [["Interior detection", "Monitors selected rooms, corridors and access areas for movement."], ["Alarm-system expansion", "Adds a detection zone to a compatible professionally installed system."], ["Residential and commercial sites", "Suitable for appropriately designed indoor protection areas."]]
      : isSiren
        ? [["Alarm notification", "Provides an audible warning when activated by a compatible alarm panel."], ["Residential systems", "Suitable for professionally designed household alarm installations."], ["Commercial systems", "Adds local warning to compatible small-business security systems."]]
        : isPanel
          ? [["Residential security", "Provides the central control platform for a tailored home alarm system."], ["Small commercial security", "Supports zoned protection for offices, retail and similar premises."], ["Expandable alarm systems", "Allows compatible keypads, detectors and communication modules to be added around site needs."]]
          : [["Alarm-system installation", "Adds a compatible control, power or interface component to a professionally designed system."], ["Residential security", "Suitable for compatible household alarm installations."], ["Small commercial security", "Supports compatible alarm systems in offices, shops and similar sites."]];
  const capabilities = featurePairs(product.features);
  return {
    descriptionTitle: product.shortDescription,
    description: product.description,
    features: capabilities,
    overview: `${product.description} ${hasLinkedComponents ? "Each included component also has its own product page with the supplied specifications and datasheet." : "The included equipment and technical details follow the supplied product material."}`,
    capabilities,
    recommendedApplications: applications,
    why: isKit
      ? `${product.name} groups a compatible control panel, user interface, motion detector, backup battery and internal and external warning devices into one documented package. The listed control, interface, detection, backup-power and warning equipment is kept consistent across related kit variants.`
      : `${product.name} provides a focused component for compatible alarm installations. Its supplied features and specifications are presented together so suitability can be confirmed before installation.`,
    specifications: Object.entries(product.specifications),
    idealUseCases: applications,
  };
}

export function alarmPageHeadings(product: Product) {
  const isKit = Boolean(alarmKitComponentIds[product.id]) || Boolean(arrowheadKitIncludedItems[product.id]);
  return {
    overview: isKit ? "A coordinated alarm package for professional installation" : `Purpose-built ${product.category.toLowerCase()}`,
    recommended: isKit ? "Suited to practical residential and commercial security" : "Suited to compatible alarm-system installations",
    whyEyebrow: `Why the ${product.sku}?`,
    why: isKit ? "Compatible core components in one documented kit" : "A focused component for a dependable alarm system",
    uses: isKit ? "Flexible protection from homes to small businesses" : "Practical applications in professionally designed alarm systems",
  };
}
