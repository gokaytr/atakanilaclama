import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { districts, District } from "@/data/districts";
import { services } from "@/data/services";
import { siteConfig, buildWhatsappLink, buildTelLink } from "@/data/site-config";
import { buildServiceSchema, toJsonLd } from "@/lib/schema";

// URL pattern: /kagithane-bocek-ilaclama, /besiktas-bocek-ilaclama, ...
// This single template renders every district's SEO landing page. Adding a
// new district to data/districts.ts automatically creates its page here.
const SUFFIX = "-bocek-ilaclama";

function resolveDistrict(paramSlug: string): District | undefined {
  if (!paramSlug.endsWith(SUFFIX)) return undefined;
  const slug = paramSlug.slice(0, -SUFFIX.length);
  return districts.find((d) => d.slug === slug);
}

export function generateStaticParams() {
  return districts.map((d) => ({ district: `${d.slug}${SUFFIX}` }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ district: string }>;
}): Promise<Metadata> {
  const { district: paramSlug } = await params;
  const district = resolveDistrict(paramSlug);
  if (!district) return {};

  const title = `${district.name} Böcek İlaçlama | ${siteConfig.companyName}`;
  const description = `${district.name} böcek ilaçlama hizmeti — ev, apartman, iş yeri ve kurumsal alanlarda profesyonel, Sağlık Bakanlığı onaylı haşere kontrolü. Hemen WhatsApp'tan yazın.`;

  return {
    title,
    description,
    alternates: { canonical: `/${paramSlug}` },
    openGraph: { title, description },
  };
}

export default async function DistrictPage({
  params,
}: {
  params: Promise<{ district: string }>;
}) {
  const { district: paramSlug } = await params;
  const district = resolveDistrict(paramSlug);
  if (!district) return notFound();

  const sideLabel = district.side === "anadolu" ? "Anadolu Yakası" : "Avrupa Yakası";
  const schema = buildServiceSchema({
    serviceName: "Böcek İlaçlama",
    description: `${district.name} bölgesinde profesyonel böcek ve haşere ilaçlama hizmeti.`,
    districtName: district.name,
  });

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(schema) }}
      />

      <section className="bg-gradient-to-b from-green-50 to-white px-4 py-14 text-center">
        <p className="mx-auto mb-3 w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
          {sideLabel} Hizmet Bölgesi
        </p>
        <h1 className="mx-auto max-w-3xl text-3xl font-extrabold text-green-950 md:text-4xl">
          {district.name} Böcek İlaçlama
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          {district.name} böcek ilaçlama taleplerinde ev, apartman, iş yeri,
          ofis, depo ve ortak kullanım alanlarında görülen haşere türü
          değerlendirilir. Yoğunluk, giriş noktaları ve saklanma
          bölgelerine göre {sideLabel} için planlı uygulama oluşturulur.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={buildWhatsappLink(`Merhaba, ${district.name} böcek ilaçlama hakkında bilgi almak istiyorum.`)} className="rounded-full bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800">
            💬 WhatsApp&apos;tan Yazın
          </a>
          <a href={buildTelLink()} className="rounded-full border-2 border-green-700 px-6 py-3 font-semibold text-green-800 hover:bg-green-50">
            ☎ Hemen Ara
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-xl font-bold text-green-950">
          {district.name} Böcek İlaçlama Hizmetlerimiz
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {services.map((s) => (
            <Link key={s.slug} href={`/hizmetler/${s.slug}`} className="rounded-xl border border-slate-200 p-4 hover:border-green-300 hover:shadow-sm">
              <span className="text-2xl">{s.icon}</span>
              <p className="mt-1 text-sm font-semibold text-green-950">{s.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-14">
        <h2 className="text-xl font-bold text-green-950">Neden Bizi Tercih Etmelisiniz?</h2>
        <ul className="mt-4 space-y-2 text-slate-700">
          <li>✓ {district.name} bölgesine hızlı ekip yönlendirmesi</li>
          <li>✓ Sağlık Bakanlığı onaylı, insan ve evcil hayvan dostu ürünler</li>
          <li>✓ Uygulama öncesi açık bilgilendirme, sonrası takip önerileri</li>
          <li>✓ Ev, iş yeri ve kurumsal alanlara özel planlama</li>
        </ul>
      </section>
    </div>
  );
}
