import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { services, getServiceBySlug } from "@/data/services";
import { siteConfig, buildWhatsappLink, buildTelLink } from "@/data/site-config";
import { buildServiceSchema, buildFaqSchema, toJsonLd } from "@/lib/schema";

// URL pattern: /hizmetler/hamam-bocegi-ilaclama, /hizmetler/fare-ilaclama, ...
export function generateStaticParams() {
  return services.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service: slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const title = `${service.name} | İstanbul ${siteConfig.companyName}`;
  return {
    title,
    description: `${service.description} İstanbul genelinde profesyonel ${service.name.toLowerCase()} hizmeti için hemen iletişime geçin.`,
    alternates: { canonical: `/hizmetler/${slug}` },
  };
}

const faqItems = [
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

export default async function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service: slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return notFound();

  const schema = buildServiceSchema({
    serviceName: service.name,
    description: service.description,
  });
  const faqSchema = buildFaqSchema(faqItems);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(faqSchema) }} />

      <section className="bg-gradient-to-b from-green-50 to-white px-4 py-14 text-center">
        <span className="text-4xl">{service.icon}</span>
        <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold text-green-950 md:text-4xl">
          {service.name}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">{service.description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={buildWhatsappLink(`Merhaba, ${service.name} hakkında bilgi almak istiyorum.`)} className="rounded-full bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800">
            💬 WhatsApp&apos;tan Yazın
          </a>
          <a href={buildTelLink()} className="rounded-full border-2 border-green-700 px-6 py-3 font-semibold text-green-800 hover:bg-green-50">
            ☎ Hemen Ara
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-xl font-bold text-green-950">Sık Sorulan Sorular</h2>
        <div className="mt-4 space-y-4">
          {faqItems.map((item) => (
            <div key={item.question} className="rounded-xl border border-slate-200 p-4">
              <p className="font-semibold text-green-950">{item.question}</p>
              <p className="mt-1 text-sm text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
