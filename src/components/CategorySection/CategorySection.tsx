import Link from "next/link";

const categories = [
  {
    id: 1,
    title: "ضد آفتاب",
    image: "/images/categories/sunscreen.avif",
    link: "/main/category/sunscreen",
  },
  {
    id: 2,
    title: "سرم ",
    image: "/images/categories/serum.webp",
    link: "/main/category/serum",
  },
  {
    id: 3,
    title: "کرم ",
    image: "/images/categories/cream.webp",
    link: "/main/category/cream",
  },
  {
    id: 4,
    title: "پاک کننده",
    image: "/images/categories/cleanser.webp",
    link: "/main/category/cleanser",
  },
  {
    id: 5,
    title: "ماسک صورت",
    image: "/images/categories/mask.webp",
    link: "/main/category/mask",
  },
];

export default function CategorySection() {
  return (
    <section className="w-full py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* title */}
        <h2 className="text-4xl font-bold text-center mb-14 text-black">
          دسته بندی محصولات
        </h2>

        {/* categories */}
        <div className="flex flex-wrap justify-center gap-10 text-black">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.link}
              className="flex flex-col items-center gap-4 group"
            >
              {/* circle image */}
              <div
                className="
                  w-40 h-40
                  rounded-full
                  overflow-hidden
                  shadow-xl
                  border-4 border-white
                  transition duration-300
                  group-hover:scale-105
                "
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* text */}
              <h3 className="text-xl font-semibold">{category.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
