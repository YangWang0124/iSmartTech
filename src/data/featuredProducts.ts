import type { Product } from "../types";

// Owner-selected homepage products, in display order. Stable IDs avoid
// accidentally featuring duplicate imported records of the same SKU.
export const featuredProductIds = [
  "curated-dahua-hdw3667", // DH-IPC-HDW3667EM-S-IL-ANZ
  "curated-hikvision-2367", // DS-2CD2367G2H-LISU-SL
  "curated-hilook-nvr104", // NVR-104MH-C4P(D)-2TB
  "arrowhead-ec-led-alarm-kit-no-cable", // EC-KIT KP W NC
  "curated-tiandy-tc-h343k", // TC-H343K 9DA-4
  "curated-dahua-pfa130", // DH-PFA130-E
  "paradox-mg5050-k10v-alarm-kit", // MG5050-K10V-KIT
  "curated-dahua-nvr4108", // DHI-NVR4108HS-8P-4KS3
] as const;

export function getFeaturedProducts(products: Product[]): Product[] {
  const productsById = new Map(products.map((product) => [product.id, product]));
  return featuredProductIds.flatMap((id) => {
    const product = productsById.get(id);
    return product ? [product] : [];
  });
}
