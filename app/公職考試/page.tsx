"use client";

import Link from "next/link";

export default function PublicExamPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black text-center">
        <h1 className="max-w-xs text-4xl font-bold zen-title">公職考試</h1>

        <div className="mt-8 w-full max-w-3xl">
          <div className="bookshelf-scroll">
            <div className="bookshelf-grid">
              <Link href="/under-construction" className="book-link">
                台電
              </Link>
              <Link href="/under-construction" className="book-link">
                台水
              </Link>
              <Link href="/under-construction" className="book-link">
                中油
              </Link>
              <Link href="/under-construction" className="book-link">
                高普考
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
