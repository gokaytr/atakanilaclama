import Link from "next/link";

// Shared building blocks reused across every district/neighbourhood SEO
// landing page (pest control + upholstery cleaning, district + mahalle
// level) so the JSX isn't duplicated four times over in app/[slug]/page.tsx.

type GridItem = {
  slug: string;
  name: string;
  icon: string;
  description?: string;
};

export function ServicesGrid({
  title,
  items,
  basePath,
}: {
  title: string;
  items: GridItem[];
  basePath: string;
}) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`${basePath}/${item.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow-sm"
          >
            <span className="text-2xl">{item.icon}</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{item.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function WhyUs({ points }: { points: string[] }) {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-14">
      <h2 className="text-xl font-bold text-slate-900">Neden Bizi Tercih Etmelisiniz?</h2>
      <ul className="mt-4 space-y-2 text-slate-700">
        {points.map((point) => (
          <li key={point} className="flex gap-2">
            <span className="text-emerald-700">✓</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LocationHero({
  eyebrow,
  h1,
  paragraphs,
  whatsappHref,
  telHref,
}: {
  eyebrow: string;
  h1: string;
  paragraphs: string[];
  whatsappHref: string;
  telHref: string;
}) {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-emerald-50 to-white px-4 py-14 text-center">
      <p className="mx-auto mb-3 w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
        {eyebrow}
      </p>
      <h1 className="mx-auto max-w-3xl text-3xl font-extrabold text-slate-900 md:text-4xl">
        {h1}
      </h1>
      <div className="mx-auto mt-4 max-w-2xl space-y-3 text-slate-600">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a
          href={whatsappHref}
          className="rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
        >
          💬 WhatsApp&apos;tan Yazın
        </a>
        <a
          href={telHref}
          className="rounded-full border-2 border-emerald-700 px-6 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-50"
        >
          ☎ Hemen Ara
        </a>
      </div>
    </section>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-5xl px-4 pt-4 text-xs text-slate-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1">
            {i > 0 && <span className="text-slate-300">/</span>}
            {i === items.length - 1 ? (
              <span className="text-slate-700">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-emerald-700 hover:underline">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function NeighborhoodLinksGrid({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="mx-auto max-w-5xl px-4 pb-14">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
