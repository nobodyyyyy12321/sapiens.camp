import { NextRequest, NextResponse } from "next/server";
import { getFirestoreDB } from "@/lib/firebase-admin";
import { promises as fs } from "fs";
import path from "path";

type Question = {
  number: number;
  question: string;
  answer: string;
};

async function getDefaultQuestions(): Promise<Question[]> {
  try {
    const filePath = path.join(process.cwd(), "app", "data", "traffic.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Failed to load traffic questions from file:", error);
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const defaultQuestions = await getDefaultQuestions();
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
