import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  build: {
    ssr: "worker/static.js",
    outDir: "dist/server",
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: "index.js", format: "es" } },
  },
});
