import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem } from "../types";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (productId: string, quantity?: number) => void;
  addCustomKit: (items: CartItem[]) => void;
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
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    localStorage.setItem("iot-tech-cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    addItem: (productId, quantity = 1) => setItems((current) => {
      const existing = current.find((item) => item.productId === productId && !item.customKitId);
      return existing
        ? current.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item)
        : [...current, { productId, quantity }];
    }),
    addCustomKit: (kitItems) => setItems((current) => [...current, ...kitItems]),
    updateQuantity: (productId, quantity) => setItems((current) => quantity < 1
      ? current.filter((item) => item.productId !== productId)
      : current.map((item) => item.productId === productId ? { ...item, quantity } : item)),
    removeItem: (productId) => setItems((current) => current.filter((item) => item.productId !== productId)),
    clearCart: () => setItems([]),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
