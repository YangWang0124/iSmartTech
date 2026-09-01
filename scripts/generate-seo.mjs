import { readFile, writeFile } from "node:fs/promises";

const siteUrl = (process.env.SITE_URL || "https://ismarttech-demo.yangwang02885215668.chatgpt.site").replace(/\/$/, "");
const products = JSON.parse(await readFile(new URL("../src/data/products.json", import.meta.url), "utf8"));
const curatedSource = await readFile(new URL("../src/data/curatedProducts.ts", import.meta.url), "utf8");
const alarmSource = await readFile(new URL("../src/data/alarmProducts.ts", import.meta.url), "utf8");
const categories = JSON.parse(await readFile(new URL("../src/Catalogue/categories-full.json", import.meta.url), "utf8"));

const curatedIds = [...curatedSource.matchAll(/\[\s*\n\s*"([a-z0-9-]+)",\s*\n\s*"[^"]+",\s*\n\s*"[^"]+",/g)]
  .map((match) => `curated-${match[1]}`);
const alarmIds = [...alarmSource.matchAll(/id:\s*"([a-z0-9-]+)"/g)].map((match) => match[1]);
const productIds = [...new Set([...products.map((product) => product.id), ...curatedIds, ...alarmIds])];

const categorySlugs = [];
const collectCategories = (items) => items.forEach((item) => {
  if (item.links) categorySlugs.push(item.links);
  collectCategories(item.sub_cat || []);
});
collectCategories(categories);

const today = new Date().toISOString().slice(0, 10);
const staticPaths = ["/", "/products", "/custom-cctv-kit", "/about", "/contact", "/installation-services"];
const paths = [
  ...staticPaths,
  ...categorySlugs.map((slug) => `/category/${slug}`),
  ...productIds.map((id) => `/products/${id}`),
];
const escapeXml = (value) => value.replace(/[<>&'"]/g, (character) => ({
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  "'": "&apos;",
  '"': "&quot;",
})[character]);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...new Set(paths)].map((path) => `  <url><loc>${escapeXml(`${siteUrl}${path}`)}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;
const robots = `User-agent: *
Allow: /
Disallow: /account
Disallow: /signin
Disallow: /signup
Disallow: /cart

Sitemap: ${siteUrl}/sitemap.xml
`;

await Promise.all([
  writeFile(new URL("../public/sitemap.xml", import.meta.url), sitemap),
  writeFile(new URL("../public/robots.txt", import.meta.url), robots),
]);
console.log(`Generated SEO files for ${productIds.length} products and ${categorySlugs.length} categories.`);
