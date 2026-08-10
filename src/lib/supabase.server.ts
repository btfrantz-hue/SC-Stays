import { createClient } from "@supabase/supabase-js";

export function createSupabaseServerClient() {
  // The two lookups differ on purpose. VITE_SUPABASE_URL is a build-time value
  // that Vite inlines as a string literal, so import.meta.env resolves it on any
  // host without registering a runtime variable. SUPABASE_SERVICE_ROLE_KEY is a
  // real secret and must never be inlined into a bundle — it is read from
  // process.env at request time (set in the Vercel project's env vars).
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
