import { TopNav } from "@/components/TopNav";

export default function TermsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <TopNav />
      <div className="aoa-max px-4 py-6">
        <div className="rounded-3xl p-6" style={{ background: "rgba(22,29,51,0.66)", border: "1px solid rgba(231,234,240,0.06)" }}>
          <div className="text-xl font-semibold">Terms of Service</div>
          <div className="text-sm mt-2" style={{ color: "var(--muted)" }}>
            AOA is anonymous by design. Use it responsibly.
          </div>
          <div className="mt-6 space-y-4 text-sm" style={{ color: "rgba(231,234,240,0.92)" }}>
            <p><b>No harassment.</b> No threats, targeted abuse, or doxxing.</p>
            <p><b>No illegal content.</b> No instructions or promotion of illegal activity.</p>
            <p><b>No impersonation.</b> Numeric identity is system-assigned.</p>
            <p><b>Moderation.</b> AOA may remove content or restrict access to protect safety and platform integrity.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
