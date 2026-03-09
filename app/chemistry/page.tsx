"use client";

import Link from "next/link";

export default function ChemistryPage() {
  const chemistryTopics = [
    { name: "無機化學" },
    { name: "有機化學" },
    { name: "分析化學" },
    { name: "物理化學" },
    { name: "生物化學" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black text-center">
        <h1 className="max-w-xs text-4xl font-bold zen-title">化學</h1>

        <div className="mt-8 w-full max-w-3xl">
          <div className="bookshelf-scroll">
            <div className="bookshelf-grid">
              {chemistryTopics.map((topic) => (
                <Link key={topic.name} href={topic.href || "/under-construction"} className="book-link">
                  {topic.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
