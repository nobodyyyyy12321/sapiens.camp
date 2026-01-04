"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";

type HomeContentProps = {
  categories: string[];
};

function HomeContent({ categories }: HomeContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [loadedCategories, setLoadedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [allArticles, setAllArticles] = useState<any[]>([]);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setLoadedCategories(data.categories || []))
      .catch((err) => console.error("Failed to fetch categories:", err));

    // Fetch all articles for voice matching
    fetch("/api/search?q=")
      .then((res) => res.json())
      .then((data) => setAllArticles(data.articles || []))
      .catch((err) => console.error("Failed to fetch articles:", err));

    // global stats moved to /stats page
  }, []);

  useEffect(() => {
    // Setup Web Speech API
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "zh-TW";

      recognitionRef.current.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setVoiceTranscript(transcript);

        // Check if final result matches any article title
        if (event.results[event.results.length - 1].isFinal) {
          console.log("Final transcript:", transcript);
          console.log("All articles:", allArticles);
          
          const normalizeText = (text: string) => text.replace(/[\s，。、；：！？""''（）《》]/g, "");
          const normalizedTranscript = normalizeText(transcript);
          
          const match = allArticles.find(article => {
            if (!article.title) return false;
            const normalizedTitle = normalizeText(article.title);
            const matches = normalizedTranscript.includes(normalizedTitle) || normalizedTitle.includes(normalizedTranscript);
            console.log(`Checking: ${article.title} (${normalizedTitle}) vs ${transcript} (${normalizedTranscript}) = ${matches}`);
            return matches;
          });
          
          console.log("Match found:", match);
          
          if (match) {
            console.log("Navigating to:", `/${encodeURIComponent(match.category || "未分類")}/${match.number}`);
            stopVoiceListening();
            router.push(`/${encodeURIComponent(match.category || "未分類")}/${match.number}`);
          }
        }
      };

      recognitionRef.current.onerror = () => {
        setIsVoiceListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsVoiceListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [allArticles, router]);

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

  const startVoiceListening = () => {
    if (recognitionRef.current && !isVoiceListening) {
      recognitionRef.current.start();
      setIsVoiceListening(true);
      setVoiceTranscript("");
    }
  };

  const stopVoiceListening = () => {
    if (recognitionRef.current && isVoiceListening) {
      recognitionRef.current.stop();
      setIsVoiceListening(false);
      setVoiceTranscript("");
    }
  };

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
          <h1 className="max-w-xs text-4xl font-bold zen-title">給我背</h1>
          <p className="max-w-md text-lg leading-8 zen-subtle">Memorize Guru</p>
          {/* 全站統計已移至 「全站統計」 頁面 */}
        </div>

        {/* Search box and voice button */}
        <div className="w-full max-w-md mt-8 flex gap-3">
          <input
            type="text"
            placeholder="搜尋標題或作者..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-full border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
          />
          <button
            onClick={isVoiceListening ? stopVoiceListening : startVoiceListening}
            className={`px-4 py-3 rounded-full font-medium transition-colors ${
              isVoiceListening
                ? "bg-red-600 text-white hover:bg-red-700 animate-pulse"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
            title={isVoiceListening ? "停止語音" : "語音搜尋"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>

        {/* Voice transcript display */}
        {isVoiceListening && (
          <div className="w-full max-w-md mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {voiceTranscript || "請說出詩文標題..."}
            </p>
          </div>
        )}

        {/* Search results or link to All Poems */}
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
                  title={`${article.title}${article.author ? ` — ${article.author}` : ""}`}
                  aria-label={`${article.title}${article.author ? ` — ${article.author}` : ""}`}
                >
                  {article.title}{article.author ? ` - ${article.author}` : ""}
                </Link>
              ))
            )}
          </div>
        ) : (
          <div className="flex w-full max-w-md items-center gap-3 text-base font-medium flex-wrap justify-center" style={{ marginTop: "1cm" }}>
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
            <h1 className="max-w-xs text-4xl font-bold zen-title">給我背</h1>
            <p className="max-w-md text-lg leading-8 zen-subtle">不學詩，無以言</p>
          </div>
        </main>
      </div>
    }>
      <HomeContent categories={[]} />
    </Suspense>
  );
}
