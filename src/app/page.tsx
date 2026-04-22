import type { Metadata } from "next";
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
      <HeroSection />
      <TrustStripSection />
      <ServicesSection />
      <WorkSection />
      <ProcessSection />
      <ObjectionHandlingSection />
      <FinalCTASection />
    </>
  );
}
