"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { TopNav } from "@/components/TopNav";
import { getSignedUrl } from "@/lib/storage";

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

type VoteRow = { post_id: string; voter_id: string; choice: number };
type ProfileRow = { user_id: string; anon_number: number };
type AdRow = {
  id: string;
  placement: "left" | "right" | "feed";
  tier: number;
  title: string;
  body: string | null;
  url: string | null;
  media_path: string | null;
  media_type: string | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
};

function AdCard({ ad, signedUrl }: { ad: AdRow; signedUrl: string | null }) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: 16,
        background: "rgba(22,29,51,0.58)",
        border: "1px solid rgba(231,234,240,0.06)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="text-xs font-semibold" style={{ color: "var(--amber)", letterSpacing: 0.5 }}>
        SPONSORED
      </div>

      <div className="mt-2 text-sm font-semibold" style={{ color: "var(--text)" }}>
        {ad.title}
      </div>

      {ad.body && (
        <div className="mt-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
          {ad.body}
        </div>
      )}

      {signedUrl && ad.media_type === "image" && (
        <img
          src={signedUrl}
          alt="Ad media"
          style={{ marginTop: 10, width: "100%", borderRadius: 14, border: "1px solid rgba(231,234,240,0.08)" }}
        />
      )}

      {signedUrl && ad.media_type === "video" && (
        <video
          src={signedUrl}
          controls
          style={{ marginTop: 10, width: "100%", borderRadius: 14, border: "1px solid rgba(231,234,240,0.08)" }}
        />
      )}

      {ad.url && (
        <a
          href={ad.url}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-3 text-xs underline underline-offset-4"
          style={{ color: "var(--cyan)" }}
        >
          Visit
        </a>
      )}
    </div>
  );
}

export default function ArenaFeedPage() {
  const router = useRouter();

  const [sessionReady, setSessionReady] = useState(false);
  const [myAnon, setMyAnon] = useState<number | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [counts, setCounts] = useState<Record<string, { left: number; right: number }>>({});
  const [myVotes, setMyVotes] = useState<Record<string, 0 | 1 | null>>({});
  const [ownerAnonMap, setOwnerAnonMap] = useState<Record<string, number>>({});
  const [mediaUrl, setMediaUrl] = useState<Record<string, string | null>>({});

  const [leftAds, setLeftAds] = useState<AdRow[]>([]);
  const [rightAds, setRightAds] = useState<AdRow[]>([]);
  const [adUrl, setAdUrl] = useState<Record<string, string | null>>({});

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        router.push("/login");
        return;
      }
      setSessionReady(true);

      // my anon
      const { data: prof } = await supabase
        .from("profiles")
        .select("anon_number")
        .eq("user_id", session.user.id)
        .maybeSingle();

      setMyAnon((prof as { anon_number: number } | null)?.anon_number ?? null);

      // posts
      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(40);

      const list = (postsData as Post[]) ?? [];
      setPosts(list);

      // owners anon
      const ownerIds = [...new Set(list.map((p) => p.owner_id))];
      if (ownerIds.length > 0) {
        const { data: owners } = await supabase
          .from("profiles")
          .select("user_id, anon_number")
          .in("user_id", ownerIds);

        const map: Record<string, number> = {};
        (owners as ProfileRow[] | null)?.forEach((r) => {
          map[r.user_id] = r.anon_number;
        });
        setOwnerAnonMap(map);
      }

      // vote counts + my vote
      const postIds = list.map((p) => p.id);
      if (postIds.length > 0) {
        const { data: voteData } = await supabase
          .from("votes")
          .select("post_id, voter_id, choice")
          .in("post_id", postIds);

        const rows = (voteData as VoteRow[]) ?? [];
        const countMap: Record<string, { left: number; right: number }> = {};
        const mineMap: Record<string, 0 | 1 | null> = {};
        postIds.forEach((pid) => {
          countMap[pid] = { left: 0, right: 0 };
          mineMap[pid] = null;
        });

        for (const r of rows) {
          if (r.choice === 0) countMap[r.post_id].left += 1;
          if (r.choice === 1) countMap[r.post_id].right += 1;
          if (r.voter_id === session.user.id) mineMap[r.post_id] = r.choice as 0 | 1;
        }

        setCounts(countMap);
        setMyVotes(mineMap);
      }

      // signed media urls for feed
      const urlMap: Record<string, string | null> = {};
      for (const p of list) {
        if (p.media_path) {
          urlMap[p.id] = await getSignedUrl(p.media_path);
        } else {
          urlMap[p.id] = null;
        }
      }
      setMediaUrl(urlMap);

      // ads
      const { data: adsData } = await supabase
        .from("ads")
        .select("*")
        .order("tier", { ascending: true })
        .limit(60);

      const ads = (adsData as AdRow[]) ?? [];
      const left = ads.filter((a) => a.placement === "left");
      const right = ads.filter((a) => a.placement === "right");
      setLeftAds(left);
      setRightAds(right);

      const adSigned: Record<string, string | null> = {};
      for (const a of ads) {
        if (a.media_path) adSigned[a.id] = await getSignedUrl(a.media_path);
        else adSigned[a.id] = null;
      }
      setAdUrl(adSigned);
    })();
  }, [router]);

  async function voteOnPost(postId: string, choice: 0 | 1) {
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user.id;
    if (!uid) {
      router.push("/login");
      return;
    }

    const { error } = await supabase
      .from("votes")
      .upsert({ post_id: postId, voter_id: uid, choice });

    if (error) return;

    setMyVotes((prev) => ({ ...prev, [postId]: choice }));

    // refresh counts only for that post
    const { data } = await supabase.from("votes").select("choice").eq("post_id", postId);
    const choices = (data ?? []) as { choice: number }[];
    const left = choices.filter((c) => c.choice === 0).length;
    const right = choices.filter((c) => c.choice === 1).length;
    setCounts((prev) => ({ ...prev, [postId]: { left, right } }));
  }

  const identity = useMemo(() => (myAnon ? `User #${myAnon}` : "User #…"), [myAnon]);

  if (!sessionReady) return null;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", position: "relative", overflow: "hidden" }}>
      <TopNav />

      {/* background wash */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(900px 600px at 50% 20%, rgba(46,196,241,0.10), transparent 60%), radial-gradient(900px 700px at 20% 80%, rgba(47,191,155,0.08), transparent 55%), radial-gradient(900px 700px at 80% 85%, rgba(201,74,74,0.07), transparent 55%)",
          opacity: 0.95,
        }}
      />

      <div className="aoa-max px-4 py-6" style={{ position: "relative", zIndex: 1 }}>
        <div className="rounded-2xl p-4 mb-4"
          style={{ background: "rgba(22,29,51,0.58)", border: "1px solid rgba(231,234,240,0.06)", backdropFilter: "blur(10px)" }}>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Identity</div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{identity}</div>
        </div>

        <div className="aoa-grid">
          {/* Left rail */}
          <aside className="aoa-rail">
            <div className="text-xs mb-2" style={{ color: "var(--muted)" }}>Sponsored</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {leftAds.slice(0, 6).map((a) => (
                <AdCard key={a.id} ad={a} signedUrl={adUrl[a.id] ?? null} />
              ))}
            </div>
          </aside>

          {/* Feed */}
          <section style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {posts.map((p) => {
              const c = counts[p.id] ?? { left: 0, right: 0 };
              const total = c.left + c.right;
              const leftRatio = total === 0 ? 0.5 : c.left / total;
              const my = myVotes[p.id];
              const owner = ownerAnonMap[p.owner_id] ? `User #${ownerAnonMap[p.owner_id]}` : "User #…";

              return (
                <div
                  key={p.id}
                  style={{
                    borderRadius: 18,
                    overflow: "hidden",
                    background: "rgba(22,29,51,0.66)",
                    border: "1px solid rgba(231,234,240,0.06)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
                  }}
                >
                  {/* score bar */}
                  <div style={{ height: 12, width: "100%", background: "rgba(231,234,240,0.08)", position: "relative" }}>
                    <div style={{ height: 12, width: `${leftRatio * 100}%`, background: "var(--emerald)" }} />
                    <div style={{ position: "absolute", right: 0, top: 0, height: 12, width: `${(1 - leftRatio) * 100}%`, background: "var(--crimson)" }} />
                  </div>

                  <div style={{ padding: 20 }}>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>{owner}</div>

                    {/* media */}
                    {mediaUrl[p.id] && p.media_type === "image" && (
                      <img
                        src={mediaUrl[p.id] ?? ""}
                        alt="Post media"
                        style={{ marginTop: 12, width: "100%", borderRadius: 14, border: "1px solid rgba(231,234,240,0.08)" }}
                      />
                    )}

                    {mediaUrl[p.id] && p.media_type === "video" && (
                      <video
                        src={mediaUrl[p.id] ?? ""}
                        controls
                        style={{ marginTop: 12, width: "100%", borderRadius: 14, border: "1px solid rgba(231,234,240,0.08)" }}
                      />
                    )}

                    <Link href={`/post/${p.id}`} style={{ display: "block", marginTop: 12, textDecoration: "none" }}>
                      <div style={{ fontSize: 18, lineHeight: 1.35, color: "rgba(231,234,240,0.95)", fontWeight: 650 }}>
                        {p.prompt}
                      </div>
                    </Link>

                    {/* like/dislike */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
                      <button
                        onClick={() => voteOnPost(p.id, 0)}
                        style={{
                          borderRadius: 12,
                          padding: "8px 14px",
                          fontSize: 14,
                          fontWeight: 700,
                          background: my === 0 ? "rgba(47,191,155,0.20)" : "rgba(47,191,155,0.10)",
                          border: "1px solid rgba(47,191,155,0.22)",
                          color: "var(--emerald)",
                          cursor: "pointer",
                        }}
                      >
                        Like
                      </button>

                      <button
                        onClick={() => voteOnPost(p.id, 1)}
                        style={{
                          borderRadius: 12,
                          padding: "8px 14px",
                          fontSize: 14,
                          fontWeight: 700,
                          background: my === 1 ? "rgba(201,74,74,0.20)" : "rgba(201,74,74,0.10)",
                          border: "1px solid rgba(201,74,74,0.22)",
                          color: "var(--crimson)",
                          cursor: "pointer",
                        }}
                      >
                        Dislike
                      </button>

                      <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>
                        {total === 0 ? "No votes yet" : `Votes: ${total}`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {posts.length === 0 && (
              <div
                style={{
                  borderRadius: 18,
                  padding: 18,
                  background: "rgba(22,29,51,0.60)",
                  border: "1px solid rgba(231,234,240,0.06)",
                  color: "var(--muted)",
                }}
              >
                No active posts. Create the first arena thread.
              </div>
            )}
          </section>

          {/* Right rail */}
          <aside className="aoa-rail">
            <div className="text-xs mb-2" style={{ color: "var(--muted)" }}>Sponsored</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {rightAds.slice(0, 6).map((a) => (
                <AdCard key={a.id} ad={a} signedUrl={adUrl[a.id] ?? null} />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
