"use client";

// Full-bleed autoplay/muted/looping background video hero (DJI-style),
// same on mobile and desktop. Headline, description and CTA buttons are
// overlaid on top with a dark gradient behind them for legibility.
// Video source and overlay text are admin-editable from the panel (falls
// back to the bundled default video + static copy from data/site-config.ts
// so the hero always renders correctly).
import { buildWhatsappLinkFrom, buildTelLinkFrom } from "@/lib/site-settings";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { logClick } from "@/lib/click-tracking";

export default function VideoHero() {
  const settings = useSiteSettings();
  const videoSrc = settings.heroVideoUrl || "/hero-video.mp4";
  // The bundled poster frame only matches the default video — for a
  // custom admin-uploaded video we let the first frame show once loaded.
  const poster = settings.heroVideoUrl ? undefined : "/hero-video-poster.jpg";

  return (
    <section className="relative w-full overflow-hidden bg-slate-900">
      <div className="relative h-[80vh] min-h-[460px] w-full sm:h-[85vh] md:h-[620px]">
        <video
          key={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover object-center"
          aria-hidden="true"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Dark gradient so white text stays readable over any frame */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/65" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <p className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/30 backdrop-blur">
            {settings.heroBadge}
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight text-white drop-shadow md:text-5xl">
            {settings.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-white/90">
            {settings.heroDescription}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={buildWhatsappLinkFrom(settings)}
              onClick={() => logClick("whatsapp")}
              className="rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-500"
            >
              💬 WhatsApp&apos;tan Yazın
            </a>
            <a
              href={buildTelLinkFrom(settings)}
              onClick={() => logClick("phone")}
              className="rounded-full border-2 border-white px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              ☎ {settings.phoneDisplay}
            </a>
            <a
              href="#fiyatlar"
              className="rounded-full bg-white/90 px-6 py-3 font-semibold text-emerald-800 hover:bg-white"
            >
              💰 Fiyat Listesini Gör
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
