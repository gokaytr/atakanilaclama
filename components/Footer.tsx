"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site-config";
import { districts } from "@/data/districts";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { buildGoogleMapsLinkFrom } from "@/lib/site-settings";

export default function Footer() {
  // Show a handful of districts in the footer for internal linking (SEO)
  // without overwhelming the page — full list lives on /bolgeler.
  const featured = districts.slice(0, 10);
  const settings = useSiteSettings();
  const pathname = usePathname();

  // Admin panel has its own dedicated sidebar shell.
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-900 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-10 divide-y divide-slate-800 text-center md:grid-cols-4 md:gap-8 md:divide-y-0 md:text-left">
          <div className="md:col-span-2">
            <div className="flex flex-col items-center gap-3 md:flex-row md:items-center">
              <Image
                src="/logo.jpg"
                alt={`${siteConfig.companyName} logo`}
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover"
              />
              <h3 className="text-lg font-bold text-white">{siteConfig.companyName}</h3>
            </div>
            <p className="mt-3 text-sm text-slate-300">{siteConfig.tagline}</p>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-slate-400 md:mx-0 md:max-w-none">
              Sağlık Bakanlığı onaylı biyosidal ürünlerle İstanbul genelinde
              ev, iş yeri ve kurumsal alanlara profesyonel böcek ilaçlama ve
              koltuk yıkama hizmeti sunuyoruz.
            </p>
          </div>

          <div className="pt-10 md:pt-0">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Hizmetlerimiz</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/hizmetler" className="hover:text-emerald-400">Böcek İlaçlama</Link>
              </li>
              <li>
                <Link href="/hizmetler/koltuk-yikama" className="hover:text-emerald-400">Koltuk Yıkama</Link>
              </li>
              <li>
                <Link href="/hizmetler/sandalye-yikama" className="hover:text-emerald-400">Sandalye / Sedir Yıkama</Link>
              </li>
            </ul>

            <h4 className="mt-7 text-sm font-semibold uppercase tracking-wide text-white">Hizmet Bölgelerimiz</h4>
            <ul className="mx-auto mt-3 grid max-w-xs grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-300 md:mx-0 md:max-w-none">
              {featured.map((d) => (
                <li key={d.slug}>
                  <Link href={`/${d.slug}-bocek-ilaclama`} className="hover:text-emerald-400">
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/bolgeler" className="mt-3 inline-block text-sm font-medium text-emerald-400 hover:text-emerald-300">
              Tüm bölgeleri gör →
            </Link>
          </div>

          <div className="pt-10 md:pt-0">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">İletişim</h4>
            <p className="mt-3 text-sm text-slate-300">{settings.phoneDisplay}</p>
            {settings.addressStreet ? (
              <a
                href={buildGoogleMapsLinkFrom(settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto mt-2 block max-w-xs text-sm text-slate-300 underline decoration-slate-600 hover:text-emerald-400 md:mx-0 md:max-w-none"
              >
                📍 {settings.addressStreet}, {settings.addressCity}
              </a>
            ) : (
              <p className="text-sm text-slate-300">{settings.addressCity}, Türkiye</p>
            )}
            <p className="mx-auto mt-4 max-w-xs text-xs text-slate-500 md:mx-0 md:max-w-none">
              Sağlık Bakanlığı onaylı ürünler · İstanbul geneli hizmet
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-slate-800 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-center text-xs text-slate-500 md:text-left">
            © {new Date().getFullYear()} {siteConfig.legalName}. Tüm hakları saklıdır.
          </p>

          {(settings.instagramUrl || settings.facebookUrl || settings.youtubeUrl) && (
            <div className="flex gap-3">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M12 2c-2.72 0-3.06.01-4.12.06-1.06.05-1.79.22-2.43.47-.66.26-1.22.6-1.77 1.15A4.9 4.9 0 0 0 2.53 5.45c-.25.64-.42 1.37-.47 2.43C2.01 8.94 2 9.28 2 12s.01 3.06.06 4.12c.05 1.06.22 1.79.47 2.43.26.66.6 1.22 1.15 1.77a4.9 4.9 0 0 0 1.77 1.15c.64.25 1.37.42 2.43.47C8.94 21.99 9.28 22 12 22s3.06-.01 4.12-.06c1.06-.05 1.79-.22 2.43-.47a4.9 4.9 0 0 0 1.77-1.15 4.9 4.9 0 0 0 1.15-1.77c.25-.64.42-1.37.47-2.43.05-1.06.06-1.4.06-4.12s-.01-3.06-.06-4.12c-.05-1.06-.22-1.79-.47-2.43a4.9 4.9 0 0 0-1.15-1.77A4.9 4.9 0 0 0 18.55 2.53c-.64-.25-1.37-.42-2.43-.47C15.06 2.01 14.72 2 12 2Zm0 1.8c2.67 0 2.99.01 4.04.06.98.04 1.5.2 1.86.34.47.18.8.4 1.15.75.35.35.57.68.75 1.15.14.36.3.88.34 1.86.05 1.05.06 1.37.06 4.04s-.01 2.99-.06 4.04c-.04.98-.2 1.5-.34 1.86-.18.47-.4.8-.75 1.15-.35.35-.68.57-1.15.75-.36.14-.88.3-1.86.34-1.05.05-1.37.06-4.04.06s-2.99-.01-4.04-.06c-.98-.04-1.5-.2-1.86-.34a3.1 3.1 0 0 1-1.15-.75 3.1 3.1 0 0 1-.75-1.15c-.14-.36-.3-.88-.34-1.86-.05-1.05-.06-1.37-.06-4.04s.01-2.99.06-4.04c.04-.98.2-1.5.34-1.86.18-.47.4-.8.75-1.15.35-.35.68-.57 1.15-.75.36-.14.88-.3 1.86-.34C9.01 3.81 9.33 3.8 12 3.8Zm0 3.05a5.15 5.15 0 1 0 0 10.3 5.15 5.15 0 0 0 0-10.3Zm0 8.5a3.35 3.35 0 1 1 0-6.7 3.35 3.35 0 0 1 0 6.7Zm5.36-8.7a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
                  </svg>
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93V8.55c0-.86.24-1.44 1.47-1.44h1.57V4.46A21 21 0 0 0 14.2 4.3c-2.24 0-3.78 1.37-3.78 3.87v2.27H7.86v2.96h2.56V21h3.08Z" />
                  </svg>
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
