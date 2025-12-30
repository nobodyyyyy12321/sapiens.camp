import React from "react";
import Link from "next/link";
import { getArticles } from "../../lib/articles-firebase";

export default async function PoemPage() {
  const articles = await getArticles({ type: "poem" });

  // Sort by number (ascending)
  articles.sort((a, b) => (a.number || 0) - (b.number || 0));

  // collect unique categories (use category field, fallback to type)
  const categories = Array.from(
    new Set(articles.map((a) => a.category || a.type || "uncategorized"))
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-serif dark:bg-black">
      <main className="w-full max-w-2xl rounded-lg bg-white p-12 shadow-md dark:bg-[#0b0b0b]">
        <header className="mb-8 text-center">
          <h1 className="text-4xl zen-title">唐詩</h1>
          <p className="mt-2 text-sm zen-subtle">請選擇詩文：</p>
        </header>

        <section className="space-y-3">
          {articles.length === 0 ? (
            <p className="text-center zen-subtle">目前無詩文（請確認 Firestore articles collection）</p>
          ) : (
            articles.map((a) => (
              <div key={a.id} className="flex justify-center">
                <Link href={`/poem/${a.number}`} className="zen-button inline-block">
                  {a.title}
                </Link>
              </div>
            ))
          )}
        </section>

      </main>
    </div>
  );
}
