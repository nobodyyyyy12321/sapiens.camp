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
        className="fixed top-4 left-4 z-60 p-2 rounded-md shadow-md border border-black/10 dark:border-white/10"
        style={{ backgroundColor: "var(--zen-bg)", color: "var(--zen-ink)" }}
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
      <aside
        className={`fixed top-0 left-0 h-full z-50 transform ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: 260, backgroundColor: "var(--zen-bg)", color: "var(--zen-ink)" }}
      >
        <div className="h-full p-6 pt-14 flex flex-col">

          <nav className="flex flex-col gap-2">
            <Link href="/" className="px-3 py-2 rounded border border-transparent hover:border-black/10 dark:hover:border-white/10">首頁</Link>
            <Link href="/quiz-bank" className="px-3 py-2 rounded border border-transparent hover:border-black/10 dark:hover:border-white/10">分科題庫</Link>
            <Link href="/stats" className="px-3 py-2 rounded border border-transparent hover:border-black/10 dark:hover:border-white/10">全站統計</Link>
          </nav>

          
        </div>
      </aside>
    </>
  );
}
