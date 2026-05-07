'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/src/redux/features/authSlice';
import { RootState, AppDispatch } from '@/src/redux/store';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const { isLoading, error, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ورود به حساب</h1>
          <p className="text-gray-600">به فروشگاه پوستی خوش آمدید</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-3 rounded-2xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900
                         focus:outline-none focus:border-black focus:ring-4 focus:ring-gray-200 
                         focus:shadow-xl transition-all duration-200"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900
                         focus:outline-none focus:border-black focus:ring-4 focus:ring-gray-200 
                         focus:shadow-xl transition-all duration-200"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-4 rounded-2xl font-medium text-lg hover:bg-gray-900 transition disabled:opacity-70 mt-4"
          >
            {isLoading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        <div className="text-center mt-10 text-sm">
          <p className="text-gray-600 mb-3">حساب کاربری ندارید؟</p>
          <Link 
            href="/register" 
            className="text-black hover:underline font-medium text-base"
          >
            ثبت‌نام کنید
          </Link>
        </div>
      </div>
    </div>
  );
}