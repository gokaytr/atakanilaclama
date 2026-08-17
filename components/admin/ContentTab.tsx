"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toEmbedUrl } from "@/lib/video-embed";

type SettingsForm = {
  phone_display: string;
  phone_raw: string;
  whatsapp_message: string;
  address_city: string;
  address_street: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string | null;
  hero_image_url: string | null;
  promo_video_url: string | null;
  google_tag_id: string | null;
  hero_video_url: string | null;
  hero_badge: string | null;
  hero_title: string | null;
  hero_description: string | null;
};

const EMPTY: SettingsForm = {
  phone_display: "",
  phone_raw: "",
  whatsapp_message: "",
  address_city: "",
  address_street: "",
  instagram_url: "",
  facebook_url: "",
  youtube_url: null,
  hero_image_url: null,
  promo_video_url: null,
  google_tag_id: null,
  hero_video_url: null,
  hero_badge: null,
  hero_title: null,
  hero_description: null,
};

// The public storage bucket admin uploads (hero video, etc.) live in.
const MEDIA_BUCKET = "site-media";

// Extracts the storage path from a public Supabase Storage URL, e.g.
// "https://xxx.supabase.co/storage/v1/object/public/site-media/hero/foo.mp4"
// -> "hero/foo.mp4". Returns null if the URL doesn't look like ours (so we
// never try to delete a file we didn't upload).
function extractStoragePath(url: string): string | null {
  const marker = `/object/public/${MEDIA_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

export default function ContentTab() {
  const [form, setForm] = useState<SettingsForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle<SettingsForm>()
      .then(({ data }) => {
        if (data) setForm(data);
        setLoading(false);
      });
  }, []);

  function update<K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Uploads a new hero video, deletes the previous one from storage (so old
  // files never pile up), and saves the new URL to site_settings right
  // away — no need to also click "Kaydet" for the video specifically.
  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingVideo(true);
    setMessage(null);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `hero/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, { upsert: false, contentType: file.type || "video/mp4" });

    if (uploadError) {
      setUploadingVideo(false);
      setMessage({ type: "error", text: "Video yüklenemedi: " + uploadError.message });
      return;
    }

    const { data: publicUrlData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    const newUrl = publicUrlData.publicUrl;
    const previousUrl = form.hero_video_url;

    const { error: saveError } = await supabase
      .from("site_settings")
      .update({ hero_video_url: newUrl, updated_at: new Date().toISOString() })
      .eq("id", 1);

    if (saveError) {
      setUploadingVideo(false);
      setMessage({ type: "error", text: "Video kaydedilemedi: " + saveError.message });
      return;
    }

    // Old video is now fully replaced on the site — remove it from storage
    // so it doesn't keep taking up space.
    if (previousUrl) {
      const previousPath = extractStoragePath(previousUrl);
      if (previousPath) {
        await supabase.storage.from(MEDIA_BUCKET).remove([previousPath]);
      }
    }

    setForm((f) => ({ ...f, hero_video_url: newUrl }));
    setUploadingVideo(false);
    setMessage({ type: "ok", text: "Yeni video yüklendi ve eski video silindi. Site birkaç saniye içinde güncellenir." });
  }

  async function handleVideoRemove() {
    const previousUrl = form.hero_video_url;
    if (!previousUrl) return;
    setUploadingVideo(true);
    setMessage(null);

    const { error: saveError } = await supabase
      .from("site_settings")
      .update({ hero_video_url: null, updated_at: new Date().toISOString() })
      .eq("id", 1);

    if (saveError) {
      setUploadingVideo(false);
      setMessage({ type: "error", text: "Kaldırılamadı: " + saveError.message });
      return;
    }

    const previousPath = extractStoragePath(previousUrl);
    if (previousPath) {
      await supabase.storage.from(MEDIA_BUCKET).remove([previousPath]);
    }

    setForm((f) => ({ ...f, hero_video_url: null }));
    setUploadingVideo(false);
    setMessage({ type: "ok", text: "Video kaldırıldı, sitede varsayılan video gösterilecek." });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("site_settings")
      .update({
        phone_display: form.phone_display,
        phone_raw: form.phone_raw,
        whatsapp_message: form.whatsapp_message,
        address_city: form.address_city,
        address_street: form.address_street,
        instagram_url: form.instagram_url,
        facebook_url: form.facebook_url,
        youtube_url: form.youtube_url || null,
        hero_image_url: form.hero_image_url,
        promo_video_url: form.promo_video_url || null,
        google_tag_id: form.google_tag_id || null,
        hero_badge: form.hero_badge || null,
        hero_title: form.hero_title || null,
        hero_description: form.hero_description || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    setSaving(false);
    setMessage(
      error
        ? { type: "error", text: "Kaydedilemedi: " + error.message }
        : { type: "ok", text: "Kaydedildi. Değişiklikler siteye birkaç saniye içinde yansır." }
    );
  }

  if (loading) return <p className="text-slate-500">Yükleniyor...</p>;

  const videoPreview = form.promo_video_url ? toEmbedUrl(form.promo_video_url) : null;

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900">İletişim Bilgileri</h2>
        <p className="mt-1 text-sm text-slate-500">
          Bu bilgiler menü, alt bilgi, alt sabit bar ve iletişim sayfasında anında güncellenir.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Görünen telefon (ör. 0 551 598 92 53)">
            <input
              value={form.phone_display}
              onChange={(e) => update("phone_display", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
          <Field label="WhatsApp/arama numarası (ülke koduyla, ör. 905515989253)">
            <input
              value={form.phone_raw}
              onChange={(e) => update("phone_raw", e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
          <Field label="Şehir">
            <input
              value={form.address_city}
              onChange={(e) => update("address_city", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
          <Field label="Adres (opsiyonel)">
            <input
              value={form.address_street}
              onChange={(e) => update("address_street", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
          <Field label="Instagram linki (boş bırakırsanız site genelinde gizlenir)">
            <input
              value={form.instagram_url}
              onChange={(e) => update("instagram_url", e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
          <Field label="Facebook linki (boş bırakırsanız site genelinde gizlenir)">
            <input
              value={form.facebook_url}
              onChange={(e) => update("facebook_url", e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
          <Field label="YouTube linki (boş bırakırsanız gizlenir)">
            <input
              value={form.youtube_url ?? ""}
              onChange={(e) => update("youtube_url", e.target.value || null)}
              placeholder="https://youtube.com/@..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
        </div>
        <div className="mt-3">
          <Field label="WhatsApp'ta otomatik gelen mesaj">
            <textarea
              value={form.whatsapp_message}
              onChange={(e) => update("whatsapp_message", e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Ana Sayfa Arka Plan Videosu</h2>
        <p className="mt-1 text-sm text-slate-500">
          Ana sayfada en üstte oynayan videodur. Yeni video yüklediğinizde eski video
          otomatik olarak sunucudan tamamen silinir. Boş bırakılırsa site varsayılan
          videoyu gösterir.
        </p>
        <div className="mt-4 space-y-3">
          {form.hero_video_url && (
            <video
              src={form.hero_video_url}
              controls
              muted
              className="aspect-video max-w-sm rounded-lg border border-slate-200 bg-black"
            />
          )}
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900">
              {uploadingVideo ? "Yükleniyor..." : form.hero_video_url ? "Videoyu Değiştir" : "Video Yükle"}
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                disabled={uploadingVideo}
                className="hidden"
              />
            </label>
            {form.hero_video_url && (
              <button
                type="button"
                onClick={handleVideoRemove}
                disabled={uploadingVideo}
                className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-60"
              >
                Videoyu Kaldır (Varsayılana Dön)
              </button>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Ana Sayfa Video Üzerindeki Yazılar</h2>
        <p className="mt-1 text-sm text-slate-500">
          Videonun ortasında görünen rozet, başlık ve açıklama metnidir.
        </p>
        <div className="mt-4 space-y-3">
          <Field label="Rozet (küçük etiket)">
            <input
              value={form.hero_badge ?? ""}
              onChange={(e) => update("hero_badge", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
          <Field label="Ana başlık">
            <input
              value={form.hero_title ?? ""}
              onChange={(e) => update("hero_title", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
          <Field label="Açıklama paragrafı">
            <textarea
              value={form.hero_description ?? ""}
              onChange={(e) => update("hero_description", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Tanıtım Videosu</h2>
        <p className="mt-1 text-sm text-slate-500">
          YouTube veya Vimeo video linkini yapıştırın. Boş bırakırsanız ana sayfada video bölümü görünmez.
        </p>
        <div className="mt-4">
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={form.promo_video_url ?? ""}
            onChange={(e) => update("promo_video_url", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          {form.promo_video_url && !videoPreview && (
            <p className="mt-1 text-xs text-red-600">Bu link tanınmadı — YouTube veya Vimeo linki girin.</p>
          )}
          {videoPreview && (
            <div className="mt-3 aspect-video max-w-sm overflow-hidden rounded-lg border border-slate-200">
              <iframe src={videoPreview} className="h-full w-full" allowFullScreen title="Video önizleme" />
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Google Ads</h2>
        <p className="mt-1 text-sm text-slate-500">
          Google Ads hesabınızdaki dönüşüm izleme (Tag) ID&apos;sini girin (ör. AW-1234567890).
          Boş bırakırsanız siteye hiçbir Google Ads kodu eklenmez.
        </p>
        <div className="mt-4">
          <Field label="Google Ads Tag ID">
            <input
              value={form.google_tag_id ?? ""}
              onChange={(e) => update("google_tag_id", e.target.value || null)}
              placeholder="AW-1234567890"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
        </div>
      </section>

      {message && (
        <p className={`text-sm ${message.type === "ok" ? "text-emerald-700" : "text-red-600"}`}>
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white disabled:opacity-60"
      >
        {saving ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
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
