// Supabase client factory. Reads credentials from environment variables so
// no secret ever lives in the source code. Set these in Vercel project
// settings and in a local .env.local file (never commit .env.local).
import { createClient } from "@supabase/supabase-js";

const hasCredentials =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Placeholder keeps createClient() from throwing during build when env vars
// aren't set yet (e.g. first local build before .env.local is created).
// Once real env vars are set in Vercel/`.env.local`, this branch is unused.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

if (!hasCredentials) {
  // Fails loudly in development so missing env vars are caught early.
  // In production this simply means forms will not be able to submit
  // until the Vercel environment variables are configured.
  console.warn(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing."
  );
}

// Public client: safe to use in the browser (chat widget, lead form).
// Row Level Security (RLS) policies in Supabase must restrict what the
// anon key can do — e.g. it should only be able to INSERT into "leads",
// never SELECT/UPDATE/DELETE.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
