"use client";

// Optional promo video section — only renders once the admin has set a
// YouTube/Vimeo link in the panel. Placed lower on the homepage so it
// never disturbs the hero/ticker/CTA layout tuned to fit the first
// viewport.
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { toEmbedUrl } from "@/lib/video-embed";

export default function PromoVideoSection() {
  const settings = useSiteSettings();
  if (!settings.promoVideoUrl) return null;

  const embedUrl = toEmbedUrl(settings.promoVideoUrl);
  if (!embedUrl) return null;

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="text-center text-2xl font-extrabold text-slate-900">Tanıtım Videomuz</h2>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 shadow-md">
          <div className="relative aspect-video w-full">
            <iframe
              src={embedUrl}
              title="Tanıtım videosu"
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
