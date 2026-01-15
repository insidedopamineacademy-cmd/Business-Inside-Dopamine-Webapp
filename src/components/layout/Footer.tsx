import Link from "next/link";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="font-semibold tracking-tight">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                <span>Inside Dopamine</span>
              </span>
            </Link>

            <p className="mt-3 max-w-md text-sm text-muted">
              Power BI dashboards, AI copilots, and high-performance web platforms built for
              clarity, speed, and measurable outcomes.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Book a Call
              </Link>
              <Link href="/work" className="btn-secondary">
                View Work
              </Link>
            </div>

            <div className="mt-6 text-xs text-muted">
              Global delivery • Remote-first • Enterprise & startup friendly
            </div>
          </div>

          {/* Pages */}
          <div className="text-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">Pages</div>
            <div className="mt-4 grid gap-2">
              <Link href="/services" className="nav-link">
                Services
              </Link>
              <Link href="/work" className="nav-link">
                Work
              </Link>
              <Link href="/about" className="nav-link">
                About
              </Link>
              <Link href="/contact" className="nav-link">
                Contact
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="text-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">
              Services
            </div>
            <div className="mt-4 grid gap-2">
              <Link href="/services/data-analytics-power-bi" className="nav-link">
                Data Analytics & Power BI
              </Link>
              <Link href="/services/web-platforms" className="nav-link">
                Web Platforms
              </Link>
              <Link href="/services/ai-solutions" className="nav-link">
                AI Solutions
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-muted">© {year} Inside Dopamine. All rights reserved.</div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              <span>hello@insidedopamine.com</span>
            </span>
            <span className="hidden md:inline">•</span>
            <span>Barcelona • Global</span>
          </div>
        </div>
      </div>
    </footer>
  );
}