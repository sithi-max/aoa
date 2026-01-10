"use client";

import Link from "next/link";
import { TopNav } from "@/components/TopNav";

const AD_EMAIL = "aoaaskhelp@gmail.com";

function mailtoHref() {
  const subject = encodeURIComponent("AOA Advertising Request");
  const body = encodeURIComponent(
    `Hi AOA,\n\nI want to request an advertising slot.\n\nPlacement (left/right/feed): \nTier (1-40): \nStart date/time: \nDuration (hours): \nTitle: \nLink (optional): \nMedia (optional): \n\nThanks!\n`
  );
  return `mailto:${AD_EMAIL}?subject=${subject}&body=${body}`;
}

export default function AdvertisePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <TopNav />

      {/* Premium background wash */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(900px 600px at 50% 20%, rgba(46,196,241,0.10), transparent 60%), radial-gradient(900px 700px at 20% 80%, rgba(47,191,155,0.08), transparent 55%), radial-gradient(900px 700px at 80% 85%, rgba(201,74,74,0.07), transparent 55%)",
          opacity: 0.95,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, padding: "22px 16px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* HERO */}
          <div
            style={{
              borderRadius: 22,
              padding: 22,
              background: "rgba(22,29,51,0.66)",
              border: "1px solid rgba(231,234,240,0.06)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ fontSize: 12, letterSpacing: 1, color: "var(--muted)", textTransform: "uppercase" }}>
              AOA Advertising
            </div>

            <div style={{ marginTop: 10, fontSize: 40, fontWeight: 800, lineHeight: 1.1 }}>
              Sponsor the Arena — without breaking the calm.
            </div>

            <div style={{ marginTop: 12, color: "var(--muted)", maxWidth: 820, fontSize: 15, lineHeight: 1.7 }}>
              Ads are placed manually by AOA. No loud banners, no spam. Clean slots that match the “calm under conflict”
              design.
            </div>

            <div style={{ height: 14 }} />

            {/* Meta row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 14,
              }}
            >
              <MetaBox
                title="Placement"
                value="Left / Right rails • Feed sponsor"
              />
              <MetaBox
                title="Format"
                value="Image • Video • File"
              />
              <MetaBox
                title="Control"
                value="Curated • Policy-based"
              />
            </div>

            <div style={{ height: 16 }} />

            {/* Contact strip */}
            <div
              style={{
                borderRadius: 16,
                padding: 14,
                background: "rgba(7,11,22,0.25)",
                border: "1px solid rgba(231,234,240,0.06)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Contact</div>
                <div style={{ fontWeight: 800, marginTop: 4 }}>
                  Email:{" "}
                  <a
                    href={`mailto:${AD_EMAIL}`}
                    style={{ color: "rgba(231,234,240,0.92)", textDecoration: "underline" }}
                  >
                    {AD_EMAIL}
                  </a>
                </div>
                <div style={{ marginTop: 6 }}>
                  <Link
                    href="/policies/advertising"
                    style={{ color: "rgba(46,196,241,0.95)", textDecoration: "none", fontWeight: 700 }}
                  >
                    Read Advertising Policy →
                  </Link>
                </div>
              </div>

              <a
                href={mailtoHref()}
                style={{
                  borderRadius: 14,
                  padding: "10px 14px",
                  fontWeight: 800,
                  background: "rgba(46,196,241,0.14)",
                  border: "1px solid rgba(46,196,241,0.25)",
                  color: "rgba(231,234,240,0.95)",
                  textDecoration: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                title="Send an email request"
              >
                Request a Slot
              </a>
            </div>
          </div>

          <div style={{ height: 18 }} />

          {/* SIDE SLOTS */}
          <SectionCard
            title="Side Slots"
            rightBadge={
              <Badge text="Size = 3 post cards" tone="amber" />
            }
            subtitle="Left & Right Rails"
            note="Base price: $100 / 360 hours (per side). Tier pricing below."
          >
            <Table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Tier</th>
                  <th style={{ textAlign: "left" }}>Price</th>
                  <th style={{ textAlign: "left" }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1 (Top slot)</td><td><b>$100 / 360h</b></td><td>Best visibility</td></tr>
                <tr><td>2–3</td><td><b>$80 / 360h</b></td><td>High visibility</td></tr>
                <tr><td>3–10</td><td><b>$70 / 360h</b></td><td>Strong rotation</td></tr>
                <tr><td>10–20</td><td><b>$60 / 360h</b></td><td>Steady exposure</td></tr>
                <tr><td>20–30</td><td><b>$50 / 360h</b></td><td>Budget exposure</td></tr>
                <tr><td>30–40</td><td><b>$40 / 360h</b></td><td>Low-cost exposure</td></tr>
              </tbody>
            </Table>

            <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)" }}>
              Placement is scheduled and rotated to keep the feed clean.
            </div>
          </SectionCard>

          <div style={{ height: 14 }} />

          {/* FEED SPONSOR */}
          <SectionCard
            title="Feed Sponsor"
            rightBadge={<Badge text="Always after 3 organic posts" tone="cyan" />}
            subtitle="Sponsored Post"
            note="Sponsored ads are placed by AOA only — never above the first 3 organic posts."
          >
            <div style={{ display: "grid", gap: 10 }}>
              <PriceLine title="Standard Sponsored" price="$100" duration="60 hours" />
              <PriceLine title="First Sponsored (Premium)" price="$100" duration="24 hours" />
            </div>
          </SectionCard>

          <div style={{ height: 20 }} />
        </div>
      </div>
    </main>
  );
}

/* ---------- UI helpers ---------- */

function MetaBox({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: 14,
        background: "rgba(7,11,22,0.22)",
        border: "1px solid rgba(231,234,240,0.06)",
      }}
    >
      <div style={{ fontSize: 12, color: "var(--muted)" }}>{title}</div>
      <div style={{ marginTop: 6, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  note,
  rightBadge,
  children,
}: {
  title: string;
  subtitle: string;
  note?: string;
  rightBadge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderRadius: 22,
        padding: 18,
        background: "rgba(22,29,51,0.60)",
        border: "1px solid rgba(231,234,240,0.06)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ fontSize: 13, letterSpacing: 0.6, color: "var(--muted)", textTransform: "uppercase" }}>
          {title}
        </div>
        {rightBadge}
      </div>

      <div style={{ marginTop: 4, fontSize: 18, fontWeight: 900 }}>{subtitle}</div>
      {note ? <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 13 }}>{note}</div> : null}

      <div style={{ height: 12 }} />
      {children}
    </div>
  );
}

function Table({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(231,234,240,0.06)",
        background: "rgba(7,11,22,0.18)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <style>{`
          th, td { padding: 10px 12px; border-top: 1px solid rgba(231,234,240,0.06); }
          thead th { border-top: none; font-size: 12px; color: var(--muted); background: rgba(231,234,240,0.04); }
          tbody td { font-size: 14px; color: rgba(231,234,240,0.92); }
        `}</style>
        {children}
      </table>
    </div>
  );
}

function PriceLine({ title, price, duration }: { title: string; price: string; duration: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: 14,
        background: "rgba(7,11,22,0.22)",
        border: "1px solid rgba(231,234,240,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        flexWrap: "wrap",
      }}
    >
      <div style={{ fontWeight: 900 }}>{title}</div>
      <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
        <div style={{ fontWeight: 900 }}>{price}</div>
        <div style={{ color: "var(--muted)", fontSize: 13 }}>/ {duration}</div>
      </div>
    </div>
  );
}

function Badge({ text, tone }: { text: string; tone: "amber" | "cyan" }) {
  const styles =
    tone === "amber"
      ? {
          background: "rgba(244,185,66,0.12)",
          border: "1px solid rgba(244,185,66,0.22)",
          color: "rgba(244,185,66,0.95)",
        }
      : {
          background: "rgba(46,196,241,0.10)",
          border: "1px solid rgba(46,196,241,0.20)",
          color: "rgba(46,196,241,0.95)",
        };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "6px 10px",
        fontSize: 12,
        fontWeight: 900,
        ...styles,
      }}
    >
      {text}
    </span>
  );
}
