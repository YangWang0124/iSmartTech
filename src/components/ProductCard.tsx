import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { money } from "../lib/products";
import type { Product } from "../types";
import { ProductVisual } from "./ProductVisual";
import { useLanguage } from "../context/LanguageContext";
import { localizeProduct } from "../lib/product-i18n";
import { getProductBrandLogo } from "../lib/product-branding";
import "../product-card-branding.css";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { language } = useLanguage();
  const displayed = localizeProduct(product, language);
  const brandLogo = getProductBrandLogo(product.brand);
  const compactBoard = product.id === "paradox-mg5050-control-panel" || product.id === "paradox-sp5500-control-panel";
  return (
    <article className={`product-card${compactBoard ? " product-card--compact-board" : ""}`}>
      <Link className="product-card__visual" to={`/products/${product.id}`}>
        {product.badge && <span className="badge">{product.badge}</span>}
        <ProductVisual
          icon={displayed.icon}
          accent={displayed.accent}
          image={displayed.image}
          alt={displayed.name}
        />
        {brandLogo && (
          <span className={`product-card__brand product-card__brand--${brandLogo.key}`}>
            <img src={brandLogo.src} alt={`${product.brand} logo`} loading="lazy" />
          </span>
        )}
      </Link>
      <div className="product-card__content">
        <span className="eyebrow">
          {displayed.category} · {displayed.sku}
        </span>
        <Link to={`/products/${displayed.id}`}>
          <h3>{displayed.name}</h3>
        </Link>
        <p className="stock">
          <i />{" "}
          {product.priceOnRequest
            ? language === "zh"
              ? "库存请询问"
              : "Stock on request"
            : product.stock > 0
            ? language === "zh"
              ? "有货"
              : "In stock"
            : language === "zh"
            ? "暂时缺货"
            : "Currently unavailable"}
        </p>
        <div className="product-card__buy">
          <div>
            <strong>
              {product.priceOnRequest
                ? "Price on request"
                : money(product.price)}
            </strong>
            {product.oldPrice && <del>{money(product.oldPrice)}</del>}
            <small>
              {product.priceOnRequest ? "Contact us for a quote" : "inc GST"}
            </small>
          </div>
          {product.priceOnRequest ? (
            <Link
              className="icon-button"
              to="/contact"
              aria-label={`Request a quote for ${product.name}`}
            >
              →
            </Link>
          ) : (
            <button
              className="icon-button"
              onClick={() => addItem(product.id)}
              aria-label={`Add ${product.name} to cart`}
            >
              ＋
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
