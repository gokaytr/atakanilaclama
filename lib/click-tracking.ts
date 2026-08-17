// Fire-and-forget click logger for the site's main conversion buttons
// (WhatsApp / phone). Uses fetch with keepalive so the request still goes
// out even though the click immediately navigates away (to wa.me or a
// tel: link). Never throws, never blocks navigation, and requires no
// extra round trip through supabase-js.
const STORAGE_KEY = "atakan_visitor_id";

function getVisitorId(): string {
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return "unknown";
  }
}

// A visit counts as ad-sourced if it still carries a Google Ads click id
// or a cpc/google utm tag in the current URL (only true on the landing
// page from the ad itself, which is exactly what we want to measure).
function isAdsVisit(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has("gclid") || params.has("gbraid") || params.has("wbraid")) return true;
    if (params.get("utm_medium") === "cpc") return true;
    if (params.get("utm_source") === "google" && params.get("utm_medium") === "ads") return true;
    return false;
  } catch {
    return false;
  }
}

export function logClick(eventType: "whatsapp" | "phone") {
  if (typeof window === "undefined") return;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return;

  try {
    const body = JSON.stringify({
      visitor_id: getVisitorId(),
      event_type: eventType,
      page_path: window.location.pathname,
      is_ads: isAdsVisit(),
    });

    fetch(`${supabaseUrl}/rest/v1/click_events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Prefer: "return=minimal",
      },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Tracking must never break the button it's attached to.
  }
}
