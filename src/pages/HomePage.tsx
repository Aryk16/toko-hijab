import { ArrowRight } from 'lucide-react';
import { HeroSlider } from '@/components/HeroSlider';
import { ProductCard } from '@/components/ProductCard';
import { useSaleProducts, useFeaturedProducts, useEvents, useSiteSettings, useCategories } from '@/lib/hooks';
import { getPublicUrl } from '@/lib/supabase';
import { formatDate } from '@/lib/format';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const cities = ['Jakarta', 'Bekasi', 'Bandung', 'Surabaya', 'Medan', 'Bali', 'Tangerang', 'Depok', 'Bogor', 'Yogyakarta', 'Semarang', 'Lampung', 'Makasar', 'Palembang', 'Aceh', 'Lombok'];

export function HomePage({ onNavigate }: HomePageProps) {
  const { products: saleProducts } = useSaleProducts();
  const { products: featuredProducts } = useFeaturedProducts();
  const { events } = useEvents();
  const { settings } = useSiteSettings();
  const { categories } = useCategories();

  const items = categories.map((c) => c.name);

  const tickerPairs = Array.from({ length: 12 }, (_, i) => ({
    city: cities[i % cities.length],
    item: items.length > 0 ? items[i % items.length] : 'Kerudung / Hijab',
  }));

  return (
    <div>
      {/* Hero */}
      {settings?.hero_slides && settings.hero_slides.length > 0 ? (
        <HeroSlider slides={settings.hero_slides} />
      ) : (
        <div className="relative aspect-[1080/1350] w-full overflow-hidden bg-gradient-to-br from-primary-200 via-primary-100 to-secondary-100 sm:aspect-[1400/520]">
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center sm:p-8">
            <div>
              <h1 className="font-serif text-4xl font-bold text-primary-800 sm:text-5xl lg:text-6xl">
                Xavier Fashion Boutique&apos;s Collections
              </h1>
              <p className="mt-4 max-w-xl text-lg text-primary-600">
                Fashion Hijab milik semua orang — koleksi hijab berkualitas
                dengan desain inovatif.
              </p>
              <button
                onClick={() => onNavigate('/category/hijab')}
                className="btn-primary mt-8"
              >
                Belanja Sekarang <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* On Sale */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-primary-900">On Sale</h2>
          <p className="mt-2 text-primary-600">Produk dengan harga diskon spesial untuk Anda</p>
        </div>
        {saleProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary-200 py-16 text-center">
            <p className="text-lg font-medium text-primary-700">Belum ada produk yang sedang diskon.</p>
            <p className="mt-1 text-sm text-primary-500">Pantau terus untuk penawaran terbaik!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {saleProducts.map((p) => (
              <ProductCard key={p.id} product={p} onClick={() => onNavigate(`/product/${p.id}`)} />
            ))}
          </div>
        )}
      </section>

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <section className="bg-primary-100/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-serif text-3xl font-bold text-primary-900">Produk Unggulan</h2>
                <p className="mt-2 text-primary-600">Pilihan terbaik dari koleksi kami</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onClick={() => onNavigate(`/product/${p.id}`)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand story */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl font-bold text-primary-900">Tentang Xavier Fashion Boutique&apos;s</h2>
            <p className="mt-4 leading-relaxed text-primary-700">
              Xavier Fashion Boutique&apos;s lahir dari keyakinan bahwa <strong>Fashion Hijab</strong> itu milik semua
              orang, termasuk wanita Muslim. Wanita muslim juga tetap bisa berekspresi dan bergaya
              sesuai dengan karakter, kepribadian dan tren.
            </p>
            <p className="mt-4 leading-relaxed text-primary-700">
              Melalui Xavier Fashion Boutique&apos;s, kami menyajikan koleksi Kerudung / Hijab Segi Empat yang menjunjung
              nilai budaya Indonesia dan budaya Islam dalam satu kesatuan untuk melengkapi kebutuhan
              dasar Wanita Muslim yang berkualitas dan orisinalitas.
            </p>
            <p className="mt-4 leading-relaxed text-primary-700">
              Dengan menggabungkan desain yang inovatif dan teknologi tekstil terbaru, kami berkomitmen
              untuk selalu menghadirkan produk fashion hijab cantik yang nyaman dan cocok
              untuk digunakan sehari-hari oleh seluruh Wanita Muslim Indonesia.
            </p>
            <button onClick={() => onNavigate('/about')} className="btn-secondary mt-6">
              Selengkapnya <ArrowRight size={18} />
            </button>
          </div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-primary-200">
            <img
              src="https://images.pexels.com/photos/1078973/pexels-photo-1078973.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Hijab fashion"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Events */}
      {events.length > 0 && (
        <section className="bg-primary-100/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="font-serif text-3xl font-bold text-primary-900">Event & Bazaar</h2>
              <p className="mt-2 text-primary-600">Ikuti acara kami di berbagai kota</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.slice(0, 3).map((ev) => {
                const url = getPublicUrl(ev.image_path);
                return (
                  <div key={ev.id} className="card overflow-hidden">
                    <div className="aspect-video overflow-hidden bg-primary-200">
                      {url && <img src={url} alt={ev.title} className="h-full w-full object-cover" />}
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-medium text-accent-600">{formatDate(ev.event_date)}</p>
                      <h3 className="mt-1 font-serif text-lg font-semibold text-primary-900">{ev.title}</h3>
                      {ev.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-primary-600">{ev.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <button onClick={() => onNavigate('/events')} className="btn-secondary">
                Lihat semua event <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Social proof ticker */}
      <section className="overflow-hidden border-y border-primary-100 bg-white py-4">
        <div className="flex w-max animate-marquee gap-8">
          {[...tickerPairs, ...tickerPairs].map((pair, i) => (
            <div key={i} className="flex items-center gap-2 whitespace-nowrap text-sm text-primary-600">
              <span className="h-2 w-2 rounded-full bg-success-500"></span>
              <span>
                Pembeli dari <strong>{pair.city}</strong> membeli {pair.item}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram strip */}
      <section className="bg-primary-900 py-16 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-white">Follow Xavier Fashion Boutique&apos;s</h2>
          <p className="mt-2 text-primary-200">Ikuti kami di Instagram untuk inspirasi gaya terbaru</p>
          {settings?.instagram_url && (
            <a
              href={settings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent mt-6"
            >
              Xavier Fashion Boutique&apos;s <ArrowRight size={18} />
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
