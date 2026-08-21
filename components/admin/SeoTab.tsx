"use client";

// Article (blog/SEO content) CRUD for the admin panel. Articles render at
// /blog and /blog/[slug] and the latest 4 published ones appear on the
// homepage — see lib/articles.ts. Cover image upload reuses the same
// site-media storage bucket + old-file cleanup pattern as the hero video
// in ContentTab.tsx.
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

const MEDIA_BUCKET = "site-media";

function extractStoragePath(url: string): string | null {
  const marker = `/object/public/${MEDIA_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

function slugify(text: string): string {
  const trMap: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };
  return text
    .toLowerCase()
    .replace(/[çğıöşü]/g, (c) => trMap[c] ?? c)
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const EMPTY_FORM = {
  id: null as string | null,
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover_image_url: null as string | null,
  seo_title: "",
  seo_description: "",
  published: true,
};

const SUB_TABS = [
  { key: "new", label: "Yeni Makale" },
  { key: "list", label: "Makaleler" },
] as const;

type SubTab = (typeof SUB_TABS)[number]["key"];

export default function SeoTab() {
  const [subTab, setSubTab] = useState<SubTab>("new");
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  function loadArticles() {
    supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setArticles(data as ArticleRow[]);
        setLoading(false);
      });
  }

  useEffect(() => {
    const timer = setTimeout(loadArticles, 0);
    return () => clearTimeout(timer);
  }, []);

  function resetForm() {
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setMessage(null);
  }

  function startEdit(article: ArticleRow) {
    setForm({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      cover_image_url: article.cover_image_url,
      seo_title: article.seo_title ?? "",
      seo_description: article.seo_description ?? "",
      published: article.published,
    });
    setSlugTouched(true);
    setMessage(null);
    setSubTab("new");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(article: ArticleRow) {
    if (!window.confirm(`"${article.title}" yazısını silmek istediğinize emin misiniz?`)) return;
    const { error } = await supabase.from("articles").delete().eq("id", article.id);
    if (error) {
      setMessage({ type: "error", text: "Silinemedi: " + error.message });
      return;
    }
    if (article.cover_image_url) {
      const path = extractStoragePath(article.cover_image_url);
      if (path) await supabase.storage.from(MEDIA_BUCKET).remove([path]);
    }
    if (form.id === article.id) resetForm();
    loadArticles();
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingCover(true);
    setMessage(null);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `articles/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, { upsert: false, contentType: file.type || "image/jpeg" });

    if (uploadError) {
      setUploadingCover(false);
      setMessage({ type: "error", text: "Görsel yüklenemedi: " + uploadError.message });
      return;
    }

    const { data: publicUrlData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    const previousUrl = form.cover_image_url;
    setForm((f) => ({ ...f, cover_image_url: publicUrlData.publicUrl }));
    setUploadingCover(false);

    if (previousUrl) {
      const previousPath = extractStoragePath(previousUrl);
      if (previousPath) await supabase.storage.from(MEDIA_BUCKET).remove([previousPath]);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      slug: form.slug || slugify(form.title),
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      cover_image_url: form.cover_image_url,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      published: form.published,
      updated_at: new Date().toISOString(),
    };

    const { error } = form.id
      ? await supabase.from("articles").update(payload).eq("id", form.id)
      : await supabase.from("articles").insert(payload);

    setSaving(false);

    if (error) {
      setMessage({ type: "error", text: "Kaydedilemedi: " + error.message });
      return;
    }

    setMessage({ type: "ok", text: "Kaydedildi." });
    resetForm();
    loadArticles();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">SEO — Makaleler</h1>
      <p className="mt-1 text-sm text-slate-500">
        Buradan eklediğiniz yazılar ana sayfada &quot;Faydalı Bilgiler&quot; bölümünde ve
        /blog sayfasında yayınlanır.
      </p>

      <div className="mt-4 flex gap-1 rounded-full border border-slate-200 bg-white p-1 w-fit">
        {SUB_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setSubTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              subTab === t.key ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {t.label}
            {t.key === "list" && articles.length > 0 && (
              <span className="ml-1.5 text-xs opacity-75">({articles.length})</span>
            )}
          </button>
        ))}
      </div>

      {subTab === "new" && (
      <>
      <div className="mt-6 max-w-2xl rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        💡 Düzenli olarak <strong>haftada 2 makale</strong> eklemeniz, sitenizin arama motorlarında
        (Google) daha üst sıralarda çıkmasına yardımcı olur — arama motorları düzenli ve güncel
        içerik üreten siteleri daha sık tarar ve daha güvenilir bulur.
      </div>

      <form onSubmit={handleSave} className="mt-4 max-w-2xl space-y-3 rounded-2xl border border-slate-200 p-5">
        <h2 className="font-bold text-slate-900">{form.id ? "Yazıyı Düzenle" : "Yeni Yazı Ekle"}</h2>

        <Field label="Başlık">
          <input
            required
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
            }}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </Field>

        <Field label="Adres (slug) — /blog/... sonrası, otomatik oluşur, isterseniz değiştirin">
          <input
            required
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
            }}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </Field>

        <Field label="Özet (liste ve arama sonuçlarında görünür)">
          <textarea
            required
            rows={2}
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </Field>

        <Field label="İçerik (paragraflar arasında boş satır bırakın)">
          <textarea
            required
            rows={10}
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
          />
        </Field>

        <div>
          <span className="mb-1 block text-sm text-slate-600">Kapak görseli (opsiyonel)</span>
          {form.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.cover_image_url} alt="" className="mb-2 h-32 rounded-lg border border-slate-200 object-cover" />
          )}
          <label className="inline-flex cursor-pointer items-center rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900">
            {uploadingCover ? "Yükleniyor..." : form.cover_image_url ? "Görseli Değiştir" : "Görsel Yükle"}
            <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploadingCover} className="hidden" />
          </label>
        </div>

        <Field label="SEO başlığı (opsiyonel, boşsa başlık kullanılır)">
          <input
            value={form.seo_title}
            onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </Field>

        <Field label="SEO açıklaması (opsiyonel, boşsa özet kullanılır)">
          <textarea
            rows={2}
            value={form.seo_description}
            onChange={(e) => setForm((f) => ({ ...f, seo_description: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
          />
          Yayınla (kapalıysa sitede görünmez, taslak olarak kalır)
        </label>

        {message && (
          <p className={`text-sm ${message.type === "ok" ? "text-emerald-700" : "text-red-600"}`}>{message.text}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-emerald-700 px-6 py-2.5 font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Kaydediliyor..." : form.id ? "Güncelle" : "Yayınla"}
          </button>
          {form.id && (
            <button type="button" onClick={resetForm} className="text-sm font-semibold text-slate-500 hover:text-slate-700">
              Vazgeç
            </button>
          )}
        </div>
      </form>
      </>
      )}

      {subTab === "list" && (
        <div className="mt-6">
          <h2 className="mb-3 text-lg font-bold text-slate-900">Tüm Yazılar</h2>
          {loading ? (
            <p className="text-slate-500">Yükleniyor...</p>
          ) : articles.length === 0 ? (
            <p className="text-slate-500">Henüz yazı yok.</p>
          ) : (
            <div className="space-y-2">
              {articles.map((article) => (
                <div key={article.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {article.title}{" "}
                      {!article.published && (
                        <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">Taslak</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400">/blog/{article.slug}</p>
                  </div>
                  <div className="flex shrink-0 gap-3">
                    <button onClick={() => startEdit(article)} className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                      Düzenle
                    </button>
                    <button onClick={() => handleDelete(article)} className="text-sm font-semibold text-red-600 hover:text-red-700">
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-slate-600">{label}</span>
      {children}
    </label>
  );
}
