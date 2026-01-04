import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client only when env exists
export const supabase: SupabaseClient = (() => {
  if (url && anon) return createClient(url, anon);

  // Safe placeholder: won’t crash build unless you actually call it
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
