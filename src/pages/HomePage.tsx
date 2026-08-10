import { Link } from "react-router-dom";
import { ProductGrid } from "../components/ProductGrid";
import { SearchBar } from "../components/SearchBar";
import { categories, products } from "../lib/products";

const categoryMeta: Record<string, { icon: string; copy: string }> = {
  "CCTV Cameras": { icon: "◉", copy: "See every detail, day or night" },
  "Security Kits": { icon: "▦", copy: "Complete, ready-to-go systems" },
  "Alarm Systems": { icon: "⌁", copy: "Smart protection and instant alerts" },
  "Intercoms": { icon: "▤", copy: "Know who's at the door" },
  "Networking": { icon: "⌁", copy: "Reliable connections everywhere" },
  "Recorders": { icon: "▰", copy: "Secure, always-on recording" },
  "Storage": { icon: "◫", copy: "Purpose-built surveillance drives" },
};

export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__content">
            <span className="hero__eyebrow">SMARTER SECURITY STARTS HERE</span>
            <h1>Protect what matters.<br /><em>Stay connected.</em></h1>
            <p>Professional-grade security, networking and smart technology—made straightforward for Kiwi homes and businesses.</p>
            <div className="hero__actions"><Link className="button button--primary" to="/products">Shop all products <span>→</span></Link><Link className="button button--ghost" to="/contact">Talk to a specialist</Link></div>
            <div className="hero__trust"><span>✓ NZ owned &amp; operated</span><span>✓ Local technical support</span><span>✓ Trusted brands</span></div>
          </div>
          <div className="hero__art" aria-label="Connected security system illustration">
            <div className="hero__rings" />
            <div className="hero-camera"><span>4K</span><i /></div>
            <div className="signal signal--one">● <span>Always connected</span></div>
            <div className="signal signal--two">✓ <span>Smart detection</span></div>
            <div className="signal signal--three">24/7 <span>Peace of mind</span></div>
          </div>
        </div>
        <div className="container hero__search"><SearchBar /></div>
      </section>

      <section className="benefits"><div className="container benefits__grid"><div><b>✓</b><span><strong>Expert advice</strong><small>Real people, practical answers</small></span></div><div><b>⚡</b><span><strong>Fast NZ shipping</strong><small>Tracked delivery nationwide</small></span></div><div><b>↺</b><span><strong>Easy returns</strong><small>Simple, friendly support</small></span></div><div><b>♢</b><span><strong>Secure shopping</strong><small>Shop with confidence</small></span></div></div></section>

      <section className="section container">
        <div className="section-heading"><div><span className="eyebrow">FIND YOUR SOLUTION</span><h2>Shop by category</h2></div><Link to="/products">View all products →</Link></div>
        <div className="category-grid">{categories.map((category) => <Link key={category} to={`/products?category=${encodeURIComponent(category)}`} className="category-card"><span>{categoryMeta[category]?.icon}</span><div><h3>{category}</h3><p>{categoryMeta[category]?.copy}</p></div><b>→</b></Link>)}</div>
      </section>

      <section className="section section--tint"><div className="container"><div className="section-heading"><div><span className="eyebrow">CUSTOMER FAVOURITES</span><h2>Featured products</h2></div><Link to="/products">Browse the full range →</Link></div><ProductGrid products={products.slice(0, 8)} /></div></section>

      <section className="container advice-banner"><div><span className="eyebrow">NOT SURE WHERE TO START?</span><h2>Let's design the right setup together.</h2><p>Tell our friendly team what you need to protect. We'll recommend a practical solution without the jargon.</p></div><Link className="button button--light" to="/contact">Get free advice <span>→</span></Link></section>

      <section className="section container"><div className="brand-row"><span>TRUSTED TECHNOLOGY FROM</span>{["Dahua", "HIKVISION", "Ubiquiti", "AJAX", "TP-Link", "UNIVIEW"].map((brand) => <strong key={brand}>{brand}</strong>)}</div></section>
    </>
  );
}
