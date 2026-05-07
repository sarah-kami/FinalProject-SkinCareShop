'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/src/redux/features/authSlice';
import { RootState, AppDispatch } from '@/src/redux/store';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== confirmPassword) {
      setError('رمز عبور و تکرار آن مطابقت ندارد');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('ثبت‌نام با موفقیت انجام شد!');
        dispatch(loginUser({ email: formData.email, password: formData.password }));
        router.push('/');
      } else {
        setError(data.message || 'ثبت‌نام ناموفق بود');
      }
    } catch (err: any) {
      console.error("Register Error:", err);
      setError('امکان اتصال به سرور وجود ندارد. مطمئن شوید بک‌اند در حال اجراست.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ثبت‌نام</h1>
          <p className="text-gray-600">حساب کاربری جدید بسازید</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-3 rounded-2xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نام و نام خانوادگی</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900
                         focus:outline-none focus:border-black focus:ring-4 focus:ring-gray-200 
                         focus:shadow-xl transition-all duration-200"
              placeholder="نام کامل خود را وارد کنید"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900
                         focus:outline-none focus:border-black focus:ring-4 focus:ring-gray-200 
                         focus:shadow-xl transition-all duration-200"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">شماره تلفن</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900
                         focus:outline-none focus:border-black focus:ring-4 focus:ring-gray-200 
                         focus:shadow-xl transition-all duration-200"
              placeholder="09123456789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">رمز عبور</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900
                         focus:outline-none focus:border-black focus:ring-4 focus:ring-gray-200 
                         focus:shadow-xl transition-all duration-200"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">تکرار رمز عبور</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900
                         focus:outline-none focus:border-black focus:ring-4 focus:ring-gray-200 
                         focus:shadow-xl transition-all duration-200"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-medium text-lg hover:bg-gray-900 disabled:opacity-70 mt-4"
          >
            {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
          </button>
        </form>

        <div className="text-center mt-10 text-sm">
          <p className="text-gray-600 mb-3">قبلاً حساب کاربری دارید؟</p>
          <Link href="/login" className="text-black hover:underline font-medium text-base">
            وارد شوید
          </Link>
        </div>
      </div>
    </div>
  );
}