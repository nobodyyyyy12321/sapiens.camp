"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type SavedBook = {
  title: string;
  href: string;
  addedAt: string;
};

type QuizRecord = {
  answered: number;
  correct: number;
  set: string;
  timestamp: string;
};

type RecitationRecord = {
  articleNumber: number;
  title: string;
  success: boolean;
  timestamp: string;
  category?: string;
};

const STORAGE_KEY = "my-bookshelf-links";

export default function ListsPage() {
  const [items, setItems] = useState<SavedBook[]>([]);
  const [draggingHref, setDraggingHref] = useState<string | null>(null);
  const [dragGhost, setDragGhost] = useState<{ title: string; x: number; y: number } | null>(null);
  const [droppedHref, setDroppedHref] = useState<string | null>(null);
  const [recordTips, setRecordTips] = useState<Record<string, string>>({});
  const itemsRef = useRef<SavedBook[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed: SavedBook[] = raw ? JSON.parse(raw) : [];
        setItems(Array.isArray(parsed) ? parsed : []);
      } catch {
        setItems([]);
      }
    };

    load();
    window.addEventListener("my-bookshelf-updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("my-bookshelf-updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  useEffect(() => {
    const formatDate = (timestamp: string) => {
      return new Date(timestamp).toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    };

    const normalizePath = (value: string) => {
      try {
        const decoded = decodeURIComponent(value);
        return decoded.startsWith("/") ? decoded : `/${decoded}`;
      } catch {
        return value.startsWith("/") ? value : `/${value}`;
      }
    };

    const run = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) return;
        const data = await res.json();
        const user = data?.user;
        if (!user) return;

        const tips: Record<string, string> = {};

        const englishRecords: QuizRecord[] = Array.isArray(user.englishRecords) ? user.englishRecords : [];
        const quoteRecords: QuizRecord[] = Array.isArray(user.quoteRecords) ? user.quoteRecords : [];
        const studyChineseRecords: QuizRecord[] = Array.isArray(user.studyChineseRecords) ? user.studyChineseRecords : [];
        const recitations: RecitationRecord[] = Array.isArray(user.recitations) ? user.recitations : [];

        for (const item of items) {
          const path = normalizePath(item.href);

          if (path.startsWith("/english/")) {
            const set = path.replace("/english/", "");
            const candidates = englishRecords.filter((r) => r?.set === set);
            if (candidates.length > 0) {
              const latest = candidates.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
              tips[item.href] = `最近：${formatDate(latest.timestamp)}，${latest.correct}/${latest.answered}`;
              continue;
            }
          }

          if (path.startsWith("/quote/")) {
            const set = path.replace("/quote/", "");
            const candidates = quoteRecords.filter((r) => r?.set === set);
            if (candidates.length > 0) {
              const latest = candidates.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
              tips[item.href] = `最近：${formatDate(latest.timestamp)}，${latest.correct}/${latest.answered}`;
              continue;
            }
          }

          if (path.startsWith("/study-chinese/")) {
            const set = path.replace("/study-chinese/", "");
            const candidates = studyChineseRecords.filter((r) => r?.set === set);
            if (candidates.length > 0) {
              const latest = candidates.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
              tips[item.href] = `最近：${formatDate(latest.timestamp)}，${latest.correct}/${latest.answered}`;
              continue;
            }
          }

          const articleMatch = path.match(/^\/(.+)\/(\d+)$/);
          if (articleMatch) {
            const category = articleMatch[1];
            const number = Number(articleMatch[2]);
            const candidates = recitations.filter((r) => {
              const sameNumber = Number(r.articleNumber) === number;
              const recitationCategory = normalizePath(`/${r.category || ""}`).slice(1);
              return sameNumber && (!r.category || recitationCategory === category);
            });
            if (candidates.length > 0) {
              const latest = candidates.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
              tips[item.href] = `最近：${formatDate(latest.timestamp)}，${latest.success ? "成功" : "失敗"}`;
              continue;
            }
          }

          tips[item.href] = "尚無作答紀錄";
        }

        setRecordTips(tips);
      } catch {
        setRecordTips({});
      }
    };

    if (items.length > 0) run();
    else setRecordTips({});
  }, [items]);

  const moveDraggingItem = (fromHref: string, toHref: string) => {
    if (fromHref === toHref) return;

    setItems((prev) => {
      const fromIndex = prev.findIndex((item) => item.href === fromHref);
      const toIndex = prev.findIndex((item) => item.href === toHref);
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return prev;

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const updateDragGhostPosition = (clientX: number, clientY: number) => {
    setDragGhost((prev) => (prev ? { ...prev, x: clientX, y: clientY } : prev));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black text-center">
        <div className="flex flex-col items-center gap-6 text-center w-full">
          <h1 className="max-w-xs text-4xl font-bold zen-title">個人書櫃</h1>

          {items.length === 0 ? (
            <p className="text-sm zen-subtle">目前尚未收藏項目</p>
          ) : (
            <div className="bookshelf-scroll">
              <div className="bookshelf-grid">
                {items.map((item) => (
                  <div
                    key={item.href}
                    className={`relative group transition-all duration-300 ${draggingHref === item.href ? "opacity-60 scale-95" : ""} ${droppedHref === item.href ? "scale-105 ring-2 ring-zinc-400 dark:ring-zinc-500 rounded-lg" : ""}`}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", item.href);
                      const transparentImage = new Image();
                      transparentImage.src =
                        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                      event.dataTransfer.setDragImage(transparentImage, 0, 0);
                      setDraggingHref(item.href);
                      setDragGhost({ title: item.title, x: event.clientX, y: event.clientY });
                    }}
                    onDrag={(event) => {
                      if (event.clientX || event.clientY) {
                        updateDragGhostPosition(event.clientX, event.clientY);
                      }
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                      if (event.clientX || event.clientY) {
                        updateDragGhostPosition(event.clientX, event.clientY);
                      }
                      if (draggingHref && draggingHref !== item.href) {
                        moveDraggingItem(draggingHref, item.href);
                      }
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      const fromHref = event.dataTransfer.getData("text/plain");
                      if (!fromHref) return;
                      if (fromHref !== item.href) {
                        moveDraggingItem(fromHref, item.href);
                      }
                      setDroppedHref(item.href);
                      setTimeout(() => setDroppedHref(null), 220);
                    }}
                    onDragEnd={() => {
                      localStorage.setItem(STORAGE_KEY, JSON.stringify(itemsRef.current));
                      window.dispatchEvent(new Event("my-bookshelf-updated"));
                      setDraggingHref(null);
                      setDragGhost(null);
                    }}
                  >
                    <Link href={item.href} className="book-link" title={recordTips[item.href] || "尚無作答紀錄"}>
                      {item.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {dragGhost && (
        <div
          className="fixed z-[95] pointer-events-none"
          style={{ left: dragGhost.x, top: dragGhost.y, transform: "translate(-50%, -50%)" }}
        >
          <div className="book-link opacity-95 shadow-lg">{dragGhost.title}</div>
        </div>
      )}
    </div>
  );
}
