"use client";

import { FormEvent, useMemo, useState } from "react";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusText, setStatusText] = useState("");

  const canSubmit = useMemo(() => {
    return name.trim().length > 0 && email.trim().length > 0 && message.trim().length > 0;
  }, [name, email, message]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || sending) return;

    setSending(true);
    setStatus("idle");
    setStatusText("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          pageUrl: window.location.href,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setStatusText(data?.error || "送出失敗，請稍後再試。");
        return;
      }

      setStatus("success");
      setStatusText("回饋已送出，謝謝你！");
      setMessage("");
    } catch {
      setStatus("error");
      setStatusText("網路連線異常，請稍後再試。");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent px-6 py-10 font-sans dark:bg-black">
      <main className="w-full max-w-2xl zen-card p-8">
        <h1 className="text-3xl font-bold zen-title mb-2">意見回饋</h1>
        <p className="zen-subtle mb-8">有任何建議、問題或想法，歡迎留言給我們。</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="feedback-name" className="block mb-1 text-sm">名稱</label>
            <input
              id="feedback-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2"
              placeholder="你的名稱"
              required
            />
          </div>

          <div>
            <label htmlFor="feedback-email" className="block mb-1 text-sm">Email</label>
            <input
              id="feedback-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={320}
              className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="feedback-message" className="block mb-1 text-sm">回饋內容</label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={4000}
              rows={8}
              className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2"
              placeholder="請輸入你想告訴我們的內容"
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!canSubmit || sending}
              className="inline-flex items-center justify-center whitespace-nowrap px-4 py-2 border rounded-full bg-white text-black text-sm leading-none cursor-pointer hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? "送出中..." : "送出回饋"}
            </button>
            {status !== "idle" && (
              <p className={status === "success" ? "text-green-600 text-sm" : "text-red-600 text-sm"}>
                {statusText}
              </p>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
