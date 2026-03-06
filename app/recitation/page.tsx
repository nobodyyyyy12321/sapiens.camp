"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RecitationPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        const langRes = await fetch("/api/categories");
        const langData = await langRes.json();
        const languages: string[] = langData?.languages || [];

        const chineseLanguage =
          languages.find((lang) => /(中文|chinese|華語|国语|國語)/i.test(lang)) ||
          languages[0];

        if (!chineseLanguage) {
          if (mounted) setCategories([]);
          return;
        }

        const categoryRes = await fetch(`/api/categories?language=${encodeURIComponent(chineseLanguage)}`);
        const categoryData = await categoryRes.json();

        if (!mounted) return;
        setCategories(Array.isArray(categoryData?.categories) ? categoryData.categories : []);
      } catch (e) {
        if (mounted) setError("無法載入分類");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black text-center">
        <h1 className="max-w-xs text-4xl font-bold zen-title">詩文背誦</h1>

        <div className="mt-8 w-full max-w-3xl">
          {loading ? (
            <p className="text-sm zen-subtle">載入中…</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : categories.length === 0 ? (
            <p className="text-sm zen-subtle">目前沒有分類</p>
          ) : (
            <div className="bookshelf-scroll">
              <div className="bookshelf-grid">
                {categories.map((category) => (
                  <Link key={category} href={`/${encodeURIComponent(category)}`} className="book-link">
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
