import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig, buildWhatsappLink, buildTelLink } from "@/data/site-config";
import { fetchPublishedArticles, fetchArticleBySlug } from "@/lib/articles";
import { buildArticleSchema, toJsonLd } from "@/lib/schema";

// Articles are admin-authored (Supabase), so this page is statically
// generated for the articles that exist at build time, then revalidated
// hourly — a new article the admin adds shows up on its first real visit
// without needing a redeploy, same pattern as the pest/district pages.
export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await fetchPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.seoTitle || `${article.title} | ${siteConfig.companyName}`,
    description: article.seoDescription || article.excerpt,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) return notFound();

  const paragraphs = article.content.split(/\n{2,}/).filter(Boolean);
  const schema = buildArticleSchema({
    title: article.title,
    description: article.seoDescription || article.excerpt,
    slug: article.slug,
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    imageUrl: article.coverImageUrl,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(schema) }} />

      <Link href="/blog" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
        ← Tüm yazılar
      </Link>

      <h1 className="mt-4 text-3xl font-extrabold text-slate-900 md:text-4xl">{article.title}</h1>

      {article.coverImageUrl && (
        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-slate-200">
          <Image src={article.coverImageUrl} alt={article.title} fill className="object-cover" />
        </div>
      )}

      <div className="mt-8 space-y-4 text-slate-700 leading-relaxed">
        {paragraphs.map((p, i) => (
          <p key={i} className="whitespace-pre-line">{p}</p>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="font-semibold text-emerald-900">
          Bu konuda yardım almak ister misiniz?
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a
            href={buildWhatsappLink(`Merhaba, "${article.title}" yazısıyla ilgili bilgi almak istiyorum.`)}
            className="rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
          >
            💬 WhatsApp&apos;tan Yazın
          </a>
          <a
            href={buildTelLink()}
            className="rounded-full border-2 border-emerald-700 px-6 py-3 font-semibold text-emerald-800 hover:bg-emerald-100"
          >
            ☎ {siteConfig.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
