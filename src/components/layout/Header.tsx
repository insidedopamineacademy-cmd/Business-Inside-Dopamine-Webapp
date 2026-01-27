"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu when navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent background scroll when the mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            <span>Inside Dopamine</span>
          </span>
        </Link>

        <nav className="hidden gap-6 text-sm md:flex">
          <Link
            href="/"
            className="nav-link"
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            href="/services"
            className="nav-link"
            aria-current={pathname === "/services" ? "page" : undefined}
          >
            Services
          </Link>
          <Link
            href="/work"
            className="nav-link"
            aria-current={pathname === "/work" ? "page" : undefined}
          >
            Work
          </Link>
          <Link
            href="/about"
            className="nav-link"
            aria-current={pathname === "/about" ? "page" : undefined}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="nav-link"
            aria-current={pathname === "/contact" ? "page" : undefined}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card/60 p-2.5 text-fg shadow-sm md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? (
              // X icon
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4 7H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M4 12H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M4 17H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          {/* Desktop only CTA (IMPORTANT: do NOT use .btn-primary here, it can override Tailwind's `hidden`) */}
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center justify-center rounded-full bg-fg px-5 py-3 text-sm font-semibold text-on-fg shadow-sm transition hover:opacity-90"
          >
            Book a Call
          </Link>
        </div>
      </div>

      {/* Mobile dropdown (full-width) */}
      {open && (
        <div className="md:hidden border-t border-border bg-card/45 backdrop-blur-xl supports-[backdrop-filter]:bg-card/35 shadow-[0_18px_60px_-30px_rgba(0,0,0,0.55)]">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/services", label: "Services" },
              { href: "/work", label: "Work" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 transition hover:bg-muted/45 active:bg-muted/55"
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}