import { NextResponse } from "next/server";
import { getFirestoreDB } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const db = getFirestoreDB();
    const wisdomCol = db.collection("wisdomQuestions");
    
    const snapshot = await wisdomCol.orderBy("number").get();
    const questions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Failed to fetch wisdom questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch wisdom questions" },
      { status: 500 }
    );
  }
}
