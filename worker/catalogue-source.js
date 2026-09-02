const API_ORIGIN = "https://api.ismarttech.co.nz";

const categoryStyle = {
  2: ["CAM", "blue"],
  3: ["HOME", "green"],
  4: ["INT", "blue"],
  5: ["ALM", "green"],
  6: ["AUD", "blue"],
  7: ["NET", "green"],
  8: ["TECH", "blue"],
};

function flattenCategories(categories, parentId = null, result = new Map()) {
  for (const category of categories || []) {
    result.set(Number(category.id), { title: category.title, parentId });
    flattenCategories(category.sub_cat, Number(category.id), result);
  }
  return result;
}

function rootCategoryId(id, categoryMap) {
  let current = Number(id);
  while (categoryMap.get(current)?.parentId) current = categoryMap.get(current).parentId;
  return current;
}

function imageUrl(path) {
  if (!path) return undefined;
  return path.startsWith("http") ? path : `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}

function readableName(product) {
  return String(product.name || product.sku || product.url || `Product ${product.id}`).trim();
}

function decodeText(value = "") {
  return String(value)
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function featureLines(value) {
  return decodeText(value).split("\n").map(line => line.replace(/^[•·*-]\s*/, "").trim()).filter(Boolean);
}

function pricing(product) {
  const regular = Number(product.price) || 0;
  const sale = Number(product.discount) || 0;
  return { price: sale > 0 ? sale : regular, oldPrice: sale > 0 ? regular : undefined };
}

function productVariants(value) {
  const entries = Array.isArray(value) ? value : value && typeof value === "object" ? Object.values(value) : [];
  return entries.map((entry, index) => {
    if (typeof entry === "string") return { id: String(index), name: entry };
    return {
      id: String(entry.id ?? entry.product_id ?? index),
      name: String(entry.name ?? entry.sku ?? entry.title ?? `Option ${index + 1}`),
      sku: entry.sku ? String(entry.sku) : undefined,
      price: Number.isFinite(Number(entry.discount)) && Number(entry.discount) > 0 ? Number(entry.discount) : Number.isFinite(Number(entry.price)) ? Number(entry.price) : undefined,
      stock: Number.isFinite(Number(entry.stock)) ? Number(entry.stock) : undefined,
    };
  });
}

function productColors(product) {
  const value = product.colors ?? product.colours ?? product.color_options ?? product.colour_options;
  const entries = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
  return [...new Set(entries.map((entry) => {
    if (typeof entry === "string") return entry.trim();
    return String(entry?.name ?? entry?.title ?? entry?.value ?? "").trim();
  }).filter(Boolean))];
}

export async function fetchCatalogue(fetcher = fetch) {
  const endpoints = ["/Product/All", "/Product/AllBrand", "/Product/AllCategory"];
  const responses = await Promise.all(endpoints.map(path => fetcher(`${API_ORIGIN}${path}`, { headers: { Accept: "application/json" } })));
  if (responses.some(response => !response.ok)) throw new Error("The iSmartTech catalogue service is unavailable.");
  const [products, brands, categories] = await Promise.all(responses.map(response => response.json()));
  const brandMap = new Map(brands.map(brand => [Number(brand.brand_id), brand.brand_name_en || "iSmartTech"]));
  const categoryMap = flattenCategories(categories);

  return products.map(product => {
    const categoryIds = (product.category || []).map(Number).filter(Boolean);
    const primaryCategoryId = categoryIds.at(-1) || 8;
    const rootId = rootCategoryId(primaryCategoryId, categoryMap);
    const [icon, accent] = categoryStyle[rootId] || categoryStyle[8];
    const brand = product.brand_name || brandMap.get(Number(product.brand_id)) || "iSmartTech";
    const category = categoryMap.get(primaryCategoryId)?.title || categoryMap.get(rootId)?.title || "Other";
    const name = readableName(product);
    const images = (product.image || []).map(image => imageUrl(image.photo_md || image.photo_sm || image.photo_bg)).filter(Boolean);
    return {
      id: `source-${product.id}`,
      name,
      brand,
      category,
      categoryIds,
      tagIds: (product.tag || []).map(Number).filter(Boolean),
      ...pricing(product),
      sku: String(product.sku || product.id),
      rating: Number(product.rating) || 0,
      reviews: Array.isArray(product.review) ? product.review.length : 0,
      stock: Math.max(0, Number(product.stock) || 0),
      isAssembled: Boolean(product.is_assembled),
      subProducts: productVariants(product.sub_products),
      badge: product.promotion ? "Promotion" : product.hot ? "Popular" : product.new ? "New" : undefined,
      icon,
      accent,
      image: images[0],
      galleryImages: images.slice(1),
      featureImages: [],
      colors: productColors(product),
      published: true,
      shortDescription: `${brand} ${category}`,
      description: `${name} is supplied through the iSmartTech catalogue. Contact our team if you need compatibility, installation or specification advice.`,
      features: [],
      specifications: { SKU: String(product.sku || product.id), Brand: brand, Category: category },
    };
  });
}

export async function fetchCatalogueProduct(id, fetcher = fetch) {
  const response = await fetcher(`${API_ORIGIN}/Product?id=${encodeURIComponent(id)}`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("The iSmartTech product service is unavailable.");
  const product = await response.json();
  const features = featureLines(product.shortDescription);
  const images = (product.image || []).map(image => imageUrl(image.photo_bg || image.photo_md || image.photo_sm)).filter(Boolean);
  const brand = product.brand_name || "iSmartTech";
  const name = readableName(product);
  return {
    id: `source-${product.id}`,
    name,
    brand,
    ...pricing(product),
    sku: String(product.sku || product.id),
    rating: Number(product.rating) || 0,
    reviews: Array.isArray(product.review) ? product.review.length : 0,
    stock: Math.max(0, Number(product.stock) || 0),
    isAssembled: Boolean(product.is_assembled),
    subProducts: productVariants(product.sub_products),
    image: images[0],
    galleryImages: images.slice(1),
    colors: productColors(product),
    shortDescription: features[0] || `${brand} product information`,
    description: features.join(" • ") || `${name} is supplied through the iSmartTech catalogue.`,
    features,
    specifications: { SKU: String(product.sku || product.id), Brand: brand },
  };
}
