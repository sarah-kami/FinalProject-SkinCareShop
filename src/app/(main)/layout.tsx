import Header from "@/src/components/Header/Header";
import Footer from "@/src/components/Footer/Footer";
import Providers from "@/src/components/providers";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </Providers>
  );
}