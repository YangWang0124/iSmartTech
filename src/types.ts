export type ProductVariant = {
  id?: string;
  name: string;
  sku?: string;
  price?: number;
  stock?: number;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  categoryIds?: number[];
  tagIds?: number[];
  price: number;
  priceOnRequest?: boolean;
  /** Source catalogue record used to enrich a curated product page when an exact SKU exists. */
  sourceProductId?: string;
  oldPrice?: number;
  sku: string;
  rating: number;
  reviews: number;
  stock: number;
  isAssembled?: boolean;
  subProducts?: ProductVariant[];
  image?: string;
  galleryImages?: string[];
  featureImages?: string[];
  colors?: string[];
  published?: boolean;
  badge?: string;
  icon: string;
  accent: string;
  shortDescription: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
};

export type CartItem = {
  productId: string;
  quantity: number;
  customKitId?: string;
  unitPrice?: number;
  installationCost?: number;
  installation?: { storeys: number; noRoofAccess: boolean };
};
