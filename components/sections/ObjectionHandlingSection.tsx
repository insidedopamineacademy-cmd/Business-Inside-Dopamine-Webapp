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
        <div className="max-w-[44rem]">
          <p className="type-mono text-[var(--color-muted)]">WHY INSIDE DOPAMINE</p>
        </div>

        <ul className="mt-8 border-y border-[var(--border-light)]">
          {points.map((point, index) => (
            <li
              key={point}
              className={[
                "type-section py-5 text-2xl text-[var(--color-text)] md:text-4xl",
                index !== points.length - 1 ? "border-b border-[var(--border-light)]" : "",
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
