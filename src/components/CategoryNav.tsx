import { Link } from "react-router-dom";
import { categories } from "../lib/products";

export function CategoryNav() {
  return (
    <nav className="category-nav" aria-label="Product categories">
      <div className="container category-nav__inner">
        <Link className="category-nav__all" to="/products">☰ &nbsp;Shop all</Link>
        {categories.slice(0, 6).map((category) => (
          <Link key={category} to={`/products?category=${encodeURIComponent(category)}`}>{category}</Link>
        ))}
        <Link to="/contact">Get a quote</Link>
      </div>
    </nav>
  );
}
