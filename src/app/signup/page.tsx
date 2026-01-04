"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSignup() {
    setMsg(null);
    setBusy(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) return setMsg(error.message);
    setMsg("Account created. Check your email if confirmation is enabled, then log in.");
    router.push("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-5" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div
        className="w-full max-w-md rounded-3xl p-6"
        style={{
          background: "rgba(22,29,51,0.62)",
          border: "1px solid rgba(231,234,240,0.08)",
          boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
          backdropFilter: "blur(14px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(900px 300px at 50% 0%, rgba(47,191,155,0.16), transparent 55%), radial-gradient(900px 300px at 80% 110%, rgba(46,196,241,0.10), transparent 55%)",
            opacity: 0.85,
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative" }}>
          <div className="text-center">
            <div className="text-2xl font-semibold">Create your numeric identity</div>
            <div className="text-sm mt-2" style={{ color: "var(--muted)" }}>
              No usernames. No profiles. Just User #NN.
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <input
              className="w-full rounded-2xl px-4 py-3 bg-transparent border"
              style={{ borderColor: "rgba(231,234,240,0.10)", color: "var(--text)" }}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full rounded-2xl px-4 py-3 bg-transparent border"
              style={{ borderColor: "rgba(231,234,240,0.10)", color: "var(--text)" }}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={onSignup}
              disabled={busy}
              className="w-full rounded-2xl py-3 font-semibold"
              style={{
                background: "linear-gradient(180deg, rgba(46,196,241,0.22), rgba(46,196,241,0.10))",
                border: "1px solid rgba(46,196,241,0.22)",
                color: "var(--text)",
                opacity: busy ? 0.7 : 1,
              }}
            >
              {busy ? "Creating…" : "Create Account"}
            </button>

            <div className="text-sm mt-2 text-center" style={{ color: "var(--muted)" }}>
              Already have an account?{" "}
              <button onClick={() => router.push("/login")} className="underline underline-offset-4">
                Sign in
              </button>
            </div>

            {msg && <div className="text-sm mt-3" style={{ color: "var(--muted)" }}>{msg}</div>}
          </div>
        </div>
      </div>
    </main>
  );
}
