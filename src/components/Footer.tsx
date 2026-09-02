import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div><div className="brand brand--light"><img className="brand__logo brand__logo--footer" src="/assets/ismarttech-logo.gif?v=4" alt="iSmartTech — Smart Home Shop" loading="lazy" decoding="async" /></div><p>{t("footerIntro")}</p></div>
        <div><h3>{t("shop")}</h3><Link to="/products">{t("allProducts")}</Link><Link to="/category/cctv_camera">{t("cameras")}</Link><Link to="/category/category_alarm">{t("alarms")}</Link><Link to="/category/category_network">{t("networking")}</Link></div>
        <div><h3>{t("help")}</h3><Link to="/about">{t("aboutUs")}</Link><Link to="/contact">{t("contact")}</Link><Link to="/contact">{t("requestQuote")}</Link><span>{t("shipping")}</span></div>
        <div><h3>{t("specialist")}</h3><a href="tel:092183110">(09) 218 3110</a><a href="mailto:info@smarttechhouse.co.nz">info@smarttechhouse.co.nz</a><span>Mon–Fri, 9am–6pm</span><span>NZBN 9429041461730</span></div>
      </div>
      <div className="container footer__bottom"><span>© 2026 iSmartTech. {t("prototype")}</span><span>{t("prices")}</span></div>
    </footer>
  );
}
