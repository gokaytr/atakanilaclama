import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { districts } from "@/data/districts";

export default function Footer() {
  // Show a handful of districts in the footer for internal linking (SEO)
  // without overwhelming the page — full list lives on /bolgeler.
  const featured = districts.slice(0, 12);

  return (
    <footer className="mt-16 border-t border-green-900/10 bg-green-950 text-green-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold">{siteConfig.companyName}</h3>
            <p className="mt-2 text-sm text-green-200">{siteConfig.tagline}</p>
            <p className="mt-4 text-sm text-green-200">
              Sağlık Bakanlığı onaylı biyosidal ürünlerle İstanbul genelinde
              ev, iş yeri ve kurumsal alanlara profesyonel haşere ilaçlama
              hizmeti sunuyoruz.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Hizmet Bölgelerimiz</h4>
            <ul className="mt-2 grid grid-cols-2 gap-1 text-sm text-green-200">
              {featured.map((d) => (
                <li key={d.slug}>
                  <Link href={`/${d.slug}-bocek-ilaclama`} className="hover:text-white">
                    {d.name} Böcek İlaçlama
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/bolgeler" className="mt-2 inline-block text-sm underline">
              Tüm bölgeleri gör →
            </Link>
          </div>

          <div>
            <h4 className="font-semibold">İletişim</h4>
            <p className="mt-2 text-sm text-green-200">{siteConfig.phoneDisplay}</p>
            <p className="text-sm text-green-200">{siteConfig.address.city}, Türkiye</p>
            <div className="mt-3 flex gap-3 text-sm">
              <a href={siteConfig.social.instagram} className="hover:text-white">Instagram</a>
              <a href={siteConfig.social.facebook} className="hover:text-white">Facebook</a>
            </div>
          </div>
        </div>

        <p className="mt-8 border-t border-green-900/40 pt-4 text-xs text-green-300">
          © {new Date().getFullYear()} {siteConfig.legalName}. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
