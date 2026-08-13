import Link from "next/link";
import type { Metadata } from "next";
import { services, cleaningServices } from "@/data/services";

export const metadata: Metadata = {
  title: "Hizmetlerimiz",
  description:
    "Hamam böceği, tahta kurusu, fare, karınca ilaçlama ve koltuk / halı / yatak yıkama dahil tüm hizmetlerimizi inceleyin.",
};

export default function ServicesIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-3xl font-extrabold text-slate-900">Hizmetlerimiz</h1>

      <h2 className="mt-10 text-xl font-bold text-slate-900">Böcek İlaçlama</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {services.map((s) => (
          <Link key={s.slug} href={`/hizmetler/${s.slug}`} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-md">
            <span className="text-3xl">{s.icon}</span>
            <h3 className="mt-2 font-bold text-slate-900">{s.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{s.description}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-14 text-xl font-bold text-slate-900">Koltuk Yıkama</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {cleaningServices.map((s) => (
          <Link key={s.slug} href={`/hizmetler/${s.slug}`} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-md">
            <span className="text-3xl">{s.icon}</span>
            <h3 className="mt-2 font-bold text-slate-900">{s.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
