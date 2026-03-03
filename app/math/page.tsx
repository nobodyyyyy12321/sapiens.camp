"use client";

import Link from "next/link";

export default function MathIndex() {
  const mathTopics = [
    { name: "算數" },
    { name: "代數" },
    { name: "幾何" },
    { name: "三角函數" },
    { name: "指數與複數" },
    { name: "解析幾何" },
    { name: "統計" },
    { name: "排列組合" },
    { name: "微積分" },
    { name: "微分方程" },
    { name: "線性代數" },
    { name: "複變函數" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black sm:items-start">
        <h1 className="max-w-xs text-4xl font-bold zen-title">數學題庫</h1>
        <p className="mt-4 text-sm zen-subtle">選擇數學主題開始練習</p>
        
        <div className="mt-8 flex w-full max-w-md flex-col gap-3">
          {mathTopics.map((topic) => (
            <Link
              key={topic.name}
              href="/under-construction"
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-200 px-6 text-foreground transition-colors hover:bg-zinc-100 whitespace-nowrap"
            >
              {topic.name}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
