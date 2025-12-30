"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

type SocialLinks = { x?: string;facebook?: string; instagram?: string; website?: string };

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    setEditing(false);
    router.refresh();
  }

  function makeSocialHref(platform: string, value?: string) {
    if (!value) return null;
    const v = value.trim();
    if (v.startsWith("http://") || v.startsWith("https://")) return v;
    const clean = v.replace(/^@+/, "");
    switch (platform) {
      case "facebook":
        return `https://facebook.com/${clean}`;
      case "instagram":
        return `https://instagram.com/${clean}`;
      case "x":
        return `https://x.com/${clean}`;
      case "website":
        return clean.startsWith("http") ? clean : `https://${clean}`;
      default:
        return null;
    }
  }

  function handleShare() {
    const url = window.location.href;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 1500);
      }).catch(() => {
        window.prompt("複製連結", url);
      });
    } else {
      window.prompt("複製連結", url);
    }
  }

  if (loading) return <div className="p-12">載入中…</div>;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="w-full max-w-2xl zen-card p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl zen-title mb-4">我的檔案</h1>
          <div className="flex items-center gap-2">
            <button className="zen-ghost" onClick={handleShare}>
              {shareCopied ? "已複製" : "分享連結"}
            </button>
            {!editing ? (
              <button className="zen-button" onClick={() => setEditing(true)}>編輯</button>
            ) : (
              <div className="flex items-center gap-2">
                <button className="zen-button" onClick={save} disabled={saving}>{saving ? '儲存中...' : '儲存'}</button>
                <button className="zen-ghost" onClick={() => setEditing(false)}>取消</button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          <div className="w-40 flex flex-col items-center">
            <div className="mb-2">
              <img src={avatarUrl || "/avatar-placeholder.svg"} alt="avatar" className="w-40 h-40 rounded-md object-cover" />
            </div>
            {editing && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadAvatar(f);
                  }}
                />
                <button type="button" className="zen-button mt-2" onClick={() => fileInputRef.current?.click()}>選擇檔案</button>
              </>
            )}
          </div>

          <div className="flex-1">
            <label className="block mb-2">顯示名稱</label>
            {editing ? (
              <input className="w-full p-2 rounded-md mb-3" value={name} onChange={(e) => setName(e.target.value)} />
            ) : (
              <div className="mb-3">{name}</div>
            )}

            <label className="block mb-2">Email</label>
            <div className="mb-3">{email}</div>

            <label className="block mb-2">自我介紹</label>
            {editing ? (
              <textarea className="w-full p-2 rounded-md mb-3" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
            ) : (
              <div className="mb-3 whitespace-pre-wrap">{bio || <span className="text-gray-500">尚未設定</span>}</div>
            )}

            <label className="block mb-2">社群連結</label>
            {editing ? (
              <>
                <input className="w-full p-2 rounded-md mb-2" placeholder="Facebook" value={(socialLinks as any).facebook || ""} onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })} />
                <input className="w-full p-2 rounded-md mb-2" placeholder="Instagram" value={(socialLinks as any).instagram || ""} onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })} />
                <input className="w-full p-2 rounded-md mb-2" placeholder="X (Twitter)" value={(socialLinks as any).x || ""} onChange={(e) => setSocialLinks({ ...socialLinks, x: e.target.value })} />
                <input className="w-full p-2 rounded-md mb-2" placeholder="Website" value={(socialLinks as any).website || ""} onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })} />
              </>
            ) : (
              <div className="mb-3">
                {(socialLinks as any).facebook && (() => {
                  const href = makeSocialHref("facebook", (socialLinks as any).facebook);
                  return (
                    <div className="flex items-center gap-2">
                      <a href={href || undefined} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-accent">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 12a10 10 0 10-11.5 9.9v-7H8.9v-2.9h1.6V9.4c0-1.6 1-2.6 2.5-2.6.7 0 1.4.1 1.4.1v1.6h-.8c-.8 0-1 .5-1 1v1.3h1.7l-.3 2.9h-1.4v7A10 10 0 0022 12z" />
                        </svg>
                      </a>
                      <a href={href || undefined} target="_blank" rel="noreferrer" className="text-accent">{(socialLinks as any).facebook}</a>
                    </div>
                  );
                })()}

                {(socialLinks as any).instagram && (() => {
                  const href = makeSocialHref("instagram", (socialLinks as any).instagram);
                  return (
                    <div className="flex items-center gap-2">
                      <a href={href || undefined} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-accent">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                        </svg>
                      </a>
                      <a href={href || undefined} target="_blank" rel="noreferrer" className="text-accent">{(socialLinks as any).instagram}</a>
                    </div>
                  );
                })()}

                {(socialLinks as any).x && (() => {
                  const href = makeSocialHref("x", (socialLinks as any).x);
                  return (
                    <div className="flex items-center gap-2">
                      <a href={href || undefined} target="_blank" rel="noreferrer" aria-label="X" className="text-accent">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-black text-white rounded">X</span>
                      </a>
                      <a href={href || undefined} target="_blank" rel="noreferrer" className="text-accent">{(socialLinks as any).x}</a>
                    </div>
                  );
                })()}

                {socialLinks.website && (() => {
                  const href = makeSocialHref("website", socialLinks.website);
                  return (
                    <div className="flex items-center gap-2">
                      <a href={href || undefined} target="_blank" rel="noreferrer" aria-label="Website" className="text-accent">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M2 12h20M12 2c2.5 3 2.5 10 0 20" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                      </a>
                      <a href={href || undefined} target="_blank" rel="noreferrer" className="text-accent">{socialLinks.website}</a>
                    </div>
                  );
                })()}

                {!((socialLinks as any).facebook || (socialLinks as any).instagram || (socialLinks as any).x || socialLinks.website) && <div className="text-gray-500">尚未設定</div>}
              </div>
            )}

            <div className="mt-4">
              {!editing && <></>}
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
