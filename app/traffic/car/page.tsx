"use client";

import Link from "next/link";

export default function TrafficCarQuizPage() {
  const paperRanges = [
    { start: 1, end: 100 },
    { start: 101, end: 200 },
    { start: 201, end: 300 },
    { start: 301, end: 400 },
    { start: 401, end: 450 },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black sm:items-start">
        <h1 className="max-w-xs text-4xl font-bold zen-title">汽車選擇題</h1>
        <p className="mt-4 text-sm zen-subtle">選擇試卷</p>

        <div className="mt-8 flex flex-col gap-3 w-full max-w-md">
          {paperRanges.map((range) => (
            <Link
              key={`${range.start}-${range.end}`}
              href={`/traffic/car/${range.start}-${range.end}`}
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-200 px-6 text-foreground transition-colors hover:bg-zinc-100 whitespace-nowrap"
            >
              {range.start}-{range.end}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
