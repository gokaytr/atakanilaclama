import Link from "next/link";
import type { Metadata } from "next";
import { districts } from "@/data/districts";
import { getNeighborhoodsByDistrict } from "@/data/neighborhoods";

export const metadata: Metadata = {
  title: "Hizmet Bölgelerimiz",
  description:
    "İstanbul Anadolu ve Avrupa yakasında hizmet verdiğimiz tüm 39 ilçe — böcek ilaçlama ve koltuk yıkama için ilçenizi seçin.",
};

export default function DistrictsIndexPage() {
  const anadolu = districts.filter((d) => d.side === "anadolu");
  const avrupa = districts.filter((d) => d.side === "avrupa");

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-3xl font-extrabold text-slate-900">İstanbul Hizmet Bölgelerimiz</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        İstanbul&apos;un 39 ilçesinin tamamında böcek ilaçlama ve koltuk
        yıkama hizmeti veriyoruz. Her ilçenin sayfasında o ilçeye bağlı
        mahallelere özel hizmet sayfalarına da ulaşabilirsiniz.
      </p>

      {[
        { label: "Anadolu Yakası", items: anadolu },
        { label: "Avrupa Yakası", items: avrupa },
      ].map((group) => (
        <div key={group.label} className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">{group.label}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((d) => {
              const neighborhoodCount = getNeighborhoodsByDistrict(d.slug).length;
              return (
                <div key={d.slug} className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="font-semibold text-slate-900">{d.name}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm">
                    <Link
                      href={`/${d.slug}-bocek-ilaclama`}
                      className="rounded-full border border-emerald-200 px-3 py-1 text-emerald-900 hover:bg-emerald-50"
                    >
                      Böcek İlaçlama
                    </Link>
                    <Link
                      href={`/${d.slug}-koltuk-yikama`}
                      className="rounded-full border border-emerald-200 px-3 py-1 text-emerald-900 hover:bg-emerald-50"
                    >
                      Koltuk Yıkama
                    </Link>
                  </div>
                  {neighborhoodCount > 0 && (
                    <p className="mt-2 text-xs text-slate-500">
                      {neighborhoodCount} mahalleye özel sayfa —{" "}
                      <Link href={`/${d.slug}-bocek-ilaclama`} className="underline hover:text-emerald-700">
                        mahalleleri gör
                      </Link>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
