import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getStorageBucket } from "../../../../lib/firebase-admin";
import { auth } from "../../../../auth";
import { findUserByEmail, updateUser } from "../../../../lib/users";

export async function POST(req: Request) {
  try {
    // require authenticated user
    const session = (await auth()) as any | null;
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await findUserByEmail(session.user.email as string);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { data } = body; // expect data URL: data:image/png;base64,....
    if (!data) return NextResponse.json({ error: "No data provided" }, { status: 400 });

    const matches = data.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const mime = matches[1];
    const ext = mime.split("/")[1] || "png";
    const buffer = Buffer.from(matches[2], "base64");

    const filename = `avatars/${uuidv4()}.${ext}`;

    // upload to firebase storage
    const bucket = getStorageBucket();
    const file = bucket.file(filename);
    await file.save(buffer, { metadata: { contentType: mime } });
    // make public so it can be used as img src (alternatively use signed URLs)
    try {
      await file.makePublic();
    } catch (e) {
      console.warn("makePublic failed (check bucket permissions):", e);
    }

    const url = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(filename)}`;

    // update user record
    await updateUser(user.id, { avatarUrl: url });

    return NextResponse.json({ ok: true, url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}