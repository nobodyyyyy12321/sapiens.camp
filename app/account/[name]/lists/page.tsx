"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ListsPage({ params }: { params: { name: string } }) {
  const router = useRouter();
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchLists = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/lists", { credentials: "include" });
      if (!res.ok) {
        const j = await res.json();
        console.error("Failed fetching lists:", res.status, j);
        alert(j.error || "取清單失敗");
        return;
      }
      const j = await res.json();
      if (j?.ok) setLists(j.lists || []);
    } catch (e) {
      console.error(e);
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchLists(); }, []);

  const createList = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch("/api/user/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim(), items: [] }),
      });
      const j = await res.json();
      if (j?.ok) {
        setNewTitle("");
        fetchLists();
      } else {
        alert(j.error || "Create failed");
      }
    } catch (e) { console.error(e); }
  };

  const deleteList = async (id: string) => {
    if (!confirm("確定要刪除此清單？")) return;
    try {
      const res = await fetch(`/api/user/lists/${id}`, { method: "DELETE" });
      const j = await res.json();
      if (j?.ok) fetchLists(); else alert(j.error || "Delete failed");
    } catch (e) { console.error(e); }
  };

  const editList = async (id: string) => {
    const title = prompt("新的清單名稱：");
    if (title === null) return;
    try {
      const res = await fetch(`/api/user/lists/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const j = await res.json();
      if (j?.ok) fetchLists(); else alert(j.error || "Update failed");
    } catch (e) { console.error(e); }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-transparent dark:bg-black">
      <main className="w-full max-w-2xl pt-8 px-8 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">清單</h2>
          <div>
            <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded">建立清單</button>
          </div>
        </div>

        {loading ? <p>載入中…</p> : (
          <div className="space-y-3">
            {lists.length === 0 ? <p className="text-sm">尚無清單</p> : lists.map(l => (
              <div key={l.id} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">{l.title}</div>
                  <div className="text-sm text-zinc-500">項目：{(l.items || []).length}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => router.push(`/account/${encodeURIComponent(params.name)}/lists/${l.id}`)} className="px-3 py-1 border rounded">管理</button>
                  <button onClick={() => editList(l.id)} className="px-3 py-1 border rounded">編輯</button>
                  <button onClick={() => deleteList(l.id)} className="px-3 py-1 border rounded text-red-600">刪除</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 p-6 rounded">
            <h3 className="text-lg font-medium mb-3">建立新清單</h3>
            <input className="w-full px-3 py-2 mb-3 border rounded" placeholder="清單名稱" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2" onClick={() => { setShowCreateModal(false); setNewTitle(""); }}>取消</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={async () => {
                await createList();
                setShowCreateModal(false);
              }}>建立</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
