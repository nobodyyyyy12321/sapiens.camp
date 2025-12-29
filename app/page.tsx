import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-4xl font-bold zen-title">出口成章</h1>
          <p className="max-w-md text-lg leading-8 zen-subtle">Sustainable Human Classics</p>

        </div>
        {/* Primary actions moved up */}
        <div className="flex w-full max-w-md items-center gap-3 text-base font-medium" style={{ marginTop: "1cm" }}>
          <a
            className="flex h-12 flex-1 min-w-0 items-center justify-center gap-2 rounded-full border border-zinc-200 px-4 text-foreground transition-colors hover:bg-zinc-100"
            href="/poem"
          >
            唐詩
          </a>

          <a
            className="flex h-12 flex-1 min-w-0 items-center justify-center gap-2 rounded-full border border-zinc-200 px-4 text-foreground transition-colors hover:bg-zinc-100"
            href="/songci"
          >
            宋詞
          </a>

          <a
            className="flex h-12 flex-1 min-w-0 items-center justify-center gap-2 rounded-full border border-zinc-200 px-4 text-foreground transition-colors hover:bg-zinc-100"
            href="/bible"
          >
            聖經
          </a>
        </div>
      </main>
    </div>
  );
}
