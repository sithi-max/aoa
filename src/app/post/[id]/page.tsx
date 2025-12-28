"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TopNav } from "@/components/TopNav";
import { useParams } from "next/navigation";

type Post = {
  id: string;
  owner_id: string;
  prompt: string;
  left_label: string;
  right_label: string;
  created_at: string;
  expires_at: string;
};

type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
};

export default function PostPage() {
  const params = useParams<{ id: string }>();
  const postId = params.id;

  // Post + identity
  const [post, setPost] = useState<Post | null>(null);
  const [ownerAnon, setOwnerAnon] = useState<number | null>(null);

  // Votes
  const [leftVotes, setLeftVotes] = useState(0);
  const [rightVotes, setRightVotes] = useState(0);
  const [myChoice, setMyChoice] = useState<0 | 1 | null>(null);

  // Comments + identity map
  const [comments, setComments] = useState<Comment[]>([]);
  const [anonMap, setAnonMap] = useState<Record<string, number>>({});
  const [commentText, setCommentText] = useState("");

  const total = leftVotes + rightVotes;

  // ─────────────────────────────────────────
  // Majority dominance
  // ─────────────────────────────────────────
  const dominance = useMemo(() => {
    if (total === 0) return "balanced";
    const diff = Math.abs(leftVotes - rightVotes) / total;
    if (diff < 0.12) return "balanced";
    return leftVotes > rightVotes ? "left" : "right";
  }, [leftVotes, rightVotes, total]);

  const meterColor =
    dominance === "left"
      ? "var(--emerald)"
      : dominance === "right"
      ? "var(--crimson)"
      : "var(--amber)";

  const leftRatio = total === 0 ? 0.5 : leftVotes / total;

  // ─────────────────────────────────────────
  // 🔥 CONFLICT COOLING (AUTOMATIC)
  // ─────────────────────────────────────────
  useEffect(() => {
    const heat = dominance === "balanced" && total > 25;
    document.documentElement.style.setProperty(
      "--cooldown-saturation",
      heat ? "0.85" : "1"
    );
  }, [dominance, total]);

  // ─────────────────────────────────────────
  // Initial load
  // ─────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        window.location.href = "/login";
        return;
      }

      const { data: postData } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (!postData) return;

      setPost(postData as Post);
      await loadOwnerAnon(postData.owner_id);
      await refreshVotes();
      await refreshMyVote();
      await refreshComments();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  // ─────────────────────────────────────────
  // Numeric identity loaders
  // ─────────────────────────────────────────
  async function loadOwnerAnon(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("anon_number")
      .eq("user_id", userId)
      .maybeSingle();

    setOwnerAnon(data?.anon_number ?? null);
  }

  async function loadAnonNumbersForComments(list: Comment[]) {
    const ids = [...new Set(list.map((c) => c.author_id))];
    if (ids.length === 0) return;

    const { data } = await supabase
      .from("profiles")
      .select("user_id, anon_number")
      .in("user_id", ids);

    const map: Record<string, number> = {};
    (data ?? []).forEach((r: any) => {
      map[r.user_id] = r.anon_number;
    });

    setAnonMap(map);
  }

  // ─────────────────────────────────────────
  // Votes
  // ─────────────────────────────────────────
  async function refreshVotes() {
    const { data } = await supabase
      .from("votes")
      .select("choice")
      .eq("post_id", postId);

    const choices = (data ?? []) as { choice: number }[];
    setLeftVotes(choices.filter((c) => c.choice === 0).length);
    setRightVotes(choices.filter((c) => c.choice === 1).length);
  }

  async function refreshMyVote() {
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user.id;
    if (!uid) return;

    const { data } = await supabase
      .from("votes")
      .select("choice")
      .eq("post_id", postId)
      .eq("voter_id", uid)
      .maybeSingle();

    setMyChoice((data?.choice ?? null) as 0 | 1 | null);
  }

  async function vote(choice: 0 | 1) {
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user.id;
    if (!uid) return;

    await supabase.from("votes").upsert({
      post_id: postId,
      voter_id: uid,
      choice,
    });

    setMyChoice(choice);
    await refreshVotes();
  }

  // ─────────────────────────────────────────
  // Comments
  // ─────────────────────────────────────────
  async function refreshComments() {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    const list = (data ?? []) as Comment[];
    setComments(list);
    await loadAnonNumbersForComments(list);
  }

  async function addComment() {
    const body = commentText.trim();
    if (!body) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user.id;
    if (!uid) return;

    await supabase.from("comments").insert({
      post_id: postId,
      author_id: uid,
      body,
    });

    setCommentText("");
    await refreshComments();
  }

  if (!post) return null;

  return (
    <main
      className="min-h-screen"
      style={{ filter: "saturate(var(--cooldown-saturation))" }}
    >
      <TopNav />

      <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
        {/* Majority meter */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)" }}>
          <div className="h-2 w-full" style={{ background: "rgba(231,234,240,0.10)" }}>
            <div
              className="h-2"
              style={{ width: `${leftRatio * 100}%`, background: meterColor }}
            />
          </div>

          <div className="p-5">
            <div className="text-xs" style={{ color: "var(--muted)" }}>
              {ownerAnon ? `User #${ownerAnon}` : "User #…"}
            </div>

            <div className="mt-2 text-lg">{post.prompt}</div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => vote(0)}
                className="rounded-2xl p-4"
                style={{
                  background:
                    myChoice === 0 ? "rgba(47,191,155,0.20)" : "rgba(47,191,155,0.10)",
                }}
              >
                {post.left_label}
              </button>

              <button
                onClick={() => vote(1)}
                className="rounded-2xl p-4"
                style={{
                  background:
                    myChoice === 1 ? "rgba(201,74,74,0.20)" : "rgba(201,74,74,0.10)",
                }}
              >
                {post.right_label}
              </button>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="rounded-2xl p-5" style={{ background: "var(--surface)" }}>
          <div className="text-sm font-medium">Comments</div>

          <div className="mt-4 flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 rounded-xl p-3 bg-transparent border"
              placeholder="Say something that matters…"
            />
            <button onClick={addComment}>Post</button>
          </div>

          <div className="mt-5 space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="rounded-xl p-4">
                <div>{c.body}</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>
                  {anonMap[c.author_id]
                    ? `User #${anonMap[c.author_id]}`
                    : "User #…"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
