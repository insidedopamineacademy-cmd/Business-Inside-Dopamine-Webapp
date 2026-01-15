"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            <span>Inside Dopamine</span>
          </span>
        </Link>

        <nav className="hidden gap-6 text-sm md:flex">
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

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/contact" className="hidden md:inline-flex btn-primary">
            Book a Call
          </Link>
        </div>
      </div>
    </header>
  );
}