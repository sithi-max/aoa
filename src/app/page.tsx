"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TopNav } from "@/components/TopNav";
import Link from "next/link";

type Post = {
  id: string;
  owner_id: string;
  created_at: string;
  expires_at: string;
  prompt: string;
  left_label: string;
  right_label: string;
  media_type: string | null;
  media_path: string | null;
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        window.location.href = "/login";
        return;
      }
      setSessionReady(true);

      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      setPosts((postsData as Post[]) ?? []);
    })();
  }, []);

  if (!sessionReady) return null;

  return (
    <main className="min-h-screen">
      <TopNav />
      <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
        {posts.map((p) => (
          <Link key={p.id} href={`/post/${p.id}`} className="block">
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--surface)" }}
            >
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                Open Arena Thread
              </div>

              <div className="mt-2 text-lg leading-snug">{p.prompt}</div>

              <div className="mt-4 flex gap-2 text-sm">
                <span
                  className="px-3 py-1 rounded-xl"
                  style={{
                    background: "rgba(47,191,155,0.12)",
                    color: "var(--emerald)",
                  }}
                >
                  {p.left_label}
                </span>

                <span
                  className="px-3 py-1 rounded-xl"
                  style={{
                    background: "rgba(201,74,74,0.12)",
                    color: "var(--crimson)",
                  }}
                >
                  {p.right_label}
                </span>
              </div>
            </div>
          </Link>
        ))}

        {posts.length === 0 && (
          <div
            className="rounded-2xl p-6 text-sm"
            style={{ background: "var(--surface)", color: "var(--muted)" }}
          >
            No active posts. Create the first arena thread.
          </div>
        )}
      </div>
    </main>
  );
}
