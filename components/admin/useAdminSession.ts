"use client";

// Shared guard for every /admin page. Two distinct outcomes:
// - No session at all → send to /admin/login (needs to request a link).
// - A session exists but the email isn't one of the two admin addresses →
//   treat as an outsider: sign out immediately and send to the homepage,
//   never to the login page (matches "dışarıdan biri girerse anasayfaya
//   atsın").
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/data/site-config";

const ALLOWED_EMAILS = siteConfig.adminEmails.map((e) => e.toLowerCase());

export function useAdminSession() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    function evaluate(nextSession: Session | null) {
      const email = nextSession?.user?.email?.toLowerCase();

      if (!nextSession) {
        setChecked(true);
        router.replace("/admin/login");
        return;
      }

      if (!email || !ALLOWED_EMAILS.includes(email)) {
        supabase.auth.signOut().finally(() => {
          setChecked(true);
          router.replace("/");
        });
        return;
      }

      setSession(nextSession);
      setChecked(true);
    }

    supabase.auth.getSession().then(({ data }) => evaluate(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      evaluate(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  return { session, ready: checked && !!session };
}
