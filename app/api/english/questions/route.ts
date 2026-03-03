import { getFirestoreDB } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const db = getFirestoreDB();
    const snapshot = await db.collection("englishQuestions").orderBy("number").limit(20).get();
    const questions = snapshot.docs.map((doc) => {
      const data = doc.data();
      
      // Convert options object to array format
      const optionsArray = data.options && typeof data.options === 'object'
        ? Object.entries(data.options).map(([label, text]) => ({
            label,
            text: text as string
          }))
        : [];

      return {
        id: doc.id,
        number: data.number,
        title: data.title,
        options: optionsArray,
        answer: data.answer,
      };
    });

    return Response.json({ questions });
  } catch (error) {
    console.error("Error fetching english questions:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
