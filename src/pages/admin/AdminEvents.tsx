import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, CalendarDays } from 'lucide-react';
import { supabase, getPublicUrl } from '@/lib/supabase';
import { uploadImage } from '@/lib/upload';
import { formatDate } from '@/lib/format';
import { DropZone } from '@/components/DropZone';
import type { EventItem } from '@/lib/types';

export function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);

  async function load() {
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false });
    if (data) setEvents(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (data: Partial<EventItem>, file: File | null) => {
    let imagePath = editing?.image_path ?? null;
    if (file) {
      imagePath = await uploadImage(file, 'events');
    }

    const payload = {
      title: data.title,
      description: data.description ?? null,
      image_path: imagePath,
      event_date: data.event_date || null,
    };

    if (editing) {
      await supabase.from('events').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('events').insert(payload);
    }

    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus event ini?')) return;
    await supabase.from('events').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary-900">Kelola Event</h2>
          <p className="mt-1 text-sm text-primary-600">{events.length} event</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="btn-primary"
        >
          <Plus size={18} /> Tambah Event
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary-400" />
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary-200 py-20 text-center">
          <CalendarDays size={48} className="text-primary-300" />
          <p className="mt-4 text-lg font-medium text-primary-700">Belum ada event.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => {
            const url = getPublicUrl(ev.image_path);
            return (
              <div key={ev.id} className="card overflow-hidden">
                <div className="relative aspect-video overflow-hidden bg-primary-100">
                  {url && <img src={url} alt={ev.title} className="h-full w-full object-cover" />}
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-accent-600">{formatDate(ev.event_date)}</p>
                  <h3 className="mt-1 font-serif text-base font-semibold text-primary-900">{ev.title}</h3>
                  {ev.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-primary-600">{ev.description}</p>
                  )}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(ev);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-1 rounded-lg bg-primary-100 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-200"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ev.id)}
                      className="flex items-center gap-1 rounded-lg bg-error-50 px-3 py-1.5 text-xs font-medium text-error-600 hover:bg-error-100"
                    >
                      <Trash2 size={12} /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <EventForm
          event={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

interface EventFormProps {
  event: EventItem | null;
  onClose: () => void;
  onSave: (data: Partial<EventItem>, file: File | null) => Promise<void>;
}

function EventForm({ event, onClose, onSave }: EventFormProps) {
  const [title, setTitle] = useState(event?.title ?? '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [eventDate, setEventDate] = useState(event?.event_date ?? '');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(event ? getPublicUrl(event.image_path) : null);
  const [saving, setSaving] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(
      {
        title,
        description: description || null,
        event_date: eventDate || null,
      },
      file,
    );
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-primary-100 bg-white px-6 py-4">
          <h3 className="font-serif text-lg font-semibold text-primary-900">
            {event ? 'Edit Event' : 'Tambah Event'}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-primary-500 hover:bg-primary-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary-800">Gambar Event</label>
            {preview ? (
              <div className="space-y-3">
                <div className="relative mx-auto h-44 w-full overflow-hidden rounded-xl border border-primary-200 bg-primary-100">
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute right-2 top-2 rounded-full bg-error-500 p-1.5 text-white shadow hover:bg-error-600"
                  >
                    <X size={14} />
                  </button>
                </div>
                <DropZone onFiles={(files) => files[0] && handleFile(files[0])} />
              </div>
            ) : (
              <DropZone onFiles={(files) => files[0] && handleFile(files[0])} />
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary-800">Judul Event *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ladies Day Bazaar Citos"
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary-800">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary-800">Tanggal Event</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="flex gap-3 border-t border-primary-100 pt-4">
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Menyimpan...
                </>
              ) : (
                'Simpan'
              )}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
