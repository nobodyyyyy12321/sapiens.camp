import React from "react";

export default function JingyeSiPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-serif dark:bg-black">
      <main className="w-full max-w-2xl rounded-lg zen-card p-12">
        <header className="mb-6 text-center">
          <h1 className="text-4xl zen-title">静夜思</h1>
          <p className="mt-2 text-sm zen-subtle">— 李白 (Li Bai)</p>
        </header>

        <article className="space-y-4 text-center text-2xl leading-loose">
          <p>床前明月光，</p>
          <p>疑是地上霜。</p>
          <p>舉頭望明月，</p>
          <p>低頭思故鄉。</p>
        </article>

        <section className="mt-8 text-center text-sm zen-subtle">
          <p>Translation (English):</p>
          <p className="mt-2">Moonlight before my bed — Is it frost on the ground?</p>
          <p>Looking up, I find the moon bright; Bowing, in homesickness I’m drowned.</p>
        </section>

        <footer className="mt-8 text-center">
          <a
            href="/poem"
            className="zen-ghost inline-block"
          >
            回到詩頁
          </a>
        </footer>
      </main>
    </div>
  );
}
