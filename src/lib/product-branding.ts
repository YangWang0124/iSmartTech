import { catalogueBrandGroups } from "./brands";

const brandLogos = new Map<string, string>(
  catalogueBrandGroups.flatMap((group) =>
    group.brands.map((brand): [string, string] => [brand.value.toLowerCase(), brand.logo]),
  ),
);

brandLogos.set("hilook", "/assets/brands/hilook.svg");
brandLogos.set("ritar", "/assets/brands/ritar.webp");
brandLogos.set("uniview", "/assets/brands/uniview.png");
brandLogos.set("uniarch", "/assets/brands/uniarch.png");

export function getProductBrandLogo(brand: string) {
  const key = brand.trim().toLowerCase();
  const src = brandLogos.get(key);
  return src ? { key, src } : undefined;
}
