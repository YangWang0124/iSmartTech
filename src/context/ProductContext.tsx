import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import seedProducts from "../data/products.json";
import { createCuratedProducts } from "../data/curatedProducts";
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
  const [managed, setManaged] = useState<Product[]>([]);
  const [sourceProducts, setSourceProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = async () => {
    try {
      const [managedResult, sourceResult] = await Promise.allSettled([
        fetch("/api/products", { headers: { Accept: "application/json" } }),
        fetch("/api/catalogue-source", {
          headers: { Accept: "application/json" },
        }),
      ]);
      if (managedResult.status === "fulfilled" && managedResult.value.ok)
        setManaged(await managedResult.value.json());
      if (sourceResult.status === "fulfilled" && sourceResult.value.ok)
        setSourceProducts(await sourceResult.value.json());
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void refresh();
  }, []);
  const products = useMemo(() => {
    const bundled = seedProducts as unknown as Product[];
    const coreProducts = !managed.length
      ? bundled
      : (() => {
          const bundledById = new Map(
            bundled.map((product) => [product.id, product])
          );
          const mergedManaged = managed.map(
            (product) =>
              ({
                ...bundledById.get(product.id),
                ...product,
              } as Product)
          );
          const managedIds = new Set(managed.map((product) => product.id));
          return [
            ...mergedManaged,
            ...bundled.filter((product) => !managedIds.has(product.id)),
          ];
        })();
    const existingSkus = new Set(
      coreProducts.map((product) => product.sku.trim().toLowerCase())
    );
    const sourceCatalogue = sourceProducts.filter(
      (product) => !existingSkus.has(product.sku.trim().toLowerCase())
    );
    // Curated products must only inherit price, stock and imagery from an exact
    // live catalogue match. Do not let bundled or staff-managed prototype
    // records provide commercial values for these selected products.
    return [
      ...coreProducts,
      ...sourceCatalogue,
      ...createCuratedProducts(sourceProducts),
    ];
  }, [managed, sourceProducts]);
  const value = useMemo(
    () => ({
      products,
      categories: [...new Set(products.map((p) => p.category))].sort(),
      brands: [
        ...new Set(
          products.map((p) => {
            const brand = p.brand.trim().toLowerCase();

            if (brand === "tiandy") return "Tiandy";
            if (brand === "hikvision") return "Hikvision";

            return p.brand.trim();
          })
        ),
      ].sort(),
      loading,
      refresh,
    }),
    [products, loading]
  );
  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProducts() {
  const value = useContext(ProductContext);
  if (!value)
    throw new Error("useProducts must be used inside ProductProvider");
  return value;
}
