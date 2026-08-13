"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/data/site-config";

// Passwordless magic-link login, restricted to the two admin emails set in
// data/site-config.ts (`adminEmails`). The email field only accepts those
// two addresses — anyone else is rejected before a request even reaches
// Supabase. The real security boundary is server-side (RLS policies check
// the same allowlist), this is just so a stranger gets a clear message
// instead of a login form that looks like it might work for them.
export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();

    if (!siteConfig.adminEmails.map((a) => a.toLowerCase()).includes(normalized)) {
      setStatus("error");
      setErrorMsg("Bu e-posta ile admin girişi yapılamaz.");
      return;
    }

    setStatus("sending");
    setErrorMsg(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: normalized,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });

    if (error) {
      setStatus("error");
      setErrorMsg("Giriş linki gönderilemedi. Lütfen tekrar deneyin.");
      return;
    }
    setStatus("sent");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Admin Girişi</h1>
      <p className="mb-6 text-sm text-slate-500">
        Yetkili e-posta adresinizi girin, size giriş linki gönderelim.
      </p>

      {status === "sent" ? (
        <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
          ✓ <strong>{email}</strong> adresine bir giriş linki gönderdik.
          Gelen kutunuzu (ve gerekirse spam klasörünü) kontrol edip linke
          tıklayın.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          {status === "error" && errorMsg && (
            <p className="text-sm text-red-600">{errorMsg}</p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-lg bg-emerald-700 py-2 font-semibold text-white disabled:opacity-60"
          >
            {status === "sending" ? "Gönderiliyor..." : "Giriş Linki Gönder"}
          </button>
        </form>
      )}
    </div>
  );
}
