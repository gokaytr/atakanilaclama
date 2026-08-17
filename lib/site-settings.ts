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
  youtubeUrl: string;
  heroImageUrl: string | null;
  promoVideoUrl: string | null;
  googleTagId: string | null;
  googleAdsWhatsappConversion: string | null;
  googleAdsPhoneConversion: string | null;
  heroVideoUrl: string | null;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
};

export const defaultSiteSettings: SiteSettings = {
  phoneDisplay: siteConfig.phoneDisplay,
  phoneRaw: siteConfig.phoneRaw,
  whatsappMessage: siteConfig.defaultWhatsappMessage,
  addressCity: siteConfig.address.city,
  addressStreet: siteConfig.address.street,
  instagramUrl: siteConfig.social.instagram,
  facebookUrl: siteConfig.social.facebook,
  youtubeUrl: "",
  heroImageUrl: null,
  promoVideoUrl: null,
  googleTagId: null,
  googleAdsWhatsappConversion: null,
  googleAdsPhoneConversion: null,
  heroVideoUrl: null,
  heroBadge: siteConfig.slogan,
  heroTitle: siteConfig.tagline,
  heroDescription: `${siteConfig.legalName} olarak İstanbul genelinde ev, apartman, iş yeri ve site tipi tüm alanlara profesyonel böcek ilaçlama ve koltuk yıkama hizmeti sunuyoruz.`,
};

type SiteSettingsRow = {
  phone_display: string;
  phone_raw: string;
  whatsapp_message: string;
  address_city: string;
  address_street: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string | null;
  hero_image_url: string | null;
  promo_video_url: string | null;
  google_tag_id: string | null;
  google_ads_whatsapp_conversion: string | null;
  google_ads_phone_conversion: string | null;
  hero_video_url: string | null;
  hero_badge: string | null;
  hero_title: string | null;
  hero_description: string | null;
};

// Fetches the live settings row. Returns the static defaults on any error
// (no Supabase configured yet, network issue, row missing, etc.) so callers
// never have to special-case failure.
export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings")
    .select(
      "phone_display, phone_raw, whatsapp_message, address_city, address_street, instagram_url, facebook_url, youtube_url, hero_image_url, promo_video_url, google_tag_id, google_ads_whatsapp_conversion, google_ads_phone_conversion, hero_video_url, hero_badge, hero_title, hero_description"
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
    instagramUrl: data.instagram_url ?? defaultSiteSettings.instagramUrl,
    facebookUrl: data.facebook_url ?? defaultSiteSettings.facebookUrl,
    youtubeUrl: data.youtube_url ?? defaultSiteSettings.youtubeUrl,
    heroImageUrl: data.hero_image_url || null,
    promoVideoUrl: data.promo_video_url || null,
    googleTagId: data.google_tag_id || null,
    googleAdsWhatsappConversion: data.google_ads_whatsapp_conversion || null,
    googleAdsPhoneConversion: data.google_ads_phone_conversion || null,
    heroVideoUrl: data.hero_video_url || null,
    heroBadge: data.hero_badge || defaultSiteSettings.heroBadge,
    heroTitle: data.hero_title || defaultSiteSettings.heroTitle,
    heroDescription: data.hero_description || defaultSiteSettings.heroDescription,
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
