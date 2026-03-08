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
  const [isInBookshelf, setIsInBookshelf] = useState(false);

  const getCurrentBookshelf = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: SavedBook[] = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const closeMenu = () => setOpen(false);

    const onContextMenu = (event: MouseEvent) => {
      const node = event.target as HTMLElement | null;
      const anchor = node?.closest("a.book-link") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      const title = (anchor.textContent || "").trim();
      if (!href || !title) return;

      const current = getCurrentBookshelf();
      const exists = current.some((item) => item.href === href);

      event.preventDefault();
      setTarget({ title, href });
      setIsInBookshelf(exists);
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
      const current = getCurrentBookshelf();
      const exists = current.some((item) => item.href === target.href);
      if (exists) {
        setToast("已在個人書櫃");
      } else {
        const next: SavedBook[] = [{ ...target, addedAt: new Date().toISOString() }, ...current];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("my-bookshelf-updated"));
        setIsInBookshelf(true);
        setToast("已加入個人書櫃");
      }
    } catch {
      setToast("加入失敗");
    }

    setOpen(false);
    setTimeout(() => setToast(null), 1400);
  };

  const removeFromBookshelf = () => {
    if (!target) return;

    try {
      const current = getCurrentBookshelf();
      const exists = current.some((item) => item.href === target.href);
      if (!exists) {
        setToast("不在個人書櫃");
      } else {
        const next = current.filter((item) => item.href !== target.href);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("my-bookshelf-updated"));
        setIsInBookshelf(false);
        setToast("已移出個人書櫃");
      }
    } catch {
      setToast("移出失敗");
    }

    setOpen(false);
    setTimeout(() => setToast(null), 1400);
  };

  const downloadPdf = () => {
    if (!target) return;

    if (target.href === "/chinese/學測/115") {
      fetch("/api/chineseGSATpdf/single")
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok || !data?.url) {
            throw new Error(data?.error || "download_failed");
          }

          const link = document.createElement("a");
          link.href = data.url;
          link.download = data.fileName || "國文學測115.pdf";
          document.body.appendChild(link);
          link.click();
          link.remove();

          setToast("開始下載PDF");
        })
        .catch(() => {
          setToast("下載失敗");
        })
        .finally(() => {
          setOpen(false);
          setTimeout(() => setToast(null), 1400);
        });
      return;
    }

    const isPdfLink = /\.pdf($|\?)/i.test(target.href);
    if (!isPdfLink) {
      setToast("目前無PDF可下載");
      setOpen(false);
      setTimeout(() => setToast(null), 1400);
      return;
    }

    const link = document.createElement("a");
    link.href = target.href;
    link.download = `${target.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setToast("開始下載PDF");
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
            加入個人書櫃
          </button>
          <button
            onClick={removeFromBookshelf}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
            disabled={!isInBookshelf}
          >
            移出個人書櫃
          </button>
          <button
            onClick={downloadPdf}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            下載pdf
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