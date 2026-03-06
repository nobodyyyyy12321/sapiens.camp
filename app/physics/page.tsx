"use client";

import Link from "next/link";

export default function PhysicsPage() {
  const physicsTopics = [
    { name: "力學" },
    { name: "熱力學" },
    { name: "光學" },
    { name: "電磁學" },
    { name: "量子力學" },
    { name: "相對論" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black text-center">
        <h1 className="max-w-xs text-4xl font-bold zen-title">物理</h1>

        <div className="mt-8 w-full max-w-3xl">
          <div className="bookshelf-scroll">
            <div className="bookshelf-grid">
              {physicsTopics.map((topic) => (
                <Link key={topic.name} href="/under-construction" className="book-link">
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
