"use client";

import { usePathname, useRouter } from "next/navigation";

export default function GlobalUpOneLevelButton() {
  const pathname = usePathname();
  const router = useRouter();

  if (!pathname || pathname === "/") {
    return null;
  }

  const handleGoUp = () => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length <= 1) {
      router.push("/");
      return;
    }

    router.push(`/${segments.slice(0, -1).join("/")}`);
  };

  return (
    <button
      type="button"
      onClick={handleGoUp}
      className="fixed bottom-6 right-6 z-50 h-9 w-9 rounded-md border border-zinc-200 dark:border-zinc-700 bg-[var(--zen-bg)] flex items-center justify-center shadow-sm hover:translate-x-0"
      aria-label="回到上一層"
      title="上一層"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M9 14 4 9l5-5" />
        <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
      </svg>
    </button>
  );
}
