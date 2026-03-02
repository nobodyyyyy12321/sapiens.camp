"use client";

import React, { useMemo, useState } from "react";
import studyChineseQuestions from "../../data/study-chinese.json";

type Question = {
  id: number;
  chinese: string;
  options: string[];
  answer: string;
};

const QUESTIONS: Question[] = studyChineseQuestions as Question[];

export default function StudyChineseSetPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(new Array(QUESTIONS.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = QUESTIONS[currentIndex];

  const answeredCount = useMemo(() => userAnswers.filter(Boolean).length, [userAnswers]);
  const correctCount = useMemo(
    () => QUESTIONS.filter((q, i) => userAnswers[i] === q.answer).length,
    [userAnswers]
  );

  const chooseAnswer = (answer: string) => {
    if (showResults) return;
    const next = [...userAnswers];
    next[currentIndex] = answer;
    setUserAnswers(next);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setUserAnswers(new Array(QUESTIONS.length).fill(null));
    setShowResults(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black sm:items-start">
        <h1 className="max-w-xs text-4xl font-bold zen-title">Learn Chinese</h1>
        <p className="mt-4 text-sm zen-subtle">20題四選一（中文 → 英文）</p>

        {!showResults ? (
          <div className="mt-8 w-full max-w-2xl">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm zen-subtle">
                第 {currentIndex + 1} 題 / {QUESTIONS.length}
              </p>
              <p className="text-sm zen-subtle">已作答：{answeredCount}</p>
            </div>

            <h2 className="mb-6 text-3xl font-bold">「{currentQuestion.chinese}」的英文是？</h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const labels = ["A", "B", "C", "D"];
                const selected = userAnswers[currentIndex] === option;
                return (
                  <button
                    key={option}
                    onClick={() => chooseAnswer(option)}
                    className={`w-full rounded-full border px-5 py-3 text-left transition-colors ${
                      selected
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-black"
                        : "border-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <span className="mr-2 font-semibold">{labels[idx]}.</span>
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="h-10 rounded-full border border-zinc-200 px-4 disabled:opacity-40"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentIndex(i => Math.min(QUESTIONS.length - 1, i + 1))}
                disabled={currentIndex === QUESTIONS.length - 1}
                className="h-10 rounded-full border border-zinc-200 px-4 disabled:opacity-40"
              >
                →
              </button>
              <button
                onClick={() => setShowResults(true)}
                className="h-10 rounded-full border border-zinc-200 px-5"
              >
                交卷
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 w-full max-w-2xl">
            <h2 className="mb-2 text-2xl font-bold">結果</h2>
            <p className="mb-5 zen-subtle">
              答對 {correctCount} / {QUESTIONS.length}
            </p>

            <div className="space-y-3">
              {QUESTIONS.map((q, i) => {
                const userAns = userAnswers[i];
                const isCorrect = userAns === q.answer;
                return (
                  <div key={q.id} className="rounded-xl border border-zinc-200 p-4">
                    <p className="font-semibold">
                      {q.id}. {q.chinese}
                    </p>
                    <p className="mt-1 text-sm">
                      你的答案：
                      <span className={`ml-1 ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                        {userAns ?? "未作答"}
                      </span>
                    </p>
                    {!isCorrect && <p className="text-sm text-green-700">正確答案：{q.answer}</p>}
                  </div>
                );
              })}
            </div>

            <button onClick={resetQuiz} className="mt-6 h-10 rounded-full border border-zinc-200 px-5">
              重新作答
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
