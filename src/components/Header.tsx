import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { SearchBar } from "./SearchBar";
import { CategoryNav } from "./CategoryNav";
import { useLanguage } from "../context/LanguageContext";
import { catalogueCategories } from "../lib/catalogue";
import { useAuth } from "../context/AuthContext";
import { catalogueBrandGroups } from "../lib/brands";

export function Header() {
  const { itemCount } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!menuOpen) return;
    const closeOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !menuRef.current?.contains(target) &&
        !menuButtonRef.current?.contains(target)
      )
        setMenuOpen(false);
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, [menuOpen]);

  return (
    <header>
      <div className="top-strip">
        <div className="container">
          {t("owned")} <span>{t("advice")}</span>
        </div>
      </div>
      <div className="main-header container">
        <Link className="brand" to="/" aria-label="iSmartTech home">
          <img
            className="brand__logo"
            src="/assets/ismarttech-logo.gif?v=4"
            alt="iSmartTech — Smart Home Shop"
          />
        </Link>
        <div className="desktop-search">
          <SearchBar compact />
        </div>
        <nav
          ref={menuRef}
          className={`main-nav ${menuOpen ? "main-nav--open" : ""}`}
          aria-label="Main navigation"
        >
          <NavLink
            className="desktop-nav-link"
            to="/products"
            onClick={() => setMenuOpen(false)}
          >
            {t("products")}
          </NavLink>
          <NavLink
            className="desktop-nav-link"
            to="/about"
            onClick={() => setMenuOpen(false)}
          >
            {t("about")}
          </NavLink>
          <NavLink
            className="desktop-nav-link"
            to="/contact"
            onClick={() => setMenuOpen(false)}
          >
            {t("contact")}
          </NavLink>
          <Link
            className="mobile-menu-link"
            to="/installation-services"
            onClick={() => setMenuOpen(false)}
          >
            Installs<span>›</span>
          </Link>
          <details className="mobile-catalogue mobile-brand-menu">
            <summary>
              Brands<span>＋</span>
            </summary>
            {catalogueBrandGroups.map((group) => (
              <details key={group.title}>
                <summary>
                  {group.title}
                  <span>＋</span>
                </summary>
                {group.brands.map((brand) => (
                  <Link
                    key={brand.label}
                    to={`/category/${group.category}?brand=${encodeURIComponent(
                      brand.value
                    )}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {brand.label}
                  </Link>
                ))}
              </details>
            ))}
          </details>
          {catalogueCategories.map((root) => (
            <details className="mobile-catalogue" key={root.id}>
              <summary>
                {root.title}
                <span>＋</span>
              </summary>
              <Link
                to={`/category/${root.links}`}
                onClick={() => setMenuOpen(false)}
              >
                View all {root.title}
              </Link>
              {root.sub_cat.map((child) => (
                <details key={child.id}>
                  <summary>
                    {child.title}
                    <span>＋</span>
                  </summary>
                  <Link
                    to={`/category/${child.links}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    View all {child.title}
                  </Link>
                  {child.sub_cat.map((grandchild) => (
                    <Link
                      key={grandchild.id}
                      to={`/category/${grandchild.links}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {grandchild.title}
                    </Link>
                  ))}
                </details>
              ))}
            </details>
          ))}
          <Link
            className="mobile-menu-link"
            to="/contact"
            onClick={() => setMenuOpen(false)}
          >
            Get a quote<span>›</span>
          </Link>
        </nav>
        <div className="language-toggle" role="group" aria-label="Language">
          <button
            className={language === "en" ? "active" : ""}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
          <button
            className={language === "zh" ? "active" : ""}
            onClick={() => setLanguage("zh")}
          >
            中文
          </button>
        </div>
        <Link
          className="customer-link"
          to={user ? "/account" : "/signin"}
          aria-label={user ? "Customer account" : "Customer sign in"}
        >
          <svg className="customer-link__icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="7" r="4.4" />
            <path d="M3.4 21v-1.2a8.6 8.6 0 0 1 8.6-8.6h0a8.6 8.6 0 0 1 8.6 8.6V21" />
          </svg>
          <span>{user ? "My account" : "Sign in"}</span>
        </Link>
        <Link
          className="cart-link"
          to="/cart"
          aria-label={`Cart with ${itemCount} items`}
        >
          <span className="cart-link__icon" aria-hidden="true" />
          <span>{t("cart")}</span>
          {itemCount > 0 && <b>{itemCount}</b>}
        </Link>
        <button
          ref={menuButtonRef}
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          ☰
        </button>
      </div>
      <div className="mobile-search container">
        <SearchBar compact />
      </div>
      <CategoryNav />
    </header>
  );
}
