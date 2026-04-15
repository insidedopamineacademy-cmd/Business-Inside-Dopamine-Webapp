import Button from "../ui/Button";
import Container from "../ui/Container";

type PageCtaProps = {
  heading: string;
  ctaLabel: string;
  href: string;
};

export default function PageCta({ heading, ctaLabel, href }: PageCtaProps) {
  return (
    <section className="section-space" aria-label="Page call to action">
      <Container>
        <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--color-surface-light)] p-7 md:p-10">
          <h2 className="type-section max-w-[34rem] text-2xl text-[var(--color-text)] md:text-4xl">
            {heading}
          </h2>
          <div className="mt-6">
            <Button as="link" href={href} variant="primary">
              {ctaLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
