"use client";
import React, { useEffect, useState } from "react";

// 顯示四位數字計時器（mm:ss），預設 1 分鐘倒數，含開始、停止、歸零按鈕
const TimerDisplay: React.FC = () => {
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) {
      setRunning(false);
      return;
    }
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [running, seconds]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
      <span style={{ fontFamily: "monospace", fontSize: "1.2em", letterSpacing: "0.1em" }}>{mm}:{ss}</span>
      <button
        type="button"
        aria-label="開始"
        onClick={() => setRunning(true)}
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2em" }}
      >▶️</button>
      <button
        type="button"
        aria-label="停止"
        onClick={() => setRunning(false)}
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2em" }}
      >⏸️</button>
      <button
        type="button"
        aria-label="歸零"
        onClick={() => { setSeconds(60); setRunning(false); }}
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2em" }}
      >⏹️</button>
    </div>
  );
};

export default TimerDisplay;
