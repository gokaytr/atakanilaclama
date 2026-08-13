import type { Metadata } from "next";
import { siteConfig, buildWhatsappLink, buildTelLink } from "@/data/site-config";

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
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a href={buildWhatsappLink()} className="rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800">
          💬 WhatsApp&apos;tan Yazın
        </a>
        <a href={buildTelLink()} className="rounded-full border-2 border-emerald-700 px-6 py-3 font-semibold text-emerald-800 hover:bg-emerald-50">
          ☎ {siteConfig.phoneDisplay}
        </a>
      </div>
    </div>
  );
}
