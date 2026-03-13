import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_SC, Noto_Serif_TC } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import AuthNav from "./components/AuthNav";
import Providers from "./providers/SessionProvider";
import { AudioPlayerProvider } from "./components/audio-player-context";
import VisitPing from "./components/VisitPing";
import LanguageGate from "./components/LanguageGate";
import LanguageSelector from "./components/LanguageSelector";
import PWARegister from "./components/PWARegister";
import BookshelfContextMenu from "./components/BookshelfContextMenu";
import GlobalUpOneLevelButton from "./components/GlobalUpOneLevelButton";
import { Analytics } from "@vercel/analytics/next";
import RecordPlayer from "./components/RecordPlayer";
import TimeDisplay from "./components/TimeDisplay";
import TimerDisplay from "./components/TimerDisplay";
import "./speaker-icon.css";
// ...existing code...

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif_TC({
  variable: "--font-zen-serif",
  subsets: ["latin"],
});

const notoSerifSc = Noto_Serif_SC({
  variable: "--font-zen-serif-sc",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "智人題庫",
  description: "多方位學習平台",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/icon.png", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico", type: "image/x-icon" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerif.variable} ${notoSerifSc.variable} antialiased`}
      >
        <Providers>
          {/* 左上角固定 logo，所有頁面顯示 */}
          <Link href="/" className="fixed left-6 top-6 z-50 cursor-pointer group" aria-label="回到首頁">
            <img
              src="/logo-removebg-preview.png"
              alt="sapiens.camp logo"
              className="w-14 h-14 object-contain transition-opacity group-hover:opacity-80"
              style={{ background: "transparent" }}
            />
          </Link>

          {/* 新 header：時間、計時器、語言選單、頭像同一橫排 */}
          <header
            className="w-full py-5 sticky top-0 z-40"
            style={{ backgroundColor: "var(--zen-bg)", boxShadow: "none", borderBottom: "none" }}
          >
            <VisitPing />
            <div className="w-full flex items-center gap-6 flex-nowrap" style={{ minHeight: '56px' }}>
              {/* logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="cursor-pointer group" aria-label="回到首頁">
                  <img
                    src="/logo-removebg-preview.png"
                    alt="sapiens.camp logo"
                    className="w-14 h-14 object-contain transition-opacity group-hover:opacity-80"
                    style={{ background: "transparent" }}
                  />
                </Link>
              </div>
              {/* 時間與計時器 */}
              <div className="flex-1 flex justify-center items-center gap-6">
                <TimeDisplay />
                <TimerDisplay />
              </div>
              {/* 語言列 */}
              <div className="flex-shrink-0 flex items-center gap-6">
                <LanguageSelector />
              </div>
            </div>
          </header>

          <PWARegister />
          <BookshelfContextMenu />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "智人題庫",
                "url": "https://sapiens.camp",
              }),
            }}
          />
          {/* ...existing code... */}
          {/* Hide GlobalUpOneLevelButton on feedback page */}
          {typeof window !== "undefined" && window.location.pathname.startsWith("/feedback") ? null : <GlobalUpOneLevelButton />}

          <LanguageGate>{children}</LanguageGate>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
