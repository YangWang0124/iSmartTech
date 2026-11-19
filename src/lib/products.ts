import productsData from "../data/products.json";
import type { Product } from "../types";

export const products = productsData as unknown as Product[];
export const categories = [...new Set(products.map((product) => product.category))].sort();
export const brands = [...new Set(products.map((product) => product.brand))].sort();

export const money = (value: number) =>
  new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);

export async function customerRequest<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch('/api/retail/customer/' + path, {
    method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin', cache: 'no-store',
    headers: body === undefined ? {} : {'Content-Type':'application/json','X-Customer-Request':'1'},
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (response.status === 204) return undefined as T;
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || (response.status === 401 ? 'Please sign in to continue.' : 'The request could not be completed. Please try again.'));
  return result as T;
}
