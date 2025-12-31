import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { getFirestoreDB } from "../../../../lib/firebase-admin";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getFirestoreDB();
    const col = db.collection("lists");
    const snapshot = await col.where("userEmail", "==", session.user.email).orderBy("updatedAt", "desc").get();
    const lists = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ ok: true, lists });
  } catch (err: any) {
    console.error("GET /api/user/lists error:", err);
    return NextResponse.json({ error: err.message || "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, items } = await request.json();
    if (!title) return NextResponse.json({ error: "Missing title" }, { status: 400 });

    const db = getFirestoreDB();
    const col = db.collection("lists");
    const now = new Date().toISOString();
    const data = {
      userEmail: session.user.email,
      title,
      items: Array.isArray(items) ? items : [],
      createdAt: now,
      updatedAt: now,
    };
    const ref = await col.add(data);
    const doc = await ref.get();
    return NextResponse.json({ ok: true, list: { id: doc.id, ...doc.data() } });
  } catch (err: any) {
    console.error("POST /api/user/lists error:", err);
    return NextResponse.json({ error: err.message || "Failed" }, { status: 500 });
  }
}
