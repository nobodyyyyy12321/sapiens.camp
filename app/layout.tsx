import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_TC } from "next/font/google";
import "./globals.css";
import AuthNav from "./components/AuthNav";
import Link from "next/link";
import Providers from "./providers/SessionProvider";
import VisitPing from "./components/VisitPing";
import LanguageSwitcher from "./components/LanguageSwitcher";
import Sidebar from "./components/Sidebar";
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
  title: "智人系統",
  description: "多方位學習管理平台",
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
                "name": "智人系統",
                "url": "https://sapiens.camp",
              }),
            }}
          />
          <Sidebar />
          <header
            className="w-full py-6 sticky top-0 z-40"
            style={{ backgroundColor: "var(--zen-bg)", boxShadow: "none", borderBottom: "none" }}
          >
            <VisitPing />
            <nav className="max-w-5xl mx-auto flex items-center justify-between px-6">
              <div className="flex items-center gap-4 flex-nowrap">
              </div>

              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <AuthNav />
              </div>
            </nav>
          </header>

          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
