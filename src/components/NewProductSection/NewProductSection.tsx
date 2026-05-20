'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  stock: number;
}

const categoryLabel: Record<string, string> = {
  cleanser: 'پاک‌کننده',
  cream: 'کرم',
  mask: 'ماسک',
  serum: 'سرُم',
  sunscreen: 'ضد آفتاب',
};

function formatPrice(price: number) {
  return price.toLocaleString('fa-IR') + ' تومان';
}

export default function NewProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/products?limit=6')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="w-full py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-3xl h-96" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="w-full py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <div className="flex items-end justify-between mb-14">
          <div className="text-right">
            <p className="text-sm tracking-widest text-[#b89a7a] mb-2 font-medium">
              NEW ARRIVALS
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              جدیدترین
              <span className="block text-[#b89a7a]">محصولات</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium pb-1 border-b border-gray-300 hover:border-gray-900"
          >
            مشاهده همه ←
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="group block rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 bg-white"
            >
              {/* عکس */}
              <div className="relative bg-[#f7f4f0] aspect-square">
                {product.discountPrice && (
                  <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {Math.round((1 - product.discountPrice / product.price) * 100)}٪
                  </div>
                )}
                {product.stock <= 3 && product.stock > 0 && (
                  <div className="absolute top-3 left-3 z-10 bg-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    آخرین موجودی
                  </div>
                )}
                <img
                  src={
                    product.images?.[0]
                      ? `http://localhost:5000${product.images[0]}`
                      : '/placeholder.jpg'
                  }
                  alt={product.name}
                  className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.jpg';
                  }}
                />
              </div>

              {/* اطلاعات داخل کارت */}
              <div className="p-4 text-right border-t border-gray-100">
                <p className="text-xs text-[#b89a7a] mb-1 font-medium">
                  {categoryLabel[product.category] || product.category}
                </p>
                <h3 className="text-gray-900 font-semibold text-sm md:text-base leading-snug mb-3 line-clamp-2 group-hover:text-[#b89a7a] transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 justify-end">
                  {product.discountPrice ? (
                    <>
                      <span className="text-gray-400 line-through text-xs">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-red-500 font-bold text-sm md:text-base">
                        {formatPrice(product.discountPrice)}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-900 font-bold text-sm md:text-base">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}