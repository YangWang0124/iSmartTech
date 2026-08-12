import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";
import "./styles.css";
import "./palette.css";
import "./installation.css";
import "./product-zoom.css";

createRoot(document.getElementById("root")!).render(<StrictMode><BrowserRouter><LanguageProvider><CartProvider><App /></CartProvider></LanguageProvider></BrowserRouter></StrictMode>);
