import { CalendarDays } from 'lucide-react';
import { useEvents } from '@/lib/hooks';
import { getPublicUrl } from '@/lib/supabase';
import { formatDate } from '@/lib/format';

export function EventsPage() {
  const { events, loading } = useEvents();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold text-primary-900">Event & Bazaar</h1>
        <p className="mt-2 text-primary-600">Ikuti acara kami di berbagai kota</p>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-video animate-pulse rounded-2xl bg-primary-100" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary-200 py-20 text-center">
          <CalendarDays size={48} className="text-primary-300" />
          <p className="mt-4 text-lg font-medium text-primary-700">Belum ada event yang dijadwalkan.</p>
          <p className="mt-1 text-sm text-primary-500">Pantau terus untuk update terbaru.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => {
            const url = getPublicUrl(ev.image_path);
            return (
              <div key={ev.id} className="card overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="aspect-video overflow-hidden bg-primary-200">
                  {url && <img src={url} alt={ev.title} className="h-full w-full object-cover" />}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs font-medium text-accent-600">
                    <CalendarDays size={14} />
                    {formatDate(ev.event_date)}
                  </div>
                  <h3 className="mt-2 font-serif text-xl font-semibold text-primary-900">{ev.title}</h3>
                  {ev.description && (
                    <p className="mt-2 text-sm leading-relaxed text-primary-600">{ev.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
