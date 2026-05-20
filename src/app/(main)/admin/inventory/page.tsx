'use client';

import { useState, useEffect } from 'react';
import { toPersianNumber } from '@/src/utils/formatNumber';

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
}

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, { price: string; discountPrice: string; stock: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/products?limit=50', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
          const initial: typeof editing = {};
          data.data.forEach((p: Product) => {
            initial[p._id] = {
              price: String(p.price),
              discountPrice: String(p.discountPrice || ''),
              stock: String(p.stock),
            };
          });
          setEditing(initial);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const saveProduct = async (id: string) => {
    setSavingId(id);
    try {
      const token = localStorage.getItem('token');
      const { price, discountPrice, stock } = editing[id];
      const body: Record<string, number> = {
        price: parseFloat(price),
        stock: parseInt(stock),
      };
      if (discountPrice) body.discountPrice = parseFloat(discountPrice);

      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(prev => prev.map(p => p._id === id ? data.data : p));
        alert('ذخیره شد');
      }
    } catch (err) {
      alert('خطا در ذخیره');
    } finally {
      setSavingId(null);
    }
  };

  const getImageUrl = (img: string) =>
    img ? (img.startsWith('http') ? img : `http://localhost:5000${img}`) : '/placeholder.jpg';

  if (loading) return <div className="text-center py-20 text-xl">در حال بارگذاری...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">مدیریت موجودی و قیمت</h1>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-right p-4 text-gray-900">محصول</th>
              <th className="text-right p-4 text-gray-900">قیمت (تومان)</th>
              <th className="text-right p-4 text-gray-900">قیمت با تخفیف</th>
              <th className="text-right p-4 text-gray-900">موجودی</th>
              <th className="text-center p-4 text-gray-900">ذخیره</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className={`border-t hover:bg-gray-50 ${product.stock <= 3 ? 'bg-red-50' : ''}`}>
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={getImageUrl(product.images?.[0])}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    {product.stock <= 3 && (
                      <p className="text-xs text-red-500">موجودی کم!</p>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <input
                    type="number"
                    value={editing[product._id]?.price || ''}
                    onChange={(e) => setEditing(prev => ({
                      ...prev,
                      [product._id]: { ...prev[product._id], price: e.target.value }
                    }))}
                    className="w-36 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="number"
                    value={editing[product._id]?.discountPrice || ''}
                    onChange={(e) => setEditing(prev => ({
                      ...prev,
                      [product._id]: { ...prev[product._id], discountPrice: e.target.value }
                    }))}
                    placeholder="اختیاری"
                    className="w-36 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="number"
                    value={editing[product._id]?.stock || ''}
                    onChange={(e) => setEditing(prev => ({
                      ...prev,
                      [product._id]: { ...prev[product._id], stock: e.target.value }
                    }))}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                  />
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => saveProduct(product._id)}
                    disabled={savingId === product._id}
                    className="bg-black text-white px-5 py-2 rounded-xl text-sm hover:bg-gray-800 transition disabled:opacity-50"
                  >
                    {savingId === product._id ? '...' : 'ذخیره'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}