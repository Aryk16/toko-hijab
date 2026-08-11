/*
Adds multi-image support for products.

The storefront still keeps `image_path` as the primary fallback image so older rows
continue to render correctly, while new uploads can populate `image_paths`.
*/

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS image_paths jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE products
SET image_paths = CASE
  WHEN image_paths IS NULL OR image_paths = '[]'::jsonb THEN
    CASE
      WHEN image_path IS NOT NULL THEN jsonb_build_array(image_path)
      ELSE '[]'::jsonb
    END
  ELSE image_paths
END;