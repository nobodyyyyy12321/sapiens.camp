"use client";

import React, { useEffect, useRef, useState } from "react";

type Question = {
  id: string;
  number: number;
  question: string;
  answer: string;
};

export default function TrafficYesNoPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [recognizedToken, setRecognizedToken] = useState<string | null>(null);
  const recognizedTimerRef = useRef<number | null>(null);

  useEffect(() => {
    fetch("/api/traffic/questions")
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

      const k = e.key.toLowerCase();
      if (k === "y") {
        handleAnswer("是");
      }
      if (k === "n") {
        handleAnswer("否");
      }
      if (k === "enter" && userAnswers.every(a => a !== null)) {
        checkAnswers();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, showResults, userAnswers]);

  function handleAnswer(ans: string) {
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = ans;
    setUserAnswers(newAnswers);
    setRecognizedToken(ans);
    clearRecognizedLater();

    // 自動跳下一題
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
  }

  function restart() {
    setUserAnswers(new Array(questions.length).fill(null));
    setCurrentIndex(0);
    setShowResults(false);
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>載入中...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answer = userAnswers[currentIndex];

  return (
    <div className="flex min-h-screen items-start justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-start justify-start py-8 px-16 bg-transparent dark:bg-black sm:items-start">
        <h1 className="text-3xl font-bold zen-title">汽車是非題</h1>

        {!showResults ? (
          <div className="mt-6 space-y-4 w-full">
            <div className="p-6 border rounded text-lg">
              {currentQ.question}
            </div>

            <div className="flex items-center gap-3">
              <button
                className={`px-6 py-3 border rounded transition-transform duration-150 ${answer === "是" ? "bg-white text-black border-black" : "bg-black text-white border-white"} ${recognizedToken === "是" ? "ring-2 ring-white scale-95" : ""}`}
                onClick={() => handleAnswer("是")}
              >是 (Y)</button>
              <button
                className={`px-6 py-3 border rounded transition-transform duration-150 ${answer === "否" ? "bg-white text-black border-black" : "bg-black text-white border-white"} ${recognizedToken === "否" ? "ring-2 ring-white scale-95" : ""}`}
                onClick={() => handleAnswer("否")}
              >否 (N)</button>
            </div>

            <div className="flex gap-3 mt-6">
              {currentIndex > 0 && (
                <button
                  onClick={() => setCurrentIndex(currentIndex - 1)}
                  className="px-4 py-2 border rounded zen-button"
                >
                  上一題
                </button>
              )}
              {currentIndex < questions.length - 1 && (
                <button
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="px-4 py-2 border rounded zen-button"
                >
                  下一題
                </button>
              )}
              <button
                onClick={checkAnswers}
                className="px-4 py-2 border rounded bg-white text-black"
              >
                交卷
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4 w-full">
            <div className="text-2xl font-bold">
              寫 {questions.length} 題，對 {userAnswers.filter((ans, idx) => ans === questions[idx].answer).length} 題
            </div>
            <h2 className="text-2xl font-bold mt-6">答題結果</h2>
            <div className="space-y-3">
              {questions.map((q, idx) => {
                const userAns = userAnswers[idx];
                const correct = userAns === q.answer;
                return (
                  <div key={q.id} className={`p-4 border rounded ${correct ? "border-green-500" : "border-red-500"}`}>
                    <div className="font-bold">
                      第 {idx + 1} 題 {correct ? "✓" : "✗"}
                    </div>
                    <div className="text-sm mt-1">{q.question}</div>
                    <div className="text-sm mt-2">
                      <span className={correct ? "text-green-400" : "text-red-400"}>
                        您的答案：{userAns}
                      </span>
                      {!correct && (
                        <span className="ml-4 text-green-400">
                          正確答案：{q.answer}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={restart}
              className="px-6 py-3 border rounded bg-white text-black"
            >
              重新開始
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
