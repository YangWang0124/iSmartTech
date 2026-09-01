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
import { alarmProducts } from "../data/alarmProducts";
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
    const normaliseSku = (sku: string) => sku.trim().toLowerCase();
    const sourceBySku = new Map(
      sourceProducts.map((product) => [normaliseSku(product.sku), product])
    );
    const coreWithLiveCommercialData = coreProducts.map((product) => {
      if (!product.requiresLiveCatalogue) return product;

      const liveProduct = sourceBySku.get(normaliseSku(product.sku));
      return liveProduct
        ? {
            ...product,
            price: liveProduct.price,
            oldPrice: liveProduct.oldPrice,
            stock: liveProduct.stock,
            priceOnRequest: false,
            sourceProductId: liveProduct.id,
          }
        : {
            ...product,
            price: 0,
            oldPrice: undefined,
            stock: 0,
            priceOnRequest: true,
            sourceProductId: undefined,
          };
    });
    const existingSkus = new Set(
      coreWithLiveCommercialData.map((product) => normaliseSku(product.sku))
    );
    const sourceCatalogue = sourceProducts.filter(
      (product) => !existingSkus.has(normaliseSku(product.sku))
    );
    // Curated products must only inherit price, stock and imagery from an exact
    // live catalogue match. Do not let bundled or staff-managed prototype
    // records provide commercial values for these selected products.
const alarmIds = new Set(alarmProducts.map((product) => product.id));
return [
  ...coreWithLiveCommercialData.filter((product) => !alarmIds.has(product.id)),
  ...sourceCatalogue.filter((product) => !alarmIds.has(product.id)),
  ...createCuratedProducts(sourceProducts),
  ...alarmProducts,
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
