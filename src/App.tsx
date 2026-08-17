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
import { CustomerAuthPage } from "./pages/CustomerAuthPage";
import { AccountPage } from "./pages/AccountPage";
import { CustomCctvKitPage } from "./pages/CustomCctvKitPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return <ProductProvider><ScrollToTop /><Header /><Routes><Route path="/" element={<HomePage />} /><Route path="/products" element={<ProductsPage />} /><Route path="/custom-cctv-kit" element={<CustomCctvKitPage />} /><Route path="/category/:categorySlug" element={<ProductsPage />} /><Route path="/products/:id" element={<ProductDetailPage />} /><Route path="/cart" element={<CartPage />} /><Route path="/about" element={<AboutPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/installation-services" element={<InstallationServicesPage />} /><Route path="/signin" element={<CustomerAuthPage mode="signin" />} /><Route path="/signup" element={<CustomerAuthPage mode="signup" />} /><Route path="/account" element={<AccountPage />} /><Route path="/staff/products" element={<AdminProductsPage />} /><Route path="*" element={<HomePage />} /></Routes><Footer /></ProductProvider>;
}
