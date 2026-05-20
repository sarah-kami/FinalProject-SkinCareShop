'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import ProductCard from '@/src/components/products/ProductCard';

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  stock: number;
  brand?: string;
}

const categories = [
  { value: '', label: 'همه محصولات' },
  { value: 'cleanser', label: 'پاک‌کننده' },
  { value: 'cream', label: 'کرم' },
  { value: 'mask', label: 'ماسک' },
  { value: 'serum', label: 'سرُم' },
  { value: 'sunscreen', label: 'ضد آفتاب' },
];

async function getProducts(category: string, page: number, search: string) {
  let url = `http://localhost:5000/api/products?page=${page}&limit=12`;
  if (category) url += `&category=${category}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  const res = await fetch(url);
  const data = await res.json();
  return { products: (data.data || []) as Product[], totalPages: (data.pages || 1) as number };
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedCategory = searchParams.get('category') || '';
  const currentPage = Number(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['products', selectedCategory, currentPage, search],
    queryFn: () => getProducts(selectedCategory, currentPage, search),
  });

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  const updateUrl = (params: Record<string, string>) => {
    const current = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) current.set(key, value);
      else current.delete(key);
    });
    current.set('page', '1');
    router.push(`/products?${current.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const current = new URLSearchParams(searchParams.toString());
    current.set('page', String(newPage));
    router.push(`/products?${current.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">محصولات فروشگاه</h1>
        <p className="text-gray-600">انتخابی از بهترین محصولات مراقبت پوست</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-4xl mx-auto">
        <input
  type="text"
  placeholder="جستجو در محصولات..."
  value={search}
  onChange={(e) => updateUrl({ category: selectedCategory, search: e.target.value })}
  className="flex-1 px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-black text-gray-900"
/>

        <select
          value={selectedCategory}
          onChange={(e) => updateUrl({ category: e.target.value, search })}
          className="px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-black text-gray-900"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-32 text-xl">در حال بارگذاری محصولات...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <p className="text-center text-2xl text-gray-500 py-20">محصولی یافت نشد</p>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-16">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-8 py-3 border rounded-2xl disabled:opacity-50 hover:bg-gray-100"
              >
                قبلی
              </button>
              <span className="px-8 py-3 bg-gray-100 rounded-2xl font-medium">
                صفحه {currentPage} از {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-8 py-3 border rounded-2xl disabled:opacity-50 hover:bg-gray-100"
              >
                بعدی
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}