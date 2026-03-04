"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Question = {
  id: string;
  number: number;
  question: string;
  answer: string;
};

function parseRange(input: string): { start: number; end: number } | null {
  const match = input.match(/^(\d+)-(\d+)$/);
  if (!match) return null;
  const start = Number(match[1]);
  const end = Number(match[2]);
  if (!Number.isInteger(start) || !Number.isInteger(end) || start <= 0 || end <= start) return null;
  const validRanges = new Set([
    "1-100",
    "101-200",
    "201-300",
    "301-400",
    "401-500",
    "501-600",
    "601-662",
  ]);
  if (!validRanges.has(`${start}-${end}`)) return null;
  return { start, end };
}

export default function TrafficYesNoRangePage() {
  const { data: session } = useSession();
  const params = useParams();
  const rangeParam = String(params?.range || "");
  const parsedRange = useMemo(() => parseRange(rangeParam), [rangeParam]);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [recognizedToken, setRecognizedToken] = useState<string | null>(null);
  const recognizedTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!parsedRange) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("/api/traffic/questions")
      .then((res) => res.json())
      .then((data) => {
        const all: Question[] = Array.isArray(data?.questions) ? data.questions : [];
        const filtered = all
          .filter((q) => q.number >= parsedRange.start && q.number <= parsedRange.end)
          .sort((a, b) => a.number - b.number);
        setQuestions(filtered);
        setUserAnswers(new Array(filtered.length).fill(null));
        setCurrentIndex(0);
        setShowResults(false);
        setRecognizedToken(null);
      })
      .catch((err) => console.error("Failed to load questions:", err))
      .finally(() => setLoading(false));
  }, [parsedRange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (showResults || questions.length === 0) return;

      const k = e.key.toLowerCase();
      if (k === "y") {
        handleAnswer("是");
      }
      if (k === "n") {
        handleAnswer("否");
      }
      if (k === "enter" && userAnswers.every((a) => a !== null)) {
        checkAnswers();
      }
      if (k === "arrowleft") {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
      if (k === "arrowright") {
        setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, showResults, userAnswers, questions.length]);

  function handleAnswer(ans: string) {
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = ans;
    setUserAnswers(newAnswers);
    setRecognizedToken(ans);
    clearRecognizedLater();

    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 500);
    }
  }

  function clearRecognizedLater(ms = 300) {
    if (recognizedTimerRef.current) window.clearTimeout(recognizedTimerRef.current);
    recognizedTimerRef.current = window.setTimeout(() => setRecognizedToken(null), ms);
  }

  function checkAnswers() {
    setShowResults(true);

    if (session?.user?.email && parsedRange) {
      const answered = userAnswers.filter((ans) => ans !== null).length;
      const correct = userAnswers.filter((ans, idx) => ans === questions[idx]?.answer).length;

      fetch("/api/user/traffic/record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answered,
          correct,
          set: `yesno-${parsedRange.start}-${parsedRange.end}`,
        }),
      }).catch((err) => console.error("Failed to save traffic record:", err));
    }
  }

  function restart() {
    setUserAnswers(new Array(questions.length).fill(null));
    setCurrentIndex(0);
    setShowResults(false);
  }

  if (!parsedRange) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
        <main className="w-full max-w-2xl px-6 text-center">
          <p className="text-lg">無效的試卷範圍</p>
          <Link href="/traffic/yesno" className="inline-block mt-4 px-4 py-2 border rounded-full">返回試卷列表</Link>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>載入中...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
        <main className="w-full max-w-2xl px-6 text-center">
          <p className="text-lg">{parsedRange.start}-{parsedRange.end} 目前沒有題目</p>
          <Link href="/traffic/yesno" className="inline-block mt-4 px-4 py-2 border rounded-full">返回試卷列表</Link>
        </main>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answer = userAnswers[currentIndex];

  return (
    <div className="flex min-h-screen items-start justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-start justify-start py-8 px-16 bg-transparent dark:bg-black sm:items-start">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-3xl font-bold zen-title">汽車是非題 {parsedRange.start}-{parsedRange.end}</h1>
          {!showResults && (
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className={`px-4 py-2 border rounded-full bg-white text-black text-sm transition-opacity ${currentIndex === 0 ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}`}
              >
                ←
              </button>
              <button
                onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                disabled={currentIndex === questions.length - 1}
                className={`px-4 py-2 border rounded-full bg-white text-black text-sm transition-opacity ${currentIndex === questions.length - 1 ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}`}
              >
                →
              </button>
              <button
                onClick={checkAnswers}
                className="px-4 py-2 border rounded-full bg-white text-black text-sm cursor-pointer hover:opacity-90 transition-opacity"
              >
                交卷
              </button>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Link href="/traffic/yesno" className="text-sm zen-subtle hover:underline">← 返回試卷列表</Link>
        </div>

        {!showResults ? (
          <div className="mt-6 space-y-4 w-full">
            <div className="text-sm text-zinc-400">第 {currentQ.number} 題</div>

            <div className="p-6 border border-[1px] rounded text-lg">{currentQ.question}</div>

            <div className="flex items-center gap-3">
              <button
                className={`px-6 py-3 border border-[1px] rounded transition-transform duration-150 ${answer === "是" ? "border-black dark:border-zinc-200" : "border-zinc-400 dark:border-zinc-600"} ${recognizedToken === "是" ? "ring-2 ring-white scale-95" : ""}`}
                style={{ backgroundColor: "var(--zen-bg)", color: "var(--zen-ink)" }}
                onClick={() => handleAnswer("是")}
              >
                是 (Y)
              </button>
              <button
                className={`px-6 py-3 border border-[1px] rounded transition-transform duration-150 ${answer === "否" ? "border-black dark:border-zinc-200" : "border-zinc-400 dark:border-zinc-600"} ${recognizedToken === "否" ? "ring-2 ring-white scale-95" : ""}`}
                style={{ backgroundColor: "var(--zen-bg)", color: "var(--zen-ink)" }}
                onClick={() => handleAnswer("否")}
              >
                否 (N)
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4 w-full">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                寫 {userAnswers.filter((ans) => ans !== null).length} 題，對 {userAnswers.filter((ans, idx) => ans === questions[idx].answer).length} 題
              </div>
              <button onClick={restart} className="px-4 py-2 border rounded-full bg-white text-black text-sm">
                重新開始
              </button>
            </div>
            <h2 className="text-2xl font-bold mt-6">答題結果</h2>
            <div className="space-y-3">
              {questions.map((q, idx) => {
                const userAns = userAnswers[idx];
                if (userAns === null) return null;
                const correct = userAns === q.answer;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-lg border-2 ${
                      correct
                        ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                        : "border-red-500 bg-red-50 dark:bg-red-900/10"
                    }`}
                  >
                    <p className="font-medium mb-2">
                      第 {q.number} 題：{q.question}
                    </p>
                    <div className="text-sm space-y-1">
                      <p>
                        你的答案：
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                            correct
                              ? "bg-green-200 text-green-700 dark:bg-green-900/50 dark:text-green-400"
                              : "bg-red-200 text-red-700 dark:bg-red-900/50 dark:text-red-400"
                          }`}
                        >
                          {userAns}
                        </span>
                      </p>
                      {!correct && (
                        <p>
                          正確答案：
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-green-200 text-green-700 dark:bg-green-900/50 dark:text-green-400">
                            {q.answer}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
