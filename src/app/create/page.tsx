"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TopNav } from "@/components/TopNav";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [leftLabel, setLeftLabel] = useState("Agree");
  const [rightLabel, setRightLabel] = useState("Disagree");
  const [msg, setMsg] = useState<string | null>(null);

  async function createPost() {
    setMsg(null);

    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user.id;

    if (!uid) {
      router.push("/login");
      return;
    }

    const p = prompt.trim();
    if (!p) {
      setMsg("Prompt is required.");
      return;
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        owner_id: uid,
        prompt: p,
        left_label: leftLabel.trim() || "Yes",
        right_label: rightLabel.trim() || "No",
      })
      .select("id")
      .single();

    if (error) {
      setMsg(error.message);
      return;
    }

    router.push(`/post/${data.id}`);
  }

  return (
    <main className="min-h-screen">
      <TopNav />

      <div className="max-w-xl mx-auto px-4 py-6">
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--surface)" }}
        >
          <div className="text-lg font-semibold">Create Arena Thread</div>
          <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Binary choice only. Expires in 24 hours.
          </div>

          <div className="mt-5 space-y-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full rounded-xl p-3 bg-transparent border min-h-[120px]"
              style={{ borderColor: "rgba(231,234,240,0.12)" }}
              placeholder="Example: 'Is this good or bad?'"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                value={leftLabel}
                onChange={(e) => setLeftLabel(e.target.value)}
                className="rounded-xl p-3 bg-transparent border"
                style={{ borderColor: "rgba(47,191,155,0.25)" }}
                placeholder="Left label"
              />
              <input
                value={rightLabel}
                onChange={(e) => setRightLabel(e.target.value)}
                className="rounded-xl p-3 bg-transparent border"
                style={{ borderColor: "rgba(201,74,74,0.25)" }}
                placeholder="Right label"
              />
            </div>

            <button
              onClick={createPost}
              className="w-full rounded-xl p-3 font-medium"
              style={{ background: "var(--cyan)", color: "#061018" }}
            >
              Publish
            </button>

            {msg && (
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                {msg}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
