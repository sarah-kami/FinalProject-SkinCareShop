import Banner from "@/src/components/Banner/Banner";
import CategorySection from "@/src/components/CategorySection/CategorySection";
import NewProductSection from "@/src/components/NewProductSection/NewProductSection";

export default function Home() {
  return (
    <main>
      <Banner />
      <CategorySection />
      <NewProductSection />
    </main>
  );
}