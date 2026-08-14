import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fetchCatalogue } from "./worker/catalogue-source.js";

export default defineConfig({
  plugins: [react(), {
    name: "ismarttech-catalogue-preview",
    configureServer(server) {
      server.middlewares.use("/api/catalogue-source", async (_request, response) => {
        try {
          const products = await fetchCatalogue();
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
});
