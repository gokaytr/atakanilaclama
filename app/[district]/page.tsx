import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { districts, District, getDistrictBySlug } from "@/data/districts";
import {
  neighborhoods,
  Neighborhood,
  getNeighborhoodsByDistrict,
  getNeighborhood,
} from "@/data/neighborhoods";
import { services, cleaningServices } from "@/data/services";
import { siteConfig, buildWhatsappLink, buildTelLink } from "@/data/site-config";
import { buildServiceSchema, toJsonLd } from "@/lib/schema";
import {
  ServicesGrid,
  WhyUs,
  LocationHero,
  Breadcrumbs,
  NeighborhoodLinksGrid,
} from "@/components/LocationSections";

// ---------------------------------------------------------------------
// Single dynamic route that generates every location-based SEO landing
// page for both service lines, at district level and neighbourhood
// (mahalle) level:
//
//   /kagithane-bocek-ilaclama
//   /kagithane-koltuk-yikama
//   /kagithane-hurriyet-mahallesi-bocek-ilaclama
//   /gungoren-haznedar-mahallesi-koltuk-yikama
//
// Adding a district to data/districts.ts or a neighbourhood to
// data/neighborhoods.ts automatically creates its pages + sitemap entries.
// ---------------------------------------------------------------------

const PEST_SUFFIX = "-bocek-ilaclama";
const CLEANING_SUFFIX = "-koltuk-yikama";
const MAHALLESI = "-mahallesi";

type ServiceKind = "pest" | "cleaning";

type Resolved =
  | { kind: "district"; district: District; service: ServiceKind }
  | {
      kind: "neighborhood";
      district: District;
      neighborhood: Neighborhood;
      service: ServiceKind;
    };

function resolveSlug(paramSlug: string): Resolved | undefined {
  const suffixes: { suffix: string; service: ServiceKind }[] = [
    { suffix: PEST_SUFFIX, service: "pest" },
    { suffix: CLEANING_SUFFIX, service: "cleaning" },
  ];

  for (const { suffix, service } of suffixes) {
    if (!paramSlug.endsWith(suffix)) continue;
    const remaining = paramSlug.slice(0, -suffix.length);

    // District-level: /{district}-bocek-ilaclama
    const directDistrict = getDistrictBySlug(remaining);
    if (directDistrict) {
      return { kind: "district", district: directDistrict, service };
    }

    // Neighbourhood-level: /{district}-{mahalle}-mahallesi-bocek-ilaclama
    if (remaining.endsWith(MAHALLESI)) {
      const withoutMahallesi = remaining.slice(0, -MAHALLESI.length);
      for (const d of districts) {
        const prefix = `${d.slug}-`;
        if (!withoutMahallesi.startsWith(prefix)) continue;
        const neighborhoodSlug = withoutMahallesi.slice(prefix.length);
        const neighborhood = getNeighborhood(d.slug, neighborhoodSlug);
        if (neighborhood) {
          return { kind: "neighborhood", district: d, neighborhood, service };
        }
      }
    }
  }
  return undefined;
}

export function generateStaticParams() {
  const params: { district: string }[] = [];
  for (const d of districts) {
    params.push({ district: `${d.slug}${PEST_SUFFIX}` });
    params.push({ district: `${d.slug}${CLEANING_SUFFIX}` });
  }
  for (const n of neighborhoods) {
    params.push({ district: `${n.districtSlug}-${n.slug}${MAHALLESI}${PEST_SUFFIX}` });
    params.push({ district: `${n.districtSlug}-${n.slug}${MAHALLESI}${CLEANING_SUFFIX}` });
  }
  return params;
}

// Deterministic template picker so hundreds of pages don't ship
// byte-identical copy (bad for SEO / can read as thin/duplicate content).
function pick<T>(items: T[], seed: string): T {
  const hash = seed.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return items[hash % items.length];
}

const PROPERTY_TYPES = ["ev", "apartman", "iş yeri", "site"];

function districtDescriptionTemplates(name: string, side: string, service: ServiceKind): string[] {
  if (service === "pest") {
    return [
      `${name} böcek ilaçlama hizmeti — ev, apartman, iş yeri ve site alanlarında profesyonel, Sağlık Bakanlığı onaylı haşere kontrolü. ${side} için hemen WhatsApp'tan yazın.`,
      `${name} bölgesinde hamam böceği, karınca, fare, tahta kurusu ve diğer haşerelere karşı planlı uygulama. ${name} böcek ilaçlama talebiniz için hızlı yönlendirme sağlanır.`,
      `${side} hizmet bölgesinde yer alan ${name} için ev, iş yeri ve kurumsal alanlara özel böcek ilaçlama planı. Sağlık Bakanlığı onaylı ürünlerle güvenli uygulama.`,
      `${name} böcek ilaçlama ihtiyaçlarınızda hızlı iletişim ve yerinde değerlendirme. ${side} genelinde apartman, site ve iş yerlerine profesyonel haşere kontrolü.`,
    ];
  }
  return [
    `${name} koltuk yıkama hizmeti — kumaş ve deri koltuklarda yerinde leke çıkarma ve hızlı kurutma. ${side} için hemen WhatsApp'tan randevu alın.`,
    `${name} bölgesinde ev, apartman, site ve iş yerlerine adrese gelerek koltuk, halı ve yatak yıkama hizmeti. ${name} koltuk yıkama talebiniz için hızlı yönlendirme.`,
    `${side} hizmet bölgesinde yer alan ${name} için hijyenik ve hızlı kuruyan koltuk yıkama uygulaması. Ev ve iş yerlerine özel planlama yapılır.`,
    `${name} koltuk yıkama ihtiyaçlarınızda yerinde keşif ve hızlı hizmet. ${side} genelinde daire, site ve ofislere profesyonel temizlik.`,
  ];
}

function neighborhoodDescriptionTemplates(
  district: string,
  neighborhood: string,
  service: ServiceKind
): string[] {
  if (service === "pest") {
    return [
      `${district} ${neighborhood} Mahallesi böcek ilaçlama hizmeti — ev, apartman, iş yeri ve site alanlarında Sağlık Bakanlığı onaylı haşere kontrolü. ${district} ${neighborhood} için hemen WhatsApp'tan yazın.`,
      `${district} ${neighborhood} mahallesinde hamam böceği, karınca, fare ve tahta kurusuna karşı planlı uygulama. ${neighborhood} Mahallesi böcek ilaçlama talebiniz hızla değerlendirilir.`,
      `${district} ilçesi ${neighborhood} Mahallesi'nde ev, apartman ve iş yerlerine özel böcek ilaçlama planı. ${neighborhood} böcek ilaçlama için yerinde değerlendirme yapılır.`,
      `${neighborhood} Mahallesi (${district}) için hızlı iletişim ve profesyonel haşere kontrolü. Site, apartman ve iş yerlerinde güvenli uygulama.`,
    ];
  }
  return [
    `${district} ${neighborhood} Mahallesi koltuk yıkama hizmeti — kumaş ve deri koltuklarda yerinde leke çıkarma, hızlı kurutma. ${district} ${neighborhood} için hemen WhatsApp'tan randevu alın.`,
    `${district} ${neighborhood} mahallesinde ev, apartman ve iş yerlerine adrese gelerek koltuk, halı ve yatak yıkama. ${neighborhood} Mahallesi koltuk yıkama talebiniz hızla değerlendirilir.`,
    `${district} ilçesi ${neighborhood} Mahallesi'nde hijyenik ve hızlı kuruyan koltuk yıkama uygulaması. ${neighborhood} koltuk yıkama için yerinde keşif yapılır.`,
    `${neighborhood} Mahallesi (${district}) için hızlı iletişim ve profesyonel koltuk yıkama hizmeti. Site, apartman ve iş yerlerinde uygulanır.`,
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ district: string }>;
}): Promise<Metadata> {
  const { district: paramSlug } = await params;
  const resolved = resolveSlug(paramSlug);
  if (!resolved) return {};

  const serviceLabel = resolved.service === "pest" ? "Böcek İlaçlama" : "Koltuk Yıkama";

  if (resolved.kind === "district") {
    const { district, service } = resolved;
    const side = district.side === "anadolu" ? "Anadolu Yakası" : "Avrupa Yakası";
    const title = `${district.name} ${serviceLabel} | ${siteConfig.companyName}`;
    const description = pick(
      districtDescriptionTemplates(district.name, side, service),
      paramSlug
    );
    return {
      title,
      description,
      alternates: { canonical: `/${paramSlug}` },
      openGraph: { title, description },
    };
  }

  const { district, neighborhood, service } = resolved;
  const title = `${district.name} ${neighborhood.name} Mahallesi ${serviceLabel} | ${siteConfig.companyName}`;
  const description = pick(
    neighborhoodDescriptionTemplates(district.name, neighborhood.name, service),
    paramSlug
  );
  return {
    title,
    description,
    alternates: { canonical: `/${paramSlug}` },
    openGraph: { title, description },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ district: string }>;
}) {
  const { district: paramSlug } = await params;
  const resolved = resolveSlug(paramSlug);
  if (!resolved) return notFound();

  const isPest = resolved.service === "pest";
  const serviceLabel = isPest ? "Böcek İlaçlama" : "Koltuk Yıkama";
  const district = resolved.district;
  const side = district.side === "anadolu" ? "Anadolu Yakası" : "Avrupa Yakası";
  const propertyTypesText = PROPERTY_TYPES.join(", ");

  const otherServiceHref =
    resolved.kind === "district"
      ? `/${district.slug}${isPest ? CLEANING_SUFFIX : PEST_SUFFIX}`
      : `/${district.slug}-${resolved.neighborhood.slug}${MAHALLESI}${isPest ? CLEANING_SUFFIX : PEST_SUFFIX}`;

  if (resolved.kind === "district") {
    const h1 = `${district.name} ${serviceLabel}`;
    const paragraphs = isPest
      ? [
          `${district.name} böcek ilaçlama taleplerinde ${propertyTypesText} ve ortak kullanım alanlarında görülen haşere türü değerlendirilir. Yoğunluk, giriş noktaları ve saklanma bölgelerine göre ${side} için planlı uygulama oluşturulur.`,
          `Hamam böceği, karınca, fare, tahta kurusu, sivrisinek, örümcek ve akrep gibi haşere türlerine karşı Sağlık Bakanlığı onaylı ürünlerle güvenli uygulama yapılır.`,
        ]
      : [
          `${district.name} koltuk yıkama taleplerinde ${propertyTypesText} tipine göre kumaş ve deri koltuklar yerinde değerlendirilir. Leke, koku ve toz akarına karşı hızlı kuruyan yöntemlerle uygulama yapılır.`,
          `Koltuk yıkamanın yanı sıra halı yıkama, yatak yıkama ve sandalye/sedir yıkama hizmetleri de aynı ekip tarafından ${side} genelinde sunulur.`,
        ];

    const districtNeighborhoods = getNeighborhoodsByDistrict(district.slug);
    const neighborhoodLinks = districtNeighborhoods.slice(0, 40).map((n) => ({
      href: `/${district.slug}-${n.slug}${MAHALLESI}${isPest ? PEST_SUFFIX : CLEANING_SUFFIX}`,
      label: `${n.name} Mahallesi ${serviceLabel}`,
    }));

    const schema = buildServiceSchema({
      serviceName: serviceLabel,
      description: isPest
        ? `${district.name} bölgesinde profesyonel böcek ve haşere ilaçlama hizmeti.`
        : `${district.name} bölgesinde profesyonel koltuk, halı ve yatak yıkama hizmeti.`,
      districtName: district.name,
    });

    return (
      <div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(schema) }} />

        <Breadcrumbs
          items={[
            { href: "/", label: "Ana Sayfa" },
            { href: "/bolgeler", label: "Hizmet Bölgeleri" },
            { href: `/${paramSlug}`, label: `${district.name} ${serviceLabel}` },
          ]}
        />

        <LocationHero
          eyebrow={`${side} Hizmet Bölgesi`}
          h1={h1}
          paragraphs={paragraphs}
          whatsappHref={buildWhatsappLink(
            `Merhaba, ${district.name} ${serviceLabel.toLowerCase()} hakkında bilgi almak istiyorum.`
          )}
          telHref={buildTelLink()}
        />

        {isPest ? (
          <ServicesGrid
            title={`${district.name} Böcek İlaçlama Hizmetlerimiz`}
            items={services}
            basePath="/hizmetler"
          />
        ) : (
          <ServicesGrid
            title={`${district.name} Koltuk Yıkama Hizmetlerimiz`}
            items={cleaningServices}
            basePath="/hizmetler"
          />
        )}

        <WhyUs
          points={
            isPest
              ? [
                  `${district.name} bölgesine hızlı ekip yönlendirmesi`,
                  "Sağlık Bakanlığı onaylı, insan ve evcil hayvan dostu ürünler",
                  "Uygulama öncesi açık bilgilendirme, sonrası takip önerileri",
                  "Ev, iş yeri ve kurumsal alanlara özel planlama",
                ]
              : [
                  `${district.name} bölgesine hızlı ekip yönlendirmesi`,
                  "Hızlı kuruyan, kokusuz ve güvenli yıkama yöntemleri",
                  "Yerinde keşif ve şeffaf bilgilendirme",
                  "Ev, iş yeri ve kurumsal alanlara özel planlama",
                ]
          }
        />

        <NeighborhoodLinksGrid
          title={`${district.name} Mahallelerinde ${serviceLabel}`}
          items={neighborhoodLinks}
        />

        <section className="mx-auto max-w-3xl px-4 pb-14 text-center text-sm text-slate-500">
          <p>
            {district.name} ilçesine bağlı mahallelerin tamamı için ayrı hizmet
            sayfalarımız bulunur — yukarıdaki listeden mahallenizi seçebilir,
            ayrıca{" "}
            <a href={otherServiceHref} className="text-emerald-700 underline">
              {district.name} {isPest ? "Koltuk Yıkama" : "Böcek İlaçlama"}
            </a>{" "}
            hizmetimize de göz atabilirsiniz.
          </p>
        </section>
      </div>
    );
  }

  // Neighbourhood-level page
  const { neighborhood } = resolved;
  const h1 = `${district.name} ${neighborhood.name} Mahallesi ${serviceLabel}`;
  const paragraphs = isPest
    ? [
        `${district.name} ${neighborhood.name} Mahallesi böcek ilaçlama taleplerinde ${propertyTypesText} tipine göre haşere türü ve yoğunluk yerinde değerlendirilir. ${neighborhood.name} bölgesindeki giriş noktaları ve saklanma alanlarına göre planlı uygulama yapılır.`,
        `${district.name} ${neighborhood.name} böcek ilaçlama hizmetinde hamam böceği, karınca, fare, tahta kurusu ve diğer haşere türlerine karşı Sağlık Bakanlığı onaylı ürünler kullanılır.`,
      ]
    : [
        `${district.name} ${neighborhood.name} Mahallesi koltuk yıkama taleplerinde ${propertyTypesText} tipine göre kumaş ve deri koltuklar yerinde değerlendirilir. ${neighborhood.name} bölgesine hızlı kuruyan yöntemlerle uygulama yapılır.`,
        `${district.name} ${neighborhood.name} koltuk yıkama hizmetinin yanı sıra aynı ekip halı yıkama, yatak yıkama ve sandalye/sedir yıkama hizmetlerini de sunar.`,
      ];

  const schema = buildServiceSchema({
    serviceName: serviceLabel,
    description: isPest
      ? `${district.name} ${neighborhood.name} Mahallesi'nde profesyonel böcek ve haşere ilaçlama hizmeti.`
      : `${district.name} ${neighborhood.name} Mahallesi'nde profesyonel koltuk, halı ve yatak yıkama hizmeti.`,
    districtName: district.name,
    neighborhoodName: neighborhood.name,
  });

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(schema) }} />

      <Breadcrumbs
        items={[
          { href: "/", label: "Ana Sayfa" },
          { href: "/bolgeler", label: "Hizmet Bölgeleri" },
          {
            href: `/${district.slug}${isPest ? PEST_SUFFIX : CLEANING_SUFFIX}`,
            label: `${district.name} ${serviceLabel}`,
          },
          { href: `/${paramSlug}`, label: `${neighborhood.name} Mahallesi` },
        ]}
      />

      <LocationHero
        eyebrow={`${side} · ${district.name}`}
        h1={h1}
        paragraphs={paragraphs}
        whatsappHref={buildWhatsappLink(
          `Merhaba, ${district.name} ${neighborhood.name} Mahallesi ${serviceLabel.toLowerCase()} hakkında bilgi almak istiyorum.`
        )}
        telHref={buildTelLink()}
      />

      {isPest ? (
        <ServicesGrid
          title={`${neighborhood.name} Mahallesi Böcek İlaçlama Hizmetlerimiz`}
          items={services}
          basePath="/hizmetler"
        />
      ) : (
        <ServicesGrid
          title={`${neighborhood.name} Mahallesi Koltuk Yıkama Hizmetlerimiz`}
          items={cleaningServices}
          basePath="/hizmetler"
        />
      )}

      <WhyUs
        points={
          isPest
            ? [
                `${neighborhood.name} Mahallesi'ne hızlı ekip yönlendirmesi`,
                "Sağlık Bakanlığı onaylı, insan ve evcil hayvan dostu ürünler",
                "Uygulama öncesi açık bilgilendirme, sonrası takip önerileri",
                "Ev, iş yeri ve kurumsal alanlara özel planlama",
              ]
            : [
                `${neighborhood.name} Mahallesi'ne hızlı ekip yönlendirmesi`,
                "Hızlı kuruyan, kokusuz ve güvenli yıkama yöntemleri",
                "Yerinde keşif ve şeffaf bilgilendirme",
                "Ev, iş yeri ve kurumsal alanlara özel planlama",
              ]
        }
      />

      <section className="mx-auto max-w-3xl px-4 pb-14 text-center text-sm text-slate-500">
        <p>
          {neighborhood.name} Mahallesi, {district.name} ilçesine bağlıdır.
          Tüm{" "}
          <a
            href={`/${district.slug}${isPest ? PEST_SUFFIX : CLEANING_SUFFIX}`}
            className="text-emerald-700 underline"
          >
            {district.name} {serviceLabel}
          </a>{" "}
          hizmet bölgesine ve diğer mahallelere buradan ulaşabilir, ayrıca{" "}
          <a href={otherServiceHref} className="text-emerald-700 underline">
            {district.name} {neighborhood.name} Mahallesi{" "}
            {isPest ? "Koltuk Yıkama" : "Böcek İlaçlama"}
          </a>{" "}
          hizmetimize de göz atabilirsiniz.
        </p>
      </section>
    </div>
  );
}
