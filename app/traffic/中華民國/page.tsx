"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TrafficRecord = {
  answered: number;
  correct: number;
  set: string;
  timestamp: string;
};

export default function TrafficRegionPage() {
  const [yesNoTooltip, setYesNoTooltip] = useState("尚無作答紀錄");
  const [carQuizTooltip, setCarQuizTooltip] = useState("尚無作答紀錄");

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const records: TrafficRecord[] = data?.user?.trafficRecords || [];
        const latestDateText = (record: TrafficRecord) => {
          const date = new Date(record.timestamp).toLocaleDateString("zh-TW", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
          return `最近：${date}，${record.correct}/${record.answered}`;
        };

        const yesNoRecords = records.filter((r) => typeof r?.set === "string" && r.set.startsWith("yesno"));
        if (yesNoRecords.length > 0) {
          const latestYesNo = yesNoRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
          setYesNoTooltip(latestDateText(latestYesNo));
        } else {
          setYesNoTooltip("尚無作答紀錄");
        }

        const carRecords = records.filter((r) => typeof r?.set === "string" && r.set.startsWith("car"));
        if (carRecords.length > 0) {
          const latestCar = carRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
          setCarQuizTooltip(latestDateText(latestCar));
        } else {
          setCarQuizTooltip("尚無作答紀錄");
        }
      })
      .catch(() => {
        setYesNoTooltip("尚無作答紀錄");
        setCarQuizTooltip("尚無作答紀錄");
      });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black sm:items-start">
        <h1 className="max-w-xs text-4xl font-bold zen-title">中華民國</h1>

        <div className="mt-8 w-full max-w-3xl">
          <div className="bookshelf-scroll">
            <div className="bookshelf-grid">
              <Link href="/traffic/yesno" title={yesNoTooltip} className="book-link">
                汽車是非題
              </Link>
              <Link href="/traffic/car" title={carQuizTooltip} className="book-link">
                汽車選擇題
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
