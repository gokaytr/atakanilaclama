"use client";

import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { buildTelLinkFrom, buildWhatsappLinkFrom } from "@/lib/site-settings";

// Live WhatsApp/phone buttons for the /iletisim page — split out from the
// page itself (a server component, so it can keep exporting `metadata`).
export default function ContactCta() {
  const settings = useSiteSettings();

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      <a
        href={buildWhatsappLinkFrom(settings)}
        className="rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
      >
        💬 WhatsApp&apos;tan Yazın
      </a>
      <a
        href={buildTelLinkFrom(settings)}
        className="rounded-full border-2 border-emerald-700 px-6 py-3 font-semibold text-emerald-800 hover:bg-emerald-50"
      >
        ☎ {settings.phoneDisplay}
      </a>
    </div>
  );
}
