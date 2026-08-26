import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductVisual } from "../components/ProductVisual";
import { useCart } from "../context/CartContext";
import { money } from "../lib/products";
import { localizeProduct } from "../lib/product-i18n";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/ProductContext";
import type { Product } from "../types";

type DetailedTiandyContent = {
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

const dahuaFeatureBadges = [
  ["/assets/product-features/6mp-resolution.png", "6MP full HD resolution"],
  ["/assets/product-features/30m-night-vision.png", "30 metre night vision"],
  ["/assets/product-features/weather-proof.png", "Weather proof"],
  ["/assets/product-features/built-in-mic.png", "Built-in microphone"],
  ["/assets/product-features/false-alarm-filter.png", "False alarm filter"],
  ["/assets/product-features/colour-night-vision.png", "Colour night vision"],
  ["/assets/product-features/h265-plus.png", "H.265+ compression"],
  ["/assets/product-features/built-in-light.png", "Built-in light"],
];

const dahuaDescriptionTitle = "Dahua DH-IPC-HDW3667EM-S-IL-ANZ | 6MP Dual Light Turret | Built-in Mic | SMD 4.0 | IP67";
const dahuaDescription = "The Dahua DH-IPC-HDW3667EM-S-IL-ANZ delivers 6MP WizSense surveillance in a compact turret form, designed for both residential and commercial installations. Featuring smart dual-light technology, it automatically switches between infrared and warm white illumination based on motion, providing full-colour detail and effective deterrence when needed. Equipped with an integrated microphone and H.265+ compression, it captures clear audio alongside high-resolution video while minimising storage and bandwidth demands. Its IP67-rated housing ensures reliable performance across Australia’s harshest outdoor environments.";
const dahuaKeyFeatures = [
  ["6MP High Resolution", "Captures crisp, detailed footage for accurate identification of faces, licence plates, and objects."],
  ["Smart Dual Light", "Automatically switches between infrared and warm white illumination based on motion, enhancing visibility and deterring intruders."],
  ["SMD 4.0 AI Detection", "Precise human and vehicle classification reduces false alarms and improves real-time alert accuracy."],
  ["Built-in Microphone", "Integrated mic captures clear on-site audio to complement video evidence for more comprehensive monitoring."],
  ["IP67 Weatherproof", "Robust housing withstands dust, rain, and harsh outdoor conditions for reliable 24/7 operation."],
  ["H.265+ Compression", "Maximises storage efficiency and minimises bandwidth usage without compromising video quality."],
];

const hikvisionKitContents = [
  ["Control panel", "1 × DS-PWA96-M-WB AX PRO wireless alarm panel"],
  ["Keyfob", "1 × DS-PKF1-WB wireless remote"],
  ["PIR detector", "1 × DS-PDP15P-EG2-WB motion sensor"],
  ["Magnetic contact", "1 × DS-PDMC-EG2-WB door and window sensor"],
];

const hikvisionKeyFeatures = [
  ["Expandable protection", "Connects up to 96 wireless zones or outputs, including compatible PIRCAM devices, keyfobs, sounders, repeaters and keypads."],
  ["Secure wireless communication", "Tri-X two-way communication uses frequency hopping and AES-128 encryption for dependable wireless operation."],
  ["Multiple network paths", "Ethernet, Wi-Fi and mobile-network support help keep the alarm connected and able to deliver notifications."],
  ["Remote app control", "Configure, arm, disarm and receive alerts through supported Hik-Connect and installer applications."],
  ["Power-outage resilience", "The built-in lithium backup battery provides up to 12 hours of standby operation."],
  ["Flexible for home or business", "A compact starter system that can expand with additional detectors, sounders and accessories."],
];

const paradoxKitContents = (model: "SP4000" | "SP5500") => [
  ["Alarm panel", `1 × Paradox ${model} alarm panel in cabinet with fuse and transformer`],
  ["Backup battery", "1 × 7.0 Ah backup battery"],
  ["Keypad", "1 × K10H horizontal keypad"],
  ["Motion detection", "2 × standard Paradox Pro PIR detectors"],
  ["Internal siren", "1 × flush-mount internal siren"],
  ["External siren", "1 × external siren"],
];

const arrowheadKitContents = (keypad: "LCD" | "LED") => [
  ["Alarm panel", "1 × Arrowhead EC hardwired 8-zone control panel in a plastic cabinet with transformer and fuse"],
  ["Keypad", keypad === "LCD" ? "1 × full-English vertical LCD keypad" : "1 × white slimline LED keypad"],
  ["Backup battery", "1 × 7.0 Ah backup battery"],
  ["Motion detection", "2 × Optex FLX-S-ST pet-friendly PIR detectors (up to 18 kg)"],
  ["Sirens", "1 × EC external siren and 1 × internal flush-mount siren"],
  ["Cable", "1 × 100 metre box of 0.2 alarm cable"],
];

type TiandyProductContent = {
  model: string;
  name: string;
  descriptionTitle: string;
  overview: string;
  features: string[];
};

const tiandyC36Content = {
  descriptionTitle: "Tiandy TC-C36XN 2ENA-28 | 6MP DualLight Turret | 2.8mm Lens | Built-in Mic | 30m IR | IP66",
  description:
    "The Tiandy TC-C36XN 2ENA-28 delivers 6MP DualLight surveillance in a compact turret design for residential and commercial installations. Its 2.8 mm fixed lens provides a wide field of view for entrances, driveways and other general monitoring areas, while intelligent DualLight combines infrared and white-light illumination to keep the scene visible after dark. Choose discreet black-and-white monitoring, continuous full-colour night vision, or white light that activates when a smart event is detected. Human and vehicle detection helps focus attention on relevant activity, and the built-in microphone adds audio context to recorded footage. IEEE 802.3af PoE carries power and data through one network cable, while the IP66-rated housing supports demanding indoor and outdoor environments.",
  features: [
    ["6MP High Resolution", "Captures sharp, detailed footage that makes people, vehicles, and important scene details easier to identify."],
    ["Smart DualLight", "Combines infrared and white-light illumination to provide discreet night monitoring, full-colour visibility, or active light-based deterrence when needed."],
    ["Smart Human & Vehicle Detection", "Helps distinguish people and vehicles from general movement, reducing irrelevant events and making security alerts more useful."],
    ["Built-in Microphone", "Captures on-site audio alongside video, providing additional context when reviewing incidents or suspicious activity."],
    ["Wide-Angle 2.8mm Lens", "Provides broad scene coverage, making it well suited to entrances, driveways, walkways, and other areas where a wider view is important."],
    ["IP66 Weatherproof", "Protects the camera against dust, rain and outdoor conditions for dependable long-term surveillance."],
  ],
  overview:
    "Combining 6MP imaging with intelligent DualLight illumination, the TC-C36XN 2ENA-28 is designed for broad coverage and flexible night visibility. Its 2.8 mm lens provides a 112.1° horizontal field of view, making it well suited to nearby entrances, driveways and general monitoring areas. The camera records at up to 3200 × 1800 at 30 fps, while Smart IR, WDR and 3D DNR help retain clear footage in changing light. Infrared reaches up to 30 m, white light reaches up to 15 m, and the alert mode can activate white light after a smart event is detected. With built-in audio, IEEE 802.3af PoE, IP66 protection and an operating range of -30°C to 60°C, it is a practical fixed-camera choice for everyday indoor or outdoor security coverage.",
  capabilities: [
    ["Smart DualLight night vision", "Select infrared, full-colour or alert night modes to suit the scene and the level of visible deterrence required."],
    ["6MP image quality", "High-resolution imaging provides detailed video for general surveillance and incident review, helping retain useful visual information when people, vehicles and other important details need to be identified."],
    ["Wide-angle coverage", "The 2.8 mm lens prioritises a broad nearby view where expansive scene coverage matters more than long-distance magnification."],
    ["Smart human and vehicle detection", "Intelligent detection helps distinguish people and vehicles from general movement, making security events more relevant and reducing unnecessary attention on routine activity."],
    ["Built-in audio", "The integrated microphone captures audio alongside video, providing additional environmental and event information when reviewing recorded footage."],
    ["Efficient PoE installation", "A compatible PoE switch or NVR can provide network data and power through one Ethernet cable."],
  ],
  recommendedApplications: [
    ["Residential properties", "Suitable for driveways, entrances, walkways, garages and other areas requiring broad day-and-night surveillance."],
    ["Small businesses", "Well suited to shop entrances, offices, reception areas and other commercial premises where detailed video and intelligent detection are important."],
    ["Outdoor perimeter monitoring", "The combination of infrared night vision and an IP66-rated housing makes the camera suitable for general outdoor perimeter coverage."],
    ["Driveways and vehicle areas", "The wide-angle lens provides broad coverage for vehicle approaches, parking areas and property entrances."],
    ["PoE surveillance systems", "A practical choice for installations using compatible PoE switches or NVRs where straightforward network and power connectivity is preferred."],
  ],
  why:
    "The TC-C36XN 2ENA-28 provides a balanced combination of high-resolution imaging, broad coverage, smart detection and flexible night vision in a compact turret design. Its DualLight system offers more flexibility than conventional infrared-only cameras, allowing surveillance to remain discreet when required while still providing full-colour visibility or active light-based deterrence when appropriate. The combination of a wide-angle lens, human and vehicle detection, built-in audio and PoE connectivity makes it a versatile option for everyday residential and commercial surveillance. Its IP66-rated construction and wide operating temperature range further support dependable use in demanding indoor and outdoor environments.",
  specifications: [
    ["Image sensor", '1/2.7" CMOS'],
    ["Maximum resolution", "Up to 6MP, 3200 × 1800 @ 30 fps"],
    ["Lens", "2.8 mm fixed focal lens"],
    ["Field of view", "112.1° horizontal / 60.4° vertical / 128.7° diagonal"],
    ["Aperture", "F1.6"],
    ["Minimum illumination", "Colour 0.001 Lux @ F1.6, AGC ON; B/W 0 Lux with IR"],
    ["IR / white-light range", "Up to 30 m IR / 15 m white light"],
    ["Night vision modes", "Infrared / Full Colour / Alert"],
    ["Image enhancement", "Smart IR, WDR and 3D DNR"],
    ["Smart detection", "Human and vehicle detection"],
    ["Video compression", "S+265 / H.265 / H.264B / H.264M / H.264H"],
    ["Audio", "1 × built-in microphone; G.711A / G.711U"],
    ["Network", "RJ-45 10/100 Base-T"],
    ["Power", "IEEE 802.3af PoE; maximum power consumption 5 W"],
    ["Housing", "Metal + plastic; IP66"],
    ["Operating conditions", "-30°C to 60°C; ≤95% RH"],
    ["Default IP address", "192.168.1.2"],
    ["Video standard", "NTSC / PAL"],
  ],
  idealUseCases: [
    ["Driveways and front entrances", "The wide-angle lens provides broad coverage of approaching vehicles and visitors, while DualLight provides flexible night-time visibility."],
    ["Residential perimeters", "Infrared illumination and smart detection provide practical monitoring of general perimeter areas around homes and other properties."],
    ["Retail and shopfronts", "Detailed imaging and human and vehicle detection make the camera suitable for monitoring customer entrances, shopfronts and surrounding activity."],
    ["Small commercial premises", "The compact turret design, built-in audio and PoE connectivity suit offices, reception areas and other commercial environments."],
    ["Indoor and outdoor general surveillance", "The wide-angle lens, adaptable night vision and weather-resistant housing provide a flexible solution for general-purpose surveillance across a range of locations."],
  ],
} as const;

const tiandyH333Content = {
  descriptionTitle: "Tiandy TC-H333K | 3MP Full-Colour Pan-Tilt | Wi-Fi | 4mm Lens | Auto-Tracking | Two-Way Audio | IP66",
  description: "The Tiandy TC-H333K delivers 3MP full-colour surveillance in a pan-tilt design, making it suitable for residential and small commercial installations that need flexible coverage and simple wireless setup. Its 4 mm fixed lens combined with 0–345° pan and 0–90° tilt movement allows the viewing area to be adjusted after installation, while auto-tracking follows moving subjects to keep them in frame. Built-in white LEDs support continuous full-colour night vision, with red and blue alarm flashing available for active deterrence, and a built-in microphone and loudspeaker enable two-way audio communication. With Wi-Fi connectivity, on-board microSD storage of up to 256GB, and an IP66-rated housing, the camera offers a practical wireless surveillance option for demanding indoor and outdoor environments.",
  features: [
    ["3MP High Resolution", "Captures clear, detailed footage that makes people and activity easier to identify."],
    ["Full-Colour Night Vision", "Built-in white LEDs maintain colour footage after dark, with red and blue alarm flash for added deterrence."],
    ["Pan & Tilt Coverage", "0–345° pan and 0–90° tilt movement allows the camera to cover a wider area than a fixed-position camera."],
    ["Auto-Tracking", "Automatically follows moving subjects within the frame, helping keep activity in view."],
    ["Two-Way Audio", "A built-in microphone and loudspeaker allow audio to be captured and played back remotely."],
    ["Wireless Wi-Fi Connectivity", "Simplifies installation in locations where running a network cable is impractical."],
    ["On-Board Storage", "Supports microSD/microSDHC/microSDXC cards up to 256GB for local recording."],
    ["IP66 Weatherproof", "Protects the camera against dust, rain, and outdoor conditions for dependable long-term use."],
  ],
  overview: "Combining 3MP imaging with a motorised pan-tilt mechanism, the Tiandy TC-H333K is a wireless camera designed for residential and small commercial surveillance where flexible positioning and remote monitoring are important. Its 4 mm lens provides an 86.8° horizontal field of view, while 0–345° pan and 0–90° tilt movement lets the camera be repositioned to cover a wider area than a fixed camera alone. Full-colour night vision is maintained using built-in white LEDs up to 15 metres, and auto-tracking helps the camera follow moving subjects as they pass through the scene. A built-in microphone and loudspeaker support two-way audio, while Wi-Fi connectivity and on-board microSD storage up to 256GB allow for flexible, cable-light installation. With IP66 protection and an operating range of -30°C to +60°C, the camera is suited to a range of indoor and outdoor applications.",
  capabilities: [
    ["Full-Colour Night Vision with Alarm Flash", "Built-in white LEDs keep footage in colour after dark, while red and blue alarm flashing can be used to draw attention to the camera and deter unwanted activity."],
    ["3MP Image Quality", "High-resolution imaging provides clear video for everyday surveillance, helping retain useful visual detail when reviewing footage."],
    ["Motorised Pan & Tilt Coverage", "Wide pan and tilt movement allows the camera to be adjusted to follow activity or reposition its field of view without needing to relocate the camera itself."],
    ["Auto-Tracking", "Intelligent tracking automatically follows moving subjects, helping keep relevant activity within frame."],
    ["Two-Way Audio", "The integrated microphone and loudspeaker allow sound to be captured on-site and played back remotely, supporting real-time communication."],
    ["Wireless Installation with Local Storage", "Wi-Fi connectivity removes the need for a network cable, while on-board microSD storage up to 256GB supports local recording independent of an NVR."],
  ],
  recommendedApplications: [
    ["Residential Properties", "Suitable for entrances, yards, driveways and other areas where flexible coverage and wireless installation are useful."],
    ["Small Businesses", "Well suited to shopfronts, reception areas and other premises where remote monitoring and two-way audio support day-to-day operations."],
    ["Rental Properties and Temporary Setups", "Wireless connectivity and simple installation make the camera a practical option where running network cabling is not possible."],
    ["Baby and Pet Monitoring", "Two-way audio and pan-tilt coverage allow the camera to follow movement and enable remote communication."],
    ["General Indoor and Outdoor Monitoring", "The IP66-rated housing and wide operating temperature range support use in a variety of indoor and outdoor settings."],
  ],
  why: "The TC-H333K brings together full-colour night vision, motorised pan-tilt coverage and wireless installation in a single compact camera, making it a flexible choice for households and small businesses that want easy setup without compromising on coverage. Its auto-tracking and two-way audio add practical functionality for monitoring activity and communicating remotely, while the red and blue alarm flash provides an additional layer of active deterrence beyond standard recording. Combined with on-board microSD storage, IP66 weatherproofing and a wide operating temperature range, the TC-H333K is well suited to everyday residential and light commercial surveillance in both indoor and outdoor locations.",
  specifications: [
    ["Model", "TC-H333K"], ["Image sensor", "1/2.8 in CMOS"], ["Maximum resolution", "Up to 3MP, 2304 × 1296 @ 20 fps"], ["Lens", "4 mm fixed focal lens"], ["Field of view", "86.8° horizontal / 46.1° vertical / 99.7° diagonal"], ["Aperture", "F1.6"], ["Minimum illumination", "Colour 0.001 Lux @ F1.6, AGC ON; B/W 0 Lux with IR"], ["IR / white-light range", "Up to 30 m IR / 15 m white light"], ["Alarm flash", "Red and blue alarm flash supported"], ["Pan & tilt", "0–345° pan / 0–90° tilt; 255 presets"], ["Smart functions", "Smart IR, DWDR and auto-tracking"], ["Video compression", "S+265 / H.265 / H.264B / H.264M / H.264H"], ["Audio", "Built-in microphone and loudspeaker; G.711A / G.711U"], ["Wireless", "IEEE 802.11b/g/n, 2.4 GHz; WPA-PSK/WPA2-PSK"], ["Network", "RJ-45 10/100 Base-T"], ["On-board storage", "microSD/microSDHC/microSDXC up to 256GB"], ["Power", "DC12V ±25%, maximum 12W"], ["Housing", "Plastic; IP66; surge 4000V; ESD 6000V"], ["Operating conditions", "-30°C to 60°C; ≤95% RH"], ["Dimensions / weight", "104.5 × 125.5 × 140 mm; 0.53 kg gross"],
  ],
  idealUseCases: [
    ["Home Entrances and Yards", "Pan-tilt movement and full-colour night vision provide flexible coverage of entry points and outdoor areas around the home."],
    ["Small Retail and Reception Areas", "Two-way audio and wide-area coverage make the camera useful for greeting visitors and monitoring foot traffic."],
    ["Wireless or Rental Installations", "Wi-Fi connectivity and on-board storage allow the camera to operate without a wired network connection, suiting rental properties or temporary setups."],
    ["Remote Communication and Monitoring", "Auto-tracking and two-way audio support use cases where following movement and speaking through the camera are important, such as monitoring pets, deliveries or visitors."],
    ["Indoor and Outdoor General Surveillance", "The IP66-rated housing and wide operating temperature range make the camera suitable for general-purpose surveillance across a range of locations."],
  ],
} as const;

const tiandyAdditionalDetailedContent: Record<string, DetailedTiandyContent> = {
  "curated-tiandy-tc-c34xn": {
    descriptionTitle: "Tiandy TC-C34XN 2ENA-28 | 4MP Fixed Turret | 2.8mm Lens | Smart Detection | Built-in Mic | 30m IR | IP66",
    description: "The Tiandy TC-C34XN 2ENA-28 delivers 4MP surveillance in a compact fixed-turret design, making it suitable for residential and commercial installations. Its 2.8 mm fixed lens provides broad coverage for entrances, driveways and other general monitoring areas, while infrared and white-light illumination provide flexible visibility after dark. Smart human and vehicle detection helps focus attention on relevant activity, while Smart IR, DWDR and 3D DNR support clearer footage as lighting conditions change. A built-in microphone adds audio to recorded events, and IEEE 802.3af PoE simplifies installation through a single network connection. With IP66 protection and a -30°C to +60°C operating range, the TC-C34XN 2ENA-28 provides a practical surveillance solution for demanding indoor and outdoor environments.",
    features: [["4MP High Resolution", "Captures clear, detailed footage for reliable monitoring and easier review of people, vehicles and activity."], ["Smart Human & Vehicle Detection", "Helps distinguish relevant subjects from general movement, making security events more useful."], ["Smart Dual-Light", "Combines infrared and white-light illumination to provide flexible visibility after dark while supporting colour detail when required."], ["Wide-Angle 2.8mm Lens", "Provides broad scene coverage for entrances, driveways, walkways and other nearby monitoring areas."], ["Built-in Microphone", "Captures on-site audio alongside video, providing additional context when reviewing recorded events."], ["IP66 Weatherproof", "Protects the camera against dust and water for dependable long-term use across suitable indoor and outdoor locations."]],
    overview: "Combining 4MP imaging with smart detection and flexible night illumination, the Tiandy TC-C34XN 2ENA-28 is a fixed turret camera designed for residential and commercial surveillance where broad coverage is important. Its 2.8 mm fixed lens provides a 91.5° horizontal field of view, while 2560 × 1440 video at up to 30 fps delivers detailed footage for everyday monitoring. Two IR LEDs provide illumination up to 30 metres, while two white LEDs extend night-time visibility with up to 15 metres of white light. Smart human and vehicle detection helps identify meaningful activity, while Smart IR, DWDR, BLC, HLC, 3D DNR and Defog help maintain usable images in changing lighting and environmental conditions. A built-in microphone provides audio capture, and IEEE 802.3af PoE simplifies installation through a single network cable. With IP66 protection, 4kV surge protection and operation from -30°C to +60°C, the camera is suited to a wide range of indoor and outdoor surveillance applications.",
    capabilities: [["Smart Human and Vehicle Detection", "Smart alarm functions distinguish human and vehicle activity from general movement, helping reduce irrelevant events."], ["Smart IR Night Vision", "Two infrared LEDs provide illumination up to 30 metres, while Smart IR helps balance the output for clearer night footage."], ["Flexible Dual-Light Illumination", "Two white LEDs provide up to 15 metres of visible illumination when additional colour detail is required."], ["Wide-Angle Coverage", "The 2.8 mm lens provides a 91.5° horizontal view for nearby entrances, driveways and perimeter areas."], ["Enhanced Image Processing", "DWDR, 3D DNR, BLC, HLC and Defog help maintain usable images through changing light and weather conditions."], ["PoE and Built-in Audio", "IEEE 802.3af PoE supplies data and power through one Ethernet cable, while the built-in microphone adds audio context."]],
    recommendedApplications: [["Residential Entrances", "Suitable for doors, gates and nearby approaches where broad coverage is important."], ["Driveways and Vehicle Areas", "The fixed wide-angle view supports general monitoring of vehicles and access routes."], ["Small Commercial Premises", "Useful for shopfronts, offices and external access areas needing day-and-night coverage."], ["Building Perimeters", "Weather protection and dual-light operation support monitoring around external building edges."], ["PoE Surveillance Systems", "A practical choice for installations using compatible PoE switches or NVRs."]],
    why: "The TC-C34XN 2ENA-28 combines detailed 4MP imaging, broad-angle coverage, smart detection and flexible night illumination in a compact turret-camera format. It can remain discreet with infrared monitoring or use white light where additional colour information is helpful. Built-in audio, PoE connectivity and IP66 protection make it a practical everyday choice for residential and commercial security coverage.",
    specifications: [["Model", "TC-C34XN 2ENA-28"], ["Image sensor", "1/3-inch CMOS"], ["Maximum resolution", "4MP, 2560 × 1440 at up to 30 fps"], ["Lens / field of view", "2.8 mm fixed, F1.6 / 91.5° horizontal"], ["IR / white-light distance", "Up to 30m / up to 15m"], ["Image functions", "Smart IR, DWDR, BLC, HLC, 3D DNR, Defog"], ["Smart detection", "Human and vehicle classification"], ["Audio", "Built-in microphone"], ["Network / power", "RJ45 / IEEE 802.3af PoE, max 4W"], ["Protection", "IP66; 4kV surge protection"], ["Operating conditions", "-30°C to +60°C; ≤95% RH"], ["Dimensions / weight", "117 × 117 × 96 mm / 0.38 kg"]],
    idealUseCases: [["Driveways and Front Entrances", "Broad coverage helps monitor approaching vehicles, visitors and access routes."], ["Residential Perimeters", "Dual-light operation supports everyday monitoring around homes and boundary areas."], ["Retail and Shopfronts", "Detailed imaging and smart detection suit external business access points."], ["Small Offices and Commercial Buildings", "PoE connectivity makes practical fixed-camera deployment straightforward."], ["General Outdoor Surveillance", "IP66 protection supports reliable use in suitable exposed locations."]],
  },
  "curated-tiandy-tc-r3105": {
    descriptionTitle: "Tiandy TC-R3105 | 5CH PSE NVR | 4-Port PoE | 8MP | S+265 | 1HDD | Smart Human & Vehicle Detection",
    description: "The Tiandy TC-R3105 is a compact 5-channel PSE NVR designed for smaller residential and commercial IP surveillance systems. Its four integrated PoE ports simplify camera installation by providing power and network connectivity through the same Ethernet connection, while support for cameras up to 8MP provides detailed footage for everyday security monitoring. S+265 compression helps reduce storage and bandwidth requirements, while Smart Alarm and human and vehicle classification provide more focused event detection than basic motion monitoring. HDMI and VGA outputs support straightforward local monitoring, and ONVIF and RTSP compatibility allow supported third-party cameras to be incorporated into the system. With a single HDD bay supporting up to 8TB, USB backup and EasyLive Plus mobile access, the TC-R3105 provides a practical and flexible recording solution for compact IP camera installations.",
    features: [["5-Channel Recording", "Provides a compact central recording solution for smaller IP camera systems."], ["Integrated PoE Connectivity", "Four powered camera ports combine camera power and network communication through the same cable."], ["Efficient S+265 Compression", "Helps reduce storage and bandwidth requirements, making longer recording periods more practical."], ["Smart Human & Vehicle Classification", "Allows compatible cameras to provide more focused event detection than basic motion monitoring."], ["Flexible Camera Compatibility", "ONVIF Profile S/T and RTSP support allow compatible third-party IP cameras to be included."], ["Remote Monitoring", "EasyLive Plus, P2P and mobile access support remote live viewing and management."]],
    overview: "Combining 5-channel recording with four integrated PoE ports, the Tiandy TC-R3105 is a compact PSE NVR designed for smaller IP surveillance systems. It supports camera resolutions up to 8MP and provides 60 Mbps incoming and 40 Mbps outgoing bandwidth, giving the recorder practical capacity for detailed network video across a compact installation. S+265 compression helps control storage and bandwidth requirements, while the single SATA interface supports an HDD of up to 8TB for local recording. Smart Alarm and human and vehicle classification allow compatible cameras to provide more meaningful event detection, while HDMI and VGA outputs support simultaneous local monitoring at up to 1080P resolution. ONVIF Profile S/T and RTSP support provide additional flexibility for compatible third-party cameras, and four-channel synchronous playback makes it practical to review multiple camera views together. With USB backup, EasyLive Plus mobile access and a compact 201 × 202 × 43 mm chassis, the TC-R3105 provides a straightforward central recording solution for residential and small commercial surveillance.",
    capabilities: [["Integrated PoE Camera Connection", "Four built-in PoE ports allow compatible cameras to connect directly to the recorder; a fifth network camera can be added through the LAN interface."], ["High-Resolution Camera Support", "Supports IP cameras up to 8MP for detailed recording and footage review."], ["Efficient Video Storage", "S+265, H.265 and H.264 compression help manage storage use on the single internal HDD bay."], ["Smart Human and Vehicle Classification", "Compatible cameras can classify people and vehicles to help focus attention on relevant events."], ["Local Monitoring and Playback", "HDMI and VGA outputs support local viewing, while up to four channels can be played back together."], ["Remote Access and Backup", "EasyLive Plus, P2P access and USB backup offer practical ways to view and retain footage."]],
    recommendedApplications: [["Residential CCTV Systems", "Suitable for homes requiring central recording across entrances, driveways, garages and gardens."], ["Small Retail Premises", "Provides a compact recording base for shopfronts, counters and storage areas."], ["Small Offices", "Integrated PoE ports and local display outputs suit focused business surveillance systems."], ["Entry-Level PoE Installations", "Cameras can connect directly to the recorder without requiring a separate PoE switch."], ["Compact System Upgrades", "Five-channel capacity provides room to add an extra network camera alongside four PoE cameras."]],
    why: "The TC-R3105 brings recording, PoE connectivity and local monitoring together in a compact recorder for smaller surveillance systems. Its four PoE ports reduce the need for extra networking hardware, while support for an additional network camera provides useful flexibility. Efficient S+265 compression, smart alarm support, up to 8TB local storage and mobile access make it a practical option for everyday home and small-business monitoring.",
    specifications: [["Model", "TC-R3105 Spec:I/B/P4/Eu/L/S/V2.0"], ["IP camera channels", "Up to 5"], ["Incoming / outgoing bandwidth", "60 Mbps / 40 Mbps"], ["Maximum supported resolution", "Up to 8MP"], ["Compression", "S+265 / H.265 / H.264"], ["Video output", "HDMI and VGA up to 1920 × 1080"], ["Playback", "4-channel synchronous playback"], ["PoE interface / budget", "4 × RJ45, 10/100 Mbps / 45W total"], ["Per-port PoE power", "Up to 30W"], ["HDD interface", "1 × SATA, up to 8TB"], ["Third-party camera access", "ONVIF Profile S/T / RTSP"], ["Mobile access", "EasyLive Plus / Android / iOS / P2P"], ["Dimensions", "201 × 202 × 43 mm"], ["Operating conditions", "-10°C to +55°C; 10%–90% RH"]],
    idealUseCases: [["Home Security Systems", "A compact recorder for homes using PoE cameras at key access points and outdoor areas."], ["Small Retail and Shopfronts", "Supports simple central recording for entrances, counters and stock areas."], ["Small Offices", "Combines camera power, network connection and recording in one compact unit."], ["Driveways and Entry Areas", "Supports high-resolution cameras for detailed coverage of vehicle approaches and access points."], ["Compact PoE CCTV Systems", "Four PoE ports and single-HDD local recording suit straightforward security installations."]],
  },
  "curated-tiandy-tc-r3110": {
    descriptionTitle: "Tiandy TC-R3110 | 10CH PSE NVR | 8-Port PoE | 4K HDMI | S+265 | 1HDD",
    description: "The Tiandy TC-R3110 is a compact 10-channel PSE NVR designed for small to medium IP surveillance systems requiring integrated PoE connectivity and efficient local recording. With eight built-in PoE ports, it simplifies camera installation by providing power and network connectivity through the same Ethernet connection, while supporting up to two additional network camera channels. S+265 compression helps reduce storage requirements without sacrificing useful image quality, and support for up to 6MP camera streams provides a strong foundation for detailed surveillance. HDMI and VGA outputs support local monitoring, while mobile and cloud connectivity provide convenient remote access to live and recorded footage. Its compact design, single-HDD storage and support for third-party cameras through ONVIF and RTSP make the TC-R3110 a practical choice for expanding residential and commercial surveillance systems.",
    features: [["10-Channel Recording", "Provides room for a growing camera system while keeping recording, monitoring and management within a single recorder."], ["Integrated PoE Connectivity", "Simplifies installation by combining camera power and network communication through the recorder's built-in PoE ports."], ["Efficient S+265 Compression", "Helps reduce storage and bandwidth requirements, making longer recording periods more practical."], ["Flexible Camera Compatibility", "Supports Tiandy and compatible third-party network cameras through ONVIF and RTSP integration."], ["4K Display Support", "Provides high-resolution local viewing for clearer live monitoring and easier footage review."], ["Remote Monitoring", "Supports mobile and cloud-based access, allowing surveillance functions to be monitored away from the installation."]],
    overview: "Combining 10-channel recording with an integrated 8-port PoE switch, the Tiandy TC-R3110 is a compact Spark Series NVR designed for residential and commercial IP surveillance systems. It supports cameras up to 6MP and provides 60 Mbps incoming and 40 Mbps outgoing bandwidth, giving the recorder sufficient capacity for a range of higher-resolution camera configurations. S+265 compression helps reduce storage requirements by up to 75%, making efficient use of the single internal HDD bay. Simultaneous HDMI and VGA outputs support local displays up to 4K resolution, while up to four channels can be played back at the same time. ONVIF and RTSP support also provide flexibility when integrating compatible third-party cameras.",
    capabilities: [["Integrated PoE Camera Connection", "Eight built-in PoE ports allow compatible cameras to connect directly to the recorder without a separate PoE switch in many installations."], ["Efficient Video Storage", "S+265 compression is designed to reduce the storage and bandwidth required for recorded footage."], ["Multi-Channel Monitoring", "Supports up to 10 IP camera channels and multiple streams for live viewing and playback."], ["Flexible Video Output", "HDMI and VGA outputs support local live viewing and playback, with HDMI output up to 4K."], ["Third-Party Camera Support", "ONVIF and RTSP compatibility allows supported third-party network cameras to be included."], ["Remote Access and Management", "Mobile access, P2P functionality and cloud services support remote monitoring and management."]],
    recommendedApplications: [["Residential CCTV Systems", "Suitable for larger homes requiring multiple cameras across entrances, driveways, garages and gardens."], ["Small Commercial Premises", "Well suited to retail stores, offices, workshops and businesses requiring centralised recording."], ["PoE Camera Installations", "Integrated power and network connectivity can simplify installation."], ["Multi-Camera Upgrades", "The 10-channel capacity provides room for system expansion."], ["Mixed-Camera Environments", "ONVIF and RTSP support suit compatible third-party IP cameras."]],
    why: "The TC-R3110 combines the functions needed for a compact IP surveillance system into a small and practical recorder. Its eight built-in PoE ports reduce the need for additional networking hardware, while the 10-channel capacity provides room for system expansion. Efficient S+265 compression helps make better use of available storage, and 4K HDMI output provides a clear local monitoring experience. With support for up to 6MP cameras, ONVIF and RTSP compatibility, remote access and a single HDD bay supporting up to 6TB, it offers a balanced combination of connectivity, recording capacity and system flexibility.",
    specifications: [["Model", "TC-R3110 Spec:I/B/P8/Eu/L/S/V2.0"], ["Series", "Spark"], ["IP camera channels", "Up to 10"], ["Incoming / outgoing bandwidth", "60 Mbps / 40 Mbps"], ["Maximum supported resolution", "Up to 6MP"], ["Compression", "S+265 / H.265 / S+264 / H.264"], ["HDMI output", "Up to 3840 × 2160 @ 30Hz"], ["VGA output", "Up to 1920 × 1080 @ 60Hz"], ["PoE ports / budget", "8 × RJ45, 10/100 Mbps / 70 W"], ["HDD interface", "1 × SATA, up to 6TB"], ["Third-party camera access", "ONVIF / RTSP"], ["Mobile access", "Android / iOS / P2P"], ["Dimensions", "200 × 200 × 43 mm"], ["Operating conditions", "-10°C to +55°C; 10%–90% RH"]],
    idealUseCases: [["Larger Residential CCTV Systems", "A practical foundation for monitoring multiple areas around a larger home."], ["Retail and Shop Premises", "Centralised recording and multi-channel monitoring suit entrances, sales areas and storage rooms."], ["Offices and Commercial Buildings", "Multiple network cameras can be brought into one system for easier local monitoring and playback."], ["Workshops and Warehouses", "Integrated PoE connectivity simplifies camera deployment across larger working areas."], ["Expanding Existing IP Systems", "Additional channel capacity and third-party camera support suit systems that may need to grow."]],
  },
  "curated-tiandy-tc-r3104": {
    descriptionTitle: "Tiandy TC-R3104 | 4CH PSE NVR | 4-Port PoE | 6MP | 1080P HDMI/VGA | S+265 | 1HDD",
    description: "The Tiandy TC-R3104 is a compact 4-channel PSE NVR designed for smaller residential and commercial IP surveillance systems. Its four integrated PoE ports simplify camera installation by delivering power and network connectivity through the same Ethernet connection, while support for up to 6MP camera streams provides detailed footage for everyday security monitoring. S+265 compression helps reduce storage and bandwidth requirements, making more efficient use of the installed hard drive. HDMI and VGA outputs allow straightforward local monitoring, while ONVIF and RTSP support provide flexibility when integrating compatible third-party cameras. With a compact 1U-style chassis, single-HDD storage and cloud upgrade support, the TC-R3104 provides a practical foundation for small PoE-based CCTV systems.",
    features: [["4-Channel Recording", "Provides a compact central recording solution for smaller IP camera systems."], ["Integrated PoE", "Combines camera power and network connectivity in the recorder, helping simplify installation."], ["Efficient S+265 Compression", "Reduces storage and bandwidth requirements, making better use of available storage capacity."], ["6MP Camera Support", "Supports higher-resolution network cameras for clearer surveillance footage and event review."], ["Flexible Camera Compatibility", "Supports compatible third-party cameras through ONVIF and RTSP."], ["Compact Design", "Combines recording, PoE connectivity and local display outputs in a compact enclosure."]],
    overview: "Combining 4-channel recording with four integrated PoE ports, the Tiandy TC-R3104 is a compact PSE NVR designed for smaller residential and commercial surveillance systems. It supports camera resolutions up to 6MP with 60 Mbps incoming and 40 Mbps outgoing bandwidth, providing practical capacity for high-resolution IP cameras while maintaining a compact footprint. S+265 compression helps reduce storage requirements by up to 75%, making more efficient use of the single HDD bay, which supports capacities of up to 6TB. HDMI and VGA outputs provide straightforward local display connection, and up to four channels can be played back simultaneously.",
    capabilities: [["Integrated PoE Camera Connection", "Four built-in PoE ports allow compatible cameras to connect directly to the NVR for power and network communication."], ["Efficient Video Storage", "S+265 compression is designed to reduce storage space required for recorded footage by up to 75%."], ["Multi-Channel Recording and Playback", "Supports up to four IP camera channels and four-channel synchronous playback."], ["Flexible Local Display", "HDMI and VGA outputs support live viewing and playback, with HDMI up to 1080P."], ["Third-Party Camera Support", "ONVIF Profile S/T and RTSP support allow compatible third-party network cameras."], ["Remote Access", "Android and iOS mobile access and P2P connectivity provide remote-monitoring options."]],
    recommendedApplications: [["Residential CCTV Systems", "Suitable for homes requiring coverage across entrances, driveways, garages and other key areas."], ["Small Retail Premises", "Provides centralised recording and PoE connectivity for shopfronts, entrances and counters."], ["Small Offices", "The compact design and integrated PoE ports suit smaller business premises."], ["PoE Camera Installations", "Cameras can connect directly to the recorder without requiring a separate PoE switch."], ["Compact Surveillance Upgrades", "4-channel support and ONVIF/RTSP compatibility provide a straightforward upgrade path."]],
    why: "The TC-R3104 brings recording, PoE connectivity and local monitoring together in a compact recorder designed for smaller surveillance installations. Its four PoE ports simplify camera deployment, while support for up to 6MP cameras provides sufficient capacity for detailed footage across entrances, driveways and other important areas. S+265 compression helps control storage requirements, and the single SATA interface supports an HDD of up to 6TB for local recording.",
    specifications: [["Model", "TC-R3104 Spec:I/B/P4/C/Eu/L/S/V2.0"], ["IP camera channels", "4"], ["Incoming / outgoing bandwidth", "60 Mbps / 40 Mbps"], ["Supported resolution", "Up to 6MP"], ["Compression", "S+265 / H.265 / S+264 / H.264"], ["HDMI / VGA output", "Up to 1920 × 1080"], ["PoE interface / budget", "4 × RJ45, 10/100 Mbps / 28 W"], ["HDD interface", "1 × SATA, up to 6TB"], ["AI analytics", "Smart Motion"], ["Third-party camera access", "ONVIF Profile S/T / RTSP"], ["Mobile access", "Android / iOS / P2P"], ["Dimensions", "200 × 200 × 43 mm"], ["Operating conditions", "-10°C to +55°C; 10%–90% RH"]],
    idealUseCases: [["Home Security", "A practical central recorder for smaller homes requiring up to four PoE cameras."], ["Shopfronts and Small Retail", "Four-channel recording and integrated PoE provide a simple way to manage important zones."], ["Small Offices", "The compact enclosure and straightforward local display options suit smaller commercial premises."], ["Driveway and Entrance Monitoring", "Supports high-resolution cameras for detailed coverage of vehicle approaches and access points."], ["Compact PoE CCTV Systems", "Four PoE ports, one HDD bay and efficient compression suit cost-conscious IP surveillance installations."]],
  },
};

const tiandyAdditionalCameraContent: Record<string, DetailedTiandyContent> = {
  "curated-tiandy-tc-h343k": {
    descriptionTitle: "Tiandy TC-H343K 9DA-4 | 4MP 4G Solar PT Camera | 4mm Lens | Dual Light | 2-Way Audio | IP65",
    description: "The Tiandy TC-H343K 9DA-4 is a 4MP 4G solar-compatible PT camera designed for remote surveillance locations where conventional network cabling and mains power are difficult to provide. Its fixed 4mm lens delivers focused coverage while pan-and-tilt movement allows the viewing direction to be adjusted across a wide area. Dual-light illumination combines infrared and white-light LEDs for flexible night monitoring, while human and vehicle detection and automatic tracking help follow relevant activity more effectively. A built-in microphone and loudspeaker support two-way audio, and local microSD recording provides an additional option for storing footage at the camera. With 4G connectivity, solar-oriented deployment, IP65 protection and a compact outdoor design, the TC-H343K is particularly suited to remote properties, construction sites, farms and other off-grid locations.",
    features: [["4MP High Resolution", "Captures detailed footage for monitoring remote sites, access points and broader outdoor areas."], ["4G Solar Connectivity", "Supports installations where fixed network cabling and mains power are impractical."], ["Pan & Tilt Coverage", "Motorised movement helps a single camera monitor a wider area."], ["Smart DualLight", "Combines infrared and white-light illumination for flexible night monitoring."], ["Auto-Tracking & Smart Detection", "Helps follow relevant human and vehicle activity more effectively."], ["Two-Way Audio", "Built-in microphone and speaker support live communication at the site."]],
    overview: "Combining 4MP imaging, 4G connectivity and solar-oriented operation, the Tiandy TC-H343K 9DA-4 is a PT camera designed for remote and off-grid surveillance where conventional network and power infrastructure may not be available. Its 4mm fixed lens provides a 77.3° horizontal field of view, while motorised pan and tilt movement covers up to 345° horizontally and 90° vertically. Dual-light illumination provides infrared coverage up to 30 metres and white-light coverage up to 15 metres, supporting both discreet night monitoring and colour visibility. Human and vehicle detection can trigger intelligent events, while Auto-Tracking helps keep detected subjects in view. The built-in microphone and loudspeaker add two-way audio, and microSD support up to 256GB provides local recording. With 4G networking, DC power designed for solar deployment and IP65 protection, the camera is well suited to construction sites, farms, remote properties and other locations without fixed infrastructure.",
    capabilities: [["4G Connectivity for Remote Surveillance", "Uses a mobile network connection for locations without fixed broadband."], ["Solar-Oriented Off-Grid Operation", "Supports deployments where conventional mains power is difficult to provide."], ["Motorised Pan & Tilt", "Offers 345° horizontal and 90° vertical movement for broader coverage."], ["Dual-Light Night Monitoring", "Provides infrared up to 30m and white light up to 15m."], ["Auto-Tracking and Smart Detection", "Helps keep detected people and vehicles in view."], ["Two-Way Audio and Local Storage", "Combines a microphone, speaker and microSD support up to 256GB."]],
    recommendedApplications: [["Remote Properties", "Suitable for monitoring rural homes, sheds, access points and outbuildings."], ["Construction Sites", "Provides adaptable coverage for temporary sites without fixed infrastructure."], ["Farms and Agricultural Areas", "Useful for entrances, equipment areas, sheds and wider open spaces."], ["Temporary or Off-Grid Installations", "A practical option where cabling or mains power is unavailable."], ["Remote Access Points", "Helps monitor gates, driveways and isolated entry routes."]],
    why: "The TC-H343K 9DA-4 is built for surveillance locations where traditional wired installations are not practical. Its combination of 4G connectivity, solar-oriented power support, pan-and-tilt movement and intelligent detection makes it a flexible choice for remote monitoring. Dual-light operation, two-way audio and local recording add practical day-to-day security tools while the IP65 housing supports dependable outdoor use.",
    specifications: [["Model", "TC-H343K 9DA-4"], ["Camera type", "4G solar PT camera"], ["Image sensor", "1/2.7-inch CMOS"], ["Maximum resolution", "4MP, 2560 × 1440"], ["Lens", "4mm fixed focal lens"], ["Field of view", "77.3° horizontal"], ["Pan / tilt", "345° horizontal / 90° vertical"], ["Infrared / white light", "Up to 30m / 15m"], ["Smart detection", "Human and vehicle detection"], ["Auto tracking", "Supported"], ["Audio", "Built-in microphone and loudspeaker"], ["Storage", "microSD support up to 256GB"], ["Network", "4G mobile connectivity"], ["Protection", "IP65"], ["Power", "DC input suitable for solar deployment"]],
    idealUseCases: [["Rural and Agricultural Monitoring", "Covers remote homes, sheds, gates and equipment areas."], ["Construction and Temporary Sites", "Supports surveillance where fixed network and power systems are not yet available."], ["Remote Gates and Access Roads", "Provides flexible coverage for isolated approaches and entrance points."], ["Off-Grid Properties", "A practical choice for sites that rely on mobile connectivity and solar-oriented power."], ["Wide Outdoor Areas", "Pan-and-tilt movement helps monitor a broader space with one camera."]],
  },
  "curated-tiandy-tc-c34cn": {
    descriptionTitle: "Tiandy TC-C34CN 9ATA-28 | 4MP Wi-Fi Bullet Camera | 2.8mm Lens | Built-in Mic & Speaker | 30m IR | IP65",
    description: "The Tiandy TC-C34CN 9ATA-28 is a 4MP Wi-Fi bullet camera designed for residential and small commercial surveillance where flexible wireless connectivity is preferred. Its 2.8mm fixed lens provides a broad viewing angle for entrances, driveways and general outdoor areas, while Color Maker technology combines infrared and white-light illumination to maintain useful visibility after dark. Smart Alarm functions can trigger sound, warm light, recording and image capture when relevant activity is detected, while the built-in microphone and speaker support two-way audio. With local microSD recording, 2.4GHz Wi-Fi connectivity and IP65-rated protection, the camera provides a practical solution for installations where running network cabling is inconvenient.",
    features: [["4MP High Resolution", "Captures detailed video for everyday residential and small-business monitoring."], ["Color Maker Night Vision", "Combines infrared and white light to maintain useful visibility after dark."], ["2.8mm Wide-Angle Lens", "Provides broad coverage for entrances, driveways and nearby outdoor areas."], ["Smart Alarm", "Can trigger sound, warm light, recording and image capture when relevant activity is detected."], ["Two-Way Audio", "Built-in microphone and speaker support live communication."], ["Wireless & Weather Resistant", "Uses 2.4GHz Wi-Fi and an IP65-rated housing for practical outdoor use."]],
    overview: "Combining 4MP Color Maker imaging with wireless connectivity, the Tiandy TC-C34CN 9ATA-28 is a fixed bullet camera designed for residential and small commercial surveillance where broad coverage and flexible installation are important. Its 2.8mm fixed lens provides a 103.8° horizontal field of view, making it suitable for entrances, driveways and nearby perimeter areas, while 2560 × 1440 resolution at up to 20 fps provides detailed footage for everyday monitoring. Dual-light illumination combines infrared up to 30 metres with white light up to 20 metres, allowing the camera to maintain discreet infrared monitoring or provide additional colour visibility when required. Smart Alarm functions can trigger sound, warm light, recording and image capture, while a built-in microphone and loudspeaker provide two-way audio. With 2.4GHz 802.11b/g/n Wi-Fi, microSD support up to 256GB and IP65 protection, the camera provides a practical wireless surveillance solution for locations where conventional network cabling is less convenient.",
    capabilities: [["Color Maker Dual-Light Night Vision", "Uses infrared and white-light illumination for discreet monitoring or added colour visibility."], ["Wide-Angle 2.8mm Lens", "A 103.8° horizontal view covers entrances, driveways and nearby perimeter areas."], ["Smart Alarm Functions", "Can use sound, warm light, recording and image capture for relevant events."], ["Wireless Wi-Fi Connectivity", "Connects through 2.4GHz Wi-Fi where running network cabling is inconvenient."], ["Two-Way Audio", "Built-in microphone and loudspeaker support live communication."], ["Local microSD Recording", "Supports local recording to microSD cards up to 256GB."]],
    recommendedApplications: [["Residential Entrances", "Suitable for doors, gates and nearby external approaches."], ["Driveways and Carports", "The wide-angle lens supports general coverage of vehicle access areas."], ["Small Retail Premises", "Useful for entry points and outdoor areas around smaller commercial sites."], ["Home and Small-Business Wi-Fi Systems", "A practical choice where wired network installation is less convenient."], ["Outdoor General Surveillance", "IP65 protection supports dependable monitoring in exposed locations."]],
    why: "The TC-C34CN 9ATA-28 combines detailed 4MP imaging, wireless connectivity and flexible dual-light monitoring in a straightforward bullet-camera format. It is a practical option for homes and small businesses that need broad outdoor coverage without the disruption of running network cable. Smart Alarm functions, two-way audio and local recording add useful day-to-day security tools.",
    specifications: [["Model", "TC-C34CN 9ATA-28"], ["Camera type", "Wi-Fi Color Maker bullet camera"], ["Image sensor", "1/2.7-inch CMOS"], ["Maximum resolution", "4MP, 2560 × 1440 at up to 20 fps"], ["Lens", "2.8mm fixed focal lens"], ["Field of view", "103.8° horizontal"], ["Infrared distance", "Up to 30m"], ["White-light distance", "Up to 20m"], ["Smart alarm", "Sound, warm light, recording and image capture"], ["Audio", "Built-in microphone and loudspeaker"], ["Storage", "microSD support up to 256GB"], ["Wireless", "2.4GHz IEEE 802.11b/g/n Wi-Fi"], ["Network video", "H.265 / H.264"], ["Protection", "IP65"], ["Power", "12V DC"]],
    idealUseCases: [["Front Doors and Entry Points", "A wide view helps monitor visitors and activity near primary entrances."], ["Residential Driveways", "Provides practical coverage of vehicles, carports and approach routes."], ["Small Shops and Offices", "Supports monitoring of external access areas with flexible Wi-Fi connectivity."], ["Wireless Camera Installations", "A suitable option when Ethernet cabling is difficult or undesirable."], ["Outdoor Home Surveillance", "Dual-light operation and weather protection support day-and-night coverage."]],
  },
};

const tiandyProductContent: TiandyProductContent[] = [
  {
    model: "TC-C36XN",
    name: "Tiandy 6MP DualLight Turret Camera",
    descriptionTitle: "Tiandy TC-C36XN 2ENA-28 | 6MP DualLight Turret | Built-in Mic | IP66",
    overview: "The Tiandy TC-C36XN 2ENA-28 is a 6MP turret network camera with a 1/2.7-inch CMOS sensor and 2.8mm fixed lens. It combines infrared illumination up to 30m with white-light illumination up to 15m, plus Smart IR, WDR, human and vehicle detection, a built-in microphone and PoE power in an IP66 housing.",
    features: ["6MP resolution up to 3200 × 1800 at 30fps", "Dual illumination: infrared up to 30m and white light up to 15m", "2.8mm fixed lens with 112.1° horizontal field of view", "Human and vehicle smart-alarm detection", "Built-in microphone with S+265 / H.265 / H.264 compression", "PoE IEEE 802.3af, ONVIF Profile S/T and IP66 protection"],
  },
  {
    model: "TC-C34XN",
    name: "Tiandy 4MP Fixed Turret Camera",
    descriptionTitle: "Tiandy TC-C34XN 2ENA-28 | 4MP Fixed Turret | Built-in Mic | IP66",
    overview: "The Tiandy TC-C34XN 2ENA-28 is a 4MP fixed turret camera with a 1/3-inch CMOS sensor and 2.8mm fixed lens. It provides Smart IR up to 30m, white-light illumination up to 15m, human and vehicle detection, a built-in microphone and PoE support for dependable indoor or outdoor surveillance.",
    features: ["4MP resolution, 2560 × 1440 at 30fps", "Infrared illumination up to 30m and white light up to 15m", "2.8mm fixed lens with 91.5° horizontal field of view", "DWDR, 3D DNR and Smart IR", "Human and vehicle smart-alarm detection", "Built-in microphone, ONVIF Profile S/T, PoE and IP66 protection"],
  },
  {
    model: "TC-R3105",
    name: "Tiandy 1 HDD 5-Channel PSE NVR",
    descriptionTitle: "Tiandy TC-R3105 | 5-Channel PSE NVR | 4 PoE Ports | 1 HDD",
    overview: "The Tiandy TC-R3105 is a 5-channel PSE network video recorder supporting camera input up to 8MP, 60Mbps incoming bandwidth and local HDD storage. Four integrated PoE ports simplify camera connection, while Smart Alarm and human/vehicle classification support efficient monitoring.",
    features: ["5 camera channels with up to 8MP input", "60Mbps incoming and 40Mbps outgoing bandwidth", "Four PoE ports with a 45W total PoE budget", "One HDD bay supporting drives up to 8TB", "4-channel simultaneous playback with HDMI and VGA outputs", "S+265 / H.265 / H.264, ONVIF Profile S/T and RTSP support"],
  },
  {
    model: "TC-R3110",
    name: "Tiandy 1 HDD 10-Channel Advanced PSE NVR",
    descriptionTitle: "Tiandy TC-R3110 | 10-Channel PSE NVR | 8 PoE Ports | 4K HDMI",
    overview: "The Tiandy TC-R3110 is a 10-channel PSE network video recorder with 60Mbps incoming bandwidth, local HDD recording and 4K HDMI output. Eight integrated PoE ports provide a 70W budget for connected cameras, and Smart Motion analytics are supported through compatible cameras.",
    features: ["10 camera channels with up to 6MP supported resolution", "60Mbps incoming and 40Mbps outgoing bandwidth", "Eight PoE ports with a 70W total PoE budget", "4K HDMI output and up to 10-camera multi-screen display", "One HDD bay supporting drives up to 6TB", "S+265 / H.265 / H.264, ONVIF Profile S/T and RTSP support"],
  },
  {
    model: "TC-R3104",
    name: "Tiandy 1 HDD 4-Channel PSE NVR",
    descriptionTitle: "Tiandy TC-R3104 | 4-Channel PSE NVR | 4 PoE Ports | 1 HDD",
    overview: "The Tiandy TC-R3104 is a compact 4-channel PSE network video recorder that supports camera input up to 6MP, 60Mbps incoming bandwidth and local HDD recording. Its four integrated PoE ports provide a tidy single-cable camera installation, with Smart Motion and ONVIF Profile S/T support.",
    features: ["4 camera channels with up to 6MP input", "60Mbps incoming and 40Mbps outgoing bandwidth", "Four PoE ports with a 28W total PoE budget", "One HDD bay supporting drives up to 6TB", "HDMI and VGA output with 4-channel playback", "Smart Motion, RTSP and ONVIF Profile S/T support"],
  },
  {
    model: "TC-H343K",
    name: "Tiandy 4MP Color Maker 4G Solar PT Camera",
    descriptionTitle: "Tiandy TC-H343K 8DA-4 | 4MP Solar 4G PT Camera | Auto Tracking | IP65",
    overview: "The official Tiandy model is TC-H343K 8DA-4. It is a 4MP Color Maker PT camera for Tiandy's solar and battery integrated range, with human and vehicle detection, auto-tracking, infrared and white-light illumination, two-way audio and microSD storage.",
    features: ["4MP resolution up to 2560 × 1440 at 20fps", "Pan/tilt movement with 64 presets and auto-tracking", "Infrared illumination up to 30m and white light up to 15m", "Human and vehicle detection with red/blue alarm flashing", "Built-in microphone, loudspeaker and microSD storage up to 256GB", "IP65 protection for solar and battery-integrated deployments"],
  },
  {
    model: "TC-C34CN",
    name: "Tiandy 4MP Color Maker Wi-Fi Bullet Camera",
    descriptionTitle: "Tiandy TC-C34CN 9ATA-28 | 4MP Wi-Fi Bullet | Two-Way Audio | IP65",
    overview: "The Tiandy TC-C34CN 9ATA-28 is a 4MP Color Maker Wi-Fi bullet camera with a 2.8mm fixed lens, infrared illumination up to 30m and white-light illumination up to 20m. It includes Wi-Fi connectivity, two-way audio, microSD storage and IP65 protection.",
    features: ["4MP resolution up to 2560 × 1440 at 20fps", "2.8mm fixed lens with 103.8° horizontal field of view", "Infrared illumination up to 30m and white light up to 20m", "Wi-Fi 802.11b/g/n with WPA-PSK / WPA2-PSK security", "Built-in microphone, loudspeaker and microSD storage up to 256GB", "Smart Alarm, 3D DNR, DWDR and IP65 protection"],
  },
];

const normaliseProductCode = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

function productSummaryHeading(product: Product) {
  const highlights = product.features.slice(0, 2).join(" | ");
  return highlights ? `${product.brand} ${product.sku} | ${highlights}` : `${product.brand} ${product.sku} | Product overview`;
}

function productOverview(product: Product) {
  const overview = product.description.trim();
  if (overview.length >= 420) return overview;
  const highlights = product.features.slice(0, 5).join("; ");
  const productUse = product.category.toLowerCase().includes("nvr")
    ? "It is intended for practical video recording, camera management and local playback in a security system."
    : product.category.toLowerCase().includes("accessor")
      ? "It is intended to support a neat, compatible and dependable security-system installation."
      : "It is suited to residential or commercial security installations where dependable day-to-day operation is important.";
  const verifiedDetail = highlights ? ` Key specifications include ${highlights}.` : "";
  const guidance = " Check the linked datasheet for full compatibility, environmental limits and installation requirements before ordering.";
  return `${overview} ${productUse}${verifiedDetail}${guidance}`;
}

export function ProductDetailPage() {
  const { id } = useParams();
  const { products } = useProducts();
  const baseProduct = products.find((item) => item.id === id);
  const [sourceDetail, setSourceDetail] = useState<Partial<Product>>();
  useEffect(() => {
    let cancelled = false;
    setSourceDetail(undefined);
    const sourceId = id?.startsWith("source-") ? id : baseProduct?.sourceProductId;
    if (!sourceId) return () => { cancelled = true; };
    fetch(`/api/catalogue-source/${encodeURIComponent(sourceId)}`)
      .then(response => response.ok ? response.json() : Promise.reject(new Error("Product details unavailable")))
      .then(detail => { if (!cancelled) setSourceDetail(detail); })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [id, baseProduct?.sourceProductId]);
  const { language } = useLanguage();
  const zh = language === "zh";
  const keepsVerifiedCuratedCopy = Boolean(baseProduct?.id.startsWith("curated-"));
  const detailedBaseProduct = baseProduct ? { ...sourceDetail, ...baseProduct, image: baseProduct.image ?? sourceDetail?.image, galleryImages: baseProduct.galleryImages?.length ? baseProduct.galleryImages : sourceDetail?.galleryImages, featureImages: baseProduct.featureImages?.length ? baseProduct.featureImages : sourceDetail?.featureImages, features: keepsVerifiedCuratedCopy ? baseProduct.features : (sourceDetail?.features?.length ? sourceDetail.features : baseProduct.features), description: keepsVerifiedCuratedCopy ? baseProduct.description : (sourceDetail?.description || baseProduct.description), shortDescription: keepsVerifiedCuratedCopy ? baseProduct.shortDescription : (sourceDetail?.shortDescription || baseProduct.shortDescription) } as Product : undefined;
  const product = detailedBaseProduct ? localizeProduct(detailedBaseProduct, language) : undefined;
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("White");
  const [selectedPower, setSelectedPower] = useState("NZ power supply");
  const [added, setAdded] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [detailLength, setDetailLength] = useState<"short" | "full">("full");
  const { addItem } = useCart();
  if (!product) return <main className="page container empty-state"><h1>Product not found</h1><Link className="button button--primary" to="/products">Back to products</Link></main>;
  const add = () => { addItem(product.id, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 1800); };
  const usesDahuaBadges = product.id === "dahua-4k-turret";
  const usesHikvisionKitLayout = product.id === "hikvision-ax-pro-security-kit";
  const paradoxModel = product.id === "paradox-sp4000-alarm-kit" ? "SP4000" : product.id === "paradox-sp5500-alarm-kit" ? "SP5500" : undefined;
  const usesParadoxKitLayout = Boolean(paradoxModel);
  const arrowheadKeypad = product.id === "arrowhead-ec-lcd-alarm-kit" ? "LCD" : product.id === "arrowhead-ec-led-alarm-kit" ? "LED" : undefined;
  const usesArrowheadKitLayout = Boolean(arrowheadKeypad);
  const usesTiandyC36Layout = product.id === "curated-tiandy-tc-c36xn";
  const usesTiandyH333Layout = product.id === "curated-tiandy-tc-h333k";
  const additionalTiandyLayoutContent = tiandyAdditionalDetailedContent[product.id] ?? tiandyAdditionalCameraContent[product.id];
  const usesTiandyDetailedLayout = usesTiandyC36Layout || usesTiandyH333Layout || Boolean(additionalTiandyLayoutContent);
  const usesTiandyShortToggle = usesTiandyC36Layout || Boolean(additionalTiandyLayoutContent);
  const tiandyLayoutContent = usesTiandyC36Layout ? tiandyC36Content : usesTiandyH333Layout ? tiandyH333Content : additionalTiandyLayoutContent;
  const additionalTiandyHeadings = {
    "curated-tiandy-tc-c34xn": { overview: "Wide coverage with flexible dual-light monitoring", recommended: "Suited to practical day-and-night coverage", whyEyebrow: "Why the TC-C34XN 2ENA-28?", why: "A versatile 4MP dual-light turret camera", uses: "Flexible coverage from entry to perimeter" },
    "curated-tiandy-tc-r3105": { overview: "Compact recording with integrated PoE", recommended: "Suited to focused IP surveillance", whyEyebrow: "Why the TC-R3105?", why: "A practical NVR for smaller systems", uses: "Reliable recording from home to business" },
    "curated-tiandy-tc-r3110": { overview: "Central recording with integrated PoE connectivity", recommended: "Suited to scalable IP surveillance", whyEyebrow: "Why the TC-R3110?", why: "A compact NVR for growing systems", uses: "Flexible recording from home to business" },
    "curated-tiandy-tc-r3104": { overview: "Simple PoE recording for compact systems", recommended: "Suited to focused IP surveillance", whyEyebrow: "Why the TC-R3104?", why: "A practical NVR for smaller systems", uses: "Reliable recording for key areas" },
    "curated-tiandy-tc-h343k": { overview: "Remote coverage without fixed infrastructure", recommended: "Suited to off-grid surveillance", whyEyebrow: "Why the TC-H343K 9DA-4?", why: "Flexible 4G and solar-oriented monitoring", uses: "Remote coverage from access to perimeter" },
    "curated-tiandy-tc-c34cn": { overview: "Wireless coverage with flexible night visibility", recommended: "Suited to convenient Wi-Fi surveillance", whyEyebrow: "Why the TC-C34CN 9ATA-28?", why: "A practical Color Maker Wi-Fi bullet camera", uses: "Flexible coverage from entry to driveway" },
  }[product.id];
  const tiandyPageHeadings = usesTiandyH333Layout ? {
    overview: zh ? "灵活的无线全彩监控" : "Flexible wireless coverage with full-colour night vision",
    recommended: zh ? "适合灵活日常监控的位置" : "Suited to flexible everyday monitoring",
    whyEyebrow: zh ? "为什么选择此型号" : "Why the TC-H333K?",
    why: zh ? "灵活的全彩无线云台摄像机" : "A flexible full-colour Wi-Fi PT camera",
    uses: zh ? "从入口到庭院的灵活覆盖" : "Flexible coverage from entry to yard",
  } : additionalTiandyHeadings ? {
    overview: additionalTiandyHeadings.overview,
    recommended: additionalTiandyHeadings.recommended,
    whyEyebrow: additionalTiandyHeadings.whyEyebrow,
    why: additionalTiandyHeadings.why,
    uses: additionalTiandyHeadings.uses,
  } : {
    overview: zh ? "广角覆盖与灵活夜视" : "Broad coverage with flexible night visibility",
    recommended: zh ? "适合日常监控的位置" : "Suited to everyday monitoring",
    whyEyebrow: zh ? "为什么选择此型号" : "Why the TC-C36XN 2ENA-28?",
    why: zh ? "适合灵活夜视的全能炮塔机" : "A versatile DualLight turret camera",
    uses: zh ? "从入口到周界的灵活覆盖" : "Flexible coverage from entry to perimeter",
  };
  // Curated records now carry supplier-verified descriptions and features directly.
  // Keep the legacy Tiandy layout only for any future product that explicitly needs it.
  const tiandyDetail = undefined as TiandyProductContent | undefined;
  const displayName = tiandyDetail?.name ?? product.name;
  const displaySku = tiandyDetail?.model ?? product.sku;
  const previewImages: Array<string | undefined> = [
    product.image,
    ...((product.galleryImages?.length ? product.galleryImages : usesDahuaBadges ? ["/assets/dahua-installed-preview.png"] : [])),
  ];
  const displayedImage = previewImages[previewIndex] ?? product.image;
  const fullSummary = usesDahuaBadges ? dahuaDescription : usesTiandyDetailedLayout ? tiandyLayoutContent!.description : tiandyDetail?.overview ?? productOverview(product);

  return (
    <main className="page container product-page">
      <div className="breadcrumb"><Link to="/">{zh ? "首页" : "Home"}</Link><span>›</span><Link to={`/products?category=${encodeURIComponent(baseProduct!.category)}`}>{product.category}</Link><span>›</span>{displayName}</div>
      <section className={`product-detail product-detail--commerce ${usesTiandyDetailedLayout ? "product-detail--tiandy-c36" : ""}`}>
        <div className="product-preview">
          <div className="product-detail__gallery">{product.badge && <span className="badge">{product.badge}</span>}<ProductVisual icon={product.icon} accent={product.accent} image={displayedImage} alt={displayName} large />{!displayedImage && <div className="gallery-note">{zh ? "产品预览" : "PRODUCT PREVIEW"}</div>}</div>
          <div className="product-preview__thumbs">{previewImages.map((image, index) => <button type="button" key={`${image || "product-placeholder"}-${index}`} className={index === previewIndex ? "active" : ""} onClick={() => setPreviewIndex(index)} aria-label={`${zh ? "显示产品图片" : "Show product image"} ${index + 1}`}><ProductVisual icon={product.icon} accent={product.accent} image={image} alt="" /></button>)}</div>
        </div>
        <div className="product-detail__info product-purchase">
          <span className="eyebrow">{product.brand} · SKU {displaySku}</span>
          <h1>{displayName}</h1>
          <div className="detail-price"><strong>{product.priceOnRequest ? (zh ? "询价" : "Price on request") : money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}<small>{product.priceOnRequest ? (zh ? "请联系我们获取报价" : "Contact us for a quote") : (zh ? "含商品及服务税" : "inc GST")}</small>{usesTiandyDetailedLayout && <section className="product-status product-status--price" aria-label={zh ? "产品库存" : "Product stock"}><div><span>{zh ? "库存" : "Stock"}</span><strong className={product.priceOnRequest ? "out-of-stock" : product.stock > 0 ? "in-stock" : "out-of-stock"}>{product.priceOnRequest ? (zh ? "库存请询问" : "Stock on request") : product.stock > 0 ? (zh ? `现货 ${product.stock} 件` : `${product.stock} in stock`) : (zh ? "缺货" : "Out of stock")}</strong></div></section>}</div>
          {!usesTiandyDetailedLayout && <section className="product-status" aria-label={zh ? "产品库存和选项" : "Product stock and options"}><div><span>{zh ? "库存" : "Stock"}</span><strong className={product.priceOnRequest ? "out-of-stock" : product.stock > 0 ? "in-stock" : "out-of-stock"}>{product.priceOnRequest ? (zh ? "库存请询问" : "Stock on request") : product.stock > 0 ? (zh ? `现货 ${product.stock} 件` : `${product.stock} in stock`) : (zh ? "缺货" : "Out of stock")}</strong></div></section>}
          <div className="product-summary"><h2>{usesDahuaBadges ? dahuaDescriptionTitle : usesTiandyDetailedLayout ? tiandyLayoutContent!.descriptionTitle : tiandyDetail?.descriptionTitle ?? (product.id.startsWith("curated-") ? product.shortDescription : productSummaryHeading(product))}</h2><p>{fullSummary}</p></div>
          {usesHikvisionKitLayout && <section className="key-features product-kit-contents"><h2>{zh ? "套装包含" : "What's included"}</h2><ul>{hikvisionKitContents.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>}
          {usesParadoxKitLayout && <section className="key-features product-kit-contents"><h2>{zh ? "套装包含" : "What's included"}</h2><ul>{paradoxKitContents(paradoxModel!).map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul><p><strong>Note:</strong> Cable must be ordered separately.</p></section>}
          {usesArrowheadKitLayout && <section className="key-features product-kit-contents"><h2>{zh ? "套装包含" : "What's included"}</h2><ul>{arrowheadKitContents(arrowheadKeypad!).map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>}
          {!usesHikvisionKitLayout && !usesParadoxKitLayout && !usesArrowheadKitLayout && (usesDahuaBadges || product.featureImages?.length) ? <div className="feature-badges" aria-label={zh ? "产品特点" : "Product features"}>{(product.featureImages?.length ? product.featureImages.map((src, index) => [src, product.features[index] || `Feature ${index + 1}`]) : dahuaFeatureBadges).map(([src, label]) => <img key={src} src={src} alt={label} />)}</div> : null}
          {usesTiandyDetailedLayout && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{tiandyLayoutContent!.features.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>}
          {usesDahuaBadges && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{dahuaKeyFeatures.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>}
          {tiandyDetail && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{tiandyDetail.features.map(feature => <li key={feature}>{feature}</li>)}</ul></section>}
          {usesHikvisionKitLayout && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{hikvisionKeyFeatures.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>}
          {usesParadoxKitLayout && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{product.features.map(feature => <li key={feature}>{feature}</li>)}</ul></section>}
          {usesArrowheadKitLayout && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{product.features.map(feature => <li key={feature}>{feature}</li>)}</ul></section>}
          {!usesDahuaBadges && !usesTiandyDetailedLayout && !tiandyDetail && !usesHikvisionKitLayout && !usesParadoxKitLayout && !usesArrowheadKitLayout && product.features.length > 0 && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{product.features.map(feature => <li key={feature}>{feature}</li>)}</ul></section>}
          {usesDahuaBadges && <section className="additional-information"><h2>{zh ? "附加信息" : "Additional Information"}</h2><a href="/assets/DH-IPC-HDW3667EM-S-IL-ANZ-spec-sheet.pdf" target="_blank" rel="noopener noreferrer">DH-IPC-HDW3667EM-S-IL-ANZ Spec Sheet <span aria-hidden="true">↗</span></a></section>}
          {usesHikvisionKitLayout && <section className="additional-information"><h2>{zh ? "附加信息" : "Additional Information"}</h2><a href="/assets/DS-PWA96-Kit-WB_Datasheet_20230516.pdf" target="_blank" rel="noopener noreferrer">DS-PWA96-Kit-WB_Datasheet_20230516 <span aria-hidden="true">↗</span></a></section>}
          {!usesDahuaBadges && !usesHikvisionKitLayout && product.datasheetUrl && <section className="additional-information"><h2>{zh ? "附加信息" : "Additional Information"}</h2><a href={product.datasheetUrl} target="_blank" rel="noopener noreferrer">{product.sku} Datasheet <span aria-hidden="true">↗</span></a></section>}
          {usesHikvisionKitLayout && <div className="colour-picker"><div><strong>{zh ? "电源选择" : "Power supply choice"}</strong><small>{zh ? `已选择：${selectedPower}` : `Selected: ${selectedPower}`}</small></div><div className="colour-picker__options">{["NZ power supply", "Panel only"].map(option => <button key={option} className={selectedPower === option ? "active" : ""} onClick={() => setSelectedPower(option)}>{option}</button>)}</div></div>}
          <div className="colour-picker"><div><strong>{zh ? "颜色" : "Colour"}</strong><small>{zh ? `已选择：${selectedColor}` : `Selected: ${selectedColor}`}</small></div><div className="colour-picker__options">{(product.colors?.length ? product.colors : ["White", "Black"]).map(color => <button key={color} className={selectedColor === color ? "active" : ""} onClick={() => setSelectedColor(color)} aria-label={`${zh ? "选择" : "Select"} ${color}`}><i className={`colour-swatch colour-swatch--${color.toLowerCase()}`} />{color}</button>)}</div></div>
          <div className="purchase-row purchase-row--new">{product.priceOnRequest ? <Link className="button button--primary add-to-cart" to="/contact">{zh ? "获取报价" : "Request a quote"}</Link> : <><div className="quantity-stepper" aria-label={zh ? "数量" : "Quantity"}><span>{zh ? "数量" : "Quantity"}</span><div><button onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label={zh ? "减少数量" : "Decrease quantity"}>−</button><b>{quantity}</b><button onClick={() => setQuantity((current) => Math.min(99, current + 1))} aria-label={zh ? "增加数量" : "Increase quantity"}>+</button></div></div><button className="button button--primary add-to-cart" onClick={add}>{added ? (zh ? "✓ 已加入购物车" : "✓ Added to cart") : (zh ? "加入购物车" : "Add to cart")}</button></>}</div>
          {usesTiandyShortToggle && <div className="product-details-toggle" role="group" aria-label={zh ? "产品详情长度" : "Product detail length"}>
            <button type="button" className={detailLength === "short" ? "active" : ""} onClick={() => setDetailLength("short")}>{zh ? "简短版本" : "Short version"}</button>
            <button type="button" className={detailLength === "full" ? "active" : ""} onClick={() => setDetailLength("full")}>{zh ? "完整详情" : "Full details"}</button>
          </div>}
        </div>
      </section>
      {usesTiandyDetailedLayout && (!usesTiandyShortToggle || detailLength === "full") && <>
        <section className="product-overview product-overview--tiandy"><div><span className="eyebrow">{zh ? "产品概览" : "Product Overview"}</span><h2>{tiandyPageHeadings.overview}</h2></div><p>{tiandyLayoutContent!.overview}</p></section>
        <section className="key-features key-features--tiandy"><h2>{zh ? "主要能力" : "Capabilities"}</h2><ul>{tiandyLayoutContent!.capabilities.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>
        <section className="product-content-grid product-content-grid--tiandy"><article><span className="eyebrow">{zh ? "推荐应用" : "Recommended Applications"}</span><h2>{tiandyPageHeadings.recommended}</h2><ul>{tiandyLayoutContent!.recommendedApplications.map(([title, description]) => <li key={title}><strong>{title}</strong><span>{description}</span></li>)}</ul></article><article><span className="eyebrow">{tiandyPageHeadings.whyEyebrow}</span><h2>{tiandyPageHeadings.why}</h2><p>{tiandyLayoutContent!.why}</p></article></section>
        <section className="product-specifications"><div><h2>{zh ? "规格" : "Specifications"}</h2></div><dl>{tiandyLayoutContent!.specifications.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl></section>
        <section className="product-uses product-uses--tiandy"><span className="eyebrow">{zh ? "理想使用场景" : "Ideal Use Cases"}</span><h2>{tiandyPageHeadings.uses}</h2><div>{tiandyLayoutContent!.idealUseCases.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div></section>
      </>}
    </main>
  );
}
