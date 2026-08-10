import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductGrid } from "../components/ProductGrid";
import { brands, categories, products } from "../lib/products";
import { useLanguage } from "../context/LanguageContext";

const categoryZh: Record<string, string> = { "CCTV Cameras":"监控摄像头", "Security Kits":"安防套装", "Alarm Systems":"报警系统", "Intercoms":"可视对讲", "Networking":"网络设备", "Recorders":"录像机", "Storage":"存储设备" };

export function ProductsPage() {
  const { language } = useLanguage();
  const zh = language === "zh";
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const brand = params.get("brand") ?? "";
  const sort = params.get("sort") ?? "featured";

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next);
  };

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    const result = products.filter((product) =>
      (!term || `${product.name} ${product.brand} ${product.category} ${product.shortDescription}`.toLowerCase().includes(term)) &&
      (!category || product.category === category) && (!brand || product.brand === brand));
    return [...result].sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : sort === "rating" ? b.rating - a.rating : 0);
  }, [query, category, brand, sort]);

  return (
    <main className="page container">
      <div className="breadcrumb">{zh ? "首页" : "Home"} <span>›</span> {zh ? "产品" : "Products"}</div>
      <div className="page-title"><div><span className="eyebrow">{zh ? "产品系列" : "OUR RANGE"}</span><h1>{category ? (zh ? categoryZh[category] : category) : (zh ? "全部商品" : "All products")}</h1><p>{zh ? "为新西兰可靠安装精心挑选的专业技术产品。" : "Professional technology selected for dependable New Zealand installations."}</p></div><div className="results-count"><strong>{filtered.length}</strong> {zh ? "件商品" : "products"}</div></div>
      <div className="catalogue-toolbar">
        <button className="filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>☰ {zh ? "筛选" : "Filters"}</button>
        <label>{zh ? "排序" : "Sort by"} <select value={sort} onChange={(e) => update("sort", e.target.value)}><option value="featured">{zh ? "精选" : "Featured"}</option><option value="price-low">{zh ? "价格：从低到高" : "Price: low to high"}</option><option value="price-high">{zh ? "价格：从高到低" : "Price: high to low"}</option><option value="rating">{zh ? "最高评分" : "Top rated"}</option></select></label>
      </div>
      <div className="catalogue">
        <aside className={`filters ${filtersOpen ? "filters--open" : ""}`}>
          <div className="filters__head"><h2>{zh ? "筛选商品" : "Filter products"}</h2><button onClick={() => setParams({})}>{zh ? "清除全部" : "Clear all"}</button></div>
          <label className="filter-search">{zh ? "搜索" : "Search"}<input value={query} onChange={(e) => update("q", e.target.value)} placeholder={zh ? "商品或关键词" : "Product or keyword"} /></label>
          <fieldset><legend>{zh ? "类别" : "Category"}</legend><label><input type="radio" name="category" checked={!category} onChange={() => update("category", "")} /> {zh ? "全部类别" : "All categories"}</label>{categories.map((item) => <label key={item}><input type="radio" name="category" checked={category === item} onChange={() => update("category", item)} /> {zh ? categoryZh[item] : item}<small>{products.filter((p) => p.category === item).length}</small></label>)}</fieldset>
          <fieldset><legend>{zh ? "品牌" : "Brand"}</legend><label><input type="radio" name="brand" checked={!brand} onChange={() => update("brand", "")} /> {zh ? "全部品牌" : "All brands"}</label>{brands.map((item) => <label key={item}><input type="radio" name="brand" checked={brand === item} onChange={() => update("brand", item)} /> {item}</label>)}</fieldset>
        </aside>
        <div className="catalogue__results"><div className="active-filters">{query && <button onClick={() => update("q", "")}>Search: {query} ×</button>}{category && <button onClick={() => update("category", "")}>{category} ×</button>}{brand && <button onClick={() => update("brand", "")}>{brand} ×</button>}</div><ProductGrid products={filtered} /></div>
      </div>
    </main>
  );
}
