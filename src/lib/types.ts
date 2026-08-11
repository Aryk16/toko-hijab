export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_path: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  category_id: string | null;
  image_path: string | null;
  image_paths: string[] | null;
  shopee_url: string | null;
  is_sold_out: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string | null;
  image_path: string | null;
  event_date: string | null;
  created_at: string;
}

export interface HeroSlide {
  title: string;
  image_path?: string | null;
  desktop_image_path?: string | null;
  mobile_image_path?: string | null;
}

export interface SiteSettings {
  id: number;
  whatsapp_cs: string | null;
  whatsapp_reseller: string | null;
  store_address: string | null;
  instagram_url: string | null;
  hero_slides: HeroSlide[];
  updated_at: string;
}

export type ProductInput = Omit<Product, 'id' | 'created_at'>;
export type CategoryInput = Omit<Category, 'id' | 'created_at'>;
export type EventInput = Omit<EventItem, 'id' | 'created_at'>;
