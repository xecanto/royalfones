/**
 * Local GLB asset map — used until models are migrated to Cloudflare R2.
 * Keys are lowercase substrings to match against product name / phone_model.
 * Vite resolves these at build time and returns hashed public URLs.
 */

import glb_13ProGold from "@/assets/glb/13_Pro_Gold.glb?url";
import glb_iPhone12 from "@/assets/glb/iPhone12-v1.glb?url";
import glb_14ProMaxGold from "@/assets/glb/iphone_14_pro_max_gold.glb?url";

const LOCAL_GLB_MAP: Array<{ keywords: string[]; url: string }> = [
  { keywords: ["14 pro max", "14pro max", "iphone 14 pro max"], url: glb_14ProMaxGold },
  { keywords: ["13 pro gold", "13_pro_gold", "13 pro"], url: glb_13ProGold },
  { keywords: ["iphone 12", "iphone12", "12-v1"], url: glb_iPhone12 },
];

/**
 * Returns a local GLB URL if any keyword matches the given text (case-insensitive).
 * Falls back to null if no match.
 */
export function resolveLocalGlb(text: string | null | undefined): string | null {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (const entry of LOCAL_GLB_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.url;
    }
  }
  return null;
}
