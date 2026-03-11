"use client";
import React, { useEffect, useState } from "react";

// 顯示四位數字計時器（mm:ss），預設 1 分鐘倒數，含開始、停止、歸零按鈕
const TimerDisplay: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
      <span style={{ fontFamily: "monospace", fontSize: "1.2em", letterSpacing: "0.1em", color: "#fff" }}>{mm}:{ss}</span>
      <button
        type="button"
        aria-label="開始"
        onClick={() => setRunning(true)}
        className="timer-btn"
      >
        <span className="timer-icon">▶️</span>
      </button>
      <button
        type="button"
        aria-label="暫停"
        onClick={() => setRunning(false)}
        className="timer-btn"
      >
        <span className="timer-icon">⏸️</span>
      </button>
      <button
        type="button"
        aria-label="歸零"
        onClick={() => { setSeconds(0); setRunning(false); }}
        className="timer-btn"
      >
        <span className="timer-icon">⏹️</span>
      </button>
      <style jsx>{`
        .timer-btn {
          background: none;
          border: none;
          padding: 0.25em 0.4em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, transform 0.15s;
        }
        .timer-icon {
          color: #fff;
          font-size: 1.4em;
          transition: color 0.15s, transform 0.15s;
        }
        .timer-btn:active .timer-icon {
          color: #ffd700;
          transform: scale(0.85);
        }
      `}</style>
    </div>
  );
};

export default TimerDisplay;
