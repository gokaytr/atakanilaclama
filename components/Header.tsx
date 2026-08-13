import Link from "next/link";
import { siteConfig, buildTelLink } from "@/data/site-config";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-green-900/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <span className="text-lg font-bold text-green-900">
            {siteConfig.companyName}
          </span>
        </Link>

        {/* Desktop navigation — hidden on small screens */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <Link href="/" className="hover:text-green-700">Ana Sayfa</Link>
          <Link href="/hizmetler" className="hover:text-green-700">Hizmetlerimiz</Link>
          <Link href="/bolgeler" className="hover:text-green-700">Hizmet Bölgeleri</Link>
          <Link href="/hakkimizda" className="hover:text-green-700">Hakkımızda</Link>
          <Link href="/iletisim" className="hover:text-green-700">İletişim</Link>
        </nav>

        <a
          href={buildTelLink()}
          className="hidden rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 md:inline-block"
        >
          {siteConfig.phoneDisplay}
        </a>
      </div>
    </header>
  );
}
