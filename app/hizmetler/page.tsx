import Link from "next/link";
import type { Metadata } from "next";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Hizmetlerimiz",
  description: "Hamam böceği, tahta kurusu, fare, karınca ve daha fazlası için profesyonel böcek ilaçlama hizmetlerimizi inceleyin.",
};

export default function ServicesIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-3xl font-extrabold text-green-950">Böcek İlaçlama Hizmetlerimiz</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {services.map((s) => (
          <Link key={s.slug} href={`/hizmetler/${s.slug}`} className="rounded-2xl border border-slate-200 p-5 hover:border-green-300 hover:shadow-md">
            <span className="text-3xl">{s.icon}</span>
            <h2 className="mt-2 font-bold text-green-950">{s.name}</h2>
            <p className="mt-1 text-sm text-slate-600">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
