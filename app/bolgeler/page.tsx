import Link from "next/link";
import type { Metadata } from "next";
import { districts } from "@/data/districts";

export const metadata: Metadata = {
  title: "Hizmet Bölgelerimiz",
  description: "İstanbul Anadolu ve Avrupa yakasında hizmet verdiğimiz tüm ilçeler.",
};

export default function DistrictsIndexPage() {
  const anadolu = districts.filter((d) => d.side === "anadolu");
  const avrupa = districts.filter((d) => d.side === "avrupa");

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-3xl font-extrabold text-green-950">İstanbul Hizmet Bölgelerimiz</h1>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-semibold text-green-800">Anadolu Yakası</h2>
          <div className="flex flex-wrap gap-2">
            {anadolu.map((d) => (
              <Link key={d.slug} href={`/${d.slug}-bocek-ilaclama`} className="rounded-full border border-green-200 px-3 py-1 text-sm text-green-900 hover:bg-green-50">
                {d.name} Böcek İlaçlama
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold text-green-800">Avrupa Yakası</h2>
          <div className="flex flex-wrap gap-2">
            {avrupa.map((d) => (
              <Link key={d.slug} href={`/${d.slug}-bocek-ilaclama`} className="rounded-full border border-green-200 px-3 py-1 text-sm text-green-900 hover:bg-green-50">
                {d.name} Böcek İlaçlama
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
