'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toPersianNumber } from '@/src/utils/formatNumber';

interface Order {
  _id: string;
  user: { name: string; email: string };
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface LowStockProduct {
  _id: string;
  name: string;
  stock: number;
  images: string[];
}

interface Stats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  lowStockProducts: number;
  recentOrders: Order[];
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending:   { label: 'در انتظار', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'تایید شده', color: 'bg-blue-100 text-blue-700' },
  shipping:  { label: 'در ارسال', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'تحویل داده شده', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'لغو شده', color: 'bg-red-100 text-red-700' },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    lowStockProducts: 0,
    recentOrders: [],
  });
  const [lowStockList, setLowStockList] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [statsRes, lowStockRes] = await Promise.all([
          fetch('http://localhost:5000/api/users/stats', { headers }),
          fetch('http://localhost:5000/api/products?limit=50', { headers }),
        ]);

        const statsData = await statsRes.json();
        const lowStockData = await lowStockRes.json();

        if (statsData.success) {
          setStats(statsData.data);
        }

        if (lowStockData.success) {
          setLowStockList(
            lowStockData.data.filter((p: LowStockProduct) => p.stock <= 3)
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getImageUrl = (img: string) =>
    img ? (img.startsWith('http') ? img : `http://localhost:5000${img}`) : '/placeholder.jpg';

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-gray-100 rounded-2xl w-64" />
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-3xl h-36" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'تعداد محصولات', value: stats.totalProducts, color: 'text-black', link: '/admin/products' },
    { label: 'سفارشات کل', value: stats.totalOrders, color: 'text-black', link: '/admin/orders' },
    { label: 'کاربران ثبت‌نام کرده', value: stats.totalUsers, color: 'text-black', link: '/admin/users' },
    { label: 'محصولات کم‌موجودی', value: stats.lowStockProducts, color: 'text-red-600', link: '/admin/inventory' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-black mb-2">داشبورد ادمین</h1>
        <p className="text-gray-500">خوش آمدید به پنل مدیریت فروشگاه</p>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link key={card.label} href={card.link} className="block">
            <div className="bg-white p-8 rounded-3xl shadow hover:shadow-md transition group">
              <p className="text-gray-500 text-sm mb-3">{card.label}</p>
              <p className={`text-5xl font-bold ${card.color} group-hover:scale-105 transition-transform inline-block`}>
                {toPersianNumber(card.value)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* آخرین سفارشات */}
        <div className="bg-white p-8 rounded-3xl shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-black">آخرین سفارشات</h2>
            <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-black transition border-b border-gray-300 hover:border-black pb-0.5">
              مشاهده همه
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="text-gray-400 text-center py-10">سفارشی ثبت نشده</p>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-black text-sm">{order.user?.name || '—'}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('fa-IR')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusMap[order.status]?.color}`}>
                      {statusMap[order.status]?.label}
                    </span>
                    <p className="font-bold text-black text-sm">{toPersianNumber(order.totalPrice)} تومان</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* محصولات با موجودی کم */}
        <div className="bg-white p-8 rounded-3xl shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-black">محصولات با موجودی کم</h2>
            <Link href="/admin/inventory" className="text-sm text-gray-500 hover:text-black transition border-b border-gray-300 hover:border-black pb-0.5">
              مدیریت موجودی
            </Link>
          </div>

          {lowStockList.length === 0 ? (
            <p className="text-gray-400 text-center py-10">همه محصولات موجودی کافی دارند</p>
          ) : (
            <div className="space-y-4">
              {lowStockList.map((product) => (
                <div key={product._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl(product.images?.[0])}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <p className="font-medium text-black text-sm">{product.name}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    product.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {product.stock === 0 ? 'ناموجود' : `${toPersianNumber(product.stock)} عدد`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}