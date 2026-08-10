import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { money } from "../lib/products";
import type { Product } from "../types";
import { ProductVisual } from "./ProductVisual";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  return (
    <article className="product-card">
      <Link className="product-card__visual" to={`/products/${product.id}`}>
        {product.badge && <span className="badge">{product.badge}</span>}
        <ProductVisual icon={product.icon} accent={product.accent} />
      </Link>
      <div className="product-card__content">
        <span className="eyebrow">{product.brand} · {product.category}</span>
        <Link to={`/products/${product.id}`}><h3>{product.name}</h3></Link>
        <div className="rating" aria-label={`${product.rating} out of 5 stars`}><span>★★★★★</span> {product.rating} <small>({product.reviews})</small></div>
        <div className="product-card__buy">
          <div><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}<small>inc GST</small></div>
          <button className="icon-button" onClick={() => addItem(product.id)} aria-label={`Add ${product.name} to cart`}>＋</button>
        </div>
        <p className="stock"><i /> In stock · Ships today</p>
      </div>
    </article>
  );
}
