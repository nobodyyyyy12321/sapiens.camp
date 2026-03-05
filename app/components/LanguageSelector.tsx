"use client";

import { useEffect, useState } from "react";

type LanguageCode = "zh-TW" | "zh-CN" | "en";

export default function LanguageSelector() {
  const [language, setLanguage] = useState<LanguageCode>("zh-TW");

  useEffect(() => {
    const stored = (localStorage.getItem("siteLanguage") as LanguageCode | null) ?? "zh-TW";
    setLanguage(stored);
  }, []);

  function handleLanguageChange(value: LanguageCode) {
    setLanguage(value);
    localStorage.setItem("siteLanguage", value);
    document.cookie = `siteLanguage=${value}; path=/; max-age=31536000`;
    window.dispatchEvent(new Event("site-language-change"));
  }

  return (
    <select
      className="p-2 rounded-md border border-zinc-300 bg-white text-black text-sm"
      value={language}
      onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
      aria-label="語言選擇"
    >
      <option value="zh-TW">中文繁體</option>
      <option value="zh-CN">中文簡體</option>
      <option value="en">English</option>
    </select>
  );
}
