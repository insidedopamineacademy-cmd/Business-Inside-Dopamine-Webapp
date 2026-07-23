import Container from "../ui/Container";

const points = [
  "No long-term contracts.",
  "No generic templates.",
  "No unnecessary complexity.",
  "Built specifically for your business.",
];

export default function ObjectionHandlingSection() {
  return (
    <section className="section-space" aria-label="Why Inside Dopamine">
      <Container>
        <div className="presentation-reveal-view max-w-[44rem]">
          <p className="type-mono text-[var(--color-text-tertiary)]">WHY INSIDE DOPAMINE</p>
        </div>

        <ul
          className="mt-8 border-y border-[var(--color-border)]"
        >
          {points.map((point, index) => (
            <li
              key={point}
              className={[
                "presentation-reveal-view type-section py-5 text-2xl text-[var(--color-text-primary)] md:text-4xl",
                index !== points.length - 1 ? "border-b border-[var(--color-border)]" : "",
              ].join(" ")}
            >
              {point}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
