import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import HeroSection from "@/components/sections/HeroSection";
import TrustStripSection from "@/components/sections/TrustStripSection";
import ServicesSection from "@/components/sections/ServicesSection";
import WorkSection from "@/components/sections/WorkSection";
import ProcessSection from "@/components/sections/ProcessSection";
import ObjectionHandlingSection from "@/components/sections/ObjectionHandlingSection";
import FinalCTASection from "@/components/sections/FinalCTASection";

export const metadata: Metadata = {
  title: "Inside Dopamine | AI Systems & Automation",
  description:
    "We build dashboards, web apps, and automation systems for teams that are done doing things manually.",
};

export default function HomePage() {
  return (
    <>
      <section
        className="hero-shell"
        aria-label="Hero"
        style={{ background: "linear-gradient(180deg, var(--hero-gradient-start) 0%, #FAFAFA 60%, #FFFFFF 100%)" }}
      >
        <Container>
          <div className="flex min-h-[clamp(34rem,76svh,48rem)] max-w-[44rem] flex-col justify-start pt-16 pb-10 md:min-h-[clamp(38rem,72svh,50rem)] md:justify-center md:py-14">
            <HeroSection
              eyebrow="AI-NATIVE DIGITAL AGENCY"
              headline="We build digital products powered by AI"
              subheadline="Inside Dopamine designs and ships dashboards, AI copilots, and full digital platforms for ambitious businesses."
              primaryCta={{ label: "See our work", href: "/work" }}
              secondaryCta={{ label: "Talk to us", href: "/contact" }}
            />
          </div>
        </Container>
      </section>
      <TrustStripSection />
      <ServicesSection />
      <WorkSection />
      <ProcessSection />
      <ObjectionHandlingSection />
      <FinalCTASection />
    </>
  );
}
