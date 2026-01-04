"use client";

import Link from "next/link";

type TopNavProps = {
  /** If false: hides the right-side action buttons (Create + Advertise) */
  showActions?: boolean;
};

export function TopNav({ showActions = true }: TopNavProps) {
  return (
    <div
      className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between"
      style={{
        background: "rgba(11,16,32,0.85)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(231,234,240,0.06)",
      }}
    >
      <Link href="/" className="text-sm font-medium" style={{ color: "var(--text)" }}>
        Home
      </Link>

      {showActions ? (
        <div className="flex items-center gap-3">
          <Link
            href="/advertise"
            className="h-9 px-4 rounded-xl flex items-center justify-center text-sm font-semibold"
            style={{
              background: "rgba(22,29,51,0.70)",
              border: "1px solid rgba(231,234,240,0.08)",
              color: "rgba(231,234,240,0.92)",
              backdropFilter: "blur(10px)",
            }}
          >
            Advertise
          </Link>

          <Link
            href="/create"
            className="h-9 px-4 rounded-xl flex items-center justify-center text-sm font-semibold"
            style={{
              background: "rgba(46,196,241,0.14)",
              border: "1px solid rgba(46,196,241,0.22)",
              color: "rgba(231,234,240,0.95)",
              backdropFilter: "blur(10px)",
            }}
            aria-label="Create"
          >
            Create
          </Link>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}
