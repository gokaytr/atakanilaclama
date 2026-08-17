import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActionBar from "@/components/FloatingActionBar";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import VisitorTracker from "@/components/VisitorTracker";
import GoogleTag from "@/components/GoogleTag";
import { siteConfig } from "@/data/site-config";
import { buildLocalBusinessSchema, toJsonLd } from "@/lib/schema";

// Using the OS system font stack instead of next/font/google: one less
// network dependency (faster first paint) and Turkish characters render
// natively without any font-loading flash. Defined in globals.css.

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: `${siteConfig.companyName} | İstanbul Böcek İlaçlama`,
    template: `%s | ${siteConfig.companyName}`,
  },
  description:
    "İstanbul genelinde ev, iş yeri ve kurumsal alanlarda profesyonel, Sağlık Bakanlığı onaylı böcek ve haşere ilaçlama hizmeti. Hemen WhatsApp'tan yazın.",
  keywords: [
    "böcek ilaçlama istanbul",
    "haşere ilaçlama",
    "koltuk yıkama istanbul",
    "hamam böceği ilaçlama",
    "tahta kurusu ilaçlama",
  ],
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: siteConfig.companyName,
    images: [{ url: "/logo.jpg", width: 1179, height: 1196, alt: siteConfig.companyName }],
  },
  twitter: {
    card: "summary",
    title: `${siteConfig.companyName} | İstanbul Böcek İlaçlama`,
    description:
      "İstanbul genelinde profesyonel böcek ilaçlama ve koltuk yıkama hizmeti.",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col pb-16 md:pb-0">
        {/* Sitewide LocalBusiness structured data for SEO rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(buildLocalBusinessSchema()) }}
        />
        <SiteSettingsProvider>
          <GoogleTag />
          <VisitorTracker />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingActionBar />
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
