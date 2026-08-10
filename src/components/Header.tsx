import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { SearchBar } from "./SearchBar";
import { CategoryNav } from "./CategoryNav";
import { useLanguage } from "../context/LanguageContext";

export function Header() {
  const { itemCount } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="top-strip"><div className="container">{t("owned")} <span>{t("advice")}</span></div></div>
      <div className="main-header container">
        <Link className="brand" to="/" aria-label="IoT Tech Store home">
          <span className="brand__mark">IoT</span><span><strong>Tech Store</strong><small>SECURITY • NETWORKING • SMART TECH</small></span>
        </Link>
        <div className="desktop-search"><SearchBar compact /></div>
        <nav className={`main-nav ${menuOpen ? "main-nav--open" : ""}`} aria-label="Main navigation">
          <NavLink to="/products" onClick={() => setMenuOpen(false)}>{t("products")}</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>{t("about")}</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>{t("contact")}</NavLink>
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
