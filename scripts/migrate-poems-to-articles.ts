import { getFirestoreDB } from "../lib/firebase-admin";

/**
 * 遷移腳本：將 Firestore 中的 `poems` 集合遷移到新的 `articles` 集合。
 * 使用方法：
 *   - 確認 .env.local 有 Firebase Admin 欄位
 *   - 執行：npx tsx scripts/migrate-poems-to-articles.ts
 */

async function migrate() {
  try {
    console.log("開始將 poems 遷移到 articles...");
    const db = getFirestoreDB();
    const poemsCol = db.collection("poems");
    const articlesCol = db.collection("articles");

    const snapshot = await poemsCol.get();
    if (snapshot.empty) {
      console.log("找不到任何 poems 文件，無需遷移。\n");
      process.exit(0);
    }

    console.log(`找到 ${snapshot.size} 首詩，開始遷移...`);

    let success = 0;
    let skipped = 0;
    let errored = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const id = doc.id;

      // 將字段映射到 articles 結構（保留原樣，並加入 type="poem"）
      const articleData: any = {
        ...data,
        type: data.category || "poem",
        originalCollection: "poems",
        migratedAt: new Date().toISOString(),
      };

      // 移除 undefined 欄位
      Object.keys(articleData).forEach((k) => {
        if (articleData[k] === undefined) delete articleData[k];
      });

      try {
        // 若 articles 已有相同 ID，跳過
        const existing = await articlesCol.doc(id).get();
        if (existing.exists) {
          console.log(`⏭️  跳過 ${id}（articles 已存在）`);
          skipped++;
          continue;
        }

        await articlesCol.doc(id).set(articleData);
        console.log(`✅ 已遷移 ${id}`);
        success++;
      } catch (err: any) {
        console.error(`❌ 無法遷移 ${id}:`, err.message || err);
        errored++;
      }
    }

    console.log("\n遷移總結：");
    console.log(`  成功: ${success}`);
    console.log(`  跳過: ${skipped}`);
    console.log(`  錯誤: ${errored}`);

    if (errored > 0) process.exit(1);
    process.exit(0);
  } catch (err: any) {
    console.error("遷移失敗：", err.message || err);
    process.exit(1);
  }
}

migrate();
