export function ProductVisual({ icon, accent, large = false }: { icon: string; accent: string; large?: boolean }) {
  return (
    <div className={`product-visual product-visual--${accent} ${large ? "product-visual--large" : ""}`} aria-hidden="true">
      <div className="product-device"><span>{icon}</span><i /></div>
      <div className="product-shadow" />
    </div>
  );
}
