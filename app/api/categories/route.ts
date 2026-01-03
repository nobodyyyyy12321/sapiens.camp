import { NextResponse } from "next/server";
import { getArticles } from "../../../lib/articles-firebase";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const language = url.searchParams.get("language");

    const articles = await getArticles();

    const languages = Array.from(
      new Set(articles.map((a) => (a.language ? a.language : "中文")))
    );

    let filtered = articles;
    if (language) {
      filtered = articles.filter((a) => (a.language ? a.language : "中文") === language);
    }

    const categories = Array.from(
      new Set(filtered.map((a) => a.category || a.type || "uncategorized"))
    );

    return NextResponse.json({ categories, languages });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ categories: [], languages: [] });
  }
}
