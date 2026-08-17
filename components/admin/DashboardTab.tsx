"use client";

// First screen the admin sees. Answers the two questions that matter most
// day-to-day: "are people clicking WhatsApp/telefon?" and "is the Google
// Ads spend bringing anyone in?" — both powered by first-party tracking
// (lib/click-tracking.ts + VisitorTracker's is_ads flag), no cookies, no
// third-party scripts.
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ClickStats = {
  whatsapp_clicks: number;
  phone_clicks: number;
  ads_clicks: number;
  whatsapp_clicks_30d: number;
  phone_clicks_30d: number;
  ads_clicks_30d: number;
};

type AdsVisitStats = {
  ads_pageviews: number;
  ads_unique_visitors: number;
  ads_pageviews_30d: number;
  ads_unique_visitors_30d: number;
};

export default function DashboardTab() {
  const [clicks, setClicks] = useState<ClickStats | null>(null);
  const [adsVisits, setAdsVisits] = useState<AdsVisitStats | null>(null);
  const [adsLeads, setAdsLeads] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("click_stats").select("*").maybeSingle<ClickStats>(),
      supabase.from("ads_visit_stats").select("*").maybeSingle<AdsVisitStats>(),
      supabase.from("leads").select("id", { count: "exact", head: true }).or("source.eq.google_ads,medium.eq.cpc"),
    ]).then(([clickRes, adsVisitRes, leadsRes]) => {
      setClicks(clickRes.data);
      setAdsVisits(adsVisitRes.data);
      setAdsLeads(leadsRes.count ?? 0);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-slate-500">Yükleniyor...</p>;

  const hasAnyData = (clicks && (clicks.whatsapp_clicks > 0 || clicks.phone_clicks > 0)) || (adsVisits && adsVisits.ads_pageviews > 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Özet</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ziyaretçilerin en çok kullandığı iletişim yollarına ve Google reklamından gelen trafiğe genel bakış.
      </p>

      {!hasAnyData && (
        <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          Henüz tıklama verisi yok — WhatsApp veya telefon butonlarına tıklandıkça burada görünecek.
        </p>
      )}

      <h2 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">Tıklamalar — Tüm Zamanlar</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="WhatsApp Tıklama" value={clicks?.whatsapp_clicks ?? 0} accent="text-emerald-700" icon="💬" />
        <StatCard label="Telefon Tıklama" value={clicks?.phone_clicks ?? 0} accent="text-slate-800" icon="☎️" />
        <StatCard label="Reklamdan Gelen Tıklama" value={clicks?.ads_clicks ?? 0} accent="text-blue-700" icon="📣" />
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">Son 30 Gün</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="WhatsApp Tıklama" value={clicks?.whatsapp_clicks_30d ?? 0} accent="text-emerald-700" icon="💬" />
        <StatCard label="Telefon Tıklama" value={clicks?.phone_clicks_30d ?? 0} accent="text-slate-800" icon="☎️" />
        <StatCard label="Reklamdan Gelen Tıklama" value={clicks?.ads_clicks_30d ?? 0} accent="text-blue-700" icon="📣" />
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">Google Reklam Performansı</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Reklamdan Gelen Ziyaretçi (Tekil)" value={adsVisits?.ads_unique_visitors ?? 0} accent="text-blue-700" icon="👤" />
        <StatCard label="Reklamdan Gelen Sayfa Görüntüleme" value={adsVisits?.ads_pageviews ?? 0} accent="text-blue-700" icon="📄" />
        <StatCard label="Reklamdan Gelen Talep" value={adsLeads ?? 0} accent="text-blue-700" icon="📨" />
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Bir ziyaret, Google Ads&apos;ten geldiğinde linkte otomatik eklenen izleyici koduyla (gclid) veya
        cpc etiketiyle tanınır — çerez kullanılmaz. Detaylı talep listesi için &quot;Talepler&quot;, genel ziyaretçi
        sayıları için &quot;İstatistikler&quot; sekmesine bakabilirsiniz.
      </p>
    </div>
  );
}

function StatCard({ label, value, accent, icon }: { label: string; value: number; accent?: string; icon?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{icon} {label}</p>
      <p className={`mt-1 text-3xl font-bold ${accent ?? "text-slate-900"}`}>{value.toLocaleString("tr-TR")}</p>
    </div>
  );
}
