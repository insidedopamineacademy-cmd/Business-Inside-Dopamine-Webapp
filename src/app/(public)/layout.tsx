import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import ChatWidget from "@/components/ui/ChatWidget";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="relative">
        <PageTransition>{children}</PageTransition>
      </main>
      <ScrollToTopButton />
      <Footer />
      <ChatWidget />
    </>
  );
}
