import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { fetchPublishedArticles } from "@/lib/articles";

// Content is admin-editable in Supabase, so this list is revalidated
// periodically (ISR) instead of only at build time — new/edited articles
// show up without needing a redeploy.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Faydalı Bilgiler | ${siteConfig.companyName}`,
  description:
    "Böcek ilaçlama ve koltuk yıkama hakkında uzman tavsiyeleri, sık sorulan sorular ve pratik bilgiler.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const articles = await fetchPublishedArticles();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-3xl font-extrabold text-slate-900">Faydalı Bilgiler</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Böcek ilaçlama ve koltuk yıkama hakkında pratik bilgiler ve uzman tavsiyeleri.
      </p>

      {articles.length === 0 ? (
        <p className="mt-8 text-slate-500">Henüz yazı eklenmedi.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-300 hover:shadow-md"
            >
              <h2 className="text-lg font-bold text-slate-900">{article.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{article.excerpt}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-emerald-700">
                Devamını oku →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
