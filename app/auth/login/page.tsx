"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await signIn("credentials", { redirect: false, email, password });
    // res is typed loosely
    if ((res as any)?.error) {
      setError((res as any).error || "Login failed");
      return;
    }

    // On success, redirect to home
    router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="w-full max-w-md zen-card p-8">
        <h1 className="text-2xl zen-title mb-2">登入</h1>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input className="p-2 rounded-md" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="p-2 rounded-md" placeholder="密碼" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="zen-button">登入</button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
        <p className="mt-4 text-sm zen-subtle">還沒有帳號？ <a className="text-accent" href="/auth/register">註冊</a></p>
      </main>
    </div>
  );
}
