"use client";
import React, { useEffect, useState } from "react";

const LOCALE_COOKIE_NAME = "locale";
const DEFAULT_LOCALE = "zh-Hant";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\\+^])/g, "\\$1") + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : null;
}

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState<string>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const fromCookie = getCookie(LOCALE_COOKIE_NAME);
      const fromStorage = typeof localStorage !== "undefined" ? localStorage.getItem(LOCALE_COOKIE_NAME) : null;
      setLocale(fromCookie || fromStorage || DEFAULT_LOCALE);
    } catch (e) {
      setLocale(DEFAULT_LOCALE);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setLocale(val);
    try {
      document.cookie = `${LOCALE_COOKIE_NAME}=${encodeURIComponent(val)}; path=/; max-age=${60 * 60 * 24 * 365}`;
      localStorage.setItem(LOCALE_COOKIE_NAME, val);
    } catch (err) {
      // ignore
    }

    if (typeof document !== "undefined") {
      document.documentElement.lang = val === "zh-Hans" ? "zh-Hans" : "zh-Hant";
    }

    // reload to let pages pick up locale cookie/server-side logic if any
    if (typeof window !== "undefined") window.location.reload();
  };

  return (
    <select
      aria-label="切換字體"
      value={locale}
      onChange={handleChange}
      className="language-select zen-ghost px-3 py-1 rounded"
      style={{ color: "#fff", backgroundColor: "#000" }}
    >
      <option value="zh-Hant" style={{ backgroundColor: "#000", color: "#fff" }}>繁體</option>
      <option value="zh-Hans" style={{ backgroundColor: "#000", color: "#fff" }}>簡體</option>
    </select>
  );
}
