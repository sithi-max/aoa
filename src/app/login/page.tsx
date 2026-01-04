"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onLogin() {
    setMsg(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setMsg(error.message);
    router.push("/arena");
  }

  async function resend() {
    setMsg(null);
    setBusy(true);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setBusy(false);
    if (error) return setMsg(error.message);
    setMsg("Confirmation email resent.");
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
              "radial-gradient(900px 300px at 50% 0%, rgba(46,196,241,0.18), transparent 55%), radial-gradient(900px 300px at 20% 110%, rgba(47,191,155,0.10), transparent 55%)",
            opacity: 0.85,
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative" }}>
          <div className="mx-auto h-12 w-12 rounded-2xl flex items-center justify-center"
               style={{ background: "rgba(231,234,240,0.06)", border: "1px solid rgba(231,234,240,0.10)" }}>
            <span style={{ color: "var(--cyan)", fontWeight: 800 }}>→</span>
          </div>

          <div className="text-center mt-4">
            <div className="text-2xl font-semibold">Sign in with email</div>
            <div className="text-sm mt-2" style={{ color: "var(--muted)" }}>
              Identity becomes a number. Nothing else.
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
              onClick={onLogin}
              disabled={busy}
              className="w-full rounded-2xl py-3 font-semibold"
              style={{
                background: "linear-gradient(180deg, rgba(231,234,240,0.14), rgba(231,234,240,0.08))",
                border: "1px solid rgba(231,234,240,0.16)",
                color: "var(--text)",
                opacity: busy ? 0.7 : 1,
              }}
            >
              {busy ? "Signing in…" : "Get Started"}
            </button>

            <div className="flex items-center justify-between text-sm mt-2" style={{ color: "var(--muted)" }}>
              <button onClick={resend} className="underline underline-offset-4" disabled={busy}>
                Resend confirmation
              </button>
              <button onClick={() => router.push("/signup")} className="underline underline-offset-4">
                Create account
              </button>
            </div>

            {msg && <div className="text-sm mt-3" style={{ color: "var(--muted)" }}>{msg}</div>}
          </div>
        </div>
      </div>
    </main>
  );
}
