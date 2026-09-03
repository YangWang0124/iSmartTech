export const catalogueBrandGroups = [
  {
    title: "CCTV",
    category: "category_cctv",
    brands: [
      { label: "HIKVISION (HILOOK)", value: "Hikvision", logo: "/assets/brands/hikvision.png" },
      { label: "DAHUA", value: "Dahua", logo: "/assets/brands/dahua.svg" },
      { label: "TIANDY", value: "Tiandy", logo: "/assets/brands/tiandy-menu.webp" },
    ],
  },
  {
    title: "ALARM",
    category: "category_alarm",
    brands: [
      { label: "PARADOX", value: "Paradox", logo: "/assets/brands/paradox-menu.png" },
      { label: "ARROWHEAD", value: "Arrowhead", logo: "/assets/brands/arrowhead-menu.png" },
    ],
  },
] as const;

export type CatalogueBrand = (typeof catalogueBrandGroups)[number]["brands"][number];
