"use client";

import Link from "next/link";

export default function EnglishPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black text-center">
        <h1 className="max-w-xs text-4xl font-bold zen-title">英文</h1>
        <p className="mt-4 text-sm zen-subtle">選擇想要的題庫</p>

        <div className="mt-8 flex w-full max-w-md flex-col gap-3">
          <Link
            href="/english/2000"
            className="flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-200 px-6 text-foreground transition-colors hover:bg-zinc-100 whitespace-nowrap"
          >
            2000單字
          </Link>
        </div>
      </main>
    </div>
  );
}
