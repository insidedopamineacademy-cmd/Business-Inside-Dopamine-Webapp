import Link from "next/link";
import Container from "../ui/Container";
import Badge from "../ui/Badge";
import { homepageWorkCards } from "@/data/portfolio";

export default function WorkSection() {
  return (
    <section className="section-space" aria-label="Selected work">
      <Container>
        <div className="presentation-reveal-view max-w-[44rem]">
          <p className="type-mono text-[var(--color-text-tertiary)]">SELECTED WORK</p>
          <h2 className="type-section mt-4 text-3xl text-[var(--color-text-primary)] md:text-5xl">
            Proof, not promises.
          </h2>
          <p className="type-body mt-4 max-w-[38rem]">
            A few examples of systems built to reduce manual work and improve execution.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {homepageWorkCards.map((card) => (
            <div
              key={card.headline}
              className="presentation-reveal-view presentation-reveal-scale"
            >
              <Link
                href={card.href}
                className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-white p-6 no-underline transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-2xl font-bold leading-snug text-[var(--color-text-primary)]">
                  {card.headline}
                </p>
                <p className="mt-2 text-base font-semibold text-[var(--color-text-primary)]">
                  {card.subheadline}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  {card.clientType}
                </p>
                <div className="mt-4">
                  <Badge variant="default">{card.label}</Badge>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
