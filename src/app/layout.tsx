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
    default: "Inside Dopamine — BI Dashboards, AI & Web Platforms",
    template: "%s — Inside Dopamine",
  },
  description:
    "We build BI dashboards, AI solutions, and high-performance web platforms that turn data into decisions.",
  openGraph: {
    type: "website",
    url: "https://insidedopamine.com",
    title: "Inside Dopamine",
    description:
      "BI dashboards, AI integrations, and modern web platforms for teams that move fast.",
    siteName: "Inside Dopamine",
    images: [
      {
        url: "/og-insidedopamine.PNG",
        width: 1200,
        height: 630,
        alt: "Inside Dopamine — BI Dashboards, AI & Web Platforms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inside Dopamine",
    description:
      "BI dashboards, AI integrations, and modern web platforms for teams that move fast.",
    images: ["/og-insidedopamine.PNG"],
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