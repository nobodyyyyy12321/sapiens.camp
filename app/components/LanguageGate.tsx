"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type LanguageCode = "zh-TW" | "zh-CN" | "en";

const QUIZ_PREFIXES = [
  "/quiz-bank",
  "/quote",
  "/english",
  "/study-chinese",
  "/traffic",
  "/math",
  "/recitation",
];

const RESERVED_ROOTS = new Set([
  "",
  "auth",
  "account",
  "advertise",
  "api",
  "stats",
  "under-construction",
  "sitemap.xml",
]);

function isQuizPath(pathname: string) {
  if (QUIZ_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return true;
  }

  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";
  if (!firstSegment) return false;
  if (RESERVED_ROOTS.has(firstSegment)) return false;

  return true;
}

export default function LanguageGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [language, setLanguage] = useState<LanguageCode>("zh-TW");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const syncLanguage = () => {
      const stored = (localStorage.getItem("siteLanguage") as LanguageCode | null) ?? "zh-TW";
      setLanguage(stored);
    };

    syncLanguage();
    setMounted(true);

    window.addEventListener("storage", syncLanguage);
    window.addEventListener("site-language-change", syncLanguage);
    return () => {
      window.removeEventListener("storage", syncLanguage);
      window.removeEventListener("site-language-change", syncLanguage);
    };
  }, []);

  const blocked = useMemo(() => {
    if (!mounted) return false;
    if (language === "zh-TW") return false;
    return isQuizPath(pathname || "/");
  }, [mounted, language, pathname]);

  if (blocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
        <main className="w-full max-w-3xl py-12 px-16 text-center">
          <h1 className="text-3xl font-bold zen-title mb-2">建構中</h1>
          <p className="text-sm zen-subtle">此功能正在建構中，敬請期待。</p>
        </main>
      </div>
    );
  }

  return <>{children}</>;
}
