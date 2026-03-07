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
      className="fixed bottom-4 right-4 z-50 book-link h-11 w-11 p-0 flex items-center justify-center"
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
