"use client";

// Price list CRUD for the admin panel. Backs the homepage "Fiyat Listesi"
// section (public.pricing_items table) — see lib/pricing.ts.
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type PricingRow = {
  id: string;
  name: string;
  icon: string;
  price_from: number;
  sort_order: number;
};

const EMPTY_FORM = { id: null as string | null, name: "", icon: "💰", price_from: "", sort_order: "" };

export default function PricingTab() {
  const [items, setItems] = useState<PricingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  function loadItems() {
    supabase
      .from("pricing_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setItems(data as PricingRow[]);
        setLoading(false);
      });
  }

  useEffect(() => {
    const timer = setTimeout(loadItems, 0);
    return () => clearTimeout(timer);
  }, []);

  function resetForm() {
    const nextOrder = items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) + 1 : 1;
    setForm({ ...EMPTY_FORM, sort_order: String(nextOrder) });
    setMessage(null);
  }

  function startEdit(item: PricingRow) {
    setForm({
      id: item.id,
      name: item.name,
      icon: item.icon,
      price_from: String(item.price_from),
      sort_order: String(item.sort_order),
    });
    setMessage(null);
  }

  async function handleDelete(item: PricingRow) {
    if (!window.confirm(`"${item.name}" satırını silmek istediğinize emin misiniz?`)) return;
    const { error } = await supabase.from("pricing_items").delete().eq("id", item.id);
    if (error) {
      setMessage({ type: "error", text: "Silinemedi: " + error.message });
      return;
    }
    if (form.id === item.id) resetForm();
    loadItems();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      name: form.name,
      icon: form.icon || "💰",
      price_from: Number(form.price_from),
      sort_order: Number(form.sort_order) || 0,
      updated_at: new Date().toISOString(),
    };

    const { error } = form.id
      ? await supabase.from("pricing_items").update(payload).eq("id", form.id)
      : await supabase.from("pricing_items").insert(payload);

    setSaving(false);

    if (error) {
      setMessage({ type: "error", text: "Kaydedilemedi: " + error.message });
      return;
    }

    setMessage({ type: "ok", text: "Kaydedildi." });
    resetForm();
    loadItems();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Fiyatlar</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ana sayfadaki fiyat listesini buradan güncelleyebilirsiniz. Değişiklikler siteye birkaç
        dakika içinde yansır.
      </p>

      <form onSubmit={handleSave} className="mt-6 max-w-xl space-y-3 rounded-2xl border border-slate-200 p-5">
        <h2 className="font-bold text-slate-900">{form.id ? "Satırı Düzenle" : "Yeni Satır Ekle"}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Hizmet adı (ör. Ev İlaçlama)">
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
          <Field label="İkon (emoji)">
            <input
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
          <Field label="Başlangıç fiyatı (TL)">
            <input
              required
              type="number"
              min={0}
              value={form.price_from}
              onChange={(e) => setForm((f) => ({ ...f, price_from: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
          <Field label="Sıra (küçük sayı önce görünür)">
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
        </div>

        {message && (
          <p className={`text-sm ${message.type === "ok" ? "text-emerald-700" : "text-red-600"}`}>{message.text}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-emerald-700 px-6 py-2.5 font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Kaydediliyor..." : form.id ? "Güncelle" : "Ekle"}
          </button>
          {form.id && (
            <button type="button" onClick={resetForm} className="text-sm font-semibold text-slate-500 hover:text-slate-700">
              Vazgeç
            </button>
          )}
        </div>
      </form>

      <h2 className="mb-3 mt-10 text-lg font-bold text-slate-900">Fiyat Listesi</h2>
      {loading ? (
        <p className="text-slate-500">Yükleniyor...</p>
      ) : items.length === 0 ? (
        <p className="text-slate-500">Henüz fiyat eklenmedi.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.price_from.toLocaleString("tr-TR")} TL&apos;den</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-3">
                <button onClick={() => startEdit(item)} className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                  Düzenle
                </button>
                <button onClick={() => handleDelete(item)} className="text-sm font-semibold text-red-600 hover:text-red-700">
                  Sil
                </button>
              </div>
            </div>
          ))}
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
