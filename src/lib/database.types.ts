// Auto-generate this from `supabase gen types typescript` in real projects.
// This is the manually maintained version that matches the SQL schema.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: ProductInsert;
        Update: Partial<ProductInsert>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  /** Cloudflare R2 storage key or full URL */
  image_url: string;
  /** Additional gallery images (R2 keys or full URLs) */
  gallery_urls: string[] | null;
  base_price_aed: number;
  is_negotiable: boolean;
  edition: string;
  materials: string[];
  description: string | null;
  category: string | null;
  /** Brand e.g. "Apple", "Samsung" */
  brand?: string | null;
  /** Phone model e.g. "iPhone 17 Pro Max", "Galaxy S25 Ultra" */
  phone_model?: string | null;
  is_featured: boolean;
  /** How many pieces in this limited run (null = unlimited / made-to-order) */
  limited_qty: number | null;
  /**
   * Cloudflare R2 key or full URL to the GLB/GLTF 3-D model.
   * null means no model is available yet for this product.
   */
  model_url?: string | null;
  created_at: string;
}

export type ProductInsert = Omit<Product, "id" | "created_at">;

/** Currency helpers */
export type Currency = "AED" | "SAR" | "PKR";

export const currencySymbols: Record<Currency, string> = {
  AED: "AED",
  SAR: "SAR",
  PKR: "PKR",
};

export const exchangeRates: Record<Currency, number> = {
  AED: 1,
  SAR: 1.02,
  PKR: 75.5,
};

export const formatPrice = (baseAED: number, currency: Currency): string => {
  const converted = Math.round(baseAED * exchangeRates[currency]);
  return `${currencySymbols[currency]} ${converted.toLocaleString()}`;
};
