import type { Product } from "../types";

type Curated = {
  id: string; name: string; brand: string; sku: string; category: "camera" | "nvr" | "accessory"; aliases?: string[];
  description: string; features: string[];
};

const items: Curated[] = [
  ["tiandy-tc-c36xn", "Tiandy 6MP DualLight Turret Camera - PL", "Tiandy", "TC-C36XN 2ENA-28", "camera", "6MP DualLight turret network camera.", ["6MP resolution", "DualLight illumination", "Fixed turret form factor"]],
  ["tiandy-tc-c34xn", "Tiandy 4MP Fixed Turret Camera TC-C34XN 2ENA-28", "Tiandy", "TC-C34XN 2ENA-28", "camera", "4MP fixed turret network camera.", ["4MP resolution", "Fixed turret design", "2.8mm model"], ["TC-C34XN"]],
  ["tiandy-tc-h333k", "Tiandy 3MP Fixed Color Maker Wi-Fi PT Camera TC-H333K", "Tiandy", "TC-H333K", "camera", "3MP Color Maker Wi-Fi pan and tilt camera.", ["3MP resolution", "Wi-Fi connectivity", "Pan and tilt viewing"]],
  ["tiandy-tc-r3105", "Tiandy 1 HDD 5ch PSE NVR", "Tiandy", "TC-R3105 Spec:I/B/P4/Eu/L/S/V2.0", "nvr", "5-channel PSE network video recorder with one HDD bay.", ["5 channels", "PSE camera ports", "One HDD bay"], ["TC-R3105"]],
  ["tiandy-tc-r3110", "Tiandy 1HDD 10ch Advanced PSE NVR", "Tiandy", "TC-R3110 Spec:I/B/P8/EU/L/S/V2.0", "nvr", "10-channel advanced PSE network video recorder with one HDD bay.", ["10 channels", "Advanced PSE ports", "One HDD bay"], ["TC-R3110"]],
  ["tiandy-tc-r3104", "Tiandy 1HDD 4CH PSE NVR", "Tiandy", "TC-R3104 Spec:I/B/P4/C/L/S/V2.0", "nvr", "4-channel PSE network video recorder with one HDD bay.", ["4 channels", "PSE camera ports", "One HDD bay"]],
  ["tiandy-tc-h343k", "Tiandy 4MP Fixed Color Maker 4G Solar PT Camera", "Tiandy", "TC-H343K 9DA-4", "camera", "4MP Color Maker 4G solar pan and tilt camera.", ["4MP resolution", "4G connectivity", "Solar-ready PT design"], ["TC-H343K"]],
  ["tiandy-tc-c34cn", "Tiandy 4MP Fixed Wi-Fi Bullet Camera TC-C34CN 9ATA-28", "Tiandy", "TC-C34CN 9ATA-28", "camera", "4MP fixed Wi-Fi bullet camera.", ["4MP resolution", "Wi-Fi connectivity", "Fixed bullet design"], ["TC-C34CN"]],
  ["dahua-pfa130", "Dahua Water-proof Junction Box PFA130-E", "Dahua", "DH-PFA130-E", "accessory", "Waterproof cable-management junction box for compatible Dahua cameras.", ["Weather-resistant junction box", "Camera cable management", "PFA130-E model"]],
  ["dahua-hdw3667", "Dahua 6MP Smart Dual Light Fixed-focal Eyeball WizSense Network Camera White", "Dahua", "DH-IPC-HDW3667EM-S-IL-ANZ", "camera", "6MP Smart Dual Light fixed-focal eyeball WizSense network camera.", ["6MP resolution", "Smart Dual Light", "WizSense detection"]],
  ["dahua-hdw3867", "Dahua 8MP Smart Dual Light Fixed-focal Eyeball WizSense Network Camera", "Dahua", "DH-IPC-HDW3867EM-S-IL-ANZ", "camera", "8MP Smart Dual Light fixed-focal eyeball WizSense network camera.", ["8MP resolution", "Smart Dual Light", "WizSense detection"]],
  ["dahua-pfb2204w", "Dahua Wall Mount Bracket PFB2204W", "Dahua", "DH-PFB2204W", "accessory", "Wall-mount bracket for compatible Dahua camera installations.", ["Wall mounting", "Dahua camera accessory", "PFB2204W model"]],
  ["dahua-nvr4104", "Dahua 4CH Compact 1U 4PoE 1HDD Lite Network Video Recorder", "Dahua", "DHI-NVR4104HS-P-4KS3", "nvr", "Compact Dahua 4-channel Lite NVR with four PoE ports and one HDD bay.", ["4 channels", "4 PoE ports", "One HDD bay"]],
  ["dahua-nvr4108", "Dahua 8CH Compact 1U 8PoE 1HDD Lite Network Video Recorder", "Dahua", "DHI-NVR4108HS-8P-4KS3", "nvr", "Compact Dahua 8-channel Lite NVR with eight PoE ports and one HDD bay.", ["8 channels", "8 PoE ports", "One HDD bay"]],
  ["dahua-hdw3649", "Dahua 6MP Smart Dual Illumination Active Deterrence Fixed-focal Eyeball WizSense Network Camera", "Dahua", "DH-IPC-HDW3649H-AS-PV-ANZ-S2", "camera", "6MP active-deterrence fixed-focal eyeball WizSense network camera.", ["6MP resolution", "Smart Dual Illumination", "Active deterrence"]],
  ["hikvision-2387", "HIKVISION 4K 8 MP Smart Hybrid Light with ColorVu Fixed Turret Network Camera", "HIKVISION", "DS-2CD2387G2H-LISU-SL", "camera", "4K ColorVu fixed turret camera with Smart Hybrid Light.", ["8MP / 4K resolution", "Smart Hybrid Light", "ColorVu"]],
  ["hilook-t289", "HiLook 8 MP Dual Light MD 2.0 Fixed Turret Network Camera", "HiLook", "IPC-T289H-MU/SL(2.8mm)", "camera", "8MP Dual Light MD 2.0 fixed turret camera.", ["8MP resolution", "Dual Light", "MD 2.0 detection"], ["IPC-T289H-MU/SL"]],
  ["hikvision-7604", "HIKVISION 4ch PoE, 1HDD NVR", "HIKVISION", "DS-7604NXI-K1/4P", "nvr", "4-channel PoE network video recorder with one HDD bay.", ["4 channels", "Integrated PoE", "One HDD bay"]],
  ["hikvision-2386", "HIKVISION 4K 8MP AcuSense Strobe Light and Audible Warning Fixed Turret Network Camera", "HIKVISION", "DS-2CD2386G2-ISU-SL", "camera", "4K AcuSense turret camera with strobe light and audible warning.", ["8MP / 4K resolution", "AcuSense analytics", "Strobe and audible warning"]],
  ["hikvision-2366", "HIKVISION 6 MP AcuSense Strobe Light and Audible Warning Fixed Turret Network Camera", "HIKVISION", "DS-2CD2366G2-ISU-SL", "camera", "6MP AcuSense turret camera with strobe light and audible warning.", ["6MP resolution", "AcuSense analytics", "Strobe and audible warning"]],
  ["hikvision-2367", "HIKVISION 6 MP Smart Hybrid Light with ColorVu Fixed Turret Network Camera", "HIKVISION", "DS-2CD2367G2H-LISU-SL", "camera", "6MP ColorVu fixed turret camera with Smart Hybrid Light.", ["6MP resolution", "Smart Hybrid Light", "ColorVu"]],
  ["hilook-nvr104", "HiLook 4-ch Mini 1U 4 PoE 4K NVR With 2TB HDD", "HiLook", "NVR-104MH-C4P(D)-2TB", "nvr", "4-channel Mini 1U 4K NVR with four PoE ports and 2TB HDD.", ["4 channels", "4 PoE ports", "2TB HDD included"], ["NVR-104MH-C4P"]],
  ["hilook-nvr108", "HiLook NVR-108MH-K/8P 8 POE NVR with 4TB HDD", "HiLook", "NVR-108MH-K/8P(B)-4TB", "nvr", "8-channel PoE NVR with supplied 4TB HDD.", ["8 channels", "8 PoE ports", "4TB HDD included"], ["NVR-108MH-K/8P"]],
  ["hikvision-7616", "HIKVISION 16ch PoE, 2HDD NVR With 4TB", "HIKVISION", "DS-7616NI-M2/16P-4TB", "nvr", "16-channel PoE NVR with two HDD bays and 4TB storage.", ["16 channels", "Integrated PoE", "2 HDD bays / 4TB storage"], ["DS-7616NI-M2/16P"]],
].map(([id, name, brand, sku, category, description, features, aliases]) => ({ id, name, brand, sku, category, description, features, aliases } as Curated));

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const ids = new Set(items.map(item => `curated-${item.id}`));
export const isCuratedProduct = (product: Product) => ids.has(product.id);

export function createCuratedProducts(allProducts: Product[]): Product[] {
  return items.map((item) => {
    const keys = [item.sku, ...(item.aliases ?? [])].map(normalise);
    const source = allProducts.find(product => keys.some(key => {
      const sku = normalise(product.sku);
      return sku.includes(key) || key.includes(sku);
    }));
    const exactSource = allProducts.find(product => normalise(product.sku) === normalise(item.sku));
    const isNvr = item.category === "nvr";
    const isAccessory = item.category === "accessory";
    return {
      id: `curated-${item.id}`,
      name: item.name,
      brand: item.brand,
      sku: item.sku,
      category: isNvr ? "NVR" : isAccessory ? "Accessories" : "Wired IP Cameras",
      categoryIds: isNvr ? [18] : isAccessory ? [71] : [14],
      price: exactSource?.price ?? 0,
      priceOnRequest: !exactSource,
      oldPrice: exactSource?.oldPrice,
      stock: exactSource?.stock ?? 0,
      rating: source?.rating ?? 0,
      reviews: source?.reviews ?? 0,
      image: exactSource?.image,
      galleryImages: exactSource?.galleryImages,
      sourceProductId: exactSource?.id,
      colors: source?.colors,
      badge: source?.badge,
      icon: isNvr ? "NVR" : isAccessory ? "ACC" : "CAM",
      accent: isNvr ? "orange" : "blue",
      shortDescription: item.description,
      description: item.description,
      features: item.features,
      specifications: { Model: item.sku, Category: isNvr ? "Network video recorder" : isAccessory ? "Camera accessory" : "Network camera" },
      published: true,
    };
  });
}
