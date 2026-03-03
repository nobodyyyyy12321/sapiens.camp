"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function SiteStatsPage() {
  const [loading, setLoading] = useState(true);
  const [totalAttempts, setTotalAttempts] = useState<number | null>(null);
  const [totalSuccesses, setTotalSuccesses] = useState<number | null>(null);
  const [visits, setVisits] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<any[] | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
        fetch("/api/stats?records=1")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (data && data.success) {
          setTotalAttempts(Number(data.totalAttempts || 0));
          setTotalSuccesses(Number(data.totalSuccesses || 0));
              setVisits(Number(data.visits || 0));
          setRecords(Array.isArray(data.records) ? data.records : []);
        } else {
          setError("無法取得統計資料");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch stats:", err);
        if (mounted) setError("無法取得統計資料");
      })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex min-h-screen items-start justify-center bg-transparent font-sans dark:bg-black">
      <main className="w-full max-w-3xl py-12 px-16">
        <h1 className="text-3xl font-bold zen-title mb-2">全站統計</h1>

        {loading ? (
          <p className="text-sm zen-subtle">載入中統計資料…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div>
            <div className="w-full flex items-center justify-center mb-4">
              <p className="text-base zen-subtle">全站累計：造訪 {visits} 次</p>
            </div>

            <div className="w-full">
              <h2 className="text-lg font-medium mb-2">最近 10 筆嘗試紀錄</h2>
              {records && records.length > 0 ? (
                <div className="space-y-2">
                  {records.slice(0, 10).map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex-1">
                        <div className="font-medium">{r.title || "(無標題)"}</div>
                        <div className="text-sm zen-subtle">
                          {r.userName ? (
                            <Link href={`/account/${encodeURIComponent(r.userName)}/record`} className="text-zen-link hover:underline">
                              {r.userName}
                            </Link>
                          ) : (
                            "匿名"
                          )}
                        </div>
                      </div>
                      <div className="w-56 text-right text-sm">
                        <div>{new Date(r.timestamp || r.createdAt).toLocaleDateString("zh-TW", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}</div>
                        <div className="mt-1 zen-subtle">
                          {r.type === 'quiz' 
                            ? `${r.correct}/${r.answered}`
                            : (r.success ? "成功" : "失敗")
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm zen-subtle">目前沒有嘗試紀錄</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
