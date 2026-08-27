import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "أذكاري - أذكار ما بعد الصلاة",
  description: "تطبيق أذكار شامل مع أذكار الصلوات والصباح والمساء والنوم والعداد الحر والإحصائيات",
  keywords: ["أذكار", "صلاة", "إسلام", "تسبيح", "استغفار", "أذكار الصباح", "أذكار المساء"],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🕌</text></svg>",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='ar' dir='rtl' className='dark' suppressHydrationWarning>
      <body
        className={`${cairo.variable} antialiased`}
        style={{
          background: 'linear-gradient(180deg, #0c1220 0%, #0a0f1a 50%, #0d1117 100%)',
          color: '#e2e8f0',
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  );
}