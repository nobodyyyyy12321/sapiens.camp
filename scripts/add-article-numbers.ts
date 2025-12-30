import { getFirestoreDB } from "../lib/firebase-admin";

/**
 * 为 Firestore articles 集合中的每篇文章添加编号
 */
async function addArticleNumbers() {
  try {
    console.log("开始为文章添加编号...");
    const db = getFirestoreDB();
    const articlesCol = db.collection("articles");

    const snapshot = await articlesCol.orderBy("createdAt", "asc").get();
    
    if (snapshot.empty) {
      console.log("找不到任何文章。");
      process.exit(0);
    }

    console.log(`找到 ${snapshot.size} 篇文章`);

    let updated = 0;
    let skipped = 0;
    let number = 1;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // 如果已有编号则跳过
      if (data.number) {
        console.log(`⏭️  跳过：${data.title}（已有编号 ${data.number}）`);
        skipped++;
        continue;
      }

      // 添加编号
      await articlesCol.doc(doc.id).update({
        number: number,
        updatedAt: new Date().toISOString(),
      });

      console.log(`✅ 已更新：${data.title} → 编号 ${number}`);
      updated++;
      number++;
    }

    console.log("\n" + "=".repeat(50));
    console.log(`完成！更新 ${updated} 篇，跳过 ${skipped} 篇`);
    console.log("=".repeat(50));

    process.exit(0);
  } catch (err: any) {
    console.error("添加编号失败：", err.message || err);
    process.exit(1);
  }
}

addArticleNumbers();
