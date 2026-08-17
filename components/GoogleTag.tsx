"use client";

// Loads Google Ads' gtag.js only when the admin has entered a Tag ID in
// the admin panel (Content > Google Ads). Renders nothing otherwise, so
// the site stays lean until an ad campaign is actually running.
import Script from "next/script";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

export default function GoogleTag() {
  const { googleTagId } = useSiteSettings();

  if (!googleTagId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${googleTagId}');
        `}
      </Script>
    </>
  );
}
