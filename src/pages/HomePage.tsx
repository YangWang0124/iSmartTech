import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductGrid } from "../components/ProductGrid";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/ProductContext";

const categoryMeta: Record<string, { icon: string; copy: string }> = {
  "CCTV Cameras": { icon: "◉", copy: "See every detail, day or night" },
  "Security Kits": { icon: "▦", copy: "Complete, ready-to-go systems" },
  "Alarm Systems": { icon: "⌁", copy: "Smart protection and instant alerts" },
  "Intercoms": { icon: "▤", copy: "Know who's at the door" },
  "Networking": { icon: "⌁", copy: "Reliable connections everywhere" },
  "Recorders": { icon: "▰", copy: "Secure, always-on recording" },
  "Storage": { icon: "◫", copy: "Purpose-built surveillance drives" },
};
const categoryZh: Record<string, { name: string; copy: string }> = { "CCTV Cameras":{name:"监控摄像头",copy:"昼夜看清每个细节"}, "Security Kits":{name:"安防套装",copy:"完整即用型系统"}, "Alarm Systems":{name:"报警系统",copy:"智能防护及即时警报"}, "Intercoms":{name:"可视对讲",copy:"随时了解门外访客"}, "Networking":{name:"网络设备",copy:"随处保持可靠连接"}, "Recorders":{name:"录像机",copy:"安全持续录像"}, "Storage":{name:"存储设备",copy:"专用监控硬盘"} };

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
      <article className="home-slide home-slide--camera-banner" aria-label="Dahua camera promotion" aria-hidden={slide !== 1}><img src="/assets/dahua-camera-split-banner.v2.png" alt="Black and white Dahua cameras installed under modern roof eaves" /></article>
      <article className="home-slide home-slide--camera-banner" aria-label="Dahua camera promotion" aria-hidden={slide !== 2}><img src="/assets/dahua-camera-split-banner.v2.png" alt="Black and white Dahua cameras installed under modern roof eaves" /></article>
    </div>
    <button className="carousel-arrow carousel-arrow--previous" onClick={() => move(-1)} aria-label="Previous banner">‹</button><button className="carousel-arrow carousel-arrow--next" onClick={() => move(1)} aria-label="Next banner">›</button>
    <div className="carousel-dots">{[0,1,2].map(index => <button key={index} className={slide === index ? "active" : ""} onClick={() => setSlide(index)} aria-label={`Show banner ${index + 1}`} aria-current={slide === index ? "true" : undefined} />)}</div>
  </section>;
}

export function HomePage() {
  const { products, categories } = useProducts();
  const { language } = useLanguage();
  const zh = language === "zh";
  return (
    <>
      <HomeCarousel />

      <section className="benefits"><div className="container benefits__grid"><div><b>✓</b><span><strong>{zh ? "专业建议" : "Expert advice"}</strong><small>{zh ? "真人服务，实用解答" : "Real people, practical answers"}</small></span></div><div><b>⚡</b><span><strong>{zh ? "新西兰快速配送" : "Fast NZ shipping"}</strong><small>{zh ? "全国可追踪配送" : "Tracked delivery nationwide"}</small></span></div><div><b>↺</b><span><strong>{zh ? "轻松退货" : "Easy returns"}</strong><small>{zh ? "简单友好的支持" : "Simple, friendly support"}</small></span></div><div><b>♢</b><span><strong>{zh ? "安心购物" : "Secure shopping"}</strong><small>{zh ? "放心选购" : "Shop with confidence"}</small></span></div></div></section>

      <section className="section container">
        <div className="section-heading"><div><span className="eyebrow">{zh ? "找到适合您的方案" : "FIND YOUR SOLUTION"}</span><h2>{zh ? "按类别选购" : "Shop by category"}</h2></div><Link to="/products">{zh ? "查看全部商品" : "View all products"} →</Link></div>
        <div className="category-grid">{categories.map((category) => <Link key={category} to={`/products?category=${encodeURIComponent(category)}`} className="category-card"><span>{categoryMeta[category]?.icon}</span><div><h3>{zh ? categoryZh[category]?.name : category}</h3><p>{zh ? categoryZh[category]?.copy : categoryMeta[category]?.copy}</p></div><b>→</b></Link>)}</div>
      </section>

      <section className="section section--tint"><div className="container"><div className="section-heading"><div><span className="eyebrow">{zh ? "客户喜爱" : "CUSTOMER FAVOURITES"}</span><h2>{zh ? "精选商品" : "Featured products"}</h2></div><Link to="/products">{zh ? "浏览全部系列" : "Browse the full range"} →</Link></div><ProductGrid products={products.slice(0, 8)} /></div></section>

      <section className="container advice-banner"><div><span className="eyebrow">{zh ? "不知道从哪里开始？" : "NOT SURE WHERE TO START?"}</span><h2>{zh ? "让我们一起设计合适的方案。" : "Let's design the right setup together."}</h2><p>{zh ? "告诉我们您需要保护什么，友好的团队会为您推荐实用且易懂的解决方案。" : "Tell our friendly team what you need to protect. We'll recommend a practical solution without the jargon."}</p></div><Link className="button button--light" to="/contact">{zh ? "获取免费建议" : "Get free advice"} <span>→</span></Link></section>

      <section className="section container"><div className="brand-row"><span>{zh ? "值得信赖的技术品牌" : "TRUSTED TECHNOLOGY FROM"}</span>{["Dahua", "HIKVISION", "Ubiquiti", "AJAX", "TP-Link", "UNIVIEW"].map((brand) => <strong key={brand}>{brand}</strong>)}</div></section>
    </>
  );
}
