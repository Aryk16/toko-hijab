import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { useProducts, useCategories } from '@/lib/hooks';
import type { Category } from '@/lib/types';

interface CategoryPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

type SortKey = 'newest' | 'price-asc' | 'price-desc';

export function CategoryPage({ slug, onNavigate }: CategoryPageProps) {
  const { products, loading } = useProducts(slug);
  const { categories } = useCategories();
  const [sort, setSort] = useState<SortKey>('newest');

  const category = categories.find((c: Category) => c.slug === slug);

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc') return (a.sale_price ?? a.price) - (b.sale_price ?? b.price);
    if (sort === 'price-desc') return (b.sale_price ?? b.price) - (a.sale_price ?? a.price);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-primary-500">
        <button onClick={() => onNavigate('/')} className="hover:text-primary-800">Home</button>
        <span>/</span>
        <span className="text-primary-800">{category?.name ?? 'Kategori'}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-primary-900">{category?.name ?? 'Kategori'}</h1>
        {category?.description && <p className="mt-2 text-primary-600">{category.description}</p>}
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-primary-600">{sorted.length} produk</p>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-primary-500" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-primary-200 bg-white px-3 py-2 text-sm text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            <option value="newest">Terbaru</option>
            <option value="price-asc">Harga Terendah</option>
            <option value="price-desc">Harga Tertinggi</option>
          </select>
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-primary-100" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary-200 py-20 text-center">
          <p className="text-lg font-medium text-primary-700">Belum ada produk di kategori ini.</p>
          <p className="mt-1 text-sm text-primary-500">Silakan kembali lagi nanti.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} onClick={() => onNavigate(`/product/${p.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
