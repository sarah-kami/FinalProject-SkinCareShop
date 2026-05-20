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
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
         style={{ 
           backgroundImage: "url('/login3.jpeg')"   // ← اینجا عکس بک‌گراند خودت رو بذار
         }}>
      
      {/* Overlay تیره برای خوانایی بهتر */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">ورود به حساب</h1>
            <p className="text-white/80">به فروشگاه پوستی خوش آمدید</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-2xl mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">ایمیل</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder:text-white/60 focus:outline-none focus:border-white"
                placeholder="example@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">رمز عبور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder:text-white/60 focus:outline-none focus:border-white"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-4 rounded-2xl font-medium text-lg hover:bg-gray-100 transition disabled:opacity-70"
            >
              {isLoading ? 'در حال ورود...' : 'ورود به حساب'}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-white/70">
              حساب کاربری ندارید؟{' '}
              <Link href="/register" className="text-white hover:underline font-medium">
                ثبت‌نام کنید
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}