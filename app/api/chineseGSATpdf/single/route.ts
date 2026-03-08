import { getFirestoreDB } from "@/lib/firebase-admin";

const COLLECTION = "chineseGSATpdf";

export async function GET() {
  try {
    const db = getFirestoreDB();
    const snapshot = await db.collection(COLLECTION).limit(2).get();

    if (snapshot.empty) {
      return Response.json({ error: "No PDF found" }, { status: 404 });
    }

    if (snapshot.size > 1) {
      return Response.json({ error: "PDF is not unique" }, { status: 409 });
    }

    const doc = snapshot.docs[0];
    const data = doc.data() as { url?: string; fileName?: string; title?: string };

    if (!data.url) {
      return Response.json({ error: "PDF URL missing" }, { status: 500 });
    }

    return Response.json({
      success: true,
      docId: doc.id,
      url: data.url,
      fileName: data.fileName,
      title: data.title,
    });
  } catch (error) {
    console.error("Error getting single chineseGSATpdf:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
