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
          <p className="max-w-md text-lg leading-8 zen-subtle">請選擇詩文</p>
        </div>

        <div className="flex w-full max-w-md items-center gap-3 text-base font-medium flex-wrap justify-center" style={{ marginTop: "1cm" }}>
          {articles.length === 0 ? (
            <p className="text-sm zen-subtle">目前無詩文</p>
          ) : (
            articles.map((a) => (
              <Link
                key={a.id}
                className="flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-200 px-6 text-foreground transition-colors hover:bg-zinc-100 whitespace-nowrap"
                href={`/${encodeURIComponent(category)}/${a.number}`}
              >
                {a.title}{a.author ? ` - ${a.author}` : ""}
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
