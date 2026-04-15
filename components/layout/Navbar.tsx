"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Button from "../ui/Button";
import Container from "../ui/Container";

const links = [
  { href: "/services", label: "Solutions" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompressed, setIsCompressed] = useState(false);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const onScroll = () => {
      setIsCompressed(window.scrollY > 60);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const navTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.header
      className="relative sticky top-0 z-50 border-b border-[var(--border-light)] bg-[var(--color-bg)]/92 backdrop-blur"
      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={navTransition}
    >
      <Container>
        <div
          className={`flex items-center justify-between transition-[padding] duration-200 ${
            isCompressed ? "py-3 md:py-4" : "py-4 md:py-5"
          }`}
        >
          <Link href="/" className="type-section text-lg leading-none no-underline">
            inside<span className="text-[var(--color-accent)]">.</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <nav className="flex items-center gap-6" aria-label="Primary navigation">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="type-mono no-underline text-[var(--color-text)] transition-opacity duration-200 hover:opacity-70"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Button as="link" href="/contact" variant="primary">
              Book a Strategy Call →
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-medium)] text-[var(--color-text)] leading-none transition-colors duration-200 hover:border-[var(--border-medium)] md:hidden"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen((current) => !current)}
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

        <AnimatePresence initial={false}>
          {isOpen ? (
            <motion.div
              id="mobile-menu"
              className="absolute inset-x-0 top-full max-h-[calc(100svh-78px)] overflow-y-auto border-y border-[var(--border-light)] bg-[var(--color-surface-soft)] md:hidden"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const }
              }
            >
              <Container>
                <div className="flex min-h-[calc(100svh-78px)] flex-col justify-between py-3">
                  <nav className="border-b border-[var(--border-light)]" aria-label="Mobile navigation">
                    {links.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group flex items-center justify-between border-t border-[var(--border-light)] px-1 py-4 no-underline transition-opacity duration-200 hover:opacity-70"
                      >
                        <span className="type-mono text-[var(--color-text)]">{item.label}</span>
                        <span className="type-mono text-[var(--color-muted)] transition-colors duration-200 group-hover:text-[var(--color-text)]">
                          →
                        </span>
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-6 border-t border-[var(--border-light)] pt-5">
                    <p className="type-mono text-[var(--color-muted)]">Start with a focused call</p>
                    <Button as="link" href="/contact" variant="secondary" className="mt-4 w-full justify-center">
                      Book a Strategy Call →
                    </Button>
                  </div>
                </div>
              </Container>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Container>
    </motion.header>
  );
}
