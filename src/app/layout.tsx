import type { Metadata } from "next";
import { Cairo, Amiri, Noto_Naskh_Arabic, Tajawal, IBM_Plex_Sans_Arabic, Scheherazade_New } from "next/font/google";
import ThemeSync from "@/components/theme-sync";
import "./globals.css";

const cairo = Cairo({ variable: "--font-arabic", subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700", "800"] });
const amiri = Amiri({ variable: "--font-amiri", subsets: ["arabic", "latin"], weight: ["400", "700"] });
const noto = Noto_Naskh_Arabic({ variable: "--font-noto-naskh", subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"] });
const tajawal = Tajawal({ variable: "--font-tajawal", subsets: ["arabic", "latin"], weight: ["400", "500", "700", "800"] });
const ibmPlex = IBM_Plex_Sans_Arabic({ variable: "--font-ibm-plex", subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"] });
const scheherazade = Scheherazade_New({ variable: "--font-scheherazade", subsets: ["arabic", "latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "أذكاري - أذكار ما بعد الصلاة",
  description: "تطبيق أذكار شامل مع أذكار الصلوات والصباح والمساء والنوم والعداد الحر والإحصائيات",
  keywords: ["أذكار", "صلاة", "إسلام", "تسبيح", "استغفار", "أذكار الصباح", "أذكار المساء"],
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🕌</text></svg>" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='ar' dir='rtl' suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('dz_appMode');if(m!=='"light"')document.documentElement.classList.add('dark')}catch(e){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body
        className={`${cairo.variable} ${amiri.variable} ${noto.variable} ${tajawal.variable} ${ibmPlex.variable} ${scheherazade.variable} antialiased`}
        style={{
          background: 'var(--app-bg)',
          color: 'var(--app-text)',
          minHeight: '100vh',
        }}
      >
        {/* Subtle Islamic geometric pattern overlay */}
        <div 
          className='fixed inset-0 pointer-events-none z-0'
          style={{
            opacity: 0.6,
            backgroundImage: `
              radial-gradient(circle at 12% 18%, var(--app-pattern-1) 0%, transparent 45%),
              radial-gradient(circle at 88% 12%, var(--app-pattern-2) 0%, transparent 40%),
              radial-gradient(circle at 50% 50%, var(--app-pattern-1) 0%, transparent 60%),
              radial-gradient(circle at 8% 75%, var(--app-pattern-2) 0%, transparent 35%),
              radial-gradient(circle at 92% 82%, var(--app-pattern-1) 0%, transparent 38%)
            `,
          }}
        />
        {/* Decorative gold accent orbs — ambient light effect */}
        <div
          className='fixed pointer-events-none z-0'
          style={{
            top: '-15%',
            right: '-10%',
            width: '50vw',
            height: '50vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--gold-glow) 0%, transparent 70%)',
            filter: 'blur(60px)',
            opacity: 0.5,
          }}
        />
        <div
          className='fixed pointer-events-none z-0'
          style={{
            bottom: '-20%',
            left: '-15%',
            width: '60vw',
            height: '60vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--app-pattern-1) 0%, transparent 65%)',
            filter: 'blur(80px)',
            opacity: 0.4,
          }}
        />
        <ThemeSync />
        <div className='relative z-10'>{children}</div>
      </body>
    </html>
  );
}
