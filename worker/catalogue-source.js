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
      price: Number(product.price) || 0,
      oldPrice: Number(product.discount) > 0 ? Number(product.price) + Number(product.discount) : undefined,
      sku: String(product.sku || product.id),
      rating: Number(product.rating) || 0,
      reviews: Array.isArray(product.review) ? product.review.length : 0,
      stock: Math.max(0, Number(product.stock) || 0),
      badge: product.promotion ? "Promotion" : product.hot ? "Popular" : product.new ? "New" : undefined,
      icon,
      accent,
      image: images[0],
      galleryImages: images.slice(1),
      featureImages: [],
      colors: [],
      published: true,
      shortDescription: `${brand} ${category}`,
      description: `${name} is supplied through the iSmartTech catalogue. Contact our team if you need compatibility, installation or specification advice.`,
      features: [],
      specifications: { SKU: String(product.sku || product.id), Brand: brand, Category: category },
    };
  });
}
