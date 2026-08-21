import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";
import { districts } from "@/data/districts";
import { neighborhoods } from "@/data/neighborhoods";
import { services, cleaningServices } from "@/data/services";
import { fetchPublishedArticles } from "@/lib/articles";

const PEST_SUFFIX = "-bocek-ilaclama";
const CLEANING_SUFFIX = "-koltuk-yikama";
const MAHALLESI = "-mahallesi";

// Auto-generated sitemap.xml — every district, neighbourhood (mahalle) and
// service page is included automatically, so adding a new one to the data
// files is enough to get it indexed by Google (submit the sitemap URL in
// Search Console once). Total URL count stays well under the 50,000 cap
// for a single sitemap, so no sitemap index is needed.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["", "/hizmetler", "/bolgeler", "/hakkimizda", "/iletisim", "/blog"].map((path) => ({
    url: `${siteConfig.domain}${path}`,
    lastModified: new Date(),
  }));

  const articles = await fetchPublishedArticles();
  const articlePages = articles.map((a) => ({
    url: `${siteConfig.domain}/blog/${a.slug}`,
    lastModified: new Date(a.updatedAt),
  }));

  const districtPages = districts.flatMap((d) => [
    { url: `${siteConfig.domain}/${d.slug}${PEST_SUFFIX}`, lastModified: new Date() },
    { url: `${siteConfig.domain}/${d.slug}${CLEANING_SUFFIX}`, lastModified: new Date() },
  ]);

  const neighborhoodPages = neighborhoods.flatMap((n) => [
    {
      url: `${siteConfig.domain}/${n.districtSlug}-${n.slug}${MAHALLESI}${PEST_SUFFIX}`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.domain}/${n.districtSlug}-${n.slug}${MAHALLESI}${CLEANING_SUFFIX}`,
      lastModified: new Date(),
    },
  ]);

  const servicePages = [...services, ...cleaningServices].map((s) => ({
    url: `${siteConfig.domain}/hizmetler/${s.slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...districtPages, ...neighborhoodPages, ...servicePages, ...articlePages];
}
