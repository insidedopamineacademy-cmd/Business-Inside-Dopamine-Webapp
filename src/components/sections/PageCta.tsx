import Button from "../ui/Button";
import { Card } from "../ui/index";
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
        <div className="presentation-reveal-view">
          <Card variant="surface" size="large" className="border border-[var(--color-border)]">
            <h2 className="type-section max-w-[34rem] text-2xl text-[var(--color-text-primary)] md:text-4xl">
              {heading}
            </h2>
            <div className="mt-6">
              <Button as="link" href={href} variant="primary">
                {ctaLabel}
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
