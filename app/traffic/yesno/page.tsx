"use client";

import Link from "next/link";

export default function TrafficYesNoPage() {
  const paperRanges = [
    { start: 1, end: 100 },
    { start: 101, end: 200 },
    { start: 201, end: 300 },
    { start: 301, end: 400 },
    { start: 401, end: 500 },
    { start: 501, end: 600 },
    { start: 601, end: 662 },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black sm:items-start">
        <h1 className="max-w-xs text-4xl font-bold zen-title">汽車是非題</h1>

        <div className="mt-8 w-full max-w-3xl">
          <div className="bookshelf-scroll">
            <div className="bookshelf-grid">
              {paperRanges.map((range) => (
                <Link
                  key={`${range.start}-${range.end}`}
                  href={`/traffic/yesno/${range.start}-${range.end}`}
                  className="book-link"
                >
                  {range.start}-{range.end}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
