"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TopNav } from "@/components/TopNav";
import Link from "next/link";

function DocTile({
  title,
  subtitle,
  style,
}: {
  title: string;
  subtitle: string;
  style: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: 260,
        borderRadius: 18,
        padding: 16,
        background: "rgba(231,234,240,0.028)",
        border: "1px solid rgba(231,234,240,0.05)",
        backdropFilter: "blur(8px)",
        ...style,
      }}
    >
      <div style={{ fontSize: 12, color: "var(--muted)", opacity: 0.5 }}>
        Archive
      </div>
      <div style={{ marginTop: 6, fontSize: 14, color: "var(--text)", opacity: 0.55 }}>
        {title}
      </div>
      <div style={{ marginTop: 6, fontSize: 12, color: "var(--muted)", opacity: 0.45 }}>
        {subtitle}
      </div>
    </div>
  );
}

export default function HomeEntrancePage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setLoggedIn(!!data.session);
    })();
  }, []);

  return (
    <main
      className="min-h-screen"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <TopNav />

      {/* Background watermark art (tinted + “thick watermark”) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <img
          src="/arena-watermark.jpg"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.22,                 // thicker than docs
            filter: "grayscale(1) contrast(1.1) brightness(0.7)",
            mixBlendMode: "soft-light",
            transform: "scale(1.03)",
          }}
        />

        {/* AOA tint overlay to match your palette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 30%, rgba(46,196,241,0.10), transparent 55%), radial-gradient(circle at 30% 80%, rgba(244,185,66,0.06), transparent 60%), linear-gradient(180deg, rgba(11,16,32,0.65), rgba(11,16,32,0.85))",
          }}
        />
      </div>

      {/* Floating archival documents (lower opacity than art) */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.55 }}>
        <DocTile
          title="Anonymous Pamphlets & Civic Pressure"
          subtitle="When names disappeared, ideas traveled faster."
          style={{ left: 28, top: 140, transform: "rotate(-4deg)", opacity: 0.22 }}
        />
        <DocTile
          title="Victory Without Identity"
          subtitle="The message outlives the messenger."
          style={{ left: 40, bottom: 160, transform: "rotate(3deg)", opacity: 0.18 }}
        />
        <DocTile
          title="The Federalist Papers"
          subtitle="Arguments signed as ‘Publius’ — not a person, a position."
          style={{ right: 36, top: 180, transform: "rotate(4deg)", opacity: 0.22 }}
        />
        <DocTile
          title="Letters From the Masked"
          subtitle="History records the idea, not the face."
          style={{ right: 44, bottom: 130, transform: "rotate(-3deg)", opacity: 0.18 }}
        />
      </div>

      {/* Center authority content */}
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "92px 16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 60px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ width: "100%", textAlign: "center" }}>
          <div
            style={{
              fontSize: 56,
              lineHeight: 1.05,
              letterSpacing: -0.8,
              fontWeight: 650,
              textShadow: "0 10px 35px rgba(0,0,0,0.45)",
            }}
          >
            Explore the Arena of
            <br />
            Anonymous Truth
          </div>

          <div style={{ marginTop: 14, fontSize: 14, color: "var(--muted)" }}>
            Identity removed. Ideas remain.
          </div>

          {/* Explore button — pill / glass (AOA palette) */}
          <div style={{ marginTop: 26, display: "flex", justifyContent: "center" }}>
            <Link
              href="/arena"
              className="aoa-pill"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 34px",
                borderRadius: 999,
                fontWeight: 650,
                color: "var(--text)",
                border: "1px solid rgba(231,234,240,0.10)",
                background:
                  "radial-gradient(circle at 30% 30%, rgba(46,196,241,0.26), rgba(46,196,241,0.06) 55%, rgba(22,29,51,0.85) 100%)",
                boxShadow:
                  "0 14px 45px rgba(0,0,0,0.45), inset 0 1px 0 rgba(231,234,240,0.14)",
                backdropFilter: "blur(10px)",
              }}
            >
              Explore
            </Link>
          </div>

          {/* Optional: subtle hint only when logged out */}
          {loggedIn === false && (
            <div style={{ marginTop: 22, fontSize: 12, color: "var(--muted)" }}>
              Log in to create threads and vote.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
