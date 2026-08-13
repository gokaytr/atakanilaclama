"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lead = {
  id: string;
  created_at: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  pest_type: string | null;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  page_url: string | null;
};

export default function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setLeads(data as Lead[]);
        setLoading(false);
      });
  }, []);

  const totalLeads = leads.length;
  const organicCount = leads.filter((l) => l.source === "organic").length;
  const adsCount = leads.filter((l) => l.source === "google_ads" || l.medium === "cpc").length;
  const otherCount = totalLeads - organicCount - adsCount;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Toplam Talep" value={totalLeads} />
        <StatCard label="Organik" value={organicCount} accent="text-emerald-700" />
        <StatCard label="Google Reklam" value={adsCount} accent="text-blue-700" />
      </div>
      {otherCount > 0 && (
        <p className="mt-2 text-xs text-slate-400">
          Diğer kaynaklar (referral / bilinmeyen): {otherCount}
        </p>
      )}

      <h2 className="mb-3 mt-8 text-lg font-bold text-slate-900">Gelen Talepler</h2>
      {loading ? (
        <p className="text-slate-500">Yükleniyor...</p>
      ) : leads.length === 0 ? (
        <p className="text-slate-500">Henüz talep yok.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-3 py-2">Tarih</th>
                <th className="px-3 py-2">Ad</th>
                <th className="px-3 py-2">Telefon</th>
                <th className="px-3 py-2">E-posta</th>
                <th className="px-3 py-2">Haşere</th>
                <th className="px-3 py-2">Kaynak</th>
                <th className="px-3 py-2">Sayfa</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleString("tr-TR")}
                  </td>
                  <td className="px-3 py-2">{lead.name || "-"}</td>
                  <td className="px-3 py-2">{lead.phone || "-"}</td>
                  <td className="px-3 py-2">{lead.email || "-"}</td>
                  <td className="px-3 py-2">{lead.pest_type || "-"}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        lead.source === "organic"
                          ? "bg-emerald-100 text-emerald-800"
                          : lead.source === "google_ads"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {lead.source ?? "bilinmiyor"}
                    </span>
                  </td>
                  <td className="max-w-[220px] truncate px-3 py-2 text-xs text-slate-400">
                    {lead.page_url}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accent ?? "text-slate-900"}`}>{value}</p>
    </div>
  );
}
