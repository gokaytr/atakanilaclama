# Atakan İlaçlama — Böcek İlaçlama Web Sitesi

İstanbul geneli böcek ilaçlama hizmeti için SEO odaklı kurumsal site.
Next.js (App Router) + Tailwind CSS + Supabase ile geliştirilmiştir.

## Proje Yapısı
- `app/` — sayfalar (Next.js App Router)
  - `app/[district]/page.tsx` — her ilçe için otomatik SEO sayfası (`/kagithane-bocek-ilaclama` vb.)
  - `app/hizmetler/[service]/page.tsx` — her haşere türü için otomatik sayfa
  - `app/admin/` — admin paneli (giriş + lead listesi + istatistikler)
  - `app/sitemap.ts`, `app/robots.ts` — otomatik SEO dosyaları
- `data/` — düzenlenebilir içerik (ilçeler, hizmetler, fiyatlar, iletişim bilgileri)
- `components/` — Header, Footer, WhatsApp/telefon barı, chat/lead formu
- `lib/` — Supabase client, schema.org (JSON-LD) yardımcıları
- `docs/supabase-schema.sql` — Supabase'de çalıştırılacak SQL (leads tablosu + güvenlik kuralları)

## Yeni bir ilçe veya hizmet eklemek
`data/districts.ts` veya `data/services.ts` dosyasına bir satır eklemeniz
yeterli — ilgili SEO sayfası, sitemap kaydı ve menü linki otomatik oluşur.

## Kurulum (yerel geliştirme)
```bash
npm install
cp .env.example .env.local   # Supabase bilgilerini girin
npm run dev
```

## Supabase Kurulumu
1. supabase.com üzerinde proje oluşturun (veya mevcut projeyi kullanın).
2. SQL Editor'de `docs/supabase-schema.sql` içeriğini çalıştırın.
3. Project Settings > API'den `URL` ve `anon public key` değerlerini alıp
   `.env.local` dosyasına ve Vercel proje ayarlarındaki Environment
   Variables kısmına ekleyin.
4. Authentication > Users kısmından admin hesaplarını (iki mail adresi)
   manuel olarak oluşturun.

## Vercel'e Deploy
1. GitHub reposunu Vercel'e bağlayın (Import Project).
2. Environment Variables kısmına `.env.example` içindeki değişkenleri girin.
3. Deploy — her `git push` sonrası otomatik yeniden yayınlanır.

## Sırada Ne Var (Yol Haritası)
- [ ] Gerçek logo ve marka renkleri ile tasarımı netleştirme
- [ ] Google Tag Manager + Google Ads conversion tracking ekleme
- [ ] Google Search Console'a sitemap gönderimi
- [ ] Google Business Profile ile site entegrasyonu
- [ ] Google review linkinin footer/chat widget'a eklenmesi
- [ ] Instagram/WhatsApp Business API entegrasyonu (istenirse)
