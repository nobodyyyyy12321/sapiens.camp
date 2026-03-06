"use client";

import Link from "next/link";

export default function TrafficPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black text-center">
        <h1 className="max-w-xs text-4xl font-bold zen-title">交通題庫</h1>
        <p className="mt-4 text-sm zen-subtle">選擇想要的題庫</p>

        <div className="mt-8 w-full max-w-3xl">
          <div className="bookshelf-scroll">
            <div className="bookshelf-grid">
              <Link href="/traffic/中華民國" className="book-link">
                中華民國
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
