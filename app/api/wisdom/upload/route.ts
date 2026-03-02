import { NextResponse } from "next/server";
import { getFirestoreDB } from "@/lib/firebase-admin";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    // Read wisdom.json file
    const filePath = path.join(process.cwd(), "app/data/wisdom.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const wisdomQuestions = JSON.parse(fileContent);

    const db = getFirestoreDB();
    const wisdomCol = db.collection("wisdomQuestions");

    let added = 0;
    let updated = 0;
    let skipped = 0;

    for (const question of wisdomQuestions) {
      const docId = `wisdom_${question.number}`;
      const docRef = wisdomCol.doc(docId);
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        // Document exists, check if content is different
        const existingData = docSnap.data();
        if (JSON.stringify(existingData) !== JSON.stringify(question)) {
          await docRef.set(question, { merge: true });
          updated++;
        } else {
          skipped++;
        }
      } else {
        // Document doesn't exist, create it
        await docRef.set(question);
        added++;
      }
    }

    return NextResponse.json({
      success: true,
      added,
      updated,
      skipped,
      total: wisdomQuestions.length,
    });
  } catch (error) {
    console.error("Failed to upload wisdom questions:", error);
    return NextResponse.json(
      { error: "Failed to upload wisdom questions" },
      { status: 500 }
    );
  }
}
