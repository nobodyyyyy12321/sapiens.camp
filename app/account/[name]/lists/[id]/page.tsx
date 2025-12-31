"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ManageList({ params }: { params: { name: string; id: string } }) {
  const router = useRouter();
  const [list, setList] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState("");

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/lists/${params.id}`, { credentials: "include" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        console.error("Failed fetching list:", res.status, j);
        if (res.status === 401) return router.push("/auth/login");
        alert(j.error || "取清單失敗");
        return;
      }
      const j = await res.json();
      if (j?.ok) setList(j.list);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchList(); }, [params.id]);

  const addItem = async () => {
    if (!newItem.trim()) return;
    try {
      const items = [...(list.items || []), newItem.trim()];
      const res = await fetch(`/api/user/lists/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items }),
      });
      const j = await res.json();
      if (!res.ok) {
        console.error("Failed patching list:", res.status, j);
        alert(j.error || "更新清單失敗");
        return;
      }
      if (j?.ok) setList(j.list);
      setNewItem("");
    } catch (e) { console.error(e); }
  };

  const removeItem = async (idx: number) => {
    try {
      const items = (list.items || []).filter((_: any, i: number) => i !== idx);
      const res = await fetch(`/api/user/lists/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items }),
      });
      const j = await res.json();
      if (!res.ok) {
        console.error("Failed patching list:", res.status, j);
        alert(j.error || "更新清單失敗");
        return;
      }
      if (j?.ok) setList(j.list);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent dark:bg-black">
      <main className="w-full max-w-2xl p-8">
        <button className="mb-4 text-sm" onClick={() => router.push(`/account/${encodeURIComponent(params.name)}/lists`)}>← 返回 清單</button>
        {loading ? <p>載入中…</p> : (
          <div>
            <h2 className="text-2xl font-bold mb-3">{list?.title}</h2>
            <div className="mb-3">
              <input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="新增文章 ID 或號碼" className="px-3 py-2 border rounded w-full" />
              <div className="mt-2 flex gap-2">
                <button onClick={addItem} className="px-4 py-2 bg-blue-600 text-white rounded">新增</button>
              </div>
            </div>

            <div className="space-y-2">
              {(list?.items || []).map((it: any, idx: number) => (
                <div key={idx} className="p-3 border rounded flex items-center justify-between">
                  <div className="text-sm">{it}</div>
                  <button onClick={() => removeItem(idx)} className="text-red-600">刪除</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
