import { NextResponse } from "next/server";
import { findUserByEmail, updateUser } from "../../../../lib/users";
import type { Session } from "next-auth";
import { auth } from "../../../../auth";

export async function GET() {
  try {
    const session = (await auth()) as unknown as Session | null;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = findUserByEmail(session.user.email as string);
    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { id, name, email, bio, avatarUrl, socialLinks } = user;
    return NextResponse.json({ ok: true, user: { id, name, email, bio, avatarUrl, socialLinks } });
  } catch (e) {
    console.error("GET User Error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = (await auth()) as unknown as Session | null;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = findUserByEmail(session.user.email as string);
    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    const updates: any = {};
    
    // 安全檢查並整理更新欄位
    if (typeof body.bio === "string") updates.bio = body.bio;
    if (typeof body.avatarUrl === "string") updates.avatarUrl = body.avatarUrl;
    if (typeof body.name === "string") updates.name = body.name;
    if (body.socialLinks && typeof body.socialLinks === "object") {
      updates.socialLinks = body.socialLinks;
    }

    const updated = updateUser(user.id, updates);
    
    return NextResponse.json({ ok: true, user: updated });
  } catch (e) {
    console.error("PATCH User Error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}