/*
# Fix RLS Policies — Proper Admin Isolation

Previously, all "admin" write policies used a bare `TO authenticated` with
`USING (true)`, meaning **any** authenticated user (not just admins) could
modify, delete, or insert storefront data.

This migration:

1. Creates an `admin_users` table to track which authenticated users are
   actually admins.
2. Drops all the old leaky policies and recreates them with a proper
   admin check via `is_admin()`.
3. Tightens the `product-images` storage policy so only admins can list
   bucket contents (the bucket is public, so individual file URLs still
   work without any RLS policy — only LIST operations are gated now).

## Post-migration step

After applying this migration you must seed the `admin_users` table with
your existing admin account(s).  Run this in the Supabase SQL Editor:

    INSERT INTO admin_users (user_id)
    SELECT id FROM auth.users WHERE email = 'your-admin@example.com';
*/

-- ================================================================
-- 1. Admin users table
-- ================================================================
CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can see who the admins are (prevents enumeration)
CREATE POLICY "admin_read_admin_users" ON admin_users
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ================================================================
-- 2. Helper function: is the current user an admin?
-- ================================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$;

-- ================================================================
-- 3. Fix categories policies
-- ================================================================
DROP POLICY IF EXISTS "admin_insert_categories" ON categories;
CREATE POLICY "admin_insert_categories" ON categories
  FOR INSERT TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_categories" ON categories;
CREATE POLICY "admin_update_categories" ON categories
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_categories" ON categories;
CREATE POLICY "admin_delete_categories" ON categories
  FOR DELETE TO authenticated USING (is_admin());

-- ================================================================
-- 4. Fix products policies
-- ================================================================
DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products" ON products
  FOR INSERT TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products" ON products
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products" ON products
  FOR DELETE TO authenticated USING (is_admin());

-- ================================================================
-- 5. Fix events policies
-- ================================================================
DROP POLICY IF EXISTS "admin_insert_events" ON events;
CREATE POLICY "admin_insert_events" ON events
  FOR INSERT TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_events" ON events;
CREATE POLICY "admin_update_events" ON events
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_events" ON events;
CREATE POLICY "admin_delete_events" ON events
  FOR DELETE TO authenticated USING (is_admin());

-- ================================================================
-- 6. Fix site_settings policies
-- ================================================================
DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings" ON site_settings
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ================================================================
-- 7. Fix storage — restrict listing to admins only
--    The bucket is `public = true` so individual file URLs work
--    without any SELECT policy.  Only LIST (browsing) is gated.
-- ================================================================
DROP POLICY IF EXISTS "public_read_product_images" ON storage.objects;
CREATE POLICY "public_read_product_images" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'product-images' AND is_admin());
