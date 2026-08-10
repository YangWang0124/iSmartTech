import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductGrid } from "../components/ProductGrid";
import { ProductVisual } from "../components/ProductVisual";
import { useCart } from "../context/CartContext";
import { money } from "../lib/products";
import { localizeProduct } from "../lib/product-i18n";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/ProductContext";

export function ProductDetailPage() {
  const { id } = useParams();
  const { products } = useProducts();
  const baseProduct = products.find((item) => item.id === id);
  const { language } = useLanguage();
  const zh = language === "zh";
  const product = baseProduct ? localizeProduct(baseProduct, language) : undefined;
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  if (!product) return <main className="page container empty-state"><h1>Product not found</h1><Link className="button button--primary" to="/products">Back to products</Link></main>;
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const add = () => { addItem(product.id, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 1800); };

  return (
    <main className="page container">
      <div className="breadcrumb"><Link to="/">{zh ? "首页" : "Home"}</Link><span>›</span><Link to={`/products?category=${encodeURIComponent(baseProduct!.category)}`}>{product.category}</Link><span>›</span>{product.name}</div>
      <section className="product-detail">
        <div className="product-detail__gallery">{product.badge && <span className="badge">{product.badge}</span>}<ProductVisual icon={product.icon} accent={product.accent} image={product.image} alt={product.name} large />{!product.image && <div className="gallery-note">{zh ? "概念产品图 · 演示目录" : "Concept product visual · Prototype catalogue"}</div>}</div>
        <div className="product-detail__info"><span className="eyebrow">{product.brand} · SKU {product.sku}</span><h1>{product.name}</h1><div className="rating"><span>★★★★★</span> {product.rating} <small>{product.reviews} {zh ? "条评价" : "reviews"}</small></div><p className="lead">{product.shortDescription}</p><div className="detail-price"><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}<small>{zh ? "含税" : "inc GST"}</small></div><div className="availability"><i /> {zh ? "有货" : "In stock"} <span>·</span> {product.stock} {zh ? "件可售" : "available"} <span>·</span> {zh ? "通常今日发货" : "Usually ships today"}</div><div className="purchase-row"><label>{zh ? "数量" : "Qty"} <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>{[1,2,3,4,5].map((n) => <option key={n}>{n}</option>)}</select></label><button className="button button--primary" onClick={add}>{added ? (zh ? "✓ 已加入购物车" : "✓ Added to cart") : (zh ? "加入购物车" : "Add to cart")}</button></div><div className="detail-perks"><span>🚚 <b>{zh ? "新西兰全国配送" : "Nationwide delivery"}</b><small>{zh ? "结账时计算" : "Calculated at checkout"}</small></span><span>↺ <b>{zh ? "轻松退货" : "Easy returns"}</b><small>{zh ? "友好本地支持" : "Friendly local support"}</small></span><span>♢ <b>{zh ? "安全购买" : "Secure purchase"}</b><small>{zh ? "新西兰本地协助" : "NZ-based assistance"}</small></span></div></div>
      </section>
      <section className="product-content"><div><span className="eyebrow">{zh ? "产品概览" : "PRODUCT OVERVIEW"}</span><h2>{zh ? "专为可靠防护而打造" : "Made for dependable protection"}</h2><p>{product.description}</p><h3>{zh ? "主要功能" : "Key features"}</h3><ul>{product.features.map((feature) => <li key={feature}>✓ <span>{feature}</span></li>)}</ul></div><div className="spec-card"><h2>{zh ? "技术规格" : "Specifications"}</h2>{Object.entries(product.specifications).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}</div></section>
      {related.length > 0 && <section className="section"><div className="section-heading"><div><span className="eyebrow">{zh ? "您可能还喜欢" : "YOU MAY ALSO LIKE"}</span><h2>{zh ? "相关商品" : "Related products"}</h2></div></div><ProductGrid products={related} /></section>}
    </main>
  );
}
