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

function isAdsVisit(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has("gclid") || params.has("gbraid") || params.has("wbraid")) return true;
    if (params.get("utm_medium") === "cpc") return true;
    return false;
  } catch {
    return false;
  }
}

// Simple, standard mobile-UA sniffing — good enough to split "masaüstü" vs
// "mobil" for the admin dashboard without any external library.
function detectDevice(): "mobile" | "desktop" {
  try {
    return /Mobi|Android|iPhone|iPad/i.test(window.navigator.userAgent) ? "mobile" : "desktop";
  } catch {
    return "desktop";
  }
}

// Buckets document.referrer into a small set of recognizable sources.
// "direct" covers both a truly empty referrer and same-site navigation
// (clicking between our own pages shouldn't count as a new "source").
function detectReferrerSource(): string {
  try {
    const ref = document.referrer;
    if (!ref) return "direct";
    const host = new URL(ref).hostname.replace(/^www\./, "");
    if (host === window.location.hostname) return "direct";
    if (host.includes("google.")) return "google";
    if (host.includes("instagram.")) return "instagram";
    if (host.includes("facebook.") || host.includes("fb.com")) return "facebook";
    if (host.includes("whatsapp.")) return "whatsapp";
    if (host.includes("yandex.")) return "yandex";
    if (host.includes("bing.")) return "bing";
    return "other";
  } catch {
    return "direct";
  }
}

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Admin's own visits shouldn't skew the public visitor stats.
    if (pathname.startsWith("/admin")) return;

    const visitorId = getOrCreateVisitorId();
    supabase
      .from("page_views")
      .insert({
        visitor_id: visitorId,
        page_path: pathname,
        is_ads: isAdsVisit(),
        device: detectDevice(),
        referrer_source: detectReferrerSource(),
      })
      .then(({ error }) => {
        if (error) console.warn("[visitor-tracker] insert failed:", error.message);
      });
  }, [pathname]);

  return null;
}
