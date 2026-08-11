/*
# Xavier Fashion Boutique's Storefront Schema

Creates the full data model for the Xavier Fashion Boutique's storefront and admin dashboard.

## 1. New Tables

### categories
Stores the three main product categories (Hijab, Apparels, Accessories).
- `id` (uuid, primary key)
- `name` (text, not null) — display name, e.g. "Fashion Hijab"
- `slug` (text, unique, not null) — URL-safe identifier, e.g. "hijab"
- `description` (text) — optional longer description
- `image_path` (text) — path to the category showcase image in Supabase Storage
- `sort_order` (int, default 0) — controls display order
- `created_at` (timestamptz)

### products
Stores each product shown on the storefront.
- `id` (uuid, primary key)
- `name` (text, not null)
- `description` (text)
- `price` (bigint, not null) — original price in Indonesian Rupiah
- `sale_price` (bigint) — optional discounted price in Rupiah; null means no discount
- `category_id` (uuid, foreign key → categories.id, cascade delete)
- `image_path` (text) — path to the product image in Supabase Storage
- `shopee_url` (text) — optional Shopee product link used for checkout
- `is_sold_out` (boolean, default false) — shows a "Sold Out" badge when true
- `is_featured` (boolean, default false) — surfaces the product on the homepage
- `sort_order` (int, default 0)
- `created_at` (timestamptz)

### events
Stores bazaar / pop-up event entries shown on the Events page.
- `id` (uuid, primary key)
- `title` (text, not null)
- `description` (text)
- `image_path` (text) — path to the event image in Supabase Storage
- `event_date` (date) — when the event took place
- `created_at` (timestamptz)

### site_settings
A single-row table holding editable store-wide configuration.
- `id` (int, primary key, always 1)
- `whatsapp_cs` (text) — WhatsApp number for customer service
- `whatsapp_reseller` (text) — WhatsApp number for reseller inquiries
- `store_address` (text) — physical store address
- `instagram_url` (text) — Instagram profile link
- `hero_slides` (jsonb) — array of {image_path, title} objects for the homepage hero slider
- `updated_at` (timestamptz)

## 2. Security

All tables have RLS enabled.
- Public (anon, authenticated) can READ all storefront data (categories, products, events, site_settings).
- Only authenticated admins can INSERT, UPDATE, and DELETE on categories, products, and events.
- Only authenticated admins can UPDATE site_settings (no insert/delete needed since the row is seeded).
- This is a signed-in admin app: write policies are scoped `TO authenticated` with ownership implied by having a valid session. Since admin accounts are created manually in the Supabase dashboard, any authenticated user is considered an admin.

## 3. Seed Data

- Inserts the three default categories (Hijab, Apparels, Accessories).
- Inserts a single site_settings row with default WhatsApp numbers and an empty hero_slides array.

## 4. Important Notes

1. Prices use `bigint` (not `numeric`) because Rupiah amounts are whole numbers and bigint avoids floating-point issues while staying JSON-safe.
2. `sale_price` is nullable — null means "no discount". The storefront checks for a non-null value to show the struck-through original price.
3. The `site_settings` table is constrained to a single row via a CHECK on `id = 1`.
4. Image columns store the Storage object PATH (not a public URL). The frontend builds the public URL from the path so we never duplicate URL logic in the database.
*/

-- ---------- categories ----------
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_path text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_categories" ON categories;
CREATE POLICY "admin_insert_categories" ON categories
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_categories" ON categories;
CREATE POLICY "admin_update_categories" ON categories
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_categories" ON categories;
CREATE POLICY "admin_delete_categories" ON categories
  FOR DELETE TO authenticated USING (true);

-- ---------- products ----------
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price bigint NOT NULL DEFAULT 0,
  sale_price bigint,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  image_path text,
  image_paths jsonb NOT NULL DEFAULT '[]'::jsonb,
  shopee_url text,
  is_sold_out boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products" ON products
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products" ON products
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products" ON products
  FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);

-- ---------- events ----------
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_path text,
  event_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_events" ON events;
CREATE POLICY "public_read_events" ON events
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_events" ON events;
CREATE POLICY "admin_insert_events" ON events
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_events" ON events;
CREATE POLICY "admin_update_events" ON events
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_events" ON events;
CREATE POLICY "admin_delete_events" ON events
  FOR DELETE TO authenticated USING (true);

-- ---------- site_settings ----------
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1,
  whatsapp_cs text,
  whatsapp_reseller text,
  store_address text,
  instagram_url text,
  hero_slides jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_single_row CHECK (id = 1)
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings" ON site_settings
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- ---------- seed data ----------
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Fashion Hijab', 'hijab', 'Hijab Segi Empat, Printed Scarf, Voal Plain, dan Hijab Syar''i', 1),
  ('Busana Muslim', 'apparels', 'Busana Muslim Modern Kekinian — Dress, Shirt, Vest, dan set lainnya', 2),
  ('Accessories', 'accessories', 'Aksesoris pelengkap gaya wanita muslim', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO site_settings (id, whatsapp_cs, whatsapp_reseller, store_address, instagram_url, hero_slides)
VALUES (
  1,
  '6281807497777',
  '6281807487777',
  'Ruko Puri Dago no. A3, Jl. Terusan Jakarta, Antapani, Bandung 40293, Jawa Barat - Indonesia',
  'https://instagram.com/xavierfashionboutiques',
  '[]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

UPDATE site_settings
SET hero_slides = (
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'title', slide->>'title',
      'image_path', COALESCE(slide->>'image_path', slide->>'desktop_image_path', slide->>'mobile_image_path'),
      'desktop_image_path', COALESCE(slide->>'desktop_image_path', slide->>'image_path', slide->>'mobile_image_path'),
      'mobile_image_path', COALESCE(slide->>'mobile_image_path', slide->>'image_path', slide->>'desktop_image_path')
    )
  ), '[]'::jsonb)
  FROM jsonb_array_elements(hero_slides) AS slide
)
WHERE hero_slides IS NOT NULL;
