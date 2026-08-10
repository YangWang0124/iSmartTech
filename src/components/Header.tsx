import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { SearchBar } from "./SearchBar";
import { CategoryNav } from "./CategoryNav";

export function Header() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="top-strip"><div className="container">New Zealand owned &amp; operated <span>Free advice from local security specialists</span></div></div>
      <div className="main-header container">
        <Link className="brand" to="/" aria-label="IoT Tech Store home">
          <span className="brand__mark">IoT</span><span><strong>Tech Store</strong><small>SECURITY • NETWORKING • SMART TECH</small></span>
        </Link>
        <div className="desktop-search"><SearchBar compact /></div>
        <nav className={`main-nav ${menuOpen ? "main-nav--open" : ""}`} aria-label="Main navigation">
          <NavLink to="/products" onClick={() => setMenuOpen(false)}>Products</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
        </nav>
        <Link className="cart-link" to="/cart" aria-label={`Cart with ${itemCount} items`}>
          <span aria-hidden="true">▰</span><span>Cart</span>{itemCount > 0 && <b>{itemCount}</b>}
        </Link>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>☰</button>
      </div>
      <div className="mobile-search container"><SearchBar compact /></div>
      <CategoryNav />
    </header>
  );
}
