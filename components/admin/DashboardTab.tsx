"use client";

// Combined admin overview: unique visitors, device split, traffic source,
// WhatsApp/phone clicks and exit pages — all computed for a selected
// period (Bugün / Bu Ay / Bu Yıl) directly from the raw first-party
// tracking tables (public.page_views, public.click_events). See the
// disclaimer block at the bottom of the render for exactly how each
// number is derived — nothing here is simulated or estimated.
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

const SOURCE_LABELS: Record<string, string> = {
  google: "Google (arama)",
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  yandex: "Yandex",
  bing: "Bing",
  direct: "Direkt / Bilinmeyen",
  other: "Diğer Siteler",
};

type PageViewRow = {
  visitor_id: string;
  page_path: string;
  is_ads: boolean;
  device: string | null;
  referrer_source: string | null;
  created_at: string;
};

type VisitorInfo = {
  ads: boolean;
  device: string;
  source: string;
  lastPath: string;
};

type Stats = {
  uniqueVisitors: number;
  organicVisitors: number;
  adsVisitors: number;
  desktopVisitors: number;
  mobileVisitors: number;
  sourceCounts: { source: string; count: number }[];
  exitPages: { path: string; count: number }[];
  whatsappClicks: number;
  phoneClicks: number;
  adsLeads: number;
};

function pathLabel(path: string): string {
  return path === "/" ? "Ana Sayfa" : path;
}

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
        supabase
          .from("page_views")
          .select("visitor_id, page_path, is_ads, device, referrer_source, created_at")
          .gte("created_at", startIso)
          .order("created_at", { ascending: true }),
        supabase.from("click_events").select("event_type").gte("created_at", startIso),
        supabase
          .from("leads")
          .select("id", { count: "exact", head: true })
          .gte("created_at", startIso)
          .or("source.eq.google_ads,medium.eq.cpc"),
      ]).then(([pageViewsRes, clicksRes, leadsRes]) => {
        if (state.cancelled) return;

        const rows = (pageViewsRes.data ?? []) as PageViewRow[];
        const visitors = new Map<string, VisitorInfo>();

        for (const row of rows) {
          const existing = visitors.get(row.visitor_id);
          if (!existing) {
            visitors.set(row.visitor_id, {
              ads: row.is_ads,
              device: row.device ?? "desktop",
              source: row.referrer_source ?? "direct",
              lastPath: row.page_path,
            });
          } else {
            existing.ads = existing.ads || row.is_ads;
            existing.lastPath = row.page_path; // rows are sorted ascending, so last write wins
          }
        }

        const uniqueVisitors = visitors.size;
        let adsVisitors = 0;
        let desktopVisitors = 0;
        let mobileVisitors = 0;
        const sourceMap = new Map<string, number>();
        const exitMap = new Map<string, number>();

        visitors.forEach((v) => {
          if (v.ads) adsVisitors += 1;
          if (v.device === "mobile") mobileVisitors += 1;
          else desktopVisitors += 1;
          sourceMap.set(v.source, (sourceMap.get(v.source) ?? 0) + 1);
          exitMap.set(v.lastPath, (exitMap.get(v.lastPath) ?? 0) + 1);
        });

        const sourceCounts = [...sourceMap.entries()]
          .map(([source, count]) => ({ source, count }))
          .sort((a, b) => b.count - a.count);

        const exitPages = [...exitMap.entries()]
          .map(([path, count]) => ({ path, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        const clicks = clicksRes.data ?? [];
        const whatsappClicks = clicks.filter((c: { event_type: string }) => c.event_type === "whatsapp").length;
        const phoneClicks = clicks.filter((c: { event_type: string }) => c.event_type === "phone").length;

        setStats({
          uniqueVisitors,
          organicVisitors: uniqueVisitors - adsVisitors,
          adsVisitors,
          desktopVisitors,
          mobileVisitors,
          sourceCounts,
          exitPages,
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
      ) : stats.uniqueVisitors === 0 && stats.whatsappClicks === 0 && stats.phoneClicks === 0 ? (
        <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          Seçilen dönemde henüz kaydedilmiş ziyaretçi verisi yok.
        </p>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="Tekil Ziyaretçi" value={stats.uniqueVisitors} accent="text-slate-900" icon="👤" big />
          </div>

          <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Cihaz Dağılımı
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Masaüstünden Giriş"
              value={stats.desktopVisitors}
              accent="text-slate-800"
              icon="💻"
              subtext={percentLabel(stats.desktopVisitors, stats.uniqueVisitors)}
            />
            <StatCard
              label="Mobilden Giriş"
              value={stats.mobileVisitors}
              accent="text-emerald-700"
              icon="📱"
              subtext={percentLabel(stats.mobileVisitors, stats.uniqueVisitors)}
            />
          </div>

          <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Ziyaretçiler Nereden Geliyor?
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.sourceCounts.length === 0 ? (
              <p className="text-sm text-slate-400">Veri yok.</p>
            ) : (
              stats.sourceCounts.map((s) => (
                <div key={s.source} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                  <span className="text-sm text-slate-600">{SOURCE_LABELS[s.source] ?? s.source}</span>
                  <span className="font-bold text-slate-900">{s.count.toLocaleString("tr-TR")}</span>
                </div>
              ))
            )}
          </div>

          <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Reklam vs Organik
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

          <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Ziyaretçilerin Sitede En Son Baktığı Sayfalar
          </h2>
          <p className="mb-3 text-xs text-slate-400">
            Bu liste, ziyaretçinin seçili dönemde sitenizde <strong>en son görüntülediği sayfayı</strong> gösterir —
            yani muhtemelen o sayfadan sonra siteden ayrılmıştır. Neden ayrıldığını (fiyat, ilgisizlik, teknik
            sorun vb.) bu veriden kesin olarak bilemeyiz; yalnızca nerede durduklarını gösterir.
          </p>
          {stats.exitPages.length === 0 ? (
            <p className="text-sm text-slate-400">Veri yok.</p>
          ) : (
            <div className="space-y-2">
              {stats.exitPages.map((p) => (
                <div key={p.path} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                  <span className="truncate text-sm text-slate-700">{pathLabel(p.path)}</span>
                  <span className="font-bold text-slate-900">{p.count.toLocaleString("tr-TR")}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Bu veriler nereden geliyor?</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Bu sayfadaki tüm rakamlar gerçektir, tahmin veya simülasyon değildir. Sitenize eklediğimiz
              çerezsiz, birinci taraf izleme sisteminden geliyor: her sayfa görüntülemesi{" "}
              <code className="rounded bg-white px-1">page_views</code> tablosuna, her WhatsApp/telefon tıklaması{" "}
              <code className="rounded bg-white px-1">click_events</code> tablosuna kaydedilir. Cihaz bilgisi
              (masaüstü/mobil) tarayıcının kendi bildirdiği bilgiden, trafik kaynağı ziyaretçinin geldiği sitenin
              adresinden (referrer), Google reklam trafiği ise linkteki gclid/cpc etiketinden otomatik olarak
              belirlenir. Hiçbir kişisel veri veya üçüncü taraf takip kodu kullanılmaz.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function percentLabel(value: number, total: number): string {
  if (total === 0) return "%0";
  return `%${Math.round((value / total) * 100)}`;
}

function StatCard({
  label,
  value,
  accent,
  icon,
  big,
  subtext,
}: {
  label: string;
  value: number;
  accent?: string;
  icon?: string;
  big?: boolean;
  subtext?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">
        {icon} {label}
      </p>
      <p className={`mt-1 font-bold ${big ? "text-4xl" : "text-3xl"} ${accent ?? "text-slate-900"}`}>
        {value.toLocaleString("tr-TR")}
        {subtext && <span className="ml-2 text-sm font-normal text-slate-400">{subtext}</span>}
      </p>
    </div>
  );
}
