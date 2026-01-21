"use client";

import React, { useState } from "react";

export default function TrafficYesNoPage() {
  const [answer, setAnswer] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen items-start justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-start justify-start py-8 px-16 bg-transparent dark:bg-black sm:items-start">
        <h1 className="text-3xl font-bold zen-title">汽車是非題1</h1>

        <div className="mt-4 space-y-4 w-full max-w-md">
          <div className="p-6 border rounded">問題：紅燈時可以右轉？</div>

          <div className="flex items-center gap-3">
            <button className="zen-button" onClick={() => setAnswer("是")}>是</button>
            <button className="zen-ghost" onClick={() => setAnswer("否")}>否</button>
          </div>

          {answer && (
            <div className="mt-2 text-sm">您的答案：{answer}</div>
          )}
        </div>
      </main>
    </div>
  );
}
