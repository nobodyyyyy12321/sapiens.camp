import { auth } from "@/auth";
import { getFirestoreDB } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";

type EnglishRecord = {
  answered: number;
  correct: number;
  set: string;
  timestamp: string;
  category: "英文";
};

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { answered, correct, set } = body;

    if (typeof answered !== "number" || typeof correct !== "number" || typeof set !== "string") {
      return Response.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    const userEmail = session.user.email;
    const record: EnglishRecord = {
      answered,
      correct,
      set,
      timestamp: new Date().toISOString(),
      category: "英文",
    };

    // Save to Firestore
    const db = getFirestoreDB();
    const userRef = db.collection("users").doc(userEmail);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Add to englishRecords array
    await userRef.update({
      englishRecords: admin.firestore.FieldValue.arrayUnion(record)
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error("Error saving english record:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
