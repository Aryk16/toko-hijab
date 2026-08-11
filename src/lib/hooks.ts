import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { Category, Product, EventItem, SiteSettings } from './types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setCategories(data);
        setLoading(false);
      });
  }, []);

  return { categories, loading };
}

export function useProducts(categorySlug?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categorySlug) {
      supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle()
        .then(({ data: cat }) => {
          if (!cat) {
            setLoading(false);
            return;
          }
          supabase
            .from('products')
            .select('*')
            .eq('category_id', cat.id)
            .order('sort_order', { ascending: true })
            .then(({ data, error }) => {
              if (!error && data) setProducts(data);
              setLoading(false);
            });
        });
    } else {
      supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })
        .then(({ data, error }) => {
          if (!error && data) setProducts(data);
          setLoading(false);
        });
    }
  }, [categorySlug]);

  return { products, loading };
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setProducts(data);
        setLoading(false);
      });
  }, []);

  return { products, loading };
}

export function useSaleProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .not('sale_price', 'is', null)
      .gt('sale_price', 0)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setProducts(data.filter((p) => p.sale_price! < p.price));
        }
        setLoading(false);
      });
  }, []);

  return { products, loading };
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) setProduct(data);
        setLoading(false);
      });
  }, [id]);

  return { product, loading };
}

export function useEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setEvents(data);
        setLoading(false);
      });
  }, []);

  return { events, loading };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) setSettings(data);
        setLoading(false);
      });
  }, []);

  return { settings, loading };
}
