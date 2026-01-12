"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdvertisePage() {
  const [contact, setContact] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    try {
      const res = await fetch("/api/advertise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, company, message }),
      });
      const data = await res.json();
      if (data && data.success) {
        setSuccess("已送出，我們會盡快聯絡您。");
        setContact("");
        setCompany("");
        setMessage("");
        // optionally navigate after a short delay
        setTimeout(() => router.push("/"), 1500);
      } else {
        setSuccess("送出失敗，請稍後再試。");
      }
    } catch (err) {
      console.error(err);
      setSuccess("送出失敗，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-transparent font-sans dark:bg-black">
      <main className="w-full max-w-2xl py-12 px-6">
        <h1 className="text-3xl font-bold zen-title mb-4">刊登廣告 / Contact</h1>

        <p className="mb-6 text-sm zen-subtle">填寫下列表單以申請刊登；我們會回覆您進一步合作細節與付款方式。</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">聯絡資訊（電子郵件或電話）</label>
            <input value={contact} onChange={(e) => setContact(e.target.value)} className="w-full p-3 rounded border" placeholder="example@example.com" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">公司 / 品牌（選填）</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} className="w-full p-3 rounded border" placeholder="Company or brand" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">廣告內容 / 備註</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-3 rounded border" rows={6} placeholder="您想刊登的內容、想投放的時段或其他備註" />
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "送出中…" : "送出申請"}
            </button>
            <div className="text-sm text-zinc-500">價格參考：100 USD / month</div>
          </div>

          {success && <div className="mt-4 text-sm text-green-600">{success}</div>}
        </form>
      </main>
    </div>
  );
}
