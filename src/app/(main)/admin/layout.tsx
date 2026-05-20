'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store';
import AdminSidebar from './components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token || !user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [token, user, router]);

  if (!token || !user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center">در حال بررسی دسترسی...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 mr-72 p-8">   {/* mr-72 برای RTL */}
        {children}
      </main>
    </div>
  );
}