import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { getFirestoreDB } from "../../../../lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { articleId, articleNumber, title, success, timestamp } = await request.json();

    if (!articleId || !articleNumber || !title || success === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getFirestoreDB();
    const usersCol = db.collection("users");
    
    // Find user by email
    const userSnapshot = await usersCol.where("email", "==", session.user.email).limit(1).get();
    
    if (userSnapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    
    // Add recitation record
    const recitations = userData.recitations || [];
    recitations.push({
      articleId,
      articleNumber,
      title,
      success,
      timestamp: timestamp || new Date().toISOString(),
    });

    await usersCol.doc(userDoc.id).update({
      recitations,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Recitation recorded" });
  } catch (error: any) {
    console.error("Error recording recitation:", error);
    return NextResponse.json({ error: error.message || "Failed to record recitation" }, { status: 500 });
  }
}
