import React from "react";
import Link from "next/link";
import { getArticlesByCategory } from "../../../../lib/articles-firebase";

type Props = { params: Promise<{ category: string }> };

export default async function CategoryPage({ params }: Props) {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  const articles = await getArticlesByCategory(category);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-serif dark:bg-black">
      <main className="w-full max-w-2xl rounded-lg zen-card p-12">
        <header className="mb-6 text-center">
          <h1 className="text-4xl zen-title">{category}</h1>
          <p className="mt-2 text-sm zen-subtle">請選擇詩名：</p>
        </header>

        <section className="space-y-3">
          {articles.length === 0 ? (
            <p className="text-center zen-subtle">此分類目前無文章。</p>
          ) : (
            articles.map((a) => (
              <div key={a.id} className="flex justify-center">
                <Link href={`/poem/${a.slug || a.id}`} className="zen-button inline-block">
                  {a.title}
                </Link>
              </div>
            ))
          )}
        </section>

        <footer className="mt-8 text-center">
          <a href="/poem" className="zen-ghost inline-block">回到詩頁</a>
        </footer>
      </main>
    </div>
  );
}
