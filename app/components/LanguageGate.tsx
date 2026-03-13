"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type LanguageCode = "zh-TW" | "zh-CN" | "en" | "es" | "ru";

const QUIZ_PREFIXES = [
  "/quote",
  "/english",
  "/study-chinese",
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

function isAllowedForLanguage(language: LanguageCode, pathname: string) {
  // 允許所有語言瀏覽 /feedback
  if (pathname === "/feedback" || pathname.startsWith("/feedback/")) {
    return true;
  }
  if (language === "en") {
    if (pathname === "/study-chinese" || pathname.startsWith("/study-chinese/")) {
      return true;
    }
    if (["/math", "/physics", "/chemistry"].includes(pathname)) {
      return true;
    }
  }
  if (language === "es" || language === "ru") {
    if (["/math", "/physics", "/chemistry"].includes(pathname)) {
      return true;
    }
  }
  return false;
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
    if (isAllowedForLanguage(language, pathname || "/")) return false;
    return isQuizPath(pathname || "/");
  }, [mounted, language, pathname]);

  if (blocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
        <main className="w-full max-w-3xl py-12 px-16 text-center">
          <h1 className="text-3xl font-bold zen-title mb-2">建構中</h1>
        </main>
      </div>
    );
  }

  return <>{children}</>;
}
