import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const siteOrigin = (process.env.SITE_URL || "https://ismarttech-demo.yangwang02885215668.chatgpt.site").replace(/\/$/, "");
const clientDirectory = fileURLToPath(new URL("../dist/client/", import.meta.url));
const indexHtml = await readFile(join(clientDirectory, "index.html"), "utf8");
const sitemap = await readFile(join(clientDirectory, "sitemap.xml"), "utf8");
const { default: worker } = await import(new URL("../dist/server/index.js", import.meta.url));

const assets = {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/index.html") {
      return new Response(indexHtml, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
    return new Response("Not found", { status: 404 });
  },
};

const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(([, location]) => new URL(location).pathname);
const routePaths = new Set([...sitemapPaths, "/cart", "/signin", "/signup", "/account"]);

for (const path of routePaths) {
  const response = await worker.fetch(
    new Request(new URL(path, siteOrigin)),
    { ASSETS: assets },
    {},
  );
  assert.equal(response.status, 200, path + ": unable to generate route HTML");
  const outputPath = path === "/"
    ? join(clientDirectory, "index.html")
    : join(clientDirectory, path.slice(1) + ".html");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, await response.text(), "utf8");
}

const notFoundResponse = await worker.fetch(
  new Request(new URL("/page-not-found", siteOrigin)),
  { ASSETS: assets },
  {},
);
assert.equal(notFoundResponse.status, 404);
await writeFile(join(clientDirectory, "404.html"), await notFoundResponse.text(), "utf8");

console.log("Generated route HTML for " + routePaths.size + " direct URLs plus the 404 page.");
