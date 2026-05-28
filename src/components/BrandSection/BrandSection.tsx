/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter } from 'next/navigation';

const brands = [
  {
    id: 1,
    name: 'DIOR',
    logo: '/images/brands/dior-logo.png',
    bg: '#fff8f0',
  },
  {
    id: 2,
    name: 'CHANEL',
    logo: '/images/brands/chanel-logo.png',
    bg: '#fff8f0',
  },
  {
    id: 3,
    name: "GUCCI",
    logo: '/images/brands/gucci-logo.png',
    bg: '#fff8f0',
  },
  {
    id: 4,
    name: 'YSL',
    logo: '/images/brands/ysl-logo.png',
    bg: '#fff8f0',
  },
];

export default function BrandSection() {
  const router = useRouter();

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <div className="text-right mb-12">
          <p className="text-sm tracking-widest text-[#b89a7a] mb-2 font-medium">lUXURY BRANDS</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            برندهای
            <span className="block text-[#b89a7a]">لوکس</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => router.push(`/products?brand=${brand.name}`)}
              className="group cursor-pointer rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:shadow-lg hover:scale-105"
              style={{ backgroundColor: brand.bg }}
            >
              <div className="w-24 h-24 flex items-center justify-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <p className="font-semibold text-gray-900 text-sm text-center group-hover:text-[#b89a7a] transition-colors">
                {brand.name}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}