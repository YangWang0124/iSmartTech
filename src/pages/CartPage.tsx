import { useEffect, useRef, useState, type FormEvent } from "react";
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
  const [address,setAddress]=useState(''),[phone,setPhone]=useState(''),[busy,setBusy]=useState(false),[checking,setChecking]=useState(false),[error,setError]=useState('');
  const placing=useRef(false);
  const rows=items.flatMap(item=>{const product=products.find(p=>p.id===item.productId);return product?[{...item,product}]:[];});
  const unit=(row:typeof rows[number])=>row.customKitId&&!row.product.oldPrice&&row.product.categoryIds?.some(id=>[13,14,15,16,17,18,19].includes(id))?Math.round(row.product.price*90)/100:row.product.price;
  const installation=(row:typeof rows[number])=>row.installation&&(row.installationCost??0)>0?60+row.installation.storeys*30+(row.installation.noRoofAccess?30:0):0;
  const itemSubtotal=rows.reduce((sum,row)=>sum+unit(row)*row.quantity,0),installationTotal=rows.reduce((sum,row)=>sum+installation(row),0);
  const cartLines=rows.map(row=>({sku:row.product.sku,quantity:String(row.quantity),kit:row.customKitId||'',...(row.installation&&(row.installationCost??0)>0?{installation:{storeys:String(row.installation.storeys),noRoofAccess:row.installation.noRoofAccess}}:{})}));
  const linesKey=JSON.stringify(cartLines),customerId=user?.id,customerVersion=user?.version;
  useEffect(()=>{
    if(!checkout||!customerId||!items.length||productsLoading)return;
    let active=true;setChecking(true);setReview(null);setError('');
    void customerRequest<Review>('checkout/preview',{items:JSON.parse(linesKey)}).then(result=>{if(active)setReview(result);}).catch(cause=>{if(active)setError(cause instanceof Error?cause.message:'Unable to calculate your order.');}).finally(()=>{if(active)setChecking(false);});
    return()=>{active=false;};
  },[checkout,customerId,customerVersion,items.length,linesKey,productsLoading]);
  const place=async()=>{
    if(placing.current)return;
    setError('');
    if(address.trim().length<5){setError('Please enter your full delivery address (at least 5 characters).');document.getElementById('checkout-address')?.focus();return;}
    if(phone.trim().length<3){setError('Please enter a contact phone number (at least 3 characters).');document.getElementById('checkout-phone')?.focus();return;}
    if(!user?.can_purchase||!user.email_verified){setError('Sign in with a verified account that has purchasing enabled.');return;}
    placing.current=true;setBusy(true);
    try {
      if(rows.length!==items.length)throw new Error('Some cart products are unavailable. Return to your cart to update it.');
      const payload={address:address.trim(),phone:phone.trim(),items:cartLines};
      const latest=await customerRequest<Review>('checkout/preview',payload);
      if(review&&latest.total_cents!==review.total_cents){setReview(latest);throw new Error('Prices changed. Please check the updated order summary, then place your order again.');}
      const body={...payload,expected_total_cents:latest.total_cents},signature=JSON.stringify({customerId,...body});
      let saved:{signature:string;key:string}|null=null;
      try{saved=JSON.parse(sessionStorage.getItem('ismarttech-checkout-request')||'null');}catch{/* Use a fresh reference. */}
      const key=saved?.signature===signature?saved.key:crypto.randomUUID();
      sessionStorage.setItem('ismarttech-checkout-request',JSON.stringify({signature,key}));
      const order=await customerRequest<PlacedOrder>('checkout',{...body,request_key:key});
      clearCart();setPlaced(order);setCheckout(false);setReview(null);window.scrollTo({top:0,behavior:'smooth'});
      sessionStorage.removeItem('ismarttech-checkout-request');void refresh().catch(()=>{});
    }catch(cause){setError(cause instanceof Error?cause.message:'Unable to place order.');}
    finally{setBusy(false);placing.current=false;}
  };
  const beginCheckout=()=>{setAddress(user?.address||'');setPhone(user?.phone||'');setCheckout(true);setError('');};
  const subtotal=checkout&&review?review.subtotal_cents/100:itemSubtotal;
  const installationCharge=checkout&&review?review.installation_cents/100:installationTotal;
  const total=checkout&&review?review.total_cents/100:subtotal+installationCharge;
  const shippingPending=checkout&&review?review.shipping_pending:true;
  if(placed)return <main className="page container account-shell cart-page"><section className="account-card"><span className="eyebrow">ORDER RECEIVED</span><h1>Thank you. Order #{placed.id}</h1><p>Your items are reserved and your cart has been cleared.</p><p>{placed.shipping_pending?'The store will confirm your delivery charge before payment.':'Delivery is included.'} No money has been taken.</p><p>Order total{placed.shipping_pending?' before delivery':''}: <strong>{money(placed.total_cents/100)}</strong></p><Link className="button button--primary" to="/account">View my orders</Link><p><Link to="/products">Continue shopping</Link></p></section></main>;
  if(productsLoading||authLoading)return <main className="page container"><p>Loading your cart…</p></main>;
  if(!items.length)return <main className="page container empty-cart"><div className="empty-cart__icon">▰</div><span className="eyebrow">YOUR CART</span><h1>Your cart is ready for ideas</h1><p>Explore our catalogue and add the products that fit your security setup.</p><Link className="button button--primary" to="/products">Browse products →</Link></main>;
  return <main className="page container cart-page"><div className="breadcrumb">Home <span>›</span> Cart</div><div className="page-title"><div><span className="eyebrow">YOUR CART</span><h1>{checkout?'Checkout':'Shopping cart'}</h1></div><button className="text-button" disabled={busy} onClick={clearCart}>Clear cart</button></div>
    {rows.length!==items.length&&<p role="alert">Some cart products are unavailable. Clear your cart to start again.</p>}
    <div className="cart-layout"><section className="cart-list">{!checkout?rows.map(row=><article className="cart-item" key={`${row.product.id}-${row.customKitId||'standard'}`}><Link to={`/products/${row.product.id}`}><ProductVisual icon={row.product.icon} accent={row.product.accent} image={row.product.image} alt={row.product.name}/></Link><div className="cart-item__details"><Link to={`/products/${row.product.id}`}><h2>{row.product.name}</h2></Link>{row.customKitId&&<small>Custom CCTV kit</small>}{installation(row)>0&&<p>Installation included</p>}<button className="text-button" onClick={()=>removeItem(row.product.id)}>Remove</button></div><label>Quantity<input type="number" min={1} max={Math.max(1,row.product.stock)} value={row.quantity} disabled={Boolean(row.customKitId)} onChange={event=>{const n=Number(event.target.value);if(Number.isInteger(n)&&n>0&&n<=row.product.stock)updateQuantity(row.product.id,n);}}/></label><strong className="cart-item__price">{row.product.priceOnRequest?'Price on request':money(unit(row)*row.quantity+installation(row))}</strong></article>):<section className="checkout-details"><h2>Delivery details</h2><p>Ordering as {user?.email}</p><form id="checkout-form" noValidate onSubmit={(event:FormEvent)=>{event.preventDefault();void place();}}><label>Delivery address<textarea id="checkout-address" required minLength={5} maxLength={2000} autoComplete="shipping street-address" value={address} disabled={busy} onChange={event=>setAddress(event.target.value)}/></label><label>Contact phone<input id="checkout-phone" required minLength={3} maxLength={100} type="tel" autoComplete="tel" value={phone} disabled={busy} onChange={event=>setPhone(event.target.value)}/></label></form></section>}</section>
    <aside className="cart-summary"><h2>Order summary</h2>{checkout&&<ul className="checkout-summary-lines">{(review?.lines||rows.map(row=>({sku:row.product.sku,name:row.product.name,quantity:row.quantity,line_cents:Math.round(unit(row)*row.quantity*100)}))).map((line,index)=><li key={line.sku+index}><span>{line.name} × {line.quantity}</span><strong>{money(line.line_cents/100)}</strong></li>)}</ul>}
    <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>{installationCharge>0&&<div><span>Installation</span><strong>{money(installationCharge)}</strong></div>}<div><span>GST included</span><span>{money(total*3/23)}</span></div><div><span>Delivery</span><span>{shippingPending?'Charge to be confirmed':'Free'}</span></div><div className="cart-summary__total"><span>{shippingPending?'Total before delivery':'Total'}</span><strong>{money(total)}</strong></div>
    {!user?<Link className="button button--primary" to="/signin" state={{from:'/cart'}}>Sign in to checkout</Link>:!user.can_purchase?<p role="alert">Purchasing is disabled for your account. Please contact the store.</p>:!user.email_verified?<Link className="button button--primary" to="/account">Verify email to checkout</Link>:!checkout?<button className="button button--primary" disabled={busy||rows.length!==items.length} onClick={beginCheckout}>Proceed to checkout</button>:<button className="button button--primary" type="button" onClick={()=>void place()} aria-describedby={error?'checkout-error':undefined} disabled={busy||checking}>{busy?'Placing order…':checking?'Calculating…':'Place order'}</button>}
    {shippingPending&&<p>The store will confirm the delivery charge before you pay.</p>}{checkout&&<p>No online payment is taken. Your order reserves the items for seven days.</p>}{error&&<p id="checkout-error" className="account-error" role="alert">{error}</p>}<Link className="cart-continue" to="/products">← Continue shopping</Link></aside></div></main>;
}
