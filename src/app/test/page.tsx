import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function TestPage() {
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
