'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/src/redux/features/authSlice';
import { RootState } from '@/src/redux/store';
import Image from 'next/image';

export default function HeaderIcons() {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { user, token } = useSelector((state: RootState) => state.auth);

  const isLoggedIn = !!token && !!user;

  const handleUserClick = () => {
    if (isLoggedIn) {
      // می‌تونی اینجا منوی کشویی (dropdown) بذاری یا مستقیم به پروفایل بره
      alert(`خوش آمدید ${user?.name} 👋`);
      // router.push('/profile'); // بعداً می‌تونی صفحه پروفایل بسازی
    } else {
      router.push('/login');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex gap-4 items-center">
      {/* آیکون کاربر */}
      <div 
        onClick={handleUserClick}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <img
          src="/admin.svg"
          alt="user"
          className="w-10 h-9 hover:scale-110 transition-transform"
        />
        
        {isLoggedIn && (
          <div className="text-sm hidden md:block">
            <span className="text-white/90">{user?.name?.split(' ')[0]}</span>
          </div>
        )}
      </div>

      {/* آیکون سبد خرید */}
      <img
        src="/shopcard.svg"
        alt="cart"
        className="w-10 h-9 cursor-pointer hover:scale-110 transition-transform"
        onClick={() => router.push('/cart')}
      />

      {/* دکمه خروج (فقط وقتی لاگین کرده) */}
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition"
        >
          خروج
        </button>
      )}
    </div>
  );
}