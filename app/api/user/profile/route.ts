import { NextResponse } from "next/server";
import { findUserByEmail, findUserByName, updateUser } from "../../../../lib/users";
import type { Session } from "next-auth";
import { auth } from "../../../../auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const nameParam = searchParams.get("name");

    // If name parameter is provided, fetch that user's public profile
    if (nameParam) {
      const user = await findUserByName(nameParam);
      if (!user) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      // Determine if the requester is the owner (authenticated and same email)
      let isOwner = false;
      try {
        const session = (await auth()) as unknown as Session | null;
        if (session?.user?.email) {
          const found = await findUserByEmail(session.user.email as string);
          if (found && found.id === user.id) isOwner = true;
        }
      } catch (e) {
        // ignore auth errors — treat as not owner
      }

      // Return data: include recitations only if owner or public
      const { id, name, email, bio, avatarUrl, socialLinks, recitations, recitationsPublic, emailPublic } = user;
      const outRecitations = isOwner ? recitations : (recitationsPublic ? recitations : []);
      // Decide whether the profile is publicly visible. Currently treat profile as public
      // if either recitations or email are marked public. This can be adjusted later.
      const profilePublic = Boolean(recitationsPublic || emailPublic);
      return NextResponse.json({ 
        ok: true, 
        user: { id, name, email, bio, avatarUrl, socialLinks, recitations: outRecitations, recitationsPublic, emailPublic, isOwner, profilePublic } 
      });
    }

    // Otherwise, return the authenticated user's own profile
    const session = (await auth()) as unknown as Session | null;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserByEmail(session.user.email as string);
    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { id, name, email, bio, avatarUrl, socialLinks, recitations, recitationsPublic, emailPublic } = user;
    return NextResponse.json({ ok: true, user: { id, name, email, bio, avatarUrl, socialLinks, recitations, recitationsPublic, emailPublic } });
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
    const user = await findUserByEmail(session.user.email as string);
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
    if (typeof body.recitationsPublic === "boolean") {
      updates.recitationsPublic = body.recitationsPublic;
    }
    if (typeof body.emailPublic === "boolean") {
      updates.emailPublic = body.emailPublic;
    }

    const updated = await updateUser(user.id, updates);
    
    return NextResponse.json({ ok: true, user: updated });
  } catch (e) {
    console.error("PATCH User Error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}