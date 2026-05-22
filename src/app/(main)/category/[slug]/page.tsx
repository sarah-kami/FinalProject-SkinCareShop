'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductCard from '@/src/components/products/ProductCard';
import { categoryLabel } from '@/src/data/categories';
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

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`http://localhost:5000/api/products?category=${slug}&limit=20`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setProducts(data.data as Product[]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const title = categoryLabel[slug as string] || slug;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12" dir="rtl">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-black transition">خانه</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black transition">محصولات</Link>
          <span>/</span>
          <span className="text-black">{title}</span>
        </div>
        <h1 className="text-4xl font-bold text-black">{title}</h1>
        <p className="text-gray-500 mt-2">{products.length} محصول</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-80" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-2xl text-gray-400 mb-6">محصولی در این دسته‌بندی یافت نشد</p>
          <Link href="/products" className="bg-black text-white px-8 py-3 rounded-xl inline-block">
            مشاهده همه محصولات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}