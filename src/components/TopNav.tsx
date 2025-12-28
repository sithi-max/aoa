"use client";

import Link from "next/link";

export function TopNav() {
  return (
    <div
      className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between"
      style={{
        background: "rgba(11,16,32,0.85)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Link
        href="/"
        className="text-sm font-medium"
        style={{ color: "var(--text)" }}
      >
        Home
      </Link>

      <Link
        href="/create"
        className="h-9 w-9 rounded-xl flex items-center justify-center font-semibold"
        style={{ background: "var(--surface)", color: "var(--cyan)" }}
        aria-label="Create"
      >
        +
      </Link>
    </div>
  );
}
