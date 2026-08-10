import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/ProductContext";

const categoryZh: Record<string, string> = { "CCTV Cameras":"监控摄像头", "Security Kits":"安防套装", "Alarm Systems":"报警系统", "Intercoms":"可视对讲", "Networking":"网络设备", "Recorders":"录像机", "Storage":"存储设备" };

export function CategoryNav() {
  const { categories } = useProducts();
  const { language, t } = useLanguage();
  return (
    <nav className="category-nav" aria-label="Product categories">
      <div className="container category-nav__inner">
        <Link className="category-nav__all" to="/products">☰ &nbsp;{t("shopAll")}</Link>
        {categories.slice(0, 6).map((category) => (
          <Link key={category} to={`/products?category=${encodeURIComponent(category)}`}>{language === "zh" ? categoryZh[category] : category}</Link>
        ))}
        <Link to="/contact">{t("quote")}</Link>
      </div>
    </nav>
  );
}
