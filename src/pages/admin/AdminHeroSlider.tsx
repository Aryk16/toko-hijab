import { useEffect, useState } from 'react';
import { Loader2, Plus, Save, Star, Trash2 } from 'lucide-react';
import { supabase, getPublicUrl } from '@/lib/supabase';
import { uploadImage } from '@/lib/upload';
import { DropZone } from '@/components/DropZone';
import type { HeroSlide } from '@/lib/types';

type HeroSlideDraft = HeroSlide;

export function AdminHeroSlider() {
  const [heroSlides, setHeroSlides] = useState<HeroSlideDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function load() {
    supabase
      .from('site_settings')
      .select('hero_slides')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.hero_slides) {
          setHeroSlides(
            data.hero_slides.map((slide: Partial<HeroSlide>) => ({
              title: slide.title ?? '',
              image_path: slide.image_path ?? slide.desktop_image_path ?? slide.mobile_image_path ?? null,
              desktop_image_path: slide.desktop_image_path ?? slide.image_path ?? null,
              mobile_image_path: slide.mobile_image_path ?? slide.image_path ?? null,
            })),
          );
        }
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  const addSlide = () =>
    setHeroSlides([...heroSlides, { title: '', image_path: '', desktop_image_path: '', mobile_image_path: '' }]);

  const removeSlide = (index: number) => setHeroSlides(heroSlides.filter((_, i) => i !== index));

  const updateSlide = (index: number, field: keyof HeroSlideDraft, value: string) => {
    const updated = [...heroSlides];
    updated[index] = { ...updated[index], [field]: value };
    setHeroSlides(updated);
  };

  const uploadSlideImage = async (index: number, target: 'desktop_image_path' | 'mobile_image_path', file: File) => {
    const path = await uploadImage(file, 'hero');
    if (!path) return;

    updateSlide(index, target, path);
    const current = heroSlides[index];
    if (!current.image_path) {
      updateSlide(index, 'image_path', path);
    }
  };

  const saveHeroSlides = async () => {
    setSaving(true);
    const payloadSlides = heroSlides.map((slide) => ({
      title: slide.title,
      image_path: slide.image_path ?? slide.desktop_image_path ?? slide.mobile_image_path ?? null,
      desktop_image_path: slide.desktop_image_path ?? slide.image_path ?? null,
      mobile_image_path: slide.mobile_image_path ?? slide.image_path ?? null,
    }));

    await supabase.from('site_settings').update({ hero_slides: payloadSlides, updated_at: new Date().toISOString() }).eq('id', 1);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="animate-spin text-primary-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary-900">Kelola Hero Slider</h2>
          <p className="mt-1 text-sm text-primary-600">Tambah dan atur hero slider beranda untuk desktop dan mobile</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={addSlide} className="btn-secondary">
            <Plus size={18} /> Tambah Slide
          </button>
          <button type="button" onClick={saveHeroSlides} disabled={saving} className="btn-primary">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Simpan
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm font-medium text-success-600">
              <Star size={14} /> Tersimpan!
            </span>
          )}
        </div>
      </div>

      {heroSlides.length === 0 ? (
        <p className="rounded-xl bg-primary-50 px-4 py-8 text-center text-sm text-primary-500">
          Belum ada slide. Klik "Tambah Slide" untuk mulai.
        </p>
      ) : (
        <div className="space-y-4">
          {heroSlides.map((slide, i) => {
            const desktopUrl = getPublicUrl(slide.desktop_image_path ?? slide.image_path);
            const mobileUrl = getPublicUrl(slide.mobile_image_path ?? slide.image_path);

            return (
              <div key={i} className="rounded-xl border border-primary-100 p-4">
                <div className="space-y-2">
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => updateSlide(i, 'title', e.target.value)}
                    placeholder="Judul slide"
                    className="input-field"
                  />
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3 rounded-lg border border-dashed border-primary-200 p-3">
                    <div>
                      <p className="text-sm font-medium text-primary-800">Gambar Desktop</p>
                      <p className="text-xs text-primary-500">1400 x 520 px</p>
                    </div>
                    <DropZone
                      onFiles={(files) => uploadSlideImage(i, 'desktop_image_path', files[0])}
                      className="py-6"
                    />
                    <div className="overflow-hidden rounded-lg border border-primary-200 bg-primary-50">
                      <div className="aspect-[1400/520] bg-primary-100">
                        {desktopUrl ? (
                          <img src={desktopUrl} alt={`${slide.title} desktop preview`} className="h-full w-full object-contain" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-primary-300">
                            <Star size={20} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-lg border border-dashed border-primary-200 p-3">
                    <div>
                      <p className="text-sm font-medium text-primary-800">Gambar Mobile</p>
                      <p className="text-xs text-primary-500">1080 x 1350 px</p>
                    </div>
                    <DropZone
                      onFiles={(files) => uploadSlideImage(i, 'mobile_image_path', files[0])}
                      className="py-6"
                    />
                    <div className="overflow-hidden rounded-lg border border-primary-200 bg-primary-50">
                      <div className="aspect-[1080/1350] bg-primary-100">
                        {mobileUrl ? (
                          <img src={mobileUrl} alt={`${slide.title} mobile preview`} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-primary-300">
                            <Star size={20} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeSlide(i)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-error-50 px-3 py-2 text-sm font-medium text-error-600 hover:bg-error-100"
                >
                  <Trash2 size={16} /> Hapus Slide
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}