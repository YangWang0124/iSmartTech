import { Link } from "react-router-dom";
import type { MouseEvent } from "react";
import { catalogueCategories } from "../lib/catalogue";

const closeMenu = (event: MouseEvent<HTMLAnchorElement>) => event.currentTarget.blur();

export function CategoryNav() {
  return <nav className="category-nav catalogue-mega-nav" aria-label="Product categories"><div className="container category-nav__inner">
    <Link className="category-nav__all" to="/installation-services" onClick={closeMenu}>Installs</Link>
    {catalogueCategories.map((root, index) => <div className={`mega-menu mega-menu--${index < 3 ? "left" : index > 4 ? "right" : "centre"}`} key={root.id}><Link to={`/category/${root.links}`} onClick={closeMenu}>{root.title}<span>⌄</span></Link>{root.sub_cat.length > 0 && <div className="mega-menu__panel"><div><strong>{root.title}</strong><Link to={`/category/${root.links}`} onClick={closeMenu}>View all {root.title}</Link></div>{root.sub_cat.map(child => <section key={child.id}><Link className="mega-menu__heading" to={`/category/${child.links}`} onClick={closeMenu}>{child.title}</Link>{child.sub_cat.map(grandchild => <Link key={grandchild.id} to={`/category/${grandchild.links}`} onClick={closeMenu}>{grandchild.title}</Link>)}</section>)}</div>}</div>)}
    <Link to="/contact" onClick={closeMenu}>Get a quote</Link>
  </div></nav>;
}
