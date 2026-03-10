"use client";
import { useEffect, useState } from "react";

export default function LightDarkToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // 初始根據 class 判斷
    setDark(document.documentElement.classList.contains("dark"));
    // 根據模式設置背景色
    document.body.style.backgroundColor = document.documentElement.classList.contains("dark") ? "#111" : "#fff";
  }, []);

  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        document.body.style.backgroundColor = "#111";
      } else {
        document.documentElement.classList.remove("dark");
        document.body.style.backgroundColor = "#fff";
      }
      return next;
    });
  };

  return (
    <button
      className="fixed right-6 top-6 z-50 w-12 h-12 flex items-center justify-center bg-transparent border-none cursor-pointer"
      onClick={toggle}
      aria-label={dark ? "切換為亮色模式" : "切換為暗色模式"}
      title={dark ? "切換為亮色模式" : "切換為暗色模式"}
    >
      {dark ? (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 drop-shadow-lg">
          <path d="M21 12.79A9 9 0 0112.21 3a7 7 0 000 14A9 9 0 0021 12.79z" />
        </svg>
      ) : (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
    </button>
  );
}