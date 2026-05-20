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

    if (formData.password !== confirmPassword) {
      setError('رمز عبور و تکرار آن مطابقت ندارد');
      return;
    }
    if (formData.password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('ثبت‌نام با موفقیت انجام شد!');
        dispatch(loginUser({ email: formData.email, password: formData.password }));
        router.push('/');
      } else {
        setError(data.message || 'ثبت‌نام ناموفق بود');
      }
    } catch (err) {
      setError('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/login3.jpeg')] bg-cover bg-center bg-no-repeat relative">
      {/* Overlay یکسان با صفحه لاگین */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 w-full max-w-md px-6 py-8">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">ثبت‌نام</h1>
            <p className="text-white/80">حساب کاربری جدید بسازید</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-2xl mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="نام کامل" 
              className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder:text-white/60 focus:outline-none focus:border-white/70" 
              required 
            />
            
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="ایمیل" 
              className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder:text-white/60 focus:outline-none focus:border-white/70" 
              required 
            />
            
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="شماره تلفن" 
              className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder:text-white/60 focus:outline-none focus:border-white/70" 
            />
            
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="رمز عبور" 
              className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder:text-white/60 focus:outline-none focus:border-white/70" 
              required 
            />
            
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="تکرار رمز عبور" 
              className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder:text-white/60 focus:outline-none focus:border-white/70" 
              required 
            />

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-white text-black py-4 rounded-2xl font-medium text-lg hover:bg-gray-100 transition disabled:opacity-70"
            >
              {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-white/70">
              قبلاً حساب دارید؟{' '}
              <Link href="/login" className="text-white hover:underline font-medium">
                وارد شوید
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}