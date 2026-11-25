import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import "./styles.css";
import "./palette.css";
import "./brand-menu.css";
import "./category-nav-tabs.css";
import "./installation.css";
import "./product-zoom.css";
import "./account.css";

createRoot(document.getElementById("root")!).render(<StrictMode><BrowserRouter><LanguageProvider><AuthProvider><ProductProvider><CartProvider><App /></CartProvider></ProductProvider></AuthProvider></LanguageProvider></BrowserRouter></StrictMode>);
