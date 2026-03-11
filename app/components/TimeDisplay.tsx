"use client";
import React, { useEffect, useState } from "react";

// 顯示四位數字時間（HH:mm）
const TimeDisplay: React.FC = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      style={{
        fontFamily: "monospace",
        fontSize: "1.2em",
        letterSpacing: "0.1em",
        background: "#fff",
        border: "2px solid #fff",
        borderRadius: "0.7em",
        padding: "0.25em 0.8em",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        color: "#222",
        display: "inline-block"
      }}
    >
      {time}
    </span>
  );
};

export default TimeDisplay;
