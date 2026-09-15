import type { MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import type { CatalogueBrand } from "../lib/brands";

type Props = {
  brand: CatalogueBrand;
  onClick: MouseEventHandler<HTMLAnchorElement>;
};

export function BrandMenuLink({ brand, onClick }: Props) {
  return (
    <Link
      className="brand-menu__link"
      to={`/brand/${brand.slug}`}
      onClick={onClick}
    >
      <span className={`brand-menu__logo brand-menu__logo--${brand.value.toLowerCase()}`} aria-hidden="true">
        <img src={brand.logo} alt="" decoding="async" />
      </span>
      <span className="brand-menu__label">{brand.label}</span>
    </Link>
  );
}
