import { NextResponse } from "next/server";
import { getFirestoreDB } from "../../../../lib/firebase-admin";

export async function POST() {
  try {
    const db = getFirestoreDB();
    const usersCol = db.collection("users");
    const snapshot = await usersCol.get();

    let updated = 0;
    const details: string[] = [];

    for (const doc of snapshot.docs) {
      const data = doc.data() || {};
      const recitations = Array.isArray(data.recitations) ? data.recitations : [];
      const attemptCount = recitations.length;
      const successCount = recitations.filter((r: any) => r && r.success).length;

      // Only update if different or missing
      if (data.attemptCount !== attemptCount || data.successCount !== successCount) {
        await doc.ref.update({ attemptCount, successCount, updatedAt: new Date().toISOString() });
        updated++;
        details.push(`Updated ${data.email || doc.id}: attempts=${attemptCount}, successes=${successCount}`);
      }
    }

    return NextResponse.json({ success: true, updated, details });
  } catch (err: any) {
    console.error("sync-user-stats error:", err);
    return NextResponse.json({ error: err.message || "Failed to sync user stats" }, { status: 500 });
  }
}
