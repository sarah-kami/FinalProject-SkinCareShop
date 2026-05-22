'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toPersianNumber } from '@/src/utils/formatNumber';




interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  stock: number;
  brand?: string;
}

const categoryLabel: Record<string, string> = {
  cleanser: 'پاک‌کننده',
  cream: 'کرم',
  mask: 'ماسک',
  serum: 'سرُم',
  sunscreen: 'ضد آفتاب',
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setProduct(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setAddingToCart(true);
    try {
      const res = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id, quantity }),
      });
      const data = await res.json();
      if (data.success) {
        alert('محصول به سبد خرید اضافه شد');
      } else {
        alert(data.message || 'خطا در افزودن به سبد خرید');
      }
    } catch {
      alert('خطا در ارتباط با سرور');
    } finally {
      setAddingToCart(false);
    }
  };

  const getImageUrl = (img: string) =>
    img.startsWith('http') ? img : `http://localhost:5000${img}`;

  const discount = product?.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-100 rounded-3xl aspect-square" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded-full w-3/4" />
            <div className="h-6 bg-gray-100 rounded-full w-1/2" />
            <div className="h-24 bg-gray-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-32">
        <p className="text-2xl text-gray-500 mb-6">محصول یافت نشد</p>
        <Link href="/products" className="bg-black text-white px-8 py-3 rounded-xl">
          بازگشت به محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12" dir="rtl">

      {/* breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-10">
        <Link href="/" className="hover:text-black transition">خانه</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-black transition">محصولات</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-black transition">
          {categoryLabel[product.category] || product.category}
        </Link>
        <span>/</span>
        <span className="text-black">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* عکس‌ها */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl overflow-hidden aspect-square flex items-center justify-center shadow-sm border border-gray-100">
            <img
              src={getImageUrl(product.images[selectedImage] || '')}
              alt={product.name}
              className="w-full h-full object-contain p-8"
              style={{ backgroundColor: 'white' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.jpg';
              }}
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === index ? 'border-black' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={getImageUrl(img)}
                    alt=""
                    className="w-full h-full object-contain p-1 bg-white"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* اطلاعات */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-[#b89a7a] font-medium mb-2">
              {categoryLabel[product.category] || product.category}
              {product.brand && ` | ${product.brand}`}
            </p>
            <h1 className="text-3xl font-bold text-black leading-snug">{product.name}</h1>
          </div>

          {/* قیمت */}
          <div className="flex items-center gap-4">
            {product.discountPrice ? (
              <>
                <span className="text-3xl font-bold text-black">
                  {toPersianNumber(product.discountPrice.toLocaleString())} تومان
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {toPersianNumber(product.price.toLocaleString())} تومان
                </span>
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {discount}٪ تخفیف
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-black">
                {toPersianNumber(product.price.toLocaleString())} تومان
              </span>
            )}
          </div>

          {/* توضیحات */}
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* موجودی */}
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {product.stock === 0
                ? 'ناموجود'
                : product.stock <= 3
                ? `فقط ${toPersianNumber(product.stock)} عدد باقی مانده`
                : 'موجود در انبار'}
            </span>
          </div>

          {/* تعداد و افزودن به سبد */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-3 hover:bg-gray-100 transition text-black font-bold text-lg"
                >
                  −
                </button>
                <span className="px-6 py-3 font-medium text-black border-x border-gray-300">
                  {toPersianNumber(quantity)}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-4 py-3 hover:bg-gray-100 transition text-black font-bold text-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={addToCart}
                disabled={addingToCart}
                className="flex-1 bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-medium transition disabled:opacity-70"
              >
                {addingToCart ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
              </button>
            </div>
          )}

          {product.stock === 0 && (
            <button disabled className="w-full bg-gray-200 text-gray-500 py-4 rounded-xl font-medium cursor-not-allowed">
              ناموجود
            </button>
          )}
        </div>
      </div>
    </div>
  );
}