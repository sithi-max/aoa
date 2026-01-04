"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TopNav } from "@/components/TopNav";
import { useRouter } from "next/navigation";
import { detectMediaKind } from "@/lib/storage";

export default function CreatePage() {
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [leftLabel, setLeftLabel] = useState("Agree");
  const [rightLabel, setRightLabel] = useState("Disagree");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const fileHint = useMemo(() => {
    if (!file) return "Optional: image or video (recommended).";
    return `${file.name} • ${(file.size / (1024 * 1024)).toFixed(2)} MB`;
  }, [file]);

  async function createPost() {
    setMsg(null);
    setBusy(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user.id;
    if (!uid) {
      setBusy(false);
      router.push("/login");
      return;
    }

    const p = prompt.trim();
    if (!p) {
      setBusy(false);
      setMsg("Prompt is required.");
      return;
    }

    // Upload first (optional)
    let media_path: string | null = null;
    let media_type: string | null = null;

    if (file) {
      // limits
      const maxMb = file.type.startsWith("video/") ? 80 : 20;
      const sizeMb = file.size / (1024 * 1024);
      if (sizeMb > maxMb) {
        setBusy(false);
        setMsg(`File too large. Max ${maxMb}MB.`);
        return;
      }

      const kind = detectMediaKind(file.type);
      if (kind === "file") {
        setBusy(false);
        setMsg("Only images/videos for MVP.");
        return;
      }

      const path = `${uid}/${Date.now()}-${file.name}`;
      const { error: uploadErr } = await supabase.storage.from("aoa-media").upload(path, file, {
        upsert: false,
        contentType: file.type,
      });

      if (uploadErr) {
        setBusy(false);
        setMsg(`Upload failed: ${uploadErr.message}`);
        return;
      }

      media_path = path;
      media_type = kind;
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        owner_id: uid,
        prompt: p,
        left_label: leftLabel.trim() || "Agree",
        right_label: rightLabel.trim() || "Disagree",
        media_path,
        media_type,
      })
      .select("id")
      .single();

    setBusy(false);

    if (error) return setMsg(error.message);
    router.push(`/post/${data.id}`);
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <TopNav />
      <div className="aoa-max px-4 py-6">
        <div
          className="rounded-3xl p-6"
          style={{
            background: "rgba(22,29,51,0.66)",
            border: "1px solid rgba(231,234,240,0.06)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
          }}
        >
          <div className="text-lg font-semibold">Create Arena Thread</div>
          <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Binary choice only. Expires in 24 hours.
          </div>

          <div className="mt-5 space-y-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full rounded-2xl p-4 bg-transparent border min-h-[140px]"
              style={{ borderColor: "rgba(231,234,240,0.12)" }}
              placeholder="Example: 'Is this good or bad?'"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                value={leftLabel}
                onChange={(e) => setLeftLabel(e.target.value)}
                className="rounded-2xl p-3 bg-transparent border"
                style={{ borderColor: "rgba(47,191,155,0.22)" }}
                placeholder="Left label"
              />
              <input
                value={rightLabel}
                onChange={(e) => setRightLabel(e.target.value)}
                className="rounded-2xl p-3 bg-transparent border"
                style={{ borderColor: "rgba(201,74,74,0.22)" }}
                placeholder="Right label"
              />
            </div>

            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(231,234,240,0.04)", border: "1px solid rgba(231,234,240,0.06)" }}
            >
              <div className="text-sm font-medium">Media</div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                {fileHint}
              </div>
              <input
                className="mt-3"
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <button
              onClick={createPost}
              disabled={busy}
              className="w-full rounded-2xl p-3 font-semibold"
              style={{
                background: "rgba(46,196,241,0.16)",
                border: "1px solid rgba(46,196,241,0.22)",
                color: "var(--text)",
                opacity: busy ? 0.7 : 1,
              }}
            >
              {busy ? "Publishing…" : "Publish"}
            </button>

            {msg && <div className="text-sm" style={{ color: "var(--muted)" }}>{msg}</div>}
          </div>
        </div>
      </div>
    </main>
  );
}
