"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSignup() {
    setMsg(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return setMsg(error.message);
    setMsg("Account created. Please log in.");
    router.push("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: "var(--surface)" }}
      >
        <div className="text-2xl font-semibold">AOA</div>
        <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Anonymous Opinion Arena
        </div>

        <div className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl p-3 bg-transparent border"
            style={{ borderColor: "rgba(231,234,240,0.12)" }}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-xl p-3 bg-transparent border"
            style={{ borderColor: "rgba(231,234,240,0.12)" }}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={onSignup}
            className="w-full rounded-xl p-3 font-medium"
            style={{ background: "var(--cyan)", color: "#061018" }}
          >
            Create Account
          </button>

          {msg && (
            <div className="text-sm" style={{ color: "var(--muted)" }}>
              {msg}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
