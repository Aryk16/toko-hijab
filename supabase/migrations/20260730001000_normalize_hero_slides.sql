/*
Normalizes legacy hero slide JSON to support separate desktop and mobile images.
*/

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