"use client";

import { useEffect, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { supabase } from "@/lib/supabaseClient";
import { detectMediaKind, getSignedUrl } from "@/lib/storage";
import { isAdmin } from "@/lib/admin";
import { useRouter } from "next/navigation";

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
  created_by: string;
  created_at: string;
};

export default function DevAdsPage() {
  const router = useRouter();

  const [ok, setOk] = useState(false);
  const [ads, setAds] = useState<AdRow[]>([]);
  const [signed, setSigned] = useState<Record<string, string | null>>({});
  const [msg, setMsg] = useState<string | null>(null);

  const [placement, setPlacement] = useState<"left" | "right" | "feed">("left");
  const [tier, setTier] = useState(1);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return router.push("/login");
      const admin = await isAdmin();
      if (!admin) return router.push("/arena");
      setOk(true);
      await refresh();
    })();
  }, [router]);

  async function refresh() {
    setMsg(null);
    const { data } = await supabase.from("ads").select("*").order("tier", { ascending: true }).limit(200);
    const list = (data as AdRow[]) ?? [];
    setAds(list);

    const map: Record<string, string | null> = {};
    for (const a of list) {
      if (a.media_path) map[a.id] = await getSignedUrl(a.media_path);
      else map[a.id] = null;
    }
    setSigned(map);
  }

  async function createAd() {
    setMsg(null);

    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user.id;
    if (!uid) return router.push("/login");

    if (!title.trim()) return setMsg("Title is required.");
    if (!startsAt || !endsAt) return setMsg("Start and end time required.");

    let media_path: string | null = null;
    let media_type: string | null = null;

    if (file) {
      const kind = detectMediaKind(file.type);
      media_type = kind;

      const path = `${uid}/ads/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("aoa-media").upload(path, file, { contentType: file.type });
      if (error) return setMsg(`Upload failed: ${error.message}`);

      media_path = path;
    }

    const { error } = await supabase.from("ads").insert({
      placement,
      tier,
      title: title.trim(),
      body: body.trim() || null,
      url: url.trim() || null,
      media_path,
      media_type,
      starts_at: new Date(startsAt).toISOString(),
      ends_at: new Date(endsAt).toISOString(),
      is_active: true,
      created_by: uid,
    });

    if (error) return setMsg(error.message);

    setTitle(""); setBody(""); setUrl(""); setFile(null);
    await refresh();
  }

  async function deactivate(id: string) {
    const { error } = await supabase.from("ads").update({ is_active: false }).eq("id", id);
    if (error) setMsg(error.message);
    else await refresh();
  }

  if (!ok) return null;

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <TopNav />
      <div className="aoa-max px-4 py-6 space-y-4">
        <div className="rounded-3xl p-6" style={{ background: "rgba(22,29,51,0.66)", border: "1px solid rgba(231,234,240,0.06)" }}>
          <div className="text-lg font-semibold">Dev Ads (Admin)</div>
          <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Create and manage sponsored slots.
          </div>

          <div className="mt-5 grid md:grid-cols-2 gap-3">
            <select value={placement} onChange={(e) => setPlacement(e.target.value as any)}
              className="rounded-2xl p-3 bg-transparent border" style={{ borderColor: "rgba(231,234,240,0.12)" }}>
              <option value="left">left</option>
              <option value="right">right</option>
              <option value="feed">feed</option>
            </select>

            <input value={tier} onChange={(e) => setTier(parseInt(e.target.value || "1", 10))}
              className="rounded-2xl p-3 bg-transparent border" style={{ borderColor: "rgba(231,234,240,0.12)" }}
              placeholder="tier (1-40)" />

            <input value={title} onChange={(e) => setTitle(e.target.value)}
              className="rounded-2xl p-3 bg-transparent border md:col-span-2"
              style={{ borderColor: "rgba(231,234,240,0.12)" }} placeholder="Title" />

            <textarea value={body} onChange={(e) => setBody(e.target.value)}
              className="rounded-2xl p-3 bg-transparent border md:col-span-2"
              style={{ borderColor: "rgba(231,234,240,0.12)" }} placeholder="Body (optional)" />

            <input value={url} onChange={(e) => setUrl(e.target.value)}
              className="rounded-2xl p-3 bg-transparent border md:col-span-2"
              style={{ borderColor: "rgba(231,234,240,0.12)" }} placeholder="URL (optional)" />

            <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)}
              className="rounded-2xl p-3 bg-transparent border"
              style={{ borderColor: "rgba(231,234,240,0.12)" }} />

            <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)}
              className="rounded-2xl p-3 bg-transparent border"
              style={{ borderColor: "rgba(231,234,240,0.12)" }} />

            <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="md:col-span-2" />

            <button onClick={createAd}
              className="rounded-2xl p-3 font-semibold md:col-span-2"
              style={{ background: "rgba(46,196,241,0.16)", border: "1px solid rgba(46,196,241,0.22)", color: "var(--text)" }}>
              Create Ad
            </button>

            {msg && <div className="text-sm md:col-span-2" style={{ color: "var(--muted)" }}>{msg}</div>}
          </div>
        </div>

        <div className="rounded-3xl p-6" style={{ background: "rgba(22,29,51,0.66)", border: "1px solid rgba(231,234,240,0.06)" }}>
          <div className="text-lg font-semibold">Active Ads</div>

          <div className="mt-4 space-y-3">
            {ads.map((a) => (
              <div key={a.id} className="rounded-2xl p-4"
                style={{ background: "rgba(231,234,240,0.04)", border: "1px solid rgba(231,234,240,0.06)" }}>
                <div className="text-sm font-semibold">{a.title}</div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  {a.placement} · tier {a.tier} · {a.is_active ? "active" : "inactive"}
                </div>

                {signed[a.id] && a.media_type === "image" && (
                  <img src={signed[a.id] ?? ""} alt="ad" style={{ marginTop: 10, width: "100%", borderRadius: 14 }} />
                )}
                {signed[a.id] && a.media_type === "video" && (
                  <video src={signed[a.id] ?? ""} controls style={{ marginTop: 10, width: "100%", borderRadius: 14 }} />
                )}

                <div className="mt-3 flex gap-2">
                  <button onClick={() => deactivate(a.id)}
                    className="rounded-xl px-3 py-2 text-xs font-semibold"
                    style={{ background: "rgba(201,74,74,0.12)", border: "1px solid rgba(201,74,74,0.18)", color: "var(--crimson)" }}>
                    Deactivate
                  </button>
                </div>
              </div>
            ))}

            {ads.length === 0 && <div className="text-sm" style={{ color: "var(--muted)" }}>No ads yet.</div>}
          </div>
        </div>
      </div>
    </main>
  );
}
