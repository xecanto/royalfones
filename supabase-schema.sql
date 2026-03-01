-- ═══════════════════════════════════════════════════════
--  Royal Fones — Supabase Schema
--  Run this in the Supabase SQL Editor to create the table.
-- ═══════════════════════════════════════════════════════

-- Enable UUID generation (already enabled on Supabase by default)
create extension if not exists "pgcrypto";

-- ─── Products ───────────────────────────────────────────
create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  name             text        not null,
  subtitle         text        not null default '',
  -- Cloudflare R2 storage key OR full https URL
  image_url        text        not null,
  -- Additional gallery images (R2 keys or full URLs)
  gallery_urls     text[]      default '{}',
  base_price_aed   numeric     not null,
  is_negotiable    boolean     not null default false,
  edition          text        not null default 'Bespoke',
  materials        text[]      not null default '{}',
  description      text,
  category         text,            -- Gold | Platinum | Diamond | Exotic | Marble | Accessories
  is_featured      boolean     not null default false,
  -- Number of pieces in this limited run (null = unlimited / made-to-order)
  limited_qty      integer,
  created_at       timestamptz not null default now()
);

-- ─── Row-Level Security  (allow public read, restrict writes) ──
alter table public.products enable row level security;

-- Anyone can read products
create policy "Public read" on public.products
  for select using (true);

-- Only authenticated users (admin) can insert / update / delete
create policy "Admin insert" on public.products
  for insert to authenticated with check (true);

create policy "Admin update" on public.products
  for update to authenticated using (true);

create policy "Admin delete" on public.products
  for delete to authenticated using (true);

-- ─── Sample seed data (mirrors the local fallback in use-products.ts) ──
insert into public.products
  (name, subtitle, image_url, base_price_aed, is_negotiable, edition, materials, description, category, is_featured, limited_qty)
values
  (
    'Graphite 24KT Gold Edition',
    'iPhone 17 Pro Max',
    'products/gold-edition.jpg',   -- replace with actual R2 key or URL
    8500, false,
    'Limited to 33 pieces',
    array['24KT Pure Gold', 'Sapphire Glass'],
    'The pinnacle of mobile luxury — our Graphite 24KT Gold Edition transforms the iPhone 17 Pro Max into a wearable work of art. Every surface is meticulously hand-plated in genuine 24-carat gold by master artisans, complemented by hand-polished sapphire-crystal glass accents. Limited to just 33 individually numbered pieces worldwide.',
    'Gold', true, 33
  ),
  (
    'Platinum Rhodium Blue',
    'iPhone 17 Pro Max',
    'products/platinum-rhodium.jpg',
    12000, true,
    'Bespoke',
    array['Platinum', 'Rhodium Finish'],
    'A symphony in cool metal — our Platinum Rhodium Blue edition wraps the iPhone 17 Pro Max in pure platinum, then hand-dipped in a mirror-polished rhodium finish for an otherworldly silver-blue sheen. Made entirely to order.',
    'Platinum', true, null
  ),
  (
    'Crocodile Leather & Gold',
    'iPhone 17 Pro Max',
    'products/croc-gold.jpg',
    15000, true,
    'Limited to 10 pieces',
    array['Exotic Crocodile', '24KT Gold Trim'],
    'Where nature''s rarest materials meet royal goldsmithing — genuine Nile crocodile leather hand-stitched with silk thread, framed in solid 24KT gold trim. Each hide is unique; no two pieces are identical. Strictly limited to 10 pieces.',
    'Exotic', true, 10
  ),
  (
    'Nero Marble Edition',
    'iPhone 17 Pro Max',
    'products/nero-marble.jpg',
    9500, false,
    'Limited to 50 pieces',
    array['Italian Marble Effect', 'Gold Accents'],
    'Cold Italian marble elegance meets warm gold — a deep Nero Marquina marble-effect finish with hand-engraved 24KT gold-veined accents. Bold, architectural, timeless. Limited to 50 pieces.',
    'Marble', true, 50
  ),
  (
    'Gold Luxe Accessories',
    'Apple Watch Ultra + AirPods Pro',
    'products/accessories.jpg',
    6500, true,
    'Made to Order',
    array['24KT Gold Plating'],
    'Complete your Royal Fones ensemble — our Gold Luxe set brings the same museum-grade 24KT gold plating to your Apple Watch Ultra and AirPods Pro. Made entirely to order.',
    'Accessories', false, null
  ),
  (
    'Rose Gold Diamond',
    'iPhone 17 Pro Max',
    'products/rose-gold-diamond.jpg',
    22000, true,
    'Limited to 7 pieces',
    array['18KT Rose Gold', 'VS Diamond Pavé'],
    'Our most opulent creation — an 18-carat rose gold body studded with 47 VS-clarity diamonds set in pavé on the camera ring and side rails. An heirloom to be worn, not merely carried. Limited to 7 pieces globally.',
    'Diamond', true, 7
  );
