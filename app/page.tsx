"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";

type HomeContentProps = {
  categories: string[];
  siteTitle: string;
  isSimplified: boolean;
  language: string;
};

type SearchArticle = {
  title?: string;
  author?: string;
  category?: string;
  number?: number;
};

function HomeContent({ categories, siteTitle, isSimplified, language }: HomeContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [loadedCategories, setLoadedCategories] = useState<string[]>([]);
  const [subjectQuery, setSubjectQuery] = useState("");
  const [articleMatches, setArticleMatches] = useState<Array<{ name: string; href: string }>>([]);
  const subjects =
    language === "en"
      ? [
          { name: "Learn Chinese", href: "/study-chinese" },
        ]
      : language === "zh-CN"
        ? [
            { name: "诗文背诵", href: "/recitation" },
            { name: "国文", href: "/chinese" },
            { name: "英文", href: "/english" },
          { name: "公职考试", href: "/公職考試" },
            { name: "名言佳句", href: "/quote" },
            { name: "综合", href: "/綜合" },
            { name: "撩语录", href: "/under-construction" },
            { name: "八卦", href: "/under-construction" },
            { name: "猜谜", href: "/under-construction" },
            { name: "笑话", href: "/under-construction" },
            { name: "数学", href: "/math" },
            { name: "物理", href: "/physics" },
            { name: "化学", href: "/under-construction" },
            { name: "生物", href: "/under-construction" },
            { name: "地理", href: "/under-construction" },
            { name: "天文", href: "/under-construction" },
            { name: "历史", href: "/under-construction" },
            { name: "公民", href: "/under-construction" },
            { name: "心理", href: "/under-construction" },
            { name: "自然", href: "/natural" },
            { name: "社会", href: "/social" },
          ]
        : [
            { name: "詩文背誦", href: "/recitation" },
            { name: "國文", href: "/chinese" },
            { name: "英文", href: "/english" },
          { name: "公職考試", href: "/公職考試" },
            { name: "名言佳句", href: "/quote" },
            { name: "綜合", href: "/綜合" },
            { name: "撩語錄", href: "/under-construction" },
            { name: "八卦", href: "/under-construction" },
            { name: "猜謎", href: "/under-construction" },
            { name: "笑話", href: "/under-construction" },
            { name: "數學", href: "/math" },
            { name: "物理", href: "/physics" },
            { name: "化學", href: "/under-construction" },
            { name: "生物", href: "/under-construction" },
            { name: "地理", href: "/under-construction" },
            { name: "天文", href: "/under-construction" },
            { name: "歷史", href: "/under-construction" },
            { name: "公民", href: "/under-construction" },
            { name: "心理", href: "/under-construction" },
            { name: "自然", href: "/natural" },
            { name: "社會", href: "/social" },
          ];

  const childSubjects =
    language === "en"
      ? []
      : language === "zh-CN"
        ? [
            { name: "2000单字", href: "/english/2000" },
          { name: "台电", href: "/台電" },
          { name: "台水", href: "/台水" },
          { name: "中油", href: "/中油" },
          { name: "高普考", href: "/高普考" },
            { name: "算数", href: "/under-construction" },
            { name: "代数", href: "/under-construction" },
            { name: "几何", href: "/under-construction" },
            { name: "三角函数", href: "/under-construction" },
            { name: "指数与复数", href: "/under-construction" },
            { name: "解析几何", href: "/under-construction" },
            { name: "统计", href: "/under-construction" },
            { name: "排列组合", href: "/under-construction" },
            { name: "微积分", href: "/under-construction" },
            { name: "微分方程", href: "/under-construction" },
            { name: "线性代数", href: "/under-construction" },
            { name: "复变函数", href: "/under-construction" },
          ]
        : [
            { name: "2000單字", href: "/english/2000" },
          { name: "台電", href: "/台電" },
          { name: "台水", href: "/台水" },
          { name: "中油", href: "/中油" },
          { name: "高普考", href: "/高普考" },
            { name: "算數", href: "/under-construction" },
            { name: "代數", href: "/under-construction" },
            { name: "幾何", href: "/under-construction" },
            { name: "三角函數", href: "/under-construction" },
            { name: "指數與複數", href: "/under-construction" },
            { name: "解析幾何", href: "/under-construction" },
            { name: "統計", href: "/under-construction" },
            { name: "排列組合", href: "/under-construction" },
            { name: "微積分", href: "/under-construction" },
            { name: "微分方程", href: "/under-construction" },
            { name: "線性代數", href: "/under-construction" },
            { name: "複變函數", href: "/under-construction" },
          ];

  useEffect(() => {
    const q = subjectQuery.trim();
    if (q.length < 2) {
      setArticleMatches([]);
      return;
    }

    const controller = new AbortController();
    const debounce = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : { articles: [] }))
        .then((data) => {
          const results: SearchArticle[] = Array.isArray(data?.articles) ? data.articles : [];
          const mapped = results
            .filter((article) => article?.title && article?.number)
            .slice(0, 30)
            .map((article) => ({
              name: `${article.number} · ${article.title}${article.author ? ` - ${article.author}` : ""}`,
              href: `/${encodeURIComponent(article.category || "未分類")}/${article.number}`,
            }));
          setArticleMatches(mapped);
        })
        .catch(() => {
          setArticleMatches([]);
        });
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(debounce);
    };
  }, [subjectQuery]);

  const filteredSubjects = useMemo(() => {
    const q = subjectQuery.trim().toLowerCase();
    if (!q) return subjects;
    const rangePattern = /^\d+\s*-\s*\d+$/;
    const searchPool = [...subjects, ...childSubjects].filter((subject) => !rangePattern.test(subject.name.trim()));
    const subjectMatches = searchPool.filter((subject) => subject.name.toLowerCase().includes(q));
    const unique = new Map<string, { name: string; href: string }>();

    for (const item of subjectMatches) {
      unique.set(`${item.name}::${item.href}`, item);
    }

    for (const item of articleMatches) {
      unique.set(`${item.name}::${item.href}`, item);
    }

    return Array.from(unique.values());
  }, [subjects, childSubjects, subjectQuery, articleMatches]);

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setLoadedCategories(data.categories || []))
      .catch((err) => console.error("Failed to fetch categories:", err));

    // global stats moved to /stats page
  }, []);

  useEffect(() => {
    const verified = searchParams?.get("verified");
    const error = searchParams?.get("error");

    if (verified === "1") {
      setVerificationMessage("success");
      window.history.replaceState({}, "", "/");
    } else if (verified === "0") {
      if (error === "missing_token") setVerificationMessage("missing_token");
      else if (error === "invalid_token") setVerificationMessage("invalid_token");
      else if (error === "expired") setVerificationMessage("expired");
      else setVerificationMessage("error");
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-transparent dark:bg-black">
        {verificationMessage && (
          <div className={`w-full mb-6 p-4 rounded-md ${
            verificationMessage === "success"
              ? "bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300"
              : "bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
          }`}>
            {verificationMessage === "success" && (
              <p className="font-medium">✅ 電子郵件驗證成功！您現在可以登入了。</p>
            )}
            {verificationMessage === "missing_token" && (
              <p className="font-medium">❌ 驗證連結無效：缺少驗證令牌。</p>
            )}
            {verificationMessage === "invalid_token" && (
              <p className="font-medium">❌ 驗證連結無效：令牌不存在或已使用。</p>
            )}
            {verificationMessage === "expired" && (
              <p className="font-medium">❌ 驗證連結已過期，請重新申請驗證郵件。</p>
            )}
            {verificationMessage === "error" && (
              <p className="font-medium">❌ 驗證過程中發生錯誤，請稍後再試。</p>
            )}
          </div>
        )}

        <div className="flex flex-col items-center gap-6 text-center">
          <h1
            className={`max-w-xs text-4xl font-bold ${isSimplified ? "zen-title-sc" : "zen-title"}`}
          >
            {siteTitle}
          </h1>
          <p className="max-w-md text-lg leading-8 zen-subtle">sapiens.camp</p>
          <div className="fixed left-10 bottom-6 z-30 inline-block group">
            <button
              className="relative px-6 py-3 text-sm font-semibold text-white bg-zinc-700/90 rounded-xl hover:bg-zinc-800/90 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 overflow-hidden"
              aria-label="查看公告"
              type="button"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-400/20 to-zinc-600/20 blur-xl group-hover:opacity-75 transition-opacity"></div>

              <span className="relative flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill="none"
                  className="w-4 h-4"
                >
                  <path
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
                公告
              </span>
            </button>

            <div className="pointer-events-none absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 bottom-full left-0 mb-3 w-72 transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-2 z-20">
              <div className="relative p-4 bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(113,113,122,0.2)] text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-500/20">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-zinc-300"
                    >
                      <path
                        clipRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">網站公告</h3>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-300">
                    目前有內容的只有詩文背誦、英文、Learn Chinese、名言佳句。
                  </p>
                </div>

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-zinc-400/10 to-zinc-600/10 blur-xl opacity-50"></div>

                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-gray-900/95 to-gray-800/95 rotate-45 border-r border-b border-white/10"></div>
              </div>
            </div>
          </div>
          {/* 全站統計已移至 「全站統計」 頁面 */}

          <div className="mt-4 flex w-full max-w-5xl flex-col gap-10">
            <input
              className="w-full max-w-sm mx-auto p-3 rounded-full border border-zinc-200 text-sm"
              style={{ backgroundColor: "var(--zen-bg)", color: "var(--zen-ink)" }}
              placeholder={language === "en" ? "Search subjects" : language === "zh-CN" ? "搜索科目" : "搜尋科目"}
              value={subjectQuery}
              onChange={(e) => setSubjectQuery(e.target.value)}
              aria-label={language === "en" ? "Search subjects" : language === "zh-CN" ? "搜索科目" : "搜尋科目"}
            />
            <div className="w-full overflow-visible">
              <div className="bookshelf-grid home-bookshelf-grid">
                {filteredSubjects.map((subject) => (
                  <Link
                    key={subject.name}
                    href={subject.href}
                    className="book-link"
                  >
                    {subject.name}
                  </Link>
                ))}
              </div>
            </div>
            {filteredSubjects.length === 0 && (
              <p className="text-sm zen-subtle text-center">
                {language === "en" ? "No matching subjects or recitation titles" : language === "zh-CN" ? "没有符合的科目或诗文标题" : "沒有符合的科目或詩文標題"}
              </p>
            )}
          </div>
        </div>

        <footer className="w-full mt-auto pt-16 pb-6 flex items-center justify-center">
          <Link
            href="/feedback"
            className="inline-flex items-center justify-center whitespace-nowrap px-4 py-2 rounded-full bg-transparent text-[var(--zen-ink)] text-sm leading-none cursor-pointer hover:opacity-90 transition-opacity"
          >
            意見回饋
          </Link>
        </footer>
      </main>
    </div>
  );
}

export default function Home() {
  const [siteTitle, setSiteTitle] = useState("智人題庫");
  const [isSimplified, setIsSimplified] = useState(false);
  const [language, setLanguage] = useState("zh-TW");

  useEffect(() => {
    const syncTitle = () => {
      const language = localStorage.getItem("siteLanguage") || "zh-TW";
      setLanguage(language);
      setIsSimplified(language === "zh-CN");
      setSiteTitle(language === "zh-CN" ? "智人题库" : "智人題庫");
    };

    syncTitle();
    window.addEventListener("storage", syncTitle);
    window.addEventListener("site-language-change", syncTitle);
    return () => {
      window.removeEventListener("storage", syncTitle);
      window.removeEventListener("site-language-change", syncTitle);
    };
  }, []);

  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-16 bg-white dark:bg-black">
          <div className="flex flex-col items-center gap-6 text-center">
            <h1
              className={`max-w-xs text-4xl font-bold ${isSimplified ? "zen-title-sc" : "zen-title"}`}
            >
              {siteTitle}
            </h1>
            <p className="max-w-md text-lg leading-8 zen-subtle">sapiens.camp</p>

            <div className="mt-4 flex w-full max-w-5xl flex-col gap-10">
              {(language === "en"
                ? [
                    { name: "Learn Chinese", href: "/study-chinese" },
                  ]
                : language === "zh-CN"
                  ? [
                      { name: "诗文背诵", href: "/recitation" },
                      { name: "国文", href: "/chinese" },
                      { name: "英文", href: "/english" },
                      { name: "名言佳句", href: "/quote" },
                      { name: "综合", href: "/綜合" },
                      { name: "撩语录", href: "/under-construction" },
                      { name: "数学", href: "/math" },
                      { name: "物理", href: "/physics" },
                      { name: "化学", href: "/under-construction" },
                      { name: "生物", href: "/under-construction" },
                      { name: "地理", href: "/under-construction" },
                      { name: "历史", href: "/under-construction" },
                      { name: "公民", href: "/under-construction" },
                      { name: "心理", href: "/under-construction" },
                      { name: "自然", href: "/natural" },
                      { name: "社会", href: "/social" },
                    ]
                  : [
                      { name: "詩文背誦", href: "/recitation" },
                      { name: "國文", href: "/chinese" },
                      { name: "英文", href: "/english" },
                      { name: "名言佳句", href: "/quote" },
                      { name: "綜合", href: "/綜合" },
                      { name: "撩語錄", href: "/under-construction" },
                      { name: "數學", href: "/math" },
                      { name: "物理", href: "/physics" },
                      { name: "化學", href: "/under-construction" },
                      { name: "生物", href: "/under-construction" },
                      { name: "地理", href: "/under-construction" },
                      { name: "歷史", href: "/under-construction" },
                      { name: "公民", href: "/under-construction" },
                      { name: "心理", href: "/under-construction" },
                      { name: "自然", href: "/natural" },
                      { name: "社會", href: "/social" },
                    ]
              ).length > 0 && (
                <div className="w-full overflow-visible">
                  <div className="bookshelf-grid home-bookshelf-grid">
                    {(language === "en"
                      ? [
                          { name: "Learn Chinese", href: "/study-chinese" },
                        ]
                      : language === "zh-CN"
                        ? [
                            { name: "诗文背诵", href: "/recitation" },
                            { name: "国文", href: "/chinese" },
                            { name: "英文", href: "/english" },
                            { name: "名言佳句", href: "/quote" },
                            { name: "综合", href: "/綜合" },
                            { name: "撩语录", href: "/under-construction" },
                            { name: "数学", href: "/math" },
                            { name: "物理", href: "/physics" },
                            { name: "化学", href: "/under-construction" },
                            { name: "生物", href: "/under-construction" },
                            { name: "地理", href: "/under-construction" },
                            { name: "历史", href: "/under-construction" },
                            { name: "公民", href: "/under-construction" },
                            { name: "心理", href: "/under-construction" },
                            { name: "自然", href: "/natural" },
                            { name: "社会", href: "/social" },
                          ]
                        : [
                            { name: "詩文背誦", href: "/recitation" },
                            { name: "國文", href: "/chinese" },
                            { name: "英文", href: "/english" },
                            { name: "名言佳句", href: "/quote" },
                            { name: "綜合", href: "/綜合" },
                            { name: "撩語錄", href: "/under-construction" },
                            { name: "數學", href: "/math" },
                            { name: "物理", href: "/physics" },
                            { name: "化學", href: "/under-construction" },
                            { name: "生物", href: "/under-construction" },
                            { name: "地理", href: "/under-construction" },
                            { name: "歷史", href: "/under-construction" },
                            { name: "公民", href: "/under-construction" },
                            { name: "心理", href: "/under-construction" },
                            { name: "自然", href: "/natural" },
                            { name: "社會", href: "/social" },
                          ]
                    ).map((subject) => (
                      <Link
                        key={subject.name}
                        href={subject.href}
                        className="book-link"
                      >
                        {subject.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <footer className="w-full mt-auto pt-16 pb-6 flex items-center justify-center">
            <Link
              href="/feedback"
              className="inline-flex items-center justify-center whitespace-nowrap px-4 py-2 rounded-full bg-transparent text-[var(--zen-ink)] text-sm leading-none cursor-pointer hover:opacity-90 transition-opacity"
            >
              意見回饋
            </Link>
          </footer>
        </main>
      </div>
    }>
      <HomeContent categories={[]} siteTitle={siteTitle} isSimplified={isSimplified} language={language} />
    </Suspense>
  );
}
