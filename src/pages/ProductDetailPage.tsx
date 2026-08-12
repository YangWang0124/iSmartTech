import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductVisual } from "../components/ProductVisual";
import { useCart } from "../context/CartContext";
import { money } from "../lib/products";
import { localizeProduct } from "../lib/product-i18n";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/ProductContext";

const dahuaFeatureBadges = [
  ["/assets/product-features/6mp-resolution.png", "6MP full HD resolution"],
  ["/assets/product-features/30m-night-vision.png", "30 metre night vision"],
  ["/assets/product-features/weather-proof.png", "Weather proof"],
  ["/assets/product-features/built-in-mic.png", "Built-in microphone"],
  ["/assets/product-features/false-alarm-filter.png", "False alarm filter"],
  ["/assets/product-features/colour-night-vision.png", "Colour night vision"],
  ["/assets/product-features/h265-plus.png", "H.265+ compression"],
  ["/assets/product-features/built-in-light.png", "Built-in light"],
];

const dahuaDescriptionTitle = "Dahua DH-IPC-HDW3667EM-S-IL-ANZ | 6MP Dual Light Turret | Built-in Mic | SMD 4.0 | IP67";
const dahuaDescription = "The Dahua DH-IPC-HDW3667EM-S-IL-ANZ delivers 6MP WizSense surveillance in a compact turret form, designed for both residential and commercial installations. Featuring smart dual-light technology, it automatically switches between infrared and warm white illumination based on motion, providing full-colour detail and effective deterrence when needed. Equipped with an integrated microphone and H.265+ compression, it captures clear audio alongside high-resolution video while minimising storage and bandwidth demands. Its IP67-rated housing ensures reliable performance across Australia’s harshest outdoor environments.";
const dahuaKeyFeatures = [
  ["6MP High Resolution", "Captures crisp, detailed footage for accurate identification of faces, licence plates, and objects."],
  ["Smart Dual Light", "Automatically switches between infrared and warm white illumination based on motion, enhancing visibility and deterring intruders."],
  ["SMD 4.0 AI Detection", "Precise human and vehicle classification reduces false alarms and improves real-time alert accuracy."],
  ["Built-in Microphone", "Integrated mic captures clear on-site audio to complement video evidence for more comprehensive monitoring."],
  ["IP67 Weatherproof", "Robust housing withstands dust, rain, and harsh outdoor conditions for reliable 24/7 operation."],
  ["H.265+ Compression", "Maximises storage efficiency and minimises bandwidth usage without compromising video quality."],
];

const hikvisionKitContents = [
  ["Control panel", "1 × DS-PWA96-M-WB AX PRO wireless alarm panel"],
  ["Keyfob", "1 × DS-PKF1-WB wireless remote"],
  ["PIR detector", "1 × DS-PDP15P-EG2-WB motion sensor"],
  ["Magnetic contact", "1 × DS-PDMC-EG2-WB door and window sensor"],
];

const hikvisionKeyFeatures = [
  ["Expandable protection", "Connects up to 96 wireless zones or outputs, including compatible PIRCAM devices, keyfobs, sounders, repeaters and keypads."],
  ["Secure wireless communication", "Tri-X two-way communication uses frequency hopping and AES-128 encryption for dependable wireless operation."],
  ["Multiple network paths", "Ethernet, Wi-Fi and mobile-network support help keep the alarm connected and able to deliver notifications."],
  ["Remote app control", "Configure, arm, disarm and receive alerts through supported Hik-Connect and installer applications."],
  ["Power-outage resilience", "The built-in lithium backup battery provides up to 12 hours of standby operation."],
  ["Flexible for home or business", "A compact starter system that can expand with additional detectors, sounders and accessories."],
];

export function ProductDetailPage() {
  const { id } = useParams();
  const { products } = useProducts();
  const baseProduct = products.find((item) => item.id === id);
  const { language } = useLanguage();
  const zh = language === "zh";
  const product = baseProduct ? localizeProduct(baseProduct, language) : undefined;
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("White");
  const [selectedPower, setSelectedPower] = useState("NZ power supply");
  const [added, setAdded] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const { addItem } = useCart();
  if (!product) return <main className="page container empty-state"><h1>Product not found</h1><Link className="button button--primary" to="/products">Back to products</Link></main>;
  const add = () => { addItem(product.id, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 1800); };
  const usesDahuaBadges = product.id === "dahua-4k-turret";
  const usesHikvisionKitLayout = product.id === "hikvision-ax-pro-security-kit";
  const previewImages: Array<string | undefined> = [
    product.image,
    ...((product.galleryImages?.length ? product.galleryImages : usesDahuaBadges ? ["/assets/dahua-installed-preview.png"] : [])),
  ];
  const displayedImage = previewImages[previewIndex] ?? product.image;

  return (
    <main className="page container">
      <div className="breadcrumb"><Link to="/">{zh ? "首页" : "Home"}</Link><span>›</span><Link to={`/products?category=${encodeURIComponent(baseProduct!.category)}`}>{product.category}</Link><span>›</span>{product.name}</div>
      <section className="product-detail product-detail--commerce">
        <div className="product-preview">
          <div className="product-detail__gallery">{product.badge && <span className="badge">{product.badge}</span>}<ProductVisual icon={product.icon} accent={product.accent} image={displayedImage} alt={product.name} large />{!displayedImage && <div className="gallery-note">{zh ? "产品预览" : "PRODUCT PREVIEW"}</div>}</div>
          <div className="product-preview__thumbs">{previewImages.map((image, index) => <button type="button" key={`${image || "product-placeholder"}-${index}`} className={index === previewIndex ? "active" : ""} onClick={() => setPreviewIndex(index)} aria-label={`${zh ? "显示产品图片" : "Show product image"} ${index + 1}`}><ProductVisual icon={product.icon} accent={product.accent} image={image} alt="" /></button>)}</div>
        </div>
        <div className="product-detail__info product-purchase">
          <span className="eyebrow">{product.brand} · SKU {product.sku}</span>
          <h1>{product.name}</h1>
          <div className="detail-price"><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}<small>{zh ? "含商品及服务税" : "inc GST"}</small></div>
          <div className="product-summary"><h2>{usesDahuaBadges ? dahuaDescriptionTitle : product.shortDescription}</h2><p>{usesDahuaBadges ? dahuaDescription : product.description}</p></div>
          {usesHikvisionKitLayout && <section className="key-features product-kit-contents"><h2>{zh ? "套装包含" : "What's included"}</h2><ul>{hikvisionKitContents.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>}
          {!usesHikvisionKitLayout && <div className="feature-badges" aria-label={zh ? "产品特点" : "Product features"}>{(product.featureImages?.length ? product.featureImages.map((src, index) => [src, product.features[index] || `Feature ${index + 1}`]) : dahuaFeatureBadges).map(([src, label]) => <img key={src} src={src} alt={label} />)}</div>}
          {usesDahuaBadges && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{dahuaKeyFeatures.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>}
          {usesHikvisionKitLayout && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{hikvisionKeyFeatures.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>}
          {usesDahuaBadges && <section className="additional-information"><h2>{zh ? "附加信息" : "Additional Information"}</h2><a href="/assets/DH-IPC-HDW3667EM-S-IL-ANZ-spec-sheet.pdf" target="_blank" rel="noopener noreferrer">DH-IPC-HDW3667EM-S-IL-ANZ Spec Sheet <span aria-hidden="true">↗</span></a></section>}
          {usesHikvisionKitLayout && <section className="additional-information"><h2>{zh ? "附加信息" : "Additional Information"}</h2><a href="/assets/DS-PWA96-Kit-WB_Datasheet_20230516.pdf" target="_blank" rel="noopener noreferrer">DS-PWA96-Kit-WB_Datasheet_20230516 <span aria-hidden="true">↗</span></a></section>}
          {usesHikvisionKitLayout && <div className="colour-picker"><div><strong>{zh ? "电源选择" : "Power supply choice"}</strong><small>{zh ? `已选择：${selectedPower}` : `Selected: ${selectedPower}`}</small></div><div className="colour-picker__options">{["NZ power supply", "Panel only"].map(option => <button key={option} className={selectedPower === option ? "active" : ""} onClick={() => setSelectedPower(option)}>{option}</button>)}</div></div>}
          <div className="colour-picker"><div><strong>{zh ? "颜色" : "Colour"}</strong><small>{zh ? `已选择：${selectedColor}` : `Selected: ${selectedColor}`}</small></div><div className="colour-picker__options">{(product.colors?.length ? product.colors : ["White", "Black"]).map(color => <button key={color} className={selectedColor === color ? "active" : ""} onClick={() => setSelectedColor(color)} aria-label={`${zh ? "选择" : "Select"} ${color}`}><i className={`colour-swatch colour-swatch--${color.toLowerCase()}`} />{color}</button>)}</div></div>
          <div className="purchase-row purchase-row--new"><div className="quantity-stepper" aria-label={zh ? "数量" : "Quantity"}><span>{zh ? "数量" : "Quantity"}</span><div><button onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label={zh ? "减少数量" : "Decrease quantity"}>−</button><b>{quantity}</b><button onClick={() => setQuantity((current) => Math.min(99, current + 1))} aria-label={zh ? "增加数量" : "Increase quantity"}>+</button></div></div><button className="button button--primary add-to-cart" onClick={add}>{added ? (zh ? "✓ 已加入购物车" : "✓ Added to cart") : (zh ? "加入购物车" : "Add to cart")}</button></div>
        </div>
      </section>
    </main>
  );
}
