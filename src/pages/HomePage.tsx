import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductGrid } from "../components/ProductGrid";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/ProductContext";
import { isCuratedProduct } from "../data/curatedProducts";

const homepageCategories = [
  { name: "CCTV", slug: "category_cctv", image: "/assets/category-products/cctv.png", product: "Dahua DH-IPC-HDW3667EM-S-IL-ANZ camera", copy: "See every detail, day or night", zhName: "监控系统", zhCopy: "昼夜看清每个细节" },
  { name: "Intercom", slug: "category_intercom", image: "/assets/category-products/intercom.jpg", product: "Hikvision DS-KIS603-P video intercom kit", copy: "Know who's at the door", zhName: "可视对讲", zhCopy: "随时了解门外访客" },
  { name: "Smart Home", slug: "category_smart-home", image: "/assets/category-products/smart-home.jpg", product: "Akuvox SL50 smart video door lock", copy: "Smarter comfort and control", zhName: "智能家居", zhCopy: "轻松掌控舒适生活" },
  { name: "Alarm", slug: "category_alarm", image: "/assets/category-products/alarm.jpg", product: "Hikvision DS-PWA96-Kit-WB AX PRO alarm kit", copy: "Smart protection and instant alerts", zhName: "报警系统", zhCopy: "智能防护及即时警报" },
  { name: "Audio", slug: "category_audio", image: "/assets/category-products/audio.jpg", product: "AXIS C1210-E network ceiling speaker", copy: "Sound for every room and space", zhName: "影音设备", zhCopy: "为每个空间带来好声音" },
  { name: "Network", slug: "category_network", image: "/assets/category-products/network.png", product: "Hikvision DS-3E1105P-EI PoE switch", copy: "Reliable connections everywhere", zhName: "网络设备", zhCopy: "随处保持可靠连接" },
];

function HomeCarousel() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setSlide(current => (current + 1) % 3), 6000);
    return () => window.clearInterval(timer);
  }, []);
  const move = (direction: number) => setSlide(current => (current + direction + 3) % 3);
  return <section className="home-carousel" aria-roledescription="carousel" aria-label="Store promotions">
    <div className="home-carousel__track" style={{ transform: `translateX(-${slide * 100}%)` }}>
      <article className="home-slide home-slide--installation" aria-hidden={slide !== 0}>
        <div className="container home-slide__content"><span>AUCKLAND INSTALLATION SERVICES</span><h1>Professional Installation<br />Available Auckland-Wide</h1><p>Get your products professionally installed by our experienced team anywhere across Auckland.</p><Link className="button button--primary" to="/installation-services">Click here to learn more about our installation services <b>→</b></Link></div>
        <div className="home-slide__motif" aria-hidden="true"><i /><i /><i /><strong>✓</strong></div>
      </article>
      <Link className="home-slide home-slide--camera-banner home-slide--alarm-banner" to="/products/hikvision-ax-pro-security-kit" aria-label="View the Hikvision AX PRO Alarm Security Kit" aria-hidden={slide !== 1}><img src="/assets/hikvision-ax-pro-banner-outpainted.png" alt="Hikvision AX PRO alarm kit in a wide natural home entrance with DS-PWA96-Kit-WB model number" /></Link>
      <Link className="home-slide home-slide--camera-banner home-slide--dahua-banner" to="/products/dahua-4k-turret" aria-label="View the Dahua 6MP Dual Light Turret Network Camera" aria-hidden={slide !== 2}><img src="/assets/dahua-camera-banner-complete.png" alt="Dahua DH-IPC-HDW3667EM-S-IL-ANZ turret camera installed beneath a modern residential roof eave" /></Link>
    </div>
    <button className="carousel-arrow carousel-arrow--previous" onClick={() => move(-1)} aria-label="Previous banner"><span aria-hidden="true">‹</span></button><button className="carousel-arrow carousel-arrow--next" onClick={() => move(1)} aria-label="Next banner"><span aria-hidden="true">›</span></button>
    <div className="carousel-dots">{[0,1,2].map(index => <button key={index} className={slide === index ? "active" : ""} onClick={() => setSlide(index)} aria-label={`Show banner ${index + 1}`} aria-current={slide === index ? "true" : undefined} />)}</div>
  </section>;
}

export function HomePage() {
  const { products } = useProducts();
  const { language } = useLanguage();
  const zh = language === "zh";
  return (
    <>
      <HomeCarousel />

      <section className="benefits"><div className="container benefits__grid"><div><span><strong>{zh ? "本地专业团队" : "Local specialist team"}</strong><small>{zh ? "服务住宅和商业项目" : "Residential and commercial projects"}</small></span></div><div><span><strong>{zh ? "一站式服务" : "End-to-end service"}</strong><small>{zh ? "从设计、供货到安装" : "From design and supply to installation"}</small></span></div><div><span><strong>{zh ? "可靠施工" : "Reliable workmanship"}</strong><small>{zh ? "重视质量与细节" : "A focus on quality and detail"}</small></span></div><div><span><strong>{zh ? "清晰沟通" : "Clear communication"}</strong><small>{zh ? "清楚了解每一步" : "Know what to expect at every step"}</small></span></div></div></section>

      <section className="section container home-product-section home-category-section">
        <div className="section-heading"><div><span className="eyebrow">{zh ? "找到适合您的方案" : "FIND YOUR SOLUTION"}</span><h2>{zh ? "按类别选购" : "Shop by category"}</h2></div><Link to="/products">{zh ? "查看全部商品" : "View all products"} →</Link></div>
        <div className="category-grid">{homepageCategories.map(category => <Link key={category.slug} to={`/category/${category.slug}`} className="category-card"><span className="category-card__product"><img src={category.image} alt={category.product} /></span><div><h3>{zh ? category.zhName : category.name}</h3><p>{zh ? category.zhCopy : category.copy}</p></div><b>→</b></Link>)}</div>
      </section>

      <section className="section section--tint home-product-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">{zh ? "客户喜爱" : "CUSTOMER FAVOURITES"}</span><h2>{zh ? "精选商品" : "Featured products"}</h2></div><Link to="/products">{zh ? "浏览全部系列" : "Browse the full range"} →</Link></div><ProductGrid products={products.filter(isCuratedProduct).slice(0, 8)} /></div></section>

      <section className="container advice-banner"><div><span className="eyebrow">{zh ? "不知道从哪里开始？" : "NOT SURE WHERE TO START?"}</span><h2>{zh ? "让我们一起设计合适的方案。" : "Let's design the right setup together."}</h2><p>{zh ? "告诉我们您需要保护什么，友好的团队会为您推荐实用且易懂的解决方案。" : "Tell our friendly team what you need to protect. We'll recommend a practical solution without the jargon."}</p></div><Link className="button button--light" to="/contact">{zh ? "获取免费建议" : "Get free advice"} <span>→</span></Link></section>

      <section className="section container"><div className="brand-row"><span>{zh ? "值得信赖的技术品牌" : "TRUSTED TECHNOLOGY FROM"}</span>{["Dahua", "HIKVISION", "Ubiquiti", "AJAX", "TP-Link", "UNIVIEW"].map((brand) => <strong key={brand}>{brand}</strong>)}</div></section>
    </>
  );
}
