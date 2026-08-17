"use client";

import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { districts } from "@/data/districts";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { buildGoogleMapsLinkFrom } from "@/lib/site-settings";

export default function Footer() {
  // Show a handful of districts in the footer for internal linking (SEO)
  // without overwhelming the page — full list lives on /bolgeler.
  const featured = districts.slice(0, 10);
  const settings = useSiteSettings();

  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-900 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.jpg"
                alt={`${siteConfig.companyName} logo`}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <h3 className="text-lg font-bold text-white">{siteConfig.companyName}</h3>
            </div>
            <p className="mt-2 text-sm text-slate-300">{siteConfig.tagline}</p>
            <p className="mt-4 text-sm text-slate-300">
              Sağlık Bakanlığı onaylı biyosidal ürünlerle İstanbul genelinde
              ev, iş yeri ve kurumsal alanlara profesyonel böcek ilaçlama ve
              koltuk yıkama hizmeti sunuyoruz.
            </p>
            <div className="mt-4 flex gap-3 text-sm">
              <a href={settings.instagramUrl} className="text-slate-300 hover:text-white">Instagram</a>
              <a href={settings.facebookUrl} className="text-slate-300 hover:text-white">Facebook</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white">Hizmetlerimiz</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-300">
              <li>
                <Link href="/hizmetler" className="hover:text-white">Böcek İlaçlama</Link>
              </li>
              <li>
                <Link href="/hizmetler/koltuk-yikama" className="hover:text-white">Koltuk Yıkama</Link>
              </li>
              <li>
                <Link href="/hizmetler/sandalye-yikama" className="hover:text-white">Sandalye / Sedir Yıkama</Link>
              </li>
            </ul>

            <h4 className="mt-6 font-semibold text-white">Hizmet Bölgelerimiz</h4>
            <ul className="mt-2 grid grid-cols-2 gap-1 text-sm text-slate-300">
              {featured.map((d) => (
                <li key={d.slug}>
                  <Link href={`/${d.slug}-bocek-ilaclama`} className="hover:text-white">
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/bolgeler" className="mt-2 inline-block text-sm text-emerald-400 underline hover:text-emerald-300">
              Tüm bölgeleri gör →
            </Link>
          </div>

          <div>
            <h4 className="font-semibold text-white">İletişim</h4>
            <p className="mt-2 text-sm text-slate-300">{settings.phoneDisplay}</p>
            {settings.addressStreet ? (
              <a
                href={buildGoogleMapsLinkFrom(settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-slate-300 underline decoration-slate-600 hover:text-white"
              >
                📍 {settings.addressStreet}, {settings.addressCity}
              </a>
            ) : (
              <p className="text-sm text-slate-300">{settings.addressCity}, Türkiye</p>
            )}
            <p className="mt-3 text-xs text-slate-400">
              Sağlık Bakanlığı onaylı ürünler · İstanbul geneli hizmet
            </p>
          </div>
        </div>

        <p className="mt-8 border-t border-slate-800 pt-4 text-xs text-slate-400">
          © {new Date().getFullYear()} {siteConfig.legalName}. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
