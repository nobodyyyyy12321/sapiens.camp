"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type EnglishRecord = {
  answered: number;
  correct: number;
  set: string;
  timestamp: string;
};

export default function EnglishSetsPage() {
  const [latestBySet, setLatestBySet] = useState<Record<string, string>>({});

  // Generate 99 sets (1-20, 21-40, ... 1961-1980, 1981-1971)
  const sets = Array.from({ length: 99 }, (_, i) => {
    const start = i * 20 + 1;
    const end = Math.min((i + 1) * 20, 1971);
    return { start, end, label: `${start}-${end}` };
  });

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const records: EnglishRecord[] = data?.user?.englishRecords || [];
        if (!Array.isArray(records) || records.length === 0) {
          setLatestBySet({});
          return;
        }

        const bySet = new Map<string, EnglishRecord>();
        for (const r of records) {
          if (!r?.set) continue;
          const existing = bySet.get(r.set);
          if (!existing || new Date(r.timestamp).getTime() > new Date(existing.timestamp).getTime()) {
            bySet.set(r.set, r);
          }
        }

        const tooltipMap: Record<string, string> = {};
        bySet.forEach((r, set) => {
          const date = new Date(r.timestamp).toLocaleDateString("zh-TW", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
          tooltipMap[set] = `最近：${date}，寫 ${r.answered} 題，對 ${r.correct} 題`;
        });
        setLatestBySet(tooltipMap);
      })
      .catch(() => setLatestBySet({}));
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black sm:items-start">
        <h1 className="max-w-xs text-4xl font-bold zen-title">2000單字</h1>
        <p className="mt-4 text-sm zen-subtle">選擇想要的題組（共1971題）</p>

        <div className="mt-8 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {sets.map((set) => (
            <Link
              key={set.label}
              href={`/english/${set.label}`}
              title={latestBySet[set.label] || "尚無作答紀錄"}
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-200 px-6 text-foreground transition-colors hover:bg-zinc-100 whitespace-nowrap"
            >
              {set.label}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
