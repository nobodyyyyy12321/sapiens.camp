import { NextResponse } from "next/server";
import { findUserByVerificationToken, updateUser } from "../../../../lib/users";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    
    // 取得基礎 URL（生產環境應該是 memorize.guru）
    // 優先使用 NEXTAUTH_URL，否則使用請求的 origin
    const baseUrl = process.env.NEXTAUTH_URL || url.origin;
    
    if (!token) {
      const location = new URL('/', baseUrl);
      location.searchParams.set('verified', '0');
      location.searchParams.set('error', 'missing_token');
      return NextResponse.redirect(location.toString());
    }

    const user = await findUserByVerificationToken(token);
    if (!user) {
      const location = new URL('/', baseUrl);
      location.searchParams.set('verified', '0');
      location.searchParams.set('error', 'invalid_token');
      return NextResponse.redirect(location.toString());
    }

    // Check expiry
    if (user.verificationExpires && new Date(user.verificationExpires) < new Date()) {
      const location = new URL('/', baseUrl);
      location.searchParams.set('verified', '0');
      location.searchParams.set('error', 'expired');
      return NextResponse.redirect(location.toString());
    }

    await updateUser(user.id, { emailVerified: true, verificationToken: undefined, verificationExpires: undefined });
    const successLocation = new URL('/', baseUrl);
    successLocation.searchParams.set('verified', '1');
    return NextResponse.redirect(successLocation.toString());
  } catch (e) {
    console.error(e);
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const location = new URL('/', baseUrl);
    location.searchParams.set('verified', '0');
    location.searchParams.set('error', 'internal');
    return NextResponse.redirect(location.toString());
  }
}
