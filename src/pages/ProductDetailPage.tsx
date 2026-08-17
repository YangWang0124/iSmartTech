import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductVisual } from "../components/ProductVisual";
import { useCart } from "../context/CartContext";
import { money } from "../lib/products";
import { localizeProduct } from "../lib/product-i18n";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/ProductContext";
import type { Product } from "../types";

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

const paradoxKitContents = (model: "SP4000" | "SP5500") => [
  ["Alarm panel", `1 × Paradox ${model} alarm panel in cabinet with fuse and transformer`],
  ["Backup battery", "1 × 7.0 Ah backup battery"],
  ["Keypad", "1 × K10H horizontal keypad"],
  ["Motion detection", "2 × standard Paradox Pro PIR detectors"],
  ["Internal siren", "1 × flush-mount internal siren"],
  ["External siren", "1 × external siren"],
];

const arrowheadKitContents = (keypad: "LCD" | "LED") => [
  ["Alarm panel", "1 × Arrowhead EC hardwired 8-zone control panel in a plastic cabinet with transformer and fuse"],
  ["Keypad", keypad === "LCD" ? "1 × full-English vertical LCD keypad" : "1 × white slimline LED keypad"],
  ["Backup battery", "1 × 7.0 Ah backup battery"],
  ["Motion detection", "2 × Optex FLX-S-ST pet-friendly PIR detectors (up to 18 kg)"],
  ["Sirens", "1 × EC external siren and 1 × internal flush-mount siren"],
  ["Cable", "1 × 100 metre box of 0.2 alarm cable"],
];

type TiandyProductContent = {
  model: string;
  name: string;
  descriptionTitle: string;
  overview: string;
  features: string[];
};

const tiandyProductContent: TiandyProductContent[] = [
  {
    model: "TC-C36XN",
    name: "Tiandy 6MP DualLight Turret Camera",
    descriptionTitle: "Tiandy TC-C36XN 2ENA-28 | 6MP DualLight Turret | Built-in Mic | IP66",
    overview: "The Tiandy TC-C36XN 2ENA-28 is a 6MP turret network camera with a 1/2.7-inch CMOS sensor and 2.8mm fixed lens. It combines infrared illumination up to 30m with white-light illumination up to 15m, plus Smart IR, WDR, human and vehicle detection, a built-in microphone and PoE power in an IP66 housing.",
    features: ["6MP resolution up to 3200 × 1800 at 30fps", "Dual illumination: infrared up to 30m and white light up to 15m", "2.8mm fixed lens with 112.1° horizontal field of view", "Human and vehicle smart-alarm detection", "Built-in microphone with S+265 / H.265 / H.264 compression", "PoE IEEE 802.3af, ONVIF Profile S/T and IP66 protection"],
  },
  {
    model: "TC-C34XN",
    name: "Tiandy 4MP Fixed Turret Camera",
    descriptionTitle: "Tiandy TC-C34XN 2ENA-28 | 4MP Fixed Turret | Built-in Mic | IP66",
    overview: "The Tiandy TC-C34XN 2ENA-28 is a 4MP fixed turret camera with a 1/3-inch CMOS sensor and 2.8mm fixed lens. It provides Smart IR up to 30m, white-light illumination up to 15m, human and vehicle detection, a built-in microphone and PoE support for dependable indoor or outdoor surveillance.",
    features: ["4MP resolution, 2560 × 1440 at 30fps", "Infrared illumination up to 30m and white light up to 15m", "2.8mm fixed lens with 91.5° horizontal field of view", "DWDR, 3D DNR and Smart IR", "Human and vehicle smart-alarm detection", "Built-in microphone, ONVIF Profile S/T, PoE and IP66 protection"],
  },
  {
    model: "TC-R3105",
    name: "Tiandy 1 HDD 5-Channel PSE NVR",
    descriptionTitle: "Tiandy TC-R3105 | 5-Channel PSE NVR | 4 PoE Ports | 1 HDD",
    overview: "The Tiandy TC-R3105 is a 5-channel PSE network video recorder supporting camera input up to 8MP, 60Mbps incoming bandwidth and local HDD storage. Four integrated PoE ports simplify camera connection, while Smart Alarm and human/vehicle classification support efficient monitoring.",
    features: ["5 camera channels with up to 8MP input", "60Mbps incoming and 40Mbps outgoing bandwidth", "Four PoE ports with a 45W total PoE budget", "One HDD bay supporting drives up to 8TB", "4-channel simultaneous playback with HDMI and VGA outputs", "S+265 / H.265 / H.264, ONVIF Profile S/T and RTSP support"],
  },
  {
    model: "TC-R3110",
    name: "Tiandy 1 HDD 10-Channel Advanced PSE NVR",
    descriptionTitle: "Tiandy TC-R3110 | 10-Channel PSE NVR | 8 PoE Ports | 4K HDMI",
    overview: "The Tiandy TC-R3110 is a 10-channel PSE network video recorder with 60Mbps incoming bandwidth, local HDD recording and 4K HDMI output. Eight integrated PoE ports provide a 70W budget for connected cameras, and Smart Motion analytics are supported through compatible cameras.",
    features: ["10 camera channels with up to 6MP supported resolution", "60Mbps incoming and 40Mbps outgoing bandwidth", "Eight PoE ports with a 70W total PoE budget", "4K HDMI output and up to 10-camera multi-screen display", "One HDD bay supporting drives up to 6TB", "S+265 / H.265 / H.264, ONVIF Profile S/T and RTSP support"],
  },
  {
    model: "TC-R3104",
    name: "Tiandy 1 HDD 4-Channel PSE NVR",
    descriptionTitle: "Tiandy TC-R3104 | 4-Channel PSE NVR | 4 PoE Ports | 1 HDD",
    overview: "The Tiandy TC-R3104 is a compact 4-channel PSE network video recorder that supports camera input up to 6MP, 60Mbps incoming bandwidth and local HDD recording. Its four integrated PoE ports provide a tidy single-cable camera installation, with Smart Motion and ONVIF Profile S/T support.",
    features: ["4 camera channels with up to 6MP input", "60Mbps incoming and 40Mbps outgoing bandwidth", "Four PoE ports with a 28W total PoE budget", "One HDD bay supporting drives up to 6TB", "HDMI and VGA output with 4-channel playback", "Smart Motion, RTSP and ONVIF Profile S/T support"],
  },
  {
    model: "TC-H343K",
    name: "Tiandy 4MP Color Maker 4G Solar PT Camera",
    descriptionTitle: "Tiandy TC-H343K 8DA-4 | 4MP Solar 4G PT Camera | Auto Tracking | IP65",
    overview: "The official Tiandy model is TC-H343K 8DA-4. It is a 4MP Color Maker PT camera for Tiandy's solar and battery integrated range, with human and vehicle detection, auto-tracking, infrared and white-light illumination, two-way audio and microSD storage.",
    features: ["4MP resolution up to 2560 × 1440 at 20fps", "Pan/tilt movement with 64 presets and auto-tracking", "Infrared illumination up to 30m and white light up to 15m", "Human and vehicle detection with red/blue alarm flashing", "Built-in microphone, loudspeaker and microSD storage up to 256GB", "IP65 protection for solar and battery-integrated deployments"],
  },
  {
    model: "TC-C34CN",
    name: "Tiandy 4MP Color Maker Wi-Fi Bullet Camera",
    descriptionTitle: "Tiandy TC-C34CN 9ATA-28 | 4MP Wi-Fi Bullet | Two-Way Audio | IP65",
    overview: "The Tiandy TC-C34CN 9ATA-28 is a 4MP Color Maker Wi-Fi bullet camera with a 2.8mm fixed lens, infrared illumination up to 30m and white-light illumination up to 20m. It includes Wi-Fi connectivity, two-way audio, microSD storage and IP65 protection.",
    features: ["4MP resolution up to 2560 × 1440 at 20fps", "2.8mm fixed lens with 103.8° horizontal field of view", "Infrared illumination up to 30m and white light up to 20m", "Wi-Fi 802.11b/g/n with WPA-PSK / WPA2-PSK security", "Built-in microphone, loudspeaker and microSD storage up to 256GB", "Smart Alarm, 3D DNR, DWDR and IP65 protection"],
  },
];

const normaliseProductCode = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

export function ProductDetailPage() {
  const { id } = useParams();
  const { products } = useProducts();
  const baseProduct = products.find((item) => item.id === id);
  const [sourceDetail, setSourceDetail] = useState<Partial<Product>>();
  useEffect(() => {
    let cancelled = false;
    setSourceDetail(undefined);
    const sourceId = id?.startsWith("source-") ? id : baseProduct?.sourceProductId;
    if (!sourceId) return () => { cancelled = true; };
    fetch(`/api/catalogue-source/${encodeURIComponent(sourceId)}`)
      .then(response => response.ok ? response.json() : Promise.reject(new Error("Product details unavailable")))
      .then(detail => { if (!cancelled) setSourceDetail(detail); })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [id, baseProduct?.sourceProductId]);
  const { language } = useLanguage();
  const zh = language === "zh";
  const detailedBaseProduct = baseProduct ? { ...sourceDetail, ...baseProduct, image: baseProduct.image ?? sourceDetail?.image, galleryImages: baseProduct.galleryImages?.length ? baseProduct.galleryImages : sourceDetail?.galleryImages, featureImages: baseProduct.featureImages?.length ? baseProduct.featureImages : sourceDetail?.featureImages, features: sourceDetail?.features?.length ? sourceDetail.features : baseProduct.features, description: sourceDetail?.description || baseProduct.description, shortDescription: sourceDetail?.shortDescription || baseProduct.shortDescription } as Product : undefined;
  const product = detailedBaseProduct ? localizeProduct(detailedBaseProduct, language) : undefined;
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
  const paradoxModel = product.id === "paradox-sp4000-alarm-kit" ? "SP4000" : product.id === "paradox-sp5500-alarm-kit" ? "SP5500" : undefined;
  const usesParadoxKitLayout = Boolean(paradoxModel);
  const arrowheadKeypad = product.id === "arrowhead-ec-lcd-alarm-kit" ? "LCD" : product.id === "arrowhead-ec-led-alarm-kit" ? "LED" : undefined;
  const usesArrowheadKitLayout = Boolean(arrowheadKeypad);
  const usesSourceLayout = product.id.startsWith("source-");
  const tiandyDetail = product.brand.toLowerCase() === "tiandy"
    ? tiandyProductContent.find(item => normaliseProductCode(product.sku).includes(normaliseProductCode(item.model)))
    : undefined;
  const displayName = tiandyDetail?.name ?? product.name;
  const displaySku = tiandyDetail?.model ?? product.sku;
  const previewImages: Array<string | undefined> = [
    product.image,
    ...((product.galleryImages?.length ? product.galleryImages : usesDahuaBadges ? ["/assets/dahua-installed-preview.png"] : [])),
  ];
  const displayedImage = previewImages[previewIndex] ?? product.image;

  return (
    <main className="page container">
      <div className="breadcrumb"><Link to="/">{zh ? "首页" : "Home"}</Link><span>›</span><Link to={`/products?category=${encodeURIComponent(baseProduct!.category)}`}>{product.category}</Link><span>›</span>{displayName}</div>
      <section className="product-detail product-detail--commerce">
        <div className="product-preview">
          <div className="product-detail__gallery">{product.badge && <span className="badge">{product.badge}</span>}<ProductVisual icon={product.icon} accent={product.accent} image={displayedImage} alt={displayName} large />{!displayedImage && <div className="gallery-note">{zh ? "产品预览" : "PRODUCT PREVIEW"}</div>}</div>
          <div className="product-preview__thumbs">{previewImages.map((image, index) => <button type="button" key={`${image || "product-placeholder"}-${index}`} className={index === previewIndex ? "active" : ""} onClick={() => setPreviewIndex(index)} aria-label={`${zh ? "显示产品图片" : "Show product image"} ${index + 1}`}><ProductVisual icon={product.icon} accent={product.accent} image={image} alt="" /></button>)}</div>
        </div>
        <div className="product-detail__info product-purchase">
          <span className="eyebrow">{product.brand} · SKU {displaySku}</span>
          <h1>{displayName}</h1>
          <div className="detail-price"><strong>{product.priceOnRequest ? (zh ? "询价" : "Price on request") : money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}<small>{product.priceOnRequest ? (zh ? "请联系我们获取报价" : "Contact us for a quote") : (zh ? "含商品及服务税" : "inc GST")}</small></div>
          {usesSourceLayout && !tiandyDetail ? <div className="product-summary source-product-summary"><ul>{product.features.map(feature => <li key={feature}>{feature}</li>)}</ul></div> : <div className="product-summary"><h2>{usesDahuaBadges ? dahuaDescriptionTitle : tiandyDetail?.descriptionTitle ?? product.shortDescription}</h2><p>{usesDahuaBadges ? dahuaDescription : tiandyDetail?.overview ?? product.description}</p></div>}
          <section className="product-status" aria-label={zh ? "产品库存和选项" : "Product stock and options"}>
            <div><span>{zh ? "库存" : "Stock"}</span><strong className={product.priceOnRequest ? "out-of-stock" : product.stock > 0 ? "in-stock" : "out-of-stock"}>{product.priceOnRequest ? (zh ? "库存请询问" : "Stock on request") : product.stock > 0 ? (zh ? `现货 ${product.stock} 件` : `${product.stock} in stock`) : (zh ? "缺货" : "Out of stock")}</strong></div>
          </section>
          {usesHikvisionKitLayout && <section className="key-features product-kit-contents"><h2>{zh ? "套装包含" : "What's included"}</h2><ul>{hikvisionKitContents.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>}
          {usesParadoxKitLayout && <section className="key-features product-kit-contents"><h2>{zh ? "套装包含" : "What's included"}</h2><ul>{paradoxKitContents(paradoxModel!).map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul><p><strong>Note:</strong> Cable must be ordered separately.</p></section>}
          {usesArrowheadKitLayout && <section className="key-features product-kit-contents"><h2>{zh ? "套装包含" : "What's included"}</h2><ul>{arrowheadKitContents(arrowheadKeypad!).map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>}
          {!usesHikvisionKitLayout && !usesParadoxKitLayout && !usesArrowheadKitLayout && (usesDahuaBadges || product.featureImages?.length) ? <div className="feature-badges" aria-label={zh ? "产品特点" : "Product features"}>{(product.featureImages?.length ? product.featureImages.map((src, index) => [src, product.features[index] || `Feature ${index + 1}`]) : dahuaFeatureBadges).map(([src, label]) => <img key={src} src={src} alt={label} />)}</div> : null}
          {usesDahuaBadges && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{dahuaKeyFeatures.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>}
          {tiandyDetail && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{tiandyDetail.features.map(feature => <li key={feature}>{feature}</li>)}</ul></section>}
          {usesHikvisionKitLayout && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{hikvisionKeyFeatures.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul></section>}
          {usesParadoxKitLayout && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{product.features.map(feature => <li key={feature}>{feature}</li>)}</ul></section>}
          {usesArrowheadKitLayout && <section className="key-features"><h2>{zh ? "主要特点" : "Key Features"}</h2><ul>{product.features.map(feature => <li key={feature}>{feature}</li>)}</ul></section>}
          {usesDahuaBadges && <section className="additional-information"><h2>{zh ? "附加信息" : "Additional Information"}</h2><a href="/assets/DH-IPC-HDW3667EM-S-IL-ANZ-spec-sheet.pdf" target="_blank" rel="noopener noreferrer">DH-IPC-HDW3667EM-S-IL-ANZ Spec Sheet <span aria-hidden="true">↗</span></a></section>}
          {usesHikvisionKitLayout && <section className="additional-information"><h2>{zh ? "附加信息" : "Additional Information"}</h2><a href="/assets/DS-PWA96-Kit-WB_Datasheet_20230516.pdf" target="_blank" rel="noopener noreferrer">DS-PWA96-Kit-WB_Datasheet_20230516 <span aria-hidden="true">↗</span></a></section>}
          {usesHikvisionKitLayout && <div className="colour-picker"><div><strong>{zh ? "电源选择" : "Power supply choice"}</strong><small>{zh ? `已选择：${selectedPower}` : `Selected: ${selectedPower}`}</small></div><div className="colour-picker__options">{["NZ power supply", "Panel only"].map(option => <button key={option} className={selectedPower === option ? "active" : ""} onClick={() => setSelectedPower(option)}>{option}</button>)}</div></div>}
          {!usesSourceLayout && <div className="colour-picker"><div><strong>{zh ? "颜色" : "Colour"}</strong><small>{zh ? `已选择：${selectedColor}` : `Selected: ${selectedColor}`}</small></div><div className="colour-picker__options">{(product.colors?.length ? product.colors : ["White", "Black"]).map(color => <button key={color} className={selectedColor === color ? "active" : ""} onClick={() => setSelectedColor(color)} aria-label={`${zh ? "选择" : "Select"} ${color}`}><i className={`colour-swatch colour-swatch--${color.toLowerCase()}`} />{color}</button>)}</div></div>}
          <div className="purchase-row purchase-row--new">{product.priceOnRequest ? <Link className="button button--primary add-to-cart" to="/contact">{zh ? "获取报价" : "Request a quote"}</Link> : <><div className="quantity-stepper" aria-label={zh ? "数量" : "Quantity"}><span>{zh ? "数量" : "Quantity"}</span><div><button onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label={zh ? "减少数量" : "Decrease quantity"}>−</button><b>{quantity}</b><button onClick={() => setQuantity((current) => Math.min(99, current + 1))} aria-label={zh ? "增加数量" : "Increase quantity"}>+</button></div></div><button className="button button--primary add-to-cart" onClick={add}>{added ? (zh ? "✓ 已加入购物车" : "✓ Added to cart") : (zh ? "加入购物车" : "Add to cart")}</button></>}</div>
        </div>
      </section>
    </main>
  );
}
