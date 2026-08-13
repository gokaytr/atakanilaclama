"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminSession } from "@/components/admin/useAdminSession";
import { supabase } from "@/lib/supabase";
import LeadsTab from "@/components/admin/LeadsTab";
import ContentTab from "@/components/admin/ContentTab";
import StatsTab from "@/components/admin/StatsTab";

const TABS = [
  { key: "leads", label: "Talepler" },
  { key: "content", label: "İçerik" },
  { key: "stats", label: "İstatistikler" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AdminDashboardPage() {
  const { session, ready } = useAdminSession();
  const [tab, setTab] = useState<TabKey>("leads");
  const router = useRouter();

  if (!ready || !session) return null; // useAdminSession handles redirects

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Paneli</h1>
          <p className="text-sm text-slate-500">{session.user.email}</p>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/");
          }}
          className="text-sm text-red-600 underline"
        >
          Çıkış Yap
        </button>
      </div>

      <div className="mb-6 flex gap-1 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-t-lg px-4 py-2 text-sm font-semibold ${
              tab === t.key
                ? "border-b-2 border-emerald-700 text-emerald-800"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "leads" && <LeadsTab />}
      {tab === "content" && <ContentTab />}
      {tab === "stats" && <StatsTab />}
    </div>
  );
}
