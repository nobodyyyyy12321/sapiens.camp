import { NextResponse } from "next/server";
import { getFirestoreDB } from "../../../../lib/firebase-admin";

export async function POST() {
  try {
    const db = getFirestoreDB();
    const articlesCol = db.collection("articles");

    const testArticles = [
      {
        number: 1,
        title: "靜夜思",
        category: "唐詩",
        author: "李白",
        content: ["床前明月光，", "疑是地上霜。", "舉頭望明月，", "低頭思故鄉。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 2,
        title: "早發白帝城",
        category: "唐詩",
        author: "李白",
        content: ["朝辭白帝彩雲間，", "千里江陵一日還。", "兩岸猿聲啼不住，", "輕舟已過萬重山。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 3,
        title: "登鶴雀樓",
        category: "唐詩",
        author: "王之渙",
        content: ["白日依山盡，", "黃河入海流。", "欲窮千里目，", "更上一層樓。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 4,
        title: "春曉",
        category: "唐詩",
        author: "孟浩然",
        content: ["春眠不覺曉，", "處處聞啼鳥。", "夜來風雨聲，", "花落知多少。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 5,
        title: "相思",
        category: "唐詩",
        author: "王維",
        content: ["紅豆生南國，", "春來發幾枝。", "願君多採擷，", "此物最相思。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 6,
        title: "鹿柴",
        category: "唐詩",
        author: "王維",
        content: ["空山不見人，", "但聞人語響。", "返景入深林，", "復照青苔上。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 7,
        title: "絕句",
        category: "唐詩",
        author: "杜甫",
        content: ["兩個黃鸝鳴翠柳，", "一行白鷺上青天。", "窗含西嶺千秋雪，", "門泊東吳萬里船。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 8,
        title: "黃鶴樓送孟浩然之廣陵",
        category: "唐詩",
        author: "李白",
        content: ["故人西辭黃鶴樓，", "煙花三月下揚州。", "孤帆遠影碧空盡，", "唯見長江天際流。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 9,
        title: "登高",
        category: "唐詩",
        author: "杜甫",
        content: [
          "風急天高猿嘯哀，", "渚清沙白鳥飛回。", "無邊落木蕭蕭下，", "不盡長江滾滾來。",
          "萬里悲秋常作客，", "百年多病獨登台。", "艱難苦恨繁霜鬢，", "潦倒新停濁酒杯。"
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 10,
        title: "春望",
        category: "唐詩",
        author: "杜甫",
        content: [
          "國破山河在，", "城春草木深。", "感時花濺淚，", "恨別鳥驚心。",
          "烽火連三月，", "家書抵萬金。", "白頭搔更短，", "渾欲不勝簪。"
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 11,
        title: "楓橋夜泊",
        category: "唐詩",
        author: "張繼",
        content: ["月落烏啼霜滿天，", "江楓漁火對愁眠。", "姑蘇城外寒山寺，", "夜半鐘聲到客船。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 12,
        title: "涼州詞",
        category: "唐詩",
        author: "王翰",
        content: ["葡萄美酒夜光杯，", "欲飲琵琶馬上催。", "醉臥沙場君莫笑，", "古來征戰幾人回。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        number: 13,
        title: "出塞",
        category: "唐詩",
        author: "王昌齡",
        content: ["秦時明月漢時關，", "萬里長征人未還。", "但使龍城飛將在，", "不教胡馬度陰山。"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    let added = 0;
    let skipped = 0;
    const results = [];

    for (const article of testArticles) {
      const existing = await articlesCol.where("number", "==", article.number).limit(1).get();
      
      if (!existing.empty) {
        results.push(`⏭️ 跳過：${article.title}（編號 ${article.number} 已存在）`);
        skipped++;
        continue;
      }

      await articlesCol.add(article);
      results.push(`✅ 已新增：${article.title}`);
      added++;
    }

    return NextResponse.json({
      success: true,
      added,
      skipped,
      results,
      message: `完成！新增 ${added} 篇，跳過 ${skipped} 篇`
    });
  } catch (error: any) {
    console.error("Seed poems error:", error);
    return NextResponse.json({ error: error.message || "Failed to seed poems" }, { status: 500 });
  }
}
