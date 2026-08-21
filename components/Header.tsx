"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site-config";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { buildTelLinkFrom } from "@/lib/site-settings";
import { logClick } from "@/lib/click-tracking";

const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hizmetler", label: "Hizmetlerimiz" },
  { href: "/hizmetler/koltuk-yikama", label: "Koltuk Yıkama" },
  { href: "/bolgeler", label: "Hizmet Bölgeleri" },
  { href: "/#fiyatlar", label: "Fiyat Listesi" },
  { href: "/blog", label: "Faydalı Bilgiler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const settings = useSiteSettings();
  const telLink = buildTelLinkFrom(settings);

  // Logo/brand click: if we're already on the homepage (very common on
  // mobile after scrolling down), a same-route Link click does nothing by
  // default — so explicitly scroll back to the top instead. Otherwise let
  // the Link's normal navigation to "/" happen.
  function handleLogoClick(e: React.MouseEvent) {
    setOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Admin panel has its own dedicated sidebar shell — the public marketing
  // header shouldn't appear there.
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2" onClick={handleLogoClick}>
          <Image
            src="/logo.jpg"
            alt={`${siteConfig.companyName} logo`}
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
            priority
          />
          <span className="text-lg font-bold text-slate-900">
            {siteConfig.companyName}
          </span>
        </Link>

        {/* Desktop navigation — hidden on small screens */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-emerald-700">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={telLink}
            onClick={() => logClick("phone", settings.googleAdsPhoneConversion)}
            className="hidden rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 md:inline-block"
          >
            {settings.phoneDisplay}
          </a>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700 md:hidden"
          >
            {open ? (
              <span className="text-xl leading-none">✕</span>
            ) : (
              <span className="flex flex-col gap-1">
                <span className="block h-0.5 w-5 bg-slate-700" />
                <span className="block h-0.5 w-5 bg-slate-700" />
                <span className="block h-0.5 w-5 bg-slate-700" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile slide-down panel — solid background, high-contrast text,
          generous tap targets so it's easy to use with a thumb. */}
      {open && (
        <nav className="border-t border-slate-200 bg-white md:hidden">
          <ul className="flex flex-col divide-y divide-slate-100">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3.5 text-base font-medium text-slate-800 hover:bg-emerald-50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="px-4 py-3.5">
              <a
                href={telLink}
                onClick={() => logClick("phone", settings.googleAdsPhoneConversion)}
                className="block rounded-full bg-emerald-700 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                {settings.phoneDisplay}
              </a>
            </li>
            {(settings.instagramUrl || settings.facebookUrl || settings.youtubeUrl) && (
              <li className="flex justify-center gap-5 px-4 py-3.5 text-sm font-medium text-slate-600">
                {settings.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700">
                    Instagram
                  </a>
                )}
                {settings.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700">
                    Facebook
                  </a>
                )}
                {settings.youtubeUrl && (
                  <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700">
                    YouTube
                  </a>
                )}
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
