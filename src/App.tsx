import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminProductsPage } from "./pages/AdminProductsPage";
import { InstallationServicesPage } from "./pages/InstallationServicesPage";
import { ProductProvider } from "./context/ProductContext";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return <ProductProvider><ScrollToTop /><Header /><Routes><Route path="/" element={<HomePage />} /><Route path="/products" element={<ProductsPage />} /><Route path="/category/:categorySlug" element={<ProductsPage />} /><Route path="/products/:id" element={<ProductDetailPage />} /><Route path="/cart" element={<CartPage />} /><Route path="/about" element={<AboutPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/installation-services" element={<InstallationServicesPage />} /><Route path="/staff/products" element={<AdminProductsPage />} /><Route path="*" element={<HomePage />} /></Routes><Footer /></ProductProvider>;
}
