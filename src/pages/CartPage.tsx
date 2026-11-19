import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ProductVisual } from "../components/ProductVisual";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { customerRequest, money } from "../lib/products";
import { useProducts } from "../context/ProductContext";

type Review = {lines:Array<{sku:string;name:string;quantity:number;unit_cents:number;line_cents:number}>;subtotal_cents:number;installation_cents:number;shipping_cents:number|null;total_cents:number;shipping_pending:boolean};
type PlacedOrder = {id:number;total_cents:number;shipping_pending:boolean};
export function CartPage() {
  const {products,loading:productsLoading,refresh}=useProducts();
  const {user,loading:authLoading}=useAuth();
  const {items,updateQuantity,removeItem,clearCart}=useCart();
  const [checkout,setCheckout]=useState(false),[review,setReview]=useState<Review|null>(null),[placed,setPlaced]=useState<PlacedOrder|null>(null);
  const [address,setAddress]=useState(''),[phone,setPhone]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const rows=items.flatMap(item=>{const product=products.find(p=>p.id===item.productId);return product?[{...item,product}]:[];});
  const unit=(row:typeof rows[number])=>row.customKitId&&!row.product.oldPrice&&row.product.categoryIds?.some(id=>[13,14,15,16,17,18,19].includes(id))?Math.round(row.product.price*90)/100:row.product.price;
  const installation=(row:typeof rows[number])=>row.installation&&(row.installationCost??0)>0?60+row.installation.storeys*30+(row.installation.noRoofAccess?30:0):0;
  const subtotal=rows.reduce((sum,row)=>sum+unit(row)*row.quantity+installation(row),0);
  const payload=()=>({address:address.trim(),phone:phone.trim(),items:rows.map(row=>({sku:row.product.sku,quantity:String(row.quantity),kit:row.customKitId||'',
    ...(row.installation&&(row.installationCost??0)>0?{installation:{storeys:String(row.installation.storeys),noRoofAccess:row.installation.noRoofAccess}}:{})}))});
  const preview=async(event:FormEvent)=>{
    event.preventDefault();setError('');setBusy(true);
    try {
      if(rows.length!==items.length)throw new Error('Some cart products are no longer available. Remove them or start a new cart.');
      setReview(await customerRequest<Review>('checkout/preview',payload()));
    } catch(cause){setError(cause instanceof Error?cause.message:'Unable to review order.');}
    finally{setBusy(false);}
  };
  const place=async()=>{
    if(!review)return;setError('');setBusy(true);
    try {
      const body={...payload(),expected_total_cents:review.total_cents};
      const signature=JSON.stringify(body);
      let saved:{signature:string;key:string}|null=null;
      try{saved=JSON.parse(sessionStorage.getItem('ismarttech-checkout-request')||'null');}catch{/* Start a fresh checkout reference. */}
      const key=saved?.signature===signature?saved.key:crypto.randomUUID();
      sessionStorage.setItem('ismarttech-checkout-request',JSON.stringify({signature,key}));
      const order=await customerRequest<PlacedOrder>('checkout',{...body,request_key:key});
      setPlaced(order);clearCart();sessionStorage.removeItem('ismarttech-checkout-request');void refresh();
    } catch(cause){setError(cause instanceof Error?cause.message:'Unable to place order.');}
    finally{setBusy(false);}
  };
  if(placed)return <main className="page container account-shell"><section className="account-card"><span className="eyebrow">ORDER RECEIVED</span><h1>Thank you. Order #{placed.id}</h1><p>Your items are reserved and your order is awaiting manual payment.</p><p>{placed.shipping_pending?'Staff will confirm delivery charges before payment.':'Delivery is included.'} No money has been taken.</p><p>Order total{placed.shipping_pending?' before delivery':''}: <strong>{money(placed.total_cents/100)}</strong></p><Link className="button button--primary" to="/account">View my orders</Link></section></main>;
  if(productsLoading||authLoading)return <main className="page container"><p>Loading your cart…</p></main>;
  if(!items.length)return <main className="page container empty-cart"><div className="empty-cart__icon">▰</div><span className="eyebrow">YOUR CART</span><h1>Your cart is ready for ideas</h1><p>Explore our catalogue and add the products that fit your security setup.</p><Link className="button button--primary" to="/products">Browse products →</Link></main>;
  return <main className="page container"><div className="breadcrumb">Home <span>›</span> Cart</div><div className="page-title"><div><span className="eyebrow">YOUR CART</span><h1>{checkout?'Checkout':'Shopping cart'}</h1></div><button className="text-button" disabled={busy} onClick={()=>{clearCart();setReview(null);}}>Clear cart</button></div>
    {rows.length!==items.length&&<p role="alert">Some cart products are unavailable. <button className="text-button" onClick={clearCart}>Clear cart</button> to start again.</p>}
    <div className="cart-layout"><section className="cart-list">{!checkout?rows.map(row=><article className="cart-item" key={`${row.product.id}-${row.customKitId||'standard'}`}><Link to={`/products/${row.product.id}`}><ProductVisual icon={row.product.icon} accent={row.product.accent} image={row.product.image} alt={row.product.name}/></Link><div className="cart-item__details"><span className="eyebrow">{row.customKitId?'CUSTOM CCTV KIT · ':''}{row.product.brand}</span><Link to={`/products/${row.product.id}`}><h2>{row.product.name}</h2></Link>{installation(row)>0&&row.installation&&<p>Installation: {row.installation.storeys} storey(s){row.installation.noRoofAccess?' · conduit access':''}</p>}<p>{row.product.stock>0?`${row.product.stock} available`:'Out of stock'}</p><button className="text-button" onClick={()=>removeItem(row.product.id)}>Remove</button></div><label>Quantity<input type="number" min={1} max={1000} value={row.quantity} disabled={Boolean(row.customKitId)} onChange={event=>{const n=Number(event.target.value);if(Number.isInteger(n)&&n>0&&n<=1000)updateQuantity(row.product.id,n);}}/></label><strong className="cart-item__price">{row.product.priceOnRequest?'Price on request':money(unit(row)*row.quantity+installation(row))}</strong></article>):<section className="checkout-details"><h2>Delivery details</h2><p>Ordering as {user?.name} · {user?.email}</p><form onSubmit={preview}><label>Delivery address<textarea required minLength={5} maxLength={2000} autoComplete="shipping street-address" value={address} disabled={busy} onChange={event=>{setAddress(event.target.value);setReview(null);}}/></label><label>Contact phone<input required minLength={3} maxLength={100} type="tel" autoComplete="tel" value={phone} disabled={busy} onChange={event=>{setPhone(event.target.value);setReview(null);}}/></label><button className="button button--primary" disabled={busy}>{busy?'Checking…':'Review order'}</button><button type="button" className="button button--ghost" disabled={busy} onClick={()=>{setCheckout(false);setReview(null);}}>Back to cart</button></form>{review&&<div className="checkout-review"><h2>Review your order</h2>{review.lines.map((line,index)=><p key={line.sku+index}>{line.name} × {line.quantity} — {money(line.line_cents/100)}</p>)}{review.installation_cents>0&&<p>Installation: {money(review.installation_cents/100)}</p>}<p>Delivery: {review.shipping_pending?'Staff will confirm the charge before payment.':money((review.shipping_cents||0)/100)}</p><p><strong>Total{review.shipping_pending?' before delivery':''}: {money(review.total_cents/100)}</strong></p><p>No online payment is taken. Staff will confirm payment arrangements. Reservations last seven days unless paid or cancelled.</p><button className="button button--primary" disabled={busy||!user?.can_purchase} onClick={()=>void place()}>{busy?'Placing order…':'Place order — pay manually'}</button></div>}</section>}</section>
    <aside className="cart-summary"><h2>Order summary</h2><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>GST included</span><span>{money(subtotal*3/23)}</span></div><div><span>Delivery</span><span>{subtotal>=2000?'Free':'Confirmed by staff'}</span></div><div className="cart-summary__total"><span>Total before delivery</span><strong>{money(subtotal)}</strong></div>{!user?<Link className="button button--primary" to="/signin" state={{from:'/cart'}}>Sign in to checkout</Link>:!user.can_purchase?<p role="alert">Purchasing is disabled for your account. Please contact the store.</p>:!checkout?<button className="button button--primary" disabled={busy||rows.length!==items.length} onClick={()=>{setAddress(user.address||'');setPhone(user.phone||'');setCheckout(true);setError('');}}>Proceed to checkout</button>:null}<p>Prices and stock are checked again before your order is placed.</p>{error&&<p className="account-error" role="alert">{error}</p>}<Link to="/products">← Continue shopping</Link></aside></div></main>;
}
