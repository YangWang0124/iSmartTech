import categoryData from "../Catalogue/categories-full.json";

export type CatalogueCategory = { id: number; title: string; links: string; sub_cat: CatalogueCategory[] };
export const catalogueCategories = categoryData as CatalogueCategory[];
export function flattenCategories(nodes: CatalogueCategory[] = catalogueCategories, ancestors: CatalogueCategory[] = []): Array<{ category: CatalogueCategory; ancestors: CatalogueCategory[] }> {
  return nodes.flatMap(category => [{ category, ancestors }, ...flattenCategories(category.sub_cat, [...ancestors, category])]);
}
export const flatCategories = flattenCategories();
export const categoryBySlug = new Map(flatCategories.map(item => [item.category.links, item]));
export function descendantIds(category: CatalogueCategory): number[] { return [category.id, ...category.sub_cat.flatMap(descendantIds)]; }
export const technicalFilters = [
  { key: "resolution", label: "Resolution", options: [[216, "2 MP"], [217, "4 MP"], [245, "5 MP"], [218, "6 MP"], [219, "8 MP"]] },
  { key: "environment", label: "Environment", options: [[246, "Indoor"], [247, "Outdoor"]] },
  { key: "connection", label: "Connection", options: [[251, "Wired"], [249, "Analog"], [248, "Wi-Fi"], [224, "4G"]] },
  { key: "cameraFeature", label: "Camera Features", options: [[223, "Solar"], [252, "Alarm LED"]] },
  { key: "colourMode", label: "Colour Mode", options: [[222, "Full Colour"], [250, "Not Full Colour"]] },
  { key: "shape", label: "Camera Shape", options: [[234, "Turret"], [233, "Dome"], [232, "Bullet"], [192, "PTZ"]] },
] as const;
export const catalogueTagOptions = technicalFilters.flatMap(filter => filter.options.map(([id, label]) => ({ id, label, group: filter.label })));
