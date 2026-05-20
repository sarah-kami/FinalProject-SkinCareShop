'use client';

import { useState, useEffect } from 'react';
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
  brand?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/products?limit=50', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setProducts(data.success ? data.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    if (!confirm('آیا از حذف این محصول مطمئن هستید؟')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
        alert('محصول حذف شد');
      }
    } catch (error) {
      alert('خطا در حذف محصول');
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) return <div className="text-center py-20 text-xl">در حال بارگذاری...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">مدیریت محصولات</h1>
        <Link
          href="/admin/products/new"
          className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
        >
          + افزودن محصول جدید
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-right p-4 text-gray-900">محصول</th>
              <th className="text-right p-4 text-gray-900">دسته‌بندی</th>
              <th className="text-right p-4 text-gray-900">قیمت</th>
              <th className="text-right p-4 text-gray-900">موجودی</th>
              <th className="text-center p-4 text-gray-900">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} className="border-t hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <img 
                    src={getImageUrl(product.images?.[0] || '')} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <p className="font-medium text-gray-900">{product.name}</p>
                </td>
                <td className="p-4 text-gray-900">{product.category}</td>
                <td className="p-4 text-gray-900 font-medium">
                  {toPersianNumber(product.discountPrice || product.price)} تومان
                </td>
                <td className="p-4 text-gray-900">{toPersianNumber(product.stock)} عدد</td>
                <td className="p-4 text-center">
                  <div className="flex gap-4 justify-center">
                    <Link
                      href={`/admin/products/${product._id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      ویرایش
                    </Link>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}