import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ProductGrid } from "../components/ProductGrid";
import { useProducts } from "../context/ProductContext";
import { categoryBySlug, descendantIds, technicalFilters } from "../lib/catalogue";

export function ProductsPage() {
  const { products, brands } = useProducts();
  const { categorySlug } = useParams();
  const categoryEntry = categorySlug ? categoryBySlug.get(categorySlug) : undefined;
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = params.get("q") ?? "";
  const brand = params.get("brand") ?? "";
  const sort = params.get("sort") ?? "default";
  const selectedTags = technicalFilters.map(filter => Number(params.get(filter.key))).filter(Boolean);
  const update = (key: string, value: string) => { const next = new URLSearchParams(params); value ? next.set(key, value) : next.delete(key); setParams(next); };
  const categoryIds = categoryEntry ? descendantIds(categoryEntry.category) : [];
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const result = products.filter(product => (!term || term.length < 2 || `${product.name} ${product.sku} ${product.brand} ${product.shortDescription} ${product.description}`.toLowerCase().includes(term)) && (!categoryIds.length || product.categoryIds?.some(id => categoryIds.includes(id))) && (!brand || product.brand === brand) && (!params.get("stock") || product.stock > 0) && selectedTags.every(tag => product.tagIds?.includes(tag)));
    return [...result].sort((a, b) => sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : sort === "rating-desc" ? b.rating - a.rating : 0);
  }, [products, query, brand, sort, categorySlug, params.toString()]);
  const crumbs = categoryEntry ? [...categoryEntry.ancestors, categoryEntry.category] : [];
  const isCamera = crumbs.some(item => item.id === 9);
  return <main className="page container catalogue-page">
    <div className="breadcrumb"><Link to="/">Home</Link><span>›</span><Link to="/products">Products</Link>{crumbs.map(item => <span className="breadcrumb__pair" key={item.id}><span>›</span><Link to={`/category/${item.links}`}>{item.title}</Link></span>)}</div>
    <div className="page-title"><div><span className="eyebrow">CATALOGUE</span><h1>{categoryEntry?.category.title || "All products"}</h1><p>Browse iSmartTech products using the complete catalogue structure and technical filters.</p></div><div className="results-count"><strong>{filtered.length}</strong> products</div></div>
    {categoryEntry?.category.sub_cat.length ? <div className="subcategory-chips">{categoryEntry.category.sub_cat.map(child => <Link key={child.id} to={`/category/${child.links}`}>{child.title}<span>›</span></Link>)}</div> : null}
    <div className="catalogue-toolbar"><button className="filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>☰ Filters</button><div className="view-switch" aria-label="View style"><button className="active">▦ Grid</button><button>☷ List</button></div><label>Sort by <select value={sort} onChange={e => update("sort", e.target.value)}><option value="default">Default</option><option value="price-desc">Price - High to Low</option><option value="price-asc">Price - Low to High</option><option value="sales-desc">Sales Count - High to Low</option><option value="rating-desc">Rating - High to Low</option></select></label></div>
    <div className="catalogue"><aside className={`filters catalogue-filters ${filtersOpen ? "filters--open" : ""}`}><div className="filters__head"><h2>Filter products</h2><button onClick={() => setParams({})}>Clear all</button></div><label className="filter-search">Search<input value={query} onChange={e => update("q", e.target.value)} placeholder="Name, SKU or brand" /><small>Enter at least 2 characters</small></label><fieldset><legend>Brand</legend><label><input type="radio" name="brand" checked={!brand} onChange={() => update("brand", "")} /> All brands</label>{brands.map(item => <label key={item}><input type="radio" name="brand" checked={brand === item} onChange={() => update("brand", item)} /> {item}</label>)}</fieldset><fieldset><legend>Availability</legend><label><input type="checkbox" checked={params.get("stock") === "1"} onChange={e => update("stock", e.target.checked ? "1" : "")} /> In stock</label></fieldset>{isCamera && technicalFilters.map(filter => <fieldset key={filter.key}><legend>{filter.label}</legend>{filter.options.map(([id, label]) => <label key={id}><input type="radio" name={filter.key} checked={params.get(filter.key) === String(id)} onChange={() => update(filter.key, String(id))} /> {label}</label>)}</fieldset>)}</aside><div className="catalogue__results"><ProductGrid products={filtered} />{!filtered.length && <div className="catalogue-empty"><h2>No matching products</h2><p>Try another category or clear the selected filters.</p></div>}</div></div>
  </main>;
}
