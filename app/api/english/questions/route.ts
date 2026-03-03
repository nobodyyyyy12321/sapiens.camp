import { getFirestoreDB } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const db = getFirestoreDB();
    const snapshot = await db.collection("englishQuestions").orderBy("number").get();
    const questions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json({ questions });
  } catch (error) {
    console.error("Error fetching english questions:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
