"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function HomeContent() {
  const searchParams = useSearchParams();
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);

  useEffect(() => {
    const verified = searchParams?.get("verified");
    const error = searchParams?.get("error");

    if (verified === "1") {
      setVerificationMessage("success");
      // 清除 URL 參數
      window.history.replaceState({}, "", "/");
    } else if (verified === "0") {
      if (error === "missing_token") {
        setVerificationMessage("missing_token");
      } else if (error === "invalid_token") {
        setVerificationMessage("invalid_token");
      } else if (error === "expired") {
        setVerificationMessage("expired");
      } else {
        setVerificationMessage("error");
      }
      // 清除 URL 參數
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-white dark:bg-black sm:items-start">
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
          <h1 className="max-w-xs text-4xl font-bold zen-title">出口成章 (建構中)</h1>
          <p className="max-w-md text-lg leading-8 zen-subtle">Sustainable Human Classics</p>

        </div>
        {/* Primary actions moved up */}
        <div className="flex w-full max-w-md items-center gap-3 text-base font-medium" style={{ marginTop: "1cm" }}>
          <a
            className="flex h-12 flex-1 min-w-0 items-center justify-center gap-2 rounded-full border border-zinc-200 px-4 text-foreground transition-colors hover:bg-zinc-100"
            href="/poem"
          >
            唐詩
          </a>

          <a
            className="flex h-12 flex-1 min-w-0 items-center justify-center gap-2 rounded-full border border-zinc-200 px-4 text-foreground transition-colors hover:bg-zinc-100"
            href="/songci"
          >
            宋詞
          </a>

          <a
            className="flex h-12 flex-1 min-w-0 items-center justify-center gap-2 rounded-full border border-zinc-200 px-4 text-foreground transition-colors hover:bg-zinc-100"
            href="/bible"
          >
            聖經
          </a>
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
            <h1 className="max-w-xs text-4xl font-bold zen-title">出口成章 (建構中)</h1>
            <p className="max-w-md text-lg leading-8 zen-subtle">Sustainable Human Classics</p>
          </div>
        </main>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
