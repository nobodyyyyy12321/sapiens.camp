import { NextResponse } from "next/server";
import { getFirestoreDB } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const db = getFirestoreDB();
    const snapshot = await db.collection("trafficQuestions")
      .where("number", ">=", 1)
      .orderBy("number", "asc")
      .get();

    const questions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ questions });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
