import type { Product } from "../types";
import { ProductCard } from "./ProductCard";
import { useLanguage } from "../context/LanguageContext";

export function ProductGrid({ products }: { products: Product[] }) {
  const { language } = useLanguage();
  if (!products.length) return <div className="empty-state"><h2>{language === "zh" ? "未找到商品" : "No products found"}</h2><p>{language === "zh" ? "请尝试更改搜索或筛选条件。" : "Try changing your search or filters."}</p></div>;
  return <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
