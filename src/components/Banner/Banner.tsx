import Link from "next/link";

export default function Banner() {
  return (
    <section className="w-full px-6 md:px-12 mt-10">
      <div
        className="relative w-full h-[500] rounded-3xl overflow-hidden shadow-2xl bg-cover bg-center flex items-center"
        style={{
          backgroundImage: "url('/banner.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex justify-end w-full px-10 md:px-20">
          <div className="flex flex-col items-start gap-8 max-w-md text-right">
            <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight">
              برای داشتن
              <br />
              پوستی شفاف
            </h1>

            <Link
              href="/products"
              className="bg-white text-black px-10 py-4 rounded-full text-lg font-semibold transition hover:bg-black hover:text-white"
            >
              دیدن محصولات
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
