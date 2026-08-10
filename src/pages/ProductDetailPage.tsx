import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductGrid } from "../components/ProductGrid";
import { ProductVisual } from "../components/ProductVisual";
import { useCart } from "../context/CartContext";
import { money, products } from "../lib/products";

export function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  if (!product) return <main className="page container empty-state"><h1>Product not found</h1><Link className="button button--primary" to="/products">Back to products</Link></main>;
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const add = () => { addItem(product.id, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 1800); };

  return (
    <main className="page container">
      <div className="breadcrumb"><Link to="/">Home</Link><span>›</span><Link to={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link><span>›</span>{product.name}</div>
      <section className="product-detail">
        <div className="product-detail__gallery">{product.badge && <span className="badge">{product.badge}</span>}<ProductVisual icon={product.icon} accent={product.accent} large /><div className="gallery-note">Concept product visual · Prototype catalogue</div></div>
        <div className="product-detail__info"><span className="eyebrow">{product.brand} · SKU {product.sku}</span><h1>{product.name}</h1><div className="rating"><span>★★★★★</span> {product.rating} <small>{product.reviews} reviews</small></div><p className="lead">{product.shortDescription}</p><div className="detail-price"><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}<small>inc GST</small></div><div className="availability"><i /> In stock <span>·</span> {product.stock} available <span>·</span> Usually ships today</div><div className="purchase-row"><label>Qty <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>{[1,2,3,4,5].map((n) => <option key={n}>{n}</option>)}</select></label><button className="button button--primary" onClick={add}>{added ? "✓ Added to cart" : "Add to cart"}</button></div><div className="detail-perks"><span>🚚 <b>Nationwide delivery</b><small>Calculated at checkout</small></span><span>↺ <b>Easy returns</b><small>Friendly local support</small></span><span>♢ <b>Secure purchase</b><small>NZ-based assistance</small></span></div></div>
      </section>
      <section className="product-content"><div><span className="eyebrow">PRODUCT OVERVIEW</span><h2>Made for dependable protection</h2><p>{product.description}</p><h3>Key features</h3><ul>{product.features.map((feature) => <li key={feature}>✓ <span>{feature}</span></li>)}</ul></div><div className="spec-card"><h2>Specifications</h2>{Object.entries(product.specifications).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}</div></section>
      {related.length > 0 && <section className="section"><div className="section-heading"><div><span className="eyebrow">YOU MAY ALSO LIKE</span><h2>Related products</h2></div></div><ProductGrid products={related} /></section>}
    </main>
  );
}
