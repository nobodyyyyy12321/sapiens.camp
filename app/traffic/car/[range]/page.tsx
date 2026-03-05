"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Option = {
  label: string;
  text: string;
};

type Question = {
  id: string;
  number: number;
  title: string;
  options: Option[];
  answer: string;
};

function parseRange(input: string): { start: number; end: number } | null {
  const match = input.match(/^(\d+)-(\d+)$/);
  if (!match) return null;
  const start = Number(match[1]);
  const end = Number(match[2]);
  if (!Number.isInteger(start) || !Number.isInteger(end) || start <= 0 || end <= start) return null;

  const validRanges = new Set(["1-100", "101-200", "201-300", "301-400", "401-450"]);
  if (!validRanges.has(`${start}-${end}`)) return null;

  return { start, end };
}

export default function TrafficCarRangePage() {
  const { data: session } = useSession();
  const params = useParams();
  const rangeParam = String(params?.range || "");
  const parsedRange = useMemo(() => parseRange(rangeParam), [rangeParam]);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!parsedRange) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("/api/traffic/car/questions")
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
      })
      .catch((err) => console.error("Failed to load car quiz questions:", err))
      .finally(() => setLoading(false));
  }, [parsedRange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (showResults || questions.length === 0) return;

      const k = e.key.toUpperCase();
      if (["A", "B", "C", "D", "E", "F"].includes(k)) {
        handleAnswer(k);
      }
      if (k === "ENTER") {
        checkAnswers();
      }
      if (k === "ARROWLEFT") {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
      if (k === "ARROWRIGHT") {
        setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showResults, currentIndex, questions.length]);

  const handleAnswer = (answer: string) => {
    if (showResults) return;
    const next = [...userAnswers];
    next[currentIndex] = answer;
    setUserAnswers(next);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const checkAnswers = () => {
    setShowResults(true);

    if (session?.user?.email && parsedRange) {
      const answered = userAnswers.filter((a) => a !== null).length;
      const correct = userAnswers.filter((answer, idx) => answer === questions[idx]?.answer).length;

      fetch("/api/user/traffic/record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answered,
          correct,
          set: `car-${parsedRange.start}-${parsedRange.end}`,
        }),
      }).catch((err) => console.error("Failed to save traffic record:", err));
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setUserAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
  };

  if (!parsedRange) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
        <main className="w-full max-w-2xl px-6 text-center">
          <p className="text-lg">無效的試卷範圍</p>
          <Link href="/traffic/car" className="inline-block mt-4 px-4 py-2 border rounded-full">返回試卷列表</Link>
        </main>
      </div>
    );
  }

  const answeredCount = userAnswers.filter((a) => a !== null).length;
  const correctCount = userAnswers.filter((answer, idx) => answer === questions[idx]?.answer).length;
  const currentQuestion = questions[currentIndex];

  return (
    <div className="flex min-h-screen items-start justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-start justify-start py-8 px-16 bg-transparent dark:bg-black sm:items-start">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-3xl font-bold zen-title">汽車選擇題 {parsedRange.start}-{parsedRange.end}</h1>
          {!showResults && !loading && questions.length > 0 && (
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
          <Link href="/traffic/car" className="text-sm zen-subtle hover:underline">← 返回試卷列表</Link>
        </div>

        {loading && <p className="mt-6 text-sm zen-subtle">載入中...</p>}
        {!loading && questions.length === 0 && (
          <p className="mt-6 text-sm text-red-600">{parsedRange.start}-{parsedRange.end} 目前沒有題目</p>
        )}

        {!loading && questions.length > 0 && !showResults ? (
          <div className="mt-6 space-y-4 w-full">
            <div className="text-sm text-zinc-400">第 {currentQuestion.number} 題</div>

            <div className="p-6 border border-[1px] rounded text-lg">{currentQuestion.title}</div>

            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleAnswer(option.label)}
                  className={`px-6 py-3 border border-[1px] rounded text-left transition-colors ${
                    userAnswers[currentIndex] === option.label
                      ? "border-black dark:border-zinc-200"
                      : "border-zinc-400 dark:border-zinc-600"
                  }`}
                  style={{ backgroundColor: "var(--zen-bg)", color: "var(--zen-ink)" }}
                >
                  <span className="font-semibold">{option.label}</span> {option.text}
                </button>
              ))}
            </div>
          </div>
        ) : !loading && questions.length > 0 ? (
          <div className="mt-6 space-y-4 w-full">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">寫 {correctCount}/{answeredCount}</div>
              <button
                onClick={resetQuiz}
                className="px-4 py-2 border rounded-full bg-white text-black dark:bg-white dark:text-black text-sm"
              >
                重新開始
              </button>
            </div>
            <h2 className="text-2xl font-bold mt-6">答題結果</h2>
            <div className="space-y-3">
              {questions.map((question, idx) => {
                const userAns = userAnswers[idx];
                if (userAns === null) return null;

                const isCorrect = userAns === question.answer;
                const userOption = question.options.find((opt) => opt.label === userAns);
                const correctOption = question.options.find((opt) => opt.label === question.answer);

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-2 ${
                      isCorrect
                        ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                        : "border-red-500 bg-red-50 dark:bg-red-900/10"
                    }`}
                  >
                    <p className="font-medium mb-2">第 {question.number} 題：{question.title}</p>
                    <div className="text-sm space-y-1">
                      <p>
                        你的答案：
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                            isCorrect
                              ? "bg-green-200 text-green-700 dark:bg-green-900/50 dark:text-green-400"
                              : "bg-red-200 text-red-700 dark:bg-red-900/50 dark:text-red-400"
                          }`}
                        >
                          {userAns} {userOption?.text}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p>
                          正確答案：
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-green-200 text-green-700 dark:bg-green-900/50 dark:text-green-400">
                            {question.answer} {correctOption?.text}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
