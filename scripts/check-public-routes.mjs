import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const siteOrigin = "https://ismarttech-demo.yangwang02885215668.chatgpt.site";
const clientDirectory = fileURLToPath(new URL("../dist/client/", import.meta.url));
const indexHtml = await readFile(join(clientDirectory, "index.html"), "utf8");
const sitemap = await readFile(join(clientDirectory, "sitemap.xml"), "utf8");
const { default: worker } = await import(new URL("../dist/server/index.js", import.meta.url));

const contentTypes = new Map([
  [".css", "text/css"], [".html", "text/html; charset=utf-8"], [".js", "text/javascript"],
  [".json", "application/json"], [".svg", "image/svg+xml"], [".xml", "text/xml"],
]);
const assets = {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/index.html") return new Response(indexHtml, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    if (!extname(url.pathname)) {
      const routeFile = url.pathname === "/"
        ? join(clientDirectory, "index.html")
        : join(clientDirectory, url.pathname.slice(1) + ".html");
      try {
        return new Response(await readFile(routeFile), { headers: { "Content-Type": "text/html; charset=utf-8" } });
      } catch {
        return new Response(await readFile(join(clientDirectory, "404.html")), {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }
    }
    try {
      const body = await readFile(join(clientDirectory, url.pathname));
      return new Response(body, { headers: { "Content-Type": contentTypes.get(extname(url.pathname)) || "application/octet-stream" } });
    } catch {
      return new Response("Not found", { status: 404 });
    }
  },
};

async function request(path) {
  return worker.fetch(new Request(new URL(path, siteOrigin)), { ASSETS: assets }, {});
}

for (const path of ["/", "/about", "/products", "/category/category_alarm", "/products/arrowhead-ec-lcd-keypad"]) {
  const response = await request(path);
  assert.equal(response.status, 200, path + ": expected 200, received " + response.status);
  assert.equal(response.headers.get("location"), null, path + ": must not redirect");
  const hostedResponse = await assets.fetch(new Request(new URL(path, siteOrigin)));
  assert.equal(hostedResponse.status, 200, path + ": generated host route must return 200");
  assert.equal(hostedResponse.headers.get("location"), null, path + ": generated host route must not redirect");
}

for (const path of ["/not-a-real-page", "/category/not-a-real-category", "/products/not-a-real-product"]) {
  const response = await request(path);
  assert.equal(response.status, 404, path + ": expected 404, received " + response.status);
  const html = await response.text();
  assert.match(html, /Page not found \| iSmartTech NZ/);
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  const hostedResponse = await assets.fetch(new Request(new URL(path, siteOrigin)));
  assert.equal(hostedResponse.status, 404, path + ": generated host route must return 404");
  assert.match(await hostedResponse.text(), /Page not found \| iSmartTech NZ/);
}

const productResponse = await request("/products/arrowhead-ec-lcd-keypad");
const productHtml = await productResponse.text();
assert.ok(productHtml.includes(`<link rel="canonical" href="${siteOrigin}/products/arrowhead-ec-lcd-keypad"`));
assert.match(productHtml, /<meta property="og:type" content="product"/);
assert.match(productHtml, /"@type":"Product"/);
assert.match(productHtml, /"sku":"EC-LCD"/);

const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, location]) => new URL(location).pathname);
assert(sitemapPaths.length > 0, "Sitemap must contain public URLs");
for (const path of sitemapPaths) {
  const response = await request(path);
  assert.equal(response.status, 200, "Sitemap URL " + path + ": expected 200, received " + response.status);
  assert.match(response.headers.get("content-type") || "", /text\/html/, "Sitemap URL " + path + ": expected HTML");
  const html = await response.text();
  assert.match(html, /<title>[^<]+<\/title>/, "Sitemap URL " + path + ": missing title");
  assert.match(html, /<meta name="description" content="[^"]+"/, "Sitemap URL " + path + ": missing description");
  assert.ok(html.includes("<link rel=\"canonical\" href=\"" + siteOrigin + path + "\""), "Sitemap URL " + path + ": incorrect canonical");
  assert.doesNotMatch(html, /name="robots" content="noindex/, "Sitemap URL " + path + ": public route must be indexable");
  const hostedResponse = await assets.fetch(new Request(new URL(path, siteOrigin)));
  assert.equal(hostedResponse.status, 200, "Generated sitemap route " + path + ": expected 200");
  const hostedHtml = await hostedResponse.text();
  assert.ok(hostedHtml.includes("<link rel=\"canonical\" href=\"" + siteOrigin + path + "\""), "Generated sitemap route " + path + ": incorrect canonical");
}

console.log("PASS: " + sitemapPaths.length + " sitemap URLs resolve with titles, descriptions and canonical links; direct routes work; unknown routes return 404.");
