import { useEffect, useMemo, useState } from 'react';
import { ShoppingBag, ArrowLeft, ExternalLink, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProduct, useCategories, useSiteSettings } from '@/lib/hooks';
import { getPublicUrl } from '@/lib/supabase';
import { formatRupiah } from '@/lib/format';

interface ProductDetailPageProps {
  id: string;
  onNavigate: (path: string) => void;
}

export function ProductDetailPage({ id, onNavigate }: ProductDetailPageProps) {
  const { product, loading } = useProduct(id);
  const { categories } = useCategories();
  const { settings } = useSiteSettings();
  const [currentImage, setCurrentImage] = useState(0);

  const images = useMemo(() => {
    if (!product) return [];
    const paths = product.image_paths?.length
      ? product.image_paths
      : product.image_path
        ? [product.image_path]
        : [];
    return Array.from(new Set(paths)).filter(Boolean);
  }, [product]);

  useEffect(() => {
    setCurrentImage(0);
  }, [id]);

  const currentImageUrl = images.length > 0 ? getPublicUrl(images[currentImage]) : null;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-[3/4] animate-pulse rounded-2xl bg-primary-100" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-primary-100" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-primary-100" />
            <div className="h-24 w-full animate-pulse rounded bg-primary-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-lg font-medium text-primary-700">Produk tidak ditemukan.</p>
        <button onClick={() => onNavigate('/')} className="btn-secondary mt-6">
          <ArrowLeft size={18} /> Kembali ke Home
        </button>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.category_id);
  const hasSale = product.sale_price != null && product.sale_price > 0 && product.sale_price < product.price;
  const displayPrice = hasSale ? product.sale_price! : product.price;
  const waNumber = settings?.whatsapp_cs;
  const waMessage = encodeURIComponent(`Halo, saya ingin memesan: ${product.name}`);
  const waLink = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-primary-500">
        <button onClick={() => onNavigate('/')} className="hover:text-primary-800">Home</button>
        <span>/</span>
        {category && (
          <>
            <button onClick={() => onNavigate(`/category/${category.slug}`)} className="hover:text-primary-800">
              {category.name}
            </button>
            <span>/</span>
          </>
        )}
        <span className="text-primary-800 line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-primary-100 shadow-sm">
            {currentImageUrl ? (
              <img src={currentImageUrl} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-primary-300">
                <ShoppingBag size={48} />
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((index) => (index - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-primary-800 shadow-md backdrop-blur hover:bg-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentImage((index) => (index + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-primary-800 shadow-md backdrop-blur hover:bg-white"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            {product.is_sold_out && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="rounded-full bg-white px-6 py-2 text-sm font-bold uppercase tracking-wide text-error-600">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((imagePath, index) => {
                const thumbnailUrl = getPublicUrl(imagePath);
                const isActive = index === currentImage;
                return (
                  <button
                    key={`${imagePath}-${index}`}
                    onClick={() => setCurrentImage(index)}
                    className={`relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      isActive ? 'border-primary-700 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`Preview image ${index + 1}`}
                  >
                    {thumbnailUrl ? (
                      <img src={thumbnailUrl} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary-100 text-primary-300">
                        <ShoppingBag size={20} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {category && (
            <span className="mb-2 inline-block w-fit rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
              {category.name}
            </span>
          )}
          <h1 className="font-serif text-3xl font-bold text-primary-900 sm:text-4xl">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-primary-800">{formatRupiah(displayPrice)}</span>
            {hasSale && (
              <span className="text-lg text-primary-400 line-through">{formatRupiah(product.price)}</span>
            )}
          </div>

          {product.description && (
            <div className="mt-6">
              <h2 className="mb-2 font-serif text-lg font-semibold text-primary-900">Deskripsi</h2>
              <p className="leading-relaxed text-primary-700 whitespace-pre-line">{product.description}</p>
            </div>
          )}

          <div className="mt-auto pt-8">
            {product.is_sold_out ? (
              <div className="rounded-xl bg-primary-100 px-6 py-4 text-center text-sm font-medium text-primary-600">
                Maaf, produk ini sedang habis.
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                {product.shopee_url ? (
                  <a
                    href={product.shopee_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent flex-1"
                  >
                    <ExternalLink size={18} /> Beli di Shopee
                  </a>
                ) : null}
                {waLink && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={product.shopee_url ? 'btn-secondary flex-1' : 'btn-accent flex-1'}
                  >
                    <MessageCircle size={18} /> Pesan via WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
