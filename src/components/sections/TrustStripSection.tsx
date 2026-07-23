import Container from "../ui/Container";

const trustItems = [
  "40+ Systems Built",
  "12x Operations Speed",
  "3 Week Delivery",
  "0 Template Thinking",
];

export default function TrustStripSection() {
  return (
    <section
      className="presentation-reveal-view presentation-reveal-fade trust-strip bg-white"
      aria-label="Trust metrics"
    >
      <Container>
        <ul className="grid grid-cols-1 gap-0 py-3 sm:grid-cols-2 md:grid-cols-4 md:py-0">
          {trustItems.map((item, index) => (
            <li
              key={item}
              className={[
                "type-mono flex min-h-[64px] items-center justify-center py-3 text-center text-[var(--color-text-primary)]",
                "sm:py-4",
                index > 0 ? "md:border-l md:border-[var(--color-border)] md:px-6" : "md:px-6",
              ].join(" ")}
            >
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
