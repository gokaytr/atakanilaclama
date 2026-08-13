"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { siteConfig, buildWhatsappLink } from "@/data/site-config";

type Status = "idle" | "submitting" | "success" | "error";

// Reads UTM parameters and referrer from the current URL so the admin
// panel can later tell organic visits apart from paid (Google/Meta Ads)
// visits. This runs only in the browser (client component).
function detectSource(): { source: string; medium: string; campaign: string | null } {
  if (typeof window === "undefined") {
    return { source: "unknown", medium: "unknown", campaign: null };
  }
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");
  const utmMedium = params.get("utm_medium");
  const utmCampaign = params.get("utm_campaign");
  const gclid = params.get("gclid"); // present on Google Ads clicks

  if (gclid || utmSource === "google" && utmMedium === "cpc") {
    return { source: "google_ads", medium: "cpc", campaign: utmCampaign };
  }
  if (utmSource) {
    return { source: utmSource, medium: utmMedium ?? "unknown", campaign: utmCampaign };
  }
  if (document.referrer && !document.referrer.includes(window.location.hostname)) {
    return { source: "referral", medium: "referral", campaign: null };
  }
  return { source: "organic", medium: "organic", campaign: null };
}

export default function LeadChatWidget() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pestType, setPestType] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone && !email) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    const { source, medium, campaign } = detectSource();

    const { error } = await supabase.from("leads").insert({
      name,
      phone,
      email,
      pest_type: pestType,
      source,
      medium,
      campaign,
      page_url: typeof window !== "undefined" ? window.location.href : null,
    });

    if (error) {
      console.error("[lead-widget] insert failed:", error.message);
      setStatus("error");
      return;
    }
    setStatus("success");
  }

  return (
    <>
      {/* Launcher bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-700 text-2xl text-white shadow-lg md:bottom-6"
        aria-label="Haşere uzmanına yaz"
      >
        🪲
      </button>

      {open && (
        <div className="fixed bottom-36 right-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-black/10 bg-white p-4 shadow-2xl md:bottom-24">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-bold text-green-900">Haşere Uzmanı</h3>
            <button onClick={() => setOpen(false)} aria-label="Kapat">✕</button>
          </div>

          {status === "success" ? (
            <div className="py-6 text-center text-sm text-green-800">
              Teşekkürler! Bilgileriniz alındı, ekibimiz size en kısa
              sürede dönüş yapacak. Acil durumlar için doğrudan{" "}
              <a href={buildWhatsappLink()} className="underline">WhatsApp</a>{" "}
              üzerinden de yazabilirsiniz.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2 text-sm">
              <p className="text-slate-600">
                Telefon veya e-posta bırakın, size hemen dönelim.
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefon numaranız"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta (opsiyonel)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
              <select
                value={pestType}
                onChange={(e) => setPestType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="">Haşere türü seçin (opsiyonel)</option>
                <option>Hamam Böceği</option>
                <option>Tahta Kurusu</option>
                <option>Karınca</option>
                <option>Fare</option>
                <option>Sivrisinek</option>
                <option>Diğer</option>
              </select>

              {status === "error" && (
                <p className="text-red-600">
                  Telefon veya e-posta girin, ya da doğrudan{" "}
                  <a href={buildWhatsappLink()} className="underline">WhatsApp</a>{" "}
                  üzerinden yazın.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-lg bg-green-700 py-2 font-semibold text-white disabled:opacity-60"
              >
                {status === "submitting" ? "Gönderiliyor..." : "Bize Ulaşın"}
              </button>
              <p className="text-center text-xs text-slate-400">
                veya {siteConfig.phoneDisplay}
              </p>
            </form>
          )}
        </div>
      )}
    </>
  );
}
