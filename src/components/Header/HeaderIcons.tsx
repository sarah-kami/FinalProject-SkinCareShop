'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/src/redux/features/authSlice';
import { RootState } from '@/src/redux/store';

export default function HeaderIcons() {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { user, token } = useSelector((state: RootState) => state.auth);

  const isLoggedIn = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex items-center gap-4">
      {/* سبد خرید */}
      <img
        src="/shopcard.svg"
        alt="cart"
        className="w-9 h-9 cursor-pointer hover:scale-110 transition"
        onClick={() => router.push('/cart')}
      />

      {isLoggedIn && (
        <div className="flex items-center gap-3">
          {/* آیکون کاربر + نام */}
          <div 
            onClick={() => isAdmin && router.push('/admin')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <img src="/admin.svg" alt="user" className="w-9 h-9" />
            <span className="text-white/90 text-sm hidden md:block">
              {user?.name?.split(' ')[0]}
            </span>
          </div>

          {/* دکمه پنل ادمین (زیر آیکون کاربر) */}
          {isAdmin && (
            <button
              onClick={() => router.push('/admin')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-1.5 rounded-xl transition"
            >
              پنل ادمین
            </button>
          )}

          {/* دکمه خروج */}
          <button
            onClick={() => dispatch(logout())}
            className="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-xl transition"
          >
            خروج
          </button>
        </div>
      )}

      {/* حالت لاگین نشده */}
      {!isLoggedIn && (
        <img
          src="/admin.svg"
          alt="user"
          className="w-9 h-9 cursor-pointer"
          onClick={() => router.push('/login')}
        />
      )}
    </div>
  );
}