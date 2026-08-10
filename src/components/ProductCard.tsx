import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { money } from "../lib/products";
import type { Product } from "../types";
import { ProductVisual } from "./ProductVisual";
import { useLanguage } from "../context/LanguageContext";
import { localizeProduct } from "../lib/product-i18n";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { language } = useLanguage();
  const displayed = localizeProduct(product, language);
  return (
    <article className="product-card">
      <Link className="product-card__visual" to={`/products/${product.id}`}>
        {product.badge && <span className="badge">{product.badge}</span>}
        <ProductVisual icon={displayed.icon} accent={displayed.accent} />
      </Link>
      <div className="product-card__content">
        <span className="eyebrow">{displayed.brand} · {displayed.category}</span>
        <Link to={`/products/${displayed.id}`}><h3>{displayed.name}</h3></Link>
        <div className="rating" aria-label={`${product.rating} out of 5 stars`}><span>★★★★★</span> {product.rating} <small>({product.reviews})</small></div>
        <div className="product-card__buy">
          <div><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}<small>inc GST</small></div>
          <button className="icon-button" onClick={() => addItem(product.id)} aria-label={`Add ${product.name} to cart`}>＋</button>
        </div>
        <p className="stock"><i /> {language === "zh" ? "有货 · 今日发货" : "In stock · Ships today"}</p>
      </div>
    </article>
  );
}
