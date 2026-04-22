import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="section-space" aria-label="Not found">
      <Container>
        <div className="max-w-[44rem]">
          <p className="type-mono text-[var(--color-muted)]">404</p>
          <h1 className="type-section mt-4 text-3xl text-[var(--color-text)] md:text-5xl">
            Page not found.
          </h1>
          <p className="type-body mt-4 max-w-[36rem]">
            This page doesn’t exist or may have moved.
          </p>
          <div className="mt-8">
            <Button as="link" href="/" variant="primary">
              Back to home →
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
