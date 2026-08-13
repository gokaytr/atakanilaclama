import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";
import { districts } from "@/data/districts";
import { services } from "@/data/services";

// Auto-generated sitemap.xml — every district and service page is included
// automatically, so adding a new one to the data files is enough to get it
// indexed by Google (submit the sitemap URL in Search Console once).
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/hizmetler", "/bolgeler", "/hakkimizda", "/iletisim"].map((path) => ({
    url: `${siteConfig.domain}${path}`,
    lastModified: new Date(),
  }));

  const districtPages = districts.map((d) => ({
    url: `${siteConfig.domain}/${d.slug}-bocek-ilaclama`,
    lastModified: new Date(),
  }));

  const servicePages = services.map((s) => ({
    url: `${siteConfig.domain}/hizmetler/${s.slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...districtPages, ...servicePages];
}
