import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fetchCatalogue, fetchCatalogueProduct } from "./worker/catalogue-source.js";

const defaultSiteOrigin = "https://ismarttech-demo.yangwang02885215668.chatgpt.site";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteOrigin = (env.SITE_URL || defaultSiteOrigin).replace(/\/$/, "");
  const verification = (env.GOOGLE_SITE_VERIFICATION || "").trim();
  const safeVerification = verification.replace(/[&"<>]/g, (character) => ({ "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" })[character] || character);
  return {
    plugins: [react(), {
      name: "ismarttech-seo-environment",
      transformIndexHtml(html) {
        const withOrigin = html.split(defaultSiteOrigin).join(siteOrigin);
        return safeVerification && !withOrigin.includes('name="google-site-verification"')
          ? withOrigin.replace("</head>", `<meta name="google-site-verification" content="${safeVerification}" /></head>`)
          : withOrigin;
      },
    }, {
      name: "ismarttech-catalogue-preview",
      configureServer(server) {
        server.middlewares.use("/api/catalogue-source", async (request, response) => {
          try {
            const sourceId = request.url?.match(/^\/(?:source-)?([^/?]+)/)?.[1];
            const products = sourceId ? await fetchCatalogueProduct(sourceId) : await fetchCatalogue();
            response.statusCode = 200;
            response.setHeader("Content-Type", "application/json; charset=utf-8");
            response.setHeader("Cache-Control", "no-store");
            response.end(JSON.stringify(products));
          } catch {
            response.statusCode = 502;
            response.setHeader("Content-Type", "application/json; charset=utf-8");
            response.end(JSON.stringify({ error: "Unable to load the source catalogue." }));
          }
        });
      },
    }],
    build: {
      outDir: "dist/client",
      emptyOutDir: true,
    },
  };
});
