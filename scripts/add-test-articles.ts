import { getFirestoreDB } from "../lib/firebase-admin";

/**
 * 新增測試文章到 Firestore articles 集合
 */
async function addTestArticles() {
  try {
    console.log("開始新增測試文章到 Firestore articles...");
    const db = getFirestoreDB();
    const articlesCol = db.collection("articles");

    const testArticles = [
      {
        title: "靜夜思",
        slug: "jingye-si",
        category: "唐詩",
        type: "poem",
        author: "李白",
        content: [
          "床前明月光，",
          "疑是地上霜。",
          "舉頭望明月，",
          "低頭思故鄉。"
        ],
        translation: {
          en: "Moonlight before my bed — Is it frost on the ground? Looking up, I find the moon bright; Bowing, in homesickness I'm drowned."
        },
        tags: ["思鄉", "月亮", "夜晚"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        title: "早發白帝城",
        slug: "zaofabaidicheng",
        category: "唐詩",
        type: "poem",
        author: "李白",
        content: [
          "朝辭白帝彩雲間，",
          "千里江陵一日還。",
          "兩岸猿聲啼不住，",
          "輕舟已過萬重山。"
        ],
        translation: {
          en: "At dawn I leave the White Emperor's city in colorful clouds, A thousand li to Jiangling, returning in a single day. Apes on both banks keep crying without end, My light boat has passed ten thousand layered mountains."
        },
        tags: ["長江", "旅行", "快樂"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        title: "登鶴雀樓",
        slug: "dengquequelou",
        category: "唐詩",
        type: "poem",
        author: "王之渙",
        content: [
          "白日依山盡，",
          "黃河入海流。",
          "欲窮千里目，",
          "更上一層樓。"
        ],
        translation: {
          en: "The white sun sets behind the mountains, The Yellow River flows into the sea. To see a thousand miles further, Climb one more story higher."
        },
        tags: ["登高", "視野", "哲理"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    let added = 0;
    let skipped = 0;

    for (const article of testArticles) {
      // 檢查是否已存在（依 slug）
      const existing = await articlesCol.where("slug", "==", article.slug).limit(1).get();
      
      if (!existing.empty) {
        console.log(`⏭️  跳過：${article.title}（已存在）`);
        skipped++;
        continue;
      }

      await articlesCol.add(article);
      console.log(`✅ 已新增：${article.title}`);
      added++;
    }

    console.log("\n" + "=".repeat(50));
    console.log(`完成！新增 ${added} 篇，跳過 ${skipped} 篇`);
    console.log("=".repeat(50));

    process.exit(0);
  } catch (err: any) {
    console.error("新增失敗：", err.message || err);
    process.exit(1);
  }
}

addTestArticles();
