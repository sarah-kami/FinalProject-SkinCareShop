import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "فروشگاه محصولات پوستی",
  description: "فروشگاه آنلاین محصولات مراقبت از پوست",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}