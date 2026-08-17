"use client";

// Small client island for the homepage's closing CTA section (kept out of
// the server-rendered page.tsx just so the click-tracking onClick handlers
// can attach) — everything else on that page stays static for SEO.
import { siteConfig, buildWhatsappLink, buildTelLink } from "@/data/site-config";
import { logClick } from "@/lib/click-tracking";

export default function FinalCtaButtons() {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      <a
        href={buildWhatsappLink()}
        onClick={() => logClick("whatsapp")}
        className="rounded-full bg-white px-6 py-3 font-semibold text-emerald-800 hover:bg-emerald-50"
      >
        💬 WhatsApp&apos;tan Yazın
      </a>
      <a
        href={buildTelLink()}
        onClick={() => logClick("phone")}
        className="rounded-full border-2 border-white px-6 py-3 font-semibold text-white hover:bg-emerald-800"
      >
        ☎ {siteConfig.phoneDisplay}
      </a>
    </div>
  );
}
