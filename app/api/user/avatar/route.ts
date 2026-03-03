import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getStorageBucket } from "../../../../lib/firebase-admin";
import { auth } from "../../../../auth";
import { findUserByEmail, findUserByName, updateUser } from "../../../../lib/users";

export async function POST(req: Request) {
  try {
    // require authenticated user
    const session = (await auth()) as any | null;
    const sessionEmail = session?.user?.email as string | undefined;
    const sessionName = session?.user?.name as string | undefined;
    if (!sessionEmail && !sessionName) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user = sessionEmail ? await findUserByEmail(sessionEmail) : undefined;
    if (!user && sessionName) user = await findUserByName(sessionName);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { data } = body; // expect data URL: data:image/png;base64,....
    if (!data) return NextResponse.json({ error: "No data provided" }, { status: 400 });

    const matches = data.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const mime = matches[1];
    const allowedMimes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
    if (!allowedMimes.has(mime)) {
      return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
    }

    const ext = mime.split("/")[1] || "png";
    const buffer = Buffer.from(matches[2], "base64");
    const maxBytes = 5 * 1024 * 1024;
    if (buffer.length > maxBytes) {
      return NextResponse.json({ error: "Image too large (max 5MB)" }, { status: 413 });
    }

    const filename = `avatars/${uuidv4()}.${ext}`;

    // upload to firebase storage
    const bucket = getStorageBucket();
    const file = bucket.file(filename);
    await file.save(buffer, {
      metadata: {
        contentType: mime,
        cacheControl: "public, max-age=31536000, immutable",
      },
    });

    let url = "";
    // Try public URL first
    try {
      await file.makePublic();
      url = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(filename)}`;
    } catch (e) {
      // Buckets with uniform access often disallow makePublic().
      // Fall back to a long-lived signed URL so avatar still works.
      console.warn("makePublic failed, fallback to signed URL:", e);
      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: "03-01-2491",
      });
      url = signedUrl;
    }

    // update user record
    await updateUser(user.id, { avatarUrl: url });

    return NextResponse.json({ ok: true, url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}