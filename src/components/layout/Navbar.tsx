"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { MotionDiv } from "@/lib/motion";
import Button from "../ui/Button";
import Container from "../ui/Container";

const links = [
  { href: "/services", label: "Solutions" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── Navbar bar ── */}
      <MotionDiv
        role="banner"
        className={`sticky top-0 z-50 transition-shadow duration-200 ${scrolled ? "shadow-sm" : ""}`}
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
        initial={reduceMotion ? false : { opacity: 0, y: -8 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }
        }
      >
        <Container>
          <div className="flex h-12 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="rounded text-[15px] font-medium leading-none text-[var(--color-text-primary)] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              inside dopamine<span className="text-[var(--color-accent)]">.</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="rounded text-[13px] font-normal text-[var(--color-text-secondary)] no-underline transition-colors duration-150 hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="rounded text-[13px] font-normal text-[var(--color-accent)] no-underline transition-colors duration-150 hover:text-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                Book a Call
              </Link>
            </nav>

            {/* Mobile hamburger — opens overlay */}
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] transition-colors duration-150 hover:border-[var(--color-text-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 md:hidden"
              aria-label="Open navigation menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsOpen(true)}
            >
              <span className="relative block h-5 w-5" aria-hidden="true">
                <span className="absolute left-1/2 top-1/2 h-[1.5px] w-4 -translate-x-1/2 -translate-y-[4px] bg-current" />
                <span className="absolute left-1/2 top-1/2 h-[1.5px] w-4 -translate-x-1/2 translate-y-[4px] bg-current" />
              </span>
            </button>
          </div>
        </Container>
      </MotionDiv>

      {/*
        ── Mobile menu overlay ──
        Rendered as a sibling OUTSIDE the navbar MotionDiv.
        Framer Motion transforms create a new stacking context, so fixed children
        inside an animated parent cannot escape it. Being a sibling fixes this.
      */}
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-white md:hidden"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: "100%" }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const }
            }
          >
            {/* Top row — logo + close button, matches navbar height */}
            <div className="flex h-12 shrink-0 items-center justify-between px-6" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="text-[15px] font-medium leading-none text-[var(--color-text-primary)] no-underline"
              >
                inside dopamine<span className="text-[var(--color-accent)]">.</span>
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-2 px-6 pt-12" aria-label="Mobile navigation">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="border-b border-[var(--color-border)] py-3 text-4xl font-semibold text-[var(--color-text-primary)] no-underline transition-opacity duration-150 hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA — pinned to bottom */}
            <div className="mt-auto flex flex-col gap-3 px-6 pb-12">
              <Button
                as="link"
                href="/contact"
                variant="primary"
                size="lg"
                className="w-full justify-center"
              >
                Book a Strategy Call →
              </Button>
              <p className="text-center text-sm text-[var(--color-text-secondary)]">
                We usually respond within 24 hours
              </p>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
}
