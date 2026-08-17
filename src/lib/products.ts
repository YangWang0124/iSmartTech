import productsData from "../data/products.json";
import type { Product } from "../types";

export const products = productsData as unknown as Product[];
export const categories = [...new Set(products.map((product) => product.category))].sort();
export const brands = [...new Set(products.map((product) => product.brand))].sort();

export const money = (value: number) =>
  new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
