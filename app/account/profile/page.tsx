"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SocialLinks = { twitter?: string; github?: string; website?: string };

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});

  const router = useRouter();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch("/api/user/profile");
      if (!res.ok) {
        setError("無法載入使用者資料（請先登入）");
        setLoading(false);
        return;
      }
      const data = await res.json();
      const u = data.user;
      setName(u.name || "");
      setEmail(u.email || "");
      setBio(u.bio || "");
      setAvatarUrl(u.avatarUrl || "");
      setSocialLinks(u.socialLinks || {});
      setLoading(false);
    }
    load();
  }, []);

  async function uploadAvatar(file: File) {
    const reader = new FileReader();
    reader.onload = async () => {
      const data = reader.result as string;
      // send base64 data to server
      const res = await fetch("/api/user/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const j = await res.json();
      if (res.ok && j.url) setAvatarUrl(j.url);
      else setError(j?.error || "Upload failed");
    };
    reader.readAsDataURL(file);
  }

  async function save() {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio, avatarUrl, socialLinks }),
    });

    const j = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(j?.error || "Save failed");
      return;
    }
    // optionally reload or show success
    router.refresh();
  }

  if (loading) return <div className="p-12">載入中…</div>;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="w-full max-w-2xl zen-card p-8">
        <h1 className="text-2xl zen-title mb-4">我的檔案</h1>

        <div className="flex gap-6">
          <div className="w-40">
            <div className="mb-2">
              <img src={avatarUrl || "/avatar-placeholder.png"} alt="avatar" className="w-40 h-40 rounded-md object-cover" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadAvatar(f);
              }}
            />
          </div>

          <div className="flex-1">
            <label className="block mb-2">顯示名稱</label>
            <input className="w-full p-2 rounded-md mb-3" value={name} onChange={(e) => setName(e.target.value)} />

            <label className="block mb-2">Email</label>
            <input className="w-full p-2 rounded-md mb-3" value={email} readOnly />

            <label className="block mb-2">自我介紹</label>
            <textarea className="w-full p-2 rounded-md mb-3" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />

            <label className="block mb-2">社群連結</label>
            <input className="w-full p-2 rounded-md mb-2" placeholder="Twitter" value={socialLinks.twitter || ""} onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })} />
            <input className="w-full p-2 rounded-md mb-2" placeholder="GitHub" value={socialLinks.github || ""} onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })} />
            <input className="w-full p-2 rounded-md mb-2" placeholder="Website" value={socialLinks.website || ""} onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })} />

            <div className="mt-4">
              <button className="zen-button" onClick={save} disabled={saving}>{saving ? '儲存中...' : '儲存變更'}</button>
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
