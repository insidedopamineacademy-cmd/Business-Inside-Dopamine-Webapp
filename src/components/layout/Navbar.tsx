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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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

          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] transition-colors duration-150 hover:border-[var(--color-text-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 md:hidden"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen((c) => !c)}
          >
            <span className="relative block h-5 w-5" aria-hidden="true">
              <span
                className={`absolute left-1/2 top-1/2 h-[1.5px] w-4 -translate-x-1/2 bg-current transition-transform duration-200 ${
                  isOpen ? "translate-y-0 rotate-45" : "-translate-y-[4px]"
                }`}
              />
              <span
                className={`absolute left-1/2 top-1/2 h-[1.5px] w-4 -translate-x-1/2 bg-current transition-transform duration-200 ${
                  isOpen ? "translate-y-0 -rotate-45" : "translate-y-[4px]"
                }`}
              />
            </span>
          </button>
        </div>
      </Container>

      {/* Mobile menu — full-screen overlay, slides in from right */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <MotionDiv
            id="mobile-menu"
            className="fixed inset-0 z-50 flex flex-col bg-white md:hidden"
            initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const }
            }
          >
            {/* Close button — top-right */}
            <div className="flex h-12 shrink-0 items-center justify-end px-5">
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
            <nav
              className="flex flex-1 flex-col justify-center gap-8 px-8"
              aria-label="Mobile navigation"
            >
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="text-3xl font-semibold text-[var(--color-text-primary)] no-underline transition-opacity duration-150 hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA at bottom */}
            <div className="flex shrink-0 flex-col items-center gap-3 px-8 pb-12">
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
    </MotionDiv>
  );
}
