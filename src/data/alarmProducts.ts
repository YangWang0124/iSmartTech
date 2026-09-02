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
    short: "Hybrid wired and wireless protection with room to grow",
    description: "The Paradox MG5050 provides a flexible foundation for homes and small commercial premises that need wired devices, wireless devices or a combination of both. Five onboard inputs can provide five additional ATZ zones, while the system can manage up to 32 compatible zones across two independently controlled partitions. A built-in 433 MHz transceiver supports compatible Magellan wireless equipment without requiring a separate receiver. StayD operation, RF-jamming supervision and a 256-event history support practical everyday control and servicing, while compatible communication modules can add remote reporting or connected system access when required.",
    features: [
      ["Hybrid 32-zone capacity", "Combines five onboard inputs, five additional ATZ zones and support for up to 32 compatible wired or wireless zones."],
      ["Integrated wireless transceiver", "Built-in 433 MHz wireless communication supports compatible Magellan devices and remote controls."],
      ["Partitioned protection", "Supports two independently controlled partitions."],
      ["Wireless system growth", "Supports up to eight compatible K32RF or K37 wireless keypads and two RPT1 wireless repeaters."],
      ["RF supervision", "Wireless-jamming supervision helps identify interference affecting the radio system."],
      ["Event history", "Stores up to 256 system events for review and servicing."],
      ["StayD operation", "Supports Paradox StayD for convenient perimeter and stay arming."],
      ["Expandable communication", "Supports compatible IP, cellular and voice communication modules."],
    ],
    specs: { Model: "MG5050", "Product type": "Hybrid alarm control panel", "Onboard zones": "5 inputs; 5 additional zones with ATZ", "Maximum zones": "32 wired or wireless", Transceiver: "Built-in 433 MHz", Partitions: "2", "User codes": "32 total", "Remote controls": "Up to 32", "Wireless keypads": "Up to 8 compatible K32RF / K37 keypads", "Wireless repeaters": "Up to 2 compatible RPT1 repeaters", "Event buffer": "256 events", "RF supervision": "Wireless-jamming supervision", "Arming modes": "Regular, Sleep, Stay and StayD", Communications: "Compatible IP, cellular and voice modules", Ecosystem: "Paradox Magellan / Spectra" },
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
    short: "Expandable protection for compact wired alarm systems",
    description: "The Paradox SP4000 is a compact control panel for homes and small commercial premises that need dependable hardwired protection with a clear path for future expansion. It starts with four onboard zones, can provide eight zones through ATZ and expands to 32 hardwired or compatible wireless zones when the appropriate modules are fitted. Two partitions allow separate areas to be managed independently, while 32 user codes support households or workplaces with several authorised users. StayD operation, wired-siren support and compatibility with Paradox communication modules allow an installer to shape the finished system around the site.",
    features: [
      ["Expandable zones", "Four onboard zones, eight with ATZ and expansion to 32 zones."],
      ["Two partitions", "Separates the premises into independently armed areas."],
      ["User access", "Supports 32 user codes and up to 15 keypads on the expansion bus."],
      ["StayD mode", "Supports Paradox StayD for flexible everyday arming."],
      ["Communication options", "Supports PCS Series, IP150 and VDMP3 modules."],
      ["App support", "Compatible modules enable Insite GOLD app-based system control."],
    ],
    specs: { Model: "SP4000", "Onboard zones": "4 (8 with ATZ)", "Maximum zones": "32", Partitions: "2", "User codes": "32", "Expansion bus": "4-wire; up to 15 keypads", Sirens: "Supports wired sirens", "Firmware upgrade": "BabyWare" },
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
    short: "Scalable two-partition control with flexible communications",
    description: "The Paradox SP5500+ is designed for homes and small commercial premises that need a wired alarm platform with capacity for a more developed installation. Five onboard zones can be expanded to 32 hardwired or compatible wireless zones, while two partitions allow independently managed areas within the same system. Support for 32 user codes, 32 remote controls and expandable programmable outputs provides flexibility for multi-user sites and connected building functions. Separate primary and backup serial communication paths also allow compatible reporting modules to be arranged with greater resilience as part of a professionally designed system.",
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
    short: "Clear ten-zone status and everyday control in a horizontal layout",
    description: "The Paradox K10H gives users a straightforward way to operate compatible Magellan and Spectra alarm systems from a horizontal wall-mounted keypad. Its ten-zone LED display and illuminated Key Light buttons make open-zone information easier to identify, while separate Arm, Sleep, Stay and Off indicators show the state of each partition. Seven one-touch actions and three keypad panic functions provide quick access to frequently used commands. The keypad also includes an onboard zone input, adjustable backlighting and independent chime-zone control, and connects directly to the panel through the four-wire communication bus.",
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
    short: "Clear ten-zone control for narrower mounting spaces",
    description: "The Paradox K10V provides the same practical ten-zone system control as the horizontal model in a narrow vertical format suited to more constrained wall spaces. Illuminated Key Light buttons identify open zones, while separate Arm, Sleep, Stay and Off indicators make partition status clear during everyday use. Seven one-touch actions and three keypad panic functions give users direct access to important commands. An onboard zone input, independently configurable chime zones and adjustable backlighting add installation flexibility, with the keypad connecting to compatible Magellan and Spectra panels through the four-wire communication bus.",
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
    short: "Intuitive touchscreen control with a clear visual interface",
    description: "The Paradox TM50 replaces conventional keypad navigation with a slim five-inch colour touchscreen designed to make compatible alarm systems easier to understand and operate. Icon-based menus, clear prompts and editable labels provide a more visual view of zones, areas, users and programmable outputs. The interface can control up to eight PGM outputs and includes one input for a zone or compatible temperature sensor. A microSD card slot supports firmware updates and display media, while optional SpotOn floor plans and OneScreen monitoring can provide more visual system information where those features are configured.",
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
    short: "Stable wide-area motion detection for everyday indoor protection",
    description: "The Paradox 476 Pro is a panel-powered passive infrared detector for identifying human movement within protected indoor areas. Its single-element analogue sensor provides coverage of up to 11 m by 11 m across a 110-degree viewing angle, making it suitable for rooms, corridors and other general detection areas when correctly positioned. Automatic temperature compensation helps maintain detection performance as ambient conditions change, while metal shielding improves resistance to electromagnetic and radio-frequency interference. A solid-state relay, LED indication and an enclosure tamper switch support dependable integration with compatible 12V alarm systems.",
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
    short: "Fast, adjustable detection with enhanced false-alarm immunity",
    description: "The Paradox NV5 is a compact high-performance infrared detector designed to respond consistently to both slow and fast movement while reducing unwanted alarms. Five selectable sensitivity levels allow its response to be adjusted for the protected area, while Auto Pulse Signal Processing, selectable single or dual edge processing and digital temperature compensation balance catch performance with false-alarm immunity. Its hybrid cylindrical-spherical Fresnel lens is designed to provide even far, medium and creep-zone detection. A clip-in circuit-board arrangement simplifies installation, and compatibility with Paradox EVO, Spectra and Magellan systems, as well as suitable third-party panels, supports a broad range of applications.",
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
const common = ["alarm-flush-mount-internal-siren"];
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

export const paradoxKitSupplementalItems: Record<string, Array<[string, string]>> = Object.fromEntries(
  kitDefinitions.map((kit) => [kit.id, [
    ["Backup battery", "1 × 7.0 Ah backup battery"],
    ["External warning", kit.panel.includes("mg5050") ? "1 × polycarbonate mini external siren" : "1 × external siren"],
    ["Cable", "Not included; cable must be ordered separately"],
    ["Warranty", "3-year warranty"],
    ["Alternative power option", "A plug pack can be requested in place of the transformer; please email us separately when placing your order."],
  ]])
);

const createKit = (kit: KitDefinition): Product => {
  const members = alarmKitComponentIds[kit.id].map((id) => byId.get(id)!).filter(Boolean);
  const [panel, keypad, detector] = members;
  const hybrid = panel.id.includes("mg5050");
  const usesTouchscreen = keypad.id.includes("tm50");
  const usesVerticalLed = keypad.id.includes("k10v");
  const kitHeading = hybrid
    ? usesTouchscreen
      ? "Hybrid 32-zone protection with intuitive touchscreen control"
      : "Hybrid 32-zone protection with clear LED control"
    : panel.id.includes("sp4000")
      ? usesVerticalLed
        ? "Expandable 32-zone security with space-saving vertical control"
        : "Expandable 32-zone security with clear horizontal control"
      : usesTouchscreen
        ? "Scalable 32-zone security with intuitive touchscreen control"
        : usesVerticalLed
          ? "Scalable 32-zone security with space-saving vertical control"
          : "Scalable 32-zone security with clear horizontal control";
  const keypadOverview = usesTouchscreen
    ? "The TM50's 5-inch colour touchscreen uses icon-based menus and editable labels to make everyday operation and system status easier to understand."
    : usesVerticalLed
      ? "The vertical K10V keypad presents ten-zone LED status, illuminated open-zone keys and dedicated arming indicators in a narrow wall-mounted format."
      : "The horizontal K10H keypad presents ten-zone LED status, illuminated open-zone keys and dedicated arming indicators for straightforward daily operation.";
  const detectorOverview = detector.id.includes("nv5")
    ? "NV5 motion detection adds five selectable sensitivity levels, digital temperature compensation and signal processing designed to balance responsive detection with false-alarm immunity."
    : "Paradox 476 Pro motion detection provides an 11 m by 11 m, 110-degree coverage pattern, with automatic temperature compensation, tamper protection and EMI/RFI shielding for stable indoor monitoring.";
  const systemOverview = hybrid
    ? "Designed for homes and small commercial premises that need a combination of wired and wireless protection, this MG5050 system starts with five onboard inputs, supports five additional ATZ zones and can manage up to 32 compatible zones. Its built-in 433 MHz transceiver supports compatible wireless devices, while two partitions, RF-jamming supervision and a 256-event history provide practical control and service information."
    : panel.id.includes("sp4000")
      ? "Designed for homes and small commercial premises, this SP4000 system starts with four onboard inputs, can provide eight zones through ATZ and expands to 32 wired or compatible wireless zones. Two partitions and 32 user codes allow separate areas and authorised users to be managed around the needs of the site."
      : "Designed for homes and small commercial premises that may need room to grow, this SP5500+ system starts with five onboard zones and expands to 32 wired or compatible wireless zones. Two partitions, 32 user codes, support for 32 remote controls and separate primary and backup communication paths provide flexibility for multi-area installations.";
  const kitOverview = `${systemOverview} ${keypadOverview} ${detectorOverview} Battery-backed standby operation and separately positioned indoor and outdoor sounders provide dependable local warning, while compatible communication modules can be selected by the installer when remote reporting or connected control is required.`;
  const panelCapacityFeature = hybrid
    ? "Hybrid 32-zone protection: Five onboard inputs can provide five additional ATZ zones, while the system can manage up to 32 compatible wired or wireless zones."
    : panel.id.includes("sp4000")
      ? "Scalable zone architecture: Four onboard zones can operate as eight with ATZ and expand to 32 wired or compatible wireless zones."
      : "Scalable zone and output capacity: Five onboard zones expand to 32 wired or compatible wireless zones, while programmable outputs can grow from two to 16.";
  const panelControlFeature = hybrid
    ? "Integrated wireless supervision: A built-in 433 MHz transceiver supports compatible wireless devices, with RF-jamming supervision and capacity for up to eight K32RF or K37 keypads and two RPT1 repeaters."
    : panel.id.includes("sp4000")
      ? "Partitioned StayD control: Two partitions, 32 user codes and StayD operation support separately managed areas and practical day-to-day arming."
      : "Partitioned user control: Two partitions, 32 user codes and support for 32 remote controls suit households or small sites with multiple users.";
  const communicationFeature = hybrid
    ? "Flexible communication path: Compatible IP, cellular and voice modules let an installer add app access, reporting or voice functions to suit the site."
    : panel.id.includes("sp4000")
      ? "Flexible communication path: PCS, IP150 and VDMP3 compatibility provides options for cellular reporting, internet/app control and voice dialling."
      : "Primary and backup communications: Two serial ports allow compatible primary and backup communication modules to be configured separately.";
  const keypadFeature = keypad.id.includes("tm50")
    ? "Touchscreen system control: A 5-inch colour display, icon-based menus, editable labels and control of up to eight programmable outputs provide a clear interactive interface."
    : keypad.id.includes("k10v")
      ? "At-a-glance vertical control: Ten-zone LED status, illuminated open-zone keys, dedicated arming indicators, one-touch actions and keypad panic controls simplify operation in a narrow format."
      : "At-a-glance horizontal control: Ten-zone LED status, illuminated open-zone keys, dedicated arming indicators, one-touch actions and keypad panic controls simplify operation.";
  const detectorFeature = detector.id.includes("nv5")
    ? "High-performance motion response: Five sensitivity levels, Auto Pulse Signal Processing, selectable edge processing and digital temperature compensation balance fast detection with false-alarm immunity."
    : "Stable wide-area motion detection: An 11 m by 11 m, 110-degree detection pattern combines automatic temperature compensation, tamper protection and EMI/RFI shielding.";
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
    galleryImages: [
      ...members.slice(1).map((member) => member.image!).filter(Boolean),
      "/assets/alarm/ritar-rt1272.jpg",
      "/assets/alarm/external-siren.jpg",
    ],
    specSheetLinks: members.flatMap((member) => member.specSheetLinks ?? (member.datasheetUrl ? [{ label: member.sku + " Product PDF", url: member.datasheetUrl }] : [])),
    subProducts: members.map((member) => ({ id: member.id, name: member.name, sku: member.sku })),
    shortDescription: kitHeading,
    description: kitOverview,
    features: [
      panelCapacityFeature,
      panelControlFeature,
      ...(hybrid ? ["User and event capacity: The panel supports 32 user codes, up to 32 remote controls and a 256-event history for operation and servicing."] : []),
      keypadFeature,
      detectorFeature,
      communicationFeature,
      "Layered local warning: Panel-powered indoor and outdoor sounders provide audible notification across the premises when an alarm is activated.",
      "Standby power resilience: A sealed lead-acid backup battery provides maintenance-free standby support during a mains-power interruption.",
    ],
    specifications: {
      "Control panel": `1 × ${panel.name} (${panel.sku}) in cabinet with fuse and transformer`,
      Keypad: `1 × ${keypad.name} (${keypad.sku})`,
      "Motion detector": `2 × ${detector.name} (${detector.sku})`,
      "Backup battery": "1 × 7.0 Ah backup battery",
      "Internal warning": "1 × flush-mount internal siren",
      "External warning": hybrid ? "1 × polycarbonate mini external siren" : "1 × external siren",
      Cable: "Not included; order separately",
      Warranty: "3 years",
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
    ["Alarm panel", "1 × Arrowhead EC hardwired 8-zone alarm panel in a plastic cabinet with transformer and fuse assembly"],
    ["Keypad", `1 x ${kit.keypad}`],
    ["Backup battery", "1 x 7.0 Ah backup battery"],
    ["Motion detection", "2 x Optex FLX-S-ST pet-tolerant PIR detectors, suitable for pets up to 18 kg"],
    ["External warning", "1 × Arrowhead EC external siren"],
    ["Internal warning", "1 x flush-mount internal siren"],
    ...(kit.includesCable ? [["Alarm cable", "1 x 100 metre box of 0.2 alarm cable"] as [string, string]] : []),
    ["Warranty", "5-year warranty"],
  ]])
);

const createArrowheadKit = (kit: ArrowheadKitDefinition): Product => {
  const usesLed = kit.keypad.includes("LED");
  const usesLcd = kit.keypad.includes("LCD");
  const interfaceHeading = usesLed
    ? "clear LED control"
    : usesLcd
      ? "full-text LCD control"
      : `intuitive ${kit.keypadColour.toLowerCase()} touchscreen control`;
  const kitHeading = `Expandable alarm protection with ${interfaceHeading}${kit.includesCable ? " and installation cable" : ""}`;
  const keypadOverview = usesLed
    ? "A slimline LED keypad provides direct status indication and straightforward everyday arming controls."
    : usesLcd
      ? "A vertical full-English LCD keypad presents clear prompts and system information for everyday operation."
      : `The ${kit.keypadColour.toLowerCase()} touchscreen provides a visual interface for arming, disarming and checking system status.`;
  const cableOverview = kit.includesCable
    ? "This version also supplies a 100 metre box of 0.2 alarm cable for the planned wired installation."
    : "Site cabling can be selected separately to suit the final detector locations and installation route.";
  const kitOverview = `Designed for homes, retail spaces and other small commercial premises that may need room to grow, this Arrowhead EC system starts with eight onboard hardwired zones and can expand to 248 zones using compatible EC-Z8 input modules. ${keypadOverview} Optex FLX-S-ST PIR detection supports pet-tolerant monitoring for animals weighing up to 18 kg. Elite Cloud app access or monitored reporting can be added through the appropriate plug-on module, while an Infinity Wireless Link can extend the system to compatible wireless detectors, remotes, panic buttons and sirens. Four onboard outputs support local alarm and automation functions, with expansion available when more outputs are required. Battery-backed operation and indoor and outdoor sounders provide dependable local warning. ${cableOverview}`;
  return {
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
    shortDescription: kitHeading,
    description: kitOverview,
    features: [
      "Large expansion headroom: Eight onboard hardwired zones can grow to 248 zones with compatible EC-Z8 input expanders.",
      usesLed
        ? "Clear LED operation: The slimline LED interface provides straightforward everyday arming and system-status indication."
        : usesLcd
          ? "Full-text LCD operation: The vertical full-English display provides clearer prompts and everyday system information."
          : "Touchscreen interaction: The touchscreen interface provides visual everyday control and system-status access.",
      "Pet-tolerant motion coverage: Optex FLX-S-ST detection is designed to identify movement while accommodating pets weighing up to 18 kg.",
      "Flexible site scale: Support for up to 32 areas, 32 keypads and 2,000 users provides capacity for larger or multi-area installations.",
      "Optional app and monitoring path: Elite Cloud smartphone control or monitored reporting can be added through the appropriate plug-on communication module.",
      "Wireless growth option: A compatible Infinity Wireless Link can extend the system to wireless detectors, remotes, panic buttons and sirens.",
      "Automation-ready outputs: Four onboard outputs can expand to 32, with a clean relay available for functions such as compatible garage-door or gate control.",
      "Resilient local alerting: Battery-backed operation and separately positioned indoor and outdoor sounders support local warning during an alarm event.",
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
      Communications: "Optional plug-on module required for monitoring or Elite Cloud app access",
      "Wireless expansion": "Optional Infinity Wireless Link supports compatible wireless devices",
      Keypad: kit.keypad,
      Detection: "2 x Optex FLX-S-ST pet-tolerant PIR detectors, up to 18 kg",
      "Backup battery": "7.0 Ah",
      Sirens: "1 x Arrowhead EC external siren and 1 x flush-mount internal siren",
      Cable: kit.includesCable ? "100 metre box of 0.2 alarm cable included" : "Not listed as included",
      Warranty: "5 years",
    },
  };
};

const arrowheadKits = arrowheadKitDefinitions.map(createArrowheadKit);
export const alarmProducts: Product[] = [...kits, ...arrowheadKits, ...components];
const alarmIds = new Set(alarmProducts.map((product) => product.id));

export function isAlarmProduct(product: Product) {
  return alarmIds.has(product.id);
}

export function alarmKitComponentDisplayName(kitId: string, component: Product) {
  if (kitId.startsWith("paradox-mg5050-") && component.id === "paradox-mg5050-control-panel") return `1 × Wireless Enabled Panel — ${component.name} in cabinet with fuse and transformer`;
  if (component.id.endsWith("control-panel")) return `1 × ${component.name} in cabinet with fuse and transformer`;
  if (component.id.endsWith("keypad")) return `1 × ${component.name}`;
  if (component.id.endsWith("pir-detector")) return `2 × ${component.name}`;
  if (component.id === "alarm-flush-mount-internal-siren") return `1 × ${component.name}`;
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
