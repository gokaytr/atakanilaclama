import Link from "next/link";
import { buildWhatsappLink } from "@/data/site-config";
import { services, cleaningServices, pricingByPlace } from "@/data/services";
import { districts } from "@/data/districts";
import { getNeighborhoodsByDistrict } from "@/data/neighborhoods";
import { buildFaqSchema, toJsonLd } from "@/lib/schema";
import PestMarquee from "@/components/PestMarquee";
import VideoHero from "@/components/VideoHero";
import PromoVideoSection from "@/components/PromoVideoSection";
import FinalCtaButtons from "@/components/FinalCtaButtons";

const TRUST_BADGES = [
  { icon: "📍", label: "İstanbul Geneli Hizmet" },
  { icon: "⚡", label: "Hızlı Yönlendirme" },
  { icon: "🧪", label: "Sağlık Bakanlığı Onaylı Ürünler" },
  { icon: "🐾", label: "İnsan ve Evcil Hayvan Dostu Uygulama" },
];

const PRE_CHECK_AREAS = [
  { icon: "🍽️", title: "Mutfak", note: "Dolap araları, gider ve cihaz çevreleri en sık kontrol edilen bölgelerdir." },
  { icon: "🛏️", title: "Yatak Odası", note: "Yatak, baza ve başlık çevresi tahta kurusu için öncelikli kontrol alanıdır." },
  { icon: "🧶", title: "Halı / Koltuk", note: "Halı ve koltuk altı birleşim noktaları pire ve toz akarı yönünden değerlendirilir." },
  { icon: "🧱", title: "Duvar Dipleri", note: "Duvar dipleri ve giriş noktaları karınca ve akrep için kontrol edilir." },
];

const CHECKED_AREAS = [
  { icon: "🍽️", title: "Mutfak", note: "Dolap içi, tezgah altı ve gider çevreleri." },
  { icon: "🚿", title: "Banyo", note: "Nem alan bölgeler ve gider ağızları." },
  { icon: "🛏️", title: "Yatak Odası", note: "Yatak, baza ve gardırop çevresi." },
  { icon: "🛋️", title: "Ortak Alanlar", note: "Salon, koridor ve depo alanları." },
  { icon: "🏚️", title: "Dış Cephe", note: "Bahçe, bina girişi ve duvar dipleri." },
];

const PROCESS_STEPS = [
  { step: "1", title: "Talebinizi İletin", note: "WhatsApp veya telefon üzerinden bulunduğunuz ilçe/mahalle ve ihtiyacınızı paylaşın." },
  { step: "2", title: "Risk Değerlendirmesi", note: "Haşere türü veya kumaş/koltuk tipi, alan büyüklüğü ve yoğunluk değerlendirilir." },
  { step: "3", title: "Uygulama", note: "Sağlık Bakanlığı onaylı ürün ve yöntemlerle yerinde, planlı uygulama yapılır." },
  { step: "4", title: "Bilgilendirme ve Takip", note: "Uygulama sonrası bekleme süresi ve takip önerileri açıkça paylaşılır." },
];

const FAQ_ITEMS = [
  {
    question: "Hangi ilçelerde hizmet veriyorsunuz?",
    answer: "İstanbul'un 39 ilçesinin tamamında, ilçeye bağlı mahalleler dahil böcek ilaçlama ve koltuk yıkama hizmeti veriyoruz. Bölgenizi /bolgeler sayfasından bulabilirsiniz.",
  },
  {
    question: "Fiyatlandırma nasıl belirleniyor?",
    answer: "Fiyat; alan tipi (ev, apartman, iş yeri, site), büyüklük ve talep edilen hizmete göre değişir. Kesin fiyat için WhatsApp'tan bilgi alabilirsiniz.",
  },
  {
    question: "Aynı gün hizmet mümkün mü?",
    answer: "Bölge ve ekip yoğunluğuna göre aynı gün veya bir sonraki gün için yönlendirme yapılmaya çalışılır.",
  },
  {
    question: "Uygulama sonrası bir garanti/takip süreci var mı?",
    answer: "Uygulama sonrası dikkat edilmesi gereken noktalar ve gerekirse takip uygulaması konusunda bilgilendirme yapılır.",
  },
];

export default function HomePage() {
  const anadolu = districts.filter((d) => d.side === "anadolu");
  const avrupa = districts.filter((d) => d.side === "avrupa");
  const faqSchema = buildFaqSchema(FAQ_ITEMS);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(faqSchema) }} />

      {/* Video hero — full-bleed autoplay/muted/looping background video
          with headline + CTAs overlaid, same on mobile and desktop. */}
      <VideoHero />

      {/* Soldan sağa akan hizmet/haşere şeridi — videonun hemen altında */}
      <PestMarquee />

      {/* Kısa güven cümlesi — açılışta video + şeritten hemen sonra */}
      <section className="w-full bg-emerald-700 py-3">
        <p className="mx-auto max-w-3xl px-4 text-center text-sm font-semibold text-white sm:text-base">
          🛡️ Sağlık Bakanlığı Onaylı Ürünlerle Güvenli İlaçlama
        </p>
      </section>

      {/* Trust badges strip */}
      <section className="w-full border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4">
          {TRUST_BADGES.map((badge) => (
            <div key={badge.label} className="flex flex-col items-center gap-2 text-center">
              <span className="text-2xl">{badge.icon}</span>
              <p className="text-xs font-semibold text-slate-700">{badge.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Price list — visible, crawlable HTML pricing (mirrors the printed
          fiyat listesi flyer, which is already shown as the hero image). */}
      <section id="fiyatlar" className="w-full scroll-mt-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="text-2xl font-extrabold text-slate-900">Böcek İlaçlama Fiyat Listesi</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Aşağıdaki tutarlar alan tipine göre <strong>başlangıç fiyatlarıdır</strong>;
            kesin fiyat alanın büyüklüğüne, yoğunluğa ve konuma göre değişebilir.
            Net teklif için WhatsApp&apos;tan yazabilirsiniz.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pricingByPlace.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.icon}</span>
                  <p className="font-semibold text-slate-900">{p.name}</p>
                </div>
                <p className="whitespace-nowrap text-lg font-extrabold text-emerald-700">
                  {p.priceFrom.toLocaleString("tr-TR")} TL&apos;den
                </p>
              </div>
            ))}
            <a
              href={buildWhatsappLink("Merhaba, böcek ilaçlama fiyat teklifi almak istiyorum.")}
              className="flex items-center justify-center rounded-xl border-2 border-dashed border-emerald-300 p-4 text-center text-sm font-semibold text-emerald-700 hover:bg-emerald-50 sm:col-span-2 lg:col-span-1"
            >
              💬 Alanınıza özel net fiyat için WhatsApp&apos;tan yazın
            </a>
          </div>
        </div>
      </section>

      {/* Quick pre-check detail section */}
      <section className="w-full bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="text-2xl font-extrabold text-slate-900">Haşere / Bakım İhtiyacınızı Hızlıca Belirleyin</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            En sık talep aldığımız alanlar aşağıdadır — hangisi size uyuyorsa
            WhatsApp&apos;tan fotoğraf ve konum paylaşarak hızlı bilgi alabilirsiniz.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {PRE_CHECK_AREAS.map((area) => (
              <div key={area.title} className="rounded-xl border border-slate-200 bg-white p-4">
                <span className="text-2xl">{area.icon}</span>
                <p className="mt-2 font-semibold text-slate-900">{area.title}</p>
                <p className="mt-1 text-sm text-slate-600">{area.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="text-2xl font-extrabold text-slate-900">Böcek İlaçlama Hizmetlerimiz</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/hizmetler/${s.slug}`}
                className="rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-300 hover:shadow-md"
              >
                <span className="text-3xl">{s.icon}</span>
                <h3 className="mt-2 font-bold text-slate-900">{s.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.description}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-emerald-700">
                  Detaylı incele →
                </span>
              </Link>
            ))}
          </div>

          <h2 className="mt-14 text-2xl font-extrabold text-slate-900">Koltuk Yıkama Hizmetlerimiz</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {cleaningServices.map((s) => (
              <Link
                key={s.slug}
                href={`/hizmetler/${s.slug}`}
                className="rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-300 hover:shadow-md"
              >
                <span className="text-3xl">{s.icon}</span>
                <h3 className="mt-2 font-bold text-slate-900">{s.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.description}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-emerald-700">
                  Detaylı incele →
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Alan tipine göre başlangıç fiyatları (ev, apartman, iş yeri,
            restoran, fabrika/depo) için{" "}
            <a href={buildWhatsappLink()} className="text-emerald-700 underline">
              WhatsApp&apos;tan
            </a>{" "}
            bilgi alabilirsiniz. Örnek alan tipleri:{" "}
            {pricingByPlace.map((p) => p.name).join(", ")}.
          </p>
        </div>
      </section>

      {/* Why us checklist */}
      <section className="w-full bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="text-2xl font-extrabold text-slate-900">Neden Bizi Tercih Etmelisiniz?</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "İstanbul'un 39 ilçesinde ve bağlı mahallelerinde hizmet",
              "Sağlık Bakanlığı onaylı, insan ve evcil hayvan dostu ürünler",
              "Uygulama öncesi açık bilgilendirme, sonrası takip önerileri",
              "Ev, iş yeri, apartman ve site tipi alanlara özel planlama",
              "Böcek ilaçlama ve koltuk yıkama tek elden",
              "WhatsApp üzerinden hızlı iletişim ve yönlendirme",
            ].map((point) => (
              <div key={point} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-4">
                <span className="text-emerald-700">✓</span>
                <span className="text-slate-700">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Most checked areas */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="text-2xl font-extrabold text-slate-900">En Sık Kontrol Edilen Alanlar</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-5">
            {CHECKED_AREAS.map((area) => (
              <div key={area.title} className="rounded-xl border border-slate-200 p-4 text-center">
                <span className="text-2xl">{area.icon}</span>
                <p className="mt-2 font-semibold text-slate-900">{area.title}</p>
                <p className="mt-1 text-xs text-slate-600">{area.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo video — only rendered once the admin sets one in the panel */}
      <PromoVideoSection />

      {/* How it works */}
      <section className="w-full bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="text-2xl font-extrabold text-slate-900">Nasıl Çalışıyoruz?</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {PROCESS_STEPS.map((step) => (
              <div key={step.step} className="rounded-xl border border-slate-200 bg-white p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                  {step.step}
                </span>
                <p className="mt-3 font-semibold text-slate-900">{step.title}</p>
                <p className="mt-1 text-sm text-slate-600">{step.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Region directory — Anadolu / Avrupa yakası */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="text-2xl font-extrabold text-slate-900">Hizmet Bölgelerimiz</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            İstanbul&apos;un 39 ilçesinin tamamında böcek ilaçlama ve koltuk
            yıkama hizmeti veriyoruz — her ilçenin sayfasında bağlı
            mahallelere özel hizmet sayfalarına da ulaşabilirsiniz.
          </p>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {[
              { label: "Anadolu Yakası", items: anadolu },
              { label: "Avrupa Yakası", items: avrupa },
            ].map((group) => (
              <div key={group.label}>
                <h3 className="mb-3 text-lg font-semibold text-slate-800">{group.label}</h3>
                <div className="space-y-2">
                  {group.items.map((d) => {
                    const nCount = getNeighborhoodsByDistrict(d.slug).length;
                    return (
                      <details key={d.slug} className="group rounded-xl border border-slate-200 bg-slate-50 open:bg-white">
                        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-slate-800">
                          {d.name}
                          <span className="text-slate-400 group-open:rotate-180">⌄</span>
                        </summary>
                        <div className="px-4 pb-4 text-sm text-slate-600">
                          <p>
                            {d.name}, İstanbul {group.label.toLowerCase()}nda yer alır.
                            {nCount > 0 && ` ${nCount} mahalleye özel hizmet sayfamız da mevcuttur.`}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Link
                              href={`/${d.slug}-bocek-ilaclama`}
                              className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                            >
                              {d.name} Böcek İlaçlama
                            </Link>
                            <Link
                              href={`/${d.slug}-koltuk-yikama`}
                              className="rounded-full border border-emerald-700 px-4 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                            >
                              {d.name} Koltuk Yıkama
                            </Link>
                            <a
                              href={buildWhatsappLink(`Merhaba, ${d.name} için bilgi almak istiyorum.`)}
                              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            >
                              💬 WhatsApp
                            </a>
                          </div>
                        </div>
                      </details>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="/bolgeler" className="text-sm font-semibold text-emerald-700 underline">
              Tüm hizmet bölgelerini gör →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h2 className="text-2xl font-extrabold text-slate-900">Sık Sorulan Sorular</h2>
          <div className="mt-6 space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details key={item.question} className="rounded-xl border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-slate-900">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA banner */}
      <section className="w-full bg-emerald-700">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center">
          <h2 className="text-2xl font-extrabold text-white md:text-3xl">
            Hemen bilgi alın, ekibimiz size dönüş yapsın
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-emerald-50">
            İlçenizi ve ihtiyacınızı paylaşın, size en uygun uygulama planını
            sunalım.
          </p>
          <FinalCtaButtons />
        </div>
      </section>
    </div>
  );
}
