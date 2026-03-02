"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem("sidebar-open");
      if (v !== null) setOpen(v === "1");
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("sidebar-open", open ? "1" : "0");
    } catch (e) {}
  }, [open]);

  return (
    <>
      {/* Toggle button */}
      <button
        aria-label="Toggle menu"
        onClick={() => setOpen((s) => !s)}
        className="fixed top-4 left-4 z-60 p-2 bg-white dark:bg-zinc-900 rounded-md shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          {open ? (
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          ) : (
            <path fillRule="evenodd" d="M3 5h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2z" clipRule="evenodd" />
          )}
        </svg>
      </button>

      {/* no overlay: sidebar should not cover content; main will shift */}

      {/* Sidebar panel */}
      <aside className={`fixed top-0 left-0 h-full bg-zen-paper dark:bg-zinc-900 z-50 transform ${open ? "translate-x-0" : "-translate-x-full"}`} style={{ width: 260 }}>
        <div className="h-full p-6 pt-14 flex flex-col">

          <nav className="flex flex-col gap-2">
            <Link href="/" className="px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">首頁</Link>
            <Link href="/study-chinese" className="px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">學中文</Link>
            <Link href="/study-chinese/wisdom" className="px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">小格言</Link>
            <Link href="/recitation" className="px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">詩文背誦</Link>
            <Link href="/math" className="px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">數學題庫</Link>
            <Link href="/traffic" className="px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">交通題庫</Link>
            <Link href="/ranking" className="px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">智人榜</Link>
            <Link href="/stats" className="px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">全站統計</Link>
            <Link href="/links" className="px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">正派網站連結</Link>
          </nav>

          <div className="mt-auto text-sm zen-subtle">&copy; 智人</div>
        </div>
      </aside>
    </>
  );
}
