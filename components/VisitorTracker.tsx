"use client";

// First-party pageview beacon for the admin "unique visitors" stat.
// Generates (or reuses) a random id stored in localStorage per browser —
// no cookies, no third-party script, no personal data — and logs one row
// per page view into public.page_views. Fails silently if Supabase isn't
// reachable so it never affects the visitor's experience.
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "atakan_visitor_id";

function getOrCreateVisitorId(): string {
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    // localStorage unavailable (private mode, disabled storage, etc.) —
    // fall back to a per-load id; it just won't count as a returning visit.
    return crypto.randomUUID();
  }
}

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const visitorId = getOrCreateVisitorId();
    supabase
      .from("page_views")
      .insert({ visitor_id: visitorId, page_path: pathname })
      .then(({ error }) => {
        if (error) console.warn("[visitor-tracker] insert failed:", error.message);
      });
  }, [pathname]);

  return null;
}
