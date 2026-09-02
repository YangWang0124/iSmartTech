import categoryData from "../Catalogue/categories-full.json";

export type CatalogueCategory = { id: number; title: string; links: string; sub_cat: CatalogueCategory[] };
// Share customer-facing names across menus, listings, product labels and SEO.
// Legacy slugs remain unchanged so existing links continue to work.
const categoryTitles: Record<string, string> = {
  "wired_smart-security-hubs": "Wired Alarm Control Panels",
  "wired_smart-security-kits": "Hardwired Alarm Kits",
  "wired_smart-security-sensors": "Wired Alarm Sensors",
  "wired_smart-security-sirens": "Wired Alarm Sirens",
  "wired_other-smart-security-devices": "Alarm Accessories",
  "wireless_smart-security-kits": "Wireless Alarm Kits",
};
function withCategoryTitles(nodes: CatalogueCategory[]): CatalogueCategory[] {
  return nodes.map(category => ({
    ...category,
    title: categoryTitles[category.links] ?? category.title,
    sub_cat: withCategoryTitles(category.sub_cat),
  }));
}
export const catalogueCategories = withCategoryTitles(categoryData as CatalogueCategory[]);
export function flattenCategories(nodes: CatalogueCategory[] = catalogueCategories, ancestors: CatalogueCategory[] = []): Array<{ category: CatalogueCategory; ancestors: CatalogueCategory[] }> {
  return nodes.flatMap(category => [{ category, ancestors }, ...flattenCategories(category.sub_cat, [...ancestors, category])]);
}
export const flatCategories = flattenCategories();
export const categoryBySlug = new Map(flatCategories.map(item => [item.category.links, item]));
const categoryById = new Map(flatCategories.map(item => [item.category.id, item]));

const originalTitleById = new Map(flattenCategories(categoryData as CatalogueCategory[])
  .map(({ category }) => [category.id, category.title]));

export function categoryDisplayTitle(category: CatalogueCategory): string {
  return category.title;
}

type ProductCategory = { category: string; categoryIds?: number[] };
export function categoryForProduct(product: ProductCategory) {
  const candidates = (product.categoryIds ?? [])
    .map(id => categoryById.get(id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .sort((a, b) => b.ancestors.length - a.ancestors.length);
  const matchesTitle = ({ category }: typeof flatCategories[number]) =>
    category.title === product.category || originalTitleById.get(category.id) === product.category;

  // IDs disambiguate repeated labels such as Accessories and Smart Security Kits.
  if (candidates.length) return candidates.find(matchesTitle) ?? candidates[0];
  const namedCategories = flatCategories.filter(matchesTitle);
  return namedCategories.length === 1 ? namedCategories[0] : undefined;
}

export function withCatalogueCategory<T extends ProductCategory>(product: T): T {
  const entry = categoryForProduct(product);
  return entry ? { ...product, category: entry.category.title } : product;
}

export function categoryPathForProduct(product: ProductCategory): string {
  const entry = categoryForProduct(product);
  return entry ? `/category/${entry.category.links}` : "/products";
}
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
