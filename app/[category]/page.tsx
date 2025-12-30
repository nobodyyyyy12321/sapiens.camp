import React from "react";
import Link from "next/link";
import { getArticlesByCategory } from "../../lib/articles-firebase";

type Props = { params: Promise<{ category: string }> };

export default async function CategoryPage({ params }: Props) {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  const articles = await getArticlesByCategory(category);

  // Sort by number (ascending)
  articles.sort((a, b) => (a.number || 0) - (b.number || 0));

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-4xl font-bold zen-title">{category}</h1>
        </div>

        <div className="w-full max-w-3xl" style={{ marginTop: "1cm" }}>
          {articles.length === 0 ? (
            <p className="text-sm zen-subtle text-center">目前無詩文</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {articles.map((a) => (
                <Link
                  key={a.id}
                  className="flex h-12 items-center justify-center rounded-full border border-zinc-200 px-6 text-foreground transition-colors hover:bg-zinc-100"
                  href={`/${encodeURIComponent(category)}/${a.number}`}
                >
                  <span className="truncate">{a.title}{a.author ? ` - ${a.author}` : ""}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
