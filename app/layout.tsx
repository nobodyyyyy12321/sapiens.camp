import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_TC } from "next/font/google";
import "./globals.css";
import AuthNav from "./components/AuthNav";
import Link from "next/link";
import Providers from "./providers/SessionProvider";

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

export const metadata: Metadata = {
  title: "邁可背",
  description: "語音背誦詩文輔助",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerif.variable} antialiased`}
      >
        <Providers>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "邁可背",
                "url": "https://memorize.guru",
                "logo": "https://memorize.guru/logo.svg"
              }),
            }}
          />
          <header className="w-full py-6 sticky top-0 z-50">
            <nav className="max-w-5xl mx-auto flex items-center justify-between px-6">
              <div className="flex items-center gap-4 flex-nowrap">
                <Link href="/" className="flex items-center gap-2 px-0 py-0">
                  <img src="/logo.svg" alt="邁可背" className="h-8 w-8" />
                </Link>
                <Link href="/" className="flex items-center gap-2 zen-ghost px-3 py-1 rounded whitespace-nowrap">
                  首頁
                </Link>
                <Link href="/all" className="flex items-center gap-2 zen-ghost px-3 py-1 rounded whitespace-nowrap">
                  所有詩文
                </Link>
                <Link href="/ranking" className="flex items-center gap-2 zen-ghost px-3 py-1 rounded whitespace-nowrap">
                  榜單
                </Link>
                <Link href="/stats" className="flex items-center gap-2 zen-ghost px-3 py-1 rounded whitespace-nowrap">
                  全站統計
                </Link>
                <Link href="/links" className="flex items-center gap-2 zen-ghost px-3 py-1 rounded whitespace-nowrap">
                  正派網站連結
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <AuthNav />
              </div>
            </nav>
          </header>

          {children}
        </Providers>
      </body>
    </html>
  );
}
