import type { Metadata } from "next";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "İstanbul genelinde profesyonel, Sağlık Bakanlığı onaylı böcek ilaçlama hizmeti.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-extrabold text-green-950">Hakkımızda</h1>
      <p className="mt-4 text-slate-700">
        {siteConfig.legalName} olarak İstanbul genelinde ev, iş yeri, apartman,
        site, depo, fabrika, restoran ve kurumsal alanlara profesyonel haşere
        ilaçlama hizmeti sunuyoruz. Sağlık Bakanlığı onaylı biyosidal
        ürünlerle, insan ve evcil hayvan sağlığını gözeterek güvenli ve kalıcı
        uygulamalar yapıyoruz.
      </p>
    </div>
  );
}
