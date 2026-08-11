import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, FolderTree } from 'lucide-react';
import { supabase, getPublicUrl } from '@/lib/supabase';
import { uploadImage } from '@/lib/upload';
import { DropZone } from '@/components/DropZone';
import type { Category } from '@/lib/types';

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  async function load() {
    const { data } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
    if (data) setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (data: Partial<Category>, file: File | null) => {
    let imagePath = editing?.image_path ?? null;
    if (file) {
      imagePath = await uploadImage(file, 'categories');
    }

    const payload = {
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      image_path: imagePath,
      sort_order: data.sort_order ?? 0,
    };

    if (editing) {
      await supabase.from('categories').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('categories').insert(payload);
    }

    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kategori ini? Semua produk di dalamnya juga akan dihapus.')) return;
    await supabase.from('categories').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary-900">Kelola Kategori</h2>
          <p className="mt-1 text-sm text-primary-600">{categories.length} kategori</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="btn-primary"
        >
          <Plus size={18} /> Tambah Kategori
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary-400" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const url = getPublicUrl(c.image_path);
            return (
              <div key={c.id} className="card overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden bg-primary-100">
                  {url ? (
                    <img src={url} alt={c.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-primary-300">
                      <FolderTree size={32} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-base font-semibold text-primary-900">{c.name}</h3>
                  <p className="mt-0.5 text-xs text-primary-500">/{c.slug}</p>
                  {c.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-primary-600">{c.description}</p>
                  )}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(c);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-1 rounded-lg bg-primary-100 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-200"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
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
        <CategoryForm
          category={editing}
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

interface CategoryFormProps {
  category: Category | null;
  onClose: () => void;
  onSave: (data: Partial<Category>, file: File | null) => Promise<void>;
}

function CategoryForm({ category, onClose, onSave }: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [sortOrder, setSortOrder] = useState(category?.sort_order?.toString() ?? '0');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(category ? getPublicUrl(category.image_path) : null);
  const [saving, setSaving] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const slugify = (s: string) =>
    s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(
      {
        name,
        slug: slug || slugify(name),
        description: description || null,
        sort_order: Number(sortOrder),
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
            {category ? 'Edit Kategori' : 'Tambah Kategori'}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-primary-500 hover:bg-primary-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary-800">Gambar Kategori</label>
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
            <label className="mb-1.5 block text-sm font-medium text-primary-800">Nama Kategori *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!category) setSlug(slugify(e.target.value));
              }}
              placeholder="Fashion Hijab"
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary-800">Slug (URL) *</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="hijab"
              className="input-field"
            />
            <p className="mt-1 text-xs text-primary-500">Digunakan di URL: /category/slug</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary-800">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary-800">Urutan</label>
            <input
              type="number"
              min="0"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
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
