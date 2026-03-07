"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SavedBook = {
  title: string;
  href: string;
  addedAt: string;
};

const STORAGE_KEY = "my-bookshelf-links";

export default function ListsPage() {
  const [items, setItems] = useState<SavedBook[]>([]);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed: SavedBook[] = raw ? JSON.parse(raw) : [];
        setItems(Array.isArray(parsed) ? parsed : []);
      } catch {
        setItems([]);
      }
    };

    load();
    window.addEventListener("my-bookshelf-updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("my-bookshelf-updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const removeItem = (href: string) => {
    const next = items.filter((item) => item.href !== href);
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("my-bookshelf-updated"));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="w-full max-w-3xl py-12 px-16 text-center">
        <h1 className="text-3xl font-bold zen-title mb-2">我的書櫃</h1>
        <p className="text-sm zen-subtle mb-8">在題庫按鈕上按右鍵可加入我的書櫃</p>

        {items.length === 0 ? (
          <p className="text-sm zen-subtle">目前尚未收藏項目</p>
        ) : (
          <div className="bookshelf-scroll">
            <div className="bookshelf-grid">
              {items.map((item) => (
                <div key={item.href} className="relative group">
                  <Link href={item.href} className="book-link">
                    {item.title}
                  </Link>
                  <button
                    onClick={() => removeItem(item.href)}
                    className="absolute -top-2 -right-2 hidden group-hover:flex items-center justify-center h-6 w-6 rounded-full border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-xs"
                    title="移除"
                    aria-label="移除"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
