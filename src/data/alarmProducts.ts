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
  documents?: Array<{ label: string; url: string }>;
  sourceUrl?: string;
  icon?: string;
  colors?: string[];
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

// Compatibility qualification applies to the original, non-plus panels in these kits.
// Sources and model-specific verification: docs/alarm-feature-sources.md.
const internetModuleQualification = "IP180 is an optional BlueEye communication module, not an Insite GOLD module. Paradox supports most panels made after 2012; the installer must verify the exact panel and firmware before selection. IP150+ app support also depends on its firmware.";

const componentSources: ComponentSource[] = [
  {
    id: "paradox-mg5050-control-panel",
    name: "Paradox MG5050 Hybrid Alarm Control Panel",
    category: "Wired Alarm Control Panels",
    categoryIds: [5, 33, 35, 83],
    sku: "MG5050",
    image: "/assets/alarm/paradox-mg5050-board-hires.png",
    pdf: "https://www.paradox.com/Downloader?ID=871",
    pdfLabel: "MG5050 User Guide",
    badge: "Hybrid Panel",
    short: "Flexible wired and wireless protection with built-in 433 MHz communication",
    description: "The Paradox MG5050 is a board-only hybrid alarm controller for installations that combine wired and compatible wireless devices. Five onboard zones and five additional ATZ zones provide the starting capacity, with support for up to 32 zones across two independently controlled partitions. Its built-in 433 MHz transceiver connects compatible wireless equipment, while a four-wire bus supports up to 15 keypads. StayD and Sleep arming offer different ways to protect occupied premises. Support for 32 users and 32 remote controls, wireless-jamming supervision and a 256-event history helps with everyday operation and servicing. Compatible PCS-series, IP150+ and IP180 modules can be added for the required communication arrangement; these modules and the kit accessories are not included with the board alone.",
    features: [
      ["Hybrid zone capacity", "Five onboard zones plus five ATZ zones, with support for up to 32 zones, any of which may be wireless."],
      ["Built-in wireless communication", "A 433 MHz transceiver supports compatible wireless devices, with RF-jamming supervision."],
      ["Separate areas and users", "Two partitions, 32 users and 32 remote controls, with one remote assigned per user."],
      ["Keypad and repeater support", "The four-wire bus connects up to 15 keypads; wireless support includes up to eight K32RF or K37 keypads, two RPT1 repeaters and the REM3 handheld remote keypad."],
      ["Flexible arming", "StayD and Sleep arming support different occupancy and protection needs."],
      ["Communication module options", "Supports PCS-series cellular modules and IP150+ internet modules, supplied separately."],
      ["Internet module compatibility", internetModuleQualification],
      ["Programming and reporting", "Menu-based programming covers installer, master and maintenance access, with multiple telephone numbers for alarm monitoring."],
      ["Service information", "A 256-event buffer and 9.6 kbaud WinLoad communication support system review and servicing."],
      ["Timekeeping and reset", "Includes daylight-saving calendar adjustment and a push-button power reset."],
      ["Warranty", "Three-year warranty."],
    ],
    specs: { Model: "MG5050", "Product type": "Hybrid alarm control board only", "Onboard zones": "5 plus 5 ATZ zones", "Maximum zones": "32; any may be wireless", Transceiver: "Built-in 433 MHz", Partitions: "2", "User codes": "32", "Remote controls": "32; one per user", "Communication bus": "4-wire; up to 15 keypads", "Wireless keypads": "Up to 8 K32RF / K37", "Wireless repeaters": "Up to 2 RPT1", "Remote keypad": "REM3 supported", "Event buffer": "256 events", "RF supervision": "Wireless-jamming supervision", "Arming modes": "StayD and Sleep supported", Communications: "PCS series, IP150+ and IP180; optional modules", "WinLoad communication": "9.6 kbaud", "Time adjustment": "Daylight-saving calendar", Reset: "Push-button power reset", Warranty: "3 years" },
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
      ["Communication options", "Optional PCS-series cellular, IP150+ internet and VDMP3 voice modules provide different reporting paths; modules are sold separately."],
      ["Internet module compatibility", internetModuleQualification],
      ["Programming access", "Keypad menus provide installer, master and maintenance access; BabyWare supports PC-based setup and firmware servicing."],
      ["Monitoring and event review", "Multiple monitoring telephone numbers and a 256-event memory support alarm reporting and investigation."],
      ["Timekeeping and reset", "Automatic daylight-saving adjustment and a push-button software reset support ongoing maintenance."],
    ],
    specs: { Model: "SP4000", "Onboard zones": "4 (8 with ATZ)", "Maximum zones": "32", Partitions: "2", "User codes": "32", "Expansion bus": "4-wire; up to 15 keypads", Sirens: "Supports wired sirens", "Firmware upgrade": "BabyWare" },
  },
  {
    id: "paradox-sp5500-control-panel",
    name: "Paradox SP5500 5–32 Zone Alarm Control Panel",
    category: "Wired Alarm Control Panels",
    categoryIds: [5, 33, 35, 83],
    sku: "SP5500",
    image: "/assets/alarm/paradox-sp5500-board-hires.png",
    pdf: "https://www.paradox.com/Downloader?ID=871",
    pdfLabel: "SP5500 User Guide",
    badge: "Wired Panel",
    short: "Expandable two-partition protection with flexible alarm reporting",
    description: "The Paradox Spectra SP5500 is a board-only alarm controller for installations that need room to expand. Five onboard zones and five additional ATZ zones provide the initial capacity, with expansion to 32 zones and 16 programmable outputs through compatible equipment. Two partitions and 32 user codes allow separate areas and authorised users to be managed independently, while StayD supports day-to-day protection. A four-wire expansion bus connects compatible system devices. The dual-coupler dialler circuit and support for PCS-series, IP150+ and IP180 modules provide options for alarm reporting. A 256-event history, automatic daylight-saving adjustment and direct 9.6 kbaud communication assist configuration and servicing. Communication modules and the kit accessories are not included with the board alone.",
    features: [
      ["Expandable zone capacity", "Five onboard zones plus five ATZ zones, expandable to 32 zones with compatible equipment."],
      ["Programmable output expansion", "Supports expansion to 16 PGMs for configured alarm and control functions."],
      ["Independent area control", "Two partitions and 32 user codes support separately managed areas and authorised users."],
      ["StayD operation", "Supports StayD for everyday protection of occupied premises."],
      ["Four-wire expansion bus", "Connects compatible expansion equipment to the control panel."],
      ["Alarm reporting options", "A dual-coupler dialler circuit supports telephone reporting; PCS-series, IP150+ and IP180 modules provide additional communication options."],
      ["Internet module compatibility", internetModuleQualification],
      ["Accessible programming", "Menu-based programming supports installer, master and maintenance access, with multiple monitoring telephone numbers."],
      ["Event history and servicing", "Stores 256 events and supports direct communication at 9.6 kbaud."],
      ["Timekeeping and reset", "Automatic daylight-saving adjustment and a push-button software reset support system maintenance."],
      ["Warranty", "Three-year warranty."],
    ],
    specs: { Model: "SP5500", "Product type": "Alarm control board only", "Onboard zones": "5 plus 5 ATZ zones", "Maximum zones": "32", PGMs: "Expandable to 16", Partitions: "2", "User codes": "32", "Expansion bus": "4-wire", "Arming mode": "StayD supported", Communications: "PCS series, IP150+ and IP180; optional modules", Dialler: "Dual-coupler dialler circuit", "Reporting numbers": "Multiple monitoring telephone numbers", "Programming access": "Installer, master and maintenance", "Direct communication": "9.6 kbaud", "Event buffer": "256 events", "Time adjustment": "Automatic daylight saving", Reset: "Push-button software reset to defaults and restart", Warranty: "3 years" },
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
    image: "/assets/alarm/paradox-476-pro-motion-detector.avif",
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
    image: "/assets/alarm/paradox-nv5-digital-motion-detector.jpg",
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
    image: "/assets/alarm/ritar-rt1272-12v-alarm-battery.jpg",
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
    image: "/assets/alarm/paradox-indoor-alarm-siren.png",
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
    image: "/assets/alarm/paradox-outdoor-alarm-siren.jpg",
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
  {
    id: "arrowhead-ec-plas-control-panel",
    name: "Arrowhead EC Security and Control Panel in Plastic Cabinet",
    category: "Wired Alarm Control Panels",
    categoryIds: [5, 33, 35, 83],
    sku: "EC-PLAS",
    image: "/assets/alarm/arrowhead/components/ec-plas.png",
    pdf: "https://www.aap.co.nz/site/aap/EC-PLAS.pdf",
    pdfLabel: "EC-PLAS Product Sheet",
    documents: [
      { label: "EC-PLAS Product Sheet", url: "https://www.aap.co.nz/site/aap/EC-PLAS.pdf" },
      { label: "EliteControl System Brochure", url: "https://www.aap.co.nz/site/aap/EliteControl%20Brochure%202024.pdf" },
      { label: "EC-PCB and EC-i Operating Guide", url: "https://www.aap.co.nz/site/aap/EC-PCB%20%26%20EC-i%20Operating%20Guide.pdf" },
    ],
    sourceUrl: "https://www.aap.co.nz/shop/Alarm+Systems/ECKit/EC-PLAS.html",
    icon: "ALM",
    badge: "Control Panel",
    short: "Modular alarm, access and automation control in a powered enclosure",
    description: "The Arrowhead EC-PLAS combines the EC security and control panel with its plastic enclosure and a 16V AC, 1.4A power supply. Designed as a modular foundation for residential and small-to-medium commercial systems, the EC platform brings alarm, access-control and automation functions into one expandable controller. Eight onboard inputs provide the starting capacity; up to thirty EC-Z8 expanders can extend the system to 248 inputs, while EC-O4 modules provide a path to 32 outputs. The system also supports 32 partitions, 32 connected keypads, 2,000 users and a 10,000-event history. Optional modules add EliteCloud connectivity, Infinity long-range wireless, RS232, PSTN communication and supported home-automation integration. A resistor and screw pack is supplied for installation; a keypad is not included with this panel package.",
    features: [
      ["Integrated control platform", "Combines intrusion alarm, access-control and automation capabilities in one modular EC system."],
      ["Modular input expansion", "Starts with eight onboard inputs and supports up to thirty EC-Z8 modules, each adding eight configurable inputs, for a system total of 248."],
      ["Flexible output control", "Supports up to 32 system outputs; as many as eight EC-O4 modules can each add four configurable relay outputs."],
      ["Areas, keypads and access", "Provides up to 32 partitions, 32 keypads and 32 access levels. Optional two-door EC-A2 REX modules add integrated access-control hardware."],
      ["User and event management", "Provides 2,000 user positions and a 10,000-event history. Positions 101 to 2,000 can be assigned to radio users when compatible Infinity equipment is fitted."],
      ["Configurable warning outputs", "Outputs 1 and 2 can be configured as monitored siren drivers, while compatible Infinity wireless outputs can be mapped within the system's 32-output capacity."],
      ["Optional connected control", "An EC-IoT module can add EliteCloud app access, monitoring and compatible home-automation integration."],
      ["Expandable communications", "Optional Infinity wireless, RS232 and PSTN modules allow the system to be configured around the site."],
      ["Powered enclosure", "Includes the EC plastic cabinet, a 16V AC 1.4A supply, resistors and installation screws."],
    ],
    specs: { Model: "EC-PLAS", "Product type": "EC security and control panel in powered plastic enclosure", "Onboard inputs": "8", "Maximum inputs": "248", "Input expansion": "Up to 30 EC-Z8 modules; 8 configurable inputs per module", "Maximum outputs": "32", "Output expansion": "Up to 8 EC-O4 modules; 4 configurable relay outputs per module", "Siren outputs": "Outputs 1 and 2 can be configured as monitored siren drivers", Partitions: "Up to 32", Keypads: "Up to 32", Users: "Up to 2,000", "Radio-user positions": "Users 101-2,000 when compatible Infinity equipment is fitted", "Access levels": "Up to 32", "Access-control module": "EC-A2 REX; 2-door access-control module", "Time schedules": "Up to 32", "Event history": "Up to 10,000 events", Enclosure: "EC-PLAS CAB plastic cabinet", Supply: "16V AC, 1.4A", "Included hardware": "2K2, 4K7 and 8K2 resistors plus screw pack", Connectivity: "Optional EC-IoT, Infinity wireless, RS232 and PSTN modules", Keypad: "Not included", Warranty: "5 years" },
  },
  {
    id: "arrowhead-ec-lcd-keypad",
    name: "Arrowhead EC-LCD Full-English Slimline Keypad",
    category: "Alarm Accessories",
    categoryIds: [5, 33, 40, 83],
    sku: "EC-LCD",
    image: "/assets/alarm/arrowhead/components/ec-lcd.png",
    pdf: "https://www.aap.co.nz/site/aap/EC-LCD%20%26%20EC-LCD%20PROX.pdf",
    pdfLabel: "EC-LCD Product Sheet",
    documents: [
      { label: "EC-LCD Product Sheet", url: "https://www.aap.co.nz/site/aap/EC-LCD%20%26%20EC-LCD%20PROX.pdf" },
      { label: "EC-LCD User Manual", url: "https://www.aap.co.nz/site/aap/EC-LCD%20Manual.pdf" },
    ],
    sourceUrl: "https://www.alarmwarehouse.co.nz/products/keypads/arrowhead/arrowhead-lcd-full-english-keypad-for-ec-alarm-panels/",
    icon: "KEY",
    colors: ["White"],
    badge: "LCD Keypad",
    short: "Clear full-English alarm control in a slim, low-power keypad",
    description: "The Arrowhead EC-LCD is a slimline keypad for compatible EC control panels. Its full-English display presents system information in readable text, while dedicated quick-arm, Stay-arm and control keys make frequently used actions easier to reach. The adjustable white backlight supports use in different lighting conditions, and direct EC programming allows authorised setup work to be completed from the keypad. Low-power electronics and UV-stabilised plastics support practical everyday installation. Alarm Warehouse lists its dimensions as 137 × 88 × 24mm and provides a five-year warranty. This standard EC-LCD does not include a proximity reader; that feature belongs to the separate EC-LCD PROX model.",
    features: [
      ["Full-English display", "Shows alarm information and prompts as readable text rather than relying only on zone indicators."],
      ["Quick everyday control", "Dedicated Arm, Stay and assignable control functions provide direct access to common operations."],
      ["Adjustable illumination", "A white backlight can be adjusted to suit the installed environment."],
      ["Panel programming", "Supports direct programming of compatible EC control systems from the keypad."],
      ["Efficient construction", "Uses low-power electronics and UV-stabilised plastics in a slim wall-mounted format."],
      ["Model distinction", "The standard EC-LCD has no proximity reader; AAP offers EC-LCD PROX separately."],
      ["Listed size and warranty", "Alarm Warehouse lists the keypad at 137 × 88 × 24mm with a five-year warranty."],
    ],
    specs: { Model: "EC-LCD", "Product type": "Slimline full-English LCD alarm keypad", Compatibility: "Arrowhead EC control panels", Backlight: "Adjustable white", Controls: "Quick Arm, Stay Arm and assignable control button", Programming: "Direct EC panel programming supported", Proximity: "Not included on EC-LCD; available on EC-LCD PROX", Construction: "UV-stabilised plastic", Dimensions: "137 × 88 × 24 mm", "Previous model name": "ESX-KP1", Warranty: "5 years" },
  },
  {
    id: "arrowhead-ec-kp-w-keypad",
    name: "Arrowhead EC-KP W White Slimline Touch Keypad",
    category: "Alarm Accessories",
    categoryIds: [5, 33, 40, 83],
    sku: "EC-KP W",
    colors: ["White"],
    image: "/assets/alarm/arrowhead/components/ec-kp-w.png",
    pdf: "https://www.aap.co.nz/site/aap/EC-KP%20W%20%26%20EC-KP%20B.pdf",
    pdfLabel: "EC-KP W and EC-KP B Product Sheet",
    documents: [
      { label: "EC-KP W and EC-KP B Product Sheet", url: "https://www.aap.co.nz/site/aap/EC-KP%20W%20%26%20EC-KP%20B.pdf" },
      { label: "EC-KP User Manual", url: "https://www.aap.co.nz/site/aap/EC-KP%20Manual.pdf" },
    ],
    sourceUrl: "https://www.aap.co.nz/shop/Alarm+Systems/Keypads/EC-KP+W.html",
    icon: "KEY",
    badge: "Touch Keypad",
    short: "Low-profile white touch control for compatible Arrowhead alarm panels",
    description: "The Arrowhead EC-KP W provides a compact touch interface for compatible EC and legacy Arrowhead alarm systems. Its narrow white housing is proportioned to align neatly with many light-switch plates, helping the keypad sit naturally within residential or commercial interiors. Adjustable display brightness, selectable sleep behaviour and an adjustable key tone allow everyday presentation to be tailored to the location. Surface mounting keeps installation straightforward, while traditional address programming supports established Arrowhead configuration workflows. Powered from a compatible alarm panel at 12V DC, the keypad can be hardwired up to 300m from the controller using the cable arrangement specified by AAP. It can be fixed directly or fitted to a standard vertical flush box, with a recommended mounting height of 1.2-1.5m and automatic calibration when attached to its backplate.",
    features: [
      ["Slim touch interface", "A low-profile capacitive keypad provides clean everyday system control."],
      ["Flexible display behaviour", "Multiple display and sleep settings allow the interface to suit its installed location."],
      ["Adjustable feedback", "Brightness and keypad tone can be configured for the user and environment."],
      ["Neat wall fit", "The 74mm-wide format aligns with many common light-switch plates."],
      ["Straightforward installation", "Designed for simple surface mounting and traditional address programming."],
      ["Broad Arrowhead compatibility", "Supports EC, ESX V2, ESL, ESL-2 and Runner systems."],
      ["Documented cable reach", "AAP permits a hardwired run of up to 300m from a compatible control panel when the specified wiring requirements are followed."],
      ["Flexible mounting", "Can be fixed directly or installed over a standard vertical flush box at a recommended height of 1.2-1.5m."],
      ["Automatic setup", "Self-calibrates when the keypad is attached to its backplate."],
    ],
    specs: { Model: "EC-KP W", "Product type": "Slimline touch-interface alarm keypad", Colour: "White", Compatibility: "EC, ESX V2, ESL, ESL-2 and Runner", Power: "12V DC from compatible alarm panel", "Maximum cable distance": "Up to 300m, subject to AAP wiring requirements", Installation: "Direct fix or standard vertical flush box", "Recommended mounting height": "1.2-1.5m", Calibration: "Self-calibrating when attached to backplate", Programming: "Traditional address programming", Adjustments: "Display brightness, sleep options and beep tone", Dimensions: "118 × 74 × 12 mm", Manufacture: "Designed and manufactured in New Zealand", Warranty: "5 years" },
  },
  {
    id: "arrowhead-ec-kp-b-keypad",
    name: "Arrowhead EC-KP B Black Slimline Touch Keypad",
    category: "Alarm Accessories",
    categoryIds: [5, 33, 40, 83],
    sku: "EC-KP B",
    colors: ["Black"],
    image: "/assets/alarm/arrowhead/components/ec-kp-b.png",
    pdf: "https://www.aap.co.nz/site/aap/EC-KP%20W%20%26%20EC-KP%20B.pdf",
    pdfLabel: "EC-KP W and EC-KP B Product Sheet",
    documents: [
      { label: "EC-KP W and EC-KP B Product Sheet", url: "https://www.aap.co.nz/site/aap/EC-KP%20W%20%26%20EC-KP%20B.pdf" },
      { label: "EC-KP User Manual", url: "https://www.aap.co.nz/site/aap/EC-KP%20Manual.pdf" },
    ],
    sourceUrl: "https://www.aap.co.nz/shop/Alarm+Systems/Keypads/EC-KP+B.html",
    icon: "KEY",
    badge: "Touch Keypad",
    short: "Low-profile black touch control for compatible Arrowhead alarm panels",
    description: "The black Arrowhead EC-KP B combines the same compact touch interface and system compatibility as the white EC-KP W with a darker finish for interiors where black controls are preferred. Its slim dimensions align with many light-switch plates, and the keypad can be surface-mounted without a bulky wall profile. Adjustable brightness, selectable display and sleep modes, and configurable key tones allow the user experience to be tuned for the room. Traditional address programming supports established Arrowhead installation practices. Powered from a compatible alarm panel at 12V DC, the keypad can be hardwired up to 300m from the controller using the cable arrangement specified by AAP. It can be fixed directly or fitted to a standard vertical flush box, with a recommended mounting height of 1.2-1.5m and automatic calibration when attached to its backplate.",
    features: [
      ["Black slimline finish", "A compact dark touch interface suited to interiors using black electrical accessories."],
      ["Flexible display behaviour", "Multiple display and sleep settings allow the interface to suit its installed location."],
      ["Adjustable feedback", "Brightness and keypad tone can be configured for the user and environment."],
      ["Neat wall fit", "The 74mm-wide format aligns with many common light-switch plates."],
      ["Straightforward installation", "Designed for simple surface mounting and traditional address programming."],
      ["Broad Arrowhead compatibility", "Supports EC, ESX V2, ESL, ESL-2 and Runner systems."],
      ["Documented cable reach", "AAP permits a hardwired run of up to 300m from a compatible control panel when the specified wiring requirements are followed."],
      ["Flexible mounting", "Can be fixed directly or installed over a standard vertical flush box at a recommended height of 1.2-1.5m."],
      ["Automatic setup", "Self-calibrates when the keypad is attached to its backplate."],
    ],
    specs: { Model: "EC-KP B", "Product type": "Slimline touch-interface alarm keypad", Colour: "Black", Compatibility: "EC, ESX V2, ESL, ESL-2 and Runner", Power: "12V DC from compatible alarm panel", "Maximum cable distance": "Up to 300m, subject to AAP wiring requirements", Installation: "Direct fix or standard vertical flush box", "Recommended mounting height": "1.2-1.5m", Calibration: "Self-calibrating when attached to backplate", Programming: "Traditional address programming", Adjustments: "Display brightness, sleep options and beep tone", Dimensions: "118 × 74 × 12 mm", Manufacture: "Designed and manufactured in New Zealand", Warranty: "5 years" },
  },
  {
    id: "arrowhead-ec-touch-w-keypad",
    name: "Arrowhead EC-TOUCH W 5-inch White Touchscreen Keypad",
    category: "Alarm Accessories",
    categoryIds: [5, 33, 40, 83],
    sku: "EC-TOUCH W",
    colors: ["White"],
    image: "/assets/alarm/arrowhead/components/ec-touch-w.png",
    pdf: "https://www.aap.co.nz/site/aap/EC-TOUCH.pdf",
    pdfLabel: "EC-TOUCH Product Sheet",
    documents: [
      { label: "EC-TOUCH Product Sheet", url: "https://www.aap.co.nz/site/aap/EC-TOUCH.pdf" },
      { label: "Touch Keypad Installation Guide", url: "https://www.aap.co.nz/site/aap/Touch%20KP%20Installation%20Guide.pdf" },
      { label: "Touch Keypad Update Guide", url: "https://www.aap.co.nz/site/aap/files/Touch/Touch%20KP%20Update.pdf" },
    ],
    sourceUrl: "https://www.aap.co.nz/shop/Alarm+Systems/Keypads/EC-TOUCH+W.html",
    icon: "KEY",
    badge: "Touchscreen",
    short: "Five-inch visual alarm control in a slim white touchscreen",
    description: "The Arrowhead EC-TOUCH W gives compatible alarm systems a clear five-inch touchscreen interface in a slim white surround. It is designed for EC and EC-i panels while also supporting several earlier Arrowhead platforms, allowing a more visual control style to be used across new installations and suitable upgrades. AAP also supports the keypad with dedicated installation, image-conversion and firmware-update resources. ESX compatibility requires the panel and keypad firmware versions specified by AAP. The 800 × 480 resistive display works with a finger, glove or stylus, while the supplied AAP Micro SD card supports compatible custom images and field updates. AAP specifies a 10-15V DC supply, 250mA normal current and 500mA maximum current, so keypad quantity and cable distance must be considered during system power design.",
    features: [
      ["Five-inch touch control", "Provides a larger visual interface for everyday alarm operation and status checking."],
      ["Slim white surround", "A white low-profile enclosure suits a wide range of residential and commercial interiors."],
      ["Multi-platform support", "Compatible with EC-i, EC, ESL, Elite S and Elite S Lite systems."],
      ["Qualified ESX support", "Works with ESX when the required AAP panel and keypad firmware revisions are installed."],
      ["Supported maintenance", "AAP provides installation, image-conversion and keypad-update documentation."],
      ["Clear resistive display", "The 800 × 480 interface can be operated by finger, glove or stylus."],
      ["Local media support", "A supplied 1GB AAP Micro SD card supports compatible custom images and field updates in FAT32 format."],
      ["Documented power requirement", "Operates from 10-15V DC and draws 250mA normally, with a stated 500mA maximum."],
      ["Planned cable distance", "AAP specifies up to 30m on 0.2mm² cable or 80m on 0.5mm² cable."],
      ["Power-aware expansion", "AAP advises a maximum of two touch keypads directly on the listed legacy systems; larger quantities require an additional or higher-capacity supply."],
    ],
    specs: { Model: "EC-TOUCH W", "Product type": "5-inch touchscreen alarm keypad", Colour: "White", Display: "5-inch, 800 × 480 resistive touchscreen", Compatibility: "EC-i, EC, ESL, Elite S and Elite S Lite", "ESX requirement": "ESX firmware 10.0.307 or later and touchscreen keypad firmware 3.00.190111", Power: "10-15V DC from a battery-backed supply", Current: "250mA normal; 500mA maximum", "Maximum cable distance": "30m with 0.2mm² cable; 80m with 0.5mm² cable", Storage: "Supplied 1GB AAP Micro SD card, FAT32", "Recommended mounting height": "1,500mm", Dimensions: "144 × 104 × 13 mm", Warranty: "5 years" },
  },
  {
    id: "arrowhead-ec-touch-b-keypad",
    name: "Arrowhead EC-TOUCH B 5-inch Black Touchscreen Keypad",
    category: "Alarm Accessories",
    categoryIds: [5, 33, 40, 83],
    sku: "EC-TOUCH B",
    colors: ["Black"],
    image: "/assets/alarm/arrowhead/components/ec-touch-b.png",
    pdf: "https://www.aap.co.nz/site/aap/EC-TOUCH.pdf",
    pdfLabel: "EC-TOUCH Product Sheet",
    documents: [
      { label: "EC-TOUCH Product Sheet", url: "https://www.aap.co.nz/site/aap/EC-TOUCH.pdf" },
      { label: "Touch Keypad Installation Guide", url: "https://www.aap.co.nz/site/aap/Touch%20KP%20Installation%20Guide.pdf" },
      { label: "Touch Keypad Update Guide", url: "https://www.aap.co.nz/site/aap/files/Touch/Touch%20KP%20Update.pdf" },
    ],
    sourceUrl: "https://www.aap.co.nz/shop/Alarm+Systems/Keypads/EC-TOUCH+B.html",
    icon: "KEY",
    badge: "Touchscreen",
    short: "Five-inch visual alarm control in a slim black touchscreen",
    description: "The Arrowhead EC-TOUCH B offers the same five-inch touchscreen format as the white version in a black surround. It provides a visual interface for compatible EC, EC-i and selected legacy Arrowhead systems, making it suitable where a dark keypad better complements the interior finish. Its shallow housing keeps the wall profile restrained, and AAP provides dedicated product and installation documents for system planning. ESX installations must meet AAP's stated firmware requirements. The 800 × 480 resistive display works with a finger, glove or stylus, while the supplied AAP Micro SD card supports compatible custom images and field updates. AAP specifies a 10-15V DC supply, 250mA normal current and 500mA maximum current, so keypad quantity and cable distance must be considered during system power design.",
    features: [
      ["Five-inch touch control", "Provides a larger visual interface for everyday alarm operation and status checking."],
      ["Black surround", "A dark low-profile finish coordinates with black switches and contemporary interiors."],
      ["Multi-platform support", "Compatible with EC-i, EC, ESL, Elite S and Elite S Lite systems."],
      ["Qualified ESX support", "Works with ESX when the required AAP panel and keypad firmware revisions are installed."],
      ["Supported installation", "AAP provides dedicated product and installation documentation."],
      ["Clear resistive display", "The 800 × 480 interface can be operated by finger, glove or stylus."],
      ["Local media support", "A supplied 1GB AAP Micro SD card supports compatible custom images and field updates in FAT32 format."],
      ["Documented power requirement", "Operates from 10-15V DC and draws 250mA normally, with a stated 500mA maximum."],
      ["Planned cable distance", "AAP specifies up to 30m on 0.2mm² cable or 80m on 0.5mm² cable."],
      ["Power-aware expansion", "AAP advises a maximum of two touch keypads directly on the listed legacy systems; larger quantities require an additional or higher-capacity supply."],
    ],
    specs: { Model: "EC-TOUCH B", "Product type": "5-inch touchscreen alarm keypad", Colour: "Black", Display: "5-inch, 800 × 480 resistive touchscreen", Compatibility: "EC-i, EC, ESL, Elite S and Elite S Lite", "ESX requirement": "ESX firmware 10.0.307 or later and touchscreen keypad firmware 3.00.190111", Power: "10-15V DC from a battery-backed supply", Current: "250mA normal; 500mA maximum", "Maximum cable distance": "30m with 0.2mm² cable; 80m with 0.5mm² cable", Storage: "Supplied 1GB AAP Micro SD card, FAT32", "Recommended mounting height": "1,500mm", Dimensions: "144 × 104 × 13 mm", Warranty: "5 years" },
  },
  {
    id: "powerpac-dm12-7-5-battery",
    name: "PowerPac DM12-7.5 12V 7.5Ah SLA Battery",
    brand: "PowerPac",
    category: "Alarm Accessories",
    categoryIds: [5, 33, 40, 83],
    sku: "DM12-7.5",
    image: "/assets/alarm/arrowhead/components/dm12-7-5.png",
    pdf: "https://www.aap.co.nz/site/aap/DM12-7.5.pdf",
    pdfLabel: "DM12-7.5 Product Sheet",
    documents: [
      { label: "DM12-7.5 Product Sheet", url: "https://www.aap.co.nz/site/aap/DM12-7.5.pdf" },
      { label: "DM12-7.5 Technical Specification", url: "https://www.aap.co.nz/site/aap/DM12-7.5%20Specification%20Sheet.pdf" },
    ],
    sourceUrl: "https://www.aap.co.nz/shop/Batteries/12V+SLA/DM12-7.5.html",
    icon: "BAT",
    badge: "Backup Battery",
    short: "Compact sealed 12V standby power for compatible alarm systems",
    description: "The PowerPac DM12-7.5 is the sealed lead-acid backup battery specified by AAP for its current EC alarm kits. Its 12V, 7.5Ah rating provides standby power for compatible alarm equipment when mains power is interrupted. The compact, spill- and leak-resistant case is sized for common alarm enclosures, while low self-discharge supports fixed standby service. AAP's technical sheet specifies a five-year design float life at 20°C, which is a service-life rating rather than the product warranty; the supplied warranty remains one year return to base. Documented cycle and standby charging values help the installer match the battery to a suitable charging circuit.",
    features: [
      ["Alarm standby power", "Provides backup energy for compatible control panels during a mains-power interruption."],
      ["12V 7.5Ah rating", "Matches the DM12-7.5 model specified in AAP's current EC alarm kits."],
      ["Sealed construction", "SLA design is suited to enclosed, maintenance-conscious standby installations."],
      ["Compact enclosure fit", "A 151 × 65 × 95mm case fits common alarm cabinet arrangements."],
      ["Documented performance", "AAP provides both a product brochure and a detailed technical specification sheet."],
      ["Standby design", "Rated for a five-year floating design life at 20°C, with approximately 3% capacity loss per month in storage at that temperature."],
      ["Charging guidance", "AAP specifies 13.6-13.8V for standby use and 14.7-14.9V for cycle use, with a maximum charging current of 1.7A."],
      ["High-current capability", "The technical sheet lists 22mΩ internal resistance and a 105A maximum discharge for five seconds at 25°C."],
    ],
    specs: { Model: "DM12-7.5", Brand: "PowerPac", "Product type": "Sealed lead-acid standby battery", Voltage: "12V", Capacity: "7.5Ah at the 20-hour rate", "Design float life": "5 years at 20°C", "Standby charging": "13.6-13.8V", "Cycle charging": "14.7-14.9V; 1.7A maximum current", "Internal resistance": "22mΩ when fully charged at 25°C", "Maximum discharge": "105A for 5 seconds at 25°C", "Operating temperature": "Discharge -15°C to +35°C; charge 0°C to +35°C", "Recommended operating temperature": "15°C to 25°C", "Self-discharge": "Approximately 3% capacity per month at 20°C", Terminals: "T1/T2", Dimensions: "151 × 65 × 95 mm; 100mm total height", Weight: "Approximately 2.14kg", Warranty: "1-year return-to-base warranty" },
  },
  {
    id: "alarm-7ah-backup-battery",
    name: "12V 7.0Ah Sealed Lead-Acid Alarm Backup Battery",
    brand: "Alarm Warehouse",
    category: "Alarm Accessories",
    categoryIds: [5, 33, 40, 83],
    sku: "7AH-4.8",
    image: "/assets/alarm/arrowhead/components/alarm-7ah-backup-battery.jpg",
    pdf: "",
    sourceUrl: "https://www.alarmwarehouse.co.nz/products/batteries-and-power-supplies/sealed-lead-acid-12vdc-batteries/7-0-ah-battery-with-4-8mm-terminals/",
    icon: "BAT",
    badge: "Backup Battery",
    short: "Rechargeable 12V standby battery with 7.0Ah capacity",
    description: "This rechargeable 12V sealed lead-acid battery provides 7.0Ah of backup capacity for compatible alarm equipment. Alarm Warehouse lists 4.8mm terminals, a compact 150 × 65 × 65mm case and a weight of 2.51kg. It is the backup-battery capacity specified in the Arrowhead kits shown in this catalogue and carries a one-year product warranty.",
    features: [
      ["Alarm standby power", "Provides 7.0Ah of rechargeable backup capacity for compatible 12V alarm equipment."],
      ["Sealed construction", "The sealed lead-acid design is suited to fixed standby use in a compatible enclosure."],
      ["4.8mm terminals", "Uses the terminal size specified by Alarm Warehouse."],
      ["Compact format", "Measures 150 × 65 × 65mm and weighs approximately 2.51kg."],
      ["Product warranty", "Covered by a one-year warranty."],
    ],
    specs: { "Product type": "Sealed lead-acid rechargeable alarm battery", Voltage: "12V", Capacity: "7.0Ah", Terminals: "4.8mm", Dimensions: "150 × 65 × 65 mm", Weight: "2.51kg", Warranty: "1 year" },
  },
  {
    id: "optex-opt-flx-s-st-pir-detector",
    name: "Optex OPT-FLX-S-ST FlipX Indoor PIR Detector",
    brand: "Optex",
    category: "Wired Alarm Sensors",
    categoryIds: [5, 33, 38, 83],
    sku: "OPT-FLX-S-ST",
    image: "/assets/alarm/arrowhead/components/opt-flx-s-st.png",
    pdf: "https://www.aap.co.nz/site/aap/OPT-FLX-S-ST.pdf",
    pdfLabel: "OPT-FLX-S-ST Product Sheet",
    documents: [
      { label: "OPT-FLX-S-ST Product Sheet", url: "https://www.aap.co.nz/site/aap/OPT-FLX-S-ST.pdf" },
      { label: "Optex FlipX Installation Manual", url: "https://www.aap.co.nz/site/aap/optex-flipx-standard-st-dt-manual-en.pdf" },
    ],
    sourceUrl: "https://www.aap.co.nz/shop/pirs-detectors/PIRs/OPT-FLX-S-ST.html",
    icon: "PIR",
    badge: "PIR Detector",
    short: "Pet-friendly indoor PIR detection with selectable wide or narrow coverage",
    description: "The Optex OPT-FLX-S-ST is a hardwired indoor passive infrared detector with a reversible FlipX lens. An installer can configure the lens for broad room coverage or a focused long-range corridor pattern, allowing one detector body to suit different protected spaces. Digital temperature compensation supports consistent detection as room conditions change, while switchable indication, alarm and tamper relays, and a low current draw make it practical for compatible alarm panels. AAP lists an optional OPT-FLX-CW-G2 bracket separately when angled wall, corner or ceiling positioning is required.",
    features: [
      ["Selectable detection pattern", "The reversible FlipX lens changes between 12m wide-area and 18m narrow-area coverage."],
      ["Pet-friendly configuration", "Designed for indoor applications where appropriate pet-tolerant detector setup is required."],
      ["Digital compensation", "SMDA digital temperature compensation helps preserve detection performance as conditions change."],
      ["Low panel load", "Draws 8mA normally and up to 11mA at 12V DC."],
      ["Alarm and tamper supervision", "Provides normally closed alarm and cover-tamper relay outputs."],
      ["Flexible mounting", "Supports wall or corner mounting, with wall, corner and ceiling adjustment available using the optional bracket."],
      ["Digital Quad Zone Logic", "AAP identifies this model as using Optex Digital Quad Zone Logic for stable indoor detection."],
      ["Clear alarm indication", "A switchable green LED provides visible warm-up and alarm indication."],
      ["Product warranty", "Covered by a two-year product warranty."],
    ],
    specs: { Model: "OPT-FLX-S-ST", "Detection method": "Passive infrared with Digital Quad Zone Logic", "Wide coverage": "12m at 85°, 76 zones", "Narrow coverage": "18m at 5°, 12 zones", "Mounting height": "2.0-3.0m; 2.4m recommended", "Alarm period": "2.0 ± 0.5 seconds", "Warm-up period": "Approximately 60 seconds", Indicator: "Switchable green LED for warm-up and alarm", "Power input": "9.5-16V DC", "Current draw": "8mA normal; 11mA maximum at 12V DC", Outputs: "Normally closed alarm and tamper relays, 24V DC 0.1A maximum", Temperature: "-20°C to +50°C", Humidity: "95% maximum", "Temperature compensation": "Digital SMDA", Dimensions: "129.2 × 61.5 × 50.9 mm", Weight: "Approximately 90g", Mounting: "Indoor wall or corner; ceiling with optional bracket", Warranty: "2 years" },
  },
  {
    id: "arrowhead-ec-siren",
    name: "Arrowhead EC-SIREN White External Siren and Strobe",
    category: "Wired Alarm Sirens",
    categoryIds: [5, 33, 39, 83],
    sku: "EC-SIREN",
    colors: ["White"],
    image: "/assets/alarm/arrowhead/components/ec-siren.png",
    pdf: "https://www.aap.co.nz/site/aap/EC-SIREN%20%26%20EC-SIREN%20B.pdf",
    pdfLabel: "EC-SIREN Product Sheet",
    sourceUrl: "https://www.aap.co.nz/shop/Alarm+Systems/Sirens+-+External/EC-SIREN.html",
    icon: "SIR",
    badge: "External Siren",
    short: "Combined outdoor audible and visual warning for compatible alarm systems",
    description: "The Arrowhead EC-SIREN combines an external audible alarm with a high-brightness LED strobe in a slim white enclosure. Its 114dB output provides a strong local warning, while front and rear tamper switches help the connected alarm system supervise interference with the sounder. The UV-stabilised housing is only 39mm deep and includes an optional status LED for compatible installations. It is designed for the EC range and can be used as the outdoor warning device supplied with Arrowhead EC kits. The 10-15V DC operating range and 250mA maximum current support warning-circuit planning. A charcoal EC-SIREN B is available separately where a darker enclosure is preferred.",
    features: [
      ["Audible and visual warning", "Combines an external siren with an integrated strobe in one enclosure."],
      ["EC system compatibility", "Designed for use with Arrowhead EC alarm systems and compatible alarm outputs."],
      ["White exterior finish", "The standard kit component uses a white enclosure."],
      ["Low-voltage operation", "Operates across a 10-15V DC supply range."],
      ["High audible output", "Produces a rated sound-pressure level of 114 ±5dB at 30cm."],
      ["Tamper supervision", "Includes front and rear tamper switches for connection to a compatible alarm system."],
      ["Visible alarm indication", "Uses a high-brightness blue LED strobe and provides an optional status LED."],
      ["Durable slim housing", "The UV-stabilised enclosure measures 250 × 150 × 39mm."],
      ["Alternative finish", "AAP also offers the charcoal EC-SIREN B as a separate model."],
    ],
    specs: { Model: "EC-SIREN", "Product type": "External alarm siren with LED strobe", Colour: "White", Strobe: "Blue high-brightness LED", Voltage: "12V DC nominal", "Operating range": "10-15V DC", "Maximum current": "250mA", "Sound output": "114 ±5dB at 30cm", Tamper: "Front and rear tamper switches", "Status indication": "Optional status LED", Housing: "UV-stabilised", Dimensions: "250 × 150 × 39 mm", Compatibility: "Arrowhead EC range and suitable compatible alarm outputs", Warranty: "2 years" },
  },
  {
    id: "arrowhead-ps209-r-internal-siren",
    name: "Arrowhead Kit Flush-Mount Internal Siren",
    category: "Wired Alarm Sirens",
    categoryIds: [5, 33, 39, 83],
    sku: "INTERNAL-FLUSH",
    image: "/assets/alarm/arrowhead/components/ps209-r.png",
    pdf: "",
    sourceUrl: "https://www.alarmwarehouse.co.nz/products/sirens-sounders-strobes/internal-sirens/internal-siren-flush-mount/",
    icon: "SIR",
    badge: "Internal Siren",
    short: "Compact flush-mounted indoor siren for compatible alarm panels",
    description: "This flush-mount internal siren provides an audible indoor warning while keeping the visible installation compact. The catalogue follows the siren specification published by Alarm Warehouse for the component supplied with its alarm kits: 12V DC nominal operation, a 6-15V DC operating range, 120mA current draw and a rated output of 105 ±3dB at 30cm. Its white body measures 59 × 76mm and works with compatible alarm panels. Alarm Warehouse provides a two-year product warranty.",
    features: [
      ["Flush-mounted finish", "Provides a compact, low-profile indoor installation."],
      ["Broad panel compatibility", "Alarm Warehouse lists the siren for use with alarm panels."],
      ["Audible warning", "Rated at 105 ±3dB measured at 30cm."],
      ["12V operation", "Uses a nominal 12V DC supply with a 6-15V DC operating range."],
      ["Current draw", "Alarm Warehouse lists a 120mA current requirement."],
      ["Compact dimensions", "The white siren body measures 59 × 76mm."],
      ["Product warranty", "Covered by a two-year warranty."],
    ],
    specs: { "Product type": "Flush-mount internal alarm siren", Voltage: "12V DC nominal", "Operating range": "6-15V DC", Current: "120mA", "Sound output": "105 ±3dB at 30cm", Dimensions: "59 × 76 mm", Colour: "White", Compatibility: "Compatible alarm panels", Warranty: "2 years" },
  },
  {
    id: "arrowhead-4c2-100-cu-alarm-cable",
    name: "Arrowhead 4C2-100-CU 4-Core Alarm Cable - 100m",
    category: "Alarm Accessories",
    categoryIds: [5, 33, 40, 83],
    sku: "4C2-100-CU",
    image: "/assets/alarm/arrowhead/components/4c2-100-cu.png",
    pdf: "https://www.aap.co.nz/site/aap/4C2-100-CU.pdf",
    pdfLabel: "4C2-100-CU Product Sheet",
    sourceUrl: "https://www.aap.co.nz/shop/Alarm+Systems/Cable/4C2-100-CU.html",
    icon: "CAB",
    badge: "Alarm Cable",
    short: "Four-core tinned-copper security cable in a centre-pull 100m box",
    description: "The Arrowhead 4C2-100-CU is a 100-metre roll of four-core, 0.2mm² tinned-copper security cable supplied in a centre-pull box. It is the cable model named by AAP in the cabled versions of its EC alarm kits. The four conductors support common low-voltage alarm wiring tasks when the cable type, run length and electrical requirements have been confirmed for the installation. Centre-pull packaging helps the installer feed cable progressively while keeping the remaining roll contained.",
    features: [
      ["Four-core construction", "Provides four conductors for suitable low-voltage security and alarm connections."],
      ["Tinned-copper conductors", "Uses four 0.2mm², seven-strand tinned-copper conductors as specified by AAP."],
      ["100-metre supply", "A full 100m roll supports planned wired alarm installations."],
      ["Centre-pull box", "Cable feeds from the box while the unused roll remains contained."],
      ["Colour-coded insulation", "The four PVC-insulated conductors are red, yellow, black and blue for consistent identification."],
      ["Installer-friendly jacket", "A white 3.6mm PVC outer jacket incorporates a nylon ripcord for controlled stripping."],
      ["Documented cable rating", "AAP specifies a 75°C temperature rating and 300V voltage rating."],
      ["EC kit component", "This is the cable model identified in AAP's cabled EC alarm kits."],
    ],
    specs: { Model: "4C2-100-CU", "Product type": "Security and alarm cable", Cores: "4", "Conductor composition": "0.2mm² tinned copper, 7 strands per core", Insulation: "PVC; red, yellow, black and blue", "Insulation diameter": "1.1 ±0.05mm", Jacket: "White PVC with nylon ripcord", "Outer diameter": "3.6mm", "Temperature rating": "75°C", "Voltage rating": "300V", Twisted: "Yes", Length: "100m", Packaging: "Centre-pull box" },
  },

];

const components: Product[] = componentSources.map((item) => ({
  ...base,
  id: item.id,
  name: item.name,
  brand: item.brand ?? (item.id.startsWith("arrowhead-") ? "Arrowhead" : "Paradox"),
  category: item.category,
  categoryIds: item.categoryIds,
  tagIds: [],
  sku: item.sku,
  badge: item.badge,
  icon: item.icon ?? (item.category.includes("Sensors") ? "PIR" : item.category.includes("Sirens") ? "SIR" : item.sku.includes("K10") || item.sku === "TM50" ? "KEY" : item.sku === "RT1272" ? "BAT" : "ALM"),
  image: item.image,
  colors: item.colors,
  sourceUrl: item.sourceUrl,
  datasheetUrl: item.pdfLabel ? undefined : item.pdf,
  specSheetLinks: item.documents ?? (item.pdfLabel ? [{ label: item.pdfLabel, url: item.pdf }] : undefined),
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
  { id: "paradox-mg5050-tm50-alarm-kit", name: "Paradox MG5050 Alarm Kit with White TM50 Touchscreen", sku: "MG5050-TM50-KIT", panel: "paradox-mg5050-control-panel", keypad: "paradox-tm50-touch-keypad", detector: "paradox-nv5-pir-detector" },
  { id: "paradox-sp5500-alarm-kit", name: "Paradox SP5500 Alarm Kit with K10H Keypad", sku: "SP5500-K10H-KIT", panel: "paradox-sp5500-control-panel", keypad: "paradox-k10h-keypad", detector: "paradox-476-pir-detector" },
  { id: "paradox-sp5500-k10v-alarm-kit", name: "Paradox SP5500 Alarm Kit with K10V Keypad", sku: "SP5500-K10V-KIT", panel: "paradox-sp5500-control-panel", keypad: "paradox-k10v-keypad", detector: "paradox-476-pir-detector" },
  { id: "paradox-sp5500-tm50-alarm-kit", name: "Paradox SP5500 Alarm Kit with White TM50 Touchscreen", sku: "SP5500-TM50-KIT", panel: "paradox-sp5500-control-panel", keypad: "paradox-tm50-touch-keypad", detector: "paradox-nv5-pir-detector" },
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
    ? "The white TM50 keypad's 5-inch colour touchscreen uses icon-based menus and editable labels to make everyday operation and system status easier to understand."
    : usesVerticalLed
      ? "The vertical K10V keypad presents ten-zone LED status, illuminated open-zone keys and dedicated arming indicators in a narrow wall-mounted format."
      : "The horizontal K10H keypad presents ten-zone LED status, illuminated open-zone keys and dedicated arming indicators for straightforward daily operation.";
  const detectorOverview = detector.id.includes("nv5")
    ? "NV5 motion detection adds five selectable sensitivity levels, digital temperature compensation and signal processing designed to balance responsive detection with false-alarm immunity."
    : "Paradox 476 Pro motion detection provides an 11 m by 11 m, 110-degree coverage pattern, with automatic temperature compensation, tamper protection and EMI/RFI shielding for stable indoor monitoring.";
  const systemOverview = hybrid
    ? "Designed for homes and small commercial premises that need wired and compatible wireless protection, this MG5050 system combines five onboard zones, five additional ATZ zones and capacity for up to 32 zones. Its built-in 433 MHz transceiver and four-wire bus support compatible wireless equipment and up to 15 bus-connected keypads. Two partitions, 32 users, 32 remote controls, StayD and Sleep arming provide flexible everyday control, while RF-jamming supervision and a 256-event history assist servicing."
    : panel.id.includes("sp4000")
      ? "Designed for homes and small commercial premises, this SP4000 system starts with four onboard inputs, can provide eight zones through ATZ and expands to 32 wired or compatible wireless zones. Two partitions and 32 user codes allow separate areas and authorised users to be managed around the needs of the site."
      : "Designed for homes and small commercial premises that may need room to grow, this SP5500 system starts with five onboard zones plus five ATZ zones and supports expansion to 32 zones and 16 programmable outputs. Two partitions, 32 user codes and StayD provide flexible day-to-day protection. The four-wire expansion bus connects compatible equipment, while the dual-coupler dialler circuit, multiple monitoring telephone numbers and a 256-event history support reporting and servicing.";
  const kitOverview = `${systemOverview} ${keypadOverview} ${detectorOverview} Battery-backed standby operation and separately positioned indoor and outdoor sounders provide dependable local warning, while compatible communication modules can be selected by the installer when remote reporting or connected control is required.`;
  const panelCapacityFeature = hybrid
    ? "Hybrid 32-zone protection: Five onboard inputs can provide five additional ATZ zones, while the system can manage up to 32 compatible wired or wireless zones."
    : panel.id.includes("sp4000")
      ? "Scalable zone architecture: Four onboard zones can operate as eight with ATZ and expand to 32 wired or compatible wireless zones."
      : "Scalable zone and output capacity: Five onboard zones plus five ATZ zones provide the starting capacity, with compatible expansion to 32 zones and 16 programmable outputs.";
  const panelControlFeature = hybrid
    ? "Integrated wireless supervision: A built-in 433 MHz transceiver supports compatible wireless devices, with RF-jamming supervision and capacity for up to eight K32RF or K37 keypads and two RPT1 repeaters."
    : panel.id.includes("sp4000")
      ? "Partitioned StayD control: Two partitions, 32 user codes and StayD operation support separately managed areas and practical day-to-day arming."
      : "Partitioned StayD control: Two partitions, 32 user codes and StayD support independently managed areas and authorised users.";
  const communicationFeature = hybrid
    ? "Flexible communication path: PCS-series cellular modules and IP150+ or IP180 internet modules can be added to suit the reporting arrangement; these optional modules are not included."
    : panel.id.includes("sp4000")
      ? "Flexible communication path: Optional PCS-series cellular, IP150+ internet and VDMP3 voice modules offer reporting and remote-access options; these modules are not included."
      : "Flexible alarm reporting: A dual-coupler dialler circuit supports telephone reporting, with optional PCS-series, IP150+ and IP180 modules available for other communication arrangements.";
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
    image: `/assets/alarm/kits/${kit.id}${panel.id.includes("sp4000") ? "" : "-boards-v4"}.jpg`,
    galleryImages: [
      ...members.map((member) => member.image!).filter(Boolean),
      "/assets/alarm/ritar-rt1272-12v-alarm-battery.jpg",
      "/assets/alarm/paradox-outdoor-alarm-siren.jpg",
    ],
    specSheetLinks: members.flatMap((member) => member.specSheetLinks ?? (member.datasheetUrl ? [{ label: member.sku + " Product PDF", url: member.datasheetUrl }] : [])),
    subProducts: members.map((member) => ({ id: member.id, name: member.name, sku: member.sku })),
    shortDescription: kitHeading,
    description: kitOverview,
    features: [
      panelCapacityFeature,
      panelControlFeature,
      ...(hybrid ? [
        "User and event capacity: The panel supports 32 users, 32 remote controls with one per user, and a 256-event history.",
        "Flexible control network: The four-wire bus connects up to 15 keypads, with REM3 remote-keypad support and StayD or Sleep arming for different occupancy needs.",
        "Programming and service tools: Menu-based installer, master and maintenance access, multiple monitoring numbers, daylight-saving adjustment, a power-reset button and 9.6 kbaud WinLoad communication support setup and servicing.",
      ] : [
        panel.id.includes("sp4000")
          ? "Expansion and event review: The four-wire bus supports up to 15 keypads, while a 256-event memory records system activity for review."
          : "Expansion and event review: A four-wire expansion bus, 256-event memory and direct 9.6 kbaud communication support configuration and servicing.",
        "Programming and reporting: Keypad menus support installer, master and maintenance access, with multiple telephone numbers available for alarm monitoring.",
        ...(panel.id.includes("sp4000") ? ["PC-based servicing: BabyWare supports system programming and firmware updates."] : []),
        "Timekeeping and reset: Automatic daylight-saving adjustment and a push-button software reset simplify ongoing maintenance.",
      ]),
      keypadFeature,
      detectorFeature,
      communicationFeature,
      `Internet module compatibility: ${internetModuleQualification}`,
      "Layered local warning: Panel-powered indoor and outdoor sounders provide audible notification across the premises when an alarm is activated.",
      "Standby power resilience: A sealed lead-acid backup battery provides maintenance-free standby support during a mains-power interruption.",
    ],
    specifications: {
      "Control panel": `1 × ${panel.name} (${panel.sku}) in cabinet with fuse and transformer`,
      Keypad: `1 × ${keypad.name} (${keypad.sku})${usesTouchscreen ? " — White" : ""}`,
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
  legacyPanel?: boolean;
};

const arrowheadKitDefinitions: ArrowheadKitDefinition[] = [
  { id: "arrowhead-ec-led-alarm-kit", name: "Arrowhead EC Alarm Kit with Slimline Touch Keypad, 2 Detectors, Sirens and Cable", sku: "EC-KIT KP W", image: "/assets/alarm/arrowhead/ec-kit-led-with-cable.png", pdf: "/assets/alarm/arrowhead/ec-kit-led-with-cable.pdf", keypad: "white EC-KP W slimline touch keypad", keypadColour: "White", includesCable: true },
  { id: "arrowhead-ec-lcd-alarm-kit", name: "Arrowhead EC Alarm Kit with LCD Keypad, 2 Detectors, Sirens and Cable", sku: "EC-KIT LCD", image: "/assets/alarm/arrowhead/ec-kit-lcd-with-cable.png", pdf: "/assets/alarm/arrowhead/ec-kit-lcd-with-cable.pdf", keypad: "full-English vertical LCD keypad", keypadColour: "White", includesCable: true },
  { id: "arrowhead-ec-led-alarm-kit-no-cable", name: "Arrowhead EC Alarm Kit with Slimline Touch Keypad, 2 Detectors and Sirens", sku: "EC-KIT KP W NC", image: "/assets/alarm/arrowhead/ec-kit-led-no-cable.png", pdf: "/assets/alarm/arrowhead/ec-kit-led-no-cable.pdf", keypad: "white EC-KP W slimline touch keypad", keypadColour: "White", includesCable: false },
  { id: "arrowhead-ec-lcd-alarm-kit-no-cable", name: "Arrowhead EC Alarm Kit with LCD Keypad, 2 Detectors and Sirens", sku: "EC-KIT LCD NC", image: "/assets/alarm/arrowhead/ec-kit-lcd-no-cable.png", pdf: "/assets/alarm/arrowhead/ec-kit-lcd-no-cable.pdf", keypad: "full-English vertical LCD keypad", keypadColour: "White", includesCable: false },
  { id: "arrowhead-ec-black-touchscreen-alarm-kit", name: "Arrowhead EC Alarm Kit with Black Touchscreen Keypad, 2 Detectors and Sirens", sku: "EC-KIT TOUCH B NC", image: "/assets/alarm/arrowhead/ec-kit-touch-black-no-cable.png", pdf: "/assets/alarm/arrowhead/ec-kit-touch-black-no-cable.pdf", keypad: "black touchscreen keypad", keypadColour: "Black", includesCable: false, legacyPanel: true },
  { id: "arrowhead-ec-white-touchscreen-alarm-kit", name: "Arrowhead EC Alarm Kit with White Touchscreen Keypad, 2 Detectors and Sirens", sku: "EC-KIT TOUCH W NC", image: "/assets/alarm/arrowhead/ec-kit-touch-white-no-cable.png", pdf: "/assets/alarm/arrowhead/ec-kit-touch-white-no-cable.pdf", keypad: "white touchscreen keypad", keypadColour: "White", includesCable: false },
];

const arrowheadKeypadComponentId = (kit: ArrowheadKitDefinition) =>
  kit.keypad.includes("LCD")
    ? "arrowhead-ec-lcd-keypad"
    : kit.keypad.includes("touchscreen")
      ? kit.keypadColour === "Black" ? "arrowhead-ec-touch-b-keypad" : "arrowhead-ec-touch-w-keypad"
      : kit.keypadColour === "Black" ? "arrowhead-ec-kp-b-keypad" : "arrowhead-ec-kp-w-keypad";

Object.assign(alarmKitComponentIds, Object.fromEntries(
  arrowheadKitDefinitions.map((kit) => [kit.id, [
    ...(kit.legacyPanel ? [] : ["arrowhead-ec-plas-control-panel"]),
    arrowheadKeypadComponentId(kit),
    "optex-opt-flx-s-st-pir-detector",
    "alarm-7ah-backup-battery",
    "arrowhead-ec-siren",
    "arrowhead-ps209-r-internal-siren",
    ...(kit.includesCable ? ["arrowhead-4c2-100-cu-alarm-cable"] : []),
  ]])
));

export const arrowheadKitIncludedItems: Record<string, Array<[string, string]>> = Object.fromEntries(
  arrowheadKitDefinitions.map((kit) => [kit.id, [
    ["Alarm panel", kit.legacyPanel
      ? "1 × Arrowhead hardwired 16-zone alarm panel in a plastic cabinet with analogue dialler and transformer"
      : "1 × Arrowhead EC security and control panel in its powered plastic enclosure"],
    ["Keypad", `1 × ${kit.keypad}`],
    ["Backup battery", "1 × 12V 7.0Ah sealed lead-acid backup battery"],
    ["Motion detection", "2 × Optex OPT-FLX-S-ST indoor PIR detectors with pet-friendly detection up to 18kg"],
    ["External warning", "1 × Arrowhead EC-SIREN external siren and strobe"],
    ["Internal warning", "1 × flush-mount internal siren"],
    ...(kit.includesCable ? [["Alarm cable", "1 × 100m box of Arrowhead 4C2-100-CU four-core alarm cable"] as [string, string]] : []),
  ]])
);

export const arrowheadKitSupplementalItems: Record<string, Array<[string, string]>> = Object.fromEntries(
  arrowheadKitDefinitions.map((kit) => [kit.id, [
    ["Warranty", "5-year warranty for the complete kit"],
    ...(kit.sku.includes("KP")
      ? [["Alternative keypad colour", "A white keypad is supplied as standard. A black EC-KP B can be requested instead; please email us when placing your order."] as [string, string]]
      : []),
    ["Alternative power option", "A plug pack can be requested in place of the transformer; please email us when placing your order."],
  ]])
);

const createArrowheadKit = (kit: ArrowheadKitDefinition): Product => {
  const usesLed = kit.sku.includes("KP");
  const usesLegacyPanel = kit.legacyPanel === true;
  const usesLcd = kit.keypad.includes("LCD");
  const interfaceHeading = usesLed
    ? "slimline touch control"
    : usesLcd
      ? "full-text LCD control"
      : `intuitive ${kit.keypadColour.toLowerCase()} touchscreen control`;
  const kitHeading = `Expandable alarm protection with ${interfaceHeading}${kit.includesCable ? " and installation cable" : ""}`;
  const keypadOverview = usesLed
    ? "A slimline touch keypad provides direct status indication and straightforward everyday arming controls."
    : usesLcd
      ? "A vertical full-English LCD keypad presents clear prompts and system information for everyday operation."
      : `The ${kit.keypadColour.toLowerCase()} touchscreen provides a visual interface for arming, disarming and checking system status.`;
  const cableOverview = kit.includesCable
    ? "This version also supplies a 100 metre box of four-core 0.2mm² tinned-copper alarm cable for the planned wired installation."
    : "Site cabling can be selected separately to suit the final detector locations and installation route.";
  const kitOverview = usesLegacyPanel
    ? `This black-touchscreen package follows the Alarm Warehouse listing and uses an Arrowhead hardwired 16-zone alarm panel rather than the newer EC-PLAS package used by the other kits. The panel provides eight onboard zones, with a further eight available as ATZ zones or wireless zones when a compatible wireless receiver is added. A built-in analogue dialler supports telephone reporting, while the black touchscreen provides everyday arming and status control. Two Optex OPT-FLX-S-ST pet-friendly PIR detectors, a 7.0Ah backup battery and internal and external sounders complete the local alarm package. ${cableOverview}`
    : `Designed for homes, retail spaces and other small commercial premises that may need room to grow, this Arrowhead EC system starts with eight onboard hardwired zones and can expand to 248 zones using compatible EC-Z8 input modules. ${keypadOverview} Optex OPT-FLX-S-ST PIR detection provides pet-friendly indoor motion monitoring with selectable wide or narrow coverage. Elite Cloud app access or monitored reporting can be added through the appropriate plug-on module, while an Infinity Wireless Link can extend the system to compatible wireless detectors, remotes, panic buttons and sirens. Four onboard outputs support local alarm and automation functions, with expansion available when more outputs are required. Battery-backed operation and indoor and outdoor sounders provide dependable local warning. ${cableOverview}`;
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
    features: usesLegacyPanel ? [
      "Sixteen-zone panel: Eight onboard zones can be supplemented by eight ATZ zones, or by wireless zones when a compatible wireless receiver is added.",
      "Built-in analogue dialler: The panel includes an analogue telephone dialler for compatible reporting arrangements.",
      "Black touchscreen control: The supplied black touchscreen provides visual everyday arming and system-status access.",
      "Pet-friendly detection: Two Optex OPT-FLX-S-ST PIR detectors are listed for pets up to 18kg when correctly configured and installed.",
      "Backup and local warning: A 7.0Ah backup battery, external siren and flush-mount internal siren are included.",
      "Alternative mains connection: A plug pack can be requested instead of the supplied transformer.",
    ] : [
      "Large expansion headroom: Eight onboard hardwired zones can grow to 248 zones with compatible EC-Z8 input expanders.",
      usesLed
        ? "Slimline touch operation: The EC-KP W touch interface provides straightforward everyday arming and system-status indication."
        : usesLcd
          ? "Full-text LCD operation: The vertical full-English display provides clearer prompts and everyday system information."
          : "Touchscreen interaction: The touchscreen interface provides visual everyday control and system-status access.",
      "Flexible motion coverage: Two Optex OPT-FLX-S-ST detectors provide selectable wide or narrow indoor PIR coverage with a pet-friendly detection design.",
      "Flexible site scale: Manage up to 32 areas and 2,000 users, including up to 1,900 wireless users when compatible wireless equipment is fitted. The system supports a combined total of up to 32 alarm/access keypads and readers.",
      "Optional app and monitoring path: Elite Cloud smartphone control or monitored reporting can be added through the appropriate plug-on communication module.",
      "Wireless growth option: A compatible Infinity Wireless Link can extend the system to wireless detectors, remotes, panic buttons and sirens.",
      "Automation-ready outputs: Four onboard outputs can expand to 32 using optional EC-O4 modules. Output 4 provides a voltage-free relay for compatible gate or garage-door control.",
      "Access-control expansion: With the appropriate optional access-control hardware, the EC system can manage up to 32 doors; door equipment is not included in the kit.",
      "Wireless relay expansion: Supports up to 32 optional Infinity Output wireless relay modules through a compatible Infinity Wireless Link.",
      "Protected accessory supply: A fused 13.8V DC accessory output provides up to 1A for compatible devices, within the system power budget.",
      "Supervised siren outputs: Outputs 1 and 2 provide monitored 12V connections for the internal and external sirens.",
      "Resilient local alerting: Battery-backed operation and separately positioned indoor and outdoor sounders support local warning during an alarm event.",
    ],
    specifications: usesLegacyPanel ? {
      "Control panel": "Arrowhead hardwired 16-zone alarm panel in plastic cabinet with transformer",
      "Onboard zones": "8",
      "Additional zones": "8 ATZ zones, or wireless zones with a compatible wireless receiver",
      "Maximum zones": "16",
      Dialler: "Built-in analogue dialler",
      Keypad: kit.keypad,
      Detection: "2 × Optex OPT-FLX-S-ST indoor PIR detectors; pet-friendly listing up to 18kg",
      "Backup battery": "12V 7.0Ah sealed lead-acid battery",
      Sirens: "1 × external siren and 1 × flush-mount internal siren",
      Cable: "Not listed as included",
      Warranty: "5 years for the complete kit",
    } : {
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
      Detection: "2 × Optex OPT-FLX-S-ST indoor PIR detectors with selectable wide or narrow coverage",
      "Backup battery": "12V 7.0Ah sealed lead-acid battery",
      Sirens: "1 × Arrowhead EC external siren and 1 × flush-mount internal siren",
      Cable: kit.includesCable ? "100m box of 4C2-100-CU four-core 0.2mm² tinned-copper alarm cable" : "Not listed as included",
      Warranty: "5 years for the complete kit",
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
  if (component.id === "arrowhead-ec-plas-control-panel") return `1 × ${component.name}`;
  if (component.id.endsWith("control-panel")) return `1 × ${component.name} in cabinet with fuse and transformer`;
  if (component.id === "paradox-tm50-touch-keypad") return `1 × ${component.name} — White`;
  if (component.id.endsWith("keypad")) return `1 × ${component.name}`;
  if (component.id.endsWith("pir-detector")) return `2 × ${component.name}`;
  if (component.id === "alarm-flush-mount-internal-siren") return `1 × ${component.name}`;
  if (kitId.startsWith("arrowhead-") && ["alarm-7ah-backup-battery", "powerpac-dm12-7-5-battery", "arrowhead-ec-siren", "arrowhead-ps209-r-internal-siren", "arrowhead-4c2-100-cu-alarm-cable"].includes(component.id)) return `1 × ${component.name}`;
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
