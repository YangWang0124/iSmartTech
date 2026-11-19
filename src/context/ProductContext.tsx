import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import type { Product } from "../types";

type ProductState = {
  products: Product[];
  categories: string[];
  brands: string[];
  loading: boolean;
  refresh: () => Promise<void>;
};
const ProductContext = createContext<ProductState | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestNumber = useRef(0);
  const refresh = useCallback(async () => {
    const request = ++requestNumber.current;
    try {
      const response = await fetch("/api/retail/products", { headers: { Accept: "application/json" }, cache: "no-store" });
      if (!response.ok) throw new Error("Catalogue unavailable");
      const catalogue: unknown = await response.json();
      if (!Array.isArray(catalogue)) throw new Error("Invalid catalogue response");
      if (request === requestNumber.current) {
        setProducts(catalogue as Product[]);
        setError("");
      }
    } catch {
      if (request === requestNumber.current) {
        setProducts([]);
        setError("The product catalogue is temporarily unavailable. Please try again.");
      }
    } finally {
      if (request === requestNumber.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (authLoading) return;
    setProducts([]);
    setLoading(true);
    void refresh();
    const update = () => { if (document.visibilityState === "visible") void refresh(); };
    const interval = window.setInterval(update, 30000);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [refresh, authLoading, user?.id, user?.price_tier]);
  const value = useMemo(() => ({
    products,
    categories: [...new Set(products.map(product => product.category))].sort(),
    brands: [...new Set(products.map(product => product.brand))].sort(),
    loading, refresh
  }), [products, loading, refresh]);
  return <ProductContext.Provider value={value}>
    {error && <div role="alert" className="catalogue-error">{error} <button type="button" onClick={() => void refresh()}>Retry</button></div>}
    {children}
  </ProductContext.Provider>;
}

export function useProducts() {
  const value = useContext(ProductContext);
  if (!value) throw new Error("useProducts must be used inside ProductProvider");
  return value;
}
