"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

type HomeContentProps = {
  categories: string[];
};

function HomeContent({ categories }: HomeContentProps) {
  const searchParams = useSearchParams();
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [loadedCategories, setLoadedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setLoadedCategories(data.categories || []))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const debounce = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data.articles || []);
          setIsSearching(false);
        })
        .catch((err) => {
          console.error("Search failed:", err);
          setIsSearching(false);
        });
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);
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

        {/* Search box */}
        <div className="w-full max-w-md mt-8">
          <input
            type="text"
            placeholder="搜尋標題或作者..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
          />
        </div>

        {/* Search results or categories */}
        {searchQuery.trim().length >= 2 ? (
          <div className="flex w-full max-w-md items-center gap-3 text-base font-medium flex-wrap justify-center" style={{ marginTop: "1cm" }}>
            {isSearching ? (
              <p className="text-sm zen-subtle">搜尋中...</p>
            ) : searchResults.length === 0 ? (
              <p className="text-sm zen-subtle">找不到相關結果</p>
            ) : (
              searchResults.map((article) => (
                <Link
                  key={article.id}
                  className="flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-200 px-6 text-foreground transition-colors hover:bg-zinc-100 whitespace-nowrap"
                  href={`/${encodeURIComponent(article.category || "未分類")}/${article.number}`}
                >
                  {article.title}{article.author ? ` - ${article.author}` : ""}
                </Link>
              ))
            )}
          </div>
        ) : (
          <div className="flex w-full max-w-md items-center gap-3 text-base font-medium flex-wrap justify-center" style={{ marginTop: "1cm" }}>
            {loadedCategories.length === 0 ? (
              <p className="text-sm zen-subtle">載入中...</p>
            ) : (
              loadedCategories.map((category) => (
                <Link
                  key={category}
                  className="flex h-12 flex-1 min-w-0 items-center justify-center gap-2 rounded-full border border-zinc-200 px-4 text-foreground transition-colors hover:bg-zinc-100"
                  href={`/${encodeURIComponent(category)}`}
                >
                  {category}
                </Link>
              ))
            )}
          </div>
        )}
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
      <HomeContent categories={[]} />
    </Suspense>
  );
}
