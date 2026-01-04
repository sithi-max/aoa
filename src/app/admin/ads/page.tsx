"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TopNav } from "@/components/TopNav";
import { useRouter } from "next/navigation";

const BUCKET = "aoa-media";

type AdminRow = { user_id: string };

type AdRow = {
  id: string;
  created_at: string;
  created_by: string;
  placement: "left" | "right" | "inline";
  slot_index: number;
  starts_at: string;
  ends_at: string;
  title: string;
  body: string;
  target_url: string | null;
  media_type: string | null;
  media_path: string | null;
  is_active: boolean;
};

function isoLocalNowPlus(hours: number) {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  // datetime-local expects "YYYY-MM-DDTHH:mm"
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: 18,
        background: "rgba(22,29,51,0.66)",
        border: "1px solid rgba(231,234,240,0.08)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
      }}
    >
      {children}
    </div>
  );
}

export default function AdminAdsPage() {
  const router = useRouter();

  const [uid, setUid] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const [ads, setAds] = useState<AdRow[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  // form
  const [placement, setPlacement] = useState<"left" | "right" | "inline">("left");
  const [slotIndex, setSlotIndex] = useState<number>(1);
  const [startsAt, setStartsAt] = useState<string>(isoLocalNowPlus(0));
  const [endsAt, setEndsAt] = useState<string>(isoLocalNowPlus(360)); // default 360h
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(() => title.trim().length > 0 && body.trim().length > 0 && !saving, [title, body, saving]);

  useEffect(() => {
    (async () => {
      setMsg(null);

      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        router.replace("/login");
        return;
      }
      setUid(session.user.id);

      // check admin
      const { data: adminData, error } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) {
        setIsAdmin(false);
        return;
      }

      setIsAdmin(!!(adminData as AdminRow | null));
    })();
  }, [router]);

  useEffect(() => {
    if (isAdmin) void refreshAds();
  }, [isAdmin]);

  async function refreshAds() {
    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      setMsg(error.message);
      return;
    }
    setAds((data as AdRow[]) ?? []);
  }

  function publicUrl(path: string) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async function uploadIfNeeded(): Promise<{ media_path: string | null; media_type: string | null }> {
    if (!file) return { media_path: null, media_type: null };

    const ext = file.name.split(".").pop() || "bin";
    const safeName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
    const path = `ads/${uid ?? "unknown"}/${safeName}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
    if (error) throw new Error(`Upload failed: ${error.message}`);

    return { media_path: path, media_type: file.type || "application/octet-stream" };
  }

  async function createAd() {
    if (!uid) return router.replace("/login");
    if (!canSave) return;

    setSaving(true);
    setMsg(null);

    try {
      const uploaded = await uploadIfNeeded();

      const startsIso = new Date(startsAt).toISOString();
      const endsIso = new Date(endsAt).toISOString();

      const { error } = await supabase.from("ads").insert({
        placement,
        slot_index: placement === "inline" ? 1 : slotIndex,
        starts_at: startsIso,
        ends_at: endsIso,
        title: title.trim(),
        body: body.trim(),
        target_url: targetUrl.trim() || null,
        media_type: uploaded.media_type,
        media_path: uploaded.media_path,
        is_active: true,
      });

      if (error) throw new Error(error.message);

      // reset
      setTitle("");
      setBody("");
      setTargetUrl("");
      setFile(null);

      await refreshAds();
      setMsg("Ad created.");
    } catch (e: unknown) {
      const m = e instanceof Error ? e.message : "Unknown error";
      setMsg(m);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(ad: AdRow) {
    setMsg(null);
    const { error } = await supabase.from("ads").update({ is_active: !ad.is_active }).eq("id", ad.id);
    if (error) return setMsg(error.message);
    await refreshAds();
  }

  if (isAdmin === null) return null;

  if (!isAdmin) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
        <TopNav showActions={false} />
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "22px 16px" }}>
          <Card>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Access denied</div>
            <div style={{ marginTop: 8, color: "var(--muted)", fontSize: 13 }}>
              You are not in <code style={{ color: "var(--cyan)" }}>public.admins</code>.
              Add your auth user UUID there to enable this page.
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <TopNav showActions={false} />

      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(900px 600px at 50% 18%, rgba(46,196,241,0.10), transparent 60%), radial-gradient(900px 700px at 20% 85%, rgba(47,191,155,0.08), transparent 55%), radial-gradient(900px 700px at 85% 85%, rgba(201,74,74,0.07), transparent 55%)",
        }}
      />

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "22px 16px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gap: 14 }}>
          <Card>
            <div style={{ fontWeight: 900, fontSize: 20 }}>Developer: Ads Manager</div>
            <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 13 }}>
              Create side ads (left/right) or inline sponsored posts. Scheduling controls visibility.
            </div>

            <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Placement</div>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value as "left" | "right" | "inline")}
                    style={{
                      width: "100%",
                      marginTop: 6,
                      borderRadius: 12,
                      padding: "10px 12px",
                      background: "rgba(231,234,240,0.06)",
                      border: "1px solid rgba(231,234,240,0.10)",
                      color: "var(--text)",
                      outline: "none",
                    }}
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="inline">Inline (after 3rd post)</option>
                  </select>
                </div>

                <div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Slot index (for side placements)</div>
                  <input
                    value={slotIndex}
                    onChange={(e) => setSlotIndex(Math.max(1, Number(e.target.value || 1)))}
                    type="number"
                    min={1}
                    disabled={placement === "inline"}
                    style={{
                      width: "100%",
                      marginTop: 6,
                      borderRadius: 12,
                      padding: "10px 12px",
                      background: "rgba(231,234,240,0.06)",
                      border: "1px solid rgba(231,234,240,0.10)",
                      color: "var(--text)",
                      outline: "none",
                      opacity: placement === "inline" ? 0.5 : 1,
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Starts</div>
                  <input
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    style={{
                      width: "100%",
                      marginTop: 6,
                      borderRadius: 12,
                      padding: "10px 12px",
                      background: "rgba(231,234,240,0.06)",
                      border: "1px solid rgba(231,234,240,0.10)",
                      color: "var(--text)",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Ends</div>
                  <input
                    type="datetime-local"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    style={{
                      width: "100%",
                      marginTop: 6,
                      borderRadius: 12,
                      padding: "10px 12px",
                      background: "rgba(231,234,240,0.06)",
                      border: "1px solid rgba(231,234,240,0.10)",
                      color: "var(--text)",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Title</div>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ad title"
                  style={{
                    width: "100%",
                    marginTop: 6,
                    borderRadius: 12,
                    padding: "10px 12px",
                    background: "rgba(231,234,240,0.06)",
                    border: "1px solid rgba(231,234,240,0.10)",
                    color: "var(--text)",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Body</div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Short description"
                  style={{
                    width: "100%",
                    marginTop: 6,
                    borderRadius: 12,
                    padding: "10px 12px",
                    minHeight: 90,
                    resize: "vertical",
                    background: "rgba(231,234,240,0.06)",
                    border: "1px solid rgba(231,234,240,0.10)",
                    color: "var(--text)",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Target URL (optional)</div>
                  <input
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://example.com"
                    style={{
                      width: "100%",
                      marginTop: 6,
                      borderRadius: 12,
                      padding: "10px 12px",
                      background: "rgba(231,234,240,0.06)",
                      border: "1px solid rgba(231,234,240,0.10)",
                      color: "var(--text)",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Media (optional)</div>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    style={{ marginTop: 10, color: "var(--muted)" }}
                  />
                </div>
              </div>

              <button
                onClick={createAd}
                disabled={!canSave}
                style={{
                  marginTop: 4,
                  borderRadius: 14,
                  padding: "12px 14px",
                  fontWeight: 900,
                  background: "var(--cyan)",
                  color: "rgba(6,16,24,0.95)",
                  border: "1px solid rgba(46,196,241,0.45)",
                  cursor: canSave ? "pointer" : "not-allowed",
                  opacity: canSave ? 1 : 0.6,
                }}
              >
                {saving ? "Saving…" : "Create Ad"}
              </button>

              {msg ? <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 13 }}>{msg}</div> : null}
            </div>
          </Card>

          <Card>
            <div style={{ fontWeight: 900, fontSize: 16 }}>Existing ads</div>
            <div style={{ marginTop: 10, display: "grid", gap: 12 }}>
              {ads.map((a) => (
                <div
                  key={a.id}
                  style={{
                    borderRadius: 16,
                    padding: 14,
                    background: "rgba(231,234,240,0.05)",
                    border: "1px solid rgba(231,234,240,0.08)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                    <div style={{ fontWeight: 900 }}>
                      {a.title}{" "}
                      <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 800 }}>
                        ({a.placement}{a.placement !== "inline" ? ` #${a.slot_index}` : ""})
                      </span>
                    </div>
                    <button
                      onClick={() => void toggleActive(a)}
                      style={{
                        borderRadius: 12,
                        padding: "8px 12px",
                        fontWeight: 900,
                        background: a.is_active ? "rgba(47,191,155,0.14)" : "rgba(201,74,74,0.14)",
                        border: "1px solid rgba(231,234,240,0.10)",
                        color: a.is_active ? "var(--emerald)" : "var(--crimson)",
                        cursor: "pointer",
                      }}
                    >
                      {a.is_active ? "Active" : "Off"}
                    </button>
                  </div>

                  <div style={{ marginTop: 8, color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>{a.body}</div>

                  <div style={{ marginTop: 10, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>
                      {new Date(a.starts_at).toLocaleString()} → {new Date(a.ends_at).toLocaleString()}
                    </div>

                    {a.target_url ? (
                      <a
                        href={a.target_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "var(--cyan)", fontWeight: 900, textDecoration: "none", fontSize: 12 }}
                      >
                        Link ↗
                      </a>
                    ) : null}

                    {a.media_path && a.media_type ? (
                      <a
                        href={publicUrl(a.media_path)}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "var(--amber)", fontWeight: 900, textDecoration: "none", fontSize: 12 }}
                      >
                        Media ↗
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}

              {ads.length === 0 ? <div style={{ color: "var(--muted)" }}>No ads yet.</div> : null}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
