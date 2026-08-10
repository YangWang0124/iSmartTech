export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  sku: string;
  rating: number;
  reviews: number;
  stock: number;
  image?: string;
  published?: boolean;
  badge?: string;
  icon: string;
  accent: string;
  shortDescription: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
};

export type CartItem = { productId: string; quantity: number };
