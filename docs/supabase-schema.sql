-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query)
-- Creates the "leads" table used by the chat widget + admin dashboard.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  phone text,
  email text,
  pest_type text,
  source text,      -- 'organic' | 'google_ads' | 'referral' | custom utm_source
  medium text,       -- 'organic' | 'cpc' | 'referral' | custom utm_medium
  campaign text,      -- utm_campaign value, if present
  page_url text       -- full URL the lead was submitted from
);

-- Row Level Security: the public "anon" key (used by the website) may only
-- INSERT new leads. It can never read, update, or delete existing leads.
alter table public.leads enable row level security;

create policy "Anyone can submit a lead"
  on public.leads for insert
  to anon
  with check (true);

-- Only authenticated users (i.e. logged-in admins) can read leads.
create policy "Authenticated users can read leads"
  on public.leads for select
  to authenticated
  using (true);

-- To create admin accounts: Supabase Dashboard > Authentication > Users >
-- Add user. Add both admin emails there with a password of your choice:
--   doganay9553@gmail.com
--   gokayterzi@gmail.com
