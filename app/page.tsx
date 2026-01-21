"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

type HomeContentProps = {
  categories: string[];
};

function HomeContent({ categories }: HomeContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [loadedCategories, setLoadedCategories] = useState<string[]>([]);

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setLoadedCategories(data.categories || []))
      .catch((err) => console.error("Failed to fetch categories:", err));

    // global stats moved to /stats page
  }, []);

  useEffect(() => {
    const verified = searchParams?.get("verified");
    const error = searchParams?.get("error");

    if (verified === "1") {
      setVerificationMessage("success");
      window.history.replaceState({}, "", "/");
    } else if (verified === "0") {
      if (error === "missing_token") setVerificationMessage("missing_token");
      else if (error === "invalid_token") setVerificationMessage("invalid_token");
      else if (error === "expired") setVerificationMessage("expired");
      else setVerificationMessage("error");
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black sm:items-start">
        {verificationMessage && (
          <div className={`w-full mb-6 p-4 rounded-md ${
            verificationMessage === "success"
              ? "bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300"
              : "bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
          }`}>
            {verificationMessage === "success" && (
              <p className="font-medium">✅ 電子郵件驗證成功！您現在可以登入了。</p>
            )}
            {verificationMessage === "missing_token" && (
              <p className="font-medium">❌ 驗證連結無效：缺少驗證令牌。</p>
            )}
            {verificationMessage === "invalid_token" && (
              <p className="font-medium">❌ 驗證連結無效：令牌不存在或已使用。</p>
            )}
            {verificationMessage === "expired" && (
              <p className="font-medium">❌ 驗證連結已過期，請重新申請驗證郵件。</p>
            )}
            {verificationMessage === "error" && (
              <p className="font-medium">❌ 驗證過程中發生錯誤，請稍後再試。</p>
            )}
          </div>
        )}

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-4xl font-bold zen-title">智人</h1>
          <p className="max-w-md text-lg leading-8 zen-subtle">Homo Sapiens Learning</p>
          {/* 全站統計已移至 「全站統計」 頁面 */}
        </div>

        {/* Advertisement placeholder at bottom of homepage */}
        <div className="w-full max-w-3xl mt-12 flex items-center justify-center" style={{ marginTop: "calc(3rem + 2cm)" }}>
          <div
            role="complementary"
            aria-label="advertisement"
            className="w-full h-28 rounded-md border-2 border-dashed border-zinc-200 dark:border-zinc-700 bg-transparent flex items-center justify-center text-sm text-zinc-500"
          >
            <div className="text-center">
              <div className="font-medium">AD</div>
              <div className="text-xs">100 USD / month (currently)</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-white dark:bg-black sm:items-start">
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h1 className="max-w-xs text-4xl font-bold zen-title">智人</h1>
            <p className="max-w-md text-lg leading-8 zen-subtle">Homo Sapiens Learning</p>
          </div>
        </main>
      </div>
    }>
      <HomeContent categories={[]} />
    </Suspense>
  );
}
