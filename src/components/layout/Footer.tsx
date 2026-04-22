import Link from "next/link";
import Container from "../ui/Container";

const links = [
  { href: "/services", label: "Solutions" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-8 md:py-10">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-3" aria-label="Footer navigation">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="type-mono no-underline text-[var(--color-text-primary)] transition-opacity duration-200 hover:opacity-70 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="type-mono text-[var(--color-text-secondary)] md:text-right">
            © 2026 Inside Dopamine
          </p>
        </div>
      </Container>
    </footer>
  );
}
