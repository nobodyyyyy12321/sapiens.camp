import { getFirestoreDB } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "1-20";
    
    // Parse range (e.g., "1-20" -> start: 1, end: 20)
    const [startStr, endStr] = range.split("-");
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);
    
    if (isNaN(start) || isNaN(end) || start < 1 || end > 1000 || start > end) {
      return Response.json({ error: "Invalid range" }, { status: 400 });
    }

    const db = getFirestoreDB();
    const snapshot = await db
      .collection("englishQuestions")
      .where("number", ">=", start)
      .where("number", "<=", end)
      .orderBy("number")
      .get();
      
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
