import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/types';
import { getPublicUrl } from '@/lib/supabase';
import { formatRupiah } from '@/lib/format';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const primaryImagePath = product.image_paths?.[0] ?? product.image_path;
  const imageUrl = getPublicUrl(primaryImagePath);
  const hasSale = product.sale_price != null && product.sale_price > 0 && product.sale_price < product.price;
  const displayPrice = hasSale ? product.sale_price! : product.price;

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-primary-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary-300">
            <ShoppingBag size={32} />
          </div>
        )}
        {product.is_sold_out && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-error-600">
              Sold Out
            </span>
          </div>
        )}
        {hasSale && !product.is_sold_out && (
          <span className="absolute left-3 top-3 rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white">
            Sale
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-base font-semibold text-primary-900 line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm font-bold text-primary-800">{formatRupiah(displayPrice)}</span>
          {hasSale && (
            <span className="text-xs text-primary-400 line-through">{formatRupiah(product.price)}</span>
          )}
        </div>
      </div>
    </button>
  );
}
