import { NextResponse } from "next/server";
import { findUserByVerificationToken, updateUser } from "../../../../lib/users";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) {
      const location = new URL('/', req.url);
      location.searchParams.set('verified', '0');
      location.searchParams.set('error', 'missing_token');
      return NextResponse.redirect(location.toString());
    }

    const user = findUserByVerificationToken(token);
    if (!user) {
      const location = new URL('/', req.url);
      location.searchParams.set('verified', '0');
      location.searchParams.set('error', 'invalid_token');
      return NextResponse.redirect(location.toString());
    }

    // Check expiry
    if (user.verificationExpires && new Date(user.verificationExpires) < new Date()) {
      const location = new URL('/', req.url);
      location.searchParams.set('verified', '0');
      location.searchParams.set('error', 'expired');
      return NextResponse.redirect(location.toString());
    }

    updateUser(user.id, { emailVerified: true, verificationToken: undefined, verificationExpires: undefined });
    const successLocation = new URL('/', req.url);
    successLocation.searchParams.set('verified', '1');
    return NextResponse.redirect(successLocation.toString());
  } catch (e) {
    console.error(e);
    const location = new URL('/', (req as any).url || 'http://localhost');
    location.searchParams.set('verified', '0');
    location.searchParams.set('error', 'internal');
    return NextResponse.redirect(location.toString());
  }
}
