import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_TC } from "next/font/google";
import "./globals.css";
import AuthNav from "./components/AuthNav";
import Link from "next/link";
import Providers from "./providers/SessionProvider";
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

export const metadata: Metadata = {
  title: "出口成章",
  description: "禪風詩詞收藏與練習",
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
          <header className="w-full py-6">
            <nav className="max-w-5xl mx-auto flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <Link href="/" className="zen-ghost px-3 py-1 rounded">首頁</Link>
              </div>

              <div className="flex items-center gap-3">
                <AuthNav />
              </div>
            </nav>
          </header>

          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
