"use client";

import React, { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import SearchParamsProvider, { useSearchParamsContext } from "../../components/SearchParamsProvider";

function LoginInner() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("zh-TW");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParamsContext();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  React.useEffect(() => {
    const stored = localStorage.getItem("siteLanguage") || "zh-TW";
    setLanguage(stored);
  }, []);

  function handleLanguageChange(value: string) {
    setLanguage(value);
    localStorage.setItem("siteLanguage", value);
    document.cookie = `siteLanguage=${value}; path=/; max-age=31536000`;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await signIn("credentials", { redirect: false, email, password });
    if ((res as any)?.error) {
      setError((res as any).error || "Login failed");
      return;
    }

    router.push(callbackUrl);
  }

  async function resendVerification() {
    setError(null);
    if (!email) {
      setError("請先輸入 Email 再按此按鈕");
      return;
    }
    try {
      const res = await fetch("/api/auth/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const j = await res.json();
      if (!res.ok) {
        setError(j?.error || "無法寄出驗證信");
        return;
      }
      if (j?.ok) {
        if (j.verificationSent) {
          setError(null);
          alert("驗證信已寄出，請檢查您的信箱");
        } else if (j.verificationUrl) {
          alert(`驗證連結：\n${j.verificationUrl}`);
        }
      } else if (j?.message === "already_verified") {
        setError("此帳號已完成驗證，請直接登入");
      }
    } catch (e) {
      setError("寄送驗證信失敗");
    }
  }

  return (
    <div className="flex min-h-screen items-start justify-center pt-16">
      <div className="relative w-full max-w-md">
        <div className="hidden md:block absolute top-0" style={{ right: "calc(100% + 3cm)" }}>
          <select
            className="p-2 rounded-md border border-zinc-300 bg-white text-black text-sm"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            aria-label="語言選擇"
          >
            <option value="zh-TW">中文繁體</option>
            <option value="zh-CN">中文簡體</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="md:hidden mb-3">
          <select
            className="w-full p-2 rounded-md border border-zinc-300 bg-white text-black text-sm"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            aria-label="語言選擇"
          >
            <option value="zh-TW">中文繁體</option>
            <option value="zh-CN">中文簡體</option>
            <option value="en">English</option>
          </select>
        </div>

        <main className="w-full max-w-md zen-card p-8">
          <h1 className="text-2xl zen-title mb-2">登入</h1>
          <form onSubmit={submit} className="flex flex-col gap-3">
            <input className="p-2 rounded-md" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="p-2 rounded-md" placeholder="密碼" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="zen-button">登入</button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
          <div className="mt-4">
            <div className="flex items-center gap-2 my-2">
              <hr className="flex-1" />
              <span className="text-sm text-zen-subtle">或</span>
              <hr className="flex-1" />
            </div>
            <button
              type="button"
              className="w-full zen-button"
              onClick={() => signIn("google", { callbackUrl })}
            >
              使用 Google 帳號登入
            </button>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button className="text-sm zen-ghost" onClick={resendVerification}>重新寄發驗證信</button>
          </div>
          <p className="mt-4 text-sm zen-subtle">還沒有帳號？ <a className="text-accent" href="/auth/register">註冊</a></p>
        </main>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsProvider>
        <LoginInner />
      </SearchParamsProvider>
    </Suspense>
  );
}
