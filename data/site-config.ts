// Central configuration for company/brand information.
// Edit this file to update contact details across the entire site.

export const siteConfig = {
  companyName: "Çevre Sağlığı Böcek İlaçlama",
  legalName: "Çevre Sağlığı Böcek İlaçlama (Atakan Koltuk Yıkama)",
  tagline: "Haşereden kurtul, güvende hisset!",
  slogan: "Temizlik, Sağlık, Hijyen",

  // Primary contact number, used for both phone calls and WhatsApp links.
  phoneDisplay: "0 551 598 92 53",
  phoneRaw: "905515989253", // international format without "+", used in tel:/wa.me links

  // Admin email addresses that receive lead notifications.
  adminEmails: ["doganay9553@gmail.com", "gokayterzi@gmail.com"],

  // Public-facing site domain (update once the domain is purchased/connected).
  domain: "https://www.bocekilaclama.com.tr",

  social: {
    instagram: "https://instagram.com/cevresaglik.ilaclama",
    facebook: "https://facebook.com/cevresaglik.ilaclama",
  },

  address: {
    city: "İstanbul",
    // Fill in exact street address once confirmed with the business owner.
    street: "",
  },

  // Default WhatsApp message shown when a visitor taps the floating button.
  defaultWhatsappMessage:
    "Merhaba, böcek ilaçlama hizmeti hakkında bilgi almak istiyorum.",
} as const;

// Helper to build a WhatsApp deep link with a prefilled message.
export function buildWhatsappLink(message?: string): string {
  const text = encodeURIComponent(message ?? siteConfig.defaultWhatsappMessage);
  return `https://wa.me/${siteConfig.phoneRaw}?text=${text}`;
}

export function buildTelLink(): string {
  return `tel:+${siteConfig.phoneRaw}`;
}
