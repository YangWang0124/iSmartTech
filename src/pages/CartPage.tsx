import { Link } from "react-router-dom";
import { ProductVisual } from "../components/ProductVisual";
import { useCart } from "../context/CartContext";
import { money, products } from "../lib/products";

export function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const rows = items.flatMap((item) => { const product = products.find((p) => p.id === item.productId); return product ? [{ ...item, product }] : []; });
  const subtotal = rows.reduce((sum, row) => sum + row.product.price * row.quantity, 0);

  if (!rows.length) return <main className="page container empty-cart"><div className="empty-cart__icon">▰</div><span className="eyebrow">YOUR CART</span><h1>Your cart is ready for ideas</h1><p>Explore our catalogue and add the products that fit your security setup.</p><Link className="button button--primary" to="/products">Browse products →</Link></main>;

  return (
    <main className="page container"><div className="breadcrumb">Home <span>›</span> Cart</div><div className="page-title"><div><span className="eyebrow">YOUR CART</span><h1>Shopping cart</h1></div><button className="text-button" onClick={clearCart}>Clear cart</button></div>
      <div className="cart-layout"><section className="cart-list">{rows.map(({ product, quantity }) => <article className="cart-item" key={product.id}><Link to={`/products/${product.id}`}><ProductVisual icon={product.icon} accent={product.accent} /></Link><div className="cart-item__details"><span className="eyebrow">{product.brand}</span><Link to={`/products/${product.id}`}><h2>{product.name}</h2></Link><p className="stock"><i /> In stock</p><button className="text-button" onClick={() => removeItem(product.id)}>Remove</button></div><label>Quantity<select value={quantity} onChange={(e) => updateQuantity(product.id, Number(e.target.value))}>{[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n}>{n}</option>)}</select></label><strong className="cart-item__price">{money(product.price * quantity)}</strong></article>)}</section>
        <aside className="cart-summary"><h2>Order summary</h2><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>GST included</span><span>{money(subtotal * 3 / 23)}</span></div><div><span>Delivery</span><span>Calculated later</span></div><div className="cart-summary__total"><span>Total</span><strong>{money(subtotal)}</strong></div><button className="button button--primary" onClick={() => alert("Checkout is intentionally disabled in this display prototype.")}>Prototype checkout</button><p>Demo only—no payment will be taken.</p><Link to="/products">← Continue shopping</Link></aside>
      </div>
    </main>
  );
}
