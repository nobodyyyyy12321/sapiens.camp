import React, { useEffect, useState } from "react";

// 顯示四位數字計時器（mm:ss），預設 1 分鐘倒數
const TimerDisplay: React.FC = () => {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <span style={{ fontFamily: "monospace", fontSize: "1.2em", letterSpacing: "0.1em" }}>{mm}:{ss}</span>
  );
};

export default TimerDisplay;
