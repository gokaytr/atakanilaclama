"use client";

// Fetches the live, admin-editable site settings once on the client and
// makes them available to Header/Footer/FloatingActionBar/İletişim/homepage
// via context. Starts with the static defaults (so there's no layout shift
// or flash of empty content) and swaps in the live values once loaded.
import { createContext, useContext, useEffect, useState } from "react";
import { defaultSiteSettings, fetchSiteSettings, type SiteSettings } from "@/lib/site-settings";

const SiteSettingsContext = createContext<SiteSettings>(defaultSiteSettings);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    let cancelled = false;
    fetchSiteSettings().then((live) => {
      if (!cancelled) setSettings(live);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext);
}
