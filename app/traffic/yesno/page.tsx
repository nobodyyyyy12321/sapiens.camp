"use client";

import React, { useEffect, useRef, useState } from "react";

export default function TrafficYesNoPage() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [recognizedToken, setRecognizedToken] = useState<string | null>(null);
  const recognizedTimerRef = useRef<number | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      const k = e.key.toLowerCase();
      if (k === "y") {
        setAnswer("是");
        setRecognizedToken("是");
        clearRecognizedLater();
      }
      if (k === "n") {
        setAnswer("否");
        setRecognizedToken("否");
        clearRecognizedLater();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function clearRecognizedLater(ms = 1500) {
    if (recognizedTimerRef.current) window.clearTimeout(recognizedTimerRef.current);
    recognizedTimerRef.current = window.setTimeout(() => setRecognizedToken(null), ms);
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-start justify-start py-8 px-16 bg-transparent dark:bg-black sm:items-start">
        <h1 className="text-3xl font-bold zen-title">汽車是非題1</h1>

        <div className="mt-4 space-y-4 w-full max-w-md">
          <div className="p-6 border rounded">問題：紅燈時可以右轉？</div>

          <div className="flex items-center gap-3">
            <button
              className={`px-4 py-2 border rounded transition-transform duration-150 ${answer === "是" ? "bg-white text-black border-black" : "bg-black text-white border-white"} ${recognizedToken === "是" ? "ring-2 ring-white scale-95" : ""}`}
              onClick={() => {
                setAnswer("是");
                setRecognizedToken("是");
                clearRecognizedLater();
              }}
            >是</button>
            <button
              className={`px-4 py-2 border rounded transition-transform duration-150 ${answer === "否" ? "bg-white text-black border-black" : "bg-black text-white border-white"} ${recognizedToken === "否" ? "ring-2 ring-white scale-95" : ""}`}
              onClick={() => {
                setAnswer("否");
                setRecognizedToken("否");
                clearRecognizedLater();
              }}
            >否</button>

            
          </div>

          {answer && (
            <div className="mt-2 text-sm">您的答案：{answer}</div>
          )}

          {status && (
            <div className="mt-2 text-sm text-zinc-400">{status}</div>
          )}
        </div>
      </main>
    </div>
  );
}
