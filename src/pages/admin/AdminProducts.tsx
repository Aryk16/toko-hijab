import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, Star, Package } from 'lucide-react';
import { supabase, getPublicUrl } from '@/lib/supabase';
import { uploadImage } from '@/lib/upload';
import { formatRupiah } from '@/lib/format';
import { DropZone } from '@/components/DropZone';
import type { Product, Category } from '@/lib/types';

type ProductImageItem =
  | { kind: 'existing'; path: string }
  | { kind: 'new'; file: File; preview: string };

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');

  function load() {
    Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
    ]).then(([p, c]) => {
      if (p.data) setProducts(p.data);
      if (c.data) setCategories(c.data);
      setLoading(false);
    });
  }

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (data: Partial<Product>) => {
    const imagePaths = data.image_paths ?? editing?.image_paths ?? (editing?.image_path ? [editing.image_path] : []);
    const primaryImagePath = imagePaths[0] ?? null;

    const payload = {
      name: data.name,
      description: data.description ?? null,
      price: Number(data.price),
      sale_price: data.sale_price ? Number(data.sale_price) : null,
      category_id: data.category_id ?? null,
      image_path: primaryImagePath,
      image_paths: imagePaths,
      shopee_url: data.shopee_url || null,
      is_sold_out: data.is_sold_out ?? false,
      is_featured: data.is_featured ?? false,
      sort_order: data.sort_order ?? 0,
    };

    if (editing) {
      await supabase.from('products').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('products').insert(payload);
    }

    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus produk ini? Tindakan ini tidak bisa dibatalkan.')) return;
    await supabase.from('products').delete().eq('id', id);
    load();
  };

  const toggleSoldOut = async (p: Product) => {
    await supabase.from('products').update({ is_sold_out: !p.is_sold_out }).eq('id', p.id);
    load();
  };

  const toggleFeatured = async (p: Product) => {
    await supabase.from('products').update({ is_featured: !p.is_featured }).eq('id', p.id);
    load();
  };

  const filteredProducts = filterCategory
    ? products.filter((p) => p.category_id === filterCategory)
    : products;
  const activeCategory = categories.find((c) => c.id === filterCategory);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary-900">Kelola Produk</h2>
          <p className="mt-1 text-sm text-primary-600">
            {activeCategory
              ? `${filteredProducts.length} produk di kategori ${activeCategory.name}`
              : `${products.length} produk total`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input-field w-auto"
            aria-label="Filter berdasarkan kategori"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="btn-primary"
          >
            <Plus size={18} /> Tambah Produk
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary-400" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary-200 py-20 text-center">
          <Package size={48} className="text-primary-300" />
          <p className="mt-4 text-lg font-medium text-primary-700">
            {filterCategory ? 'Belum ada produk di kategori ini.' : 'Belum ada produk.'}
          </p>
          <p className="mt-1 text-sm text-primary-500">Klik "Tambah Produk" untuk mulai.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((p) => {
            const url = getPublicUrl(p.image_path);
            const hasSale = p.sale_price != null && p.sale_price > 0 && p.sale_price < p.price;
            return (
              <div key={p.id} className="card overflow-hidden">
                <div className="relative aspect-[3/4] overflow-hidden bg-primary-100">
                  {url ? (
                    <img src={url} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-primary-300">
                      <Package size={32} />
                    </div>
                  )}
                  {p.is_sold_out && (
                    <span className="absolute right-2 top-2 rounded-full bg-error-500 px-2 py-0.5 text-xs font-bold text-white">
                      Sold Out
                    </span>
                  )}
                  {p.is_featured && (
                    <span className="absolute left-2 top-2 rounded-full bg-warning-400 px-2 py-0.5 text-xs font-bold text-white">
                      <Star size={10} className="inline" /> Featured
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-base font-semibold text-primary-900 line-clamp-1">{p.name}</h3>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-sm font-bold text-primary-800">
                      {formatRupiah(hasSale ? p.sale_price! : p.price)}
                    </span>
                    {hasSale && (
                      <span className="text-xs text-primary-400 line-through">{formatRupiah(p.price)}</span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setEditing(p);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-1 rounded-lg bg-primary-100 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-200"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => toggleSoldOut(p)}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium ${
                        p.is_sold_out
                          ? 'bg-success-100 text-success-700 hover:bg-success-200'
                          : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
                      }`}
                    >
                      {p.is_sold_out ? 'Tersedia' : 'Sold Out'}
                    </button>
                    <button
                      onClick={() => toggleFeatured(p)}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium ${
                        p.is_featured
                          ? 'bg-warning-100 text-warning-700 hover:bg-warning-200'
                          : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                      }`}
                    >
                      <Star size={12} /> {p.is_featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
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
        <ProductForm
          product={editing}
          categories={categories}
          defaultCategoryId={editing ? undefined : filterCategory}
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

interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  defaultCategoryId?: string;
  onClose: () => void;
  onSave: (data: Partial<Product>) => Promise<void>;
}

function ProductForm({ product, categories, defaultCategoryId, onClose, onSave }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.price?.toString() ?? '');
  const [salePrice, setSalePrice] = useState(product?.sale_price?.toString() ?? '');
  const [categoryId, setCategoryId] = useState(product?.category_id ?? defaultCategoryId ?? '');
  const [shopeeUrl, setShopeeUrl] = useState(product?.shopee_url ?? '');
  const [isSoldOut, setIsSoldOut] = useState(product?.is_sold_out ?? false);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [images, setImages] = useState<ProductImageItem[]>(
    product
      ? (product.image_paths?.length ? product.image_paths : product.image_path ? [product.image_path] : []).map((path) => ({
          kind: 'existing' as const,
          path,
        }))
      : [],
  );
  const [saving, setSaving] = useState(false);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const nextImages = Array.from(files).map((file) => ({
      kind: 'new' as const,
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((current) => [...current, ...nextImages]);
  };

  const removeImage = (index: number) => {
    setImages((current) => current.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const imagePaths: string[] = [];

    for (const image of images) {
      if (image.kind === 'existing') {
        imagePaths.push(image.path);
        continue;
      }

      const uploadedPath = await uploadImage(image.file, 'products');
      if (!uploadedPath) {
        alert('Gagal mengupload salah satu gambar. Coba lagi.');
        setSaving(false);
        return;
      }
      imagePaths.push(uploadedPath);
    }

    await onSave(
      {
        name,
        description: description || null,
        price: Number(price),
        sale_price: salePrice ? Number(salePrice) : null,
        category_id: categoryId || null,
        shopee_url: shopeeUrl,
        is_sold_out: isSoldOut,
        is_featured: isFeatured,
        image_path: imagePaths[0] ?? null,
        image_paths: imagePaths,
      },
    );
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-primary-100 bg-white px-6 py-4">
          <h3 className="font-serif text-lg font-semibold text-primary-900">
            {product ? 'Edit Produk' : 'Tambah Produk'}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-primary-500 hover:bg-primary-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Image upload */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary-800">Gambar Produk</label>
            <div className="space-y-4">
              <DropZone multiple onFiles={addFiles} />

              {images.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map((image, index) => {
                    const previewUrl = image.kind === 'existing' ? getPublicUrl(image.path) : image.preview;
                    return (
                      <div key={`${previewUrl}-${index}`} className="overflow-hidden rounded-2xl border border-primary-200 bg-primary-50">
                        <div className="aspect-[3/4]">
                          {previewUrl ? (
                            <img src={previewUrl} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-primary-300">
                              <Package size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2 border-t border-primary-100 bg-white px-3 py-2">
                          <span className="text-xs font-medium text-primary-600">Gambar {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="rounded-md px-2 py-1 text-xs font-medium text-error-600 hover:bg-error-50"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-primary-200 bg-primary-50 text-sm text-primary-500">
                  Belum ada gambar. Tambahkan minimal 1 gambar produk.
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary-800">Nama Produk *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vintage Green Xavier Fashion Boutique&apos;s"
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary-800">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Deskripsi produk..."
              className="input-field resize-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary-800">Harga (Rp) *</label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="150000"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary-800">Harga Diskon (Rp)</label>
              <input
                type="number"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="Kosongkan jika tidak ada"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary-800">Kategori</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input-field"
            >
              <option value="">Pilih kategori...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary-800">Link Shopee</label>
            <input
              type="url"
              value={shopeeUrl}
              onChange={(e) => setShopeeUrl(e.target.value)}
              placeholder="https://shopee.co.id/..."
              className="input-field"
            />
            <p className="mt-1 text-xs text-primary-500">
              Link produk Shopee. Tombol "Beli di Shopee" akan tampil di halaman produk.
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-primary-800">
              <input
                type="checkbox"
                checked={isSoldOut}
                onChange={(e) => setIsSoldOut(e.target.checked)}
                className="h-4 w-4 rounded border-primary-300 text-primary-600 focus:ring-primary-200"
              />
              Sold Out
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-primary-800">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-primary-300 text-primary-600 focus:ring-primary-200"
              />
              Tampilkan di beranda (Featured)
            </label>
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
