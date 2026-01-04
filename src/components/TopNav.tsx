"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  const showActions =
    pathname?.startsWith("/arena") ||
    pathname?.startsWith("/post") ||
    pathname?.startsWith("/create") ||
    pathname?.startsWith("/advertise");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setAuthed(!!data.session);
    })();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div
      className="sticky top-0 z-20"
      style={{
        background: "rgba(11,16,32,0.82)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(231,234,240,0.06)",
      }}
    >
      <div className="aoa-max px-4 py-3 flex items-center justify-between">
        <Link href={authed ? "/arena" : "/"} className="flex items-baseline gap-2">
          <div className="font-semibold tracking-wide" style={{ color: "var(--text)" }}>
            AOA
          </div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            Anonymous Opinion Arena
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {authed && showActions && (
            <>
              <Link
                href="/advertise"
                className="px-3 py-2 rounded-xl text-sm font-medium"
                style={{
                  background: "rgba(244,185,66,0.10)",
                  border: "1px solid rgba(244,185,66,0.18)",
                  color: "var(--amber)",
                }}
              >
                Advertise
              </Link>

              <Link
                href="/create"
                className="px-3 py-2 rounded-xl text-sm font-medium"
                style={{
                  background: "rgba(46,196,241,0.10)",
                  border: "1px solid rgba(46,196,241,0.18)",
                  color: "var(--cyan)",
                }}
              >
                Create
              </Link>
            </>
          )}

          {authed && (
            <button
              onClick={logout}
              className="px-3 py-2 rounded-xl text-sm"
              style={{
                background: "rgba(231,234,240,0.06)",
                border: "1px solid rgba(231,234,240,0.10)",
                color: "var(--muted)",
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
