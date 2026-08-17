// Live, admin-editable site content (contact info, hero image, promo
// video), stored in the single-row `site_settings` table in Supabase.
// Everything here has a static fallback from data/site-config.ts, so the
// site renders correctly even before Supabase is configured or before the
// admin has changed anything.
import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/data/site-config";

export type SiteSettings = {
  phoneDisplay: string;
  phoneRaw: string;
  whatsappMessage: string;
  addressCity: string;
  addressStreet: string;
  instagramUrl: string;
  facebookUrl: string;
  heroImageUrl: string | null;
  promoVideoUrl: string | null;
};

export const defaultSiteSettings: SiteSettings = {
  phoneDisplay: siteConfig.phoneDisplay,
  phoneRaw: siteConfig.phoneRaw,
  whatsappMessage: siteConfig.defaultWhatsappMessage,
  addressCity: siteConfig.address.city,
  addressStreet: siteConfig.address.street,
  instagramUrl: siteConfig.social.instagram,
  facebookUrl: siteConfig.social.facebook,
  heroImageUrl: null,
  promoVideoUrl: null,
};

type SiteSettingsRow = {
  phone_display: string;
  phone_raw: string;
  whatsapp_message: string;
  address_city: string;
  address_street: string;
  instagram_url: string;
  facebook_url: string;
  hero_image_url: string | null;
  promo_video_url: string | null;
};

// Fetches the live settings row. Returns the static defaults on any error
// (no Supabase configured yet, network issue, row missing, etc.) so callers
// never have to special-case failure.
export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings")
    .select(
      "phone_display, phone_raw, whatsapp_message, address_city, address_street, instagram_url, facebook_url, hero_image_url, promo_video_url"
    )
    .eq("id", 1)
    .maybeSingle<SiteSettingsRow>();

  if (error || !data) return defaultSiteSettings;

  return {
    phoneDisplay: data.phone_display || defaultSiteSettings.phoneDisplay,
    phoneRaw: data.phone_raw || defaultSiteSettings.phoneRaw,
    whatsappMessage: data.whatsapp_message || defaultSiteSettings.whatsappMessage,
    addressCity: data.address_city || defaultSiteSettings.addressCity,
    addressStreet: data.address_street ?? defaultSiteSettings.addressStreet,
    instagramUrl: data.instagram_url || defaultSiteSettings.instagramUrl,
    facebookUrl: data.facebook_url || defaultSiteSettings.facebookUrl,
    heroImageUrl: data.hero_image_url || null,
    promoVideoUrl: data.promo_video_url || null,
  };
}

export function buildWhatsappLinkFrom(settings: SiteSettings, message?: string): string {
  const text = encodeURIComponent(message ?? settings.whatsappMessage);
  return `https://wa.me/${settings.phoneRaw}?text=${text}`;
}

export function buildTelLinkFrom(settings: SiteSettings): string {
  return `tel:+${settings.phoneRaw}`;
}

// Opens a Google Maps search for the business address.
export function buildGoogleMapsLinkFrom(settings: SiteSettings): string {
  const query = `${settings.addressStreet}, ${settings.addressCity}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
