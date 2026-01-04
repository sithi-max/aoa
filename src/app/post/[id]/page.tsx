"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { TopNav } from "@/components/TopNav";
import { getSignedUrl } from "@/lib/storage";
import { isAdmin } from "@/lib/admin";

type PostRow = {
  id: string;
  owner_id: string;
  prompt: string;
  left_label: string;
  right_label: string;
  created_at: string;
  expires_at: string;
  media_type: string | null;
  media_path: string | null;
};

type VoteRow = { post_id: string; voter_id: string; choice: number };
type ProfileRow = { user_id: string; anon_number: number };

type CommentRow = {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  side: number; // 0 or 1
  parent_id: string | null;
  created_at: string;
};

type ReactionRow = { comment_id: string; user_id: string; value: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function PostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = params.id;

  const [admin, setAdmin] = useState(false);

  const [post, setPost] = useState<PostRow | null>(null);
  const [ownerAnon, setOwnerAnon] = useState<number | null>(null);

  const [leftVotes, setLeftVotes] = useState(0);
  const [rightVotes, setRightVotes] = useState(0);
  const [myChoice, setMyChoice] = useState<0 | 1 | null>(null);

  const [mediaSigned, setMediaSigned] = useState<string | null>(null);

  const [comments, setComments] = useState<CommentRow[]>([]);
  const [anonMap, setAnonMap] = useState<Record<string, number>>({});

  const [myReact, setMyReact] = useState<Record<string, -1 | 1 | 0>>({});
  const [reactCount, setReactCount] = useState<Record<string, { up: number; down: number }>>({});

  const [agreeText, setAgreeText] = useState("");
  const [disagreeText, setDisagreeText] = useState("");

  const [replyBox, setReplyBox] = useState<Record<string, string>>({}); // commentId -> text
  const [msg, setMsg] = useState<string | null>(null);

  const totalVotes = leftVotes + rightVotes;
  const leftRatio = totalVotes === 0 ? 0.5 : leftVotes / totalVotes;

  const dominance = useMemo(() => {
    if (totalVotes === 0) return "balanced";
    const diff = Math.abs(leftVotes - rightVotes) / totalVotes;
    if (diff < 0.12) return "balanced";
    return leftVotes > rightVotes ? "left" : "right";
  }, [leftVotes, rightVotes, totalVotes]);

  const heatOn = useMemo(() => dominance === "balanced" && totalVotes > 25, [dominance, totalVotes]);

  useEffect(() => {
    document.documentElement.style.setProperty("--cooldown-saturation", heatOn ? "0.85" : "1");
  }, [heatOn]);

  const meterLeftColor = "var(--emerald)";
  const meterRightColor = "var(--crimson)";

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
        return;
      }

      setAdmin(await isAdmin());

      // Post
      const { data: postData } = await supabase.from("posts").select("*").eq("id", postId).single();
      const p = postData as PostRow;
      setPost(p);

      // owner anon
      const { data: owner } = await supabase
        .from("profiles")
        .select("anon_number")
        .eq("user_id", p.owner_id)
        .maybeSingle();
      setOwnerAnon((owner as { anon_number: number } | null)?.anon_number ?? null);

      // media
      if (p.media_path) {
        setMediaSigned(await getSignedUrl(p.media_path));
      } else {
        setMediaSigned(null);
      }

      await refreshVotes();
      await refreshMyVote();
      await refreshComments();
    })();
  }, [postId, router]);

  async function refreshVotes() {
    const { data } = await supabase.from("votes").select("choice").eq("post_id", postId);
    const rows = (data ?? []) as { choice: number }[];
    const l = rows.filter((r) => r.choice === 0).length;
    const r = rows.filter((r) => r.choice === 1).length;
    setLeftVotes(l);
    setRightVotes(r);
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
    setMsg(null);
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user.id;
    if (!uid) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("votes").upsert({ post_id: postId, voter_id: uid, choice });
    if (error) {
      setMsg(error.message);
      return;
    }

    setMyChoice(choice);
    await refreshVotes();
    await refreshComments();
  }

  async function refreshComments() {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: false })
      .limit(300);

    const list = (data as CommentRow[]) ?? [];
    setComments(list);

    // Fetch anon numbers for all authors
    const ids = [...new Set(list.map((c) => c.author_id))];
    if (ids.length > 0) {
      const { data: profs } = await supabase.from("profiles").select("user_id, anon_number").in("user_id", ids);
      const map: Record<string, number> = {};
      (profs as ProfileRow[] | null)?.forEach((r) => (map[r.user_id] = r.anon_number));
      setAnonMap(map);
    }

    // Reactions
    const commentIds = list.map((c) => c.id);
    if (commentIds.length > 0) {
      const { data: reactions } = await supabase
        .from("comment_reactions")
        .select("comment_id, user_id, value")
        .in("comment_id", commentIds);

      const rx = (reactions as ReactionRow[] | null) ?? [];

      const count: Record<string, { up: number; down: number }> = {};
      commentIds.forEach((id) => (count[id] = { up: 0, down: 0 }));

      rx.forEach((r) => {
        if (!count[r.comment_id]) count[r.comment_id] = { up: 0, down: 0 };
        if (r.value === 1) count[r.comment_id].up += 1;
        if (r.value === -1) count[r.comment_id].down += 1;
      });

      setReactCount(count);

      const { data: sessionData } = await supabase.auth.getSession();
      const uid = sessionData.session?.user.id;
      const mine: Record<string, -1 | 1 | 0> = {};
      commentIds.forEach((id) => (mine[id] = 0));
      if (uid) {
        rx.filter((r) => r.user_id === uid).forEach((r) => (mine[r.comment_id] = (r.value as -1 | 1) ?? 0));
      }
      setMyReact(mine);
    }
  }

  async function addComment(side: 0 | 1, body: string, parentId: string | null) {
    setMsg(null);
    const text = body.trim();
    if (!text) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user.id;
    if (!uid) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      author_id: uid,
      body: text,
      side,
      parent_id: parentId,
    });

    if (error) {
      setMsg(error.message);
      return;
    }

    if (side === 0 && !parentId) setAgreeText("");
    if (side === 1 && !parentId) setDisagreeText("");
    if (parentId) setReplyBox((prev) => ({ ...prev, [parentId]: "" }));

    await refreshComments();
  }

  function scoreForComment(id: string) {
    const c = reactCount[id] ?? { up: 0, down: 0 };
    const total = c.up + c.down;
    if (total === 0) return 0;
    return clamp(((c.up - c.down) / total) * 100, -100, 100);
  }

  async function react(commentId: string, value: -1 | 1) {
    setMsg(null);
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user.id;
    if (!uid) return router.push("/login");

    const current = myReact[commentId] ?? 0;
    const next = current === value ? 0 : value;

    if (next === 0) {
      const { error } = await supabase
        .from("comment_reactions")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", uid);
      if (error) setMsg(error.message);
    } else {
      const { error } = await supabase
        .from("comment_reactions")
        .upsert({ comment_id: commentId, user_id: uid, value: next });
      if (error) setMsg(error.message);
    }

    await refreshComments();
  }

  async function report(kind: "post" | "comment", targetId: string) {
    setMsg(null);
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user.id;
    if (!uid) return router.push("/login");

    const { error } = await supabase
      .from("reports")
      .insert({ kind, target_id: targetId, reporter_id: uid, reason: "User report" });

    if (error) setMsg(error.message);
    else setMsg("Reported.");
  }

  async function adminDeleteComment(id: string) {
    if (!admin) return;
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) setMsg(error.message);
    else await refreshComments();
  }

  async function adminDeletePost() {
    if (!admin || !post) return;
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) setMsg(error.message);
    else router.push("/arena");
  }

  const agreeComments = useMemo(() => comments.filter((c) => c.side === 0), [comments]);
  const disagreeComments = useMemo(() => comments.filter((c) => c.side === 1), [comments]);

  const topLevel = (list: CommentRow[]) => list.filter((c) => !c.parent_id);
  const repliesFor = (id: string, list: CommentRow[]) => list.filter((c) => c.parent_id === id);

  if (!post) return null;

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)", filter: "saturate(var(--cooldown-saturation))" }}>
      <TopNav />

      <div className="aoa-max px-4 py-6 space-y-4">
        {/* Post Card */}
        <div
          style={{
            borderRadius: 18,
            overflow: "hidden",
            background: "rgba(22,29,51,0.66)",
            border: "1px solid rgba(231,234,240,0.06)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
          }}
        >
          {/* Score bar */}
          <div style={{ height: 12, width: "100%", background: "rgba(231,234,240,0.08)", position: "relative" }}>
            <div style={{ height: 12, width: `${leftRatio * 100}%`, background: meterLeftColor }} />
            <div style={{ position: "absolute", right: 0, top: 0, height: 12, width: `${(1 - leftRatio) * 100}%`, background: meterRightColor }} />
          </div>

          <div style={{ padding: 20 }}>
            <div className="text-xs" style={{ color: "var(--muted)" }}>
              {ownerAnon ? `User #${ownerAnon}` : "User #…"}
            </div>

            {mediaSigned && post.media_type === "image" && (
              <img
                src={mediaSigned}
                alt="Post media"
                style={{ marginTop: 12, width: "100%", borderRadius: 14, border: "1px solid rgba(231,234,240,0.08)" }}
              />
            )}

            {mediaSigned && post.media_type === "video" && (
              <video
                src={mediaSigned}
                controls
                style={{ marginTop: 12, width: "100%", borderRadius: 14, border: "1px solid rgba(231,234,240,0.08)" }}
              />
            )}

            <div style={{ marginTop: 12, fontSize: 18, lineHeight: 1.35, fontWeight: 700 }}>
              {post.prompt}
            </div>

            {/* Like/Dislike vote row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
              <button
                onClick={() => vote(0)}
                style={{
                  borderRadius: 12,
                  padding: "8px 14px",
                  fontSize: 14,
                  fontWeight: 800,
                  background: myChoice === 0 ? "rgba(47,191,155,0.20)" : "rgba(47,191,155,0.10)",
                  border: "1px solid rgba(47,191,155,0.22)",
                  color: "var(--emerald)",
                  cursor: "pointer",
                }}
              >
                Like
              </button>

              <button
                onClick={() => vote(1)}
                style={{
                  borderRadius: 12,
                  padding: "8px 14px",
                  fontSize: 14,
                  fontWeight: 800,
                  background: myChoice === 1 ? "rgba(201,74,74,0.20)" : "rgba(201,74,74,0.10)",
                  border: "1px solid rgba(201,74,74,0.22)",
                  color: "var(--crimson)",
                  cursor: "pointer",
                }}
              >
                Dislike
              </button>

              <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>
                Votes: {totalVotes}
              </div>

              <button
                onClick={() => report("post", post.id)}
                style={{
                  borderRadius: 12,
                  padding: "8px 12px",
                  fontSize: 12,
                  background: "rgba(231,234,240,0.06)",
                  border: "1px solid rgba(231,234,240,0.10)",
                  color: "var(--muted)",
                  cursor: "pointer",
                }}
              >
                Report
              </button>

              {admin && (
                <button
                  onClick={adminDeletePost}
                  style={{
                    borderRadius: 12,
                    padding: "8px 12px",
                    fontSize: 12,
                    background: "rgba(201,74,74,0.10)",
                    border: "1px solid rgba(201,74,74,0.18)",
                    color: "var(--crimson)",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              )}
            </div>

            {msg && <div className="text-xs mt-3" style={{ color: "var(--muted)" }}>{msg}</div>}
          </div>
        </div>

        {/* Arguments split */}
        <div className="aoa-args">

          {/* AGREE */}
          <div
            style={{
              borderRadius: 18,
              padding: 16,
              background: "rgba(22,29,51,0.55)",
              border: "1px solid rgba(47,191,155,0.18)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(900px 500px at 30% 20%, rgba(47,191,155,0.14), transparent 60%)",
                opacity: 0.35,
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative" }}>
              <div className="text-sm font-semibold" style={{ color: "var(--emerald)" }}>
                {post.left_label}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                You can post here only if you voted Like.
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={agreeText}
                  onChange={(e) => setAgreeText(e.target.value)}
                  disabled={myChoice !== 0}
                  placeholder={myChoice !== 0 ? "Vote Like to comment here…" : "Write your argument…"}
                  className="flex-1 rounded-xl p-3 bg-transparent border"
                  style={{
                    borderColor: "rgba(231,234,240,0.12)",
                    opacity: myChoice !== 0 ? 0.55 : 1,
                  }}
                />
                <button
                  onClick={() => addComment(0, agreeText, null)}
                  disabled={myChoice !== 0}
                  className="rounded-xl px-4 font-semibold"
                  style={{
                    background: "rgba(47,191,155,0.18)",
                    border: "1px solid rgba(47,191,155,0.22)",
                    color: "var(--text)",
                    opacity: myChoice !== 0 ? 0.55 : 1,
                    cursor: myChoice !== 0 ? "not-allowed" : "pointer",
                  }}
                >
                  Post
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {topLevel(agreeComments).map((c) => {
                  const userLabel = anonMap[c.author_id] ? `User #${anonMap[c.author_id]}` : "User #…";
                  const score = scoreForComment(c.id);
                  const rx = reactCount[c.id] ?? { up: 0, down: 0 };
                  const mine = myReact[c.id] ?? 0;
                  const reps = repliesFor(c.id, agreeComments);

                  return (
                    <div key={c.id}
                      style={{
                        borderRadius: 14,
                        padding: 14,
                        background: "rgba(231,234,240,0.04)",
                        border: "1px solid rgba(231,234,240,0.06)",
                      }}
                    >
                      <div className="text-sm">{c.body}</div>
                      <div className="text-xs mt-2" style={{ color: "var(--muted)" }}>{userLabel}</div>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => react(c.id, 1)}
                          style={{
                            borderRadius: 10,
                            padding: "6px 10px",
                            fontSize: 12,
                            background: mine === 1 ? "rgba(244,185,66,0.18)" : "rgba(244,185,66,0.08)",
                            border: "1px solid rgba(244,185,66,0.14)",
                            color: "var(--amber)",
                          }}
                        >
                          Like {rx.up}
                        </button>
                        <button
                          onClick={() => react(c.id, -1)}
                          style={{
                            borderRadius: 10,
                            padding: "6px 10px",
                            fontSize: 12,
                            background: mine === -1 ? "rgba(201,74,74,0.18)" : "rgba(201,74,74,0.08)",
                            border: "1px solid rgba(201,74,74,0.14)",
                            color: "var(--crimson)",
                          }}
                        >
                          Dislike {rx.down}
                        </button>

                        <div className="text-xs" style={{ color: "var(--muted)" }}>
                          Score: {Math.round(score)}%
                        </div>

                        <button
                          onClick={() => report("comment", c.id)}
                          className="ml-auto text-xs underline underline-offset-4"
                          style={{ color: "var(--muted)" }}
                        >
                          Report
                        </button>

                        {admin && (
                          <button
                            onClick={() => adminDeleteComment(c.id)}
                            className="text-xs underline underline-offset-4"
                            style={{ color: "var(--crimson)" }}
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      {/* Reply box */}
                      <div className="mt-3 flex gap-2">
                        <input
                          value={replyBox[c.id] ?? ""}
                          onChange={(e) => setReplyBox((prev) => ({ ...prev, [c.id]: e.target.value }))}
                          disabled={myChoice !== 0}
                          placeholder={myChoice !== 0 ? "Vote Like to reply…" : "Reply…"}
                          className="flex-1 rounded-xl p-2 bg-transparent border"
                          style={{
                            borderColor: "rgba(231,234,240,0.10)",
                            opacity: myChoice !== 0 ? 0.55 : 1,
                            fontSize: 12,
                          }}
                        />
                        <button
                          onClick={() => addComment(0, replyBox[c.id] ?? "", c.id)}
                          disabled={myChoice !== 0}
                          className="rounded-xl px-3 text-xs font-semibold"
                          style={{
                            background: "rgba(47,191,155,0.14)",
                            border: "1px solid rgba(47,191,155,0.18)",
                            color: "var(--text)",
                            opacity: myChoice !== 0 ? 0.55 : 1,
                          }}
                        >
                          Reply
                        </button>
                      </div>

                      {/* Replies */}
                      {reps.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {reps.map((r) => (
                            <div key={r.id}
                              style={{
                                borderRadius: 12,
                                padding: 12,
                                background: "rgba(11,16,32,0.30)",
                                border: "1px solid rgba(231,234,240,0.06)",
                              }}
                            >
                              <div className="text-xs" style={{ color: "rgba(231,234,240,0.92)" }}>{r.body}</div>
                              <div className="text-[11px] mt-2" style={{ color: "var(--muted)" }}>
                                {anonMap[r.author_id] ? `User #${anonMap[r.author_id]}` : "User #…"}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {agreeComments.length === 0 && (
                  <div className="text-sm" style={{ color: "var(--muted)" }}>
                    No arguments yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DISAGREE */}
          <div
            style={{
              borderRadius: 18,
              padding: 16,
              background: "rgba(22,29,51,0.55)",
              border: "1px solid rgba(201,74,74,0.18)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(900px 500px at 70% 20%, rgba(201,74,74,0.14), transparent 60%)",
                opacity: 0.35,
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative" }}>
              <div className="text-sm font-semibold" style={{ color: "var(--crimson)" }}>
                {post.right_label}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                You can post here only if you voted Dislike.
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={disagreeText}
                  onChange={(e) => setDisagreeText(e.target.value)}
                  disabled={myChoice !== 1}
                  placeholder={myChoice !== 1 ? "Vote Dislike to comment here…" : "Write your argument…"}
                  className="flex-1 rounded-xl p-3 bg-transparent border"
                  style={{
                    borderColor: "rgba(231,234,240,0.12)",
                    opacity: myChoice !== 1 ? 0.55 : 1,
                  }}
                />
                <button
                  onClick={() => addComment(1, disagreeText, null)}
                  disabled={myChoice !== 1}
                  className="rounded-xl px-4 font-semibold"
                  style={{
                    background: "rgba(201,74,74,0.18)",
                    border: "1px solid rgba(201,74,74,0.22)",
                    color: "var(--text)",
                    opacity: myChoice !== 1 ? 0.55 : 1,
                    cursor: myChoice !== 1 ? "not-allowed" : "pointer",
                  }}
                >
                  Post
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {topLevel(disagreeComments).map((c) => {
                  const userLabel = anonMap[c.author_id] ? `User #${anonMap[c.author_id]}` : "User #…";
                  const score = scoreForComment(c.id);
                  const rx = reactCount[c.id] ?? { up: 0, down: 0 };
                  const mine = myReact[c.id] ?? 0;
                  const reps = repliesFor(c.id, disagreeComments);

                  return (
                    <div key={c.id}
                      style={{
                        borderRadius: 14,
                        padding: 14,
                        background: "rgba(231,234,240,0.04)",
                        border: "1px solid rgba(231,234,240,0.06)",
                      }}
                    >
                      <div className="text-sm">{c.body}</div>
                      <div className="text-xs mt-2" style={{ color: "var(--muted)" }}>{userLabel}</div>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => react(c.id, 1)}
                          style={{
                            borderRadius: 10,
                            padding: "6px 10px",
                            fontSize: 12,
                            background: mine === 1 ? "rgba(244,185,66,0.18)" : "rgba(244,185,66,0.08)",
                            border: "1px solid rgba(244,185,66,0.14)",
                            color: "var(--amber)",
                          }}
                        >
                          Like {rx.up}
                        </button>
                        <button
                          onClick={() => react(c.id, -1)}
                          style={{
                            borderRadius: 10,
                            padding: "6px 10px",
                            fontSize: 12,
                            background: mine === -1 ? "rgba(201,74,74,0.18)" : "rgba(201,74,74,0.08)",
                            border: "1px solid rgba(201,74,74,0.14)",
                            color: "var(--crimson)",
                          }}
                        >
                          Dislike {rx.down}
                        </button>

                        <div className="text-xs" style={{ color: "var(--muted)" }}>
                          Score: {Math.round(score)}%
                        </div>

                        <button
                          onClick={() => report("comment", c.id)}
                          className="ml-auto text-xs underline underline-offset-4"
                          style={{ color: "var(--muted)" }}
                        >
                          Report
                        </button>

                        {admin && (
                          <button
                            onClick={() => adminDeleteComment(c.id)}
                            className="text-xs underline underline-offset-4"
                            style={{ color: "var(--crimson)" }}
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      {/* Reply box */}
                      <div className="mt-3 flex gap-2">
                        <input
                          value={replyBox[c.id] ?? ""}
                          onChange={(e) => setReplyBox((prev) => ({ ...prev, [c.id]: e.target.value }))}
                          disabled={myChoice !== 1}
                          placeholder={myChoice !== 1 ? "Vote Dislike to reply…" : "Reply…"}
                          className="flex-1 rounded-xl p-2 bg-transparent border"
                          style={{
                            borderColor: "rgba(231,234,240,0.10)",
                            opacity: myChoice !== 1 ? 0.55 : 1,
                            fontSize: 12,
                          }}
                        />
                        <button
                          onClick={() => addComment(1, replyBox[c.id] ?? "", c.id)}
                          disabled={myChoice !== 1}
                          className="rounded-xl px-3 text-xs font-semibold"
                          style={{
                            background: "rgba(201,74,74,0.14)",
                            border: "1px solid rgba(201,74,74,0.18)",
                            color: "var(--text)",
                            opacity: myChoice !== 1 ? 0.55 : 1,
                          }}
                        >
                          Reply
                        </button>
                      </div>

                      {/* Replies */}
                      {reps.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {reps.map((r) => (
                            <div key={r.id}
                              style={{
                                borderRadius: 12,
                                padding: 12,
                                background: "rgba(11,16,32,0.30)",
                                border: "1px solid rgba(231,234,240,0.06)",
                              }}
                            >
                              <div className="text-xs" style={{ color: "rgba(231,234,240,0.92)" }}>{r.body}</div>
                              <div className="text-[11px] mt-2" style={{ color: "var(--muted)" }}>
                                {anonMap[r.author_id] ? `User #${anonMap[r.author_id]}` : "User #…"}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {disagreeComments.length === 0 && (
                  <div className="text-sm" style={{ color: "var(--muted)" }}>
                    No arguments yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="text-xs mt-2" style={{ color: "var(--muted)" }}>
          <a className="underline underline-offset-4" href="/policies/terms">Terms</a>{" "}
          · <a className="underline underline-offset-4" href="/policies/privacy">Privacy</a>{" "}
          · <a className="underline underline-offset-4" href="/policies/advertising">Advertising Policy</a>
        </div>
      </div>
    </main>
  );
}
