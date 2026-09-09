import { readFile, writeFile } from "node:fs/promises";
import { createServer } from "vite";

const siteUrl = (process.env.SITE_URL || "https://ismarttech-demo.yangwang02885215668.chatgpt.site").replace(/\/$/, "");
const seedProducts = JSON.parse(await readFile(new URL("../src/data/products.json", import.meta.url), "utf8"));
const server = await createServer({
  root: new URL("../", import.meta.url).pathname,
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, watch: null },
  appType: "custom",
});

let products;
let categorySlugs;
try {
  const { createCuratedProducts } = await server.ssrLoadModule("/src/data/curatedProducts.ts");
  const { alarmProducts } = await server.ssrLoadModule("/src/data/alarmProducts.ts");
  const { flatCategories, descendantIds } = await server.ssrLoadModule("/src/lib/catalogue.ts");
  products = [...seedProducts, ...createCuratedProducts([]), ...alarmProducts]
    .filter((product, index, all) => product.published !== false && all.findIndex((item) => item.id === product.id) === index);
  categorySlugs = flatCategories
    .filter(({ category }) => {
      const validIds = new Set(descendantIds(category));
      return products.some((product) => product.categoryIds?.some((id) => validIds.has(id)));
    })
    .map(({ category }) => category.links);
} finally {
  await server.close();
}

const today = new Date().toISOString().slice(0, 10);
const staticPaths = ["/", "/products", "/custom-cctv-kit", "/about", "/contact", "/installation-services", "/privacy", "/terms-and-conditions", "/shipping-returns", "/warranty", "/installation-terms", "/payment-information", "/faq"];
const paths = [
  ...staticPaths,
  ...categorySlugs.map((slug) => `/category/${slug}`),
  ...products.map((product) => `/products/${product.id}`),
];
const uniquePaths = [...new Set(paths)].filter((path) => !/[?#]/.test(path));
const escapeXml = (value) => value.replace(/[<>&'"]/g, (character) => ({
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  "'": "&apos;",
  '"': "&quot;",
})[character]);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniquePaths.map((path) => `  <url><loc>${escapeXml(`${siteUrl}${path}`)}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;
const robots = `User-agent: *
Allow: /
Disallow: /account
Disallow: /signin
Disallow: /signup
Disallow: /cart
Disallow: /staff

Sitemap: ${siteUrl}/sitemap.xml
`;

await Promise.all([
  writeFile(new URL("../public/sitemap.xml", import.meta.url), sitemap),
  writeFile(new URL("../public/robots.txt", import.meta.url), robots),
]);
console.log(`Generated SEO files for ${products.length} products and ${categorySlugs.length} non-empty categories.`);
