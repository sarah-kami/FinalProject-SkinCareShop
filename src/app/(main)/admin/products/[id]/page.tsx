'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: 'serum',
    stock: '',
    brand: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();

        if (data.success) {
          const p = data.data;
          setFormData({
            name: p.name,
            description: p.description,
            price: p.price.toString(),
            discountPrice: p.discountPrice ? p.discountPrice.toString() : '',
            category: p.category,
            stock: p.stock.toString(),
            brand: p.brand || '',
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
          stock: Number(formData.stock),
        }),
      });

      if (res.ok) {
        alert('محصول با موفقیت ویرایش شد!');
        router.push('/admin/products');
      } else {
        alert('خطا در ویرایش محصول');
      }
    } catch (error) {
      alert('خطا در ارتباط با سرور');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-xl">در حال بارگذاری محصول...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">ویرایش محصول</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">نام محصول</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900" required />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">قیمت (تومان)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">قیمت با تخفیف</label>
            <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900">
              <option value="cleanser">پاک‌کننده</option>
              <option value="cream">کرم</option>
              <option value="mask">ماسک</option>
              <option value="serum">سرُم</option>
              <option value="sunscreen">ضد آفتاب</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">موجودی</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">برند</label>
          <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900" />
        </div>

        <div className="flex gap-4 pt-6">
          <button type="submit" disabled={submitting} className="flex-1 bg-black text-white py-4 rounded-2xl font-medium hover:bg-gray-800 disabled:opacity-70">
            {submitting ? 'در حال ویرایش...' : 'ویرایش محصول'}
          </button>
          <button type="button" onClick={() => router.back()} className="flex-1 border border-gray-300 py-4 rounded-2xl font-medium text-gray-900 hover:bg-gray-50">
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}