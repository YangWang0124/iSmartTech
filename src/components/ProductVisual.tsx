export function ProductVisual({ icon, accent, image, alt = "", large = false }: { icon: string; accent: string; image?: string; alt?: string; large?: boolean }) {
  return (
    <div className={`product-visual product-visual--${accent} ${large ? "product-visual--large" : ""}`} aria-hidden="true">
      {image ? <img className="product-photo" src={image} alt={alt} /> : <><div className="product-device"><span>{icon}</span><i /></div><div className="product-shadow" /></>}
    </div>
  );
}
