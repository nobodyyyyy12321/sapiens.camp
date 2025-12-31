import { NextResponse } from "next/server";
import { getFirestoreDB } from "../../../lib/firebase-admin";

export async function GET() {
  try {
    const db = getFirestoreDB();
    const articlesCol = db.collection("articles");
    const snapshot = await articlesCol.get();

    let totalAttempts = 0;
    let totalSuccesses = 0;

    snapshot.forEach((doc) => {
      const data = doc.data() || {};
      const a = Number(data.attemptCount || 0);
      const s = Number(data.successCount || 0);
      totalAttempts += a;
      totalSuccesses += s;
    });

    return NextResponse.json({ success: true, totalAttempts, totalSuccesses });
  } catch (err: any) {
    console.error("Failed to compute stats:", err);
    return NextResponse.json({ error: err.message || "Failed to compute stats" }, { status: 500 });
  }
}
