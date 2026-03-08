"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [nameOnly, setNameOnly] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // Client-side validation: require name, email and password
    if (!nameOnly || !email || !password) {
      setError("請填寫名稱、Email 與密碼");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameOnly, email, password }),
    });

    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data?.error || "Registration failed");
      return;
    }

    // Show success message and email status
    if (data?.ok) {
      setError(null);
      if (data.verificationSent) {
        setSuccess("註冊成功並已寄出信件");
        if (data.previewUrl) setPreviewUrl(data.previewUrl);
      } else {
        // no SMTP — show verification link directly
        setSuccess("註冊成功，請點擊下方的驗證連結完成驗證");
        if (data.verificationUrl) setVerificationUrl(data.verificationUrl);
      }
      return;
    }

    setError(data?.error || "Registration failed");
  }

  return (
    <div className="flex min-h-screen items-start justify-center pt-16">
      <main className="w-full max-w-md zen-card p-8">
        <h1 className="text-2xl zen-title mb-2">建立帳號</h1>
        {success ? (
          <div className="p-4 bg-gray-900 text-white border border-gray-800 rounded">
            <p className="text-white">{success}</p>
            {previewUrl && (
              <p className="mt-2"><a className="text-accent underline" href={previewUrl} target="_blank" rel="noreferrer">檢視測試郵件（Ethereal preview）</a></p>
            )}
            {verificationUrl && (
              <p className="mt-2 break-words">驗證連結：<a className="text-accent underline" href={verificationUrl}>{verificationUrl}</a></p>
            )}
            <div className="mt-4">
              <button className="zen-button" onClick={() => router.push('/auth/login')}>前往登入</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3">
          <input className="p-2 rounded-md" placeholder="顯示名稱（必填）" value={nameOnly} onChange={(e) => setNameOnly(e.target.value)} />
          <input className="p-2 rounded-md" placeholder="Email（必填）" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="p-2 rounded-md" placeholder="密碼（必填）" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="zen-button" disabled={loading}>{loading ? '建立中...' : '註冊'}</button>
          <div className="mt-2">
            <div className="flex items-center gap-2 my-2">
              <hr className="flex-1" />
              <span className="text-sm text-zen-subtle">或</span>
              <hr className="flex-1" />
            </div>
            <button type="button" className="zen-button" onClick={() => signIn("google", { callbackUrl: "/" })}>
              使用 Google 帳號登入
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        )}
        <p className="mt-4 text-sm zen-subtle">已經有帳號？ <a className="text-accent" href="/auth/login">登入</a></p>
      </main>
    </div>
  );
}
