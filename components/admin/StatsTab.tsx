"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Stats = {
  total_views: number;
  unique_visitors: number;
  views_last_30d: number;
  unique_visitors_last_30d: number;
  views_last_7d: number;
  unique_visitors_last_7d: number;
};

export default function StatsTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("page_view_stats")
      .select("*")
      .maybeSingle<Stats>()
      .then(({ data }) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-slate-500">Yükleniyor...</p>;

  if (!stats || stats.total_views === 0) {
    return <p className="text-slate-500">Henüz ziyaret verisi yok.</p>;
  }

  return (
    <div>
      <h2 className="mb-3 text-lg font-bold text-slate-900">Tüm Zamanlar</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Toplam Ziyaret (sayfa görüntüleme)" value={stats.total_views} />
        <StatCard label="Tekil Ziyaretçi" value={stats.unique_visitors} accent="text-emerald-700" />
      </div>

      <h2 className="mb-3 mt-8 text-lg font-bold text-slate-900">Son 30 Gün</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Ziyaret" value={stats.views_last_30d} />
        <StatCard label="Tekil Ziyaretçi" value={stats.unique_visitors_last_30d} accent="text-emerald-700" />
      </div>

      <h2 className="mb-3 mt-8 text-lg font-bold text-slate-900">Son 7 Gün</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Ziyaret" value={stats.views_last_7d} />
        <StatCard label="Tekil Ziyaretçi" value={stats.unique_visitors_last_7d} accent="text-emerald-700" />
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Ziyaretçiler, çerez kullanılmadan tarayıcıda saklanan anonim bir kimlikle
        sayılır. Reklam/analiz amaçlı üçüncü taraf takip yoktur.
      </p>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accent ?? "text-slate-900"}`}>{value.toLocaleString("tr-TR")}</p>
    </div>
  );
}
