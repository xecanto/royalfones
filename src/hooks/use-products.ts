import { useQuery } from "@tanstack/react-query";
import { supabase, r2Url } from "@/lib/supabase";
import type { Product } from "@/lib/database.types";

// ---------- LOCAL FALLBACK DATA ----------
// These are used when Supabase creds are not yet configured.

import productGold from "@/assets/product-gold.jpg";
import productPlatinum from "@/assets/product-platinum.jpg";
import productCroc from "@/assets/product-croc.jpg";
import productMarble from "@/assets/product-marble.jpg";
import productAccessories from "@/assets/product-accessories.jpg";

import glb_13ProGold from "@/assets/glb/13_Pro_Gold.glb?url";
import glb_iPhone12 from "@/assets/glb/iPhone12-v1.glb?url";
import glb_14ProMaxGold from "@/assets/glb/iphone_14_pro_max_gold.glb?url";

export const localProducts: Product[] = [
  {
    id: "1",
    name: "Graphite 24KT Gold Edition",
    subtitle: "iPhone 17 Pro Max",
    image_url: productGold,
    gallery_urls: [productPlatinum, productMarble],
    base_price_aed: 8500,
    is_negotiable: false,
    edition: "Limited to 33 pieces",
    materials: ["24KT Pure Gold", "Sapphire Glass"],
    description:
      "The pinnacle of mobile luxury — our Graphite 24KT Gold Edition transforms the iPhone 17 Pro Max into a wearable work of art. Every surface is meticulously hand-plated in genuine 24-carat gold by master artisans, complemented by hand-polished sapphire-crystal glass accents. Limited to just 33 individually numbered pieces worldwide.",
    category: "Gold",
    brand: "Apple",
    phone_model: "iPhone 17 Pro Max",
    is_featured: true,
    limited_qty: 33,
    model_url: glb_13ProGold,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Platinum Rhodium Blue",
    subtitle: "iPhone 17 Pro Max",
    image_url: productPlatinum,
    gallery_urls: [productGold, productCroc],
    base_price_aed: 12000,
    is_negotiable: true,
    edition: "Bespoke",
    materials: ["Platinum", "Rhodium Finish"],
    description:
      "A symphony in cool metal — our Platinum Rhodium Blue edition wraps the iPhone 17 Pro Max in pure platinum, then hand-dipped in a mirror-polished rhodium finish for an otherworldly silver-blue sheen. Made entirely to order.",
    category: "Platinum",
    brand: "Apple",
    phone_model: "iPhone 17 Pro Max",
    is_featured: true,
    limited_qty: null,
    model_url: glb_iPhone12,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Crocodile Leather & Gold",
    subtitle: "iPhone 17 Pro Max",
    image_url: productCroc,
    gallery_urls: [productMarble, productGold],
    base_price_aed: 15000,
    is_negotiable: true,
    edition: "Limited to 10 pieces",
    materials: ["Exotic Crocodile", "24KT Gold Trim"],
    description:
      "Where nature's rarest materials meet royal goldsmithing — genuine Nile crocodile leather hand-stitched with silk thread, framed in solid 24KT gold trim. Each hide is unique; no two pieces are identical. Strictly limited to 10 pieces.",
    category: "Exotic",
    brand: "Apple",
    phone_model: "iPhone 17 Pro Max",
    is_featured: true,
    limited_qty: 10,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Nero Marble Edition",
    subtitle: "iPhone 17 Pro Max",
    image_url: productMarble,
    gallery_urls: [productCroc, productPlatinum],
    base_price_aed: 9500,
    is_negotiable: false,
    edition: "Limited to 50 pieces",
    materials: ["Italian Marble Effect", "Gold Accents"],
    description:
      "Cold Italian marble elegance meets warm gold — a deep Nero Marquina marble-effect finish with hand-engraved 24KT gold-veined accents. Bold, architectural, timeless. Limited to 50 pieces.",
    category: "Marble",
    brand: "Apple",
    phone_model: "iPhone 17 Pro Max",
    is_featured: true,
    limited_qty: 50,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Gold Luxe Accessories",
    subtitle: "Apple Watch Ultra + AirPods Pro",
    image_url: productAccessories,
    gallery_urls: [productGold, productPlatinum],
    base_price_aed: 6500,
    is_negotiable: true,
    edition: "Made to Order",
    materials: ["24KT Gold Plating"],
    description:
      "Complete your Royal Fones ensemble — our Gold Luxe set brings the same museum-grade 24KT gold plating to your Apple Watch Ultra and AirPods Pro. Every curve, every hinge, every chassis finished with obsessive perfection. Made entirely to order.",
    category: "Accessories",
    brand: "Apple",
    phone_model: "Apple Watch Ultra",
    is_featured: false,
    limited_qty: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Rose Gold Diamond",
    subtitle: "iPhone 14 Pro Max",
    image_url: productGold,
    gallery_urls: [productPlatinum, productMarble],
    base_price_aed: 22000,
    is_negotiable: true,
    edition: "Limited to 7 pieces",
    materials: ["18KT Rose Gold", "VS Diamond Pavé"],
    description:
      "Our most opulent creation — an 18-carat rose gold body studded with 47 VS-clarity diamonds set in pavé on the camera ring and side rails. An heirloom to be worn, not merely carried. Limited to 7 pieces globally.",
    category: "Diamond",
    brand: "Apple",
    phone_model: "iPhone 14 Pro Max",
    is_featured: true,
    limited_qty: 7,
    model_url: glb_14ProMaxGold,
    created_at: new Date().toISOString(),
  },
];

// ---------- REACT-QUERY HOOKS ----------

const fetchProducts = async (): Promise<Product[]> => {
  if (!supabase) return localProducts;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error.message);
    return localProducts;
  }

  // Resolve R2 keys to full URLs
  return (data as Product[]).map((p) => ({
    ...p,
    image_url: r2Url(p.image_url),
    gallery_urls: p.gallery_urls?.map(r2Url) ?? null,
  }));
};

const fetchProduct = async (id: string): Promise<Product | null> => {
  if (!supabase) return localProducts.find((p) => p.id === id) ?? null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase error:", error.message);
    return localProducts.find((p) => p.id === id) ?? null;
  }

  const p = data as Product;
  return {
    ...p,
    image_url: r2Url(p.image_url),
    gallery_urls: p.gallery_urls?.map(r2Url) ?? null,
  };
};

export const useProducts = () =>
  useQuery({ queryKey: ["products"], queryFn: fetchProducts, staleTime: 5 * 60 * 1000 });

export const useProduct = (id: string) =>
  useQuery({ queryKey: ["product", id], queryFn: () => fetchProduct(id), staleTime: 5 * 60 * 1000 });
