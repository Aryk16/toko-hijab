import { ArrowRight } from 'lucide-react';
import { useCategories } from '@/lib/hooks';
import { getPublicUrl } from '@/lib/supabase';
import type { Category } from '@/lib/types';

interface HijabPageProps {
  onNavigate: (path: string) => void;
}

export function HijabPage({ onNavigate }: HijabPageProps) {
  const { categories, loading } = useCategories();

  return (
    <div>
      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-primary-900">Koleksi Kami</h2>
          <p className="mt-2 text-primary-600">Temukan gaya hijab yang sesuai dengan karakter Anda</p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-primary-100" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat: Category) => {
              const url = getPublicUrl(cat.image_path);
              return (
                <button
                  key={cat.id}
                  onClick={() => onNavigate(`/category/${cat.slug}`)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-primary-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  {url ? (
                    <img
                      src={url}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-200 to-secondary-200">
                      <span className="font-serif text-2xl font-bold text-primary-700">{cat.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                    <h3 className="font-serif text-2xl font-bold text-white drop-shadow-lg">{cat.name}</h3>
                    <span className="mt-2 inline-flex items-center gap-1 text-sm text-white/90">
                      Lihat koleksi <ArrowRight size={14} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
