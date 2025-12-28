import { supabase } from "./supabaseClient";

export async function getAnonNumber(userId: string): Promise<number | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("anon_number")
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data?.anon_number ?? null;
}
