import { supabase } from "@/lib/supabaseClient";

export type MediaKind = "image" | "video" | "file";

export function detectMediaKind(mime: string): MediaKind {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  return "file";
}

export async function getSignedUrl(path: string, expiresIn = 60 * 60) {
  const { data, error } = await supabase.storage.from("aoa-media").createSignedUrl(path, expiresIn);
  if (error) return null;
  return data.signedUrl;
}
