import { NextResponse } from "next/server";
import { getFirestoreDB } from "../../../../lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const db = getFirestoreDB();
    const ref = db.collection("siteStats").doc("global");

    // Atomically increment visits
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const current = snap.exists ? (snap.data() as any).visits || 0 : 0;
      tx.set(ref, { visits: current + 1, updatedAt: new Date().toISOString() }, { merge: true });
    });

    const fresh = await ref.get();
    const visits = fresh.exists ? (fresh.data() as any).visits || 0 : 0;
    return NextResponse.json({ success: true, visits });
  } catch (err: any) {
    console.error("Failed to increment visits:", err);
    return NextResponse.json({ success: false, error: err.message || "failed" }, { status: 500 });
  }
}
