import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { getFirestoreDB } from "../../../../../lib/firebase-admin";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = params.id;
    const { title, items } = await request.json();
    const db = getFirestoreDB();
    const ref = db.collection("lists").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const data: any = doc.data();
    if (data.userEmail !== session.user.email) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updates: any = { updatedAt: new Date().toISOString() };
    if (title !== undefined) updates.title = title;
    if (items !== undefined) updates.items = Array.isArray(items) ? items : [];

    await ref.update(updates);
    const updated = await ref.get();
    return NextResponse.json({ ok: true, list: { id: updated.id, ...updated.data() } });
  } catch (err: any) {
    console.error("PATCH /api/user/lists/[id] error:", err);
    return NextResponse.json({ error: err.message || "Failed" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = params.id;
    const db = getFirestoreDB();
    const ref = db.collection("lists").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const data: any = doc.data();
    if (data.userEmail !== session.user.email) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json({ ok: true, list: { id: doc.id, ...data } });
  } catch (err: any) {
    console.error("GET /api/user/lists/[id] error:", err);
    return NextResponse.json({ error: err.message || "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = params.id;
    const db = getFirestoreDB();
    const ref = db.collection("lists").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const data: any = doc.data();
    if (data.userEmail !== session.user.email) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await ref.delete();
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("DELETE /api/user/lists/[id] error:", err);
    return NextResponse.json({ error: err.message || "Failed" }, { status: 500 });
  }
}
