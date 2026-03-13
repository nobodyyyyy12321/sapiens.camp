import React, { useEffect, useState } from "react";

// 顯示四位數字計時器（mm:ss），預設 1 分鐘倒數，含開始、停止、歸零按鈕
const TimerDisplay: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  // 計算 mm:ss
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5em",
          background: "#fff",
          borderRadius: "0.7em",
          padding: "0.25em 0.8em",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          color: "#222"
        }}
      >
        <span style={{ fontFamily: "monospace", fontSize: "1.2em", letterSpacing: "0.1em", color: "#222" }}>{mm}:{ss}</span>
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
      </div>
    </div>
  );
}

export default TimerDisplay;
