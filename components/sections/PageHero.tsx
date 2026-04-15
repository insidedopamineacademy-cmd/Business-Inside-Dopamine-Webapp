import Container from "../ui/Container";

type PageHeroProps = {
  label: string;
  headline: string;
  intro: string;
};

export default function PageHero({ label, headline, intro }: PageHeroProps) {
  return (
    <section className="section-space" aria-label={`${label} hero`}>
      <Container>
        <div className="max-w-[44rem]">
          <p className="type-mono text-[var(--color-muted)]">{label}</p>
          <h1 className="type-section mt-4 text-3xl text-[var(--color-text)] md:text-5xl">{headline}</h1>
          <p className="type-body mt-4 max-w-[38rem]">{intro}</p>
        </div>
      </Container>
    </section>
  );
}
