import { NextResponse } from "next/server";
import { getArticles } from "../../../lib/articles-firebase";

export async function GET() {
  try {
    const articles = await getArticles();
    const categories = Array.from(
      new Set(articles.map((a) => a.category || a.type || "uncategorized"))
    );
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ categories: [] });
  }
}
