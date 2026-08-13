import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  services,
  cleaningServices,
  getServiceBySlug,
  getCleaningServiceBySlug,
} from "@/data/services";
import { siteConfig, buildWhatsappLink, buildTelLink } from "@/data/site-config";
import { buildServiceSchema, buildFaqSchema, toJsonLd } from "@/lib/schema";

// URL pattern: /hizmetler/hamam-bocegi-ilaclama, /hizmetler/fare-ilaclama,
// /hizmetler/koltuk-yikama, /hizmetler/sandalye-yikama, ...
function resolveService(slug: string) {
  const pest = getServiceBySlug(slug);
  if (pest) return { ...pest, kind: "pest" as const };
  const cleaning = getCleaningServiceBySlug(slug);
  if (cleaning) return { ...cleaning, kind: "cleaning" as const };
  return undefined;
}

export function generateStaticParams() {
  return [...services.map((s) => ({ service: s.slug })), ...cleaningServices.map((s) => ({ service: s.slug }))];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service: slug } = await params;
  const service = resolveService(slug);
  if (!service) return {};

  const title = `${service.name} | İstanbul ${siteConfig.companyName}`;
  return {
    title,
    description: `${service.description} İstanbul genelinde profesyonel ${service.name.toLowerCase()} hizmeti için hemen iletişime geçin.`,
    alternates: { canonical: `/hizmetler/${slug}` },
  };
}

const pestFaqItems = [
  {
    question: "Böcek ilaçlama ne kadar sürer?",
    answer: "Süre; alanın büyüklüğüne, haşere türüne, yoğunluğa ve uygulanacak yönteme göre değişir. Ön değerlendirme sonrasında net bilgi verilir.",
  },
  {
    question: "İlaçlama sırasında evde kalınabilir mi?",
    answer: "Kullanılan yönteme göre evin boşaltılması gerekebilir. Uygulama öncesinde bekleme ve havalandırma süresi açık şekilde bildirilir.",
  },
  {
    question: "Tek uygulama yeterli olur mu?",
    answer: "Haşere türüne ve yoğunluğa göre tek uygulama yeterli olabilir veya takip uygulaması gerekebilir.",
  },
];

const cleaningFaqItems = [
  {
    question: "Koltuk yıkama ne kadar sürer, ne zaman kullanılabilir?",
    answer: "Uygulama süresi koltuğun boyutuna ve kumaş tipine göre değişir. Kullanılan hızlı kuruma yöntemiyle koltuklar genellikle aynı gün içinde tekrar kullanılabilir hale gelir.",
  },
  {
    question: "Hangi kumaş türlerinde uygulama yapılıyor?",
    answer: "Kumaş ve deri koltuklarda, kumaşın yapısına uygun yöntem ve temizlik ürünü seçilerek uygulama yapılır.",
  },
  {
    question: "Yerinde mi yıkanıyor, koltuk evden çıkarılıyor mu?",
    answer: "Uygulama adresinizde, koltuk yerinden kaldırılmadan yapılır; ekip gerekli ekipmanı yanında getirir.",
  },
];

export default async function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service: slug } = await params;
  const service = resolveService(slug);
  if (!service) return notFound();

  const faqItems = service.kind === "pest" ? pestFaqItems : cleaningFaqItems;

  const schema = buildServiceSchema({
    serviceName: service.name,
    description: service.description,
  });
  const faqSchema = buildFaqSchema(faqItems);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(faqSchema) }} />

      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-14 text-center">
        <span className="text-4xl">{service.icon}</span>
        <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold text-slate-900 md:text-4xl">
          {service.name}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">{service.description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={buildWhatsappLink(`Merhaba, ${service.name} hakkında bilgi almak istiyorum.`)} className="rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800">
            💬 WhatsApp&apos;tan Yazın
          </a>
          <a href={buildTelLink()} className="rounded-full border-2 border-emerald-700 px-6 py-3 font-semibold text-emerald-800 hover:bg-emerald-50">
            ☎ Hemen Ara
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-xl font-bold text-slate-900">Sık Sorulan Sorular</h2>
        <div className="mt-4 space-y-4">
          {faqItems.map((item) => (
            <div key={item.question} className="rounded-xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">{item.question}</p>
              <p className="mt-1 text-sm text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
