import React from "react";

export default function PoemPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-serif dark:bg-black">
      <main className="w-full max-w-2xl rounded-lg bg-white p-12 shadow-md dark:bg-[#0b0b0b]">
        <header className="mb-8 text-center">
          <h1 className="text-4xl zen-title">唐詩</h1>
          <p className="mt-2 text-sm zen-subtle">請選擇一首詩：</p>
        </header>

        <footer className="mt-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between">
          <div>
            <a
              href="/poem/jingye-si"
              className="zen-button inline-block"
            >
              靜夜思
            </a>
          </div>

          <div>
            <a
              href="/"
              className="zen-ghost inline-block"
            >
              返回首頁
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
