"use client";

import { TopNav } from "@/components/TopNav";

const TierRows = [
  { range: "1 (Top slot)", price: "$100 / 360h", note: "Best visibility" },
  { range: "2–3", price: "$80 / 360h", note: "High visibility" },
  { range: "3–10", price: "$70 / 360h", note: "Strong rotation" },
  { range: "10–20", price: "$60 / 360h", note: "Steady exposure" },
  { range: "20–30", price: "$50 / 360h", note: "Budget exposure" },
  { range: "30–40", price: "$40 / 360h", note: "Low-cost exposure" },
];

export default function AdvertisePage() {
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

      {/* Background wash (matches your premium vibe) */}
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

      <div
        className="px-4 py-8"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Hero */}
          <div
            className="rounded-3xl p-6 md:p-8"
            style={{
              background: "rgba(22,29,51,0.66)",
              border: "1px solid rgba(231,234,240,0.06)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div
                  className="text-xs tracking-wide uppercase"
                  style={{ color: "var(--muted)" }}
                >
                  AOA Advertising
                </div>

                <h1 className="text-2xl md:text-3xl font-semibold mt-2">
                  Sponsor the Arena — without breaking the calm.
                </h1>

                <p className="text-sm md:text-base mt-3" style={{ color: "var(--muted)", maxWidth: 650 }}>
                  Ads are placed manually by AOA. No loud banners, no spam.
                  Clean slots that match the “calm under conflict” design.
                </p>

                <div className="mt-5 flex flex-wrap gap-10">
                  <div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>Placement</div>
                    <div className="text-sm font-semibold">Left / Right rails • Feed sponsor</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>Format</div>
                    <div className="text-sm font-semibold">Image • Video • File</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>Control</div>
                    <div className="text-sm font-semibold">Curated • Policy-based</div>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <div
                className="rounded-2xl p-5 w-full md:w-[360px]"
                style={{
                  background: "rgba(231,234,240,0.04)",
                  border: "1px solid rgba(231,234,240,0.06)",
                }}
              >
                <div className="text-sm font-semibold">Contact</div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Email will be added here.
                </div>

                <div
                  className="mt-4 rounded-xl p-3"
                  style={{
                    background: "rgba(7,11,22,0.55)",
                    border: "1px solid rgba(231,234,240,0.08)",
                  }}
                >
                  <div className="text-xs" style={{ color: "var(--muted)" }}>Email</div>
                  <div className="text-sm font-semibold">[placeholder]</div>
                </div>

                <a
                  href="/policies/advertising"
                  className="mt-4 block text-sm underline underline-offset-4"
                  style={{ color: "var(--muted)" }}
                >
                  Read Advertising Policy
                </a>

                <div className="mt-4">
                  <div
                    className="rounded-xl px-4 py-3 text-center font-semibold"
                    style={{
                      background: "var(--cyan)",
                      color: "#061018",
                    }}
                  >
                    Request a Slot
                  </div>
                  <div className="text-xs mt-2" style={{ color: "var(--muted)" }}>
                    (We’ll later connect this to a contact form.)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: 18 }} />

          {/* Pricing Grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Side Slots */}
            <div
              className="rounded-3xl p-6"
              style={{
                background: "rgba(22,29,51,0.60)",
                border: "1px solid rgba(231,234,240,0.06)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                    Side Slots
                  </div>
                  <div className="text-lg font-semibold mt-1">Left & Right Rails</div>
                </div>
                <div
                  className="text-xs rounded-full px-3 py-1"
                  style={{
                    background: "rgba(244,185,66,0.12)",
                    border: "1px solid rgba(244,185,66,0.18)",
                    color: "var(--amber)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Size = 3 post cards
                </div>
              </div>

              <div className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
                Base price: <span style={{ color: "var(--text)", fontWeight: 700 }}>$100</span> / 360 hours
                (per side). Tier pricing below.
              </div>

              <div
                className="mt-4 rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(231,234,240,0.06)" }}
              >
                <div
                  className="grid grid-cols-3 px-4 py-3 text-xs"
                  style={{
                    background: "rgba(231,234,240,0.04)",
                    color: "var(--muted)",
                  }}
                >
                  <div>Tier</div>
                  <div>Price</div>
                  <div>Notes</div>
                </div>

                {TierRows.map((r) => (
                  <div
                    key={r.range}
                    className="grid grid-cols-3 px-4 py-3 text-sm"
                    style={{
                      borderTop: "1px solid rgba(231,234,240,0.06)",
                      background: "rgba(7,11,22,0.22)",
                    }}
                  >
                    <div style={{ color: "rgba(231,234,240,0.92)" }}>{r.range}</div>
                    <div style={{ color: "rgba(231,234,240,0.92)", fontWeight: 700 }}>{r.price}</div>
                    <div style={{ color: "var(--muted)" }}>{r.note}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
                Placement is scheduled and rotated to keep the feed clean.
              </div>
            </div>

            {/* Sponsored Post */}
            <div
              className="rounded-3xl p-6"
              style={{
                background: "rgba(22,29,51,0.60)",
                border: "1px solid rgba(231,234,240,0.06)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                    Feed Sponsor
                  </div>
                  <div className="text-lg font-semibold mt-1">Sponsored Post</div>
                </div>

                <div
                  className="text-xs rounded-full px-3 py-1"
                  style={{
                    background: "rgba(46,196,241,0.10)",
                    border: "1px solid rgba(46,196,241,0.16)",
                    color: "var(--cyan)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Always after 3 organic posts
                </div>
              </div>

              <div
                className="mt-4 rounded-2xl p-4"
                style={{
                  background: "rgba(231,234,240,0.04)",
                  border: "1px solid rgba(231,234,240,0.06)",
                }}
              >
                <div className="text-sm font-semibold">Standard Sponsored</div>
                <div className="text-sm mt-2" style={{ color: "var(--muted)" }}>
                  <span style={{ color: "var(--text)", fontWeight: 800 }}>$100</span> / 60 hours
                </div>
                <div className="text-xs mt-2" style={{ color: "var(--muted)" }}>
                  Appears after the 3rd post. Never above the first three organic posts.
                </div>
              </div>

              <div
                className="mt-4 rounded-2xl p-4"
                style={{
                  background: "rgba(231,234,240,0.04)",
                  border: "1px solid rgba(231,234,240,0.06)",
                }}
              >
                <div className="text-sm font-semibold">First Sponsored (Premium)</div>
                <div className="text-sm mt-2" style={{ color: "var(--muted)" }}>
                  <span style={{ color: "var(--text)", fontWeight: 800 }}>$100</span> / 24 hours
                </div>
                <div className="text-xs mt-2" style={{ color: "var(--muted)" }}>
                  Still shown only after the 3rd post (AOA rule stays).
                </div>
              </div>

              <div className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
                Sponsored posts follow the same calm visual style as normal posts.
              </div>
            </div>
          </div>

          <div style={{ height: 18 }} />

          {/* Policy / Agreement preview card */}
          <div
            className="rounded-3xl p-6"
            style={{
              background: "rgba(22,29,51,0.55)",
              border: "1px solid rgba(231,234,240,0.06)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="text-lg font-semibold">Agreement Preview</div>
            <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              We’ll add your full advertising agreement + policy report here so advertisers can read before requesting a slot.
            </div>

            <div
              className="mt-4 rounded-2xl p-4"
              style={{
                background: "rgba(7,11,22,0.25)",
                border: "1px solid rgba(231,234,240,0.06)",
                color: "var(--muted)",
              }}
            >
              <div className="text-sm" style={{ color: "rgba(231,234,240,0.92)" }}>
                Coming next:
              </div>
              <ul className="text-sm mt-2 list-disc pl-5 space-y-1">
                <li>Advertising policy rules (allowed / not allowed)</li>
                <li>Placement and rotation rules</li>
                <li>Refund / cancellation / expiry</li>
                <li>AOA moderation rights for ads</li>
              </ul>
            </div>

            <div className="mt-4 flex flex-wrap gap-10 text-xs" style={{ color: "var(--muted)" }}>
              <div>
                <span style={{ color: "var(--text)", fontWeight: 700 }}>No self-serve</span> — AOA posts and places ads.
              </div>
              <div>
                <span style={{ color: "var(--text)", fontWeight: 700 }}>No chaos</span> — design stays calm and clean.
              </div>
              <div>
                <span style={{ color: "var(--text)", fontWeight: 700 }}>Policy-first</span> — ads must comply.
              </div>
            </div>
          </div>

          <div style={{ height: 30 }} />
        </div>
      </div>
    </main>
  );
}
