import { NextResponse } from "next/server";
import { findUserByVerificationToken, updateUser } from "../../../../lib/users";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const user = findUserByVerificationToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 404 });

    // Check expiry
    if (user.verificationExpires && new Date(user.verificationExpires) < new Date()) {
      return NextResponse.json({ error: "Token expired" }, { status: 410 });
    }

    updateUser(user.id, { emailVerified: true, verificationToken: undefined, verificationExpires: undefined });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
