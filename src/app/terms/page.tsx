import type { Metadata } from "next";
import PageHero from "../../../components/sections/PageHero";

export const metadata: Metadata = {
  title: "Terms of Service | Inside Dopamine",
  description: "Terms governing the use of Inside Dopamine services and website.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        label="TERMS"
        headline="Terms of Service"
        intro="The full terms will be added before launch."
      />
    </>
  );
}
