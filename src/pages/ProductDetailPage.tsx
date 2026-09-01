import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductVisual } from "../components/ProductVisual";
import { useCart } from "../context/CartContext";
import { money } from "../lib/products";
import { localizeProduct } from "../lib/product-i18n";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/ProductContext";
import type { Product } from "../types";
import { Seo } from "../components/Seo";
import { alarmKitComponentDisplayName, alarmKitComponentIds, alarmPageHeadings, arrowheadKitIncludedItems, createAlarmDetailContent } from "../data/alarmProducts";

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

type AccessoryDetailContent = {
  descriptionTitle: string;
  description: string;
  features: Array<[string, string]>;
  specifications: Array<[string, string]>;
  applications: string[];
  installationNotes: string[];
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

const dahuaDetailedContent: Record<string, DetailedTiandyContent> = {
  "dahua-4k-turret": {
    descriptionTitle: "Dahua DH-IPC-HDW3667EM-S-IL-ANZ | 6MP WizSense Turret | Smart Dual Light | Built-in Mic | SMD 4.0 | IP67",
    description: "The Dahua DH-IPC-HDW3667EM-S-IL-ANZ delivers 6MP WizSense surveillance in a compact turret design, combining smart dual-light illumination with intelligent detection for residential and commercial security applications. Its fixed-focal lens provides broad coverage for entrances, driveways and other key monitoring areas, while the dual-light system normally uses infrared illumination for discreet night monitoring and switches to warm white light when movement is detected, providing clearer colour footage while helping deter unwanted activity. SMD 4.0 helps distinguish people and vehicles from general movement, while perimeter protection provides more targeted intrusion and tripwire detection. Equipped with a built-in microphone, Micro SD storage and PoE connectivity, the camera provides a practical combination of video, audio and flexible installation. Its IP67-rated housing and wide operating temperature range are designed for dependable outdoor performance in demanding environments.",
    features: [
      ["6MP High Resolution", "Captures sharp, detailed footage that helps preserve important visual information for identification and incident review."],
      ["Smart Dual Light", "Automatically changes from infrared to warm white illumination when movement is detected, providing clearer colour footage while helping deter unwanted activity."],
      ["SMD 4.0 AI Detection", "Uses intelligent analysis to distinguish people and vehicles from general movement, helping reduce irrelevant alerts and improve event accuracy."],
      ["Perimeter Protection", "Intrusion and tripwire detection help focus surveillance on defined areas and provide more meaningful security events."],
      ["Built-in Microphone", "Captures on-site audio alongside video, adding useful context to recorded incidents and activity."],
      ["IP67 Weatherproof", "Rugged construction protects the camera against dust, rain and harsh outdoor conditions for dependable long-term operation."],
    ],
    overview: "Combining 6MP imaging, Smart Dual Light and deep-learning AI, the Dahua DH-IPC-HDW3667EM-S-IL-ANZ is a WizSense turret camera designed for residential and commercial surveillance where clear evidence and intelligent event detection are important. Its 1/2.7-inch CMOS sensor produces up to 3288 × 1850 video at 25/30 fps, while the fixed-focal lens provides broad coverage for entrances, driveways and surrounding areas. The dual-light system normally uses infrared illumination for discreet night monitoring and switches to warm white light when movement is detected, bringing colour detail to important events while providing a visible deterrent. SMD 4.0 and perimeter protection help identify people and vehicles and focus detection on defined intrusion areas. AI Scene Self-Adaption automatically adjusts image parameters to suit changing scenes, while built-in audio, Micro SD support up to 512GB and PoE provide additional flexibility. With 120 dB WDR, IP67 protection and operation from -40°C to +60°C, the camera is built for demanding outdoor surveillance.",
    capabilities: [
      ["Smart Dual Light", "Uses infrared for discreet night monitoring, then changes to warm white light after motion to bring colour detail to activity and provide a visible deterrent."],
      ["SMD 4.0 Smart Detection", "Uses deep-learning analysis to distinguish people and vehicles from general motion, helping reduce unnecessary alarms and make events easier to review."],
      ["Perimeter Protection", "Configurable intrusion and tripwire functions monitor defined areas, with human and vehicle classification focusing events on relevant subjects."],
      ["AI Scene Self-Adaption", "Automatically adjusts image parameters according to scene conditions to help maintain consistent image quality as lighting changes."],
      ["120 dB WDR Imaging", "Preserves useful detail in strongly backlit scenes; 3D noise reduction and image processing support clearer footage in difficult conditions."],
      ["Local Storage and PoE", "Supports Micro SD cards up to 512GB for edge recording, with PoE and a network interface for straightforward connection to compatible NVRs and surveillance systems."],
    ],
    recommendedApplications: [
      ["Residential properties", "Suitable for driveways, entrances, garages, pathways and other residential areas requiring detailed day-and-night surveillance."],
      ["Retail and shopfronts", "Well suited to entrances, customer areas and external approaches where people and vehicles need to be distinguished from general movement."],
      ["Commercial buildings", "Intelligent detection, perimeter protection and reliable outdoor construction suit offices, warehouses and commercial premises."],
      ["Driveways and access points", "The broad viewing angle and dual-light illumination provide practical coverage of vehicle approaches and entry points."],
      ["Outdoor perimeter surveillance", "IP67 protection, WDR and intelligent event detection support monitoring where conditions can vary significantly."],
    ],
    why: "The DH-IPC-HDW3667EM-S-IL-ANZ combines detailed 6MP imaging with intelligent surveillance functions that go beyond basic motion recording. Its Smart Dual Light system keeps routine night monitoring discreet with infrared illumination, then switches to warm white light when movement is detected, helping capture important events in colour while providing a visible deterrent. The inclusion of SMD 4.0, perimeter protection, AI Scene Self-Adaption, built-in audio, Micro SD recording and PoE gives the camera a strong combination of image quality, intelligent detection and installation flexibility. Its IP67-rated metal housing and -40°C to +60°C operating range further support reliable deployment in demanding outdoor environments.",
    specifications: [
      ["Model", "DH-IPC-HDW3667EM-S-IL-ANZ"], ["Image sensor", '1/2.7" CMOS'], ["Maximum resolution", "3288 × 1850"], ["Maximum frame rate", "25/30 fps"], ["Lens", "2.8 mm / 3.6 mm fixed focal, M12 mount, F1.4"], ["Field of view", "2.8 mm: H 110° / V 58° / D 132°; 3.6 mm: H 86° / V 49° / D 100°"], ["Illumination", "IR up to 30 m; warm light up to 30 m"], ["Image enhancement", "120 dB WDR, 3D NR"], ["Smart functions", "SMD 4.0, intrusion/tripwire, AI Scene Self-Adaption, AcuPick"], ["Storage", "Micro SD up to 512GB; FTP / SFTP / NAS"], ["Audio", "Built-in microphone; PCM / G.711a / G.711Mu / G.726 / G.723"], ["Network", "RJ-45 10/100 Base-T; ONVIF Profile S / G / T / M; CGI"], ["Power", "12V DC / PoE 802.3af; maximum 9.5W via PoE"], ["Protection", "Metal housing, IP67; -40°C to +60°C; ≤95% RH"], ["Dimensions / weight", "105.5 mm × Ø122.0 mm; 0.53 kg"],
    ],
    idealUseCases: [
      ["Driveways and front entrances", "A broad fixed view covers approaching visitors and vehicles, while Smart Dual Light maintains discreet monitoring until movement is detected."],
      ["Residential perimeters", "SMD 4.0, perimeter protection and long-range illumination support practical monitoring of boundaries and access areas."],
      ["Retail and commercial entrances", "Human and vehicle classification helps focus attention on meaningful activity around entrances, parking areas and customer-facing spaces."],
      ["Warehouses and industrial areas", "The IP67 housing, WDR and intelligent detection suit demanding outdoor areas around commercial and industrial facilities."],
      ["High-risk outdoor areas", "Smart Dual Light, AI detection, local storage and wide-temperature operation support dependable intelligent event monitoring."],
    ],
  },
  "dahua-hdw3649": {
    descriptionTitle: "Dahua DH-IPC-HDW3649H-AS-PV-ANZ-S2 | 6MP Smart Dual Light Eyeball | 2.8mm / 3.6mm Lens | Active Deterrence | Built-in Mic & Speaker | 30m IR & Warm Light | IP67",
    description: "The Dahua DH-IPC-HDW3649H-AS-PV-ANZ-S2 delivers high-resolution 6MP surveillance with intelligent dual illumination and active deterrence in a robust fixed-focal eyeball design. Its 1/2.7-inch CMOS sensor produces detailed 3072 × 2048 video at up to 25/30 fps, while the built-in IR and warm-light illuminators provide illumination distances of up to 30 metres. Smart Dual Light normally uses infrared illumination for discreet night-time monitoring and activates the warm light when a target is detected, allowing full-colour recording of important events while reducing unnecessary light pollution. Built-in sound and light deterrence, including a speaker and red-and-blue warning lights, can provide a proactive response to unwanted activity. With human and vehicle classification, SMD 4.0, AcuPick, AI SSA, dual microphones, two-way talk, alarm I/O, Micro SD storage and PoE, it provides a comprehensive surveillance option for residential, commercial and outdoor applications.",
    features: [
      ["6MP High Resolution", "Uses a 1/2.7-inch CMOS image sensor and delivers up to 3072 × 2048 resolution at 25/30 fps for detailed surveillance footage."],
      ["Smart Dual Light", "Combines infrared and warm-light illumination, using IR for discreet night monitoring and changing to warm light when a target is detected for full-colour event recording."],
      ["Active Sound & Light Deterrence", "A built-in speaker and red-and-blue warning lights provide audible and visual deterrence when perimeter events occur."],
      ["Smart Human & Vehicle Detection", "Intrusion and tripwire functions classify people and vehicles to focus alerts on relevant targets."],
      ["SMD 4.0", "Uses intelligent algorithms to filter non-target objects such as animals and help reduce false alarms."],
      ["AcuPick Intelligent Search", "Works with compatible back-end devices to quickly search live and recorded video for people and motor-vehicle targets."],
      ["AI Scene Self-adaptation", "AI SSA automatically adjusts image parameters to better suit changing scene conditions."],
      ["Built-in Audio & Two-Way Talk", "Includes dual built-in microphones and a speaker, with audio input and output support for two-way communication."],
      ["30m Dual Illumination", "Provides up to 30 metres of infrared illumination and up to 30 metres of warm-light illumination."],
      ["120 dB WDR", "Improves image visibility where strong differences between bright and dark areas are present."],
      ["Flexible Video Coding", "Supports H.265, H.264 and smart or AI coding technologies to reduce bandwidth and storage requirements."],
      ["IP67 Protection", "The metal housing protects against dust and water for dependable outdoor operation."],
    ],
    overview: "Combining 6MP imaging, intelligent dual illumination and active deterrence, the Dahua DH-IPC-HDW3649H-AS-PV-ANZ-S2 is designed for surveillance applications where clear identification, smart detection and proactive security are important. It supports up to 3072 × 2048 resolution at 25/30 fps and uses a fixed-focal M12 lens available in 2.8 mm and 3.6 mm configurations for different general-monitoring coverage options. Smart Dual Light uses infrared illumination as the normal night-time lighting source and activates warm light when a target enters the monitored area, enabling full-colour footage of important events while keeping illumination off when not required. Both IR and warm light reach up to 30 metres. Intrusion and tripwire detection with human and vehicle classification are supported alongside SMD 4.0, AcuPick and AI SSA. The camera also provides 120 dB WDR, 3D NR, BLC, HLC, ROI, defogging and image rotation, plus a built-in speaker, red-and-blue warning lights, dual microphones, two-way talk, alarm I/O and local Micro SD storage up to 256GB. With 12V DC or PoE power, IP67 protection and operation from -40°C to +60°C, it suits a wide range of indoor and outdoor surveillance installations.",
    capabilities: [
      ["Smart Dual Light Night Vision", "IR provides discreet monitoring in normal conditions; warm light can activate after target detection for full-colour event recording, then switch back when activity leaves the monitored area."],
      ["Active Sound and Light Deterrence", "The integrated speaker and red-and-blue lights provide audible and visual warnings for perimeter events, with multiple built-in voice options and support for imported custom voice prompts."],
      ["6MP Image Quality", "The 1/2.7-inch CMOS sensor provides up to 3072 × 2048 resolution at 25/30 fps for detailed video monitoring and incident review."],
      ["Smart Human and Vehicle Detection", "Intrusion and tripwire functions classify people and vehicles, allowing security events to focus more accurately on relevant targets instead of general movement."],
      ["SMD 4.0", "Smart Motion Detection 4.0 classifies motion targets and filters non-target objects such as small and large animals; compatible AI NVRs can add AcuPick and Quick Pick search assistance."],
      ["AcuPick Intelligent Search", "Deep-learning algorithms work with compatible back-end devices to match people and motor vehicles in live and recorded video, helping users locate relevant targets more quickly."],
      ["AI Scene Self-adaptation", "AI SSA adjusts image parameters according to scene conditions to help maintain suitable image performance as lighting and environmental conditions change."],
      ["Built-in Audio and Two-Way Talk", "Dual built-in microphones, a speaker, audio input and output support on-site audio capture and two-way communication with compatible equipment."],
      ["Flexible Video Compression", "H.265, H.264, Smart H.265+, Smart H.264+ and AI H.265/H.264 coding are supported; AI coding can reduce bandwidth and storage demand while retaining useful image quality."],
      ["Weather-Resistant Construction", "The IP67-rated metal housing is designed for dust and water protection, with operation from -40°C to +60°C and up to 95% relative humidity."],
    ],
    recommendedApplications: [
      ["Residential properties", "Suitable for driveways, entrances, pathways, garages and property boundaries where high-resolution monitoring, smart detection and active deterrence are required."],
      ["Retail and shopfronts", "Useful around shop entrances, storefronts and surrounding areas where classification can identify relevant activity and active deterrence can respond to perimeter events."],
      ["Small commercial premises", "Detailed video, intelligent monitoring and two-way audio suit offices, warehouses, reception areas and similar commercial facilities."],
      ["Outdoor perimeter monitoring", "Smart Dual Light, 30m illumination, intelligent intrusion and tripwire detection, active deterrence and IP67 protection suit general perimeter security."],
      ["Driveways and vehicle areas", "Human and vehicle classification with 6MP imaging provides practical monitoring of approaching vehicles, parking areas and property access points."],
      ["PoE surveillance systems", "A practical option for compatible PoE switches, injectors or NVRs, delivering network connectivity and camera power through one Ethernet cable."],
    ],
    why: "The DH-IPC-HDW3649H-AS-PV-ANZ-S2 combines high-resolution 6MP imaging, intelligent detection, Smart Dual Light and active sound-and-light deterrence in one network camera. Rather than relying only on conventional infrared night vision, its dual illumination system can introduce warm light when a target is detected, providing full-colour event footage while keeping night-time lighting more discreet during normal conditions. Human and vehicle classification, SMD 4.0, AcuPick, AI SSA and perimeter protection provide multiple layers of intelligent monitoring. Built-in microphones and a speaker add audio monitoring and two-way communication, while local Micro SD storage provides an additional recording option. With 12V DC or PoE power, IP67 protection, a metal housing and operation from -40°C to +60°C, it is well suited to residential and commercial installations requiring reliable outdoor surveillance and active deterrence.",
    specifications: [
      ["Model", "DH-IPC-HDW3649H-AS-PV-ANZ-S2"], ["Camera type", "6MP Smart Dual Illumination Active Deterrence Fixed-focal Eyeball WizSense Network Camera"], ["Image sensor", '1/2.7-inch CMOS'], ["Maximum resolution", "3072 × 2048"], ["Frame rate", "Main stream 3072 × 2048 @ 1–25/30 fps"], ["Lens", "2.8 mm / 3.6 mm fixed focal; M12 mount; F1.0"], ["Field of view", "2.8 mm: H 97° / V 70° / D 128°; 3.6 mm: H 78° / V 58° / D 102°"], ["Minimum illumination", "Colour 0.005 lux @ F1.4, 30 IRE; B/W 0.0005 lux @ F1.4, 30 IRE; 0 lux with illuminator on"], ["Illumination", "1 × IR LED and 1 × warm light; up to 30 m each"], ["Image functions", "120 dB WDR, 3D NR, BLC, HLC, defog, 4 ROI areas, 4 privacy-masking areas, rotation 0° / 90° / 180° / 270°"], ["Video compression", "H.265 / H.264 / H.264H / H.264B / MJPEG; Smart H.265+ / Smart H.264+; AI H.265 / AI H.264"], ["Streams / bit rate", "3 streams; H.264 or H.265 3–16384 kbps"], ["Intelligent monitoring", "Intrusion and tripwire with human and vehicle classification; SMD 4.0; AcuPick; AI SSA"], ["Audio", "Built-in dual microphones and built-in speaker; PCM / G.711a / G.711Mu / G.726 / G.723; two-way talk supported"], ["Audio / alarm I/O", "1 × RCA audio input; 1 × RCA audio output; 1 × alarm input; 1 × alarm output"], ["Storage", "Micro SD up to 256GB, FTP, SFTP and NAS"], ["Network", "RJ-45 10/100 Base-T; ONVIF Profile S / G / T and CGI"], ["Power", "12V DC or PoE; 4.5W typical / 8.6W maximum at 12V DC; 5.8W typical / 10.1W maximum via PoE"], ["Operating conditions", "-40°C to +60°C; ≤95% RH"], ["Protection / casing", "IP67 metal housing"], ["Dimensions / weight", "Ø122.0 mm × 110.9 mm; 0.75 kg net / 0.92 kg gross"],
    ],
    idealUseCases: [
      ["Driveways and front entrances", "6MP imaging and intelligent human and vehicle detection provide detailed monitoring of visitors and approaching vehicles, while Smart Dual Light can provide full-colour video when activity is detected."],
      ["Residential perimeters", "Smart detection, infrared night vision and active deterrence suit monitoring property boundaries and outdoor access areas."],
      ["Retail and shopfronts", "Detailed footage of customer entrances, storefronts and surrounding areas is supported, while intelligent classification focuses attention on relevant activity."],
      ["Small commercial premises", "Built-in audio, two-way talk, intelligent monitoring and PoE connectivity make the camera suitable for offices, warehouses, reception areas and other commercial environments."],
    ],
  },
  "dahua-nvr4104": {
    descriptionTitle: "Dahua DHI-NVR4104HS-P-4KS3 | 4CH PoE NVR | 12MP | 4-Port PoE | 4K HDMI | 4CH SMD | 1HDD",
    description: "The Dahua DHI-NVR4104HS-P-4KS3 is a compact 4-channel PoE NVR designed for residential and small commercial surveillance systems where reliable recording and intelligent event detection are important. Supporting IP cameras up to 12MP, it provides the capacity to record detailed footage while its 80 Mbps incoming and recording bandwidth accommodates high-resolution camera streams. Four integrated PoE ports simplify installation by providing power and network connectivity directly to compatible cameras, while 4K HDMI output provides a clear local monitoring experience. Recorder-side SMD helps distinguish people and vehicles from general movement, reducing unnecessary events and making important activity easier to review. With a single HDD bay supporting up to 20TB, USB backup, mobile access and support for compatible third-party cameras, the NVR4104HS-P-4KS3 provides a flexible recording platform for compact Dahua surveillance systems.",
    features: [
      ["12MP Camera Support", "Accommodates high-resolution IP cameras for detailed surveillance footage and greater image clarity when reviewing events."],
      ["Integrated 4-Port PoE", "Provides power and network connectivity directly to compatible cameras, helping simplify cabling and installation."],
      ["4-Channel SMD", "Uses intelligent analysis to help distinguish people and vehicles from general movement, reducing false alarms and improving event relevance."],
      ["Efficient H.265+ Recording", "Helps reduce storage and bandwidth requirements, allowing recording resources to be used more efficiently."],
      ["4K HDMI Output", "Supports high-resolution local display for clearer live monitoring and easier review of recorded footage."],
      ["20TB HDD Support", "A single HDD bay supports high-capacity local storage, providing greater flexibility for longer recording retention."],
    ],
    overview: "Combining 4-channel recording with four integrated PoE ports, the Dahua DHI-NVR4104HS-P-4KS3 is a compact Lite Series recorder designed for small residential and commercial IP surveillance systems. It supports IP cameras up to 12MP and provides 80 Mbps of incoming and recording bandwidth with 60 Mbps outgoing bandwidth, giving it useful capacity for high-resolution camera streams. Its four PoE ports allow compatible cameras to receive power and network connectivity directly from the recorder, helping simplify installation without requiring a separate PoE switch. Recorder-side 4-channel SMD provides secondary filtering for human and motor-vehicle targets, helping reduce false alarms caused by environmental movement such as leaves, rain and changing lighting. The single HDD bay supports up to 20TB, while 4K HDMI output provides high-resolution local monitoring. With camera-side AI support, USB backup, mobile access and ONVIF interoperability, the DHI-NVR4104HS-P-4KS3 provides a practical combination of recording capacity, intelligent detection and installation simplicity in a compact enclosure.",
    capabilities: [
      ["4-Channel High-Resolution Recording", "Supports up to four IP camera channels with resolutions reaching 12MP, providing detailed surveillance capability in a compact recorder."],
      ["Integrated PoE Connectivity", "Four PoE ports deliver camera power and data from the recorder; Dahua specifies a 36W total output with up to 25.5W from an individual port."],
      ["SMD Smart Detection", "Recorder-side SMD provides secondary filtering for human and motor-vehicle targets to reduce events caused by leaves, rain and lighting changes."],
      ["Efficient Video Compression", "Supports Smart H.265+, H.265, Smart H.264+ and H.264 to reduce bandwidth and storage demand while maintaining useful image quality."],
      ["High-Resolution Local Monitoring", "HDMI and VGA outputs are provided, with HDMI supporting up to 3840 × 2160 for detailed local live view and playback."],
      ["Flexible AI Compatibility", "Connected cameras can contribute functions such as face detection, perimeter protection, SMD, people counting, stereo analysis and heat map where supported."],
    ],
    recommendedApplications: [
      ["Home CCTV systems", "Suitable for homes requiring up to four network cameras across entrances, driveways, garages, side access and backyard areas."],
      ["Small retail premises", "A practical option for shops, cafés and similar businesses requiring centralised recording across key areas."],
      ["Small offices", "The compact form factor and integrated PoE ports suit offices and smaller commercial premises where a dedicated recorder is preferred."],
      ["Driveway and entrance monitoring", "High-resolution camera support and SMD provide a useful combination for vehicle approaches, entrances and access points."],
      ["Small commercial surveillance", "PoE, intelligent filtering, local storage and remote access support small warehouses, workshops and similar sites."],
    ],
    why: "The DHI-NVR4104HS-P-4KS3 combines the main functions required for a compact IP surveillance system in a single recorder. Four integrated PoE ports simplify camera installation, while support for up to 12MP cameras provides room for high-resolution surveillance as system requirements increase. Recorder-side SMD adds intelligent event filtering without requiring a more complex recorder platform, while the 80 Mbps incoming and recording bandwidth provides useful capacity for high-resolution camera streams. With 4K HDMI output, a 20TB-capable HDD bay, camera-side AI support and third-party camera interoperability, it provides a strong balance of recording capacity, smart surveillance and straightforward installation for smaller CCTV systems.",
    specifications: [
      ["Model / series", "DHI-NVR4104HS-P-4KS3; NVR4-4KS3 Lite Series"], ["IP camera channels", "4"], ["Bandwidth", "80 Mbps incoming / 80 Mbps recording / 60 Mbps outgoing"], ["Supported resolution", "Up to 12MP"], ["Decoding", "Up to 1 × 12MP @ 30 fps, 2 × 8MP @ 30 fps, 4 × 4MP @ 30 fps"], ["Recorder AI", "4-channel SMD"], ["Video compression", "Smart H.265+ / H.265 / Smart H.264+ / H.264"], ["Display", "1 × HDMI up to 3840 × 2160; 1 × VGA"], ["PoE", "4 × RJ45 10/100 Mbps, IEEE 802.3af/at; 36W budget; 25.5W max per port"], ["Storage", "1 × SATA, up to 20TB"], ["USB", "2 × USB 2.0"], ["Interoperability", "ONVIF Profile T / S / G, CGI, SDK"], ["Mobile access", "iOS / Android"], ["Power / environment", "53V DC, 1.22A; <10W without HDD; -10°C to +55°C; 10%–93% RH"], ["Dimensions / weight", "260.0 × 232.5 × 47.6 mm; 0.87 kg net"],
    ],
    idealUseCases: [
      ["Home security", "A compact four-channel recorder for centralised recording and PoE connectivity across entrances, driveways and garages."],
      ["Small retail stores", "Supports several cameras centrally while SMD helps make event monitoring more focused."],
      ["Offices and small businesses", "Provides a compact surveillance platform for entrances, reception areas, offices and other small commercial spaces."],
      ["Driveways and vehicle areas", "When paired with suitable Dahua cameras, the NVR supports detailed monitoring of vehicles and access points while reducing irrelevant motion events."],
      ["Small PoE CCTV installations", "Four PoE ports, 12MP camera support, 4K HDMI output and a 20TB-capable HDD bay suit compact high-resolution IP systems."],
    ],
  },
  "dahua-hdw3867": {
    descriptionTitle: "Dahua DH-IPC-HDW3867EM-S-IL-ANZ | 8MP Smart Dual Light Eyeball | Human & Vehicle Detection | Built-in Mic | 30m IR & Warm Light | IP67 | PoE",
    description: "The Dahua DH-IPC-HDW3867EM-S-IL-ANZ is an 8MP Smart Dual Light fixed-focal eyeball camera designed for detailed residential and commercial surveillance. Its 1/2.7-inch CMOS sensor records up to 3840 × 2160 video, while the 2.8 mm or 3.6 mm fixed lens provides practical coverage of entrances, driveways, shopfronts and perimeter areas. Smart Dual Light combines infrared monitoring with warm-light illumination: it can remain discreet in infrared mode, then introduce warm light when a target is detected to capture a key event in colour and provide an active visual deterrent. Human and vehicle classification, SMD 4.0, AcuPick and AI Scene Self-adaptation support more relevant event handling and clearer operation across changing scenes. A built-in microphone, MicroSD storage up to 512GB, PoE and IP67 protection complete a capable outdoor IP camera solution.",
    features: [
      ["8MP High Resolution", "Records up to 3840 × 2160 video for detailed footage that supports identification and careful incident review."],
      ["Smart Dual Light", "Balances discreet infrared monitoring with warm-light colour recording and visual deterrence when a target is detected."],
      ["30m Night Illumination", "Provides both infrared and warm-light illumination up to 30 metres for practical day-and-night coverage."],
      ["Human & Vehicle Detection", "Classifies people and vehicles for more relevant intrusion and tripwire events."],
      ["SMD 4.0", "Filters non-target motion, including animals, to help reduce irrelevant alarms."],
      ["AcuPick Search", "Works with compatible back-end devices to locate people and motor-vehicle targets more efficiently."],
      ["Built-in Microphone", "Captures audio alongside video, adding useful context to recorded activity."],
      ["IP67 Outdoor Protection", "Protects the camera against dust, rain and challenging outdoor conditions."],
    ],
    overview: "The DH-IPC-HDW3867EM-S-IL-ANZ combines 8MP imaging with intelligent dual illumination for applications where detailed footage, reliable night performance and more meaningful events are important. Its 1/2.7-inch CMOS sensor supports up to 3840 × 2160 recording at 25/30 fps, while a 2.8 mm or 3.6 mm fixed-focal lens provides coverage for general surveillance areas. Smart Dual Light uses infrared illumination for low-profile night monitoring and can activate warm light when a target is detected, bringing colour detail to important activity while providing a visible deterrent. Both illumination modes reach up to 30 metres. Intelligent functions include human and vehicle classification for intrusion and tripwire rules, SMD 4.0 for reduced nuisance alarms, AcuPick target search and AI Scene Self-adaptation. The camera also includes 120 dB WDR, a built-in microphone, MicroSD storage up to 512GB and PoE. With an IP67-rated housing and operating range from -40°C to +60°C, it is suited to robust indoor or outdoor IP surveillance installations.",
    capabilities: [
      ["Smart Dual Light Night Vision", "Uses infrared illumination for discreet normal monitoring and warm light for colour detail and visible deterrence when a target is detected."],
      ["8MP 4K Imaging", "Captures high-resolution 3840 × 2160 footage for detailed general surveillance and event review."],
      ["Smart Human & Vehicle Detection", "Classifies people and vehicles for intrusion and tripwire events, helping focus attention on relevant activity."],
      ["SMD 4.0 Filtering", "Helps filter non-target movement, including animal activity, to make alerts more useful."],
      ["AcuPick and AI Scene Adaptation", "Supports efficient target searching with compatible back-end equipment and adapts image settings for changing scenes."],
      ["Enhanced Image Processing", "120 dB WDR and 3D noise reduction help retain useful detail in backlit and changing light conditions."],
      ["Built-in Audio and Local Storage", "The integrated microphone and MicroSD support up to 512GB provide useful audio context and flexible edge recording."],
      ["PoE Installation", "IEEE 802.3af PoE can provide both data and power through one compatible Ethernet connection."],
    ],
    recommendedApplications: [
      ["Residential properties", "A practical choice for driveways, entrances, garages and perimeter areas needing detailed day-and-night monitoring."],
      ["Retail and shopfronts", "Human and vehicle filtering supports more focused monitoring around customer entrances, approaches and external areas."],
      ["Commercial premises", "High-resolution coverage, smart events and IP67 protection suit offices, warehouses and business access points."],
      ["Outdoor perimeters", "Smart Dual Light, 30m illumination and weather protection support general perimeter security."],
      ["Driveways and vehicle areas", "The broad viewing options and target classification provide practical coverage of vehicles and access routes."],
    ],
    why: "The DH-IPC-HDW3867EM-S-IL-ANZ brings detailed 8MP recording, intelligent filtering and adaptable night visibility together in one compact turret camera. Smart Dual Light enables the camera to remain discreet with infrared illumination when appropriate, while warm light can bring a meaningful event into colour and help discourage unwanted activity. SMD 4.0, human and vehicle classification, AcuPick and AI Scene Self-adaptation add a more intelligent layer to routine monitoring. Built-in audio, MicroSD support, PoE and a durable IP67 housing make it a flexible choice for residential and commercial systems requiring reliable outdoor surveillance.",
    specifications: [
      ["Model", "DH-IPC-HDW3867EM-S-IL-ANZ"], ["Camera type", "8MP Smart Dual Light Fixed-focal Eyeball WizSense Network Camera"], ["Image sensor", "1/2.7-inch CMOS"], ["Maximum resolution", "3840 × 2160"], ["Frame rate", "Up to 25/30 fps"], ["Lens", "2.8 mm / 3.6 mm fixed focal"], ["Field of view", "2.8 mm: approximately 110° horizontal; 3.6 mm: approximately 86° horizontal"], ["Illumination", "IR up to 30 m; warm light up to 30 m"], ["AI functions", "Human and vehicle classification, SMD 4.0, intrusion/tripwire, AcuPick, AI Scene Self-adaptation"], ["Image functions", "120 dB WDR, 3D noise reduction"], ["Audio / storage", "Built-in microphone; MicroSD up to 512GB"], ["Video compression", "H.265 / H.264 and smart coding"], ["Network / power", "RJ-45 10/100 Base-T; IEEE 802.3af PoE or 12V DC"], ["Protection", "IP67; -40°C to +60°C"],
    ],
    idealUseCases: [
      ["Driveways and front entrances", "A broad fixed view with intelligent target filtering helps monitor arrivals and important access activity."],
      ["Residential perimeters", "Smart detection and adaptive night lighting provide practical coverage of boundary and access areas."],
      ["Retail and shopfronts", "High-resolution footage and people/vehicle classification support monitoring of customer-facing spaces."],
      ["Commercial access points", "PoE, local storage and IP67 protection suit offices, warehouses and outdoor approaches."],
      ["General outdoor surveillance", "Dual-light operation and robust protection support everyday monitoring across changing light and weather."],
    ],
  },
  "dahua-nvr4108": {
    descriptionTitle: "Dahua DHI-NVR4108HS-8P-4KS3 | 8-Channel NVR | 8-Port PoE | Up to 12MP Cameras | 1 SATA HDD up to 20TB | SMD Plus",
    description: "The Dahua DHI-NVR4108HS-8P-4KS3 is an eight-channel Lite Series network video recorder for IP systems that need centralised recording, integrated PoE and practical AI-assisted event handling. It supports compatible cameras up to 12MP and provides 160 Mbps incoming and recording bandwidth with 80 Mbps outgoing bandwidth. Eight built-in IEEE 802.3af/at PoE ports can provide camera power and network connectivity from the recorder, reducing the need for a separate PoE switch in many installations. Recorder-side SMD Plus and supported camera-side AI functions help make events more relevant, while 4K HDMI/VGA output, one SATA bay supporting up to 20TB, smart playback and remote access provide a complete local recording platform for homes, retail stores and commercial premises.",
    features: [
      ["8-Channel Recording", "Supports up to eight IP cameras for a centralised surveillance system with room to expand."],
      ["Up to 12MP Cameras", "Accommodates high-resolution compatible cameras for detailed live view and recorded footage."],
      ["160 Mbps Bandwidth", "Provides useful incoming and recording capacity for multiple high-resolution camera streams."],
      ["Integrated 8-Port PoE", "Powers and connects compatible cameras through the recorder, helping simplify installation."],
      ["SMD Plus", "Helps distinguish people and vehicles from general movement for more meaningful recorder-side events."],
      ["4K Local Display", "HDMI output supports high-resolution live viewing and playback on a compatible local monitor."],
      ["20TB HDD Support", "One SATA bay supports substantial local footage retention when fitted with a compatible hard drive."],
      ["Remote Management", "Supports practical live view, playback and configuration through compatible network and mobile tools."],
    ],
    overview: "The DHI-NVR4108HS-8P-4KS3 is a compact 1U Lite Series NVR designed for IP surveillance systems requiring up to eight cameras, integrated PoE and reliable local recording. It supports cameras up to 12MP and delivers 160 Mbps incoming and recording bandwidth, with 80 Mbps outgoing bandwidth when AI functions are disabled. Eight integrated IEEE 802.3af/at PoE ports can connect and power compatible cameras directly, with a 72W total PoE budget and up to 25.5W per port. The recorder can decode up to eight 1080p streams, while recorder-side SMD Plus helps identify people and vehicles and compatible cameras can contribute further AI functions such as perimeter protection and face detection. One SATA bay supports up to 20TB of local storage, while HDMI and VGA outputs support local monitoring. Smart playback, backup functions, ONVIF compatibility and remote management make it a practical central recording point for residential, retail and commercial IP systems.",
    capabilities: [
      ["Integrated Eight-Port PoE", "Connects and powers up to eight compatible cameras through the NVR, reducing separate adaptors and switch hardware."],
      ["High-Resolution Recording", "Supports up to 12MP camera input and 160 Mbps incoming bandwidth for detailed multi-camera surveillance."],
      ["SMD Plus Smart Events", "Recorder-side analysis helps distinguish people and vehicles from general motion to reduce irrelevant alarms."],
      ["Camera-Based AI Support", "Works with compatible cameras providing functions such as face detection, perimeter protection and people counting."],
      ["Flexible Decoding and Display", "Supports multi-channel 1080p decoding and HDMI/VGA local display for live view and playback."],
      ["Local Storage and Backup", "One SATA bay supports up to 20TB, with USB backup and smart playback tools for managing recorded footage."],
      ["Remote Management", "Supports network access, compatible mobile applications and ONVIF interoperability for flexible system operation."],
    ],
    recommendedApplications: [
      ["Residential CCTV systems", "Suitable for homes requiring several IP cameras across entrances, driveways, garages and outdoor areas."],
      ["Small businesses", "Provides centralised recording and integrated PoE for offices, retail stores and customer-facing spaces."],
      ["Warehouses and workshops", "Eight channels, local storage and intelligent events support coverage across access points and work areas."],
      ["High-resolution IP systems", "Supports compatible cameras up to 12MP and high bandwidth for detailed surveillance workflows."],
      ["PoE camera installations", "Integrated PoE ports simplify cabling where cameras can be connected directly to the recorder."],
    ],
    why: "The DHI-NVR4108HS-8P-4KS3 combines recording, storage, camera networking and power distribution in a single compact recorder. Its eight integrated PoE ports can simplify a medium-size installation, while support for up to 12MP cameras and 160 Mbps incoming bandwidth provides capacity for detailed IP surveillance. Recorder-side SMD Plus adds a useful intelligent filter for people and vehicles, and compatibility with camera-side AI gives a system room to grow. With 4K local output, one 20TB-capable SATA bay, smart playback and remote management, it is a capable option for users moving beyond a four-camera system.",
    specifications: [
      ["Model", "DHI-NVR4108HS-8P-4KS3"], ["Product type", "8-channel compact 1U Lite Network Video Recorder"], ["IP camera channels", "8"], ["Maximum camera resolution", "Up to 12MP"], ["Bandwidth", "160 Mbps incoming / 160 Mbps recording / 80 Mbps outgoing"], ["Decoding", "Up to 8 × 1080p streams"], ["Recorder AI", "SMD Plus for people and vehicle classification"], ["Video compression", "Smart H.265+ / H.265 / Smart H.264+ / H.264"], ["Display output", "HDMI and VGA; HDMI up to 4K"], ["PoE", "8 × RJ-45 10/100 Mbps; IEEE 802.3af/at; 72W total, 25.5W maximum per port"], ["Storage", "1 × SATA, up to 20TB"], ["Interoperability", "ONVIF and compatible third-party IP cameras"], ["Operating conditions", "-10°C to +55°C; 10%–93% RH"], ["Dimensions", "Approximately 260 × 232.5 × 47.6 mm"],
    ],
    idealUseCases: [
      ["Eight-camera home systems", "A practical NVR for covering multiple access points, driveways, garages and outdoor areas from one location."],
      ["Small retail and offices", "Integrated PoE and local recording suit shops, offices and reception areas requiring centralised surveillance."],
      ["Warehouses and workshops", "Provides scalable IP camera recording for work areas, entrances and perimeter locations."],
      ["4K and high-resolution systems", "The 12MP camera support and high bandwidth make it suitable for detailed IP camera deployments."],
      ["PoE-based installations", "Eight powered ports reduce installation complexity where cameras can connect directly to the NVR."],
    ],
  },
  "hikvision-2387": {
    descriptionTitle: "HIKVISION DS-2CD2387G2H-LISU/SL | 8MP ColorVu Turret | Smart Hybrid Light | 130 dB WDR | Human & Vehicle Classification | Two-Way Audio | IP67",
    description: "The Hikvision DS-2CD2387G2H-LISU/SL is an 8MP Smart Hybrid Light ColorVu fixed turret camera for detailed outdoor monitoring and active deterrence. Its 1/1.8-inch CMOS sensor and F1.0 aperture support 3840 × 2160 imaging, while ColorVu technology and 130 dB WDR help retain useful colour and detail in difficult low-light and backlit scenes. Smart Hybrid Light combines infrared and white-light illumination for adaptable after-dark coverage, and deep-learning human and vehicle classification helps make alerts more relevant. The camera includes a microphone, speaker, strobe light and alarm I/O for two-way audio and active warning, together with MicroSD storage up to 512GB, PoE and a metal IP67-rated enclosure for reliable recorder-based or standalone deployment.",
    features: [
      ["8MP High Resolution", "Captures 3840 × 2160 video for detailed surveillance across homes, businesses and outdoor access areas."],
      ["ColorVu Full-Colour Imaging", "Uses a large sensor and F1.0 aperture to retain useful colour detail in low-light environments."],
      ["Smart Hybrid Light", "Combines infrared and white-light illumination to adapt night monitoring to the scene and event requirements."],
      ["Human & Vehicle Classification", "Deep-learning analysis distinguishes people and vehicles from other movement to reduce irrelevant alerts."],
      ["130 dB WDR", "Helps preserve image detail where bright and dark areas exist in the same scene."],
      ["Two-Way Audio", "Built-in microphone and speaker support audio monitoring and real-time communication."],
      ["Active Strobe & Audio Warning", "Provides a visible and audible response to help deter unwanted activity."],
      ["MicroSD Storage", "Supports local recording to a MicroSD card up to 512GB."],
      ["IP67 Outdoor Rating", "Metal weather-resistant construction supports dependable use in exposed outdoor locations."],
    ],
    overview: "The DS-2CD2387G2H-LISU/SL combines 8MP ColorVu imaging, Smart Hybrid Light and intelligent event classification in a fixed-turret camera designed for outdoor day-and-night surveillance. Its 1/1.8-inch CMOS sensor captures 3840 × 2160 video and works with an F1.0 aperture to retain useful colour detail in low light. Smart Hybrid Light provides flexible illumination, using infrared or white light according to the monitoring mode and scene conditions. Human and vehicle classification helps focus security notifications on relevant activity, while 130 dB WDR supports difficult backlit scenes. The integrated microphone, speaker, strobe light and alarm I/O support audio capture, two-way communication and an active warning response. Local MicroSD storage up to 512GB, H.265+ compression, PoE and IP67 weather protection provide a balanced platform for residential and commercial surveillance.",
    capabilities: [
      ["ColorVu Low-Light Imaging", "The large 1/1.8-inch sensor and F1.0 aperture help retain vivid colour detail in low-light scenes."],
      ["Smart Hybrid Light", "Combines infrared and white-light illumination for flexible night monitoring and full-colour event visibility."],
      ["Human & Vehicle Detection", "Deep-learning classification filters events so alerts can focus on people and vehicles."],
      ["130 dB Wide Dynamic Range", "Balances high-contrast scenes, helping preserve useful detail where entrances or windows create strong backlight."],
      ["Active Strobe and Audio Warning", "The camera can provide visual and audible warnings in response to configured events."],
      ["Two-Way Audio", "An integrated microphone and speaker support on-site audio monitoring and communication."],
      ["Smart Events and Local Storage", "Supports event detection and MicroSD storage up to 512GB for flexible edge recording."],
      ["PoE Connectivity", "PoE allows compatible network data and power to be delivered through one Ethernet cable."],
    ],
    recommendedApplications: [
      ["Residential properties", "High-resolution full-colour monitoring suits driveways, entrances, garages and outdoor residential areas."],
      ["Retail shopfronts", "Smart events, active warning and two-way audio support customer-facing entrances and surrounding areas."],
      ["Offices and commercial sites", "Human and vehicle classification provides focused monitoring of access points and parking approaches."],
      ["Outdoor perimeter security", "Smart Hybrid Light, IP67 protection and active deterrence suit boundary and access-area monitoring."],
      ["Parking and vehicle areas", "8MP footage and people/vehicle filtering support detailed monitoring of vehicles and visitor activity."],
    ],
    why: "The DS-2CD2387G2H-LISU/SL offers more than basic high-resolution recording. ColorVu imaging and Smart Hybrid Light provide flexible night visibility, while 130 dB WDR helps manage challenging lighting at entrances and other contrast-heavy scenes. Human and vehicle classification makes events more useful, and the built-in microphone, speaker and strobe light provide audio context, two-way communication and immediate active deterrence. With local storage, PoE and IP67 construction, it gives homes and businesses a practical 8MP camera for detailed outdoor protection.",
    specifications: [
      ["Model", "DS-2CD2387G2H-LISU/SL"], ["Camera type", "8MP Smart Hybrid Light with ColorVu Fixed Turret Network Camera"], ["Image sensor", "1/1.8-inch CMOS"], ["Maximum resolution", "3840 × 2160"], ["Lens", "2.8 mm / 4 mm fixed focal, F1.0"], ["Field of view", "2.8 mm: approximately 108.8° horizontal; 4 mm: approximately 93.3° horizontal"], ["Supplement light", "Smart Hybrid Light; up to 30m"], ["WDR", "130 dB"], ["AI detection", "Human and vehicle classification; smart events"], ["Audio / alarm", "Built-in microphone and speaker; active strobe and audio warning; alarm I/O"], ["Storage", "MicroSD up to 512GB"], ["Video compression", "H.265+ / H.265 / H.264+ / H.264"], ["Power", "PoE or 12V DC"], ["Protection", "Metal housing, IP67; -30°C to +60°C"],
    ],
    idealUseCases: [
      ["Driveways and front entrances", "ColorVu and Smart Hybrid Light provide detailed monitoring of people, visitors and vehicles after dark."],
      ["Residential perimeters", "Intelligent filtering and active deterrence help make boundary monitoring more focused and responsive."],
      ["Retail and shopfronts", "Two-way audio, strobe warning and high-resolution video suit customer entrances and external approaches."],
      ["Small commercial premises", "The camera is well suited to offices, warehouses and outdoor access points requiring dependable day-and-night surveillance."],
      ["General outdoor coverage", "IP67 protection, local storage and PoE suit robust recorder-based or standalone installations."],
    ],
  }
};


const accessoryDetailedContent: Record<string, AccessoryDetailContent> = {
  "dahua-pfb2204w": {
    descriptionTitle: "Dahua DH-PFB2204W | Wall Mount Bracket | SGCC + Aluminium Alloy | White",
    description: "The Dahua DH-PFB2204W is a wall mount bracket designed to provide secure and reliable installation for compatible Dahua cameras. Constructed from SGCC and aluminium alloy, it combines a durable structure with a clean white finish for straightforward wall-mounted installations. Its 1.0 kg load-bearing capacity and -40°C to +60°C operating range make it suitable for compatible camera installations across residential, commercial and other surveillance environments.",
    features: [
      ["Durable Construction", "SGCC and aluminium alloy construction provides a practical, robust mounting solution."],
      ["Clean White Finish", "The white finish supports a neat, professional appearance in visible camera installations."],
      ["Wall-Mounted Design", "Designed for straightforward wall mounting of compatible Dahua cameras."],
      ["1.0 kg Load Bearing", "Supports camera and accessory loads up to 1.0 kg when installed on a suitable mounting surface."],
      ["Wide Operating Range", "Designed for reliable use from -40°C to +60°C."],
      ["Installation Hardware Included", "Package includes mounting screws, anchors and an S3.0 installation wrench."],
    ],
    specifications: [
      ["Model", "DH-PFB2204W"], ["Product type", "Wall Mount Bracket"], ["Material", "SGCC + Aluminium Alloy"], ["Colour", "White"], ["Dimensions", "162.0 × 129.4 × 80.0 mm"], ["Net / gross weight", "0.49 kg / 0.57 kg"], ["Load bearing", "1.0 kg"], ["Installation", "Wall mount"], ["Operating conditions", "-40°C to +60°C; <90% RH"], ["Storage conditions", "-40°C to +60°C; 10%–90% RH"], ["Anti-corrosion level", "Basic Protection"], ["Packaging dimensions", "172.0 × 137.0 × 86.0 mm"],
    ],
    applications: ["Wall mounting of compatible Dahua cameras", "Residential CCTV installations", "Retail stores and offices", "Warehouses and commercial premises", "Outdoor building and perimeter surveillance", "Installations requiring a secure wall-mounted camera position"],
    installationNotes: ["Confirm that the selected camera is compatible with the PFB2204W before installation.", "Ensure the wall or mounting surface can safely support the bracket and camera.", "Do not exceed the 1.0 kg load-bearing capacity.", "Use mounting hardware suitable for the particular wall surface.", "The package includes one bracket, four M4×10 screws, four ST4×25 screws, four plastic anchors and an S3.0 wrench."],
  },
  "dahua-pfa130": {
    descriptionTitle: "Dahua DH-PFA130-E | Waterproof Junction Box | Aluminium Alloy | IP66",
    description: "The Dahua DH-PFA130-E is a waterproof junction box designed to provide a neat and practical mounting and cable-management solution for compatible Dahua cameras. Constructed from aluminium alloy with a white finish, it provides a durable enclosure for organising camera cabling while maintaining a clean installation appearance. Bottom and side cable outlets support flexible cable routing, while IP66 protection, a 3.0 kg load-bearing capacity and a -40°C to +60°C operating range suit a variety of indoor and outdoor surveillance applications.",
    features: [
      ["Aluminium Alloy Construction", "Durable aluminium alloy construction provides a practical enclosure for compatible camera installations."],
      ["IP66 Protection", "The enclosure is designed to protect against dust and water in suitable outdoor installations."],
      ["Cable Management", "Bottom and side cable outlets help organise and route camera cabling neatly."],
      ["3.0 kg Load Bearing", "Supports attached equipment up to 3.0 kg when fitted to a suitable mounting surface."],
      ["G3/4 Thread", "Provides a G3/4 screw thread for compatible installation arrangements."],
      ["Wide Operating Range", "Designed for use from -40°C to +60°C."],
    ],
    specifications: [
      ["Model", "DH-PFA130-E"], ["Product type", "Waterproof Junction Box"], ["Material", "Aluminium Alloy"], ["Colour", "White"], ["Dimensions", "Ø124.3 × 41.0 mm"], ["Net / gross weight", "0.34 kg / 0.40 kg"], ["Load bearing", "3.0 kg"], ["Installation", "Junction mount"], ["Screw thread", "G3/4"], ["Protection", "IP66"], ["Operating conditions", "-40°C to +60°C; <90% RH"], ["Storage conditions", "-40°C to +60°C; 10%–90% RH"], ["Anti-corrosion level", "Basic Protection"], ["Packaging dimensions", "146 × 65 × 147 mm"],
    ],
    applications: ["Junction and cable management for compatible Dahua cameras", "Indoor and outdoor CCTV installations", "Residential security systems", "Retail stores and commercial premises", "Warehouses and industrial environments", "Camera installations requiring protected and organised cable routing"],
    installationNotes: ["Confirm camera compatibility before installation.", "Ensure the mounting surface is stable and suitable for the junction box and attached equipment.", "Do not exceed the 3.0 kg load-bearing capacity.", "Use anchors and mounting hardware suitable for the installation surface.", "The box includes one waterproof junction box, four M4×10 screws, three ST4×25 screws, three plastic anchors, an S3.0 wrench and a mounting sticker."],
  },
};

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


const pdfDetailedProductContent: Record<string, DetailedTiandyContent> = {
  "curated-hilook-t289": {
    descriptionTitle: "HiLook IPC-T289H-MU/SL | 8MP Smart Hybrid Light Turret | 2.8mm / 4mm Lens | Human & Vehicle Classification | Dual Microphone & Speaker | 30m Illumination | IP67 | PoE",
    description: "The HiLook IPC-T289H-MU/SL is an 8MP fixed turret network camera designed for detailed surveillance with flexible night-time illumination and intelligent security functions. Its 1/2.8-inch Progressive Scan CMOS sensor produces up to 3840 × 2160 video, while 2.8 mm and 4 mm lens options allow the viewing angle to suit the monitored area. Smart Hybrid Light provides IR-only, white-light-only and smart illumination modes, so routine monitoring can remain discreet while important activity can be recorded with additional colour detail. Human and vehicle classification helps concentrate attention on relevant events, and the built-in dual microphone array, speaker, red-and-blue strobe light and audible warning provide audio capture, two-way communication and active deterrence. H.265+ compression, local microSD storage up to 512GB, PoE and IP67 protection make it suitable for residential, commercial and exposed outdoor locations.",
    features: [["8MP 4K Resolution", "Captures up to 3840 × 2160 footage for detailed monitoring and clearer review of people, vehicles and important scene activity."], ["Smart Hybrid Light", "Offers IR, white-light and smart supplementary-light modes to balance discreet night monitoring with colour visibility when it is needed."], ["Human & Vehicle Classification", "Helps distinguish people and vehicles from general movement, making security events more relevant."], ["Dual Microphone & Speaker", "Supports improved audio pickup, two-way communication and audible warning functions."], ["Active Strobe & Audio Alarm", "Red-and-blue flashing light and a configurable audible warning can provide a proactive deterrent."], ["120 dB WDR", "Maintains useful detail in backlit scenes with strong differences between bright and dark areas."], ["512GB Local Storage", "Supports on-board microSD recording for local retention of footage."], ["IP67 & PoE", "Provides weather-resistant outdoor protection and straightforward single-cable power and network connection."]],
    overview: "Combining 8MP 4K imaging, Smart Hybrid Light and active deterrence, the IPC-T289H-MU/SL is a fixed turret camera for homes and businesses that need detailed day-and-night monitoring. The 1/2.8-inch CMOS sensor delivers up to 3840 × 2160 resolution, while the fixed F1.6 lens is available in 2.8 mm and 4 mm options for wider or more focused general-purpose coverage. Smart Hybrid Light offers three practical modes: infrared-only monitoring, continuous white-light illumination or smart light control that uses IR normally and activates white light when a person or vehicle event occurs. Human and vehicle classification, line crossing, intrusion, region entrance and region exiting detection help focus events on relevant activity. A dual-microphone array, speaker, red-and-blue flashing light and audible alarm add audio capture, real-time communication and active deterrence. With H.265+ compression, microSD support up to 512GB, PoE and IP67 protection, it is a capable option for outdoor residential and commercial surveillance.",
    capabilities: [["Smart Hybrid Light Modes", "Choose infrared-only, white-light-only or smart illumination control to match the site and preferred night-time response."], ["8MP 4K Imaging", "Captures detailed 3840 × 2160 footage for identification and incident review."], ["Human and Vehicle Classification", "Uses target classification to make line-crossing, intrusion and region events more relevant."], ["Active Sound and Light Deterrence", "The built-in speaker and red-and-blue strobe can respond to configured events with audible and visual warnings."], ["120 dB True WDR", "Helps retain image detail at entrances, windows and other locations affected by strong backlighting."], ["Dual-Microphone Audio", "Arrayed microphones improve sound pickup, while the speaker supports two-way audio and remote warnings."], ["Local Storage and Compression", "H.265+ and microSD support up to 512GB help manage bandwidth and local recording."], ["PoE Outdoor Installation", "IEEE 802.3at PoE combines power and network data through one Ethernet cable; IP67 protection supports exposed locations."]],
    recommendedApplications: [["Driveways and front entrances", "The 2.8 mm option provides broad coverage of visitors and approaching vehicles, with flexible illumination after dark."], ["Residential perimeters", "Smart Hybrid Light, target classification and active deterrence provide practical monitoring around the home."], ["Retail and shopfronts", "4K footage, WDR and sound-and-light warnings suit customer entrances and external approaches."], ["Commercial premises", "Two-way audio, intelligent perimeter events and local storage support offices, warehouses and outdoor access points."], ["Backlit outdoor areas", "120 dB WDR helps maintain useful image detail where bright and shadowed areas are present."]],
    why: "The IPC-T289H-MU/SL combines high-resolution 8MP imaging with adaptable Smart Hybrid Light, intelligent classification and active deterrence in a compact turret design. It can operate discreetly in IR mode for routine monitoring, deliver full-colour visibility where required, or automatically use white light after a meaningful event. The combination of 120 dB WDR, dual microphones, speaker, strobe light, local storage, PoE and IP67 protection makes it a flexible choice for sites that need both detailed recording and proactive security response.",
    specifications: [["Model", "IPC-T289H-MU/SL"], ["Camera type", "8MP Smart Hybrid Light Active Deterrence Fixed Turret Network Camera"], ["Image sensor", "1/2.8-inch Progressive Scan CMOS"], ["Maximum resolution", "3840 × 2160"], ["Lens options", "2.8 mm / 4 mm fixed focal, F1.6"], ["Supplementary light", "IR and white light; up to 30m illumination"], ["Image enhancement", "120 dB true WDR, BLC, HLC, 3D DNR"], ["Smart events", "Human / vehicle classification; line crossing, intrusion, region entrance and exiting"], ["Audio", "Built-in dual microphone array and speaker; two-way audio"], ["Deterrence", "Red-and-blue strobe and audible warning, speaker up to 110 dB at 10 cm"], ["Storage", "microSD / microSDHC / microSDXC up to 512GB"], ["Video compression", "H.265+ / H.265 / H.264+ / H.264 / MJPEG"], ["Power", "12V DC / PoE IEEE 802.3at"], ["Protection", "IP67; -30°C to +60°C; ≤95% RH"], ["Dimensions / weight", "Ø127.3 × 96.3 mm; approx. 590 g net"]],
    idealUseCases: [["Home driveways", "Detailed 4K imaging and adaptive illumination provide coverage of approaching visitors and vehicles."], ["Front doors and walkways", "WDR, audio and active deterrence support monitoring around common access points."], ["Retail shopfronts", "Human and vehicle classification helps focus security events around storefronts and entrances."], ["Commercial external areas", "IP67 protection and sound-and-light warnings suit outdoor approaches, loading areas and perimeters."], ["Backlit entries", "True WDR helps retain useful image information where windows, sun or bright exterior light affect the scene."]],
  },
  "curated-hikvision-2386": {
    descriptionTitle: "HIKVISION DS-2CD2386G2-ISU/SL | 8MP AcuSense Turret | Strobe & Audible Warning | Two-Way Audio | 30m IR | IP67",
    description: "The HIKVISION DS-2CD2386G2-ISU/SL is an 8MP fixed turret network camera for residential, commercial and outdoor surveillance applications requiring detailed recording and active deterrence. Its DarkFighter imaging technology and 1/1.8-inch CMOS sensor provide up to 3840 × 2160 resolution, while 2.8 mm and 4 mm lens options support a suitable field of view for the monitored area. AcuSense deep-learning technology classifies human and vehicle targets, helping reduce irrelevant alarms from general movement. Intelligent perimeter protection supports line crossing, intrusion, region entrance and region exiting detection, while the built-in strobe light, audible alarm, microphone and speaker provide active warning and two-way audio. With microSD storage up to 256GB, 30m IR, H.265+ compression, PoE and IP67-rated metal construction, it is a practical solution for dependable high-resolution security coverage.",
    features: [["8MP 4K Resolution", "Provides up to 3840 × 2160 resolution for detailed surveillance footage."], ["DarkFighter Low-Light Imaging", "Helps produce useful images in low-light outdoor scenes."], ["AcuSense Detection", "Classifies people and vehicles to reduce irrelevant alarm events."], ["Intelligent Perimeter Protection", "Supports line crossing, intrusion, region entrance and region exiting detection for selected target types."], ["Active Strobe & Audible Alarm", "Provides visible and audible warnings to help deter unwanted activity."], ["Two-Way Audio", "Built-in microphone and speaker allow real-time communication and event-linked audio response."], ["30m IR Night Vision", "Supports clear black-and-white monitoring after dark."], ["IP67 Protection", "Metal housing and weather-resistant protection suit exposed outdoor installation."]],
    overview: "The DS-2CD2386G2-ISU/SL combines 8MP 4K imaging, DarkFighter low-light performance and AcuSense classification in a compact fixed turret camera. Its 1/1.8-inch CMOS sensor captures up to 3840 × 2160 video, while 2.8 mm and 4 mm F1.6 lens options provide a choice of broad or more focused coverage. AcuSense deep learning classifies people and vehicles for perimeter events including line crossing, intrusion, region entrance and region exiting, helping focus security notifications on relevant subjects. The camera also provides active deterrence through an integrated strobe light and audible alarm, while built-in two-way audio enables real-time communication. Local microSD storage up to 256GB, H.265+ compression, 30m IR, 120 dB WDR and IEEE 802.3af PoE provide useful installation and recording flexibility. With a metal housing and IP67 protection, it is suited to demanding residential and commercial outdoor monitoring.",
    capabilities: [["DarkFighter Low-Light Imaging", "Helps maintain usable image detail for outdoor areas that require monitoring after dark."], ["8MP 4K Imaging", "Provides detailed 3840 × 2160 footage for reviewing people, vehicles and incident activity."], ["AcuSense Human and Vehicle Classification", "Distinguishes relevant targets from other motion to improve the efficiency of security events."], ["120 dB True WDR", "Helps retain detail in scenes containing strong differences between bright and dark areas."], ["Perimeter Protection", "Line crossing, intrusion, region entrance and exiting events can be configured for human and vehicle targets."], ["Active Strobe and Audio Warning", "The built-in strobe and audible alarm can provide a proactive response to configured events."], ["Two-Way Audio and Local Storage", "An integrated microphone, speaker and microSD support up to 256GB provide communication and edge recording."], ["PoE and IP67", "Supports straightforward network installation and dependable outdoor operation."]],
    recommendedApplications: [["Residential properties", "Suitable for driveways, entrances, pathways, garages and other areas requiring high-resolution coverage."], ["Retail and shopfronts", "AcuSense and active deterrence suit storefronts, customer entrances and nearby approaches."], ["Commercial premises", "Two-way audio, perimeter protection and onboard storage suit offices, warehouses and reception areas."], ["Outdoor perimeters", "30m IR, WDR and IP67 protection support dependable monitoring around building edges."], ["Backlit access points", "True WDR helps preserve useful footage around bright entrances and windows."]],
    why: "The DS-2CD2386G2-ISU/SL combines 8MP image quality with DarkFighter low-light performance, AcuSense classification and active sound-and-light deterrence. It is designed for installations that need more than basic motion recording: perimeter events can focus on people and vehicles, while the strobe, audible warning and two-way audio provide a more proactive response. Local storage, PoE and IP67 construction complete a practical feature set for detailed outdoor security coverage.",
    specifications: [["Model", "DS-2CD2386G2-ISU/SL"], ["Camera type", "8MP AcuSense Strobe Light and Audible Warning Fixed Turret Network Camera"], ["Image sensor", "1/1.8-inch Progressive Scan CMOS"], ["Maximum resolution", "3840 × 2160"], ["Lens options", "2.8 mm / 4 mm fixed focal, F1.6"], ["Field of view", "2.8 mm: H 111° / V 59° / D 131°; 4 mm: H 87° / V 47° / D 102°"], ["IR distance", "Up to 30m"], ["Image enhancement", "120 dB WDR, BLC, HLC, 3D DNR"], ["Smart functions", "AcuSense human / vehicle classification and perimeter protection"], ["Audio / deterrence", "Built-in microphone and speaker, two-way audio, strobe and audible warning"], ["Storage", "microSD up to 256GB"], ["Power", "12V DC / PoE IEEE 802.3af Class 3"], ["Housing / protection", "Metal, IP67; -30°C to +60°C; ≤95% RH"]],
    idealUseCases: [["Driveways and front entrances", "The 2.8 mm lens supports broad coverage while AcuSense and active deterrence focus attention on meaningful activity."], ["Residential perimeters", "DarkFighter low-light performance, 30m IR and intelligent perimeter protection support practical outdoor monitoring."], ["Retail and shopfronts", "High-resolution imaging, WDR and classification suit retail entrances and storefronts."], ["Commercial premises", "Two-way audio and active deterrence add security functions for offices, warehouses and commercial properties."], ["Outdoor building approaches", "IP67 protection and 8MP detail suit exposed locations around access routes and entrances."]],
  },
  "curated-hikvision-2366": {
    descriptionTitle: "HIKVISION DS-2CD2366G2-ISU/SL | 6MP AcuSense Turret | Strobe & Audible Warning | Two-Way Audio | 30m IR | IP67",
    description: "The HIKVISION DS-2CD2366G2-ISU/SL is a 6MP fixed turret network camera combining DarkFighter low-light imaging, AcuSense human and vehicle classification and active deterrence in a compact outdoor-ready design. Its 1/2.4-inch CMOS sensor delivers up to 3200 × 1800 resolution, while 2.8 mm, 4 mm and 6 mm fixed-lens options allow coverage to be matched to the monitored scene. 120 dB true WDR, BLC, HLC and 3D DNR help maintain usable images in backlit and difficult lighting conditions. AcuSense perimeter protection can trigger line crossing, intrusion, region entrance and region exiting events for selected human and vehicle targets. A built-in strobe light, audible alarm, microphone and speaker provide active deterrence and two-way audio, while local microSD storage, 30m IR, H.265+ compression, PoE and IP67 protection support flexible outdoor surveillance.",
    features: [["6MP High Resolution", "Captures up to 3200 × 1800 footage for detailed monitoring and incident review."], ["DarkFighter Low-Light Imaging", "Supports useful surveillance images in low-light outdoor environments."], ["AcuSense Classification", "Uses deep learning to classify people and vehicles and reduce irrelevant events."], ["120 dB True WDR", "Helps retain image information when strong backlighting or brightness differences are present."], ["Active Strobe & Audible Alarm", "Provides visible and audible deterrence in response to configured events."], ["Two-Way Audio", "Built-in microphone and speaker support real-time communication and remote warnings."], ["30m IR", "Provides black-and-white night monitoring in low-light and complete-darkness conditions."], ["IP67 Outdoor Rating", "Weather-resistant construction supports reliable installation in exposed outdoor locations."]],
    overview: "Combining 6MP imaging, DarkFighter low-light capability and AcuSense deep-learning functions, the DS-2CD2366G2-ISU/SL is designed for detailed outdoor surveillance with active deterrence. The 1/2.4-inch CMOS sensor delivers up to 3200 × 1800 resolution, with 2.8 mm, 4 mm and 6 mm fixed-lens options giving installers flexibility in selecting a field of view. 120 dB true WDR, BLC, HLC and 3D DNR support image visibility at entrances, windows and other scenes affected by difficult lighting. AcuSense human and vehicle classification improves the relevance of line-crossing, intrusion, region entrance and region exiting events. The integrated strobe light, audible alarm and two-way audio create a more proactive security response, while microSD storage up to 256GB, H.265+ compression, 30m IR and PoE provide practical recording and deployment options. Its metal housing and IP67 protection make it suitable for residential, commercial and outdoor surveillance applications.",
    capabilities: [["DarkFighter Low-Light Imaging", "Helps maintain useful surveillance images in environments with limited ambient light."], ["6MP Image Quality", "The 1/2.4-inch CMOS sensor captures up to 3200 × 1800 resolution for detailed monitoring."], ["Human and Vehicle Classification", "AcuSense deep learning classifies relevant targets to reduce unnecessary alarms and improve detection efficiency."], ["120 dB True WDR", "Maintains visibility in scenes with strong backlighting and significant brightness differences."], ["Intelligent Perimeter Protection", "Supports line crossing, intrusion, region entrance and region exiting detection for people and vehicles."], ["Active Strobe and Audio Warning", "Built-in visual and audible warnings can help deter intruders after configured events."], ["Two-Way Audio", "The integrated microphone and speaker provide real-time communication and remote audible warnings."], ["Local Storage and Outdoor Protection", "Supports microSD storage up to 256GB, 30m IR, PoE and IP67 protection."]],
    recommendedApplications: [["Driveways and front entrances", "The 2.8 mm lens provides broad coverage while AcuSense and active deterrence improve security around access points."], ["Residential perimeters", "DarkFighter low-light performance, 30m IR and perimeter protection provide practical outdoor monitoring."], ["Retail and shopfronts", "6MP imaging, WDR and human and vehicle classification suit retail entrances and storefronts."], ["Commercial premises", "Two-way audio and active deterrence provide extra security functions for offices, warehouses and commercial properties."], ["Backlit outdoor areas", "120 dB WDR helps retain useful detail around windows, bright entrances and variable-light scenes."]],
    why: "The DS-2CD2366G2-ISU/SL combines detailed 6MP imaging with AcuSense classification, DarkFighter low-light capability and active deterrence in a compact turret camera. It provides configurable perimeter events, audible and visual warning, two-way audio and local storage in addition to everyday recording. With flexible lens choices, PoE, 30m IR and IP67 protection, it is a versatile option for residential and commercial installations that need dependable outdoor security coverage.",
    specifications: [["Model", "DS-2CD2366G2-ISU/SL"], ["Camera type", "6MP AcuSense Strobe Light and Audible Warning Fixed Turret Network Camera"], ["Image sensor", "1/2.4-inch Progressive Scan CMOS"], ["Maximum resolution", "3200 × 1800"], ["Lens options", "2.8 mm / 4 mm / 6 mm fixed focal, F1.6"], ["IR distance", "Up to 30m"], ["Image enhancement", "120 dB WDR, BLC, HLC, 3D DNR"], ["Smart functions", "AcuSense human / vehicle classification and perimeter protection"], ["Audio / deterrence", "Built-in microphone and speaker, two-way audio, strobe and audible warning"], ["Storage", "microSD up to 256GB"], ["Compression", "H.265+ / H.265 / H.264+ / H.264 / MJPEG"], ["Power", "12V DC / PoE IEEE 802.3af"], ["Housing / protection", "Metal, IP67; -30°C to +60°C; ≤95% RH"]],
    idealUseCases: [["Home entrances", "AcuSense and active deterrence help monitor visitors and activity at common entry points."], ["Residential boundaries", "DarkFighter low-light performance and 30m IR support perimeter monitoring after dark."], ["Retail access areas", "Detailed imaging and intelligent events support monitoring at customer-facing entrances."], ["Commercial exterior areas", "Audio warning, two-way communication and IP67 construction suit warehouses and building approaches."], ["Variable-light scenes", "True WDR helps preserve relevant image detail in backlit or high-contrast locations."]],
  },
  "curated-hikvision-2367": {
    descriptionTitle: "HIKVISION DS-2CD2367G2H-LISU/SL | 6MP Smart Hybrid Light ColorVu Turret | Strobe & Audio Warning | Two-Way Audio | IP67",
    description: "The HIKVISION DS-2CD2367G2H-LISU/SL is a 6MP Smart Hybrid Light ColorVu fixed turret network camera designed for detailed full-colour surveillance, intelligent event detection and active deterrence. Its 1/1.8-inch CMOS sensor delivers up to 3200 × 1800 resolution and uses an F1.0 fixed lens in 2.8 mm and 4 mm options to capture useful colour images in very low light. Smart Hybrid Light combines IR and white-light illumination with intelligent supplementary-light control, allowing routine monitoring to remain discreet while important human or vehicle events can trigger additional white-light visibility. 130 dB WDR, deep-learning classification and intelligent perimeter protection improve image quality and event relevance, while a strobe light, audible alarm, microphone and speaker provide active deterrence and two-way audio. With microSD storage up to 512GB, PoE and IP67 protection, it is suited to residential, commercial and exposed outdoor installations.",
    features: [["6MP ColorVu Imaging", "Provides up to 3200 × 1800 resolution and full-colour imaging in low-light scenes."], ["Smart Hybrid Light", "Combines IR and white-light illumination with intelligent supplementary-light control."], ["130 dB WDR", "Improves visibility in high-contrast and backlit scenes."], ["Human & Vehicle Classification", "Deep-learning algorithms distinguish people and vehicles from other moving objects."], ["Intelligent Perimeter Protection", "Supports line crossing, intrusion, region entrance and region exiting detection."], ["Active Strobe & Audio Alarm", "Integrated visual and audible warnings can help deter unwanted activity."], ["Two-Way Audio", "Built-in microphone and speaker provide real-time communication."], ["IP67 Protection", "Weather-resistant construction supports dependable use in suitable outdoor locations."]],
    overview: "The DS-2CD2367G2H-LISU/SL combines 6MP ColorVu imaging, Smart Hybrid Light and intelligent active deterrence in a fixed turret format. Its 1/1.8-inch CMOS sensor captures up to 3200 × 1800 resolution, while 2.8 mm and 4 mm F1.0 lens options are designed to retain useful colour detail in low-light conditions. Smart Hybrid Light provides IR and white-light illumination with intelligent supplementary-light control, allowing an installation to use discreet night monitoring while adding white light when relevant activity occurs. Deep-learning human and vehicle classification improves alarm relevance for line crossing, intrusion, region entrance and region exiting events. The integrated strobe light, audible warning, microphone and speaker provide a proactive response and two-way communication. 130 dB WDR, microSD storage up to 512GB, H.265+ compression, PoE and IP67 protection provide practical recording and installation flexibility for residential and commercial outdoor security systems.",
    capabilities: [["Smart Hybrid Light", "Combines IR and white-light illumination to deliver discreet monitoring, added colour visibility or an event-driven response."], ["6MP ColorVu Imaging", "The large 1/1.8-inch sensor and F1.0 lens support detailed colour footage in difficult lighting."], ["Human and Vehicle Classification", "Deep-learning algorithms distinguish people and vehicles from other moving objects, helping reduce irrelevant alerts."], ["130 dB WDR", "Helps preserve image detail where bright and dark areas appear together in the same scene."], ["Intelligent Perimeter Protection", "Supports line crossing, intrusion, region entrance and region exiting detection for selected target types."], ["Active Strobe and Audio Warning", "The built-in strobe and audio alarm provide a proactive deterrent when configured events are triggered."], ["Two-Way Audio", "The integrated microphone and speaker support real-time communication and remote warnings."], ["Local Storage and IP67", "Supports microSD cards up to 512GB, PoE and weather-resistant outdoor operation."]],
    recommendedApplications: [["Residential entrances and driveways", "Smart Hybrid Light and ColorVu imaging provide flexible day-and-night coverage of access areas."], ["Retail shopfronts", "Detailed colour footage, classification and active deterrence suit customer-facing external areas."], ["Commercial perimeters", "Intelligent perimeter events, audio warning and IP67 protection suit outdoor building edges and access routes."], ["Variable-light environments", "ColorVu and 130 dB WDR support scenes affected by darkness, backlighting and changing illumination."], ["PoE surveillance systems", "PoE connectivity and on-board storage make it a practical choice for compatible NVR and switch installations."]],
    why: "The DS-2CD2367G2H-LISU/SL brings together 6MP ColorVu image quality, flexible Smart Hybrid Light and proactive active-deterrence functions. It offers more flexibility than conventional IR-only cameras: installations can keep routine monitoring discreet, retain colour detail in low light and use white light, strobe and audio warnings when a meaningful event occurs. With human and vehicle classification, 130 dB WDR, two-way audio, local storage, PoE and IP67 protection, it is a versatile turret camera for detailed residential and commercial surveillance.",
    specifications: [["Model", "DS-2CD2367G2H-LISU/SL"], ["Camera type", "6MP Smart Hybrid Light with ColorVu Fixed Turret Network Camera"], ["Image sensor", "1/1.8-inch Progressive Scan CMOS"], ["Maximum resolution", "3200 × 1800"], ["Lens options", "2.8 mm / 4 mm fixed focal, F1.0"], ["Supplementary light", "IR and white light; up to 30m"], ["Image enhancement", "130 dB WDR, BLC, HLC, 3D DNR"], ["Smart functions", "Human / vehicle classification and intelligent perimeter protection"], ["Audio / deterrence", "Built-in microphone and speaker, two-way audio, strobe and audible warning"], ["Storage", "microSD up to 512GB"], ["Compression", "H.265+ / H.265 / H.264+ / H.264 / MJPEG"], ["Power", "12V DC / PoE IEEE 802.3af"], ["Protection", "IP67; -30°C to +60°C; ≤95% RH"]],
    idealUseCases: [["Home entrances and driveways", "Colour visibility, flexible light modes and event deterrence support practical everyday security."], ["Retail storefronts", "Smart detection and active warning suit external customer areas and shop approaches."], ["Commercial boundaries", "Perimeter protection, two-way audio and IP67 construction support outdoor building security."], ["Dark or variable-light areas", "ColorVu, Smart Hybrid Light and WDR help maintain useful evidence through changing conditions."], ["General outdoor surveillance", "High-resolution recording, local storage and PoE support flexible deployment across suitable outdoor locations."]],
  },
};

const nvrDetailedProductContent: Record<string, DetailedTiandyContent> = {
  "curated-hikvision-7604": {
    descriptionTitle: "Hikvision DS-7604NXI-K1/4P | 4CH PoE NVR | AcuSense | 12MP | 4K HDMI | 4-Port PoE | 1HDD",
    description: "The Hikvision DS-7604NXI-K1/4P is a compact four-channel AcuSense network video recorder for home and small commercial IP camera systems. It supports cameras up to 12MP and provides four built-in PoE ports, reducing the need for a separate PoE switch in smaller installations. AcuSense can classify human and vehicle events for more relevant playback and notifications, while H.265+ compression helps manage recording storage and bandwidth. HDMI output supports local 4K display, VGA provides another display connection, and one SATA bay supports a hard drive up to 10TB. Hik-Connect remote access adds convenient daily viewing and management from compatible devices.",
    features: [["12MP Camera Support", "Connects up to four IP cameras with a maximum resolution of 12MP."], ["AcuSense Event Classification", "Helps distinguish human and vehicle activity from general movement."], ["Four Built-in PoE Ports", "Provides power and network data for compatible cameras through one Ethernet cable."], ["4K HDMI Local Display", "Supports high-resolution local monitoring through the HDMI output."], ["H.265+ Compression", "Helps reduce bandwidth and storage requirements."], ["Smart Search and Playback", "Helps locate relevant recorded events more efficiently."]],
    overview: "The DS-7604NXI-K1/4P is designed for compact systems that need dependable recording, local display and integrated PoE connectivity. It supports up to four IP cameras at a maximum 12MP resolution, with up to 40 Mbps incoming bandwidth and flexible decoding for high-resolution live view and playback. Four IEEE 802.3af/at PoE ports supply both power and data to compatible cameras, creating a clean installation with fewer separate power supplies. AcuSense human and vehicle classification improves event relevance, while H.265+, smart search and playback tools make recorded footage easier to manage. One SATA bay supports a drive up to 10TB, while HDMI and VGA outputs allow local monitoring on compatible displays.",
    capabilities: [["Integrated Four-Port PoE", "Connect compatible cameras directly without a separate PoE switch."], ["12MP IP Recording", "Supports detailed recording from up to four high-resolution cameras."], ["Human and Vehicle Events", "AcuSense helps focus recording review on relevant activity."], ["4K Local Monitoring", "HDMI supports local display up to 4K."], ["Efficient H.265+ Recording", "Helps conserve hard-drive capacity and bandwidth."], ["Hik-Connect Remote Access", "Supports convenient viewing and management from compatible devices."]],
    recommendedApplications: [["Homes and apartments", "Suitable for focused coverage of entrances, driveways and main access areas."], ["Small retail premises", "A compact option for customer entrances, counters and stock areas."], ["Small offices", "Supports practical recording for key internal and external areas."], ["Driveways and entrances", "Integrated PoE simplifies compatible perimeter-camera connections."]],
    why: "The DS-7604NXI-K1/4P combines four integrated PoE ports, 12MP camera support and AcuSense event classification in a compact recorder. It is a practical choice where a tidy IP camera system is needed without adding a separate PoE switch. 4K HDMI output, H.265+ compression, smart playback tools and Hik-Connect remote access provide useful day-to-day management features.",
    specifications: [["Model", "DS-7604NXI-K1/4P"], ["Channels", "4 IP cameras"], ["Maximum camera resolution", "12MP"], ["Incoming bandwidth", "40 Mbps"], ["Decoding capability", "1 × 12MP / 2 × 8MP / 4 × 4MP / 8 × 1080p"], ["Compression", "H.265+ / H.265 / H.264+ / H.264"], ["PoE ports", "4 × RJ45 10/100 Mbps, IEEE 802.3af/at"], ["Network port", "1 × RJ45 10/100 Mbps Ethernet"], ["Storage", "1 × SATA, up to 10TB"], ["Video output", "HDMI up to 4K; VGA up to 1920 × 1080"], ["Synchronous playback", "4 channels"], ["Power supply", "48V DC, 1.35A"], ["Operating conditions", "-10°C to +55°C"], ["Dimensions / weight", "320 × 240 × 48 mm; ≤1kg without HDD"]],
    idealUseCases: [["Home security systems", "Centralises recording for entrance, driveway and perimeter cameras."], ["Small business surveillance", "Supports everyday monitoring around customer areas and stock rooms."], ["PoE camera upgrades", "Integrated PoE supports a tidy upgrade from legacy camera arrangements."], ["Event-focused recording", "AcuSense and smart search assist with reviewing human and vehicle activity."]],
  },
  "curated-hilook-nvr104": {
    descriptionTitle: "HiLook NVR-104MH-C4P(D)-2TB | 4CH PoE NVR | 8MP | 4-Port PoE | 4K HDMI | Motion Detection 2.0 | 2TB HDD",
    description: "The HiLook NVR-104MH-C4P(D)-2TB is a compact four-channel network video recorder supplied with a 2TB hard drive for an immediately usable recording system. It supports IP cameras up to 8MP and has four integrated PoE ports, allowing compatible cameras to receive data and power through one Ethernet cable. Motion Detection 2.0 can classify people and vehicles to make recorded events more useful, while H.265+ compression supports efficient storage use. HDMI output supports up to 4K local viewing, VGA provides a secondary display option, and HiLookVision remote access helps users check their system from compatible devices.",
    features: [["8MP Camera Support", "Records from up to four compatible IP cameras at resolutions up to 8MP."], ["Four Built-in PoE Ports", "Provides a simple connection path for compatible PoE cameras."], ["Motion Detection 2.0", "Uses human and vehicle classification to help make event review more relevant."], ["2TB Pre-installed HDD", "Supplied with local storage so the recorder is ready to configure and use."], ["4K HDMI Output", "Supports detailed local monitoring through a compatible HDMI display."], ["HiLookVision Remote Access", "Supports remote viewing and management from compatible devices."]],
    overview: "The NVR-104MH-C4P(D)-2TB provides a compact, ready-to-use foundation for a four-camera HiLook IP system. It supports cameras up to 8MP, up to 40 Mbps incoming bandwidth and flexible decoding for local live view and playback. Four integrated IEEE 802.3af/at PoE ports simplify installation by delivering network data and power over the same cable. The included 2TB hard drive provides initial local recording capacity, while one SATA bay allows storage configuration to be assessed against the final camera settings and retention period. Motion Detection 2.0 can classify people and vehicles, H.265+ helps manage storage use, and HDMI up to 4096 × 2160 plus VGA output provide local display choices.",
    capabilities: [["Ready-to-Use 2TB Storage", "Includes a 2TB hard drive for immediate local recording."], ["Four-Port PoE Connectivity", "Connects and powers up to four compatible cameras through Ethernet."], ["8MP IP Recording", "Supports detailed footage from high-resolution cameras."], ["Motion Detection 2.0", "Helps identify relevant human and vehicle movement."], ["4K Local Display", "Provides a clear local view through HDMI."], ["H.265+ and Remote Viewing", "Balances efficient recording with convenient access through HiLookVision."]],
    recommendedApplications: [["Homes and apartments", "A compact solution for entrances, driveways and nearby outdoor areas."], ["Small retail premises", "Suitable for customer areas, counters and smaller stock rooms."], ["Small offices", "Supports simple recording for key access and internal locations."], ["Plug-and-play PoE systems", "The included drive and four PoE ports reduce setup steps."]],
    why: "The NVR-104MH-C4P(D)-2TB combines integrated four-port PoE, 8MP support and supplied 2TB storage in one compact recorder. It is a straightforward choice for a focused system where quick setup, efficient recording and practical remote access matter. Motion Detection 2.0, 4K HDMI and H.265+ add useful everyday features without making the system unnecessarily complex.",
    specifications: [["Model", "NVR-104MH-C4P(D)-2TB"], ["Series", "HiLook Pro"], ["Channels", "4 IP cameras"], ["Maximum camera resolution", "8MP"], ["Incoming bandwidth", "40 Mbps"], ["Decoding capability", "1 × 8MP / 3 × 4MP / 6 × 1080p"], ["Compression", "H.265+ / H.265 / H.264+ / H.264"], ["PoE ports", "4 × RJ45 10/100 Mbps, IEEE 802.3af/at; 50W total"], ["Video output", "HDMI up to 4096 × 2160; VGA up to 1920 × 1080"], ["Synchronous playback", "4 channels"], ["Storage", "2TB pre-installed; 1 × SATA"], ["USB", "2 × USB 2.0"], ["Audio", "RCA input/output with two-way audio"], ["Remote users", "Up to 32"], ["Power / conditions", "48V DC, 1.35A; -10°C to +55°C"], ["Dimensions / weight", "265 × 225 × 48 mm; ≤1kg without HDD"]],
    idealUseCases: [["Residential PoE systems", "Provides a practical starting point for four connected cameras."], ["Small-shop recording", "Supports entry, counter and stock-area monitoring with supplied storage."], ["Compact office systems", "Provides simple central recording for day-to-day site coverage."], ["New camera installations", "The integrated PoE ports and installed drive simplify initial setup."]],
  },
  "curated-hilook-nvr108": {
    descriptionTitle: "HiLook NVR-108MH-K/8P(B)-4TB | 8CH PoE NVR | 12MP | 8-Port PoE | 4K HDMI | AI Detection | 4TB HDD",
    description: "The HiLook NVR-108MH-K/8P(B)-4TB is an eight-channel Pro Series network video recorder supplied with a 4TB hard drive for expanded IP camera coverage. It supports cameras up to 12MP and includes eight PoE ports, giving compatible cameras a direct power and network connection without requiring a separate switch for each channel. Motion Detection 2.0, facial-recognition functions and perimeter-protection features help users focus on meaningful events, while H.265+ compression manages storage requirements. With 4K HDMI output, local and remote playback options, and one SATA bay supporting up to 10TB, it is well suited to larger homes, retail sites and growing commercial installations.",
    features: [["12MP Camera Support", "Supports up to eight compatible IP cameras at resolutions up to 12MP."], ["Eight Built-in PoE Ports", "Provides direct data and power connections for a more orderly camera installation."], ["AI Event Functions", "Includes Motion Detection 2.0, facial recognition and perimeter-protection capabilities."], ["4TB Pre-installed HDD", "Supplied with local storage for a ready-to-configure recording system."], ["4K HDMI Output", "Supports high-resolution local monitoring on a compatible HDMI display."], ["Scalable Storage and Playback", "One SATA bay, eight-channel playback and H.265+ support a growing system."]],
    overview: "The NVR-108MH-K/8P(B)-4TB provides central recording for systems that need more coverage than a compact four-channel recorder. It supports up to eight IP cameras at a maximum 12MP resolution, with 80 Mbps incoming and outgoing bandwidth and flexible decoding for high-resolution live viewing. Eight integrated PoE ports simplify cabling and allow compatible cameras to be powered directly from the recorder. The supplied 4TB hard drive provides a starting point for recording retention, while the single SATA bay can support a drive up to 10TB depending on the selected storage plan. Motion Detection 2.0, facial-recognition functions and perimeter protection add useful event-management tools. HDMI output supports 4K monitoring and VGA supports an additional local display.",
    capabilities: [["Eight-Port PoE Design", "Connects and powers up to eight compatible cameras directly through Ethernet."], ["12MP Recording Capacity", "Supports detailed recordings across a larger IP camera system."], ["AI Event Management", "Motion Detection 2.0, facial recognition and perimeter tools help surface relevant activity."], ["Supplied 4TB Storage", "Provides ready local recording capacity from initial setup."], ["4K Local Monitoring", "HDMI output supports detailed viewing on a compatible local display."], ["Efficient System Growth", "H.265+, eight-channel playback and expandable SATA storage support growing surveillance needs."]],
    recommendedApplications: [["Larger homes", "Supports broader coverage of entrances, driveways, gardens and perimeter areas."], ["Retail and hospitality sites", "Eight channels provide room for customer, counter, stock and access-area monitoring."], ["Small commercial premises", "A practical recorder for offices, workshops and multi-area business sites."], ["Warehouse areas", "Supports centralised camera coverage around access points and work areas."]],
    why: "The NVR-108MH-K/8P(B)-4TB provides a practical step up in capacity, with eight PoE ports, 12MP camera support and supplied 4TB storage. AI-enabled event tools, 4K output and H.265+ compression make it suitable for systems that need broader coverage while remaining straightforward to install and manage. It is a versatile recorder for larger homes and small commercial sites that are ready to grow beyond four cameras.",
    specifications: [["Model", "NVR-108MH-K/8P(B)-4TB"], ["Series", "HiLook Pro"], ["Channels", "8 IP cameras"], ["Maximum camera resolution", "12MP"], ["Incoming / outgoing bandwidth", "80 Mbps / 80 Mbps"], ["Decoding capability", "1 × 12MP / 2 × 8MP / 4 × 4MP / 8 × 1080p"], ["Compression", "H.265+ / H.265 / H.264+ / H.264"], ["PoE ports", "8 × RJ45 10/100 Mbps, IEEE 802.3af/at; 75W total"], ["Network port", "1 × RJ45 10/100 Mbps Ethernet"], ["Video output", "HDMI up to 3840 × 2160; VGA up to 1920 × 1080"], ["Synchronous playback", "8 channels"], ["Storage", "4TB pre-installed; 1 × SATA up to 10TB"], ["USB", "2 × USB 2.0"], ["AI functions", "Facial recognition, perimeter protection and Motion Detection 2.0"], ["Power / conditions", "48V DC, 1.875A; -10°C to +55°C; 10%–90% RH"], ["Dimensions / weight", "320 × 240 × 48 mm; ≤1kg without HDD"]],
    idealUseCases: [["Expanded residential systems", "Provides capacity for broad home and perimeter coverage."], ["Multi-area retail sites", "Eight camera channels support entry, counter, stock and external monitoring."], ["Offices and workshops", "Centralises recording for several internal and external security areas."], ["Warehouse and distribution sites", "Supports camera coverage across access, storage and loading areas."]],
  },
  "curated-hikvision-7616": {
    descriptionTitle: "Hikvision DS-7616NI-M2/16P-4TB | 16CH PoE NVR | 32MP | 16-Port PoE | 8K HDMI | 2HDD | 4TB HDD",
    description: "The Hikvision DS-7616NI-M2/16P-4TB is an M Series 16-channel network video recorder for larger IP camera installations requiring centralised connectivity, higher recording capacity and flexible local storage. It supports cameras up to 32MP, provides sixteen built-in PoE ports and accommodates two SATA hard drives, with a 4TB drive supplied as the starting storage configuration. High incoming and outgoing bandwidth, advanced multi-camera decoding and HDMI output up to 8K support detailed monitoring across demanding systems. AcuSense-compatible human and vehicle classification can improve event relevance with compatible cameras, while up to 16-channel playback, alarm I/O and remote access support practical operation across business, warehouse, education and larger residential sites.",
    features: [["32MP Camera Support", "Supports up to sixteen high-resolution IP cameras at resolutions up to 32MP."], ["Sixteen Built-in PoE Ports", "Provides centralised power and data connections for compatible cameras."], ["8K HDMI Output", "Supports ultra-high-resolution local display for detailed monitoring."], ["Two-HDD Storage Design", "Provides two SATA bays for more flexible recording retention, with 4TB supplied."], ["AcuSense-Compatible Events", "Works with compatible human and vehicle classification functions to improve event relevance."], ["High-Capacity Playback", "Supports up to sixteen-channel synchronous playback and extensive remote-user access."]],
    overview: "The DS-7616NI-M2/16P-4TB is designed for larger systems where camera count, resolution and recording retention need to be managed from one central recorder. It supports up to sixteen IP cameras at resolutions up to 32MP, with 256 Mbps incoming and outgoing bandwidth and flexible decoding for multiple high-resolution streams. Sixteen IEEE 802.3af/at PoE ports simplify connection and structured cabling for compatible cameras, while two SATA bays provide greater storage flexibility than compact recorder designs. A 4TB hard drive is supplied for initial recording capacity; the final retention period depends on camera count, resolution, frame rate and analytics settings. HDMI supports output up to 7680 × 4320 at 30Hz, VGA provides an additional display option, and four alarm inputs plus one alarm output support system integration.",
    capabilities: [["Sixteen-Port PoE Connectivity", "Centralises power and network data for up to sixteen compatible cameras."], ["32MP and 256 Mbps Capacity", "Supports high-resolution camera systems and substantial incoming and outgoing bandwidth."], ["8K Local Display", "HDMI output supports up to 7680 × 4320 at 30Hz for detailed monitoring."], ["Two-Drive Storage Flexibility", "Two SATA bays allow recording capacity to be planned around the required retention period."], ["AcuSense-Compatible Event Review", "Supports compatible human and vehicle classification workflows."], ["Sixteen-Channel Playback and Remote Access", "Helps teams review footage and manage the system from local or remote locations."]],
    recommendedApplications: [["Large residential properties", "Supports extensive coverage of entrances, outbuildings, driveways and perimeter areas."], ["Commercial premises", "Suitable for retail, office and multi-area business surveillance systems."], ["Warehouses and distribution sites", "Provides central recording for access points, storage areas and loading zones."], ["Education and institutional sites", "Sixteen channels support broader coverage across connected buildings and shared spaces."]],
    why: "The DS-7616NI-M2/16P-4TB combines sixteen PoE ports, 32MP support, 8K HDMI output and a two-drive storage design for demanding multi-camera systems. It gives installers and site managers a central platform with substantial bandwidth capacity, flexible retention planning and practical tools for event review. Supplied 4TB storage provides an initial base while the two SATA bays allow the system to scale with camera count and recording requirements.",
    specifications: [["Model", "DS-7616NI-M2/16P-4TB"], ["Series", "Hikvision M Series"], ["Channels", "16 IP cameras"], ["Maximum camera resolution", "32MP"], ["Incoming / outgoing bandwidth", "256 Mbps / 256 Mbps"], ["Decoding capability", "2 × 32MP + 2 × 8MP / 10 × 8MP / 20 × 4MP / 40 × 1080p"], ["Compression", "H.265+ / H.265 / H.264+ / H.264"], ["PoE ports", "16 × RJ45, IEEE 802.3af/at; 200W total"], ["Network port", "Gigabit Ethernet"], ["Video output", "HDMI up to 8K (7680 × 4320 at 30Hz); VGA up to 1920 × 1080"], ["Synchronous playback", "16 channels"], ["Storage", "4TB supplied; 2 × SATA, up to 14TB per drive"], ["Alarm I/O", "4 inputs / 1 output"], ["USB", "2 × USB 2.0 front; 1 × USB 3.0 rear"], ["Remote users", "Up to 128"], ["Power / conditions", "100–240V AC; -10°C to +55°C; 10%–90% RH"], ["Dimensions / weight", "384–385 × 315–317 × 52 mm; ≤3kg without HDD"]],
    idealUseCases: [["Multi-area commercial coverage", "Centralises recording for multiple connected areas of a business site."], ["Warehouse and distribution monitoring", "Supports large camera counts around storage, loading and access areas."], ["Larger residential installations", "Provides capacity for homes with extensive perimeter and building coverage."], ["Education and institutional sites", "A practical option for broader multi-camera systems across shared spaces."]],
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
  const legacyProductAliases: Record<string, string> = {
    "dahua-nvr4104": "curated-dahua-nvr4104",
  };
  const resolvedProductId = id ? legacyProductAliases[id] ?? id : id;
  const baseProduct = products.find((item) => item.id === resolvedProductId);
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
  const normalisedProductSku = product.sku.trim().toUpperCase();
  const dahuaDetailKey = normalisedProductSku === "DH-IPC-HDW3667EM-S-IL-ANZ"
    ? "dahua-4k-turret"
    : normalisedProductSku === "DH-IPC-HDW3649H-AS-PV-ANZ-S2"
      ? "dahua-hdw3649"
      : normalisedProductSku === "DH-PFA130-E"
        ? "dahua-pfa130"
        : normalisedProductSku === "DH-PFB2204W"
          ? "dahua-pfb2204w"
          : normalisedProductSku === "DHI-NVR4104HS-P-4KS3"
      ? "dahua-nvr4104"
      : normalisedProductSku === "DH-IPC-HDW3867EM-S-IL-ANZ"
        ? "dahua-hdw3867"
        : normalisedProductSku === "DHI-NVR4108HS-8P-4KS3"
          ? "dahua-nvr4108"
          : normalisedProductSku === "DS-2CD2387G2H-LISU-SL" || normalisedProductSku === "DS-2CD2387G2H-LISU/SL"
            ? "hikvision-2387"
            : product.id;
  const usesDahuaBadges = normalisedProductSku === "DH-IPC-HDW3667EM-S-IL-ANZ";
  const detailedDahuaLayoutContent = dahuaDetailedContent[dahuaDetailKey];
  const accessoryLayoutContent = accessoryDetailedContent[dahuaDetailKey];
  const usesAccessoryDetailedLayout = Boolean(accessoryLayoutContent);
const usesHikvisionKitLayout = product.id === "hikvision-ax-pro-security-kit";
const alarmLayoutContent = createAlarmDetailContent(product);
const alarmKitProducts = (alarmKitComponentIds[product.id] ?? [])
  .map((id) => products.find((item) => item.id === id))
  .filter((item): item is Product => Boolean(item));
const arrowheadIncludedItems = arrowheadKitIncludedItems[product.id] ?? [];
const paradoxModel = !alarmLayoutContent && product.id === "paradox-sp4000-alarm-kit"
  ? "SP4000"
  : !alarmLayoutContent && product.id === "paradox-sp5500-alarm-kit"
    ? "SP5500"
    : undefined;
  const usesParadoxKitLayout = Boolean(paradoxModel);
  const arrowheadKeypad = !alarmLayoutContent && product.id === "arrowhead-ec-lcd-alarm-kit" ? "LCD" : !alarmLayoutContent && product.id === "arrowhead-ec-led-alarm-kit" ? "LED" : undefined;
  const usesArrowheadKitLayout = Boolean(arrowheadKeypad);
  const usesTiandyC36Layout = product.id === "curated-tiandy-tc-c36xn";
  const usesTiandyH333Layout = product.id === "curated-tiandy-tc-h333k";
  const additionalTiandyLayoutContent = tiandyAdditionalDetailedContent[product.id] ?? tiandyAdditionalCameraContent[product.id] ?? pdfDetailedProductContent[product.id] ?? nvrDetailedProductContent[product.id];
  const usesTiandyDetailedLayout = usesTiandyC36Layout || usesTiandyH333Layout || Boolean(additionalTiandyLayoutContent) || Boolean(detailedDahuaLayoutContent);
  const usesDetailedProductLayout = usesTiandyDetailedLayout || usesAccessoryDetailedLayout;
  const usesStandardUpperProductStyling = usesDetailedProductLayout || Boolean(alarmLayoutContent) || usesHikvisionKitLayout;
  const usesTiandyShortToggle = usesTiandyC36Layout || usesTiandyH333Layout || Boolean(additionalTiandyLayoutContent) || Boolean(detailedDahuaLayoutContent) || usesAccessoryDetailedLayout;
  const tiandyLayoutContent = usesTiandyC36Layout ? tiandyC36Content : usesTiandyH333Layout ? tiandyH333Content : additionalTiandyLayoutContent ?? detailedDahuaLayoutContent;
  const detailedLayoutContent = tiandyLayoutContent ?? accessoryLayoutContent;
  const additionalTiandyHeadings = {
    "curated-tiandy-tc-c34xn": { overview: "Wide coverage with flexible dual-light monitoring", recommended: "Suited to practical day-and-night coverage", whyEyebrow: "Why the TC-C34XN 2ENA-28?", why: "A versatile 4MP dual-light turret camera", uses: "Flexible coverage from entry to perimeter" },
    "curated-tiandy-tc-r3105": { overview: "Compact recording with integrated PoE", recommended: "Suited to focused IP surveillance", whyEyebrow: "Why the TC-R3105?", why: "A practical NVR for smaller systems", uses: "Reliable recording from home to business" },
    "curated-tiandy-tc-r3110": { overview: "Central recording with integrated PoE connectivity", recommended: "Suited to scalable IP surveillance", whyEyebrow: "Why the TC-R3110?", why: "A compact NVR for growing systems", uses: "Flexible recording from home to business" },
    "curated-tiandy-tc-r3104": { overview: "Simple PoE recording for compact systems", recommended: "Suited to focused IP surveillance", whyEyebrow: "Why the TC-R3104?", why: "A practical NVR for smaller systems", uses: "Reliable recording for key areas" },
    "curated-tiandy-tc-h343k": { overview: "Remote coverage without fixed infrastructure", recommended: "Suited to off-grid surveillance", whyEyebrow: "Why the TC-H343K 9DA-4?", why: "Flexible 4G and solar-oriented monitoring", uses: "Remote coverage from access to perimeter" },
    "curated-tiandy-tc-c34cn": { overview: "Wireless coverage with flexible night visibility", recommended: "Suited to convenient Wi-Fi surveillance", whyEyebrow: "Why the TC-C34CN 9ATA-28?", why: "A practical Color Maker Wi-Fi bullet camera", uses: "Flexible coverage from entry to driveway" },
    "dahua-4k-turret": { overview: "Intelligent dual-light protection for key outdoor areas", recommended: "Suited to detailed day-and-night surveillance", whyEyebrow: "Why the DH-IPC-HDW3667EM-S-IL-ANZ?", why: "A 6MP WizSense turret for intelligent outdoor coverage", uses: "Coverage from driveways to commercial perimeters" },
    "dahua-hdw3649": { overview: "Proactive dual-light protection for key outdoor areas", recommended: "Suited to intelligent active-deterrence surveillance", whyEyebrow: "Why the DH-IPC-HDW3649H-AS-PV-ANZ-S2?", why: "A 6MP active-deterrence camera for smarter outdoor coverage", uses: "Coverage from driveways to commercial perimeters" },
    "dahua-nvr4104": { overview: "Compact recording with integrated four-port PoE", recommended: "Suited to focused four-camera IP systems", whyEyebrow: "Why the DHI-NVR4104HS-P-4KS3?", why: "A practical recorder for compact high-resolution systems", uses: "Reliable recording from home to business" },
    "dahua-hdw3867": { overview: "Detailed 8MP dual-light coverage for key outdoor areas", recommended: "Suited to detailed day-and-night surveillance", whyEyebrow: "Why the DH-IPC-HDW3867EM-S-IL-ANZ?", why: "An 8MP WizSense turret for intelligent outdoor coverage", uses: "Coverage from driveways to commercial perimeters" },
    "dahua-nvr4108": { overview: "Central recording with integrated eight-port PoE", recommended: "Suited to scalable eight-camera IP surveillance", whyEyebrow: "Why the DHI-NVR4108HS-8P-4KS3?", why: "A capable recorder for growing high-resolution systems", uses: "Reliable recording from home to business" },
    "hikvision-2387": { overview: "Full-colour 8MP protection with intelligent active deterrence", recommended: "Suited to detailed day-and-night outdoor monitoring", whyEyebrow: "Why the DS-2CD2387G2H-LISU/SL?", why: "An 8MP ColorVu turret for intelligent active protection", uses: "Coverage from entrances to outdoor perimeters" },
    "curated-hilook-t289": { overview: "Detailed 4K monitoring with flexible hybrid illumination", recommended: "Suited to intelligent active-deterrence surveillance", whyEyebrow: "Why the IPC-T289H-MU/SL?", why: "An 8MP hybrid-light turret for proactive outdoor protection", uses: "Coverage from driveways to commercial perimeters" },
    "curated-hikvision-2386": { overview: "8MP AcuSense monitoring with proactive sound and light deterrence", recommended: "Suited to detailed outdoor security coverage", whyEyebrow: "Why the DS-2CD2386G2-ISU/SL?", why: "An 8MP AcuSense turret for intelligent active protection", uses: "Coverage from entrances to outdoor perimeters" },
    "curated-hikvision-2366": { overview: "Detailed 6MP coverage with intelligent active deterrence", recommended: "Suited to dependable day-and-night outdoor monitoring", whyEyebrow: "Why the DS-2CD2366G2-ISU/SL?", why: "A 6MP AcuSense turret for practical proactive protection", uses: "Coverage from home entrances to commercial perimeters" },
    "curated-hikvision-2367": { overview: "Full-colour 6MP protection with flexible hybrid illumination", recommended: "Suited to detailed day-and-night outdoor monitoring", whyEyebrow: "Why the DS-2CD2367G2H-LISU/SL?", why: "A 6MP ColorVu turret for intelligent active protection", uses: "Coverage from entrances to outdoor perimeters" },
    "curated-hikvision-7604": { overview: "Compact AcuSense recording with integrated four-port PoE", recommended: "Suited to focused four-camera CCTV systems", whyEyebrow: "Why the DS-7604NXI-K1/4P?", why: "A compact four-channel AcuSense NVR for connected surveillance", uses: "Reliable recording from home to small business" },
    "curated-hilook-nvr104": { overview: "Ready-to-use four-camera recording with integrated 2TB storage", recommended: "Suited to simple compact CCTV systems", whyEyebrow: "Why the NVR-104MH-C4P(D)-2TB?", why: "A ready-to-use four-channel NVR with PoE and supplied storage", uses: "Straightforward monitoring from home to small business" },
    "curated-hilook-nvr108": { overview: "Expanded eight-camera recording with 4TB storage and integrated PoE", recommended: "Suited to growing residential and small-business systems", whyEyebrow: "Why the NVR-108MH-K/8P(B)-4TB?", why: "An eight-channel PoE NVR for scalable AI-enabled CCTV", uses: "Coverage from larger homes to commercial sites" },
    "curated-hikvision-7616": { overview: "High-capacity 16-channel recording with 8K display and 16-port PoE", recommended: "Suited to larger commercial and institutional CCTV systems", whyEyebrow: "Why the DS-7616NI-M2/16P-4TB?", why: "A high-capacity M Series NVR for demanding multi-camera systems", uses: "Centralised coverage from large homes to distribution sites" },
  }[dahuaDetailKey] ?? {
    "curated-dahua-hdw3667": { overview: "Intelligent dual-light protection for key outdoor areas", recommended: "Suited to detailed day-and-night surveillance", whyEyebrow: "Why the DH-IPC-HDW3667EM-S-IL-ANZ?", why: "A 6MP WizSense turret for intelligent outdoor coverage", uses: "Coverage from driveways to commercial perimeters" },
    "curated-dahua-nvr4104": { overview: "Compact recording with integrated four-port PoE", recommended: "Suited to focused four-camera IP systems", whyEyebrow: "Why the DHI-NVR4104HS-P-4KS3?", why: "A practical recorder for compact high-resolution systems", uses: "Reliable recording from home to business" }
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
  const resolvedPageHeadings = alarmLayoutContent ? alarmPageHeadings(product) : tiandyPageHeadings;
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
  const fullSummary = usesDahuaBadges ? dahuaDescription : usesDetailedProductLayout ? detailedLayoutContent!.description : tiandyDetail?.overview ?? productOverview(product);
  const seoDescriptionSource = fullSummary || product.description || product.shortDescription;
  const seoDescription = seoDescriptionSource.length > 158
    ? `${seoDescriptionSource.slice(0, 155).replace(/\s+\S*$/, "")}…`
    : seoDescriptionSource;
  const preferredTitle = `${displayName} | iSmartTech NZ`;
  const seoTitle = preferredTitle.length <= 65
    ? preferredTitle
    : `${product.brand} ${displaySku} | iSmartTech NZ`;
  const canonicalPath = `/products/${product.id}`;
  const canonicalUrl = new URL(canonicalPath, window.location.origin).toString();
  const productJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${canonicalUrl}#product`,
        name: displayName,
        description: seoDescription,
        sku: displaySku,
        brand: { "@type": "Brand", name: product.brand },
        category: product.category,
        image: previewImages
          .filter(Boolean)
          .map((image) => new URL(image!, window.location.origin).toString()),
        url: canonicalUrl,
        ...(product.priceOnRequest ? {} : {
          offers: {
            "@type": "Offer",
            priceCurrency: "NZD",
            price: product.price.toFixed(2),
            availability: product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: canonicalUrl,
          },
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: new URL("/", window.location.origin).toString() },
          { "@type": "ListItem", position: 2, name: "Products", item: new URL("/products", window.location.origin).toString() },
          { "@type": "ListItem", position: 3, name: displayName, item: canonicalUrl },
        ],
      },
    ],
  };

  return (
    <main className="page container product-page">
      <Seo title={seoTitle} description={seoDescription} canonicalPath={canonicalPath} image={product.image} type="product" jsonLd={productJsonLd} />
      <div className="breadcrumb"><Link to="/">{zh ? "首页" : "Home"}</Link><span>›</span><Link to={`/products?category=${encodeURIComponent(baseProduct!.category)}`}>{product.category}</Link><span>›</span>{displayName}</div>
      <section className={`product-detail product-detail--commerce ${usesStandardUpperProductStyling ? "product-detail--tiandy-c36" : ""}`}>
        <div className="product-preview">
          <div className="product-detail__gallery">{product.badge && <span className="badge">{product.badge}</span>}<ProductVisual icon={product.icon} accent={product.accent} image={displayedImage} alt={displayName} large />{!displayedImage && <div className="gallery-note">{zh ? "产品预览" : "PRODUCT PREVIEW"}</div>}</div>
          <div className="product-preview__thumbs">{previewImages.map((image, index) => <button type="button" key={`${image || "product-placeholder"}-${index}`} className={index === previewIndex ? "active" : ""} onClick={() => setPreviewIndex(index)} aria-label={`${zh ? "显示产品图片" : "Show product image"} ${index + 1}`}><ProductVisual icon={product.icon} accent={product.accent} image={image} alt="" /></button>)}</div>
        </div>
        <div className="product-detail__info product-purchase">
          <span className="eyebrow">{product.brand} · SKU {displaySku}</span>
          <h1>{displayName}</h1>
          <div className="detail-price"><strong>{product.priceOnRequest ? (zh ? "询价" : "Price on request") : money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}<small>{product.priceOnRequest ? (zh ? "请联系我们获取报价" : "Contact us for a quote") : (zh ? "含商品及服务税" : "inc GST")}</small>{usesDetailedProductLayout && <section className="product-status product-status--price" aria-label={zh ? "产品库存" : "Product stock"}><div><span>{zh ? "库存" : "Stock"}</span><strong className={product.priceOnRequest ? "out-of-stock" : product.stock > 0 ? "in-stock" : "out-of-stock"}>{product.priceOnRequest ? (zh ? "库存请询问" : "Stock on request") : product.stock > 0 ? (zh ? `现货 ${product.stock} 件` : `${product.stock} in stock`) : (zh ? "缺货" : "Out of stock")}</strong></div></section>}</div>
          {!usesDetailedProductLayout && <section className="product-status" aria-label={zh ? "产品库存和选项" : "Product stock and options"}><div><span>{zh ? "库存" : "Stock"}</span><strong className={product.priceOnRequest ? "out-of-stock" : product.stock > 0 ? "in-stock" : "out-of-stock"}>{product.priceOnRequest ? (zh ? "库存请询问" : "Stock on request") : product.stock > 0 ? (zh ? `现货 ${product.stock} 件` : `${product.stock} in stock`) : (zh ? "缺货" : "Out of stock")}</strong></div></section>}
          <div className="product-summary"><h2>{usesDahuaBadges ? dahuaDescriptionTitle : usesDetailedProductLayout ? detailedLayoutContent!.descriptionTitle : tiandyDetail?.descriptionTitle ?? (product.id.startsWith("curated-") ? product.shortDescription : productSummaryHeading(product))}</h2><p>{fullSummary}</p></div>
          {usesHikvisionKitLayout && <section className="key-features product-kit-contents"><h2>{zh ? "套装包含" : "What's included"}</h2><ul>{hikvisionKitContents.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>}
          {usesParadoxKitLayout && <section className="key-features product-kit-contents"><h2>{zh ? "套装包含" : "What's included"}</h2><ul>{paradoxKitContents(paradoxModel!).map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul><p><strong>Note:</strong> Cable must be ordered separately.</p></section>}
          {alarmKitProducts.length > 0 && <section className="key-features product-kit-contents alarm-kit-components"><h2>What's included</h2><ul>{alarmKitProducts.map((component) => <li key={component.id}><strong>{component.sku}:</strong> <Link to={"/products/" + component.id}>{alarmKitComponentDisplayName(product.id, component)}</Link></li>)}</ul><p><strong>Installation note:</strong> Confirm device quantities, compatible modules and cabling for the site before installation.</p></section>}
          {arrowheadIncludedItems.length > 0 && <section className="key-features product-kit-contents"><h2>{zh ? "套装包含" : "What's included"}</h2><ul>{arrowheadIncludedItems.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul><p><strong>Installation note:</strong> The supplied panel uses a transformer and fuse assembly; confirm the required power arrangement, modules and site cabling before installation.</p></section>}
          {usesArrowheadKitLayout && <section className="key-features product-kit-contents"><h2>{zh ? "套装包含" : "What's included"}</h2><ul>{arrowheadKitContents(arrowheadKeypad!).map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>}
          {!usesHikvisionKitLayout && !usesParadoxKitLayout && !usesArrowheadKitLayout && !usesDahuaBadges && product.featureImages?.length ? <div className="feature-badges" aria-label={zh ? "产品特点" : "Product features"}>{product.featureImages.map((src, index) => <img key={src} src={src} alt={product.features[index] || `Feature ${index + 1}`} loading="lazy" decoding="async" />)}</div> : null}
          {usesDetailedProductLayout && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{detailedLayoutContent!.features.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>}
          {usesDahuaBadges && !detailedDahuaLayoutContent && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{dahuaKeyFeatures.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>}
          {tiandyDetail && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{tiandyDetail.features.map(feature => <li key={feature}>{feature}</li>)}</ul></section>}
          {usesHikvisionKitLayout && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{hikvisionKeyFeatures.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>}
          {alarmLayoutContent && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{alarmLayoutContent.features.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>}
          {usesParadoxKitLayout && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{product.features.map(feature => <li key={feature}>{feature}</li>)}</ul></section>}
          {usesArrowheadKitLayout && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{product.features.map(feature => <li key={feature}>{feature}</li>)}</ul></section>}
          {!alarmLayoutContent && !usesDahuaBadges && !usesTiandyDetailedLayout && !usesAccessoryDetailedLayout && !tiandyDetail && !usesHikvisionKitLayout && !usesParadoxKitLayout && !usesArrowheadKitLayout && product.features.length > 0 && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{product.features.map(feature => <li key={feature}>{feature}</li>)}</ul></section>}
          {usesDahuaBadges && <section className="additional-information"><h2>{zh ? "规格书" : "Spec Sheet"}</h2><a href="/assets/DH-IPC-HDW3667EM-S-IL-ANZ-spec-sheet.pdf" target="_blank" rel="noopener noreferrer">DH-IPC-HDW3667EM-S-IL-ANZ Spec Sheet <span aria-hidden="true">↗</span></a></section>}
          {usesHikvisionKitLayout && <section className="additional-information"><h2>{zh ? "规格书" : "Spec Sheet"}</h2><a href="/assets/DS-PWA96-Kit-WB_Datasheet_20230516.pdf" target="_blank" rel="noopener noreferrer">DS-PWA96-Kit-WB_Datasheet_20230516 <span aria-hidden="true">↗</span></a></section>}
          {!usesDahuaBadges && !usesHikvisionKitLayout && (product.datasheetUrl || product.specSheetLinks?.length) && <section className="additional-information"><h2>{zh ? "规格书" : "Spec Sheet"}</h2><div className="additional-information__links">{product.specSheetLinks?.map((document) => <a key={document.url} href={document.url} target="_blank" rel="noopener noreferrer">{document.label} <span aria-hidden="true">↗</span></a>)}{product.datasheetUrl && <a href={product.datasheetUrl} target="_blank" rel="noopener noreferrer">{product.sku} Datasheet <span aria-hidden="true">↗</span></a>}</div></section>}
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
        <section className="product-overview product-overview--tiandy"><div><span className="eyebrow">{zh ? "产品概览" : "Product Overview"}</span><h2>{resolvedPageHeadings.overview}</h2></div><p>{tiandyLayoutContent!.overview}</p></section>
        <section className="key-features key-features--tiandy"><h2>{zh ? "主要能力" : "Capabilities"}</h2><ul>{tiandyLayoutContent!.capabilities.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>
        <section className="product-content-grid product-content-grid--tiandy"><article><span className="eyebrow">{zh ? "推荐应用" : "Recommended Applications"}</span><h2>{resolvedPageHeadings.recommended}</h2><ul>{tiandyLayoutContent!.recommendedApplications.map(([title, description]) => <li key={title}><strong>{title}</strong><span>{description}</span></li>)}</ul></article><article><span className="eyebrow">{resolvedPageHeadings.whyEyebrow}</span><h2>{resolvedPageHeadings.why}</h2><p>{tiandyLayoutContent!.why}</p></article></section>
        <section className="product-specifications"><div><h2>{zh ? "规格" : "Specifications"}</h2></div><dl>{tiandyLayoutContent!.specifications.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl></section>
        <section className="product-uses product-uses--tiandy"><span className="eyebrow">{zh ? "理想使用场景" : "Ideal Use Cases"}</span><h2>{resolvedPageHeadings.uses}</h2><div>{tiandyLayoutContent!.idealUseCases.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div></section>
      </>}
      {usesAccessoryDetailedLayout && detailLength === "full" && <>
        <section className="product-accessory-details">
          <section className="product-specifications"><div><h2>{zh ? "规格" : "Specifications"}</h2></div><dl>{accessoryLayoutContent!.specifications.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl></section>
          <section className="key-features product-accessory-section"><h2>{zh ? "典型应用" : "Typical Applications"}</h2><ul>{accessoryLayoutContent!.applications.map(application => <li key={application}>{application}</li>)}</ul></section>
          <section className="key-features product-accessory-section"><h2>{zh ? "安装说明" : "Installation Notes"}</h2><ul>{accessoryLayoutContent!.installationNotes.map(note => <li key={note}>{note}</li>)}</ul></section>
        </section>
      </>}
    </main>
  );
}
