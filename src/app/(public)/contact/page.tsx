import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import ContactInquiry from "@/features/contact/components/ContactInquiry";

export const metadata: Metadata = {
  title: "Contact | Inside Dopamine",
  description:
    "Request a strategy call to review your workflow, identify friction points, and define the right system.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="CONTACT"
        headline="Let’s talk about the system you need."
        intro="Request a strategy call and we’ll look at the workflow, the bottlenecks, and what should actually be built."
      />
      <ContactInquiry />
    </>
  );
}
