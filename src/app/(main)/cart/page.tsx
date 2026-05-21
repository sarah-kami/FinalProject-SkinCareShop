'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toPersianNumber } from '@/src/utils/formatNumber';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
    stock: number;
  };
  quantity: number;
  price: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
  totalPrice: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://localhost:5000/api/cart', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) setCart(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const updateQuantity = async (itemId: string, quantity: number) => {
    setUpdatingId(itemId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/cart/update/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (data.success) setCart(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdatingId(itemId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setCart(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getImageUrl = (img: string) =>
    img ? (img.startsWith('http') ? img : `http://localhost:5000${img}`) : '/placeholder.jpg';

  const totalPrice = cart?.items.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  ) || 0;

  if (loading) {
    return <div className="text-center py-32 text-xl text-black">در حال بارگذاری...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-32" dir="rtl">
        <p className="text-2xl text-gray-500 mb-4">سبد خرید شما خالی است</p>
        <Link href="/products" className="bg-black text-white px-8 py-3 rounded-xl inline-block">
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12" dir="rtl">
      <h1 className="text-3xl font-bold text-black mb-10">سبد خرید</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl p-5 shadow-sm flex gap-5 items-center">
              <img
                src={getImageUrl(item.product?.images?.[0])}
                alt={item.product?.name}
                className="w-24 h-24 object-contain rounded-xl bg-gray-50 p-2 flex-shrink-0"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-black text-base mb-1">
                  {item.product?.name}
                </h3>
                <p className="text-black font-bold">
                  {toPersianNumber((item.price).toLocaleString())} تومان
                </p>
              </div>

              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => {
                    if (item.quantity > 1) updateQuantity(item._id, item.quantity - 1);
                  }}
                  disabled={updatingId === item._id || item.quantity <= 1}
                  className="px-3 py-2 hover:bg-gray-100 transition text-black font-bold disabled:opacity-40"
                >
                  −
                </button>
                <span className="px-4 py-2 text-black font-medium border-x border-gray-200">
                  {toPersianNumber(item.quantity)}
                </span>
                <button
                  onClick={() => {
                    if (item.quantity < item.product?.stock) updateQuantity(item._id, item.quantity + 1);
                  }}
                  disabled={updatingId === item._id || item.quantity >= item.product?.stock}
                  className="px-3 py-2 hover:bg-gray-100 transition text-black font-bold disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item._id)}
                disabled={updatingId === item._id}
                className="text-red-500 hover:text-red-700 transition text-sm font-medium disabled:opacity-40"
              >
                حذف
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit space-y-4">
          <h2 className="text-xl font-bold text-black mb-4">خلاصه سفارش</h2>

          <div className="flex justify-between text-black">
            <span className="text-gray-600">تعداد اقلام</span>
            <span className="font-medium">{toPersianNumber(cart.items.length)} قلم</span>
          </div>

          <div className="flex justify-between text-black border-t pt-4">
            <span className="font-bold text-lg">مجموع</span>
            <span className="font-bold text-lg">
              {toPersianNumber(totalPrice.toLocaleString())} تومان
            </span>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition mt-2"
          >
            ادامه و پرداخت
          </button>

          <Link
            href="/products"
            className="block text-center text-gray-500 hover:text-black transition text-sm"
          >
            ادامه خرید
          </Link>
        </div>
      </div>
    </div>
  );
}