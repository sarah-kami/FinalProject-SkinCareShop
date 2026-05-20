'use client';

import { useState, useEffect } from 'react';
import { toPersianNumber } from '@/src/utils/formatNumber';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/users?limit=50', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((r) => r.json())
      .then((data) => setUsers(data.success ? data.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const deleteUser = async (id: string) => {
    if (!confirm('آیا از حذف این کاربر مطمئن هستید؟')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || 'خطا در حذف کاربر');
      }
    } catch {
      alert('خطا در ارتباط با سرور');
    }
  };

  if (loading) return <div className="text-center py-20 text-xl text-black">در حال بارگذاری...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">کاربران</h1>
        <span className="text-black text-sm bg-gray-100 px-4 py-2 rounded-xl">
          مجموع: {toPersianNumber(users.length)} کاربر
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-right p-4 text-black font-bold">نام</th>
              <th className="text-right p-4 text-black font-bold">ایمیل</th>
              <th className="text-right p-4 text-black font-bold">شماره تلفن</th>
              <th className="text-right p-4 text-black font-bold">نقش</th>
              <th className="text-right p-4 text-black font-bold">تاریخ ثبت‌نام</th>
              <th className="text-center p-4 text-black font-bold">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium text-black">{user.name}</td>
                <td className="p-4 text-black">{user.email}</td>
                <td className="p-4 text-black">{user.phone || '—'}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-black'
                  }`}>
                    {user.role === 'admin' ? 'ادمین' : 'کاربر'}
                  </span>
                </td>
                <td className="p-4 text-black text-sm">
                  {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                </td>
                <td className="p-4 text-center">
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      حذف
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center text-black py-20">کاربری یافت نشد</p>
        )}
      </div>
    </div>
  );
}