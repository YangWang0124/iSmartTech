import seedProducts from "../src/data/products.json";
import { fetchCatalogue } from "./catalogue-source.js";

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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return handleApi(request, env, url);
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return preventHtmlCaching(response);
    if (request.method === "GET" && !url.pathname.includes(".")) {
      const indexResponse = await env.ASSETS.fetch(new Request(new URL("/index.html", url), request));
      return preventHtmlCaching(indexResponse);
    }
    return response;
  },
};

async function handleApi(request, env, url) {
  try {
    if (url.pathname === "/api/catalogue-source" && request.method === "GET") {
      const products = await fetchCatalogue();
      return Response.json(products, { headers: { "Cache-Control": "public, max-age=300, s-maxage=900" } });
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
function preventHtmlCaching(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;
  const headers = new Headers(response.headers); headers.set("Cache-Control", "no-store, no-cache, must-revalidate"); headers.set("Pragma", "no-cache");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
