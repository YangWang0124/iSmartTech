import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div><div className="brand brand--light"><img className="brand__logo brand__logo--footer" src="/assets/ismarttech-logo.gif?v=4" alt="iSmartTech — Smart Home Shop" /></div><p>{t("footerIntro")}</p></div>
        <div><h3>{t("shop")}</h3><Link to="/products">{t("allProducts")}</Link><Link to="/products?category=CCTV%20Cameras">{t("cameras")}</Link><Link to="/products?category=Alarm%20Systems">{t("alarms")}</Link><Link to="/products?category=Networking">{t("networking")}</Link></div>
        <div><h3>{t("help")}</h3><Link to="/about">{t("aboutUs")}</Link><Link to="/contact">{t("contact")}</Link><Link to="/contact">{t("requestQuote")}</Link><span>{t("shipping")}</span></div>
        <div><h3>{t("specialist")}</h3><a href="tel:092154111">09 215 4111</a><a href="mailto:sales@iottech.co.nz">sales@iottech.co.nz</a><span>{t("hours")}</span></div>
      </div>
      <div className="container footer__bottom"><span>© 2026 iSmartTech. {t("prototype")}</span><span>{t("prices")}</span></div>
    </footer>
  );
}
