import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { SearchBar } from "./SearchBar";
import { CategoryNav } from "./CategoryNav";
import { useLanguage } from "../context/LanguageContext";
import { catalogueCategories } from "../lib/catalogue";
import { useAuth } from "../context/AuthContext";
import { catalogueBrandGroups } from "../lib/brands";
import { BrandMenuLink } from "./BrandMenuLink";

export function Header() {
  const { itemCount } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const lastScrollYRef = useRef(0);
  const scrollFrameRef = useRef<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    lastScrollYRef.current = Math.max(window.scrollY, 0);
    setHeaderScrolled(lastScrollYRef.current > 8);

    const updateHeader = () => {
      const currentScrollY = Math.max(window.scrollY, 0);
      const movement = currentScrollY - lastScrollYRef.current;

      setHeaderScrolled(currentScrollY > 8);

      if (currentScrollY < 80 || menuOpen) {
        setHeaderHidden(false);
      } else if (Math.abs(movement) >= 6) {
        setHeaderHidden(movement > 0);
      }

      lastScrollYRef.current = currentScrollY;
      scrollFrameRef.current = null;
    };

    const handleScroll = () => {
      if (scrollFrameRef.current === null) {
        scrollFrameRef.current = window.requestAnimationFrame(updateHeader);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, [menuOpen]);

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
    <>
      <div className="top-strip">
        <div className="container">
          {t("owned")} <span>{t("advice")}</span>
        </div>
      </div>
      <header
        className={`site-header ${headerHidden ? "site-header--hidden" : ""} ${
          headerScrolled ? "site-header--scrolled" : ""
        }`}
      >
        <div className="main-header container">
        <Link className="brand" to="/" aria-label="iSmartTech home">
          <img
            className="brand__logo"
            src="/assets/ismarttech-logo-slate.png?v=3"
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
                <div className="brand-menu__items">
                  {group.brands.map((brand) => (
                    <BrandMenuLink
                      key={brand.label}
                      brand={brand}
                      category={group.category}
                      onClick={() => setMenuOpen(false)}
                    />
                  ))}
                </div>
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
          <span className="header-action__label">{user ? "My account" : "Sign in"}</span>
        </Link>
        <Link
          className="cart-link"
          to="/cart"
          aria-label={`Cart with ${itemCount} items`}
        >
          <span className="cart-link__icon" aria-hidden="true" />
          <span className="header-action__label">{t("cart")}</span>
          {itemCount > 0 && <b>{itemCount}</b>}
        </Link>
        <button
          ref={menuButtonRef}
          className="menu-button"
          onClick={() => {
            setHeaderHidden(false);
            setMenuOpen(!menuOpen);
          }}
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
    </>
  );
}
