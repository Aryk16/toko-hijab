import { useEffect, useState } from 'react';
import { Loader2, Save, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // form state
  const [whatsappCs, setWhatsappCs] = useState('');
  const [whatsappReseller, setWhatsappReseller] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setWhatsappCs(data.whatsapp_cs ?? '');
          setWhatsappReseller(data.whatsapp_reseller ?? '');
          setStoreAddress(data.store_address ?? '');
          setInstagramUrl(data.instagram_url ?? '');
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase
      .from('site_settings')
      .update({
        whatsapp_cs: whatsappCs || null,
        whatsapp_reseller: whatsappReseller || null,
        store_address: storeAddress || null,
        instagram_url: instagramUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);
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
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-primary-900">Pengaturan Toko</h2>
        <p className="mt-1 text-sm text-primary-600">Kelola informasi kontak dan tampilan beranda</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact info */}
        <div className="card p-6">
          <h3 className="mb-4 font-serif text-lg font-semibold text-primary-900">Informasi Kontak</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary-800">WhatsApp CS</label>
              <input
                type="text"
                value={whatsappCs}
                onChange={(e) => setWhatsappCs(e.target.value)}
                placeholder="No Whatsapp"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary-800">WhatsApp Reseller</label>
              <input
                type="text"
                value={whatsappReseller}
                onChange={(e) => setWhatsappReseller(e.target.value)}
                placeholder="No Whatsapp"
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-primary-800">Alamat Toko</label>
              <textarea
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                rows={2}
                className="input-field resize-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-primary-800">URL Instagram</label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="Link Instagram"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save size={18} /> Simpan Pengaturan
              </>
            )}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm font-medium text-success-600">
              <Star size={14} /> Tersimpan!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
