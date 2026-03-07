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
      className="fixed bottom-4 right-4 z-50 book-link"
      aria-label="回到上一層"
    >
      上一層
    </button>
  );
}
