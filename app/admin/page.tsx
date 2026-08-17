"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminSession } from "@/components/admin/useAdminSession";
import { supabase } from "@/lib/supabase";
import DashboardTab from "@/components/admin/DashboardTab";
import LeadsTab from "@/components/admin/LeadsTab";
import ContentTab from "@/components/admin/ContentTab";
import StatsTab from "@/components/admin/StatsTab";

const NAV_ITEMS = [
  { key: "dashboard", label: "Özet", icon: "📊" },
  { key: "leads", label: "Talepler", icon: "📨" },
  { key: "content", label: "İçerik", icon: "🎬" },
  { key: "stats", label: "Ziyaretçi İstatistikleri", icon: "📈" },
] as const;

type TabKey = (typeof NAV_ITEMS)[number]["key"];

export default function AdminDashboardPage() {
  const { session, ready } = useAdminSession();
  const [tab, setTab] = useState<TabKey>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  if (!ready || !session) return null; // useAdminSession handles redirects

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const currentLabel = NAV_ITEMS.find((item) => item.key === tab)?.label ?? "";

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar — desktop */}
      <aside className="hidden w-64 shrink-0 flex-col bg-slate-900 text-slate-200 md:flex">
        <SidebarContent
          email={session.user.email ?? ""}
          tab={tab}
          onSelect={setTab}
          onSignOut={handleSignOut}
        />
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        {/* Top bar — mobile only */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Menüyü aç"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-5 bg-slate-700" />
              <span className="block h-0.5 w-5 bg-slate-700" />
              <span className="block h-0.5 w-5 bg-slate-700" />
            </span>
          </button>
          <p className="text-sm font-semibold text-slate-900">{currentLabel}</p>
          <div className="h-10 w-10" />
        </header>

        {/* Slide-in drawer — mobile only */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
            <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-slate-900 text-slate-200">
              <div className="flex items-center justify-between px-6 py-6">
                <p className="text-lg font-bold text-white">Admin Paneli</p>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Menüyü kapat"
                  className="text-xl text-slate-300"
                >
                  ✕
                </button>
              </div>
              <SidebarContent
                email={session.user.email ?? ""}
                tab={tab}
                onSelect={(key) => {
                  setTab(key);
                  setMenuOpen(false);
                }}
                onSignOut={handleSignOut}
                hideHeader
              />
            </aside>
          </div>
        )}

        <main className="flex-1 px-4 py-8 md:px-10">
          <div className="mx-auto max-w-6xl">
            {tab === "dashboard" && <DashboardTab />}
            {tab === "leads" && <LeadsTab />}
            {tab === "content" && <ContentTab />}
            {tab === "stats" && <StatsTab />}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  email,
  tab,
  onSelect,
  onSignOut,
  hideHeader,
}: {
  email: string;
  tab: TabKey;
  onSelect: (key: TabKey) => void;
  onSignOut: () => void;
  hideHeader?: boolean;
}) {
  return (
    <>
      {!hideHeader && (
        <div className="px-6 py-6">
          <p className="text-lg font-bold text-white">Admin Paneli</p>
          <p className="mt-1 truncate text-xs text-slate-400">{email}</p>
        </div>
      )}
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
              tab === item.key
                ? "bg-emerald-700 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="px-3 pb-6 pt-3">
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-400 hover:bg-slate-800"
        >
          <span>🚪</span>
          Çıkış Yap
        </button>
      </div>
    </>
  );
}
