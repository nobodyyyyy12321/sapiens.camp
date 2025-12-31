import { NextResponse } from "next/server";
import { getFirestoreDB } from "../../../lib/firebase-admin";

export async function GET(request: Request) {
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

    const url = new URL(request.url);
    const wantRecords = url.searchParams.get("records") === "1";

    if (!wantRecords) {
      return NextResponse.json({ success: true, totalAttempts, totalSuccesses });
    }

    // Return recent recitationRecords (most recent first). Limit to 500.
    try {
      const recCol = db.collection("recitationRecords");
      const recSnap = await recCol.orderBy("createdAt", "desc").limit(500).get();
      const records: any[] = [];
      recSnap.forEach((d) => {
        const data = d.data() || {};
        records.push({ id: d.id, ...data });
      });

      return NextResponse.json({ success: true, totalAttempts, totalSuccesses, records });
    } catch (recErr: any) {
      console.error("Failed to fetch recitationRecords:", recErr);
      return NextResponse.json({ success: true, totalAttempts, totalSuccesses, records: [] });
    }
  } catch (err: any) {
    console.error("Failed to compute stats:", err);
    return NextResponse.json({ error: err.message || "Failed to compute stats" }, { status: 500 });
  }
}
