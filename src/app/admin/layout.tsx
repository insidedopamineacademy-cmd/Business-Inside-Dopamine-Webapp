import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Inside Dopamine",
  description: "Internal lead dashboard for Inside Dopamine.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-background)]/95">
        <Container
          variant="admin"
          className="flex flex-col items-start gap-4 py-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="type-mono text-[var(--color-text-tertiary)]">INSIDE DOPAMINE ADMIN</p>
            <h1 className="type-section mt-1 text-xl text-[var(--color-text-primary)]">Leads Dashboard</h1>
          </div>
          <nav className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 md:w-auto md:flex-nowrap">
            <Link
              href="/admin/leads"
              className="type-mono text-[var(--color-text-primary)] no-underline transition-opacity duration-[var(--transition-duration-fast)] hover:opacity-65"
            >
              Leads
            </Link>
            <Link
              href="/admin/faqs"
              className="type-mono text-[var(--color-text-primary)] no-underline transition-opacity duration-[var(--transition-duration-fast)] hover:opacity-65"
            >
              FAQ Manager
            </Link>
            <Link
              href="/admin/conversations"
              className="type-mono text-[var(--color-text-primary)] no-underline transition-opacity duration-[var(--transition-duration-fast)] hover:opacity-65"
            >
              Conversations
            </Link>
            <Link
              href="/"
              className="type-mono text-[var(--color-text-secondary)] no-underline transition-opacity duration-200 hover:opacity-65"
            >
              Back to site
            </Link>
          </nav>
        </Container>
      </header>
      <main>
        <Container variant="admin" className="py-8 md:py-10">
          {children}
        </Container>
      </main>
    </div>
  );
}
