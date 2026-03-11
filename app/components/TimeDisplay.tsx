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
    <span style={{ fontFamily: "monospace", fontSize: "1.2em", letterSpacing: "0.1em" }}>{time}</span>
  );
};

export default TimeDisplay;
