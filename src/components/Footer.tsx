import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div><div className="brand brand--light"><span className="brand__mark">IoT</span><span><strong>Tech Store</strong><small>SMARTER SECURITY SOLUTIONS</small></span></div><p>{t("footerIntro")}</p></div>
        <div><h3>{t("shop")}</h3><Link to="/products">{t("allProducts")}</Link><Link to="/products?category=CCTV%20Cameras">{t("cameras")}</Link><Link to="/products?category=Alarm%20Systems">{t("alarms")}</Link><Link to="/products?category=Networking">{t("networking")}</Link></div>
        <div><h3>{t("help")}</h3><Link to="/about">{t("aboutUs")}</Link><Link to="/contact">{t("contact")}</Link><Link to="/contact">{t("requestQuote")}</Link><span>{t("shipping")}</span></div>
        <div><h3>{t("specialist")}</h3><a href="tel:092154111">09 215 4111</a><a href="mailto:sales@iottech.co.nz">sales@iottech.co.nz</a><span>{t("hours")}</span></div>
      </div>
      <div className="container footer__bottom"><span>© 2026 IoT Technologies. {t("prototype")}</span><span>{t("prices")}</span></div>
    </footer>
  );
}
