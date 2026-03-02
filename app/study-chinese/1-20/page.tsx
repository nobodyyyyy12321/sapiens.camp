"use client";

import React, { useEffect, useState } from "react";

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

type RawQuestion = {
  id?: string | number;
  number?: number;
  title?: string;
  chinese?: string;
  options: Array<string | Option>;
  answer: string;
};

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function StudyChineseSetPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/study-chinese/questions")
      .then((res) => res.json())
      .then((data) => {
        if (data.questions) {
          const normalizedQuestions: Question[] = (data.questions as RawQuestion[]).map((q, idx) => {
            const normalizedOptions: Option[] = (q.options || []).map((opt, optionIndex) => {
              if (typeof opt === "string") {
                return { label: OPTION_LABELS[optionIndex] ?? String(optionIndex + 1), text: opt };
              }
              return opt;
            });

            const answerLabel =
              normalizedOptions.find((opt) => opt.label === q.answer)?.label ||
              normalizedOptions.find((opt) => opt.text === q.answer)?.label ||
              q.answer;

            return {
              id: String(q.id ?? idx + 1),
              number: q.number ?? idx + 1,
              title: q.title ?? q.chinese ?? "",
              options: normalizedOptions,
              answer: answerLabel,
            };
          });

          setQuestions(normalizedQuestions);
          setUserAnswers(new Array(normalizedQuestions.length).fill(null));
        }
      })
      .catch((err) => console.error("Failed to load study-chinese questions:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (showResults || questions.length === 0) return;

      const k = e.key.toUpperCase();
      if (["A", "B", "C", "D"].includes(k)) {
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

  const currentQuestion = questions[currentIndex];

  const answeredCount = userAnswers.filter((a) => a !== null).length;
  const correctCount = userAnswers.filter((answer, idx) => answer === questions[idx]?.answer).length;

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
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setUserAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-start justify-start py-8 px-16 bg-transparent dark:bg-black sm:items-start">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-3xl font-bold zen-title">Learn Chinese</h1>
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

        {loading && <p className="mt-6 text-sm zen-subtle">載入中...</p>}
        {!loading && questions.length === 0 && <p className="mt-6 text-sm text-red-600">沒有題目可顯示</p>}

        {!loading && questions.length > 0 && !showResults ? (
          <div className="mt-6 space-y-4 w-full">
            <div className="text-sm text-zinc-400">第 {currentIndex + 1} 題</div>

            <div className="p-6 border rounded text-lg">{currentQuestion.title}</div>

            <div className="flex gap-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleAnswer(option.label)}
                  className={`flex-1 px-6 py-3 border rounded transition-colors ${
                    userAnswers[currentIndex] === option.label
                      ? "bg-white text-black border-black"
                      : "bg-black text-white border-white"
                  }`}
                >
                  <span className="font-semibold">{option.label}</span> {option.text}
                </button>
              ))}
            </div>
          </div>
        ) : !loading && questions.length > 0 ? (
          <div className="mt-6 space-y-4 w-full">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">寫 {answeredCount} 題，對 {correctCount} 題</div>
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
                    key={idx}
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
