import { auth } from "@/auth";
import { getFirestoreDB } from "@/lib/firebase-admin";

type StudyChineseRecord = {
  answered: number;
  correct: number;
  set: string;
  timestamp: string;
  category: "學中文";
};

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { answered, correct, set } = body;

    if (typeof answered !== "number" || typeof correct !== "number" || typeof set !== "string") {
      return Response.json({ error: "Invalid data" }, { status: 400 });
    }

    const db = getFirestoreDB();
    const userSnapshot = await db
      .collection("users")
      .where("email", "==", session.user.email.toLowerCase())
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const record: StudyChineseRecord = {
      answered,
      correct,
      set,
      timestamp: new Date().toISOString(),
      category: "學中文",
    };

    const userRef = userSnapshot.docs[0].ref;
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    const studyChineseRecords = userData?.studyChineseRecords || [];
    studyChineseRecords.push(record);

    await userRef.update({ studyChineseRecords });

    return Response.json({ success: true, record });
  } catch (error) {
    console.error("Error saving study-chinese record:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
