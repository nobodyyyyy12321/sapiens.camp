import { getFirestoreDB } from "../lib/firebase-admin";

/**
 * Remove tags field from all articles in Firestore
 */
async function removeTagsField() {
  try {
    console.log("開始移除文章的 tags 欄位...");
    const db = getFirestoreDB();
    const articlesCol = db.collection("articles");

    const snapshot = await articlesCol.get();
    
    if (snapshot.empty) {
      console.log("找不到任何文章。");
      process.exit(0);
    }

    console.log(`找到 ${snapshot.size} 篇文章`);

    let updated = 0;
    let skipped = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Check if tags field exists
      if (!data.tags) {
        console.log(`⏭️  跳過：${data.title}（無 tags 欄位）`);
        skipped++;
        continue;
      }

      // Remove tags field using FieldValue.delete()
      const admin = require("firebase-admin");
      await articlesCol.doc(doc.id).update({
        tags: admin.firestore.FieldValue.delete(),
        updatedAt: new Date().toISOString(),
      });

      console.log(`✅ 已移除：${data.title} 的 tags 欄位`);
      updated++;
    }

    console.log("\n" + "=".repeat(50));
    console.log(`完成！更新 ${updated} 篇，跳過 ${skipped} 篇`);
    console.log("=".repeat(50));

    process.exit(0);
  } catch (err: any) {
    console.error("移除 tags 欄位失敗：", err.message || err);
    process.exit(1);
  }
}

removeTagsField();
