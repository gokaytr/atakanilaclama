// List of Istanbul districts the company serves.
// Each entry generates a dedicated SEO landing page at /[slug]-bocek-ilaclama
// Adding a new district here automatically creates its page + adds it to the sitemap.

export type District = {
  slug: string; // used in the URL, e.g. "kagithane" -> /kagithane-bocek-ilaclama
  name: string; // display name, e.g. "Kağıthane"
  side: "anadolu" | "avrupa";
};

// Turkish-to-URL-safe slug helper (handles İ/ı/ş/ç/ğ/ö/ü correctly).
export function toSlug(name: string): string {
  const map: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return name
    .split("")
    .map((char) => map[char] ?? char)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const anadoluNames = [
  "Adalar", "Ataşehir", "Beykoz", "Çekmeköy", "Kadıköy", "Kartal",
  "Maltepe", "Pendik", "Sancaktepe", "Sarıyer", "Şile", "Tuzla", "Ümraniye",
];

const avrupaNames = [
  "Arnavutköy", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy",
  "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beyoğlu", "Büyükçekmece",
  "Çatalca", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih",
  "Gaziosmanpaşa", "Güngören", "Kağıthane", "Küçükçekmece", "Silivri",
  "Sultangazi", "Şişli", "Zeytinburnu",
];
// Not: "Beşiktaş" firmanın fiyat listesi görselinde yer almıyordu, bölgesel
// SEO kapsamı geniş tutulduğu için listeye eklendi. Hizmet verilmiyorsa
// bu satırı silebilirsiniz. Üsküdar de aynı şekilde eklenebilir.

export const districts: District[] = [
  ...anadoluNames.map((name) => ({ slug: toSlug(name), name, side: "anadolu" as const })),
  ...avrupaNames.map((name) => ({ slug: toSlug(name), name, side: "avrupa" as const })),
];

export function getDistrictBySlug(slug: string): District | undefined {
  return districts.find((d) => d.slug === slug);
}
