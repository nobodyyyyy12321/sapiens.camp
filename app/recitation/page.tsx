"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RecitationPage() {
  const [items, setItems] = useState<string[] | null>(null);
  const [languages, setLanguages] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"languages" | "categories">("languages");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [allArticles, setAllArticles] = useState<any[]>([]);

  const recognitionRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/categories")
      .then((res) => res.json())
      .then(async (data) => {
        if (!mounted) return;
        const fetchedLanguages: string[] = data.languages || [];
        setLanguages(fetchedLanguages);

        const defaultChineseLanguage = fetchedLanguages.find((lang) =>
          /(中文|chinese|華語|国语|國語)/i.test(lang)
        );

        if (defaultChineseLanguage) {
          setSelectedLanguage(defaultChineseLanguage);
          setView("categories");
          try {
            const categoryRes = await fetch(`/api/categories?language=${encodeURIComponent(defaultChineseLanguage)}`);
            const categoryData = await categoryRes.json();
            if (!mounted) return;
            setItems(categoryData.categories || []);
          } catch (err) {
            console.error("Failed to fetch categories for default language:", err);
            if (mounted) setError("無法載入分類");
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch languages:", err);
        if (mounted) setError("無法載入語言清單");
      })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    // Fetch all articles for voice matching
    fetch("/api/search?q=")
      .then((res) => res.json())
      .then((data) => setAllArticles(data.articles || []))
      .catch((err) => console.error("Failed to fetch articles:", err));
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
          const normalizeText = (text: string) => text.replace(/[[\s，。、；：！？""''（）《》]/g, "");
          const normalizedTranscript = normalizeText(transcript);

          const match = allArticles.find((article) => {
            if (!article.title) return false;
            const normalizedTitle = normalizeText(article.title);
            return (
              normalizedTranscript.includes(normalizedTitle) ||
              normalizedTitle.includes(normalizedTranscript)
            );
          });

          if (match) {
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

  async function openLanguage(lang: string) {
    setSelectedLanguage(lang);
    setView("categories");
    setLoading(true);
    try {
      const res = await fetch(`/api/categories?language=${encodeURIComponent(lang)}`);
      const data = await res.json();
      setItems(data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories for language:", err);
      setError("無法載入分類");
    } finally {
      setLoading(false);
    }
  }

  const hideSearchForChinese =
    view === "categories" &&
    !!selectedLanguage &&
    /(中文|chinese|華語|國語)/i.test(selectedLanguage);

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black text-center">
        {view === "languages" && (
          <h1 className="max-w-xs text-4xl font-bold zen-title mb-3">詩文背誦</h1>
        )}

        {!hideSearchForChinese && (
          <>
            {/* Search box and voice button (copied from homepage) */}
            <div className="w-full max-w-md mt-6 flex gap-3">
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

            {/* Inline search results */}
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
                      {article.number ? `${article.number} · ` : ""}{article.title}{article.author ? ` - ${article.author}` : ""}
                    </Link>
                  ))
                )}
              </div>
            ) : (
              <div className="flex w-full max-w-md items-center gap-3 text-base font-medium flex-wrap justify-center" style={{ marginTop: "1cm" }}>
              </div>
            )}
          </>
        )}

        {loading ? (
          <p className="text-sm zen-subtle">載入中…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div className="w-full max-w-3xl" style={{ marginTop: "1cm" }}>
            {view === "languages" ? (
              (languages && languages.length > 0) ? (
                <div className="bookshelf-scroll">
                  <div className="bookshelf-grid">
                    {languages
                      .filter((lang) => !/(中文|chinese|華語|国语|國語)/i.test(lang))
                      .map((lang) => (
                        <button
                          key={lang}
                          onClick={() => openLanguage(lang)}
                          className="book-link"
                        >
                          {lang}
                        </button>
                      ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm zen-subtle">目前沒有語言</p>
              )
            ) : (
              <div>
                {(items && items.length > 0) ? (
                  <div className="bookshelf-scroll">
                    <div className="bookshelf-grid">
                    {items.map((c) => (
                      <Link
                        key={c}
                        href={`/${encodeURIComponent(c)}`}
                        className="book-link"
                      >
                        {c}
                      </Link>
                    ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm zen-subtle">目前沒有分類</p>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
