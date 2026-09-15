export const catalogueBrandGroups = [
  {
    title: "CCTV",
    category: "category_cctv",
    brands: [
      { label: "HIKVISION/HILOOK", value: "Hikvision", filterValues: ["Hikvision", "HiLook"], slug: "hikvision-hilook", logo: "/assets/brands/hikvision-hilook.png" },
      { label: "DAHUA", value: "Dahua", filterValues: ["Dahua"], slug: "dahua", logo: "/assets/brands/dahua.svg" },
      { label: "TIANDY", value: "Tiandy", filterValues: ["Tiandy"], slug: "tiandy", logo: "/assets/brands/tiandy-menu.webp" },
    ],
  },
  {
    title: "ALARM",
    category: "category_alarm",
    brands: [
      { label: "PARADOX", value: "Paradox", filterValues: ["Paradox"], slug: "paradox", logo: "/assets/brands/paradox-menu.png" },
      { label: "ARROWHEAD", value: "Arrowhead", filterValues: ["Arrowhead"], slug: "arrowhead", logo: "/assets/brands/arrowhead-menu.png" },
    ],
  },
] as const;

export type CatalogueBrand = (typeof catalogueBrandGroups)[number]["brands"][number];

export const catalogueBrands = catalogueBrandGroups.flatMap((group) =>
  group.brands.map((brand) => ({ ...brand, group: group.title })),
);

export const brandPageBySlug = new Map<string, (typeof catalogueBrands)[number]>(
  catalogueBrands.map((brand) => [brand.slug, brand]),
);
