import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "../../styles/globals.css";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
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
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
