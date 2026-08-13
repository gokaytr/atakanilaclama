// Pest/service catalogue used to generate SEO landing pages at /hizmetler/[slug]
// Prices are "starting from" (başlangıç fiyatı) as provided in the company price list.
// Update priceFrom values here if the owner changes pricing.

export type ServiceCategory = {
  slug: string;
  name: string;
  icon: string; // emoji used as a lightweight visual, no image asset needed
  description: string;
  priceFrom?: number; // TL, optional (pest-type pages may not need a price)
};

// Pricing by place type (from the price list flyer).
export const pricingByPlace = [
  { name: "Ev İlaçlama", icon: "🏠", priceFrom: 2000 },
  { name: "Bina / Apartman İlaçlama", icon: "🏢", priceFrom: 3000 },
  { name: "İş Yeri / Dükkan İlaçlama", icon: "🏪", priceFrom: 3500 },
  { name: "Lokanta / Restoran İlaçlama", icon: "🍽️", priceFrom: 3500 },
  { name: "Fabrika / Depo İlaçlama", icon: "🏭", priceFrom: 4000 },
];

// Pest types (from "Hedef Aldığımız Haşereler").
export const services: ServiceCategory[] = [
  {
    slug: "hamam-bocegi-ilaclama",
    name: "Hamam Böceği İlaçlama",
    icon: "🪳",
    description:
      "Mutfak, banyo, gider ve cihaz çevrelerindeki saklanma ve geçiş noktaları uzman ekip tarafından kontrol edilir.",
  },
  {
    slug: "karinca-ilaclama",
    name: "Karınca İlaçlama",
    icon: "🐜",
    description:
      "Yuva, beslenme yolu ve bina içine giriş güzergahları belirlenerek hedef odaklı uygulama planı hazırlanır.",
  },
  {
    slug: "fare-ilaclama",
    name: "Fare İlaçlama",
    icon: "🐭",
    description:
      "Giriş delikleri, kemirme izleri ve yuvalanma alanları incelenerek güvenli kemirgen kontrolü sağlanır.",
  },
  {
    slug: "pire-ilaclama",
    name: "Pire İlaçlama",
    icon: "🦗",
    description:
      "Halı, koltuk, zemin birleşimleri ve evcil hayvan alanları yaşam döngüsüne göre değerlendirilir.",
  },
  {
    slug: "tahta-kurusu-ilaclama",
    name: "Tahta Kurusu İlaçlama",
    icon: "🪲",
    description:
      "Yatak, baza, başlık ve koltuk çevresinde ayrıntılı alan değerlendirmesiyle kalıcı çözüm uygulanır.",
  },
  {
    slug: "orumcek-ilaclama",
    name: "Örümcek İlaçlama",
    icon: "🕷️",
    description:
      "Tavan araları, bodrum, depo ve dış cephe köşelerinde örümcek ağı ve yuvalanma noktaları kontrol edilir.",
  },
  {
    slug: "sivrisinek-ilaclama",
    name: "Sivrisinek İlaçlama",
    icon: "🦟",
    description:
      "Üreme alanları, su birikintileri ve dış ortam bağlantıları değerlendirilerek uygulama yapılır.",
  },
  {
    slug: "akrep-ilaclama",
    name: "Akrep İlaçlama",
    icon: "🦂",
    description:
      "Bahçe, bodrum, depo ve dış duvar diplerinde akrep giriş noktaları tespit edilerek önlem alınır.",
  },
];

export function getServiceBySlug(slug: string): ServiceCategory | undefined {
  return services.find((s) => s.slug === slug);
}
