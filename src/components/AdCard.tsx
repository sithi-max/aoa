"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export type AdRow = {
  id: string;
  placement: "rail" | "feed";
  side: "left" | "right" | null;
  size_label: string;
  starts_at: string;
  ends_at: string;
  headline: string;
  body: string | null;
  cta_label: string | null;
  target_url: string | null;
  media_path: string | null;
  media_mime: string | null;
};

function mediaUrl(path: string) {
  return supabase.storage.from("aoa-media").getPublicUrl(path).data.publicUrl;
}

export function AdCard({
  ad,
  height = 520, // roughly "three post cards"
}: {
  ad: AdRow;
  height?: number;
}) {
  const url = ad.target_url ?? "/advertise";

  return (
    <div
      style={{
        borderRadius: 18,
        overflow: "hidden",
        background: "rgba(22,29,51,0.66)",
        border: "1px solid rgba(231,234,240,0.07)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
        minHeight: height,
        position: "relative",
      }}
    >
      {/* subtle "Sponsored" bar */}
      <div
        style={{
          height: 10,
          background: "linear-gradient(90deg, rgba(244,185,66,0.85), rgba(46,196,241,0.65))",
          opacity: 0.65,
        }}
      />

      <div style={{ padding: 18 }}>
        <div style={{ fontSize: 11, color: "var(--muted)" }}>Sponsored</div>

        <div style={{ marginTop: 8, fontSize: 16, fontWeight: 700, color: "rgba(231,234,240,0.95)" }}>
          {ad.headline}
        </div>

        {ad.body && (
          <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.5, color: "rgba(154,163,178,0.95)" }}>
            {ad.body}
          </div>
        )}

        {/* Media */}
        {ad.media_path && ad.media_mime && (
          <div style={{ marginTop: 14 }}>
            {ad.media_mime.startsWith("image") && (
              <img
                src={mediaUrl(ad.media_path)}
                alt=""
                style={{
                  width: "100%",
                  borderRadius: 14,
                  border: "1px solid rgba(231,234,240,0.06)",
                }}
              />
            )}

            {ad.media_mime.startsWith("video") && (
              <video
                src={mediaUrl(ad.media_path)}
                controls
                style={{
                  width: "100%",
                  borderRadius: 14,
                  border: "1px solid rgba(231,234,240,0.06)",
                }}
              />
            )}

            {!ad.media_mime.startsWith("image") && !ad.media_mime.startsWith("video") && (
              <a
                href={mediaUrl(ad.media_path)}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--cyan)", textDecoration: "none", fontSize: 13 }}
              >
                View attached file
              </a>
            )}
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: 16 }}>
          <Link
            href={url}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 40,
              padding: "0 14px",
              borderRadius: 12,
              background: "rgba(46,196,241,0.12)",
              border: "1px solid rgba(46,196,241,0.20)",
              color: "var(--cyan)",
              fontWeight: 700,
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            {ad.cta_label ?? "Learn more"}
          </Link>
        </div>

        <div style={{ marginTop: 14, fontSize: 11, color: "rgba(154,163,178,0.70)" }}>
          AOA ads are calm, approved, and non-tracking.
        </div>
      </div>
    </div>
  );
}
