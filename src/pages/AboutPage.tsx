import { ArrowRight, Sparkles, Heart, Users } from 'lucide-react';
import { useSiteSettings } from '@/lib/hooks';

export function AboutPage() {
  const { settings } = useSiteSettings();

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden bg-gradient-to-br from-primary-200 via-primary-100 to-secondary-100">
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
          <div>
            <h1 className="font-serif text-4xl font-bold text-primary-800 sm:text-5xl">Tentang Xavier Fashion Boutique's</h1>
            <p className="mt-3 max-w-xl text-lg text-primary-600">
              Fashion Hijab milik semua orang
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed text-primary-700">
            Xavier Fashion Boutique's lahir dari keyakinan bahwa <strong>Fashion Hijab</strong> itu milik semua orang,
            termasuk wanita Muslim. Wanita muslim juga tetap bisa berekspresi dan bergaya sesuai dengan
            karakter, kepribadian dan tren.
          </p>
          <p className="mt-4 leading-relaxed text-primary-700">
            Melalui Xavier Fashion Boutique's, kami menyajikan koleksi Kerudung / Hijab Segi Empat yang menjunjung nilai
            budaya Indonesia dan budaya Islam dalam satu kesatuan untuk melengkapi kebutuhan dasar Wanita
            Muslim yang berkualitas dan orisinalitas.
          </p>
          <p className="mt-4 leading-relaxed text-primary-700">
            Selain menghadirkan Printed Scarf / Hijab Printing Terbaru / Model Hijab Terbaru, Xavier Fashion Boutique's
            juga menghadirkan Voal Plain, Hijab Syar'i dan koleksi hijab lainnya.
          </p>
          <p className="mt-4 leading-relaxed text-primary-700">
            Dengan menggabungkan desain yang inovatif dan teknologi tekstil terbaru, kami berkomitmen
            untuk selalu menghadirkan produk fashion hijab cantik yang nyaman dan cocok
            untuk digunakan sehari-hari oleh seluruh Wanita Muslim Indonesia. Kami juga membuka reseller
            hijab (open reseller hijab), bagi siapapun yang ingin berjualan produk hijab kami.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-primary-100/50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { icon: Sparkles, title: 'Desain Inovatif', desc: 'Menggabungkan teknologi tekstil terbaru dengan desain yang kekinian.' },
              { icon: Heart, title: 'Berkualitas', desc: 'Produk fashion hijab cantik dan nyaman untuk digunakan sehari-hari.' },
              { icon: Users, title: 'Open Reseller', desc: 'Kami membuka kesempatan reseller hijab bagi siapapun yang ingin berjualan.' },
            ].map((v) => (
              <div key={v.title} className="card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                  <v.icon size={24} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-primary-900">{v.title}</h3>
                <p className="mt-2 text-sm text-primary-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {settings?.whatsapp_reseller && (
        <section className="py-16 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-bold text-primary-900">Ingin Menjadi Reseller?</h2>
            <p className="mt-3 text-primary-600">
              Hubungi kami untuk informasi lebih lanjut tentang program reseller hijab.
            </p>
            <a
              href={`https://wa.me/${settings.whatsapp_reseller}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent mt-6"
            >
              Hubungi via WhatsApp <ArrowRight size={18} />
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
