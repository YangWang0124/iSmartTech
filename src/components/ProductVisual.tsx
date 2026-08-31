import type { MouseEvent } from "react";

export function ProductVisual({ icon, accent, image, alt = "", large = false }: { icon: string; accent: string; image?: string; alt?: string; large?: boolean }) {
  const moveZoom = (event: MouseEvent<HTMLDivElement>) => {
    if (!large || !image) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--zoom-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    event.currentTarget.style.setProperty("--zoom-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  };

  return (
    <div className={`product-visual product-visual--${accent} ${large ? "product-visual--large" : ""} ${large && image ? "product-visual--zoomable" : ""}`} onMouseMove={moveZoom} aria-hidden={image ? undefined : true}>
      {image ? <img className="product-photo" src={image} alt={alt} loading={large ? "eager" : "lazy"} decoding="async" fetchPriority={large ? "high" : "auto"} referrerPolicy="no-referrer" /> : <><div className="product-device"><span>{icon}</span><i /></div><div className="product-shadow" /></>}
    </div>
  );
}
