"use client";

// Single combined overview tab (replaces the old separate Özet + Ziyaretçi
// İstatistikleri tabs). Everything here is computed for a selected period
// (Bugün / Bu Ay / Bu Yıl) directly from the raw page_views and
// click_events tables — no fixed 30/7-day views — so the numbers always
// match the period the admin picked.
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Period = "day" | "month" | "year";

const PERIOD_LABELS: Record<Period, string> = {
  day: "Bugün",
  month: "Bu Ay",
  year: "Bu Yıl",
};

function periodStart(period: Period): Date {
  const now = new Date();
  if (period === "day") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === "month") return new Date(now.getFullYear(), now.getMonth(), 1);
  return new Date(now.getFullYear(), 0, 1);
}

type Stats = {
  uniqueVisitors: number;
  organicVisitors: number;
  adsVisitors: number;
  whatsappClicks: number;
  phoneClicks: number;
  adsLeads: number;
};

export default function DashboardTab() {
  const [period, setPeriod] = useState<Period>("month");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const state = { cancelled: false };

    function load() {
      setLoading(true);
      const startIso = periodStart(period).toISOString();

      Promise.all([
        supabase.from("page_views").select("visitor_id, is_ads").gte("created_at", startIso),
        supabase.from("click_events").select("event_type").gte("created_at", startIso),
        supabase
          .from("leads")
          .select("id", { count: "exact", head: true })
          .gte("created_at", startIso)
          .or("source.eq.google_ads,medium.eq.cpc"),
      ]).then(([pageViewsRes, clicksRes, leadsRes]) => {
        if (state.cancelled) return;

        const visitorAdsMap = new Map<string, boolean>();
        (pageViewsRes.data ?? []).forEach((row: { visitor_id: string; is_ads: boolean }) => {
          const prev = visitorAdsMap.get(row.visitor_id) ?? false;
          visitorAdsMap.set(row.visitor_id, prev || row.is_ads);
        });
        const uniqueVisitors = visitorAdsMap.size;
        const adsVisitors = [...visitorAdsMap.values()].filter(Boolean).length;

        const clicks = clicksRes.data ?? [];
        const whatsappClicks = clicks.filter((c: { event_type: string }) => c.event_type === "whatsapp").length;
        const phoneClicks = clicks.filter((c: { event_type: string }) => c.event_type === "phone").length;

        setStats({
          uniqueVisitors,
          organicVisitors: uniqueVisitors - adsVisitors,
          adsVisitors,
          whatsappClicks,
          phoneClicks,
          adsLeads: leadsRes.count ?? 0,
        });
        setLoading(false);
      });
    }

    const timer = setTimeout(load, 0);
    return () => {
      state.cancelled = true;
      clearTimeout(timer);
    };
  }, [period]);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Özet</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ziyaretçi ve tıklama rakamları, seçtiğiniz döneme göre.
          </p>
        </div>

        <div className="flex gap-1 rounded-full border border-slate-200 bg-white p-1">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setPeriod(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                period === key ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {PERIOD_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      {loading || !stats ? (
        <p className="mt-6 text-slate-500">Yükleniyor...</p>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="Tekil Ziyaretçi" value={stats.uniqueVisitors} accent="text-slate-900" icon="👤" big />
          </div>

          <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Ziyaretçi Kaynağı
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Organik Giriş" value={stats.organicVisitors} accent="text-emerald-700" icon="🌱" />
            <StatCard label="Reklamla Giriş" value={stats.adsVisitors} accent="text-blue-700" icon="📣" />
          </div>

          <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">Tıklamalar</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="WhatsApp Tıklama" value={stats.whatsappClicks} accent="text-emerald-700" icon="💬" />
            <StatCard label="Telefon Tıklama" value={stats.phoneClicks} accent="text-slate-800" icon="☎️" />
          </div>

          <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Google Reklam
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Reklamdan Gelen Talep" value={stats.adsLeads} accent="text-blue-700" icon="📨" />
          </div>

          <p className="mt-6 text-xs text-slate-400">
            Bir ziyaretçi, seçilen dönem içinde en az bir kez reklam linkinden (gclid veya cpc
            etiketiyle) geldiyse &quot;Reklamla Giriş&quot; olarak sayılır — çerez kullanılmaz.
            Detaylı talep listesi için &quot;Talepler&quot; sekmesine bakabilirsiniz.
          </p>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  icon,
  big,
}: {
  label: string;
  value: number;
  accent?: string;
  icon?: string;
  big?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">
        {icon} {label}
      </p>
      <p className={`mt-1 font-bold ${big ? "text-4xl" : "text-3xl"} ${accent ?? "text-slate-900"}`}>
        {value.toLocaleString("tr-TR")}
      </p>
    </div>
  );
}
