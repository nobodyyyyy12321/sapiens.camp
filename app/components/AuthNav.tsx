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
        <Link href="/auth/login" className="zen-ghost px-3 py-1 rounded">登入</Link>
        <Link href="/auth/register" className="zen-button px-3 py-1 rounded">註冊</Link>
      </div>
    );
  }

  const name = displayName || session.user.name || session.user.email || "使用者";
  const encodedName = encodeURIComponent(name);

  return (
    <div className="flex items-center gap-3">
      {avatarUrl ? (
        <img src={avatarUrl} alt={`${name} avatar`} className="w-8 h-8 rounded-full object-cover" />
      ) : session.user.image ? (
        <img src={session.user.image} alt={`${name} avatar`} className="w-8 h-8 rounded-full object-cover" />
      ) : null}

      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button 
          aria-haspopup="true" 
          className="zen-subtle flex items-center gap-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span>{name}</span>
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
          </svg>
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-black text-white rounded shadow-md z-20 border border-gray-800">
            <div className="py-1">
              <Link href={`/account/${encodedName}/profile`} className="block px-4 py-2 text-sm hover:bg-gray-800">個人資料</Link>
              <Link href={`/account/${encodedName}/record`} className="block px-4 py-2 text-sm hover:bg-gray-800">紀錄</Link>
              <Link href={`/account/${encodedName}/settings`} className="block px-4 py-2 text-sm hover:bg-gray-800">設定</Link>
              <Link href={`/account/${encodedName}/lists`} className="block px-4 py-2 text-sm hover:bg-gray-800">清單</Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-800"
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
