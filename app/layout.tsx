import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_SC, Noto_Serif_TC } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import AuthNav from "./components/AuthNav";
import Providers from "./providers/SessionProvider";
import VisitPing from "./components/VisitPing";
import LanguageGate from "./components/LanguageGate";
import LanguageSelector from "./components/LanguageSelector";
import PWARegister from "./components/PWARegister";
import BookshelfContextMenu from "./components/BookshelfContextMenu";
import GlobalUpOneLevelButton from "./components/GlobalUpOneLevelButton";
import { Analytics } from "@vercel/analytics/next";

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
  description: "多方位學習管理平台",
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
          <Link
            href="/"
            aria-label="回到首頁"
            className="fixed top-4 left-4 z-60 h-12 w-12 rounded-full overflow-hidden"
          >
            <img
              src="/logo-removebg-preview.png"
              alt="sapiens.camp logo"
              className="h-full w-full object-contain scale-125"
            />
          </Link>
          <GlobalUpOneLevelButton />
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

          <LanguageGate>{children}</LanguageGate>

          <footer className="w-full py-8 flex items-center justify-center">
            <Link
              href="/feedback"
              className="inline-flex items-center justify-center whitespace-nowrap px-4 py-2 border rounded-full bg-transparent text-[var(--zen-ink)] text-sm leading-none cursor-pointer hover:opacity-90 transition-opacity"
            >
              意見回饋
            </Link>
          </footer>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
