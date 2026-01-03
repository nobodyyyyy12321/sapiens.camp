"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function AllPoemsPage() {
  const [items, setItems] = useState<string[] | null>(null);
  const [languages, setLanguages] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"languages" | "categories">("languages");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setLanguages(data.languages || []);
      })
      .catch((err) => {
        console.error("Failed to fetch languages:", err);
        if (mounted) setError("無法載入語言清單");
      })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, []);

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black sm:items-start">
        <h1 className="max-w-xs text-4xl font-bold zen-title mb-3">所有詩文</h1>

        {loading ? (
          <p className="text-sm zen-subtle">載入中…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div className="w-full max-w-3xl" style={{ marginTop: "1cm" }}>
            {view === "languages" ? (
              (languages && languages.length > 0) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => openLanguage(lang)}
                      className="flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-200 px-6 text-foreground transition-colors hover:bg-zinc-100 whitespace-nowrap"
                    >
                      <span className="truncate">{lang}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm zen-subtle">目前沒有語言</p>
              )
            ) : (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <button onClick={() => { setView("languages"); setItems(null); setSelectedLanguage(null); }} className="px-4 py-2 rounded-full border">← 語言</button>
                  <h2 className="text-lg font-medium">{selectedLanguage} 的分類</h2>
                </div>
                {(items && items.length > 0) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {items.map((c) => (
                      <Link
                        key={c}
                        href={`/${encodeURIComponent(c)}`}
                        className="flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-200 px-6 text-foreground transition-colors hover:bg-zinc-100 whitespace-nowrap"
                      >
                        <span className="truncate">{c}</span>
                      </Link>
                    ))}
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
