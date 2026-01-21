"use client";

import React, { useEffect, useRef, useState } from "react";

export default function TrafficYesNoPage() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const listeningRef = useRef<boolean>(false);
  const [status, setStatus] = useState<string | null>(null);
  const [recognizedToken, setRecognizedToken] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const statusTimerRef = useRef<number | null>(null);
  const recognizedTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "zh-TW";
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript || "";
      handleTranscript(transcript.trim());
    };

    rec.onend = () => {
      if (listeningRef.current) {
        try {
          rec.start();
        } catch (err) {
          listeningRef.current = false;
          setListening(false);
        }
      }
    };

    recognitionRef.current = rec;

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

    return () => {
      try {
        listeningRef.current = false;
        recognitionRef.current?.stop?.();
      } catch (e) {}
      window.removeEventListener("keydown", onKey);
      recognitionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clearStatusLater(ms = 2000) {
    if (statusTimerRef.current) window.clearTimeout(statusTimerRef.current);
    statusTimerRef.current = window.setTimeout(() => setStatus(null), ms);
  }

  function clearRecognizedLater(ms = 1500) {
    if (recognizedTimerRef.current) window.clearTimeout(recognizedTimerRef.current);
    recognizedTimerRef.current = window.setTimeout(() => setRecognizedToken(null), ms);
  }

  function handleTranscript(raw: string) {
    const t = raw.replace(/\s+/g, "").toLowerCase();

    if (t.includes("下一題") || t.includes("下一") || t.includes("next")) {
      setRecognizedToken("下");
      setAnswer(null);
      clearRecognizedLater();
      return;
    }

    if (t.includes("上一題") || t.includes("上一") || t.includes("上")) {
      setRecognizedToken("上");
      clearRecognizedLater();
      return;
    }

    if (t.includes("是") || t.includes("對") || t.includes("是的")) {
      setAnswer("是");
      setRecognizedToken("是");
      clearRecognizedLater();
      return;
    }

    if (t.includes("否") || t.includes("不是") || t.includes("不對")) {
      setAnswer("否");
      setRecognizedToken("否");
      clearRecognizedLater();
      return;
    }

    setStatus(`未辨識：${raw}`);
    clearStatusLater();
  }

  function toggleListening() {
    const rec = recognitionRef.current;
    if (!rec) {
      setStatus("瀏覽器不支援語音辨識");
      clearStatusLater(3000);
      return;
    }

    if (listening) {
      try {
        rec.stop();
      } catch (e) {}
      listeningRef.current = false;
      setListening(false);
      setStatus(null);
    } else {
      try {
        listeningRef.current = true;
        rec.start();
        setListening(true);
        setStatus("正在聆聽...");
        clearStatusLater(1500);
      } catch (e) {
        listeningRef.current = false;
        setStatus("無法啟動麥克風");
        clearStatusLater(2000);
      }
    }
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

            <button
              onClick={toggleListening}
              aria-label="語音輸入"
              className={`p-2 rounded-full border border-white bg-black text-white flex items-center justify-center ${listening ? "ring-2 ring-red-500" : ""}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" />
                <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 5 5 0 0 0 4 4.9V19a1 1 0 1 0 2 0v-3.1A5 5 0 0 0 19 11z" />
              </svg>
            </button>
            <div className="text-sm text-zinc-400">請說「是」「否」，或說「下」代表下一題、「上」代表上一題</div>
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
