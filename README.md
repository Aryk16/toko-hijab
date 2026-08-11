# Xavier Fashion Boutique's — Toko Hijab Online

Toko online hijab & fashion muslimah (segala jenis kerudung / hijab segi empat) dengan **storefront** untuk pembeli dan **admin dashboard** untuk mengelola katalog, promosi, dan pengaturan toko.

Live di GitHub Pages: <https://aryk16.github.io/toko-hijab/>

---

## ✨ Fitur

### Storefront (untuk pembeli)
- **Hero slider** di beranda (dikelola dari admin)
- **Katalog produk** per kategori (Hijab, Apparels, Accessories, dll.)
- **Halaman detail produk** dengan galeri gambar, harga diskon, status *sold out*
- **Produk unggulan** & **produk on sale** di beranda
- **Halaman event / bazaar** beserta jadwalnya
- **Halaman about** & cerita brand
- Tombol **Beli di Shopee** dan **Pesan via WhatsApp**
- Ticker sosial proof yang otomatis menampilkan nama kategori dari database

### Admin (login khusus)
- Dashboard statistik
- Kelola **produk** (CRUD + upload gambar + multiple images)
- Kelola **kategori** (CRUD)
- Kelola **hero slider** (desktop & mobile)
- Kelola **event / bazaar**
- Kelola **pengaturan toko** (WhatsApp CS, WhatsApp reseller, alamat, Instagram)

---

## 🧱 Tech Stack

| Bagian | Teknologi |
| --- | --- |
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Backend / Database | Supabase (Postgres + Storage + Auth) |
| Routing | Custom router berbasis `window.location.pathname` (base-aware) |
| Deployment | GitHub Pages (via GitHub Actions) |

---

## 📁 Struktur Project

```
src/
├── components/        # Komponen UI (ProductCard, HeroSlider, DropZone, StoreLayout, dll.)
│   └── admin/         # Layout admin
├── lib/
│   ├── auth.tsx       # AuthProvider (sesi login)
│   ├── auth-context.ts# Context + hook useAuth
│   ├── hooks.ts       # Custom hooks (useCategories, useProducts, useProduct, useEvents, dll.)
│   ├── supabase.ts    # Inisialisasi client Supabase
│   ├── types.ts       # Tipe data (Category, Product, EventItem, SiteSettings, HeroSlide)
│   ├── format.ts      # Format Rupiah, tanggal
│   └── upload.ts      # Upload gambar ke Supabase Storage
├── pages/             # Halaman storefront
│   └── admin/         # Halaman admin (Dashboard, Products, Categories, HeroSlider, Events, Settings)
├── App.tsx            # Custom router + pembagian rute storefront/admin
└── main.tsx
supabase/migrations/   # Skema database & kebijakan RLS
.github/workflows/     # Deploy otomatis ke GitHub Pages
```

---

## 🚀 Menjalankan Secara Lokal

### Prasyarat
- Node.js 18+ (workflow CI menggunakan Node 22)
- npm

### 1. Install dependensi

```bash
npm install
```

### 2. Siapkan environment variable

Buat file `.env` di root project:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 3. Setup database (Supabase)

Jalankan migrasi yang ada di `supabase/migrations/` pada project Supabase kamu (bisa via dashboard SQL editor atau Supabase CLI):

```bash
supabase db push
```

Migrasi ini membuat tabel `categories`, `products`, `events`, `site_settings`, storage bucket `product-images`, serta kebijakan RLS (publik bisa membaca; hanya admin terautentikasi yang bisa menulis).

### 4. Jalankan dev server

```bash
npm run dev
```

Buka `http://localhost:5173`.

### Script lain

```bash
npm run build      # Build produksi ke /dist
npm run preview    # Preview hasil build
npm run lint       # ESLint
npm run typecheck  # TypeScript type check (tsc --noEmit)
```

---

## 🔐 Login Admin

Admin dibuat secara manual di Supabase Dashboard → Authentication → Users. Karena ini aplikasi admin yang mengharuskan login, **setiap user terautentikasi dianggap admin** (kebijakan tulis RLS di-scope ke `authenticated`).

Akses admin: buka `/admin` (atau `/admin/login`), lalu login dengan email & password.

---

## ☁️ Deployment (GitHub Pages)

Repo ini sudah dilengkapi workflow GitHub Actions (`.github/workflows/deploy.yml`) yang otomatis build & deploy setiap push ke branch `main`.

Langkah di GitHub:
1. **Settings → Pages → Source: GitHub Actions**
2. Tambahkan repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Push ke `main` → deployment otomatis berjalan.

### Base path (penting!)

Project ini menggunakan custom router yang **base-aware** dan diset `base: '/toko-hijab/'` di `vite.config.ts` agar berjalan di sub-path GitHub Pages (`https://aryk16.github.io/toko-hijab/`).

Ketika nanti pindah ke domain sendiri (misal `namatoko.my.id`), cukup ubah satu baris di `vite.config.ts`:

```ts
base: '/toko-hijab/'  →  base: '/'
```

Kode di `src/App.tsx` **tidak perlu diubah** karena `parsePath` & `navigate` membaca `import.meta.env.BASE_URL` secara otomatis.

---

## 🗄️ Model Data

| Tabel | Deskripsi |
| --- | --- |
| `categories` | Kategori produk (nama, slug, deskripsi, gambar, urutan) |
| `products` | Produk (harga, harga diskon, kategori, gambar, link Shopee, *sold out*, *featured*) |
| `events` | Event / bazaar (judul, deskripsi, gambar, tanggal) |
| `site_settings` | Satu baris pengaturan toko (WhatsApp CS/reseller, alamat, Instagram, hero slides) |

Catatan:
- Harga disimpan sebagai `bigint` (Rupiah, angka bulat) — aman dari masalah floating-point.
- Kolom gambar menyimpan **path** di Storage, bukan URL; frontend membangun URL publik via `getPublicUrl()`.
- `site_settings` dibatasi satu baris dengan `CHECK (id = 1)`.

---

## 📄 Lisensi

Properti milik Xavier Fashion Boutique's. Penggunaan internal / demo.
