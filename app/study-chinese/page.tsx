"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type StudyChineseRecord = {
  answered: number;
  correct: number;
  set: string;
  timestamp: string;
};

export default function StudyChinesePage() {
  const [tooltip, setTooltip] = useState("尚無作答紀錄");
  const [language, setLanguage] = useState("zh-TW");

  useEffect(() => {
    const syncLanguage = () => {
      const stored = localStorage.getItem("siteLanguage") || "zh-TW";
      setLanguage(stored);
    };

    syncLanguage();
    window.addEventListener("storage", syncLanguage);
    window.addEventListener("site-language-change", syncLanguage);
    return () => {
      window.removeEventListener("storage", syncLanguage);
      window.removeEventListener("site-language-change", syncLanguage);
    };
  }, []);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const records: StudyChineseRecord[] = data?.user?.studyChineseRecords || [];
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
        <h1 className="max-w-xs text-4xl font-bold zen-title">{language === "en" ? "Learn Chinese" : "Learn Chinese"}</h1>

        <div className="mt-8 w-full max-w-3xl">
          <div className="bookshelf-scroll">
            <div className="bookshelf-grid">
              <Link
                href="/study-chinese/1-20"
                title={tooltip}
                className="book-link"
              >
                1-20
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
