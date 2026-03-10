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
        <AudioPlayerProvider>
          <Providers>
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
            {/* Record player icon at top left with tooltip */}
            <div className="fixed top-4 left-16 z-60 group">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-transparent cursor-pointer relative">
                <img
                  src="/icons/record-player-white.png"
                  alt="Record player icon"
                  className="w-10 h-10 object-contain"
                  style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.15))" }}
                />
                {/* Tooltip */}
                <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-zinc-900 text-white text-xs rounded px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg border border-zinc-700">
                  推荐搭配一點音樂
                </span>
              </div>
            </div>
            {/* Hide GlobalUpOneLevelButton on feedback page */}
            {typeof window !== "undefined" && window.location.pathname.startsWith("/feedback") ? null : <GlobalUpOneLevelButton />}
            <header
              className="w-full py-5 sticky top-0 z-40"
              style={{ backgroundColor: "var(--zen-bg)", boxShadow: "none", borderBottom: "none" }}
            >
              <VisitPing />
              <nav className="w-full flex items-center justify-end pr-5 pl-5">
                <div className="flex items-center gap-3">
                  <div className="mr-0 md:mr-[3cm]">
                    <LanguageSelector />
                  </div>
                  <AuthNav />
                </div>
              </nav>
            </header>

            <RecordPlayer />

            <LanguageGate>{children}</LanguageGate>
          </Providers>
        </AudioPlayerProvider>
        <Analytics />
      </body>
    </html>
  );
}
