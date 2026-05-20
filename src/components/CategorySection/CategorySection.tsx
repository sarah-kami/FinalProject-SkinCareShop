'use client';

import Link from "next/link";

const categories = [
  { id: 1, title: "ضد آفتاب", image: "/images/categories/sunscreen.avif", category: "sunscreen" },
  { id: 2, title: "سرُم", image: "/images/categories/serum.webp", category: "serum" },
  { id: 3, title: "کرم", image: "/images/categories/cream.webp", category: "cream" },
  { id: 4, title: "پاک‌کننده", image: "/images/categories/cleanser.webp", category: "cleanser" },
  { id: 5, title: "ماسک صورت", image: "/images/categories/mask.webp", category: "mask" },
];

export default function CategorySection() {
  return (
    <section className="w-full py-20 px-6 md:px-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
          دسته‌بندی محصولات
        </h2>

        <div className="flex flex-wrap justify-center gap-12">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.category}`}
              className="flex flex-col items-center gap-5 group"
            >
              <div className="w-52 h-52 rounded-full bg-white shadow-xl border-4 border-white flex items-center justify-center transition duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-36 h-36 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.jpg';
                  }}
                />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 group-hover:text-black transition-colors">
                {category.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}