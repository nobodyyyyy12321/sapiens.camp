import { readFileSync } from "fs";
import { join } from "path";
import { getFirestoreDB } from "@/lib/firebase-admin";

export async function POST() {
  try {
    const filePath = join(process.cwd(), "app/data/quote.json");
    const fileContent = readFileSync(filePath, "utf-8");
    const questions = JSON.parse(fileContent);

    const db = getFirestoreDB();
    const collection = db.collection("quoteQuestions");

    let added = 0;
    let updated = 0;
    let skipped = 0;

    for (const question of questions) {
      const docRef = collection.doc(question.number.toString());
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        updated++;
      } else {
        added++;
      }

      await docRef.set(question, { merge: true });
    }

    return Response.json({
      success: true,
      added,
      updated,
      skipped,
      total: questions.length,
    });
  } catch (error) {
    console.error("Error uploading quote questions:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
