import Link from "next/link";

export default function HeaderMenu() {
  return (
    <div className="flex items-center justify-between mt-2 p-2">
      <span className="cursor-pointer ml-2">همه محصولات</span>
      <span className="cursor-pointer">دسته‌بندی‌ها</span>

      <Link href="/contact">
        <button className="px-3 py-1 rounded text-white">
          تماس با ما
        </button>
      </Link>
    </div>
  );
}