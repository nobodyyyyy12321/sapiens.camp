"use client";

import { useEffect, useState } from "react";

type SavedBook = {
  title: string;
  href: string;
  addedAt: string;
};

const STORAGE_KEY = "my-bookshelf-links";

export default function BookshelfContextMenu() {
  const [open, setOpen] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [target, setTarget] = useState<{ title: string; href: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const closeMenu = () => setOpen(false);

    const onContextMenu = (event: MouseEvent) => {
      const node = event.target as HTMLElement | null;
      const anchor = node?.closest("a.book-link") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      const title = (anchor.textContent || "").trim();
      if (!href || !title) return;

      event.preventDefault();
      setTarget({ title, href });
      setX(event.clientX);
      setY(event.clientY);
      setOpen(true);
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("click", closeMenu);
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("keydown", onKeydown);

    return () => {
      window.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("keydown", onKeydown);
    };
  }, []);

  const addToBookshelf = () => {
    if (!target) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const current: SavedBook[] = raw ? JSON.parse(raw) : [];
      const exists = current.some((item) => item.href === target.href);
      if (exists) {
        setToast("已在我的書櫃");
      } else {
        const next: SavedBook[] = [{ ...target, addedAt: new Date().toISOString() }, ...current];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("my-bookshelf-updated"));
        setToast("已加入我的書櫃");
      }
    } catch {
      setToast("加入失敗");
    }

    setOpen(false);
    setTimeout(() => setToast(null), 1400);
  };

  return (
    <>
      {open && (
        <div
          className="fixed z-[80] min-w-36 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg"
          style={{ top: y, left: x }}
          role="menu"
        >
          <button
            onClick={addToBookshelf}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            加入我的書櫃
          </button>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[90] rounded-md bg-black/85 text-white text-sm px-3 py-2">
          {toast}
        </div>
      )}
    </>
  );
}