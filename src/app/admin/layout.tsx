import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Inside Dopamine",
  description: "Internal lead dashboard for Inside Dopamine.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="border-b border-[var(--border-light)] bg-[var(--color-bg)]/95">
        <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between px-5 py-4 md:px-8">
          <div>
            <p className="type-mono text-[var(--color-muted)]">INSIDE DOPAMINE ADMIN</p>
            <h1 className="type-section mt-1 text-xl text-[var(--color-text)]">Leads Dashboard</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin/leads"
              className="type-mono text-[var(--color-text)] no-underline transition-opacity duration-200 hover:opacity-65"
            >
              Leads
            </Link>
            <Link
              href="/"
              className="type-mono text-[var(--color-text-secondary)] no-underline transition-opacity duration-200 hover:opacity-65"
            >
              Back to site
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1100px] px-5 py-8 md:px-8 md:py-10">{children}</main>
    </div>
  );
}
