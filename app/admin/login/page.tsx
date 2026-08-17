"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/data/site-config";

// Email + password login, restricted to the two admin emails in
// data/site-config.ts (`adminEmails`). Even if someone guessed the
// password, the email itself is checked here and again server-side (RLS
// policies use the same allowlist), so a third email can never get in.
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();

    if (!siteConfig.adminEmails.map((a) => a.toLowerCase()).includes(normalized)) {
      setError("Bu e-posta ile admin girişi yapılamaz.");
      return;
    }

    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: normalized, password });
    setLoading(false);

    if (error) {
      setError("Giriş başarısız. E-posta veya şifre hatalı.");
      return;
    }
    router.push("/admin");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Admin Girişi</h1>
      <form onSubmit={handleLogin} className="space-y-3">
        <input
          type="email"
          required
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        <input
          type="password"
          required
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-700 py-2 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}
