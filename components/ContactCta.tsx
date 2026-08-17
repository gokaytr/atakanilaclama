"use client";

import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { buildGoogleMapsLinkFrom, buildTelLinkFrom, buildWhatsappLinkFrom } from "@/lib/site-settings";
import { logClick } from "@/lib/click-tracking";

// Live WhatsApp/phone/address block for the /iletisim page — split out
// from the page itself (a server component, so it can keep exporting
// `metadata`).
export default function ContactCta() {
  const settings = useSiteSettings();

  return (
    <>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a
          href={buildWhatsappLinkFrom(settings)}
          onClick={() => logClick("whatsapp", settings.googleAdsWhatsappConversion)}
          className="rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          💬 WhatsApp&apos;tan Yazın
        </a>
        <a
          href={buildTelLinkFrom(settings)}
          onClick={() => logClick("phone", settings.googleAdsPhoneConversion)}
          className="rounded-full border-2 border-emerald-700 px-6 py-3 font-semibold text-emerald-800 hover:bg-emerald-50"
        >
          ☎ {settings.phoneDisplay}
        </a>
      </div>

      {settings.addressStreet && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Adresimiz</p>
          <p className="mt-1 text-sm text-slate-600">
            {settings.addressStreet}, {settings.addressCity}
          </p>
          <a
            href={buildGoogleMapsLinkFrom(settings)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 underline"
          >
            📍 Google Haritada Bul
          </a>
        </div>
      )}
    </>
  );
}
