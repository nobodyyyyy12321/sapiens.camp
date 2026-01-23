import { NextRequest, NextResponse } from "next/server";
import { getFirestoreDB } from "@/lib/firebase-admin";

type Question = {
  number: number;
  question: string;
  answer: string;
};

const defaultQuestions: Question[] = [
  {
    number: 1,
    question: "尊重生命是駕駛道德最重要的一點，我們開車時要處處顧及行人，尤其應該注意讓老弱婦孺身心障礙者優先通行。",
    answer: "是"
  },
  {
    number: 2,
    question: "遵守交通法規與秩序，只算是優良駕駛人，與駕駛道德無關。",
    answer: "否"
  },
  {
    number: 3,
    question: "汽油著火時，應用滅火器、泥沙或用水浸濕棉被、衣服覆蓋撲滅。",
    answer: "是"
  },
  {
    number: 4,
    question: "禮讓與寬容是駕駛道德的最好表現。",
    answer: "是"
  },
  {
    number: 5,
    question: "在狹窄道路上會車，一定要互相禮讓。",
    answer: "是"
  },
  {
    number: 6,
    question: "綠燈允許你依序通過，但駕駛人仍應注意違規闖紅燈的人和車。",
    answer: "是"
  },
  {
    number: 7,
    question: "看見前面車禍有人受傷，沒有人管，我自已要趕路，明明看（聽）到受傷的人在慘叫，也只有不管。",
    answer: "否"
  },
  {
    number: 8,
    question: "我們在開車前仔細檢查汽車，使其保持良好性能，行駛中處處顧及行人與其他車輛，也是駕駛道德的表現。",
    answer: "是"
  },
  {
    number: 9,
    question: "後面汽車為避免灰塵而超越我車，我也討厭灰塵，只有再超越前車。",
    answer: "否"
  },
  {
    number: 10,
    question: "大雨使路上到處積滿污水，路邊行人雖多，但我怕阻礙後面汽車通行，只得快速通過。",
    answer: "否"
  }
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const questions: Question[] = Array.isArray(body) ? body : body.questions || defaultQuestions;

    if (!questions.length) {
      return NextResponse.json({ error: "No questions provided" }, { status: 400 });
    }

    const db = getFirestoreDB();
    const col = db.collection("trafficQuestions");

    let added = 0;
    let updated = 0;
    let skipped = 0;
    const results: string[] = [];

    for (const item of questions) {
      try {
        if (item.number) {
          const snapshot = await col.where("number", "==", item.number).limit(1).get();
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            const existing = doc.data();
            const updates: any = {};
            for (const [k, v] of Object.entries(item)) {
              if (JSON.stringify(existing[k]) !== JSON.stringify(v)) updates[k] = v;
            }
            if (Object.keys(updates).length > 0) {
              await doc.ref.update(updates);
              updated++;
              results.push(`🔄 Updated #${item.number}`);
            } else {
              skipped++;
              results.push(`⏭️ Skipped #${item.number}`);
            }
            continue;
          }
        }

        await col.add(item);
        added++;
        results.push(`✅ Added #${item.number}`);
      } catch (err: any) {
        results.push(`❌ Failed #${item.number}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      added,
      updated,
      skipped,
      results
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
