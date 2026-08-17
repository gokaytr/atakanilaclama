-- Full schema for the Atakan İlaçlama site's Supabase project.
-- Already applied to the live project via migrations — this file exists so
-- the schema can be recreated from scratch (new project, local dev, etc.)
-- and so it's documented in one place. Run in Project > SQL Editor.

-- ---------------------------------------------------------------------
-- leads — submissions from the WhatsApp/chat lead form.
-- ---------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  phone text,
  email text,
  pest_type text,
  source text,
  medium text,
  campaign text,
  page_url text
);

alter table public.leads enable row level security;

create policy "Anyone can submit a lead"
  on public.leads for insert
  to anon
  with check (true);

create policy "Admins can read leads"
  on public.leads for select
  to authenticated
  using ((auth.jwt() ->> 'email') in ('doganay9553@gmail.com', 'gokayterzi@gmail.com'));

-- ---------------------------------------------------------------------
-- site_settings — single-row table of admin-editable content (contact
-- info, hero image, promo video). Read by every visitor, written only by
-- the two admin emails.
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  phone_display text not null default '0 551 598 92 53',
  phone_raw text not null default '905515989253',
  whatsapp_message text not null default 'Merhaba, böcek ilaçlama hizmeti hakkında bilgi almak istiyorum.',
  address_city text not null default 'İstanbul',
  address_street text not null default '',
  instagram_url text not null default 'https://instagram.com/cevresaglik.ilaclama',
  facebook_url text not null default 'https://facebook.com/cevresaglik.ilaclama',
  hero_image_url text,
  promo_video_url text,
  google_tag_id text,
  hero_video_url text,
  hero_badge text,
  hero_title text,
  hero_description text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

alter table public.site_settings enable row level security;

create policy "Anyone can read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "Admins can update site settings"
  on public.site_settings for update
  to authenticated
  using ((auth.jwt() ->> 'email') in ('doganay9553@gmail.com', 'gokayterzi@gmail.com'))
  with check ((auth.jwt() ->> 'email') in ('doganay9553@gmail.com', 'gokayterzi@gmail.com'));

-- ---------------------------------------------------------------------
-- page_views — first-party pageview log used for the admin "unique
-- visitors" stat. No cookies, no third-party tracking.
-- ---------------------------------------------------------------------
create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  visitor_id text not null,
  page_path text not null
);

create index if not exists page_views_visitor_id_idx on public.page_views (visitor_id);
create index if not exists page_views_created_at_idx on public.page_views (created_at);

alter table public.page_views enable row level security;

create policy "Anyone can log a pageview"
  on public.page_views for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read pageviews"
  on public.page_views for select
  to authenticated
  using ((auth.jwt() ->> 'email') in ('doganay9553@gmail.com', 'gokayterzi@gmail.com'));

create or replace view public.page_view_stats as
select
  count(*)::bigint as total_views,
  count(distinct visitor_id)::bigint as unique_visitors,
  count(*) filter (where created_at >= now() - interval '30 days')::bigint as views_last_30d,
  count(distinct visitor_id) filter (where created_at >= now() - interval '30 days')::bigint as unique_visitors_last_30d,
  count(*) filter (where created_at >= now() - interval '7 days')::bigint as views_last_7d,
  count(distinct visitor_id) filter (where created_at >= now() - interval '7 days')::bigint as unique_visitors_last_7d
from public.page_views;

alter view public.page_view_stats set (security_invoker = on);

-- ---------------------------------------------------------------------
-- site-media — public storage bucket for admin-uploaded images (hero
-- banner, etc). Videos are NOT stored here; the admin panel takes a
-- YouTube/Vimeo link instead.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

create policy "Public can view site media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site-media');

create policy "Admins can upload site media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'site-media'
    and (auth.jwt() ->> 'email') in ('doganay9553@gmail.com', 'gokayterzi@gmail.com')
  );

create policy "Admins can update site media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'site-media'
    and (auth.jwt() ->> 'email') in ('doganay9553@gmail.com', 'gokayterzi@gmail.com')
  );

create policy "Admins can delete site media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'site-media'
    and (auth.jwt() ->> 'email') in ('doganay9553@gmail.com', 'gokayterzi@gmail.com')
  );

-- ---------------------------------------------------------------------
-- Admin login: passwordless magic-link (Supabase Auth "OTP" email).
-- Nothing to create manually here — /admin/login sends a link to whichever
-- of the two emails above is entered, and Supabase auto-creates the auth
-- user on first login. Access to any actual data is still gated by the
-- email-allowlist RLS policies above (and a client-side redirect-home
-- guard), not by whether an auth user happens to exist.
-- ---------------------------------------------------------------------
