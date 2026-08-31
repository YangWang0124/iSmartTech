import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>;
type SeoProps = {
  title: string;
  description: string;
  canonicalPath?: string;
  image?: string;
  type?: "website" | "product";
  jsonLd?: JsonLd;
  noIndex?: boolean;
};

const DEFAULT_IMAGE = "/og.jpg";
const absoluteUrl = (value: string) => new URL(value, window.location.origin).toString();

function setMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element!.setAttribute(name, value));
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = href;
}

export function Seo({
  title,
  description,
  canonicalPath = window.location.pathname,
  image = DEFAULT_IMAGE,
  type = "website",
  jsonLd,
  noIndex = false,
}: SeoProps) {
  useEffect(() => {
    const canonical = absoluteUrl(canonicalPath);
    const socialImage = absoluteUrl(image);
    document.title = title;
    setCanonical(canonical);
    setMeta('meta[name="robots"]', { name: "robots", content: noIndex ? "noindex, nofollow" : "index, follow" });
    setMeta('meta[name="description"]', { name: "description", content: description });
    setMeta('meta[property="og:title"]', { property: "og:title", content: title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: description });
    setMeta('meta[property="og:type"]', { property: "og:type", content: type });
    setMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    setMeta('meta[property="og:image"]', { property: "og:image", content: socialImage });
    setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: socialImage });

    const scriptId = "ismarttech-page-jsonld";
    document.getElementById(scriptId)?.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.text = JSON.stringify(jsonLd).replace(/</g, "\\u003c");
      document.head.appendChild(script);
    }
  }, [canonicalPath, description, image, jsonLd, noIndex, title, type]);

  return null;
}

const routeSeo: Record<string, { title: string; description: string }> = {
  "/": {
    title: "iSmartTech NZ | Security, Smart Home & Installation",
    description: "Shop security, networking and smart-home technology with practical advice and professional installation services across Auckland.",
  },
  "/products": {
    title: "Security & Smart Home Products | iSmartTech NZ",
    description: "Browse iSmartTech cameras, NVRs, alarms, networking equipment and smart-home products for New Zealand homes and businesses.",
  },
  "/custom-cctv-kit": {
    title: "Build a Custom CCTV Kit | iSmartTech NZ",
    description: "Build a compatible CCTV camera and recorder package for your property with straightforward product and installation options.",
  },
  "/about": {
    title: "About iSmartTech | Auckland Technology Specialists",
    description: "Learn about iSmartTech's New Zealand team and its practical approach to security, networking, smart-home and installation solutions.",
  },
  "/contact": {
    title: "Contact iSmartTech | Auckland Security Advice",
    description: "Contact iSmartTech for friendly advice about security cameras, networking, smart-home products and Auckland installation services.",
  },
  "/installation-services": {
    title: "Professional Installation Services Auckland | iSmartTech",
    description: "Arrange professional Auckland installation for security cameras, networking, smart-home and related electrical technology solutions.",
  },
};

export function RouteSeo() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/products/") || pathname.startsWith("/category/")) return null;
  const privateRoute = ["/cart", "/signin", "/signup", "/account"].includes(pathname);
  const details = privateRoute
    ? { title: "Customer account | iSmartTech", description: "Secure iSmartTech customer account area." }
    : routeSeo[pathname] ?? routeSeo["/"];
  return <Seo {...details} canonicalPath={pathname} noIndex={privateRoute} />;
}
