"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type RecitationRecord = {
  articleId: string;
  articleNumber: number;
  title: string;
  success: boolean;
  timestamp: string;
  category?: string;
};

type QuoteRecord = {
  answered: number;
  correct: number;
  set: string;
  timestamp: string;
  category: "名言佳句";
};

type QuizRecord = {
  answered: number;
  correct: number;
  set: string;
  timestamp: string;
  category: "英文" | "Learn Chinese" | "交通";
};

type Subject = "詩文背誦" | "英文" | "Learn Chinese" | "名言佳句" | "數學" | "交通";

export default function RecordsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [recitations, setRecitations] = useState<RecitationRecord[]>([]);
  const [quoteRecords, setQuoteRecords] = useState<QuoteRecord[]>([]);
  const [englishRecords, setEnglishRecords] = useState<QuizRecord[]>([]);
  const [studyChineseRecords, setStudyChineseRecords] = useState<QuizRecord[]>([]);
  const [trafficRecords, setTrafficRecords] = useState<QuizRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);
  const [recitationsPublic, setRecitationsPublic] = useState(false);
  const [userName, setUserName] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject>("詩文背誦");

  useEffect(() => {
    const nameParam = params?.name;
    if (!nameParam || typeof nameParam !== "string") {
      router.push("/");
      return;
    }

    const decodedName = decodeURIComponent(nameParam);
    setUserName(decodedName);

    // Fetch the user's profile
    fetch(`/api/user/profile?name=${encodeURIComponent(decodedName)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          // Consider owner true if server marked isOwner, or session email matches profile email,
          // or session name matches the decoded name (fallback)
          const owner = Boolean(data.user.isOwner) || (session?.user?.email && session.user.email === data.user.email) || session?.user?.name === decodedName;
          setIsOwner(owner);
          setRecitationsPublic(data.user.recitationsPublic ?? false);

          // Show records if owner or if public
          if (owner || data.user.recitationsPublic) {
            setRecitations(data.user.recitations || []);
            setQuoteRecords(data.user.quoteRecords || []);
            setEnglishRecords(data.user.englishRecords || []);
            setStudyChineseRecords(data.user.studyChineseRecords || []);
            setTrafficRecords(data.user.trafficRecords || []);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch recitations:", err);
        setLoading(false);
      });
  }, [status, session, router, params]);

  if (loading || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent dark:bg-black">
        <main className="w-full max-w-2xl p-8 text-center">
          <p className="text-sm zen-subtle">載入中...</p>
        </main>
      </div>
    );
  }

  const subjects: Subject[] = ["詩文背誦", "英文", "Learn Chinese", "名言佳句", "數學", "交通"];

  const filterRecitations = (records: RecitationRecord[]): RecitationRecord[] => {
    return records.filter(r => (r.category || "詩文背誦") === selectedSubject);
  };

  const filteredRecitations = filterRecitations(recitations);
  const filteredAttempts = filteredRecitations.length;
  const filteredSuccessCount = filteredRecitations.filter(r => r.success).length;

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black">
        <div className="flex items-center justify-between w-full max-w-md mb-8">
          <h1 className="text-4xl font-bold zen-title">
            {userName ? `${userName} 的紀錄` : "紀錄"}
          </h1>
          <div className="flex items-center gap-2">
            {userName && (
              <Link href={`/account/${encodeURIComponent(userName)}/profile`} className="zen-ghost">個人檔案</Link>
            )}
            {isOwner && (
              <button className="zen-ghost" onClick={handleShare}>
                {shareCopied ? "已複製" : "分享連結"}
              </button>
            )}
          </div>
        </div>

        {!isOwner && !recitationsPublic ? (
          <div className="w-full max-w-md text-center py-12">
            <p className="text-gray-500">此用戶的背誦紀錄為不公開</p>
          </div>
        ) : (
          <div className="w-full max-w-md space-y-6">
            {/* Subject Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-zinc-800">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-4 py-2 font-medium transition-colors ${
                    selectedSubject === subject
                      ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>

            {selectedSubject === "詩文背誦" && (
              <>
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 text-center">
                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">背誦嘗試次數</p>
                    <p className="text-4xl font-bold text-purple-700 dark:text-purple-300">{filteredAttempts}</p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">背誦成功次數</p>
                    <p className="text-4xl font-bold text-blue-700 dark:text-blue-300">{filteredSuccessCount}</p>
                  </div>
                </div>

                {/* Records List */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">背誦歷史</h2>
                  {filteredRecitations.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">尚無背誦紀錄</p>
                ) : (
                  <div className="space-y-3">
                    {filteredRecitations.slice().reverse().map((record, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors ${
                      record.success 
                        ? "border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10" 
                        : "border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{record.title}</p>
                        <p className="text-sm mt-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                            record.success 
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}>
                            {record.success ? "✓ 成功" : "✗ 失敗"}
                          </span>
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(record.timestamp).toLocaleDateString("zh-TW", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
            </>
            )}
            {selectedSubject === "名言佳句" && (
              <>
                {/* Records List */}
                <div className="mt-8">
                  {quoteRecords.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">尚無練習紀錄</p>
                  ) : (
                    <div className="space-y-3">
                      {quoteRecords.slice().reverse().map((record, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-900/10"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">名言佳句 {record.set}</p>
                              <p className="text-sm mt-1">
                                <span className="inline-block px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                  寫 {record.answered} 題，對 {record.correct} 題
                                </span>
                              </p>
                            </div>
                            <p className="text-xs text-gray-400">
                              {new Date(record.timestamp).toLocaleDateString("zh-TW", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {selectedSubject === "英文" && (
              <>
                <div className="mt-8">
                  {englishRecords.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">尚無練習紀錄</p>
                  ) : (
                    <div className="space-y-3">
                      {englishRecords.slice().reverse().map((record, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-900/10"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">英文 {record.set}</p>
                              <p className="text-sm mt-1">
                                <span className="inline-block px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                                  寫 {record.answered} 題，對 {record.correct} 題
                                </span>
                              </p>
                            </div>
                            <p className="text-xs text-gray-400">
                              {new Date(record.timestamp).toLocaleDateString("zh-TW", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {selectedSubject === "Learn Chinese" && (
              <>
                <div className="mt-8">
                  {studyChineseRecords.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">尚無練習紀錄</p>
                  ) : (
                    <div className="space-y-3">
                      {studyChineseRecords.slice().reverse().map((record, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors border-cyan-200 dark:border-cyan-800 bg-cyan-50/30 dark:bg-cyan-900/10"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">學中文 {record.set}</p>
                              <p className="text-sm mt-1">
                                <span className="inline-block px-2 py-0.5 rounded text-xs bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
                                  寫 {record.answered} 題，對 {record.correct} 題
                                </span>
                              </p>
                            </div>
                            <p className="text-xs text-gray-400">
                              {new Date(record.timestamp).toLocaleDateString("zh-TW", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {selectedSubject === "交通" && (
              <>
                <div className="mt-8">
                  {trafficRecords.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">尚無練習紀錄</p>
                  ) : (
                    <div className="space-y-3">
                      {trafficRecords.slice().reverse().map((record, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">交通題庫 {record.set}</p>
                              <p className="text-sm mt-1">
                                <span className="inline-block px-2 py-0.5 rounded text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                  寫 {record.answered} 題，對 {record.correct} 題
                                </span>
                              </p>
                            </div>
                            <p className="text-xs text-gray-400">
                              {new Date(record.timestamp).toLocaleDateString("zh-TW", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
