"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type QuoteRecord = {
  answered: number;
  correct: number;
  set: string;
  timestamp: string;
};

export default function QuoteSetsPage() {
  const [tooltip, setTooltip] = useState("尚無作答紀錄");

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const records: QuoteRecord[] = data?.user?.quoteRecords || [];
        const setRecords = records.filter((r) => r?.set === "1-20");
        if (setRecords.length === 0) {
          setTooltip("尚無作答紀錄");
          return;
        }
        const latest = setRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
        const date = new Date(latest.timestamp).toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        setTooltip(`最近：${date}，${latest.correct}/${latest.answered}`);
      })
      .catch(() => setTooltip("尚無作答紀錄"));
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black text-center">
        <h1 className="max-w-xs text-4xl font-bold zen-title">名言佳句</h1>
        <p className="mt-4 text-sm zen-subtle">選擇想要的題庫</p>

        <div className="mt-8 flex w-full max-w-md flex-col gap-3">
          <Link
            href="/quote/1-20"
            title={tooltip}
            className="flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-200 px-6 text-foreground transition-colors hover:bg-zinc-100 whitespace-nowrap"
          >
            1-20
          </Link>
        </div>
      </main>
    </div>
  );
}
