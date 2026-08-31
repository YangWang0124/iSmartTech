import { Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { useLayoutEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { InstallationServicesPage } from "./pages/InstallationServicesPage";
import { ProductProvider } from "./context/ProductContext";
import { CustomerAuthPage } from "./pages/CustomerAuthPage";
import { AccountPage } from "./pages/AccountPage";
import { CustomCctvKitPage } from "./pages/CustomCctvKitPage";
import { RouteSeo } from "./components/Seo";

function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType === "POP") return;

    const root = document.documentElement;
    const body = document.body;
    const rootScrollBehavior = root.style.scrollBehavior;
    const bodyScrollBehavior = body.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    body.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = rootScrollBehavior;
    body.style.scrollBehavior = bodyScrollBehavior;
  }, [pathname, navigationType]);

  return null;
}

export default function App() {
  return <ProductProvider><ScrollToTop /><RouteSeo /><Header /><Routes><Route path="/" element={<HomePage />} /><Route path="/products" element={<ProductsPage />} /><Route path="/custom-cctv-kit" element={<CustomCctvKitPage />} /><Route path="/category/:categorySlug" element={<ProductsPage />} /><Route path="/products/:id" element={<ProductDetailPage />} /><Route path="/cart" element={<CartPage />} /><Route path="/about" element={<AboutPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/installation-services" element={<InstallationServicesPage />} /><Route path="/signin" element={<CustomerAuthPage mode="signin" />} /><Route path="/signup" element={<CustomerAuthPage mode="signup" />} /><Route path="/account" element={<AccountPage />} /><Route path="*" element={<HomePage />} /></Routes><Footer /></ProductProvider>;
}
