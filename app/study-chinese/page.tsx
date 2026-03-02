"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Article = {
  id: string;
  number: number;
  title: string;
  category: string;
  author: string;
  language: string;
};

export default function StudyChinesePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories?language=中文")
      .then(res => res.json())
      .then(data => {
        if (data.categories) {
          setCategories(data.categories);
        }
      })
      .catch(err => console.error("Failed to load categories:", err));
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setArticles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/articles?category=${encodeURIComponent(selectedCategory)}&language=中文`)
      .then(res => res.json())
      .then(data => {
        if (data.articles) {
          setArticles(data.articles);
        }
      })
      .catch(err => console.error("Failed to load articles:", err))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div className="flex min-h-screen items-start justify-center bg-transparent font-sans dark:bg-black">
      <main className="w-full max-w-3xl py-12 px-16">
        <h1 className="text-3xl font-bold zen-title mb-4">學中文</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">選擇想要學習的類別</p>

        <div className="space-y-4 mt-8">
          {categories.length === 0 ? (
            <p className="text-zinc-400">載入中...</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-4 rounded border transition-colors ${
                      selectedCategory === cat
                        ? "bg-white text-black border-black dark:bg-zinc-800 dark:text-white dark:border-white"
                        : "bg-black text-white border-white dark:bg-zinc-900 dark:border-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {selectedCategory && (
                <div className="mt-8 space-y-3">
                  <h2 className="text-xl font-bold">{selectedCategory}</h2>
                  {loading ? (
                    <p className="text-zinc-400">載入中...</p>
                  ) : articles.length === 0 ? (
                    <p className="text-zinc-400">沒有找到文章</p>
                  ) : (
                    <div className="grid gap-2">
                      {articles.map(article => (
                        <Link
                          key={article.id}
                          href={`/${encodeURIComponent(article.category)}/${article.number}`}
                          className="p-4 border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <div className="font-medium">{article.title}</div>
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">作者：{article.author}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
