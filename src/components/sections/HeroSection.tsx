import Button from "@/components/ui/Button";

type Props = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

export default function HeroSection({ eyebrow, headline, subheadline, primaryCta, secondaryCta }: Props) {
  return (
    <div className="flex flex-col">
      <div
        className="presentation-reveal-load presentation-reveal-fade mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]"
      >
        {eyebrow}
      </div>

      <div className="presentation-reveal-load presentation-delay-1 mb-6">
        <h1 className="max-w-4xl text-[clamp(2.5rem,5vw,5rem)] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)]">
          {headline}
        </h1>
      </div>

      <div className="presentation-reveal-load presentation-delay-2 mb-8">
        <p className="max-w-2xl text-lg text-[var(--color-text-secondary)] md:text-xl">
          {subheadline}
        </p>
      </div>

      <div className="presentation-reveal-load presentation-delay-3 flex flex-wrap gap-3">
        <Button as="link" href={primaryCta.href} variant="primary" size="lg">
          {primaryCta.label}
        </Button>
        <Button as="link" href={secondaryCta.href} variant="ghost" size="lg">
          {secondaryCta.label}
        </Button>
      </div>
    </div>
  );
}
