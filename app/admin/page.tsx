"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

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

// Admin dashboard: shows overall lead stats (organic vs ads) and the raw
// lead list. Protected client-side by checking the Supabase auth session —
// unauthenticated visitors are redirected to /admin/login.
export default function AdminDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/admin/login");
        return;
      }
      setSession(data.session);
    });
  }, [router]);

  useEffect(() => {
    if (!session) return;
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setLeads(data as Lead[]);
        setLoading(false);
      });
  }, [session]);

  if (!session) return null; // redirecting

  const totalLeads = leads.length;
  const organicCount = leads.filter((l) => l.source === "organic").length;
  const adsCount = leads.filter((l) => l.source === "google_ads" || l.medium === "cpc").length;
  const otherCount = totalLeads - organicCount - adsCount;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-950">Admin Paneli</h1>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/admin/login");
          }}
          className="text-sm text-red-600 underline"
        >
          Çıkış Yap
        </button>
      </div>

      {/* Stat cards: organic vs paid entries */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Toplam Talep" value={totalLeads} />
        <StatCard label="Organik" value={organicCount} accent="text-green-700" />
        <StatCard label="Google Reklam" value={adsCount} accent="text-blue-700" />
      </div>
      {otherCount > 0 && (
        <p className="mt-2 text-xs text-slate-400">
          Diğer kaynaklar (referral / bilinmeyen): {otherCount}
        </p>
      )}

      <h2 className="mb-3 mt-10 text-lg font-bold text-green-950">Gelen Talepler</h2>
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
                          ? "bg-green-100 text-green-800"
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
      <p className={`mt-1 text-3xl font-bold ${accent ?? "text-green-950"}`}>{value}</p>
    </div>
  );
}
