'use client';

import Link from "next/link";
import { categories } from "@/src/data/categories";

const categoryImages: Record<string, string> = {
  cleanser: "/images/categories/cleanser.webp",
  serum: "/images/categories/serum.webp",
  cream: "/images/categories/cream.webp",
  mask: "/images/categories/mask.webp",
  sunscreen: "/images/categories/sunscreen.avif",
  toner: "/images/categories/toner.jpg",
  eyecream: "/images/categories/eyecream.jpg",
  lipbalm: "/images/categories/lipbalm.jpg",
  lipmask: "/images/categories/lipmask.jpg",
  bodylotion: "/images/categories/bodylotion.jpg",
  hairmask: "/images/categories/hairmask.jpg",
  hairserum: "/images/categories/hairserum.jpg",
  hairoil: "/images/categories/hairoil.jpg",
};

export default function CategorySection() {
  return (
    <section className="w-full py-20 px-6 md:px-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
          دسته‌بندی محصولات
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {categories.map((category) => (
            <Link
              key={category.value}
              href={`/category/${category.value}`}
              className="flex flex-col items-center gap-4 group"
            >
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white shadow-lg border-4 border-white flex items-center justify-center transition duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                <img
                  src={categoryImages[category.value] || '/placeholder.jpg'}
                  alt={category.label}
                  className="w-20 h-20 md:w-24 md:h-24 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.jpg';
                  }}
                />
              </div>
              <h3 className="text-sm md:text-base font-semibold text-gray-800 group-hover:text-black transition-colors text-center">
                {category.label}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}