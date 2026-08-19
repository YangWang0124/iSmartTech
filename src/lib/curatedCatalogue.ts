import type { Product } from "../types";

const selectedSkuFragments = [
  "TC-C36XN 2ENA-28",
  "TC-C34XN 2ENA-28",
  "TC-H333K",
  "TC-R3105",
  "TC-R3110",
  "TC-R3104",
  "TC-H343K 9DA-4",
  "TC-C34CN 9ATA-28",
  "DH-PFA130-E",
  "DH-IPC-HDW3667EM-S-IL-ANZ",
  "DH-IPC-HDW3867EM-S-IL-ANZ",
  "DH-PFB2204W",
  "DHI-NVR4104HS-P-4KS3",
  "DHI-NVR4108HS-8P-4KS3",
  "DH-IPC-HDW3649H-AS-PV-ANZ-S2",
  "DS-2CD2387G2H-LISU-SL",
  "IPC-T289H-MU/SL(2.8mm)",
  "DS-7604NXI-K1/4P",
  "DS-2CD2386G2-ISU-SL",
  "DS-2CD2366G2-ISU-SL",
  "DS-2CD2367G2H-LISU-SL",
  "NVR-104MH-C4P(D)-2TB",
  "NVR-108MH-K/8P(B)-4TB",
  "DS-7616NI-M2/16P-4TB",
];

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const selectedSkuKeys = selectedSkuFragments.map(normalise);

export function isSelectedCatalogueProduct(product: Product) {
  const sku = normalise(product.sku);
  return selectedSkuKeys.some(key => sku.includes(key) || key.includes(sku));
}

