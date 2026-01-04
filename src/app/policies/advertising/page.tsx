"use client";

import { useCallback } from "react";
import { TopNav } from "@/components/TopNav";

export default function AdvertisingPolicyPage() {
  const downloadPdf = useCallback(() => {
    // Browser print → user chooses “Save as PDF”
    window.print();
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
      {/* Print styles (PDF) */}
      <style>{`
        @media print {
          /* Remove backgrounds and make it clean */
          html, body {
            background: #ffffff !important;
            color: #0b1220 !important;
          }
          /* Hide nav + glow layers + sidebar */
          .aoa-no-print { display: none !important; }
          .aoa-print-wrap {
            max-width: 860px !important;
            margin: 0 auto !important;
            padding: 0 !important;
          }
          .aoa-print-card {
            background: #ffffff !important;
            border: 1px solid #e6e8ee !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
          }
          .aoa-print-muted { color: #556070 !important; }
          a { color: #0b1220 !important; text-decoration: underline !important; }
          h1, h2 { color: #0b1220 !important; }
          /* Avoid breaking cards awkwardly */
          section, .aoa-print-card { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      <div className="aoa-no-print">
        <TopNav />
      </div>

      {/* Premium background wash (no-print) */}
      <div
        aria-hidden
        className="aoa-no-print"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(900px 600px at 50% 20%, rgba(46,196,241,0.10), transparent 60%), radial-gradient(900px 700px at 20% 80%, rgba(47,191,155,0.08), transparent 55%), radial-gradient(900px 700px at 80% 85%, rgba(201,74,74,0.07), transparent 55%)",
          opacity: 0.95,
        }}
      />

      <div className="px-4 py-8" style={{ position: "relative", zIndex: 1 }}>
        <div className="aoa-print-wrap" style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Header Card */}
          <div
            className="rounded-3xl p-6 md:p-8 aoa-print-card"
            style={{
              background: "rgba(22,29,51,0.66)",
              border: "1px solid rgba(231,234,240,0.06)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
            }}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div
                  className="text-xs tracking-wide uppercase aoa-print-muted"
                  style={{ color: "var(--muted)" }}
                >
                  AOA Policies
                </div>

                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-semibold">
                    Advertising Agreement & Policy
                  </h1>

                  {/* ✅ Sponsored badge (style you can reuse on ad cards) */}
                  <SponsoredBadge />
                </div>

                <p
                  className="text-sm md:text-base mt-3 aoa-print-muted"
                  style={{ color: "var(--muted)", maxWidth: 820 }}
                >
                  This document defines how advertising works on AOA (Anonymous Opinion Arena), including slot pricing,
                  placement rules, acceptable content, and AOA’s rights to moderate or refuse ads. By purchasing an ad slot,
                  you agree to all terms below.
                </p>
              </div>

              {/* ✅ PDF Button */}
              <div className="aoa-no-print">
                <button
                  onClick={downloadPdf}
                  className="rounded-xl px-4 py-2 font-semibold"
                  style={{
                    background: "rgba(231,234,240,0.08)",
                    border: "1px solid rgba(231,234,240,0.12)",
                    color: "rgba(231,234,240,0.92)",
                    cursor: "pointer",
                  }}
                  title="Print / Save as PDF"
                >
                  Download PDF
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-10 text-sm">
              <div>
                <div className="text-xs aoa-print-muted" style={{ color: "var(--muted)" }}>
                  Applies to
                </div>
                <div className="font-semibold">All AOA advertisements</div>
              </div>
              <div>
                <div className="text-xs aoa-print-muted" style={{ color: "var(--muted)" }}>
                  Last updated
                </div>
                <div className="font-semibold">[set date later]</div>
              </div>
              <div>
                <div className="text-xs aoa-print-muted" style={{ color: "var(--muted)" }}>
                  Contact
                </div>
                <div className="font-semibold">[email placeholder]</div>
              </div>
            </div>

            {/* small note for PDF */}
            <div className="mt-4 text-xs aoa-no-print" style={{ color: "var(--muted)" }}>
              Tip: Click “Download PDF” → choose “Save as PDF”.
            </div>
          </div>

          <div style={{ height: 18 }} />

          {/* Layout */}
          <div className="grid lg:grid-cols-[1fr_360px] gap-5">
            {/* Main Content */}
            <div
              className="rounded-3xl p-6 md:p-7 aoa-print-card"
              style={{
                background: "rgba(22,29,51,0.60)",
                border: "1px solid rgba(231,234,240,0.06)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Section title="1) Definitions">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <b>AOA</b>: Anonymous Opinion Arena, including website and any official AOA channels.
                  </li>
                  <li>
                    <b>Advertiser</b>: Any person or organization requesting or purchasing an ad slot.
                  </li>
                  <li>
                    <b>Ad Slot</b>: A reserved placement area for an ad (left rail, right rail, or feed sponsor).
                  </li>
                  <li>
                    <b>Sponsored Post</b>: A paid advertisement shown inside the feed in AOA’s post-card style.
                  </li>
                  <li>
                    <b>Creative</b>: The final ad materials (title, copy, link, image/video/file).
                  </li>
                </ul>
              </Section>

              <Divider />

              <Section title="2) How AOA Advertising Works">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <b>No self-serve ads.</b> AOA is the only party that posts and places advertisements.
                  </li>
                  <li>
                    Ads are designed to <b>match the calm premium UI</b>. No flashing banners, no aggressive visuals.
                  </li>
                  <li>
                    Placement is scheduled and can rotate to maintain a clean feed experience.
                  </li>
                </ul>
              </Section>

              <Divider />

              <Section title="3) Ad Placements & Slot Sizes">
                <div className="space-y-3">
                  <CardNote>
                    <b>Side Slots:</b> Left and Right rails.
                    <br />
                    <span className="aoa-print-muted" style={{ color: "var(--muted)" }}>
                      Slot size is approximately equal to <b>three post cards</b>.
                    </span>
                  </CardNote>

                  <CardNote>
                    <b>Feed Sponsored Post:</b> A paid post inside the arena feed.
                    <br />
                    <span className="aoa-print-muted" style={{ color: "var(--muted)" }}>
                      Sponsored ads are always shown <b>after the first three organic posts</b> (AOA rule).
                    </span>
                  </CardNote>
                </div>
              </Section>

              <Divider />

              <Section title="4) Pricing & Scheduling">
                <div className="space-y-4">
                  <CardNote>
                    <div className="font-semibold">Side Slots (Left / Right)</div>
                    <div className="text-sm mt-2 aoa-print-muted" style={{ color: "var(--muted)" }}>
                      Pricing is tiered by slot order. The first slot on each side has the highest visibility.
                    </div>

                    <div
                      className="mt-4 rounded-2xl overflow-hidden"
                      style={{ border: "1px solid rgba(231,234,240,0.06)" }}
                    >
                      <div
                        className="grid grid-cols-3 px-4 py-3 text-xs aoa-print-muted"
                        style={{
                          background: "rgba(231,234,240,0.04)",
                          color: "var(--muted)",
                        }}
                      >
                        <div>Tier</div>
                        <div>Price (per side)</div>
                        <div>Duration</div>
                      </div>

                      <Row tier="1 (Top slot)" price="$100" duration="360 hours" />
                      <Row tier="2–3" price="$80" duration="360 hours" />
                      <Row tier="3–10" price="$70" duration="360 hours" />
                      <Row tier="10–20" price="$60" duration="360 hours" />
                      <Row tier="20–30" price="$50" duration="360 hours" />
                      <Row tier="30–40" price="$40" duration="360 hours" />
                    </div>
                  </CardNote>

                  <CardNote>
                    <div className="font-semibold">Sponsored Posts (Feed)</div>

                    <ul className="list-disc pl-5 mt-3 space-y-2">
                      <li>
                        <b>$100 / 60 hours</b> — Sponsored post shown after the 3rd organic post.
                      </li>
                      <li>
                        <b>$100 / 24 hours</b> — Premium sponsored placement (still shown only after the 3rd organic post).
                      </li>
                    </ul>

                    <div className="text-xs mt-3 aoa-print-muted" style={{ color: "var(--muted)" }}>
                      AOA will never place a sponsored ad above the first three organic posts.
                    </div>
                  </CardNote>
                </div>
              </Section>

              <Divider />

              <Section title="5) Content Rules (Allowed / Not Allowed)">
                <div className="grid md:grid-cols-2 gap-4">
                  <CardNote>
                    <div className="font-semibold" style={{ color: "var(--emerald)" }}>
                      Allowed
                    </div>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      <li>Legal businesses, products, or services.</li>
                      <li>Educational content, tools, communities, events.</li>
                      <li>Neutral job postings and hiring ads.</li>
                      <li>Software/app promotions, SaaS offers, newsletters.</li>
                      <li>Public-interest announcements.</li>
                    </ul>
                  </CardNote>

                  <CardNote>
                    <div className="font-semibold" style={{ color: "var(--crimson)" }}>
                      Not Allowed
                    </div>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      <li>Hate, harassment, or discriminatory content.</li>
                      <li>Adult sexual content or explicit imagery.</li>
                      <li>Illegal or regulated weapon sales.</li>
                      <li>Scams, misleading claims, fake giveaways, “get rich quick”.</li>
                      <li>Malware, spyware, or suspicious downloads.</li>
                      <li>Political manipulation or targeted misinformation.</li>
                      <li>Anything that violates laws or AOA community safety.</li>
                    </ul>
                  </CardNote>
                </div>

                <div className="mt-4 text-sm aoa-print-muted" style={{ color: "var(--muted)" }}>
                  AOA may request edits to any creative to match the platform’s calm design and safety rules.
                </div>
              </Section>

              <Divider />

              <Section title="6) Creative Requirements">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Provide: <b>title</b>, <b>short description</b>, <b>link URL</b>, and optional <b>media</b>.
                  </li>
                  <li>Media formats: image/video/file (reasonable size for performance).</li>
                  <li>No flashing visuals, no aggressive CTA spam, no loud “banner” style.</li>
                  <li>AOA reserves the right to add a small label such as <b>Sponsored</b>.</li>
                </ul>
              </Section>

              <Divider />

              <Section title="7) Placement Rules">
                <ul className="list-disc pl-5 space-y-2">
                  <li>AOA controls placement to protect user experience and avoid ad overload.</li>
                  <li>Sponsored posts appear only after the first three organic posts.</li>
                  <li>Side rail slots are limited and may rotate depending on demand.</li>
                </ul>
              </Section>

              <Divider />

              <Section title="8) Payment, Start/End Times, and Expiry">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Ad time starts at the scheduled <b>starts_at</b> time and ends at <b>ends_at</b>.</li>
                  <li>If an advertiser fails to deliver approved creative by the deadline, AOA may reschedule or cancel.</li>
                  <li>Expired ads are removed automatically after the end time.</li>
                </ul>
              </Section>

              <Divider />

              <Section title="9) Moderation & Removal Rights">
                <ul className="list-disc pl-5 space-y-2">
                  <li>AOA may refuse, pause, or remove any ad at any time if it violates policy or harms trust.</li>
                  <li>AOA may remove ads that trigger abuse reports, legal risks, or platform safety concerns.</li>
                  <li>AOA may request changes to creative (copy, image, link) to comply with policy or design standards.</li>
                </ul>

                <div className="mt-3 text-sm aoa-print-muted" style={{ color: "var(--muted)" }}>
                  Removal for policy violations may not be eligible for refunds.
                </div>
              </Section>

              <Divider />

              <Section title="10) Refunds & Cancellations">
                <ul className="list-disc pl-5 space-y-2">
                  <li>If AOA cancels an ad before it starts (non-policy reasons), a full refund or reschedule is offered.</li>
                  <li>If an ad is removed due to policy violations or misleading content, refunds are not guaranteed.</li>
                  <li>Partial refunds may be considered for major technical failures preventing delivery.</li>
                </ul>
              </Section>

              <Divider />

              <Section title="11) Legal & Liability">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Advertisers are responsible for claims made in their creatives and for compliance with laws.</li>
                  <li>AOA is not responsible for third-party website content linked from ads.</li>
                  <li>AOA may cooperate with lawful requests if required by law.</li>
                </ul>
              </Section>

              <Divider />

              <Section title="12) Agreement Acceptance">
                <div className="text-sm aoa-print-muted" style={{ color: "var(--muted)" }}>
                  By purchasing an ad slot and providing creative, the advertiser confirms they have read,
                  understood, and agreed to this policy and AOA’s placement/moderation rules.
                </div>
              </Section>
            </div>

            {/* Sidebar quick summary (hidden on print) */}
            <aside className="space-y-5 aoa-no-print">
              <SideCard title="Quick Rules">
                <ul className="text-sm list-disc pl-5 space-y-2" style={{ color: "var(--muted)" }}>
                  <li>AOA places all ads manually.</li>
                  <li>No loud banners or spam.</li>
                  <li>Sponsored posts always after 3 organic posts.</li>
                  <li>AOA can refuse/remove ads for safety or trust.</li>
                </ul>
              </SideCard>

              <SideCard title="Sponsored Label Preview">
                <div className="text-sm" style={{ color: "var(--muted)" }}>
                  This is the exact badge style that will appear on sponsored cards:
                </div>
                <div className="mt-3">
                  <SponsoredBadge />
                </div>
              </SideCard>

              <SideCard title="Contact">
                <div className="text-sm" style={{ color: "var(--muted)" }}>
                  Email:
                  <div className="font-semibold mt-1" style={{ color: "rgba(231,234,240,0.92)" }}>
                    [placeholder]
                  </div>
                </div>
              </SideCard>
            </aside>
          </div>

          <div style={{ height: 26 }} />
        </div>
      </div>
    </main>
  );
}

/* ---------- components ---------- */

function SponsoredBadge() {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
      style={{
        background: "rgba(46,196,241,0.10)",
        border: "1px solid rgba(46,196,241,0.20)",
        color: "rgba(231,234,240,0.92)",
        letterSpacing: 0.3,
      }}
      title="Sponsored"
    >
      <span
        aria-hidden
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: "var(--cyan)",
          boxShadow: "0 0 18px rgba(46,196,241,0.55)",
        }}
      />
      Sponsored
    </span>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: 1,
        margin: "22px 0",
        background: "rgba(231,234,240,0.07)",
      }}
    />
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(231,234,240,0.92)" }}>
        {children}
      </div>
    </section>
  );
}

function CardNote({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(7,11,22,0.25)",
        border: "1px solid rgba(231,234,240,0.06)",
      }}
    >
      <div className="text-sm" style={{ color: "rgba(231,234,240,0.92)" }}>
        {children}
      </div>
    </div>
  );
}

function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-3xl p-5"
      style={{
        background: "rgba(22,29,51,0.55)",
        border: "1px solid rgba(231,234,240,0.06)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Row({ tier, price, duration }: { tier: string; price: string; duration: string }) {
  return (
    <div
      className="grid grid-cols-3 px-4 py-3 text-sm"
      style={{
        borderTop: "1px solid rgba(231,234,240,0.06)",
        background: "rgba(7,11,22,0.22)",
      }}
    >
      <div style={{ color: "rgba(231,234,240,0.92)" }}>{tier}</div>
      <div style={{ color: "rgba(231,234,240,0.92)", fontWeight: 800 }}>{price}</div>
      <div style={{ color: "var(--muted)" }}>{duration}</div>
    </div>
  );
}
