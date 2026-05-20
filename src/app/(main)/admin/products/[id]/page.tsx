'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

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
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
          setExistingImages(p.images || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(e.target.files);
      const previews: string[] = [];
      Array.from(e.target.files).forEach((file) => {
        previews.push(URL.createObjectURL(file));
      });
      setPreviewImages(previews);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('price', formData.price);
      form.append('category', formData.category);
      form.append('stock', formData.stock);
      if (formData.brand) form.append('brand', formData.brand);
      if (formData.discountPrice) form.append('discountPrice', formData.discountPrice);

      // عکس‌های قدیمی که نگه داشتیم
      existingImages.forEach((img) => form.append('existingImages', img));

      // عکس‌های جدید
      if (newImages) {
        Array.from(newImages).forEach((img) => form.append('images', img));
      }

      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: form,
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

  const getImageUrl = (img: string) =>
    img.startsWith('http') ? img : `http://localhost:5000${img}`;

  if (loading) return <div className="text-center py-20 text-xl">در حال بارگذاری محصول...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">ویرایش محصول</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow p-8 space-y-6">

        {/* عکس‌های فعلی */}
        {existingImages.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">عکس‌های فعلی</label>
            <div className="flex gap-3 flex-wrap">
              {existingImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={getImageUrl(img)}
                    alt="product"
                    className="w-24 h-24 object-cover rounded-xl border"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* آپلود عکس جدید */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            افزودن عکس جدید (اختیاری)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900"
          />
          {previewImages.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {previewImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded-xl border"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">نام محصول</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange}
            className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:border-black" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
          <textarea name="description" value={formData.description} onChange={handleChange}
            rows={5} className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:border-black" required />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">قیمت (تومان)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:border-black" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">قیمت با تخفیف</label>
            <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:border-black" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
            <select name="category" value={formData.category} onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:border-black">
              <option value="cleanser">پاک‌کننده</option>
              <option value="cream">کرم</option>
              <option value="mask">ماسک</option>
              <option value="serum">سرُم</option>
              <option value="sunscreen">ضد آفتاب</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">موجودی</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:border-black" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">برند</label>
          <input type="text" name="brand" value={formData.brand} onChange={handleChange}
            className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:border-black" />
        </div>

        <div className="flex gap-4 pt-6">
          <button type="submit" disabled={submitting}
            className="flex-1 bg-black text-white py-4 rounded-2xl font-medium hover:bg-gray-800 disabled:opacity-70">
            {submitting ? 'در حال ویرایش...' : 'ویرایش محصول'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="flex-1 border border-gray-300 py-4 rounded-2xl font-medium text-gray-900 hover:bg-gray-50">
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}