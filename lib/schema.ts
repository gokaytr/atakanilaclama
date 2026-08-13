// Builders for JSON-LD structured data (schema.org). Rendered inside a
// <script type="application/ld+json"> tag on each page. This is what lets
// Google show rich results (business info, FAQs, reviews) in search.
import { siteConfig } from "@/data/site-config";
import { pricingByPlace } from "@/data/services";

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.companyName,
    image: `${siteConfig.domain}/logo.jpg`,
    logo: `${siteConfig.domain}/logo.jpg`,
    telephone: `+${siteConfig.phoneRaw}`,
    priceRange: "₺₺",
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.city,
      addressCountry: "TR",
    },
    areaServed: "İstanbul",
    url: siteConfig.domain,
    sameAs: [siteConfig.social.instagram, siteConfig.social.facebook],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Böcek İlaçlama Fiyat Listesi",
      itemListElement: pricingByPlace.map((p) => ({
        "@type": "Offer",
        priceCurrency: "TRY",
        price: p.priceFrom,
        itemOffered: { "@type": "Service", name: p.name },
      })),
    },
  };
}

export function buildServiceSchema(params: {
  serviceName: string;
  description: string;
  districtName?: string;
  neighborhoodName?: string;
}) {
  const { serviceName, description, districtName, neighborhoodName } = params;
  const areaServed = neighborhoodName && districtName
    ? `${neighborhoodName} Mahallesi, ${districtName}, İstanbul`
    : districtName
      ? `${districtName}, İstanbul`
      : "İstanbul";
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: serviceName,
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.companyName,
      telephone: `+${siteConfig.phoneRaw}`,
    },
    areaServed,
    description,
  };
}

export function buildFaqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// Small component-friendly wrapper: pass this string into a <script> tag.
export function toJsonLd(schema: object): string {
  return JSON.stringify(schema);
}
