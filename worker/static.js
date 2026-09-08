import seedProducts from "../src/data/products.json";
import { createCuratedProducts } from "../src/data/curatedProducts.ts";
import { alarmProducts } from "../src/data/alarmProducts.ts";
import categoryData from "../src/Catalogue/categories-full.json";
import { fetchCatalogue, fetchCatalogueProduct } from "./catalogue-source.js";

const schema = `CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, brand TEXT NOT NULL, category TEXT NOT NULL,
  price REAL NOT NULL DEFAULT 0, old_price REAL, sku TEXT NOT NULL UNIQUE,
  rating REAL NOT NULL DEFAULT 0, reviews INTEGER NOT NULL DEFAULT 0, stock INTEGER NOT NULL DEFAULT 0,
  badge TEXT, icon TEXT NOT NULL DEFAULT 'CAM', accent TEXT NOT NULL DEFAULT 'blue', image_key TEXT,
  short_description TEXT NOT NULL, description TEXT NOT NULL, features TEXT NOT NULL DEFAULT '[]',
  specifications TEXT NOT NULL DEFAULT '{}', gallery_images TEXT NOT NULL DEFAULT '[]', feature_images TEXT NOT NULL DEFAULT '[]', colors TEXT NOT NULL DEFAULT '[]', category_ids TEXT NOT NULL DEFAULT '[]', tag_ids TEXT NOT NULL DEFAULT '[]', published INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`;
const metaSchema = `CREATE TABLE IF NOT EXISTS catalogue_state (key TEXT PRIMARY KEY, value TEXT NOT NULL)`;
const retiredSampleIds = ["hikvision-colorvu", "uniview-4ch-kit", "ajax-starter-kit", "ubiquiti-g5-bullet", "tp-link-vigi-nvr", "ezviz-doorbell", "seagate-skyhawk-4tb", "dahua-16ch-nvr", "hikvision-intercom-kit", "reolink-solar-camera", "ruijie-poe-switch", "ajax-motioncam", "tp-link-outdoor-ap", "western-digital-8tb", "uniview-thermal-sensor"];
const seoProducts = [...seedProducts.filter((product) => !alarmProducts.some((alarm) => alarm.id === product.id)), ...createCuratedProducts([]), ...alarmProducts];
const productAliases = new Map([["dahua-nvr4104", "curated-dahua-nvr4104"]]);
const routeMetadata = {
  "/": ["iSmartTech NZ | Security, Smart Home & Installation", "Shop security, networking and smart-home technology with practical advice and professional installation services across Auckland."],
  "/products": ["Security & Smart Home Products | iSmartTech NZ", "Browse iSmartTech cameras, NVRs, alarms, networking equipment and smart-home products for New Zealand homes and businesses."],
  "/custom-cctv-kit": ["Build a Custom CCTV Kit | iSmartTech NZ", "Build a compatible CCTV camera and recorder package for your property with straightforward product and installation options."],
  "/about": ["About iSmartTech | Auckland Technology Specialists", "Learn about iSmartTech’s New Zealand team and its practical approach to security, networking, smart-home and installation solutions."],
  "/contact": ["Contact iSmartTech | Auckland Security Advice", "Contact iSmartTech for friendly advice about security cameras, networking, smart-home products and Auckland installation services."],
  "/installation-services": ["Professional Installation Services Auckland | iSmartTech", "Arrange professional Auckland installation for security cameras, networking, smart-home and related electrical technology solutions."],
  "/cart": ["Shopping cart | iSmartTech", "Review products in your iSmartTech shopping cart.", true],
  "/signin": ["Customer sign in | iSmartTech", "Sign in to your iSmartTech customer account.", true],
  "/signup": ["Create customer account | iSmartTech", "Create an iSmartTech customer account.", true],
  "/account": ["Customer account | iSmartTech", "Secure iSmartTech customer account area.", true],
};
const publicPagePaths = new Set(Object.keys(routeMetadata));
const categoryTitles = {
  "wired_smart-security-hubs": "Wired Alarm Control Panels",
  "wired_smart-security-kits": "Hardwired Alarm Kits",
  "wired_smart-security-sensors": "Wired Alarm Sensors",
  "wired_smart-security-sirens": "Wired Alarm Sirens",
  "wired_other-smart-security-devices": "Alarm Accessories",
  "wireless_smart-security-kits": "Wireless Alarm Kits",
};
const categorySlugs = new Set();
const categoryMetadata = new Map();
const collectCategorySlugs = (categories) => categories.forEach((category) => {
  categorySlugs.add(category.links);
  const title = categoryTitles[category.links] || category.title;
  categoryMetadata.set(category.links, [`${title} | iSmartTech NZ`, `Browse ${title} from iSmartTech for New Zealand homes and businesses.`]);
  collectCategorySlugs(category.sub_cat || []);
});
collectCategorySlugs(categoryData);

function normalizedPath(pathname) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

function pageExists(pathname) {
  const path = normalizedPath(pathname);
  if (publicPagePaths.has(path)) return true;
  const categoryMatch = path.match(/^\/category\/([^/]+)$/);
  if (categoryMatch) return categorySlugs.has(decodeURIComponent(categoryMatch[1]));
  const productMatch = path.match(/^\/products\/([^/]+)$/);
  if (!productMatch) return false;
  const requestedId = decodeURIComponent(productMatch[1]);
  const resolvedId = productAliases.get(requestedId) || requestedId;
  return seoProducts.some((product) => product.id === resolvedId);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return handleApi(request, env, url);
    if (request.method === "GET" && !url.pathname.includes(".")) {
      const indexResponse = await env.ASSETS.fetch(new Request(new URL("/", url), request));
      return pageExists(url.pathname)
        ? injectSeo(indexResponse, url)
        : injectNotFoundSeo(indexResponse, url);
    }
    return env.ASSETS.fetch(request);
  },
};

async function handleApi(request, env, url) {
  try {
    if (url.pathname.startsWith("/api/catalogue-source") && request.method === "GET") {
      const match = url.pathname.match(/^\/api\/catalogue-source\/(?:source-)?([^/]+)$/);
      const payload = match ? await fetchCatalogueProduct(decodeURIComponent(match[1])) : await fetchCatalogue();
      return Response.json(payload, { headers: { "Cache-Control": "public, max-age=300, s-maxage=900" } });
    }
    if (!env.DB) return json({ error: "Product storage is not configured." }, 503);
    await ensureDatabase(env.DB);
    if (url.pathname.startsWith("/api/product-images/")) return serveImage(env, url.pathname.slice(20));
    if (url.pathname === "/api/products" && request.method === "GET") return listProducts(env.DB, true);

    if (url.pathname === "/api/admin/me") {
      const user = getUser(request, env);
      return json({ authenticated: Boolean(user.email), authorized: user.authorized, email: user.email });
    }
    if (!url.pathname.startsWith("/api/admin/")) return json({ error: "Not found." }, 404);
    const user = getUser(request, env);
    if (!user.email) return json({ error: "Sign in required." }, 401);
    if (!user.authorized) return json({ error: "This account is not authorised." }, 403);

    if (url.pathname === "/api/admin/products" && request.method === "GET") return listProducts(env.DB, false);
    if (url.pathname === "/api/admin/products" && request.method === "POST") return saveProduct(request, env, null);
    const match = url.pathname.match(/^\/api\/admin\/products\/([^/]+)$/);
    if (match && request.method === "PUT") return saveProduct(request, env, decodeURIComponent(match[1]));
    if (match && request.method === "DELETE") return deleteProduct(env, decodeURIComponent(match[1]));
    return json({ error: "Not found." }, 404);
  } catch (error) {
    console.error(error);
    return json({ error: "The product service encountered an error." }, 500);
  }
}

function getUser(request, env) {
  const email = request.headers.get("oai-authenticated-user-email")?.trim().toLowerCase() || "";
  const allowed = String(env.ADMIN_EMAILS || "").split(",").map(value => value.trim().toLowerCase()).filter(Boolean);
  return { email, authorized: Boolean(email && allowed.includes(email)) };
}

async function ensureDatabase(db) {
  await db.batch([db.prepare(schema), db.prepare(metaSchema)]);
  const columns = await db.prepare("PRAGMA table_info(products)").all();
  const names = new Set(columns.results.map(column => column.name));
  for (const [name, definition] of [["gallery_images", "TEXT NOT NULL DEFAULT '[]'"], ["feature_images", "TEXT NOT NULL DEFAULT '[]'"], ["colors", "TEXT NOT NULL DEFAULT '[]'"], ["category_ids", "TEXT NOT NULL DEFAULT '[]'"], ["tag_ids", "TEXT NOT NULL DEFAULT '[]'"]]) {
    if (!names.has(name)) await db.prepare(`ALTER TABLE products ADD COLUMN ${name} ${definition}`).run();
  }
  const samplesRemoved = await db.prepare("SELECT value FROM catalogue_state WHERE key = ?").bind("retired-samples-removed").first();
  if (!samplesRemoved) {
    await db.batch(retiredSampleIds.map(id => db.prepare("DELETE FROM products WHERE id = ?").bind(id)));
    await db.prepare("INSERT OR REPLACE INTO catalogue_state (key,value) VALUES (?,?)").bind("retired-samples-removed", new Date().toISOString()).run();
  }
  const catalogueIdsMigrated = await db.prepare("SELECT value FROM catalogue_state WHERE key = ?").bind("catalogue-ids-v1").first();
  if (!catalogueIdsMigrated) {
    await db.prepare("UPDATE products SET category = ?, category_ids = ?, tag_ids = ? WHERE id = ?").bind("Wired IP Cameras", "[2,9,14]", "[218,247,251,222,234]", "dahua-4k-turret").run();
    await db.prepare("INSERT OR REPLACE INTO catalogue_state (key,value) VALUES (?,?)").bind("catalogue-ids-v1", new Date().toISOString()).run();
  }
  const seeded = await db.prepare("SELECT value FROM catalogue_state WHERE key = ?").bind("seeded").first();
  if (seeded) return;
  const inserts = seedProducts.map(product => db.prepare(`INSERT OR IGNORE INTO products
    (id,name,brand,category,price,old_price,sku,rating,reviews,stock,badge,icon,accent,short_description,description,features,specifications,published)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)`).bind(product.id, product.name, product.brand, product.category, product.price, product.oldPrice ?? null, product.sku, product.rating, product.reviews, product.stock, product.badge ?? null, product.icon, product.accent, product.shortDescription, product.description, JSON.stringify(product.features), JSON.stringify(product.specifications)));
  await db.batch(inserts);
  await db.prepare("INSERT OR REPLACE INTO catalogue_state (key,value) VALUES (?,?)").bind("seeded", new Date().toISOString()).run();
}

async function listProducts(db, publishedOnly) {
  const query = publishedOnly ? "SELECT * FROM products WHERE published = 1 ORDER BY created_at, name" : "SELECT * FROM products ORDER BY updated_at DESC, name";
  const result = await db.prepare(query).all();
  return json(result.results.map(toProduct));
}

function toProduct(row) {
  return { id: row.id, name: row.name, brand: row.brand, category: row.category, price: row.price, oldPrice: row.old_price ?? undefined,
    sku: row.sku, rating: row.rating, reviews: row.reviews, stock: row.stock, badge: row.badge ?? undefined, icon: row.icon,
    accent: row.accent, image: row.image_key ? `/api/product-images/${encodeURIComponent(row.image_key)}` : undefined,
    shortDescription: row.short_description, description: row.description, features: JSON.parse(row.features || "[]"),
    specifications: JSON.parse(row.specifications || "{}"), galleryImages: JSON.parse(row.gallery_images || "[]"), featureImages: JSON.parse(row.feature_images || "[]"), colors: JSON.parse(row.colors || "[]"), categoryIds: JSON.parse(row.category_ids || "[]"), tagIds: JSON.parse(row.tag_ids || "[]"), published: Boolean(row.published) };
}

async function saveProduct(request, env, existingId) {
  const form = await request.formData();
  const product = JSON.parse(String(form.get("product") || "{}"));
  const required = ["id", "name", "brand", "category", "sku", "shortDescription", "description"];
  if (required.some(key => !String(product[key] || "").trim())) return json({ error: "Complete all required product fields." }, 400);
  let imageKey = null;
  if (existingId) {
    const current = await env.DB.prepare("SELECT image_key FROM products WHERE id = ?").bind(existingId).first();
    if (!current) return json({ error: "Product not found." }, 404);
    imageKey = current.image_key;
  }
  const image = form.get("image");
  if (image && typeof image !== "string" && image.size) {
    if (!env.PRODUCT_IMAGES) return json({ error: "Image storage is not configured." }, 503);
    if (image.size > 8 * 1024 * 1024) return json({ error: "Image must be smaller than 8 MB." }, 400);
    if (!/^image\/(png|jpeg|webp)$/.test(image.type)) return json({ error: "Use a PNG, JPG or WebP image." }, 400);
    const extension = image.type === "image/jpeg" ? "jpg" : image.type.split("/")[1];
    const nextKey = `${crypto.randomUUID()}.${extension}`;
    await env.PRODUCT_IMAGES.put(nextKey, image.stream(), { httpMetadata: { contentType: image.type } });
    if (imageKey) await env.PRODUCT_IMAGES.delete(imageKey);
    imageKey = nextKey;
  }
  const values = [product.id, product.name, product.brand, product.category, Number(product.price) || 0, product.oldPrice ? Number(product.oldPrice) : null,
    product.sku, Number(product.rating) || 0, Number(product.reviews) || 0, Math.max(0, Number(product.stock) || 0), product.badge || null,
    product.icon || "CAM", product.accent || "blue", imageKey, product.shortDescription, product.description,
    JSON.stringify(product.features || []), JSON.stringify(product.specifications || {}), JSON.stringify(product.galleryImages || []), JSON.stringify(product.featureImages || []), JSON.stringify(product.colors || []), JSON.stringify(product.categoryIds || []), JSON.stringify(product.tagIds || []), product.published ? 1 : 0];
  if (existingId) {
    await env.DB.prepare(`UPDATE products SET id=?,name=?,brand=?,category=?,price=?,old_price=?,sku=?,rating=?,reviews=?,stock=?,badge=?,icon=?,accent=?,image_key=?,short_description=?,description=?,features=?,specifications=?,gallery_images=?,feature_images=?,colors=?,category_ids=?,tag_ids=?,published=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(...values, existingId).run();
  } else {
    await env.DB.prepare(`INSERT INTO products (id,name,brand,category,price,old_price,sku,rating,reviews,stock,badge,icon,accent,image_key,short_description,description,features,specifications,gallery_images,feature_images,colors,category_ids,tag_ids,published) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(...values).run();
  }
  const saved = await env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(product.id).first();
  return json(toProduct(saved), existingId ? 200 : 201);
}

async function deleteProduct(env, id) {
  const product = await env.DB.prepare("SELECT image_key FROM products WHERE id = ?").bind(id).first();
  if (!product) return json({ error: "Product not found." }, 404);
  await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
  if (product.image_key && env.PRODUCT_IMAGES) await env.PRODUCT_IMAGES.delete(product.image_key);
  return json({ ok: true });
}

async function serveImage(env, key) {
  if (!env.PRODUCT_IMAGES) return json({ error: "Image storage is not configured." }, 503);
  const object = await env.PRODUCT_IMAGES.get(decodeURIComponent(key));
  if (!object) return json({ error: "Image not found." }, 404);
  const headers = new Headers(); object.writeHttpMetadata(headers); headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}

function json(value, status = 200) { return Response.json(value, { status, headers: { "Cache-Control": "no-store" } }); }
async function injectSeo(response, url) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  const path = normalizedPath(url.pathname);
  const categoryMatch = path.match(/^\/category\/([^/]+)$/);
  const category = categoryMatch ? categoryMetadata.get(decodeURIComponent(categoryMatch[1])) : undefined;
  const page = routeMetadata[path] || category;
  if (page) return injectPageSeo(response, url, page);

  const match = url.pathname.match(/^\/products\/([^/]+)\/?$/);
  const requestedId = match ? decodeURIComponent(match[1]) : "";
  const resolvedId = requestedId === "dahua-nvr4104" ? "curated-dahua-nvr4104" : requestedId;
  const product = seoProducts.find((item) => item.id === resolvedId);
  if (!product) return preventHtmlCaching(response);

  const canonical = `${url.origin}/products/${product.id}`;
  const preferredTitle = `${product.name} | iSmartTech NZ`;
  const title = preferredTitle.length <= 65
    ? preferredTitle
    : `${product.brand} ${product.sku} | iSmartTech NZ`;
  const sourceDescription = String(product.description || product.shortDescription || "").trim();
  const description = sourceDescription.length > 158
    ? `${sourceDescription.slice(0, 155).replace(/\s+\S*$/, "")}…`
    : sourceDescription;
  const image = product.image ? new URL(product.image, url.origin).toString() : `${url.origin}/og.jpg`;
  const includeOffer = !product.priceOnRequest
    && !product.requiresLiveCatalogue
    && Number(product.price) > 0
    && Number(product.price) < 1_000_000;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${canonical}#product`,
        name: product.name,
        description,
        sku: product.sku,
        brand: { "@type": "Brand", name: product.brand },
        category: product.category,
        image: [image],
        url: canonical,
        ...(includeOffer ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "NZD",
            price: Number(product.price).toFixed(2),
            availability: Number(product.stock) > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: canonical,
          },
        } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${url.origin}/` },
          { "@type": "ListItem", position: 2, name: "Products", item: `${url.origin}/products` },
          { "@type": "ListItem", position: 3, name: product.name, item: canonical },
        ],
      },
    ],
  };
  const attr = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  let html = await response.text();
  html = html
    .replace(/<title>[^<]*<\/title>/, `<title>${attr(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${attr(description)}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${attr(canonical)}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${attr(title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${attr(description)}" />`)
    .replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${attr(image)}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${attr(canonical)}" />`)
    .replace(/<meta property="og:type"[^>]*>/, '<meta property="og:type" content="product" />')
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${attr(title)}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${attr(description)}" />`)
    .replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${attr(image)}" />`)
    .replace("</head>", `<script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll("<", String.raw`\u003c`)}</script></head>`);

  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  headers.set("Pragma", "no-cache");
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
}

async function injectPageSeo(response, url, [title, description, noIndex = false]) {
  const canonicalPath = normalizedPath(url.pathname);
  const canonical = `${url.origin}${canonicalPath}`;
  const attr = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll(String.fromCharCode(34), "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  let html = await response.text();
  html = html
    .replace(/<title>[^<]*<\/title>/, `<title>${attr(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${attr(description)}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${attr(canonical)}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${attr(title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${attr(description)}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${attr(canonical)}" />`)
    .replace(/<meta property="og:type"[^>]*>/, '<meta property="og:type" content="website" />')
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${attr(title)}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${attr(description)}" />`)
    .replace("</head>", `<meta name="robots" content="${noIndex ? "noindex, nofollow" : "index, follow"}" /></head>`);
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  headers.set("Pragma", "no-cache");
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
}

function preventHtmlCaching(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;
  const headers = new Headers(response.headers); headers.set("Cache-Control", "no-store, no-cache, must-revalidate"); headers.set("Pragma", "no-cache");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function injectNotFoundSeo(response, url) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return new Response(response.body, { status: 404, headers: response.headers });
  const canonical = `${url.origin}${normalizedPath(url.pathname)}`;
  let html = await response.text();
  html = html
    .replace(/<title>[^<]*<\/title>/, "<title>Page not found | iSmartTech NZ</title>")
    .replace(/<meta name="description"[^>]*>/, '<meta name="description" content="The requested iSmartTech page could not be found." />')
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`);
  const robots = '<meta name="robots" content="noindex, nofollow" />';
  html = /<meta name="robots"[^>]*>/.test(html)
    ? html.replace(/<meta name="robots"[^>]*>/, robots)
    : html.replace("</head>", robots + "</head>");
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  headers.set("Pragma", "no-cache");
  return new Response(html, { status: 404, headers });
}
