'use client';

import Link from 'next/link';
import { toPersianNumber } from '@/src/utils/formatNumber';

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

export default function ProductCard({ product }: { product: Product }) {
  const mainImage = product.images?.[0]
    ? `http://localhost:5000${product.images[0]}`
    : '/placeholder.jpg';

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group">
      <div className="relative h-52 bg-white flex items-center justify-center overflow-hidden">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-300"
          style={{ backgroundColor: 'white' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.jpg';
          }}
        />

        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {discount}% تخفیف
          </div>
        )}

        {product.stock <= 3 && product.stock > 0 && (
          <div className="absolute top-3 left-3 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full">
            آخرین موجودی
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full">
              ناموجود
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs text-[#b89a7a] font-medium">
          {categoryLabel[product.category] || product.category}
        </p>
        <h3 className="font-semibold text-lg mt-2 line-clamp-2 min-h-[3.2rem] text-gray-900">
          {product.name}
        </h3>

        <div className="mt-4 flex items-baseline gap-2">
          {product.discountPrice ? (
            <>
              <span className="text-2xl font-bold text-gray-900">
                {toPersianNumber(product.discountPrice.toLocaleString())} تومان
              </span>
              <span className="text-sm text-gray-400 line-through">
                {toPersianNumber(product.price.toLocaleString())} تومان
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-gray-900">
              {toPersianNumber(product.price.toLocaleString())} تومان
            </span>
          )}
        </div>

        <Link
          href={`/products/${product._id}`}
          className="mt-6 block w-full bg-black hover:bg-gray-800 text-white text-center py-3.5 rounded-xl transition font-medium"
        >
          مشاهده محصول
        </Link>
      </div>
    </div>
  );
}