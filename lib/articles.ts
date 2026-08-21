// Server-safe fetch helpers for the admin-authored blog/SEO articles
// (public.articles table). Used by the static /blog pages (via ISR — see
// `revalidate` exports there) and by the admin SEO tab. Every function
// returns [] on error instead of throwing, so a Supabase hiccup never
// breaks the homepage or blog build.
import { supabase } from "@/lib/supabase";

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

function mapRow(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImageUrl: row.cover_image_url,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const COLUMNS =
  "id, slug, title, excerpt, content, cover_image_url, seo_title, seo_description, published, created_at, updated_at";

export async function fetchPublishedArticles(limit?: number): Promise<Article[]> {
  let query = supabase
    .from("articles")
    .select(COLUMNS)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error || !data) return [];
  return (data as ArticleRow[]).map(mapRow);
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select(COLUMNS)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle<ArticleRow>();

  if (error || !data) return null;
  return mapRow(data);
}
