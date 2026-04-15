import type { Metadata } from "next";
import PageHero from "../../../components/sections/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy | Inside Dopamine",
  description: "How Inside Dopamine handles and protects personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        label="PRIVACY"
        headline="Privacy Policy"
        intro="The full privacy policy will be added before launch."
      />
    </>
  );
}
