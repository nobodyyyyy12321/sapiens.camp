import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually
const envPath = resolve(process.cwd(), ".env.local");
try {
  const envContent = readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  });
} catch (e) {
  // .env.local may not exist in production
}

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
        number: 1,
        title: "靜夜思",
        category: "唐詩",
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
        number: 2,
        title: "早發白帝城",
        category: "唐詩",
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
        number: 3,
        title: "登鶴雀樓",
        category: "唐詩",
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
      },
      {
        number: 4,
        title: "春曉",
        category: "唐詩",
        author: "孟浩然",
        content: [
          "春眠不覺曉，",
          "處處聞啼鳥。",
          "夜來風雨聲，",
          "花落知多少。"
        ],
        tags: ["春天", "睡眠", "自然"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 5,
        title: "相思",
        category: "唐詩",
        author: "王維",
        content: [
          "紅豆生南國，",
          "春來發幾枝。",
          "願君多採擷，",
          "此物最相思。"
        ],
        tags: ["相思", "紅豆", "愛情"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 6,
        title: "鹿柴",
        category: "唐詩",
        author: "王維",
        content: [
          "空山不見人，",
          "但聞人語響。",
          "返景入深林，",
          "復照青苔上。"
        ],
        tags: ["山林", "寂靜", "禪意"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 7,
        title: "絕句",
        category: "唐詩",
        author: "杜甫",
        content: [
          "兩個黃鸝鳴翠柳，",
          "一行白鷺上青天。",
          "窗含西嶺千秋雪，",
          "門泊東吳萬里船。"
        ],
        tags: ["景色", "春天", "色彩"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 8,
        title: "黃鶴樓送孟浩然之廣陵",
        category: "唐詩",
        author: "李白",
        content: [
          "故人西辭黃鶴樓，",
          "煙花三月下揚州。",
          "孤帆遠影碧空盡，",
          "唯見長江天際流。"
        ],
        tags: ["送別", "友情", "長江"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 9,
        title: "登高",
        category: "唐詩",
        author: "杜甫",
        content: [
          "風急天高猿嘯哀，",
          "渚清沙白鳥飛回。",
          "無邊落木蕭蕭下，",
          "不盡長江滾滾來。",
          "萬里悲秋常作客，",
          "百年多病獨登台。",
          "艱難苦恨繁霜鬢，",
          "潦倒新停濁酒杯。"
        ],
        tags: ["秋天", "悲涼", "哲理"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 10,
        title: "春望",
        category: "唐詩",
        author: "杜甫",
        content: [
          "國破山河在，",
          "城春草木深。",
          "感時花濺淚，",
          "恨別鳥驚心。",
          "烽火連三月，",
          "家書抵萬金。",
          "白頭搔更短，",
          "渾欲不勝簪。"
        ],
        tags: ["戰亂", "憂國", "家書"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 11,
        title: "楓橋夜泊",
        category: "唐詩",
        author: "張繼",
        content: [
          "月落烏啼霜滿天，",
          "江楓漁火對愁眠。",
          "姑蘇城外寒山寺，",
          "夜半鐘聲到客船。"
        ],
        tags: ["夜晚", "秋天", "旅愁"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 12,
        title: "涼州詞",
        category: "唐詩",
        author: "王翰",
        content: [
          "葡萄美酒夜光杯，",
          "欲飲琵琶馬上催。",
          "醉臥沙場君莫笑，",
          "古來征戰幾人回。"
        ],
        tags: ["邊塞", "戰爭", "豪邁"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 13,
        title: "出塞",
        category: "唐詩",
        author: "王昌齡",
        content: [
          "秦時明月漢時關，",
          "萬里長征人未還。",
          "但使龍城飛將在，",
          "不教胡馬度陰山。"
        ],
        tags: ["邊塞", "戰爭", "將士"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    let added = 0;
    let skipped = 0;

    for (const article of testArticles) {
      // 檢查是否已存在（依 number）
      const existing = await articlesCol.where("number", "==", article.number).limit(1).get();
      
      if (!existing.empty) {
        console.log(`⏭️  跳過：${article.title}（編號 ${article.number} 已存在）`);
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
