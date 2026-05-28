import Banner from "@/src/components/Banner/Banner";
import CategorySection from "@/src/components/CategorySection/CategorySection";
import NewProductSection from "@/src/components/NewProductSection/NewProductSection";
import DiscountSection from '@/src/components/DiscountSection/DiscountSection';
import BrandSection from '@/src/components/BrandSection/BrandSection';

export default function Home() {
  return (
    <main>
      <Banner />
      <CategorySection />
      <NewProductSection />
      <DiscountSection />
      <BrandSection />
    </main>
  );
}




