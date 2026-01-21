"use client";

import Link from "next/link";

export default function XueCePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black sm:items-start">
        <h1 className="max-w-xs text-4xl font-bold zen-title">學測題庫</h1>
        <p className="mt-4 text-sm zen-subtle">這裡放學測題目與練習。</p>

        <div className="mt-8 w-full max-w-md">
          <div className="flex gap-3">
            <Link href="/math" className="inline-block px-4 py-2 rounded-md bg-zinc-100 hover:bg-zinc-200">返回 數學題庫</Link>
            <Link href="/math/學測/114" className="inline-block px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">114</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
