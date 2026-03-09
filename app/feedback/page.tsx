"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusText, setStatusText] = useState("");
  const [language, setLanguage] = useState("zh-TW");

  useEffect(() => {
    const stored = localStorage.getItem("siteLanguage") || "zh-TW";
    setLanguage(stored);
    const handler = () => {
      const updated = localStorage.getItem("siteLanguage") || "zh-TW";
      setLanguage(updated);
    };
    window.addEventListener("site-language-change", handler);
    return () => window.removeEventListener("site-language-change", handler);
  }, []);

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

// ...existing code...
      success: "Отзыв отправлен, спасибо!",
      error: "Не удалось отправить, попробуйте позже.",
      netError: "Ошибка сети, попробуйте позже."
    }
  };
  const t = dict[language] || dict["zh-TW"];

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent px-6 py-10 font-sans dark:bg-black">
      <main className="w-full max-w-2xl zen-card p-8">
        <h1 className="text-3xl font-bold zen-title mb-2">{t.title}</h1>
        <p className="zen-subtle mb-8">{t.desc}</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="feedback-name" className="block mb-1 text-sm">{t.name}</label>
            <input
              id="feedback-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2"
              placeholder={t.placeholderName}
              required
            />
          </div>

          <div>
            <label htmlFor="feedback-email" className="block mb-1 text-sm">{t.email}</label>
            <input
              id="feedback-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={320}
              className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2"
              placeholder={t.placeholderEmail}
              required
            />
          </div>

          <div>
            <label htmlFor="feedback-message" className="block mb-1 text-sm">{t.content}</label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={4000}
              rows={8}
              className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2"
              placeholder={t.placeholderContent}
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!canSubmit || sending}
              className="inline-flex items-center justify-center whitespace-nowrap px-4 py-2 border rounded-full bg-white text-black text-sm leading-none cursor-pointer hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? t.sending : t.send}
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
