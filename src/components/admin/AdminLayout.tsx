import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  CalendarDays,
  SlidersHorizontal,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface AdminLayoutProps {
  children: ReactNode;
  currentSection: string;
  onNavigate: (path: string) => void;
}

const sections = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { id: 'products', label: 'Produk', icon: Package, path: '/admin/products' },
  { id: 'categories', label: 'Kategori', icon: FolderTree, path: '/admin/categories' },
  { id: 'hero-slider', label: 'Kelola Hero Slider', icon: SlidersHorizontal, path: '/admin/hero-slider' },
  { id: 'events', label: 'Event', icon: CalendarDays, path: '/admin/events' },
  { id: 'settings', label: 'Pengaturan', icon: Settings, path: '/admin/settings' },
];

export function AdminLayout({ children, currentSection, onNavigate }: AdminLayoutProps) {
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const go = (path: string) => {
    onNavigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-primary-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-primary-900 text-primary-100 transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold text-white">Xavier Fashion Boutique's</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-primary-300 hover:text-white lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => go(s.path)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    currentSection === s.id
                      ? 'bg-primary-700 text-white'
                      : 'text-primary-200 hover:bg-primary-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {s.label}
                </button>
              );
            })}
          </nav>

          <div className="space-y-1 px-3 py-4">
            <button
              onClick={() => go('/')}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary-200 hover:bg-primary-800 hover:text-white"
            >
              <Store size={18} /> Lihat Toko
            </button>
            <button
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary-200 hover:bg-error-700 hover:text-white"
            >
              <LogOut size={18} /> Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-primary-100 bg-white px-4 py-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-primary-700 hover:bg-primary-100 lg:hidden"
          >
            <Menu size={22} />
          </button>
          <h1 className="font-serif text-xl font-bold text-primary-900">
            {sections.find((s) => s.id === currentSection)?.label ?? 'Admin'}
          </h1>
          <div className="w-10 lg:hidden" />
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
