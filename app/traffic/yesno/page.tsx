"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

type Question = {
  id: string;
  number: number;
  question: string;
  answer: string;
};

export default function TrafficYesNoPage() {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedPaper, setSelectedPaper] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [recognizedToken, setRecognizedToken] = useState<string | null>(null);
  const recognizedTimerRef = useRef<number | null>(null);

  const paperRanges = Array.from({ length: 7 }, (_, i) => ({
    start: i * 100 + 1,
    end: (i + 1) * 100,
  }));
  const selectedRange = paperRanges[selectedPaper];
  const paperQuestions = questions.filter(
    (q) => q.number >= selectedRange.start && q.number <= selectedRange.end
  );

  useEffect(() => {
    fetch("/api/traffic/questions")
      .then(res => res.json())
      .then(data => {
        if (data.questions) {
          setQuestions(data.questions);
        }
      })
      .catch(err => console.error("Failed to load questions:", err));
  }, []);

  useEffect(() => {
    setUserAnswers(new Array(paperQuestions.length).fill(null));
    setCurrentIndex(0);
    setShowResults(false);
    setRecognizedToken(null);
  }, [selectedPaper, questions]);

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
      if (k === "arrowleft") {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
      if (k === "arrowright") {
        setCurrentIndex(Math.min(paperQuestions.length - 1, currentIndex + 1));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, showResults, userAnswers, paperQuestions.length]);

  function handleAnswer(ans: string) {
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = ans;
    setUserAnswers(newAnswers);
    setRecognizedToken(ans);
    clearRecognizedLater();

    // 自動跳下一題
    if (currentIndex < paperQuestions.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 500);
    }
  }

  function clearRecognizedLater(ms = 300) {
    if (recognizedTimerRef.current) window.clearTimeout(recognizedTimerRef.current);
    recognizedTimerRef.current = window.setTimeout(() => setRecognizedToken(null), ms);
  }

  function checkAnswers() {
    setShowResults(true);

    if (session?.user?.email) {
      const answered = userAnswers.filter((ans) => ans !== null).length;
      const correct = userAnswers.filter((ans, idx) => ans === paperQuestions[idx]?.answer).length;

      fetch("/api/user/traffic/record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answered,
          correct,
          set: `yesno-${selectedRange.start}-${selectedRange.end}`,
        }),
      }).catch((err) => console.error("Failed to save traffic record:", err));
    }
  }

  function restart() {
    setUserAnswers(new Array(paperQuestions.length).fill(null));
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

  const currentQ = paperQuestions[currentIndex];
  const answer = userAnswers[currentIndex];

  return (
    <div className="flex min-h-screen items-start justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-start justify-start py-8 px-16 bg-transparent dark:bg-black sm:items-start">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-3xl font-bold zen-title">汽車是非題</h1>
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
                onClick={() => setCurrentIndex(Math.min(paperQuestions.length - 1, currentIndex + 1))}
                disabled={currentIndex === paperQuestions.length - 1}
                className={`px-4 py-2 border rounded-full bg-white text-black text-sm transition-opacity ${currentIndex === paperQuestions.length - 1 ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}`}
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

        <div className="mt-6 flex flex-wrap gap-2 w-full">
          {paperRanges.map((range, index) => {
            const count = questions.filter((q) => q.number >= range.start && q.number <= range.end).length;
            const active = selectedPaper === index;
            return (
              <button
                key={`${range.start}-${range.end}`}
                type="button"
                onClick={() => setSelectedPaper(index)}
                className={`px-4 py-2 border rounded-full text-sm transition-opacity ${active ? "bg-white text-black border-black" : "bg-black text-white border-white hover:opacity-90"}`}
              >
                第 {index + 1} 卷 ({range.start}-{range.end}) {count > 0 ? `· ${count}題` : "· 0題"}
              </button>
            );
          })}
        </div>

        {paperQuestions.length === 0 ? (
          <div className="mt-6 text-sm zen-subtle">此試卷目前沒有題目</div>
        ) : !showResults ? (
          <div className="mt-6 space-y-4 w-full">
            <div className="text-sm text-zinc-400">
              第 {selectedPaper + 1} 卷｜第 {currentIndex + 1} 題
            </div>
            
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
          </div>
        ) : (
          <div className="mt-6 space-y-4 w-full">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                寫 {userAnswers.filter(ans => ans !== null).length} 題，對 {userAnswers.filter((ans, idx) => ans === paperQuestions[idx].answer).length} 題
              </div>
              <button
                onClick={restart}
                className="px-4 py-2 border rounded-full bg-white text-black text-sm"
              >
                重新開始
              </button>
            </div>
            <h2 className="text-2xl font-bold mt-6">答題結果</h2>
            <div className="space-y-3">
              {paperQuestions.map((q, idx) => {
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
                    <p className="font-medium mb-2">第 {q.number} 題：{q.question}</p>
                    <div className="text-sm space-y-1">
                      <p>你的答案：<span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${correct ? "bg-green-200 text-green-700 dark:bg-green-900/50 dark:text-green-400" : "bg-red-200 text-red-700 dark:bg-red-900/50 dark:text-red-400"}`}>
                        {userAns}
                      </span></p>
                      {!correct && (
                        <p>正確答案：<span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-green-200 text-green-700 dark:bg-green-900/50 dark:text-green-400">{q.answer}</span></p>
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
