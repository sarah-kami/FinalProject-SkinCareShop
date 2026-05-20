'use client';

import { useState, useEffect } from 'react';
import { toPersianNumber } from '@/src/utils/formatNumber';

interface Order {
  _id: string;
  user: { name: string; email: string };
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  createdAt: string;
  orderItems: { name: string; quantity: number; price: number }[];
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending:   { label: 'در انتظار', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'تایید شده', color: 'bg-blue-100 text-blue-700' },
  shipping:  { label: 'در حال ارسال', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'تحویل داده شده', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'لغو شده', color: 'bg-red-100 text-red-700' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        let url = 'http://localhost:5000/api/orders/admin/all?limit=50';
        if (selectedStatus) url += `&status=${selectedStatus}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(data.success ? data.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [selectedStatus]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(prev =>
          prev.map(o => (o._id === id ? { ...o, status: status as Order['status'] } : o))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">سفارشات</h1>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl text-sm text-black focus:outline-none focus:border-black"
        >
          <option value="">همه سفارشات</option>
          {Object.entries(statusMap).map(([val, { label }]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xl text-black">در حال بارگذاری...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-black">سفارشی یافت نشد</div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-right p-4 text-black font-bold">کاربر</th>
                <th className="text-right p-4 text-black font-bold">تعداد اقلام</th>
                <th className="text-right p-4 text-black font-bold">مبلغ کل</th>
                <th className="text-right p-4 text-black font-bold">تاریخ</th>
                <th className="text-right p-4 text-black font-bold">وضعیت</th>
                <th className="text-center p-4 text-black font-bold">تغییر وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-medium text-black">{order.user?.name || '—'}</p>
                    <p className="text-xs text-gray-500">{order.user?.email || ''}</p>
                  </td>
                  <td className="p-4 text-black">
                    {toPersianNumber(order.orderItems?.length || 0)} قلم
                  </td>
                  <td className="p-4 font-medium text-black">
                    {toPersianNumber(order.totalPrice)} تومان
                  </td>
                  <td className="p-4 text-black text-sm">
                    {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusMap[order.status]?.color}`}>
                      {statusMap[order.status]?.label}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:border-black disabled:opacity-50"
                    >
                      {Object.entries(statusMap).map(([val, { label }]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}