import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const server = await createServer({
  root,
  configFile: false,
  server: { middlewareMode: true, watch: null },
  appType: "custom",
});
try {
  const catalogue = await server.ssrLoadModule("/src/lib/catalogue.ts");
  const { createCuratedProducts } = await server.ssrLoadModule("/src/data/curatedProducts.ts");
  const { alarmProducts } = await server.ssrLoadModule("/src/data/alarmProducts.ts");
  const { catalogueBrandGroups } = await server.ssrLoadModule("/src/lib/brands.ts");
  const seed = JSON.parse(await readFile(new URL("../src/data/products.json", import.meta.url)));
  const {
    flatCategories, categoryBySlug, categoryForProduct,
    categoryPathForProduct, withCatalogueCategory, descendantIds,
  } = catalogue;
  const products = [...seed, ...createCuratedProducts([]), ...alarmProducts];

  assert.equal(new Set(flatCategories.map(x => x.category.id)).size, flatCategories.length);
  assert.equal(categoryBySlug.size, flatCategories.length);
  const expectedNames = {
    "wired_smart-security-hubs": "Wired Alarm Control Panels",
    "wired_smart-security-kits": "Hardwired Alarm Kits",
    "wired_smart-security-sensors": "Wired Alarm Sensors",
    "wired_smart-security-sirens": "Wired Alarm Sirens",
    "wired_other-smart-security-devices": "Alarm Accessories",
    "wireless_smart-security-kits": "Wireless Alarm Kits",
  };
  for (const [slug, title] of Object.entries(expectedNames)) {
    assert.equal(categoryBySlug.get(slug)?.category.title, title, slug);
  }

  for (const product of products) {
    const displayed = withCatalogueCategory(product);
    const entry = categoryForProduct(displayed);
    assert.ok(entry, product.id + ": missing category");
    assert.equal(displayed.category, entry.category.title, product.id + ": mismatched label");
    assert.equal(categoryPathForProduct(displayed), "/category/" + entry.category.links);
    assert.ok(product.categoryIds.some(id => descendantIds(entry.category).includes(id)),
      product.id + ": destination must contain the product");
    assert.deepEqual(withCatalogueCategory(displayed), displayed, product.id + ": unstable normalization");
  }

  // Duplicate names must resolve within the product's own branch, never globally.
  for (const [category, ids, slug] of [
    ["Accessories", [2, 12], "cctv_accessories"],
    ["Accessories", [3, 24], "smart-home_accessories"],
    ["Accessories", [5, 83], "alarm_alarm-Accessories"],
    ["Smart Security Kits", [5, 33, 36, 82], "wired_smart-security-kits"],
    ["Smart Security Kits", [5, 34, 42, 82], "wireless_smart-security-kits"],
    ["Alarm Accessories", [5, 33, 40, 83], "wired_other-smart-security-devices"],
  ]) {
    assert.equal(categoryPathForProduct({ category, categoryIds: ids }), "/category/" + slug);
  }
  assert.equal(categoryForProduct({ category: "Accessories" }), undefined);
  assert.equal(categoryPathForProduct({ category: "Unrecognised", categoryIds: [99999] }), "/products");
  assert.equal(categoryPathForProduct({ category: "NVR" }), "/category/video-record_nvr");
  const mounts = createCuratedProducts([]).filter(product => product.category === "Accessories");
  assert.ok(mounts.length);
  assert.ok(mounts.every(product => product.categoryIds.includes(12) && !product.categoryIds.includes(71)));

  for (const group of catalogueBrandGroups) assert.ok(categoryBySlug.has(group.category));
  const home = await readFile(new URL("../src/pages/HomePage.tsx", import.meta.url), "utf8");
  for (const [, slug] of home.matchAll(/slug: "([^"]+)"/g)) assert.ok(categoryBySlug.has(slug), slug);
  const footer = await readFile(new URL("../src/components/Footer.tsx", import.meta.url), "utf8");
  for (const [, slug] of footer.matchAll(/to="\/category\/([^"]+)"/g)) assert.ok(categoryBySlug.has(slug), slug);
  const provider = await readFile(new URL("../src/context/ProductContext.tsx", import.meta.url), "utf8");
  assert.ok(provider.includes("].map(withCatalogueCategory)"));
  const detail = await readFile(new URL("../src/pages/ProductDetailPage.tsx", import.meta.url), "utf8");
  assert.ok(detail.includes("to={productCategoryPath}"));
  assert.ok(!detail.includes("/products?category="));
  const listing = await readFile(new URL("../src/pages/ProductsPage.tsx", import.meta.url), "utf8");
  assert.ok(listing.includes('categoryTitle || "All products"'));
  console.log("PASS: " + products.length + " product records; " + flatCategories.length
    + " category routes; all six alarm labels; duplicate-name routing; accessory membership; home, brand and footer links.");
} finally {
  await server.close();
}
