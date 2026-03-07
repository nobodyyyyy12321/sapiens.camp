"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthNav() {
  const { data: session, status } = useSession();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 300);
  };

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) return;
        const j = await res.json();
        if (j?.ok && mounted) {
          if (j.user?.avatarUrl) setAvatarUrl(j.user.avatarUrl);
          if (j.user?.name) setDisplayName(j.user.name);
        }
      } catch (e) {
        // ignore
      }
    }

    function onProfileUpdated() {
      loadProfile();
    }

    if (session?.user) loadProfile();
    window.addEventListener('profile:updated', onProfileUpdated);
    return () => { 
      mounted = false;
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      window.removeEventListener('profile:updated', onProfileUpdated);
    };
  }, [session]);

  if (status === "loading") {
    return <div className="text-sm zen-subtle">載入中…</div>;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/auth/login" className="zen-ghost px-3 py-1 rounded ml-2">登入</Link>
        <Link href="/auth/register" className="zen-ghost px-3 py-1 rounded">註冊</Link>
      </div>
    );
  }

  const name = displayName || session.user.name || session.user.email || "使用者";
  const encodedName = encodeURIComponent(name);

  const handleSignOut = async () => {
    try {
      await signOut({ redirectTo: "/" });
    } catch {
      window.location.href = "/api/auth/signout";
    }
  };

  return (
    <div className="flex items-center">
      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button 
          aria-haspopup="true" 
          aria-label="開啟個人選單"
          className="flex items-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={`${name} avatar`} className="w-11 h-11 rounded-full object-cover" />
          ) : session.user.image ? (
            <img src={session.user.image} alt={`${name} avatar`} className="w-11 h-11 rounded-full object-cover" />
          ) : (
            <span className="w-11 h-11 rounded-full bg-gray-600 text-white text-base font-semibold flex items-center justify-center">
              {name.slice(0, 1).toUpperCase()}
            </span>
          )}
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-44 rounded shadow-md z-20 border border-zinc-200 dark:border-zinc-800 bg-zen-paper dark:bg-zinc-900">
            <div className="py-1">
              <div className="px-4 py-3 text-sm truncate border-b border-zinc-200 dark:border-zinc-800" title={name}>{name}</div>
              <Link href={`/account/${encodedName}/profile`} className="block px-4 py-3 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">檔案</Link>
              <Link href={`/account/${encodedName}/record`} className="block px-4 py-3 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">紀錄</Link>
              <Link href={`/account/${encodedName}/lists`} className="block px-4 py-3 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">個人書櫃</Link>
              <Link href={`/account/${encodedName}/settings`} className="block px-4 py-3 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">設定</Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-3 !text-sm !leading-5 font-normal hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                登出
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
