import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://insidedopamine.com"),
  title: {
    default: "Inside Dopamine — Data Analytics, AI, Web Platforms",
    template: "%s — Inside Dopamine",
  },
  description:
    "We build Power BI dashboards, AI solutions, and high-performance web platforms that turn data into decisions.",
  openGraph: {
    type: "website",
    url: "https://insidedopamine.com",
    title: "Inside Dopamine",
    description:
      "Power BI dashboards, AI integrations, and modern web platforms for teams that move fast.",
    siteName: "Inside Dopamine",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}