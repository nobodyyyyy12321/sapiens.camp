import { NextResponse } from "next/server";
import { getFirestoreDB } from "../../../lib/firebase-admin";
import { promises as fs } from "fs";
import path from "path";

async function getArticlesFromFile() {
  try {
    const filePath = path.join(process.cwd(), "app", "data", "articles.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Failed to load articles from file:", error);
    return [];
  }
}

export async function POST() {
  try {
    const db = getFirestoreDB();
    const articlesCol = db.collection("articles");

    const testArticles = await getArticlesFromFile();
    
    if (!testArticles.length) {
      return NextResponse.json({ error: "No articles found" }, { status: 400 });
    }

    let added = 0;
    let skipped = 0;
    let updated = 0;
    const results: string[] = [];

    for (const article of testArticles) {
      // 1. 根據編號搜尋現有文件
      const snapshot = await articlesCol.where("number", "==", article.number).limit(1).get();
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const existingData = doc.data();
        const docRef = doc.ref;

        // 2. 比對欄位是否有差異
        // 我們過濾出 article 中與 existingData 不同的部分
        const updates: Record<string, any> = {};
        const entries = Object.entries(article) as [string, any][];
        for (const [key, value] of entries) {
          if (JSON.stringify(value) !== JSON.stringify(existingData[key])) {
            updates[key] = value;
          }
        }

        // 3. 如果有差異，執行更新
        if (Object.keys(updates).length > 0) {
          await docRef.update(updates);
          results.push(`🔄 已更新：${article.title} (更新了 ${Object.keys(updates).join(", ")} 欄位)`);
          updated++;
        } else {
          results.push(`⏭️ 跳過：${article.title} (內容一致，無需更新)`);
          skipped++;
        }
        continue;
      }

      // 4. 完全不存在則新增
      await articlesCol.add(article);
      results.push(`✅ 已新增：${article.title}`);
      added++;
    }

    return NextResponse.json({
      success: true,
      added,
      updated,
      skipped,
      results,
      message: `完成！新增 ${added} 篇，更新 ${updated} 篇，跳過 ${skipped} 篇`
    });
  } catch (error: any) {
    console.error("Seed poems error:", error);
    return NextResponse.json({ error: error.message || "Failed to seed poems" }, { status: 500 });
  }
}
