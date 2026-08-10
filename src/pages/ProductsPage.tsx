import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductGrid } from "../components/ProductGrid";
import { brands, categories, products } from "../lib/products";

export function ProductsPage() {
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
      <div className="breadcrumb">Home <span>›</span> Products</div>
      <div className="page-title"><div><span className="eyebrow">OUR RANGE</span><h1>{category || "All products"}</h1><p>Professional technology selected for dependable New Zealand installations.</p></div><div className="results-count"><strong>{filtered.length}</strong> products</div></div>
      <div className="catalogue-toolbar">
        <button className="filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>☰ Filters</button>
        <label>Sort by <select value={sort} onChange={(e) => update("sort", e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select></label>
      </div>
      <div className="catalogue">
        <aside className={`filters ${filtersOpen ? "filters--open" : ""}`}>
          <div className="filters__head"><h2>Filter products</h2><button onClick={() => setParams({})}>Clear all</button></div>
          <label className="filter-search">Search<input value={query} onChange={(e) => update("q", e.target.value)} placeholder="Product or keyword" /></label>
          <fieldset><legend>Category</legend><label><input type="radio" name="category" checked={!category} onChange={() => update("category", "")} /> All categories</label>{categories.map((item) => <label key={item}><input type="radio" name="category" checked={category === item} onChange={() => update("category", item)} /> {item}<small>{products.filter((p) => p.category === item).length}</small></label>)}</fieldset>
          <fieldset><legend>Brand</legend><label><input type="radio" name="brand" checked={!brand} onChange={() => update("brand", "")} /> All brands</label>{brands.map((item) => <label key={item}><input type="radio" name="brand" checked={brand === item} onChange={() => update("brand", item)} /> {item}</label>)}</fieldset>
        </aside>
        <div className="catalogue__results"><div className="active-filters">{query && <button onClick={() => update("q", "")}>Search: {query} ×</button>}{category && <button onClick={() => update("category", "")}>{category} ×</button>}{brand && <button onClick={() => update("brand", "")}>{brand} ×</button>}</div><ProductGrid products={filtered} /></div>
      </div>
    </main>
  );
}
