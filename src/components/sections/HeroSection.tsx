import Container from "../ui/Container";
import DynamicHero from "@/components/ui/DynamicHero";

export default function HeroSection() {
  return (
    <section className="hero-shell" aria-label="Hero">
      <Container>
        <div className="flex min-h-[clamp(34rem,76svh,48rem)] max-w-[44rem] flex-col justify-center py-10 md:min-h-[clamp(38rem,72svh,50rem)] md:py-14">
          <DynamicHero />
        </div>
      </Container>
    </section>
  );
}
