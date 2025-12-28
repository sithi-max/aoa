import { supabase } from "@/lib/supabaseClient";

export default async function SupabaseTest() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .limit(1);

  return (
    <pre style={{ color: "white" }}>
      {JSON.stringify({ data, error }, null, 2)}
    </pre>
  );
}
