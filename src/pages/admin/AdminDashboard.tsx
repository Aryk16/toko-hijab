import { useEffect, useState } from 'react';
import { Package, AlertCircle, FolderTree, CalendarDays, TrendingUp, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [stats, setStats] = useState({
    totalProducts: 0,
    soldOut: 0,
    categories: 0,
    events: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [p, s, c, e] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_sold_out', true),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        totalProducts: p.count ?? 0,
        soldOut: s.count ?? 0,
        categories: c.count ?? 0,
        events: e.count ?? 0,
      });
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    { label: 'Total Produk', value: stats.totalProducts, icon: Package, color: 'bg-primary-700', path: '/admin/products' },
    { label: 'Sold Out', value: stats.soldOut, icon: AlertCircle, color: 'bg-accent-500', path: '/admin/products' },
    { label: 'Kategori', value: stats.categories, icon: FolderTree, color: 'bg-secondary-600', path: '/admin/categories' },
    { label: 'Event', value: stats.events, icon: CalendarDays, color: 'bg-success-600', path: '/admin/events' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-serif text-2xl font-bold text-primary-900">Selamat Datang</h2>
        <p className="mt-1 text-primary-600">Ringkasan toko Xavier Fashion Boutique&apos;s Anda</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => onNavigate(card.path)}
              className="card p-5 text-left transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${card.color} text-white`}>
                <Icon size={20} />
              </div>
              {loading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-primary-100" />
              ) : (
                <p className="text-3xl font-bold text-primary-900">{card.value}</p>
              )}
              <p className="mt-1 text-sm text-primary-600">{card.label}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 card p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-primary-700" />
          <h3 className="font-serif text-lg font-semibold text-primary-900">Aksi Cepat</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => onNavigate('/admin/products')} className="btn-primary">
            <Package size={18} /> Kelola Produk
          </button>
          <button onClick={() => onNavigate('/admin/events')} className="btn-secondary">
            <CalendarDays size={18} /> Tambah Event
          </button>
          <button onClick={() => onNavigate('/admin/settings')} className="btn-secondary">
            <Settings size={18} /> Pengaturan Toko
          </button>
        </div>
      </div>
    </div>
  );
}


