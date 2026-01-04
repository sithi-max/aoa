import { TopNav } from "@/components/TopNav";

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <TopNav />
      <div className="aoa-max px-4 py-6">
        <div className="rounded-3xl p-6" style={{ background: "rgba(22,29,51,0.66)", border: "1px solid rgba(231,234,240,0.06)" }}>
          <div className="text-xl font-semibold">Privacy Policy</div>
          <div className="text-sm mt-2" style={{ color: "var(--muted)" }}>
            Email is used only for authentication. It is never shown publicly.
          </div>
          <div className="mt-6 space-y-4 text-sm" style={{ color: "rgba(231,234,240,0.92)" }}>
            <p><b>Public identity:</b> only a numeric ID (User #NN).</p>
            <p><b>Data stored:</b> posts, votes, comments, reports, and uploaded media tied to your auth ID.</p>
            <p><b>Security:</b> row-level security (RLS) limits access and actions.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
