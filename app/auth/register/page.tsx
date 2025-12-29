"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [nameOnly, setNameOnly] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

    // Redirect to login
    router.push("/auth/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="w-full max-w-md zen-card p-8">
        <h1 className="text-2xl zen-title mb-2">建立帳號（需 Email & 密碼）</h1>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input className="p-2 rounded-md" placeholder="顯示名稱（必填）" value={nameOnly} onChange={(e) => setNameOnly(e.target.value)} />
          <input className="p-2 rounded-md" placeholder="Email（必填）" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="p-2 rounded-md" placeholder="密碼（必填）" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="zen-button" disabled={loading}>{loading ? '建立中...' : '註冊'}</button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
        <p className="mt-4 text-sm zen-subtle">已經有帳號？ <a className="text-accent" href="/auth/login">登入</a></p>
      </main>
    </div>
  );
}
