"use client";

import React, { useEffect, useRef, useState } from "react";

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

export default function WisdomPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetch("/api/wisdom/questions")
      .then(res => res.json())
      .then(data => {
        if (data.questions) {
          setQuestions(data.questions);
          setUserAnswers(new Array(data.questions.length).fill(null));
        }
      })
      .catch(err => console.error("Failed to load questions:", err));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (showResults) return;

      const k = e.key.toUpperCase();
      if (["A", "B", "C", "D"].includes(k)) {
        handleAnswer(k);
      }
      if (k === "ENTER") {
        checkAnswers();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showResults, userAnswers, currentIndex, questions.length]);

  const handleAnswer = (answer: string) => {
    if (currentIndex < questions.length) {
      const newAnswers = [...userAnswers];
      newAnswers[currentIndex] = answer;
      setUserAnswers(newAnswers);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setShowResults(false);
    setCurrentIndex(0);
    setUserAnswers(new Array(questions.length).fill(null));
  };

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent dark:bg-black">
        <main className="w-full max-w-2xl p-8 text-center">
          <p className="text-sm zen-subtle">載入中...</p>
        </main>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = userAnswers.filter(a => a !== null).length;
  const correctCount = userAnswers.filter((answer, idx) => answer === questions[idx]?.answer).length;

  return (
    <div className="flex min-h-screen items-start justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-start justify-start py-8 px-16 bg-transparent dark:bg-black sm:items-start">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-3xl font-bold zen-title">名言佳句</h1>
          {!showResults && (
            <button
              onClick={checkAnswers}
              className="px-4 py-2 border rounded-full bg-white text-black dark:bg-white dark:text-black text-sm"
            >
              交卷
            </button>
          )}
        </div>

        {!showResults ? (
          <div className="mt-6 space-y-4 w-full">
            <div className="text-sm text-zinc-400">
              第 {currentIndex + 1} 題
            </div>

            <div className="p-6 border rounded text-lg">
              {currentQuestion.title}
            </div>
                
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

            <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className={`px-4 py-2 border rounded zen-button ${currentIndex === 0 ? "opacity-0 pointer-events-none" : ""}`}
                >
                  上一題
                </button>
                <button
                  onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                  disabled={currentIndex === questions.length - 1}
                  className={`px-4 py-2 border rounded zen-button ${currentIndex === questions.length - 1 ? "opacity-0 pointer-events-none" : ""}`}
                >
                  下一題
                </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4 w-full">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                寫 {answeredCount} 題，對 {correctCount} 題
              </div>
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
                      <p>你的答案：<span className={isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}>
                        {userAns}
                      </span></p>
                      {!isCorrect && (
                        <p>正確答案：<span className="text-green-700 dark:text-green-400">{question.answer}</span></p>
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
