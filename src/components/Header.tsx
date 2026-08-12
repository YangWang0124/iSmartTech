import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { SearchBar } from "./SearchBar";
import { CategoryNav } from "./CategoryNav";
import { useLanguage } from "../context/LanguageContext";

const mobileMenuLinks = [
  ["Installs", "/installation-services"],
  ["Alarm Systems", "/products?category=Alarm%20Systems"],
  ["CCTV Cameras", "/products?category=CCTV%20Cameras"],
  ["Intercoms", "/products?category=Intercoms"],
  ["Networking", "/products?category=Networking"],
  ["Recorders", "/products?category=Recorders"],
  ["Security Kits", "/products?category=Security%20Kits"],
  ["Get a quote", "/contact"],
];

export function Header() {
  const { itemCount } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="top-strip"><div className="container">{t("owned")} <span>{t("advice")}</span></div></div>
      <div className="main-header container">
        <Link className="brand" to="/" aria-label="iSmartTech home">
          <img className="brand__logo" src="/assets/ismarttech-logo.gif?v=4" alt="iSmartTech — Smart Home Shop" />
        </Link>
        <div className="desktop-search"><SearchBar compact /></div>
        <nav className={`main-nav ${menuOpen ? "main-nav--open" : ""}`} aria-label="Main navigation">
          <NavLink className="desktop-nav-link" to="/products" onClick={() => setMenuOpen(false)}>{t("products")}</NavLink>
          <NavLink className="desktop-nav-link" to="/about" onClick={() => setMenuOpen(false)}>{t("about")}</NavLink>
          <NavLink className="desktop-nav-link" to="/contact" onClick={() => setMenuOpen(false)}>{t("contact")}</NavLink>
          {mobileMenuLinks.map(([label, to]) => <Link className="mobile-menu-link" key={label} to={to} onClick={() => setMenuOpen(false)}>{label}<span>›</span></Link>)}
        </nav>
        <div className="language-toggle" role="group" aria-label="Language"><button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button><button className={language === "zh" ? "active" : ""} onClick={() => setLanguage("zh")}>中文</button></div>
        <Link className="staff-link" to="/staff/products" aria-label="Staff sign in">♙ <span>Staff sign in</span></Link>
        <Link className="cart-link" to="/cart" aria-label={`Cart with ${itemCount} items`}>
          <span aria-hidden="true">▰</span><span>{t("cart")}</span>{itemCount > 0 && <b>{itemCount}</b>}
        </Link>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>☰</button>
      </div>
      <div className="mobile-search container"><SearchBar compact /></div>
      <CategoryNav />
    </header>
  );
}
