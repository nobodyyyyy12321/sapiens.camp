"use client";

import Link from "next/link";

export default function MathIndex() {
  const mathTopics = [
    { name: "算數", path: "/math/arithmetic" },
    { name: "代數", path: "/math/algebra" },
    { name: "幾何", path: "/math/geometry" },
    { name: "三角函數", path: "/math/trigonometry" },
    { name: "指數與複數", path: "/math/exponential-complex" },
    { name: "解析幾何", path: "/math/analytic-geometry" },
    { name: "統計", path: "/math/statistics" },
    { name: "排列組合", path: "/math/combinatorics" },
    { name: "微積分", path: "/math/calculus" },
    { name: "微分方程", path: "/math/differential-equations" },
    { name: "線性代數", path: "/math/linear-algebra" },
    { name: "複變函數", path: "/math/complex-analysis" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black sm:items-start">
        <h1 className="max-w-xs text-4xl font-bold zen-title">數學題庫</h1>
        <p className="mt-4 text-sm zen-subtle mb-8">選擇數學主題開始練習</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full mt-6">
          {mathTopics.map((topic) => (
            <Link
              key={topic.path}
              href={topic.path}
              className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-center"
            >
              <h2 className="text-lg font-semibold zen-title">{topic.name}</h2>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
