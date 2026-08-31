import type { Metadata, Viewport } from "next";
import { Cairo, Amiri, Noto_Naskh_Arabic, Tajawal, IBM_Plex_Sans_Arabic, Scheherazade_New } from "next/font/google";
import ThemeSync from "@/components/theme-sync";
import SessionProvider from "@/components/auth/session-provider";
import ErrorBoundary from "@/components/error-boundary";
import "./globals.css";

const cairo = Cairo({ variable: "--font-arabic", subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700", "800"] });
const amiri = Amiri({ variable: "--font-amiri", subsets: ["arabic", "latin"], weight: ["400", "700"] });
const noto = Noto_Naskh_Arabic({ variable: "--font-noto-naskh", subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"] });
const tajawal = Tajawal({ variable: "--font-tajawal", subsets: ["arabic", "latin"], weight: ["400", "500", "700", "800"] });
const ibmPlex = IBM_Plex_Sans_Arabic({ variable: "--font-ibm-plex", subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"] });
const scheherazade = Scheherazade_New({ variable: "--font-scheherazade", subsets: ["arabic", "latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "أذكاري - أذكار المسلم",
  description: "تطبيق أذكار شامل مع أذكار الصلوات والصباح والمساء والنوم والعداد الحر والإحصائيات وتقنيات التنفس",
  keywords: ["أذكار", "صلاة", "إسلام", "تسبيح", "استغفار", "أذكار الصباح", "أذكار المساء", "مسبح", "عداد", "تطبيق إسلامي"],
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "أذكاري",
  },
  openGraph: {
    type: "website",
    locale: "ar_AR",
    title: "أذكاري - أذكار المسلم",
    description: "تطبيق أذكار شامل مع أذكار الصلوات والصباح والمساء والنوم والعداد الحر والإحصائيات",
    siteName: "أذكاري",
  },
  twitter: {
    card: "summary",
    title: "أذكاري - أذكار المسلم",
    description: "تطبيق أذكار شامل مع أذكار الصلوات والصباح والمساء والنوم والعداد الحر والإحصائيات",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "application-name": "أذكاري",
    "msapplication-TileColor": "#111010",
  },
};

export const viewport: Viewport = {
  themeColor: "#C5A059",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='ar' dir='rtl' suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="أذكاري" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="format-detection" content="telephone=no" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('dz_appMode');if(m!=='"light"')document.documentElement.classList.add('dark')}catch(e){document.documentElement.classList.add('dark')}var b=localStorage.getItem('dz_bg');if(b&&b!=='"default"')document.body.classList.add('bg-app-'+JSON.parse(b))})()`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}`,
          }}
        />
      </head>
      <body
        className={`${cairo.variable} ${amiri.variable} ${noto.variable} ${tajawal.variable} ${ibmPlex.variable} ${scheherazade.variable} antialiased`}
        style={{
          backgroundColor: 'var(--app-bg)',
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
        <SessionProvider>
        <ThemeSync />
        <div className='relative z-10'><ErrorBoundary>{children}</ErrorBoundary></div>
        </SessionProvider>
      </body>
    </html>
  );
}
