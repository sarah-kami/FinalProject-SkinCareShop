'use client';

import { useRouter } from 'next/navigation';

const brands = [
  {
    id: 1,
    name: 'Dior',
    title: 'محصولات دیور',
    subtitle: 'تخفیف ویژه تا ۳۰٪',
    bgImage: '/images/brands/diordis2.jpg',
    brand: 'Dior',
  },
  {
    id: 2,
    name: "L'Oreal",
    title: "محصولات لورآل",
    subtitle: 'تخفیف ویژه تا ۲۵٪',
    bgImage: '/images/brands/lorealdis1.jpg',
    brand: "L'Oreal",
  },
];

export default function DiscountSection() {
  const router = useRouter();

  return (
    <section className="w-full py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <div className="text-right mb-12">
          <p className="text-sm tracking-widest text-[#b89a7a] mb-2 font-medium">SPECIAL OFFERS</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            تخفیف‌های
            <span className="block text-[#b89a7a]">ویژه برندها</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => router.push(`/products?brand=${brand.brand}&discount=true`)}
              className="relative h-72 rounded-3xl overflow-hidden cursor-pointer group"
            >
              {/* بک گراند */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${brand.bgImage})` }}
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />

              {/* محتوا */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-right">
                <h3 className="text-3xl font-bold text-white mb-2">{brand.title}</h3>
                <p className="text-white/80 text-lg mb-4">{brand.subtitle}</p>
                <span className="inline-block bg-white text-black text-sm font-bold px-6 py-2.5 rounded-full w-fit group-hover:bg-[#b89a7a] group-hover:text-white transition-colors duration-300">
                  مشاهده محصولات
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}