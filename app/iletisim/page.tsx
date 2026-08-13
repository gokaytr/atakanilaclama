import type { Metadata } from "next";
import ContactCta from "@/components/ContactCta";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Böcek ilaçlama veya koltuk yıkama talebiniz için bize WhatsApp veya telefon üzerinden ulaşın.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 text-center">
      <h1 className="text-3xl font-extrabold text-slate-900">İletişim</h1>
      <p className="mt-4 text-slate-600">
        Gördüğünüz haşere türünü veya koltuk/halı yıkama ihtiyacınızı, alan
        tipini ve bulunduğunuz ilçe/mahalleyi paylaşın; uygun uygulama planı
        için hızlıca destek alın.
      </p>
      <ContactCta />
    </div>
  );
}
