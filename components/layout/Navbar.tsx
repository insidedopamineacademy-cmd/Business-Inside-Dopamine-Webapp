"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
      className="sticky top-0 z-50 border-b border-[var(--border-light)] bg-[var(--color-bg)]/92 backdrop-blur"
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
            className="type-mono inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-medium)] md:hidden"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {isOpen && (
          <div id="mobile-menu" className="border-t border-[var(--border-light)] py-4 md:hidden">
            <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="type-mono no-underline text-[var(--color-text)] transition-opacity duration-200 hover:opacity-70"
                >
                  {item.label}
                </Link>
              ))}
              <Button as="link" href="/contact" className="mt-2 w-fit">
                Book a Strategy Call →
              </Button>
            </nav>
          </div>
        )}
      </Container>
    </motion.header>
  );
}
