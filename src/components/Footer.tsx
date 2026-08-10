import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div><div className="brand brand--light"><span className="brand__mark">IoT</span><span><strong>Tech Store</strong><small>SMARTER SECURITY SOLUTIONS</small></span></div><p>Practical security, networking and IoT solutions backed by friendly New Zealand expertise.</p></div>
        <div><h3>Shop</h3><Link to="/products">All products</Link><Link to="/products?category=CCTV%20Cameras">CCTV cameras</Link><Link to="/products?category=Alarm%20Systems">Alarm systems</Link><Link to="/products?category=Networking">Networking</Link></div>
        <div><h3>Help</h3><Link to="/about">About us</Link><Link to="/contact">Contact</Link><Link to="/contact">Request a quote</Link><span>Shipping &amp; returns</span></div>
        <div><h3>Talk to a specialist</h3><a href="tel:092154111">09 215 4111</a><a href="mailto:sales@iottech.co.nz">sales@iottech.co.nz</a><span>Mon–Fri, 8:30am–5:00pm</span></div>
      </div>
      <div className="container footer__bottom"><span>© 2026 IoT Technologies. Prototype storefront.</span><span>Prices shown in NZD and include GST.</span></div>
    </footer>
  );
}
