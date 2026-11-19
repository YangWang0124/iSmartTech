import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

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
    }],
    server: {
      proxy: {
        "/api/retail": { target: env.RETAIL_BACKEND_URL || "http://127.0.0.1:8787" },
        "/admin": { target: env.RETAIL_BACKEND_URL || "http://127.0.0.1:8787" },
      },
    },
    build: {
      outDir: "dist/client",
      emptyOutDir: true,
    },
  };
});
