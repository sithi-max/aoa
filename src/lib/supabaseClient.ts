import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient = (() => {
  // Normal case (prod + dev) — works
  if (url && anon) return createClient(url, anon);

  // Build-safe fallback: only throws if you actually try to use it
  return new Proxy(
    {},
    {
      get() {
        throw new Error(
          "Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel."
        );
      },
    }
  ) as unknown as SupabaseClient;
})();
