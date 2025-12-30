import { NextResponse } from "next/server";
import { getArticles } from "../../../lib/articles-firebase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ articles: [] });
    }

    const allArticles = await getArticles();
    const searchLower = query.toLowerCase();

    // Filter by title or author
    const results = allArticles.filter((article) => {
      const titleMatch = article.title?.toLowerCase().includes(searchLower);
      const authorMatch = article.author?.toLowerCase().includes(searchLower);
      return titleMatch || authorMatch;
    });

    // Sort by number
    results.sort((a, b) => (a.number || 0) - (b.number || 0));

    return NextResponse.json({ articles: results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ articles: [], error: "Search failed" }, { status: 500 });
  }
}
