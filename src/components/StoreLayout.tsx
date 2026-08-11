import { useState, useEffect, type ReactNode } from 'react';
import { Menu, X, ShoppingBag, Phone, MapPin, Instagram } from 'lucide-react';
import { useCategories, useSiteSettings, useEvents } from '@/lib/hooks';

interface LayoutProps {
  children: ReactNode;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export function StoreLayout({ children, onNavigate, currentPath }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { categories } = useCategories();
  const { settings } = useSiteSettings();
  const { events } = useEvents();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Koleksi Hijab', path: '/hijab' },
    { label: 'About', path: '/about' },
    ...(events.length > 0 ? [{ label: 'Events', path: '/events' }] : []),
  ];

  const go = (path: string) => {
    onNavigate(path);
    setMobileOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 shadow-md backdrop-blur' : 'bg-primary-50/80 backdrop-blur'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button onClick={() => go('/')} className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-primary-800">Xavier Fashion Boutique's</span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => go(item.path)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  currentPath === item.path
                    ? 'bg-primary-700 text-primary-50'
                    : 'text-primary-800 hover:bg-primary-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => go('/admin')}
              className="hidden rounded-full border border-primary-300 px-4 py-2 text-sm font-medium text-primary-800 transition-colors hover:bg-primary-100 sm:block"
            >
              Admin
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-full p-2 text-primary-800 hover:bg-primary-100 lg:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-primary-100 bg-white lg:hidden">
            <nav className="flex flex-col gap-1 px-4 py-3">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => go(item.path)}
                  className={`rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                    currentPath === item.path
                      ? 'bg-primary-700 text-primary-50'
                      : 'text-primary-800 hover:bg-primary-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => go('/admin')}
                className="rounded-lg px-4 py-3 text-left text-sm font-medium text-primary-800 hover:bg-primary-100"
              >
                Admin Login
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary-900 text-primary-100">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="font-serif text-2xl font-bold text-white">Xavier Fashion Boutique's</span>
              </div>
              <p className="text-sm leading-relaxed text-primary-200">
                Fashion Hijab milik semua orang. Kami menyajikan koleksi hijab berkualitas
                dengan desain inovatif dan teknologi tekstil terbaru.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-serif text-lg font-semibold text-white">Hubungi Kami</h3>
              <ul className="space-y-3 text-sm">
                {settings?.whatsapp_cs && (
                  <li className="flex items-center gap-2">
                    <Phone size={16} className="text-accent-400" />
                    <span>CS: {settings.whatsapp_cs}</span>
                  </li>
                )}
                {settings?.whatsapp_reseller && (
                  <li className="flex items-center gap-2">
                    <Phone size={16} className="text-accent-400" />
                    <span>Open Reseller: {settings.whatsapp_reseller}</span>
                  </li>
                )}
                {settings?.store_address && (
                  <li className="flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-accent-400" />
                    <span>{settings.store_address}</span>
                  </li>
                )}
                {settings?.instagram_url && (
                  <li>
                    <a
                      href={settings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-white"
                    >
                      <Instagram size={16} className="text-accent-400" />
                      <span>Xavier Fashion Boutique's</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-serif text-lg font-semibold text-white">Kategori</h3>
              <ul className="space-y-2 text-sm">
                {categories.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => go(`/category/${c.slug}`)}
                      className="text-primary-200 hover:text-white"
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-primary-800 pt-6 text-center text-xs text-primary-300">
            &copy; {new Date().getFullYear()} Xavier Fashion Boutique's. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      {settings?.whatsapp_cs && (
        <a
          href={`https://wa.me/${settings.whatsapp_cs}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-success-500 text-white shadow-lg transition-transform hover:scale-110"
          aria-label="Chat via WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.89-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>
      )}
    </div>
  );
}

export { ShoppingBag };
