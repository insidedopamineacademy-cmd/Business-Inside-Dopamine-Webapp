import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://insidedopamine.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Inside Dopamine",
  description:
    "We build custom dashboards, web applications, and automation systems for companies that are done doing things manually.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body>
        <Navbar />
        <main>{children}</main>
        <ScrollToTopButton />
        <Footer />
      </body>
    </html>
  );
}
