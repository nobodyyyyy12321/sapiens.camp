"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-sm zen-subtle">載入中…</div>;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/auth/login" className="text-sm zen-subtle">登入</Link>
      </div>
    );
  }

  const name = session.user.name || session.user.email || "使用者";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm zen-subtle">{name}</span>
      <Link href="/account/profile" className="text-sm zen-subtle">我的檔案</Link>
      <button
        className="text-sm zen-ghost"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        登出
      </button>
    </div>
  );
}
