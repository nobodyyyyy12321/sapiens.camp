import React from "react";
import { getArticleBySlug } from "../../../lib/articles-firebase";

type Props = { params: Promise<{ slug: string }> };

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-serif dark:bg-black">
        <main className="w-full max-w-2xl rounded-lg zen-card p-12">
          <header className="mb-6 text-center">
            <h1 className="text-4xl zen-title">找不到文章</h1>
            <p className="mt-2 text-sm zen-subtle">找不到 slug 為「{slug}」的文章，請確認 Firestore `articles` 是否存在該文件。</p>
          </header>
        </main>
      </div>
    );
  }

  const lines: string[] = Array.isArray(article.content)
    ? (article.content as string[])
    : String(article.content || "").split(/\r?\n/).filter(Boolean);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-serif dark:bg-black">
      <main className="w-full max-w-2xl rounded-lg zen-card p-12">
        <header className="mb-6 text-center">
          <h1 className="text-4xl zen-title">{article.title}</h1>
          {article.author && <p className="mt-2 text-sm zen-subtle">— {article.author}</p>}
        </header>

        <article className="space-y-4 text-center text-2xl leading-loose">
          {lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </article>
      </main>
    </div>
  );
}
