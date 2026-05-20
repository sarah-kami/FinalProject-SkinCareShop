'use client';

import { useState, useEffect } from 'react';
import { toPersianNumber } from '@/src/utils/formatNumber';

interface Stats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  lowStockProducts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');

        const productsRes = await fetch('http://localhost:5000/api/products?limit=1', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const productsData = await productsRes.json();

        setStats({
          totalProducts: productsData.total || productsData.count || 0,
          totalUsers: 42,
          totalOrders: 18,
          lowStockProducts: 7,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-xl">در حال بارگذاری داشبورد...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">داشبورد ادمین</h1>
        <p className="text-gray-600">خوش آمدید به پنل مدیریت فروشگاه</p>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow">
          <p className="text-gray-600 text-sm">تعداد محصولات</p>
          <p className="text-5xl font-bold text-gray-900 mt-3">
            {toPersianNumber(stats.totalProducts)}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow">
          <p className="text-gray-600 text-sm">سفارشات کل</p>
          <p className="text-5xl font-bold text-gray-900 mt-3">
            {toPersianNumber(stats.totalOrders)}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow">
          <p className="text-gray-600 text-sm">کاربران ثبت‌نام کرده</p>
          <p className="text-5xl font-bold text-gray-900 mt-3">
            {toPersianNumber(stats.totalUsers)}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow">
          <p className="text-gray-600 text-sm">محصولات کم‌موجودی</p>
          <p className="text-5xl font-bold text-red-600 mt-3">
            {toPersianNumber(stats.lowStockProducts)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-6">آخرین سفارشات</h2>
          <p className="text-gray-500 text-center py-16">در حال توسعه...</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-6">محصولات با موجودی کم</h2>
          <p className="text-gray-500 text-center py-16">در حال توسعه...</p>
        </div>
      </div>
    </div>
  );
}