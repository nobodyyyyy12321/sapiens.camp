import { readFileSync } from "fs";
import { join } from "path";
import { getFirestoreDB } from "@/lib/firebase-admin";

type CarQuizQuestion = {
  id: number | string;
  answer: string;
  question: string;
  options: string[];
};

export async function POST() {
  try {
    const filePath = join(process.cwd(), "app/data/car_quiz.json");
    const fileContent = readFileSync(filePath, "utf-8");
    const questions = JSON.parse(fileContent) as CarQuizQuestion[];

    const db = getFirestoreDB();
    const collection = db.collection("carQuizQuestions");

    let added = 0;
    let updated = 0;
    let skipped = 0;

    for (const question of questions) {
      const docId = String(question.id);
      const docRef = collection.doc(docId);
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
      collection: "carQuizQuestions",
      added,
      updated,
      skipped,
      total: questions.length,
    });
  } catch (error) {
    console.error("Error uploading car quiz questions:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
