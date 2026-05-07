import "./globals.css";
import ReduxProvider from '@/src/redux/providers/ReduxProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen flex flex-col">
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}