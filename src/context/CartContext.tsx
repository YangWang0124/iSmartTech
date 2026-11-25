import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "./ProductContext";
import type { CartItem } from "../types";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (productId: string, quantity?: number) => boolean;
  addCustomKit: (items: CartItem[]) => boolean;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem("iot-tech-cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const {products,loading}=useProducts();
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [notice,setNotice]=useState<{id:number;text:string}|null>(null);
  useEffect(()=>{if(!notice)return;const timer=window.setTimeout(()=>setNotice(null),5000);return()=>window.clearTimeout(timer);},[notice]);
  useEffect(()=>{const sync=(event:StorageEvent)=>{if(event.key==='iot-tech-cart')setItems(loadCart());};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[]);

  useEffect(() => {
    try{localStorage.setItem("iot-tech-cart", JSON.stringify(items));}catch{/* Keep the in-memory cart usable if storage is unavailable. */}
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    addItem: (productId, quantity = 1) => {
      const product=products.find(product=>product.id===productId);
      const currentQuantity=items.filter(item=>item.productId===productId).reduce((sum,item)=>sum+item.quantity,0);
      if(loading||!product||!Number.isFinite(product.stock)||product.stock<=0||product.priceOnRequest){setNotice({id:Date.now(),text:'This product is currently unavailable and cannot be added to the cart.'});return false;}
      if(!Number.isInteger(quantity)||quantity<1||currentQuantity+quantity>product.stock){setNotice({id:Date.now(),text:'Only '+product.stock+' available. Please check the quantity already in your cart.'});return false;}
      setItems(current=>{
        const existing=current.find(item=>item.productId===productId&&!item.customKitId);
        return existing?current.map(item=>item===existing?{...item,quantity:item.quantity+quantity}:item):[...current,{productId,quantity}];
      });
      setNotice({id:Date.now(),text:quantity===1?'Added to your cart.':quantity+' items added to your cart.'});return true;
    },
    addCustomKit: kitItems => {
      const quantities=new Map<string,number>();
      for(const item of [...items,...kitItems])quantities.set(item.productId,(quantities.get(item.productId)||0)+item.quantity);
      for(const item of kitItems){const product=products.find(product=>product.id===item.productId);
        if(loading||!product||!Number.isFinite(product.stock)||product.stock<=0||product.priceOnRequest||!Number.isInteger(item.quantity)||item.quantity<1||(quantities.get(item.productId)||0)>product.stock){setNotice({id:Date.now(),text:'The kit contains unavailable products or quantities exceeding stock. Please update your selection.'});return false;}}
      setItems(current=>[...current,...kitItems]);setNotice({id:Date.now(),text:'Your CCTV kit was added to the cart.'});return true;
    },
    updateQuantity: (productId, quantity) => setItems((current) => quantity < 1
      ? current.filter((item) => item.productId !== productId)
      : current.map((item) => item.productId === productId ? { ...item, quantity } : item)),
    removeItem: (productId) => setItems((current) => current.filter((item) => item.productId !== productId)),
    clearCart: () => {try{localStorage.setItem('iot-tech-cart','[]');}catch{/* State is still cleared below. */}setItems([]);setNotice(null);},
  }), [items,products,loading]);

  return <CartContext.Provider value={value}>{children}{notice&&<div className="cart-add-notice" role="status"><span>{notice.text}</span><Link to="/cart">View cart</Link><button type="button" aria-label="Dismiss cart notification" onClick={()=>setNotice(null)}>×</button></div>}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
