"use client";

import { TopNav } from "@/components/TopNav";
import Link from "next/link";

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

export default function AdvertisingPolicyPage() {
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
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 22 }}>AOA Advertising Policy & Agreement</div>
              <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>
                This document defines what ads are allowed, how slots work, and what advertisers agree to by purchasing placement.
              </div>
            </div>
            <Link href="/advertise" style={{ color: "var(--cyan)", textDecoration: "none", fontWeight: 900 }}>
              Back ↗
            </Link>
          </div>

          <div style={{ height: 16 }} />

          <div style={{ display: "grid", gap: 14, fontSize: 13, lineHeight: 1.7, color: "rgba(231,234,240,0.92)" }}>
            <section>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>1) Definitions</div>
              <div style={{ color: "var(--muted)" }}>
                “AOA” refers to Anonymous Opinion Arena. “Advertiser” refers to the person/company purchasing ad placement. “Slot” refers
                to a reserved placement area in the Arena feed layout.
              </div>
            </section>

            <section>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>2) Slot Types & Rules</div>
              <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)" }}>
                <li>
                  <b>Side slots (Left/Right)</b>: Each slot is sized approximately equal to <b>three post cards</b>.
                </li>
                <li>
                  <b>Inline sponsored post</b>: Always appears <b>after the 3rd post</b>. It will never replace the first 3 posts.
                </li>
                <li>AOA reserves the right to adjust placement order to preserve UI quality and user experience.</li>
              </ul>
            </section>

            <section>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>3) Pricing</div>
              <div style={{ color: "var(--muted)" }}>
                Pricing follows the published rate card on the Advertise page. Left/right pricing is identical.
                Sponsored post pricing depends on duration and whether the advertiser requests premium priority (still after 3rd post).
              </div>
            </section>

            <section>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>4) Content Requirements</div>
              <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)" }}>
                <li>Ads must be clear, honest, and not misleading.</li>
                <li>No hate, harassment, threats, or targeted abuse.</li>
                <li>No illegal products/services. No prohibited content.</li>
                <li>Adult content is not allowed.</li>
                <li>AOA may reject or remove ads that harm user trust or violate policy.</li>
              </ul>
            </section>

            <section>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>5) Media & Links</div>
              <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)" }}>
                <li>Media can be image/video/file. Must not contain malware or harmful code.</li>
                <li>Target links must not redirect to harmful or deceptive destinations.</li>
                <li>AOA may require link updates or remove unsafe links.</li>
              </ul>
            </section>

            <section>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>6) Scheduling & Payment</div>
              <div style={{ color: "var(--muted)" }}>
                Slots are scheduled by start and end time. Once confirmed and scheduled, the slot is reserved for that window. Payment terms
                are agreed separately (offline) until AOA adds automated billing.
              </div>
            </section>

            <section>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>7) Owner Placement Control</div>
              <div style={{ color: "var(--muted)" }}>
                The advertiser does not post directly. <b>AOA owner is the only person who posts and places advertisements</b>. This keeps the arena clean
                and consistent.
              </div>
            </section>

            <section>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>8) Removal & Refunds</div>
              <div style={{ color: "var(--muted)" }}>
                If an ad violates policy, AOA may remove it immediately. Refund decisions are at AOA’s discretion depending on severity and remaining time.
              </div>
            </section>

            <section>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>9) Agreement</div>
              <div style={{ color: "var(--muted)" }}>
                By purchasing a slot, the advertiser confirms they have the rights to all submitted content and agree to comply with this policy.
              </div>
            </section>

            <div
              style={{
                marginTop: 10,
                borderRadius: 16,
                padding: 14,
                background: "rgba(244,185,66,0.08)",
                border: "1px solid rgba(244,185,66,0.16)",
                color: "var(--amber)",
                fontWeight: 800,
              }}
            >
              Contact email: (coming soon — owner will add)
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
