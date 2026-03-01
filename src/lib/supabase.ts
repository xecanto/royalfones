import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase env vars not set. Using local product data as fallback. " +
    "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file."
  );
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Cloudflare R2 public base URL.
 * Set VITE_R2_PUBLIC_URL in your .env, e.g. https://pub-xxxx.r2.dev
 * Falls back to empty string so relative paths still resolve.
 */
export const r2BaseUrl = (import.meta.env.VITE_R2_PUBLIC_URL as string) ?? "";

/** Helper: turn an R2 storage key into a full URL */
export const r2Url = (key: string) =>
  key.startsWith("http") ? key : `${r2BaseUrl}/${key}`;
