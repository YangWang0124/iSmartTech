import { Link } from "react-router-dom";
import { ProductGrid } from "../components/ProductGrid";
import { SearchBar } from "../components/SearchBar";
import { categories, products } from "../lib/products";
import { useLanguage } from "../context/LanguageContext";

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

export function HomePage() {
  const { language } = useLanguage();
  const zh = language === "zh";
  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__content">
            <span className="hero__eyebrow">{zh ? "智能安防，从这里开始" : "SMARTER SECURITY STARTS HERE"}</span>
            <h1>{zh ? "守护重要的一切。" : "Protect what matters."}<br /><em>{zh ? "时刻保持连接。" : "Stay connected."}</em></h1>
            <p>{zh ? "专业级安防、网络及智能科技，让新西兰家庭和企业轻松使用。" : "Professional-grade security, networking and smart technology—made straightforward for Kiwi homes and businesses."}</p>
            <div className="hero__actions"><Link className="button button--primary" to="/products">{zh ? "选购全部商品" : "Shop all products"} <span>→</span></Link><Link className="button button--ghost" to="/contact">{zh ? "咨询专家" : "Talk to a specialist"}</Link></div>
            <div className="hero__trust"><span>✓ {zh ? "新西兰本地运营" : "NZ owned & operated"}</span><span>✓ {zh ? "本地技术支持" : "Local technical support"}</span><span>✓ {zh ? "值得信赖的品牌" : "Trusted brands"}</span></div>
          </div>
          <div className="hero__art" aria-label="Connected security system illustration">
            <div className="hero__rings" />
            <div className="hero-camera"><span>4K</span><i /></div>
            <div className="signal signal--one">● <span>{zh ? "持续在线" : "Always connected"}</span></div>
            <div className="signal signal--two">✓ <span>{zh ? "智能侦测" : "Smart detection"}</span></div>
            <div className="signal signal--three">24/7 <span>{zh ? "全天候守护" : "Peace of mind"}</span></div>
          </div>
        </div>
        <div className="container hero__search"><SearchBar /></div>
      </section>

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
