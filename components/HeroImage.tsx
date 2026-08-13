"use client";

// The homepage's first image. Uses the admin-uploaded hero image if one has
// been set in the panel; otherwise falls back to the bundled price-list
// flyer (/fiyat-listesi.jpg) so the page always looks right out of the box.
import Image from "next/image";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

const FALLBACK_SRC = "/fiyat-listesi.jpg";
const FALLBACK_ALT = "Çevre Sağlığı Böcek İlaçlama fiyat listesi";

export default function HeroImage() {
  const settings = useSiteSettings();
  const src = settings.heroImageUrl || FALLBACK_SRC;
  const isCustom = Boolean(settings.heroImageUrl);

  return (
    <section className="w-full bg-emerald-50">
      {/* Mobile / tablet — full, uncropped image */}
      <div className="mx-auto flex justify-center px-4 py-3 md:hidden">
        <Image
          src={src}
          alt={FALLBACK_ALT}
          width={1024}
          height={1536}
          priority
          unoptimized={isCustom}
          sizes="100vw"
          className="h-auto w-full max-w-[250px] rounded-2xl object-contain shadow-md"
        />
      </div>

      {/* Desktop — wide slider-style banner, top-cropped */}
      <div className="mx-auto hidden justify-center px-4 py-4 md:flex">
        <div className="relative h-[470px] w-full max-w-4xl overflow-hidden rounded-2xl shadow-md">
          <Image
            src={src}
            alt={FALLBACK_ALT}
            fill
            priority
            unoptimized={isCustom}
            sizes="896px"
            className="object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}
