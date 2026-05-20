/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "serum",
    stock: "",
    brand: "",
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
      const previews: string[] = [];
      Array.from(e.target.files).forEach((file) => {
        previews.push(URL.createObjectURL(file));
      });
      setPreviewImages(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!images || images.length === 0) {
      alert("حداقل یک عکس برای محصول الزامی است");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();

      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("category", formData.category);
      form.append("stock", formData.stock);
      if (formData.brand) form.append("brand", formData.brand);
      if (formData.discountPrice)
        form.append("discountPrice", formData.discountPrice);

      Array.from(images).forEach((image) => {
        form.append("images", image);
      });

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: form,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("محصول با موفقیت اضافه شد!");
        router.push("/admin/products");
      } else {
        alert(data.message || "خطا در ثبت محصول");
      }
    } catch (error) {
      alert("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        افزودن محصول جدید
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow p-8 space-y-6"
      >
        {/* آپلود عکس */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عکس محصول <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900"
            required
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نام محصول
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            توضیحات محصول
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:border-black"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              قیمت (تومان)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:border-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              قیمت با تخفیف (اختیاری)
            </label>
            <input
              type="number"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              دسته‌بندی
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:border-black"
            >
              <option value="cleanser">پاک‌کننده</option>
              <option value="cream">کرم</option>
              <option value="mask">ماسک</option>
              <option value="serum">سرُم</option>
              <option value="sunscreen">ضد آفتاب</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              موجودی
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:border-black"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            برند
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:border-black"
          />
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-black text-white py-4 rounded-2xl font-medium hover:bg-gray-800 disabled:opacity-70"
          >
            {loading ? "در حال ثبت..." : "ثبت محصول"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border border-gray-300 py-4 rounded-2xl font-medium hover:bg-gray-50 text-gray-900"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}
