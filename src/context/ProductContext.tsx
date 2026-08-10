import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import seedProducts from "../data/products.json";
import type { Product } from "../types";

type ProductState = { products: Product[]; categories: string[]; brands: string[]; loading: boolean; refresh: () => Promise<void> };
const ProductContext = createContext<ProductState | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [managed, setManaged] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = async () => {
    try {
      const response = await fetch("/api/products", { headers: { Accept: "application/json" } });
      if (response.ok) setManaged(await response.json());
    } finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, []);
  const products = useMemo(() => managed.length ? managed : seedProducts as unknown as Product[], [managed]);
  const value = useMemo(() => ({ products, categories: [...new Set(products.map(p => p.category))].sort(), brands: [...new Set(products.map(p => p.brand))].sort(), loading, refresh }), [products, loading]);
  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const value = useContext(ProductContext);
  if (!value) throw new Error("useProducts must be used inside ProductProvider");
  return value;
}
