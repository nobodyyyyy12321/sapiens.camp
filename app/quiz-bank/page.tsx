"use client";

import Link from "next/link";

export default function QuizBankPage() {
  const subjects = [
    { name: "詩文背誦", href: "/recitation" },
    { name: "Learn Chinese", href: "/study-chinese" },
    { name: "名言佳句", href: "/quote" },
    { name: "數學", href: "/math" },
    { name: "交通", href: "/traffic" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black sm:items-start">
        <h1 className="max-w-xs text-4xl font-bold zen-title">題庫</h1>
        <p className="mt-4 text-sm zen-subtle">選擇想要的題庫</p>

        <div className="mt-8 flex flex-col gap-3 w-full max-w-md">
          {subjects.map((subject) => (
            <Link
              key={subject.name}
              href={subject.href}
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-200 px-6 text-foreground transition-colors hover:bg-zinc-100 whitespace-nowrap"
            >
              {subject.name}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
