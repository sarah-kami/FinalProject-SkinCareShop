"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/src/redux/features/authSlice";
import { useDispatch } from "react-redux";

export default function AdminSidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const menuItems = [
    { href: "/admin", label: "داشبورد" },
    { href: "/admin/products", label: "مدیریت محصولات" },
    { href: "/admin/inventory", label: "موجودی و قیمت" },
    { href: "/admin/orders", label: "سفارشات" },
    { href: "/admin/users", label: "کاربران" },
  ];

  return (
    <div className="w-72 bg-white border-l border-gray-200 h-full p-6">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-black">پنل ادمین</h1>
        <p className="text-sm text-gray-500">فروشگاه پوستی</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-3 rounded-xl text-sm font-medium transition ${
              pathname === item.href
                ? "bg-black text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => dispatch(logout())}
        className="mt-10 w-full text-red-600 hover:bg-red-50 py-3 rounded-xl font-medium transition"
      >
        خروج از پنل ادمین
      </button>
    </div>
  );
}