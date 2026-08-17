"use client";

import { usePathname } from "next/navigation";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { buildTelLinkFrom, buildWhatsappLinkFrom } from "@/lib/site-settings";
import { logClick } from "@/lib/click-tracking";

// Fixed bottom bar, always reachable with the thumb on mobile — this is
// the single highest-converting element on pest-control sites, so it
// stays visible on every page and every scroll position.
export default function FloatingActionBar() {
  const settings = useSiteSettings();
  const pathname = usePathname();

  // Admin panel has its own dedicated sidebar shell.
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex border-t border-black/10 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.08)] md:hidden">
      <a
        href={buildWhatsappLinkFrom(settings)}
        onClick={() => logClick("whatsapp")}
        className="flex flex-1 items-center justify-center gap-2 bg-emerald-600 py-3 text-sm font-semibold text-white active:bg-emerald-700"
      >
        💬 WhatsApp
      </a>
      <a
        href={buildTelLinkFrom(settings)}
        onClick={() => logClick("phone")}
        className="flex flex-1 items-center justify-center gap-2 bg-slate-800 py-3 text-sm font-semibold text-white active:bg-slate-900"
      >
        ☎ {settings.phoneDisplay}
      </a>
    </div>
  );
}
