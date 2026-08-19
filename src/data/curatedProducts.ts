import type { Product } from "../types";

type Curated = {
  id: string;
  name: string;
  brand: string;
  sku: string;
  category: "camera" | "nvr" | "accessory";
  aliases?: string[];
  description: string;
  features: string[];
  sourceUrl?: string;
  datasheetUrl?: string;
};

const items: Curated[] = [
  [
    "tiandy-tc-c36xn",
    "Tiandy 6MP DualLight Turret Camera - PL",
    "Tiandy",
    "TC-C36XN 2ENA-28",
    "camera",
    "A 6MP fixed-lens turret camera for indoor or outdoor IP surveillance, with low-light imaging, infrared illumination and a built-in microphone.",
    [
      "3200 × 1800 resolution at up to 30 fps",
      "Infrared reach up to 30 m",
      "S+265, H.265 and H.264 compression",
      "Built-in microphone and PoE (IEEE 802.3af)",
      "IP66 housing; -30 °C to 60 °C operation",
    ],
    undefined,
    "https://www.iottech.co.nz/product/tiandy-6-mp-duallight-camera-turret-camera",
    "https://www.iottech.co.nz/storage/files/datasheet/1335.pdf",
  ],
  [
    "tiandy-tc-c34xn",
    "Tiandy 4MP Fixed Turret Camera TC-C34XN 2ENA-28",
    "Tiandy",
    "TC-C34XN 2ENA-28",
    "camera",
    "A 4MP fixed-turret network camera with a 2.8 mm lens, selected from the IoT Tech catalogue for everyday fixed-position surveillance.",
    [
      "4MP fixed-turret network camera",
      "2.8 mm lens variant",
      "IP-camera form factor",
    ],
    ["TC-C34XN"],
    "https://www.iottech.co.nz/product/tiandy-4mp-fixed-turret-camera-tc-c34xn-2ena-28",
    "https://www.iottech.co.nz/storage/files/datasheet/1518.pdf",
  ],
  [
    "tiandy-tc-h333k",
    "Tiandy 3MP Fixed Color Maker Wi-Fi PT Camera TC-H333K",
    "Tiandy",
    "TC-H333K",
    "camera",
    "A 3MP Wi-Fi pan-and-tilt camera with built-in audio, local microSD recording support and outdoor-rated construction.",
    [
      "2304 × 1296 resolution at up to 20 fps",
      "Wi-Fi connection and pan/tilt adjustment",
      "Built-in microphone and loudspeaker",
      "microSD support up to 256 GB",
      "IR illumination up to 30 m; IP66 housing",
    ],
    undefined,
    "https://www.iottech.co.nz/product/tiandy-3mp-fixed-color-maker-wi-fi-pt-camera-tc-h333k",
    "https://www.iottech.co.nz/storage/files/datasheet/1343.pdf",
  ],
  [
    "tiandy-tc-r3105",
    "Tiandy 1 HDD 5ch PSE NVR",
    "Tiandy",
    "TC-R3105 Spec:I/B/P4/Eu/L/S/V2.0",
    "nvr",
    "A five-channel Tiandy PSE NVR with a single-drive design, listed by IoT Tech for compact camera systems.",
    ["5-channel PSE NVR", "One HDD position", "PSE camera connection"],
    ["TC-R3105"],
    "https://www.iottech.co.nz/product/tiandy-1-hdd-5ch-pse-nvr-spec-3A-b-p4-eu-l-s-2.0",
  ],
  [
    "tiandy-tc-r3110",
    "Tiandy 1HDD 10ch Advanced PSE NVR",
    "Tiandy",
    "TC-R3110 Spec:I/B/P8/EU/L/S/V2.0",
    "nvr",
    "A ten-channel advanced Tiandy PSE NVR with one HDD position, intended for larger PoE camera installations.",
    ["10-channel PSE NVR", "One HDD position", "Advanced PSE model"],
    ["TC-R3110"],
    "https://www.iottech.co.nz/product/tiandy-1hdd-10ch-advanced-pse-nvr-spec-3A-i-b-p8-eu-l-s-v2.0",
  ],
  [
    "tiandy-tc-r3104",
    "Tiandy 1HDD 4CH PSE NVR",
    "Tiandy",
    "TC-R3104 Spec:I/B/P4/C/L/S/V2.0",
    "nvr",
    "A compact four-channel Tiandy PSE recorder with four PoE ports, HDMI/VGA output and local single-HDD storage.",
    [
      "Four IP-camera channels",
      "60 Mbps incoming / 40 Mbps outgoing bandwidth",
      "Four PoE ports",
      "One HDD up to 6 TB",
      "HDMI and VGA outputs; S+265 / H.265 / H.264",
    ],
    undefined,
    "https://www.iottech.co.nz/product/tiandy-1hdd-4ch-pse--nvr",
    "https://www.iottech.co.nz/storage/files/datasheet/1146.pdf",
  ],
  [
    "tiandy-tc-h343k",
    "Tiandy 4MP Fixed Color Maker 4G Solar PT Camera",
    "Tiandy",
    "TC-H343K 9DA-4",
    "camera",
    "A 4MP 4G pan-and-tilt camera for solar-oriented deployments, with audio, microSD recording and IP65 weather protection.",
    [
      "2560 × 1440 resolution at up to 20 fps",
      "4G connectivity with pan/tilt movement",
      "Built-in microphone and loudspeaker",
      "microSD support up to 256 GB",
      "IR illumination to 30 m; IP65 housing",
    ],
    ["TC-H343K"],
    "https://www.iottech.co.nz/product/tiandy-4mp-fixed-color-maker-4g-pt-camera",
    "https://www.iottech.co.nz/storage/files/datasheet/1431.pdf",
  ],
  [
    "tiandy-tc-c34cn",
    "Tiandy 4MP Fixed Wi-Fi Bullet Camera TC-C34CN 9ATA-28",
    "Tiandy",
    "TC-C34CN 9ATA-28",
    "camera",
    "A 4MP Wi-Fi bullet camera with two-way audio, local microSD support and weather-resistant IP65 construction.",
    [
      "2560 × 1440 resolution at up to 20 fps",
      "2.8 mm fixed lens",
      "Wi-Fi plus built-in microphone and loudspeaker",
      "microSD support up to 256 GB",
      "IR illumination to 30 m; IP65 housing",
    ],
    ["TC-C34CN"],
    "https://www.iottech.co.nz/product/tiandy-4mp-fixed-wi-fi-bullet-camera-tc-c34cn-9ata-28",
    "https://www.iottech.co.nz/storage/files/datasheet/1870.pdf",
  ],
  [
    "dahua-pfa130",
    "Dahua Water-proof Junction Box PFA130-E",
    "Dahua",
    "DH-PFA130-E",
    "accessory",
    "An aluminium Dahua junction box for routing and protecting camera cabling at the mounting point.",
    [
      "Aluminium-alloy enclosure",
      "IP66 protection",
      "Bottom and side cable outlets",
      "124.3 mm diameter × 41.0 mm",
      "Up to 3 kg load rating",
    ],
    undefined,
    "https://www.iottech.co.nz/product/PFA130-E-Dahua-Waterproof-Junction-Box-PFA130E",
    "https://www.iottech.co.nz/storage/files/datasheet/512.pdf",
  ],
  [
    "dahua-hdw3667",
    "Dahua 6MP Smart Dual Light Fixed-focal Eyeball WizSense Network Camera White",
    "Dahua",
    "DH-IPC-HDW3667EM-S-IL-ANZ",
    "camera",
    "A 6MP Dahua WizSense turret camera with AI-assisted people and vehicle detection, dual illuminators and an integrated microphone.",
    [
      "6MP WizSense network camera",
      "IR and warm-light illumination",
      "Human and vehicle classification",
      "Built-in microphone",
      "Outdoor IP67-rated housing",
    ],
    undefined,
    "https://www.iottech.co.nz/product/dahua-6mp-smart-dual-light-fixed-focal-eyeball-wizsense-network-camera-white",
    "https://www.iottech.co.nz/storage/files/datasheet/1471.pdf",
  ],
  [
    "dahua-hdw3867",
    "Dahua 8MP Smart Dual Light Fixed-focal Eyeball WizSense Network Camera",
    "Dahua",
    "DH-IPC-HDW3867EM-S-IL-ANZ",
    "camera",
    "An 8MP Dahua WizSense turret camera for detailed 4K surveillance, using smart dual illumination and human/vehicle classification for clearer event recording.",
    [
      "8MP / 3840 × 2160 video",
      "IR and warm-light reach up to 30 m",
      "SMD 4.0 human and vehicle filtering",
      "Built-in microphone and microSD support",
      "H.265 compression and IP67 protection",
    ],
    undefined,
    "https://www.securitywholesalers.com.au/product/dahua-dh-ipc-hdw3867em-s-il-anz-with-smart-warm-light-30m-ir/",
    "https://www.securitywholesalers.com.au/files/DH-IPC-HDW3867EM-S-IL-ANZ_datasheet.pdf",
  ],
  [
    "dahua-pfb2204w",
    "Dahua Wall Mount Bracket PFB2204W",
    "Dahua",
    "DH-PFB2204W",
    "accessory",
    "A Dahua wall-mount accessory. No matching IoT Tech public product page or supplier datasheet was available for this exact code at verification time.",
    ["Dahua wall-mount accessory", "Stock and compatibility on request"],
  ],
  [
    "dahua-nvr4104",
    "Dahua 4CH Compact 1U 4PoE 1HDD Lite Network Video Recorder",
    "Dahua",
    "DHI-NVR4104HS-P-4KS3",
    "nvr",
    "A compact four-channel Dahua Lite NVR for 4K recording, with integrated PoE and recorder-side smart motion tools.",
    [
      "4K recording support",
      "Four-channel compact NVR",
      "Smart Motion Detection can distinguish people and vehicles",
      "Integrated PoE and single-HDD design",
      "Remote management and playback",
    ],
    undefined,
    "https://www.iottech.co.nz/product/dahua-nvr4104hs-p-4ks3",
    "https://www.iottech.co.nz/storage/files/datasheet/911.pdf",
  ],
  [
    "dahua-nvr4108",
    "Dahua 8CH Compact 1U 8PoE 1HDD Lite Network Video Recorder",
    "Dahua",
    "DHI-NVR4108HS-8P-4KS3",
    "nvr",
    "An eight-channel compact Dahua PoE NVR designed for 4K monitoring and local video storage.",
    [
      "Eight-channel compact NVR",
      "Eight PoE ports",
      "4K recording support",
      "Single-HDD design",
    ],
    undefined,
    "https://www.iottech.co.nz/product/DHI-NVR4108HS-8P-4KS3-8CH-Compact-1U-8PoE-1HDD-Lite-Network-Video-Recorder",
    "https://www.iottech.co.nz/storage/files/datasheet/815.pdf",
  ],
  [
    "dahua-hdw3649",
    "Dahua 6MP Smart Dual Illumination Active Deterrence Fixed-focal Eyeball WizSense Network Camera",
    "Dahua",
    "DH-IPC-HDW3649H-AS-PV-ANZ-S2",
    "camera",
    "A 6MP active-deterrence Dahua WizSense turret camera. The public IoT Tech listing located during verification is the black -BLK suffix model; confirm colour and lens before ordering.",
    [
      "6MP WizSense turret camera",
      "Smart dual illumination",
      "Active deterrence capability",
      "Colour/lens confirmation required",
    ],
    undefined,
    "https://www.iottech.co.nz/product/dahua-6mp-smart-dual-illumination-active-deterrence-fixed-focal-eyeball-wizsense-network-camera-black",
  ],
  [
    "hikvision-2387",
    "HIKVISION 4K 8 MP Smart Hybrid Light with ColorVu Fixed Turret Network Camera",
    "HIKVISION",
    "DS-2CD2387G2H-LISU-SL",
    "camera",
    "An 8MP Smart Hybrid Light ColorVu turret camera with AI people/vehicle filtering, two-way audio and an active warning function.",
    [
      "8MP / 3840 × 2160 imaging",
      "Smart Hybrid Light and 130 dB WDR",
      "Deep-learning human and vehicle classification",
      "Two-way audio with strobe and sound warning",
      "microSD support up to 512 GB; IP67",
    ],
    undefined,
    "https://www.iottech.co.nz/product/hikvision-8-mp-smart-hybrid-light-with-colorvu-fixed-turret-network-camera",
    "https://www.iottech.co.nz/storage/files/datasheet/936.pdf",
  ],
  [
    "hilook-t289",
    "HiLook 8 MP Dual Light MD 2.0 Fixed Turret Network Camera",
    "HiLook",
    "IPC-T289H-MU/SL(2.8mm)",
    "camera",
    "An 8MP HiLook fixed-turret camera using dual-light night imaging, people/vehicle classification and active audio-light deterrence.",
    [
      "8MP resolution",
      "Smart Hybrid Light with three lighting modes",
      "120 dB WDR and H.265+ compression",
      "Arrayed dual microphones",
      "Active red/blue flash and audio alarm; IP67",
    ],
    ["IPC-T289H-MU/SL"],
    "https://www.iottech.co.nz/product/hilook-8-mp-dual-light-md-2.0-fixed-turret-network-camera",
  ],
  [
    "hikvision-7604",
    "HIKVISION 4ch PoE, 1HDD NVR",
    "HIKVISION",
    "DS-7604NXI-K1/4P",
    "nvr",
    "A four-channel Hikvision PoE NVR supporting up to 8MP input, 4K HDMI output and one local hard drive.",
    [
      "Up to four IP cameras",
      "Up to 8MP input and 40 Mbps bandwidth",
      "H.265+ compression",
      "4K HDMI and VGA output",
      "One SATA drive up to 8 TB",
    ],
    undefined,
    "https://www.iottech.co.nz/product/hikvision-4ch-poe--2hdd-nvr",
    "https://www.iottech.co.nz/storage/files/datasheet/945.pdf",
  ],
  [
    "hikvision-2386",
    "HIKVISION 4K 8MP AcuSense Strobe Light and Audible Warning Fixed Turret Network Camera",
    "HIKVISION",
    "DS-2CD2386G2-ISU-SL",
    "camera",
    "An 8MP AcuSense fixed-turret camera with active strobe/light warning, audio alarm and AI filtering for people and vehicles.",
    [
      "8MP / 4K imaging",
      "120 dB WDR and H.265+ compression",
      "Deep-learning people and vehicle classification",
      "Strobe and audible-warning deterrence",
      "Built-in audio; IP67 protection",
    ],
    undefined,
    "https://www.iottech.co.nz/product/hikvision-4k-acusense-strobe-light-and-audible-warning-fixed-turret-network-camera",
    "https://www.iottech.co.nz/storage/files/datasheet/932.pdf",
  ],
  [
    "hikvision-2366",
    "HIKVISION 6 MP AcuSense Strobe Light and Audible Warning Fixed Turret Network Camera",
    "HIKVISION",
    "DS-2CD2366G2-ISU-SL",
    "camera",
    "A 6MP AcuSense fixed-turret camera with people/vehicle filtering and strobe-and-audio active deterrence.",
    [
      "6MP imaging",
      "120 dB WDR and H.265+ compression",
      "Deep-learning people and vehicle classification",
      "Strobe and audible-warning deterrence",
      "Built-in audio; IP67 protection",
    ],
    undefined,
    "https://www.iottech.co.nz/product/hikvision-6-mp-acusense-strobe-light-and-audible-warning-fixed-turret-network-camera",
    "https://www.iottech.co.nz/storage/files/datasheet/931.pdf",
  ],
  [
    "hikvision-2367",
    "HIKVISION 6 MP Smart Hybrid Light with ColorVu Fixed Turret Network Camera",
    "HIKVISION",
    "DS-2CD2367G2H-LISU-SL",
    "camera",
    "A 6MP ColorVu fixed-turret camera with Smart Hybrid Light, AI people/vehicle classification, two-way audio and active warning.",
    [
      "6MP / 3200 × 1800 imaging",
      "Smart Hybrid Light and 130 dB WDR",
      "Deep-learning people and vehicle classification",
      "Two-way audio with strobe and sound warning",
      "microSD support up to 512 GB; IP67",
    ],
    undefined,
    "https://www.iottech.co.nz/product/hikvision-6-mp-smart-hybrid-light-with-colorvu-fixed-turret-network-camera",
    "https://www.iottech.co.nz/storage/files/datasheet/935.pdf",
  ],
  [
    "hilook-nvr104",
    "HiLook 4-ch Mini 1U 4 PoE 4K NVR With 2TB HDD",
    "HiLook",
    "NVR-104MH-C4P(D)-2TB",
    "nvr",
    "A four-channel HiLook mini NVR with integrated four-port PoE and supplied 2TB storage.",
    [
      "Four IP-camera channels",
      "H.265+/H.265/H.264+/H.264 formats",
      "Up to 40 Mbps incoming bandwidth",
      "Four PoE ports",
      "2TB HDD included",
    ],
    ["NVR-104MH-C4P"],
    "https://www.iottech.co.nz/product/hilook-4-ch-mini-1u-4-poe-4k-nvr-with-2tb-hdd",
    "https://www.iottech.co.nz/storage/files/datasheet/1408.pdf",
  ],
  [
    "hilook-nvr108",
    "HiLook NVR-108MH-K/8P 8 POE NVR with 4TB HDD",
    "HiLook",
    "NVR-108MH-K/8P(B)-4TB",
    "nvr",
    "An eight-channel HiLook NVR with eight PoE ports and a supplied 4TB HDD.",
    ["Eight IP-camera channels", "Eight PoE ports", "4TB HDD included"],
    ["NVR-108MH-K/8P"],
    "https://www.iottech.co.nz/product/HiLook-NVR-108MH-K-8P-8-POE-NVR-with-4TB-HDD",
  ],
  [
    "hikvision-7616",
    "HIKVISION 16ch PoE, 2HDD NVR With 4TB",
    "HIKVISION",
    "DS-7616NI-M2/16P-4TB",
    "nvr",
    "A 16-channel Hikvision PoE NVR with two HDD positions and a supplied 4TB drive.",
    ["16-channel PoE NVR", "Two HDD positions", "4TB HDD included"],
    ["DS-7616NI-M2/16P"],
    "https://www.iottech.co.nz/product/hikvision-16ch-poe--2hdd-nvr-with-4tb",
  ],
].map(
  ([
    id,
    name,
    brand,
    sku,
    category,
    description,
    features,
    aliases,
    sourceUrl,
    datasheetUrl,
  ]) =>
    ({
      id,
      name,
      brand,
      sku,
      category,
      description,
      features,
      aliases,
      sourceUrl,
      datasheetUrl,
    } as Curated)
);

// Supplier product photography used only when the iSmartTech catalogue API has
// no matching image for a selected product. This keeps API imagery primary while
// avoiding generic placeholders on curated product cards and detail pages.
const supplierFallbackImages: Record<string, string> = {
  "tiandy-tc-c36xn":
    "https://www.iottech.co.nz/storage/products/iot-tech-tiandy-6mp-duallight-turret-camera---pl-bg-20260610140630.png",
  "tiandy-tc-c34xn":
    "https://www.iottech.co.nz/storage/products/iot-tech-tiandy-4mp-fixed-turret-camera--tc-c34xn-2ena-28-bg-20260612120635.png",
  "tiandy-tc-h333k":
    "https://www.iottech.co.nz/storage/products/iot-tech-tiandy-3mp-fixed-color-maker-wi-fi-pt-camera-tc-h333k-bg-20250829160827.png",
  "tiandy-tc-r3105":
    "https://www.iottech.co.nz/storage/products/iot-tech-tiandy-1-hdd-5ch-pse-nvrspec:bp4euls20-bg-20250922140923.png",
  "tiandy-tc-r3110":
    "https://www.iottech.co.nz/storage/products/iot-tech-tiandy-1hdd-10ch-advanced-pse-nvrspec:ibp8eulsv20-bg-20250922140943.png",
  "tiandy-tc-r3104":
    "https://www.iottech.co.nz/storage/products/iot-tech-tiandy-1hdd-4ch-pse--nvr-bg-20250226220250.png",
  "tiandy-tc-h343k":
    "https://www.iottech.co.nz/storage/products/iot-tech-tiandy-4mp-fixed-color-maker-4g-pt-camera-bg-20250812140818.png",
  "tiandy-tc-c34cn":
    "https://www.iottech.co.nz/storage/products/iot-tech-tiandy-4mp-fixed-wi-fi-bullet-camera-tc-c34cn-9ata-28-bg-20260401140456.png",
  "dahua-pfa130":
    "https://www.iottech.co.nz/storage/products/iot-tech-dahua-water-proof-junction-box-pfa130-e-bg-20240314140343.png",
  "dahua-hdw3667":
    "https://www.iottech.co.nz/storage/products/iot-tech-dahua-6mp-smart-dual-light-fixed-focal-eyeball-wizsense-network-camera-white-bg-20251217161232.png",
  "dahua-hdw3867":
    "https://materialfile.dahuasecurity.com/uploads/image/20241129/IPC-HDW3867EM-AS-IL-ANZ_thumb.png",
  "dahua-pfb2204w":
    "https://www.securitywholesalers.com.au/wp-content/uploads/2026/02/1_0_99_44_10592_767681991_crop_thumb.png",
  "dahua-nvr4104":
    "https://www.iottech.co.nz/storage/products/iot-tech-dahua-nvr4104hs-p-4ks3-bg-20240529120527.png",
  "dahua-nvr4108":
    "https://www.iottech.co.nz/storage/products/iot-tech-8ch-compact-1u-8poe-1hdd-lite-network-video-recorder-bg-20240327130320.png",
  "dahua-hdw3649":
    "https://www.iottech.co.nz/storage/products/iot-tech-dahua-6mp-smart-dual-illumination-active-deterrence-fixed-focal-eyeball-wizsense-network-camera-black-bg-20250908130910.png",
  "hikvision-2387":
    "https://www.iottech.co.nz/storage/products/iot-tech-hikvision-8-mp-smart-hybrid-light-with-colorvu-fixed-turret-network-camera-bg-20240711100756.png",
  "hilook-t289":
    "https://assets.hikvision.com/prd/public/all/image/m000148768/%E6%97%A0%E6%A0%87%E9%A2%9812.png?eo-img.format=webp",
  "hikvision-7604":
    "https://www.iottech.co.nz/storage/products/iot-tech-hikvision-4ch-poe--2hdd-nvr-bg-20240711110755.png",
  "hikvision-2386":
    "https://www.iottech.co.nz/storage/products/iot-tech-hikvision-4k-acusense-strobe-light-and-audible-warning-fixed-turret-network-camera-bg-20240711100704.png",
  "hikvision-2366":
    "https://www.iottech.co.nz/storage/products/iot-tech-hikvision-6-mp-acusense-strobe-light-and-audible-warning-fixed-turret-network-camera-bg-20240711100714.png",
  "hikvision-2367":
    "https://www.iottech.co.nz/storage/products/iot-tech-hikvision-6-mp-smart-hybrid-light-with-colorvu-fixed-turret-network-camera-bg-20240711100739.png",
  "hilook-nvr104":
    "https://www.iottech.co.nz/storage/products/iot-tech-hilook-4-ch-mini-1u-4-poe-4k-nvr-with-2tb-hdd-bg-20250806120831.png",
  "hilook-nvr108":
    "https://www.iottech.co.nz/storage/products/iot-tech-hilook-nvr-108mh-k8p-8-poe-nvr-with-4tb-hdd-bg-20260713130751.png",
  "hikvision-7616":
    "https://assets.hikvision.com/prd/normal/all/image/m000060966/MB-203Y-P-HIKVISION.png",
};

const supplierFallbackGalleries: Record<string, string[]> = {
  "hilook-t289": [
    "https://assets.hikvision.com/prd/public/all/image/m000148768/%E6%B5%B7%E8%9E%BA51%E5%8F%8Cmic%E5%A3%B0%E5%85%89%E6%8A%A5%E8%AD%A6-%E6%B5%B7%E5%BA%B7%E7%99%BD-%E6%AD%A3.png?eo-img.format=webp",
  ],
  "dahua-hdw3667": [
    "/assets/DH-IPC-HDW3667EM-S-IL-ANZ-BLK.png",
  ],
};

type EditorialCopy = { summary: string; description: string };

// Rewritten for iSmartTech from the linked manufacturer datasheets and supplier listings.
// These are intentionally product-specific retail descriptions, not copied supplier text.
const editorialCopy: Record<string, EditorialCopy> = {
  "tiandy-tc-c36xn": {
    summary:
      "6MP DualLight turret camera with built-in audio, Smart IR and IP66 protection.",
    description:
      "The Tiandy TC-C36XN is a compact 6MP turret camera for clear, fixed-position coverage around homes, shops and small commercial premises. Its 2.8 mm lens gives a broad view of entrances, driveways and general outdoor areas, while the low-light sensor, Smart IR and up-to-30 m infrared range help maintain useful detail after dark. A built-in microphone adds audio context to recorded events, and support for modern S+265 compression helps keep storage demands under control. PoE power allows a single network cable to carry both data and power, and the IP66-rated housing is designed for year-round indoor or outdoor installation.",
  },
  "tiandy-tc-c34xn": {
    summary:
      "4MP fixed turret camera with dual illumination, built-in microphone and PoE.",
    description:
      "The Tiandy TC-C34XN combines 4MP video with a compact fixed-turret design for everyday surveillance at homes and business premises. Its 2.8 mm lens is suited to broad scene coverage, while infrared illumination reaches up to 30 m and white-light assistance helps preserve usable colour detail when an event needs attention. Human and vehicle classification can focus alerts on meaningful activity rather than general motion, and the integrated microphone records accompanying audio. With PoE support, ONVIF compatibility and an IP66 housing, it is a practical option for new wired-camera installations or straightforward replacements.",
  },
  "tiandy-tc-h333k": {
    summary:
      "3MP Wi-Fi pan-and-tilt camera with two-way audio, local recording and IR night vision.",
    description:
      "The Tiandy TC-H333K is a flexible 3MP Wi-Fi camera designed for locations where cable-free networking and adjustable coverage are useful. Pan and tilt movement lets the user reposition the view through the app, while the 4 mm lens, Smart IR and up-to-30 m night range support monitoring through changing light conditions. Built-in microphone and speaker hardware enables two-way communication, and a microSD card can be used for local recording without relying solely on a recorder. Its IP66-rated enclosure makes it suitable for sheltered outdoor positions as well as indoor monitoring.",
  },
  "tiandy-tc-r3105": {
    summary:
      "Five-channel PoE NVR with four powered camera ports and single-drive local recording.",
    description:
      "The Tiandy TC-R3105 is a compact network video recorder for smaller IP camera systems that need tidy local recording and simple camera connection. Four integrated PoE ports can power compatible cameras directly, reducing the number of separate adaptors and network connections required at installation. The recorder supports up to five camera channels, H.265-family compression and a single hard-drive position for retaining footage on site. HDMI and VGA video outputs make it suitable for a local monitor, while ONVIF and RTSP support provide flexibility when working with compatible network cameras.",
  },
  "tiandy-tc-r3110": {
    summary:
      "Ten-channel PSE NVR with eight PoE ports, 4K HDMI output and one HDD bay.",
    description:
      "The Tiandy TC-R3110 is intended for growing camera systems that need more channels without moving to a large recorder. It supports up to ten network cameras, with eight integrated PoE ports supplying compatible cameras over the same cable used for data. A single-drive bay provides local recording, while the 4K HDMI output is suited to detailed live-view and playback on a compatible display. Support for S+265, H.265, ONVIF and RTSP helps manage storage efficiently and maintain compatibility with a wide range of network-camera workflows.",
  },
  "tiandy-tc-r3104": {
    summary:
      "Four-channel PoE NVR with 60 Mbps input bandwidth and one-HDD local storage.",
    description:
      "The Tiandy TC-R3104 is a compact four-channel PSE recorder for small wired camera systems. Four integrated PoE ports simplify installation by carrying power and network data to compatible cameras over one cable, while 60 Mbps incoming bandwidth supports a practical mix of higher-resolution streams. The recorder offers HDMI and VGA monitor outputs, four-channel synchronous playback and one drive bay for local retention of footage. S+265 compression, ONVIF support and cloud-upgrade capability make it a straightforward base for a compact, maintainable surveillance system.",
  },
  "tiandy-tc-h343k": {
    summary:
      "4MP 4G pan-and-tilt camera with local storage, audio and IP65 weather protection.",
    description:
      "The Tiandy TC-H343K is a 4MP pan-and-tilt camera designed for sites where mobile connectivity and flexible positioning are more useful than a fixed wired network. Its 4G connection, motorised movement and 4 mm lens help cover changing viewpoints, while infrared illumination reaches up to 30 m for night monitoring. Two-way audio and microSD recording provide local interaction and footage storage, and the weather-resistant IP65 enclosure supports outdoor deployment. It is a useful option for remote properties, temporary coverage and solar-oriented surveillance projects where conventional cabling is difficult.",
  },
  "tiandy-tc-c34cn": {
    summary:
      "4MP Wi-Fi bullet camera with two-way audio, local microSD recording and IP65 housing.",
    description:
      "The Tiandy TC-C34CN is a 4MP Wi-Fi bullet camera that combines a wide 2.8 mm view with practical smart-home-style connectivity. Infrared illumination up to 30 m supports night monitoring, while the fixed lens and adjustable mounting make it suitable for driveways, entrances and perimeter viewpoints. A built-in microphone and loudspeaker enable two-way communication, and microSD support allows recordings to be stored locally. With Wi-Fi, Smart Alarm functions and an IP65-rated enclosure, it offers a flexible camera option for locations where running a network cable is not preferred.",
  },
  "dahua-pfa130": {
    summary:
      "IP66 aluminium junction box for clean, protected Dahua camera cable termination.",
    description:
      "The Dahua PFA130-E is a purpose-built junction box that keeps camera cable joins protected and neatly contained at the mounting point. Its aluminium-alloy body is IP66 rated and includes bottom and side cable exits, allowing the installer to choose a cleaner cable route for wall or ceiling installations. The compact enclosure is designed for compatible Dahua cameras and supports operation across a broad outdoor temperature range. It is particularly useful where exposed connectors, loose cable loops or difficult wall penetrations would otherwise affect the finish and long-term reliability of an installation.",
  },
  "dahua-hdw3667": {
    summary:
      "6MP WizSense turret camera with smart dual illumination, built-in microphone and IP67 protection.",
    description:
      "The Dahua DH-IPC-HDW3667EM-S-IL-ANZ brings detailed 6MP WizSense coverage to a compact turret camera for residential and commercial security systems. Smart dual illumination combines infrared monitoring with warm white light when an event requires clearer colour detail and a visible deterrent. Dahua's smart detection functions focus on people and vehicles to help reduce nuisance notifications, while the integrated microphone adds audio evidence to video recordings. H.265 compression helps use storage efficiently, and the IP67-rated body is built for reliable outdoor operation in demanding weather.",
  },
  "dahua-hdw3867": {
    summary:
      "8MP 4K WizSense turret camera with Smart Dual Light, audio and AI event filtering.",
    description:
      "The Dahua DH-IPC-HDW3867EM-S-IL-ANZ delivers 4K-level detail for entrances, driveways and larger outdoor areas where identification-quality footage matters. Smart Dual Light switches between infrared and warm white illumination to balance discreet night monitoring with full-colour evidence and active deterrence when needed. WizSense analytics can distinguish people and vehicles from general movement, helping create more relevant alerts and searches. The camera also includes a microphone, microSD recording support, H.265 compression and an IP67 enclosure, making it well suited to robust standalone or recorder-based IP systems.",
  },
  "dahua-pfb2204w": {
    summary:
      "Dahua wall-mount bracket for compatible camera installation and cable routing.",
    description:
      "The Dahua PFB2204W is a wall-mount accessory intended to provide a stable mounting position for compatible Dahua cameras. It is useful when a camera needs to project away from a wall, achieve a clearer viewing angle or route its cable more neatly than a direct surface mount allows. Because bracket compatibility varies by camera body and installation location, confirm the supported model, required junction box and load arrangement before ordering. This item is supplied on request while exact stock and compatibility are confirmed.",
  },
  "dahua-nvr4104": {
    summary:
      "Four-channel 4K PoE NVR with smart motion detection and one-HDD local recording.",
    description:
      "The Dahua DHI-NVR4104HS-P-4KS3 is a compact Lite Series recorder for smaller IP camera systems that need detailed 4K recording and integrated PoE connection. It can operate as a main recorder, a remote-management point or a backup recording device, with a simple local interface for day-to-day control. Recorder-side Smart Motion Detection can identify people and vehicles, while compatible cameras can add functions such as perimeter protection and face-related analytics. With four PoE ports, one HDD position and remote playback support, it provides a neat foundation for a four-camera surveillance installation.",
  },
  "dahua-nvr4108": {
    summary:
      "Eight-channel compact 4K PoE NVR with eight powered ports and one-HDD recording.",
    description:
      "The Dahua DHI-NVR4108HS-8P-4KS3 is designed for medium-size IP camera systems that need an organised, local recording point with integrated PoE. Eight ports can power compatible cameras directly, reducing the need for an additional PoE switch in many installations. The compact 1U chassis supports 4K surveillance workflows and one internal hard drive for local footage retention. It is a practical choice for users who want to expand beyond a four-camera system while keeping wiring, live viewing and playback within one recorder platform.",
  },
  "dahua-hdw3649": {
    summary:
      "6MP active-deterrence WizSense turret camera with smart dual illumination.",
    description:
      "The Dahua DH-IPC-HDW3649H-AS-PV-ANZ-S2 is a 6MP WizSense turret camera built around proactive event response as well as video capture. Smart dual illumination supports infrared monitoring and visible light when an event calls for clearer colour detail, while the active-deterrence design is intended to discourage unwanted activity at the scene. AI-assisted people and vehicle detection can make alerts more relevant than simple motion detection alone. Confirm the preferred colour, lens option and compatibility before ordering, as the publicly listed supplier record for this range is the black-suffix variant.",
  },
  "hikvision-2387": {
    summary:
      "8MP Smart Hybrid Light ColorVu turret with AcuSense filtering, two-way audio and active warning.",
    description:
      "The Hikvision DS-2CD2387G2H-LISU-SL is an 8MP turret camera designed for full-colour monitoring and proactive deterrence around homes and businesses. Smart Hybrid Light adapts the camera's lighting approach to the scene, while ColorVu imaging and 130 dB WDR help retain useful detail in low light and difficult backlit areas. Deep-learning classification focuses alarms on people and vehicles, and the onboard microphone, speaker and strobe light support two-way communication and an immediate warning response. Local microSD storage, H.265+ compression and IP67 protection complete a versatile outdoor camera solution.",
  },
  "hilook-t289": {
    summary:
      "8MP dual-light turret camera with smart detection, active warning and IP67 outdoor protection.",
    description:
      "The HiLook IPC-T289H-MU/SL brings 8MP recording and smart dual-light monitoring to a compact fixed-turret form. Its hybrid illumination system can work with infrared, white light or a smart mode that responds to activity, helping deliver useful night footage without running bright lighting continuously. People and vehicle classification helps prioritise events, while the active red-and-blue flash and audio alarm can provide an immediate deterrent. Dual microphones, H.265+ compression and an IP67-rated housing make it a strong option for entrances, driveways and perimeter surveillance.",
  },
  "hikvision-7604": {
    summary:
      "Four-channel Hikvision PoE NVR with 4K output, H.265+ compression and one HDD bay.",
    description:
      "The Hikvision DS-7604NXI-K1/4P is a four-channel PoE network video recorder for compact IP camera systems that need local storage and straightforward monitor output. It supports up to 8MP camera input, up to 40 Mbps incoming bandwidth and simultaneous HDMI/VGA display, including HDMI output up to 4K. H.265+ compression helps reduce storage requirements, while a single SATA bay accepts a compatible hard drive up to 8TB. Smart search, playback and multiple video-content analytics events help make recorded footage easier to review.",
  },
  "hikvision-2386": {
    summary:
      "8MP AcuSense turret camera with strobe, audio warning, built-in sound and IP67 protection.",
    description:
      "The Hikvision DS-2CD2386G2-ISU-SL is an 8MP fixed-turret camera for outdoor sites that benefit from both detailed video and an active response to intrusion. AcuSense deep-learning analysis distinguishes people and vehicles from irrelevant movement, helping reduce unnecessary alerts. DarkFighter low-light capability, 120 dB true WDR and H.265+ compression support clearer and more efficient recording across changing conditions. Its strobe light and audible warning can deter activity in real time, while built-in audio and IP67 protection support durable, evidence-rich monitoring.",
  },
  "hikvision-2366": {
    summary:
      "6MP AcuSense turret camera with human/vehicle filtering, audible warning and outdoor protection.",
    description:
      "The Hikvision DS-2CD2366G2-ISU-SL is a 6MP outdoor turret camera that pairs detailed footage with AcuSense event filtering and active warning functions. Deep-learning analysis focuses on people and vehicles, reducing the noise created by general motion and making alerts easier to action. DarkFighter low-light performance, 120 dB WDR and H.265+ compression help maintain usable footage while controlling storage needs. The camera's strobe and audio warning can provide an on-site response, and its IP67-rated enclosure is suited to exposed outdoor locations.",
  },
  "hikvision-2367": {
    summary:
      "6MP Smart Hybrid Light ColorVu turret with two-way audio, active warning and IP67 housing.",
    description:
      "The Hikvision DS-2CD2367G2H-LISU-SL is a 6MP ColorVu turret camera designed for full-colour monitoring and active protection at residential or commercial sites. Smart Hybrid Light adapts to available light, while 130 dB WDR helps manage challenging backlight and high-contrast scenes. Deep-learning classification focuses alerts on people and vehicles, and the built-in speaker, microphone and strobe/sound warning can support two-way communication and visible deterrence. With microSD support, H.265+ compression and IP67 protection, it is suitable for practical outdoor recorder-based or standalone deployments.",
  },
  "hilook-nvr104": {
    summary:
      "Four-channel 4K Mini NVR with four PoE ports and a supplied 2TB HDD.",
    description:
      "The HiLook NVR-104MH-C4P(D)-2TB is a compact four-channel recorder for IP systems that need integrated PoE connections and ready-to-use local storage. Four powered network ports can simplify camera installation, while the supplied 2TB hard drive provides an immediate place to retain recordings. The recorder supports modern H.265+/H.265 formats, up to 40 Mbps incoming bandwidth and HDMI/VGA output for local viewing. Motion Detection 2.0 and configurable video analytics events help users locate important activity more efficiently during playback.",
  },
  "hilook-nvr108": {
    summary:
      "Eight-channel PoE NVR with supplied 4TB storage for expanded HiLook camera systems.",
    description:
      "The HiLook NVR-108MH-K/8P(B)-4TB is an eight-channel recorder designed for an expanded wired IP camera system without needing a separate PoE switch for every camera. Its eight powered ports make camera connection more orderly, while the supplied 4TB hard drive gives the system ready local recording capacity. It is suited to homes, retail premises and small commercial sites that need more coverage than a four-channel recorder can provide. Confirm camera resolution, recording-retention requirements and final drive capacity before selecting the system configuration.",
  },
  "hikvision-7616": {
    summary:
      "Sixteen-channel PoE NVR with two HDD positions and supplied 4TB storage.",
    description:
      "The Hikvision DS-7616NI-M2/16P-4TB is a 16-channel PoE recorder intended for larger IP camera installations that need centralised connection, local storage and room to grow. Sixteen powered camera ports help simplify structured wiring, while two HDD positions provide a more flexible retention arrangement than a compact single-drive recorder. A supplied 4TB drive gives the system an initial recording base, but final retention depends on camera count, resolution, frame rate and analytics settings. It is a strong starting point for larger homes, business premises and multi-area surveillance systems.",
  },
};

const normalise = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");
const ids = new Set(items.map((item) => `curated-${item.id}`));
export const isCuratedProduct = (product: Product) => ids.has(product.id);

export function createCuratedProducts(allProducts: Product[]): Product[] {
  return items.map((item) => {
    const keys = [item.sku, ...(item.aliases ?? [])].map(normalise);
    const source = allProducts.find((product) =>
      keys.some((key) => {
        const sku = normalise(product.sku);
        return sku.includes(key) || key.includes(sku);
      })
    );
    const exactSource = allProducts.find(
      (product) => normalise(product.sku) === normalise(item.sku)
    );
    const isNvr = item.category === "nvr";
    const isAccessory = item.category === "accessory";
    return {
      id: `curated-${item.id}`,
      name: item.name,
      brand: item.brand,
      sku: item.sku,
      category: isNvr
        ? "NVR"
        : isAccessory
        ? "Accessories"
        : "Wired IP Cameras",
      categoryIds: isNvr ? [18] : isAccessory ? [71] : [14],
      price: exactSource?.price ?? 0,
      priceOnRequest: !exactSource,
      oldPrice: exactSource?.oldPrice,
      stock: exactSource?.stock ?? 0,
      rating: source?.rating ?? 0,
      reviews: source?.reviews ?? 0,
      image: exactSource?.image ?? supplierFallbackImages[item.id],
      galleryImages: exactSource?.galleryImages ?? supplierFallbackGalleries[item.id],
      sourceProductId: exactSource?.id,
      sourceUrl: item.sourceUrl,
      datasheetUrl: item.datasheetUrl,
      colors: source?.colors,
      badge: source?.badge,
      icon: isNvr ? "NVR" : isAccessory ? "ACC" : "CAM",
      accent: isNvr ? "orange" : "blue",
      shortDescription: editorialCopy[item.id]?.summary ?? item.description,
      description: editorialCopy[item.id]?.description ?? item.description,
      features: item.features,
      specifications: {
        Model: item.sku,
        Category: isNvr
          ? "Network video recorder"
          : isAccessory
          ? "Camera accessory"
          : "Network camera",
      },
      published: true,
    };
  });
}
