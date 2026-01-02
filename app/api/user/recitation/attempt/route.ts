import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { getFirestoreDB } from "../../../../../lib/firebase-admin";

export async function POST(request: Request) {
  try {
    let session = null;
    try {
      session = await auth();
    } catch (e) {
      session = null;
    }

    const db = getFirestoreDB();

    // Parse or create a visitorId for anonymous users (stored in cookie)
    const cookieHeader = request.headers.get("cookie") || "";
    const getCookie = (name: string) => {
      const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
      return match ? decodeURIComponent(match[1]) : undefined;
    };
    let visitorId = getCookie("visitorId");
    let setVisitorCookie: string | null = null;
    if (!visitorId) {
      const rid = (globalThis as any).crypto?.randomUUID ? (globalThis as any).crypto.randomUUID() : `v_${Date.now()}_${Math.floor(Math.random()*1e6)}`;
      visitorId = `anon_${rid}`;
      setVisitorCookie = `visitorId=${encodeURIComponent(visitorId)}; Path=/; Max-Age=${31536000}; SameSite=Lax`;
    }

    // Signed-in users: free limit 5/day
    if (session?.user?.email) {
      try {
        const usersCol = db.collection("users");
        const userSnapshot = await usersCol.where("email", "==", session.user.email).limit(1).get();
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData: any = userDoc.data();
          const isPro = Boolean(userData.isPro || userData.paid || userData.isPaid);
          const LIMIT = 5;
          const today = new Date().toISOString().slice(0, 10);
          const dailyCol = db.collection("userDailyRecitations");
          const dailyDocId = `${userDoc.id}_${today}`;
          const dailyRef = dailyCol.doc(dailyDocId);

          await db.runTransaction(async (tx) => {
            const dailySnap = await tx.get(dailyRef);
            const current = (dailySnap.exists && (dailySnap.data() as any).count) ? (dailySnap.data() as any).count : 0;
            if (!isPro && current >= LIMIT) {
              const headers: any = {};
              if (setVisitorCookie) headers["Set-Cookie"] = setVisitorCookie;
              return NextResponse.json({ allowed: false, message: "Free account daily limit reached" }, { status: 429, headers });
            }
            await tx.set(dailyRef, { userId: userDoc.id, date: today, count: current + 1, updatedAt: new Date().toISOString() }, { merge: true });
          });
        }
      } catch (e) {
        console.error("Attempt check failed for signed-in user:", e);
      }
    } else {
      // Anonymous users: limit 3/day
      try {
        const LIMIT_ANON = 3;
        const today = new Date().toISOString().slice(0, 10);
        const dailyCol = db.collection("userDailyRecitations");
        const dailyDocId = `${visitorId}_${today}`;
        const dailyRef = dailyCol.doc(dailyDocId);

        try {
          await db.runTransaction(async (tx) => {
            const dailySnap = await tx.get(dailyRef);
            const current = (dailySnap.exists && (dailySnap.data() as any).count) ? (dailySnap.data() as any).count : 0;
            if (current >= LIMIT_ANON) {
              const headers: any = {};
              if (setVisitorCookie) headers["Set-Cookie"] = setVisitorCookie;
              return NextResponse.json({ allowed: false, message: `未登入帳號每日限次 (${LIMIT_ANON}/日)` }, { status: 429, headers });
            }
            await tx.set(dailyRef, { visitorId, date: today, count: current + 1, updatedAt: new Date().toISOString() }, { merge: true });
          });
        } catch (quotaErr: any) {
          if (quotaErr && quotaErr.code === "DAILY_QUOTA_EXCEEDED") {
            const headers: any = {};
            if (setVisitorCookie) headers["Set-Cookie"] = setVisitorCookie;
            return NextResponse.json({ allowed: false, message: `未登入帳號每日限次 (${LIMIT_ANON}/日)` }, { status: 429, headers });
          }
          console.error("Failed anonymous attempt transaction:", quotaErr);
        }
      } catch (e) {
        console.error("Attempt check failed for anonymous user:", e);
      }
    }

    const headers: any = {};
    if (setVisitorCookie) headers["Set-Cookie"] = setVisitorCookie;
    return NextResponse.json({ allowed: true }, { headers });
  } catch (error: any) {
    console.error("Error in attempt route:", error);
    return NextResponse.json({ allowed: false, error: error.message || "Internal error" }, { status: 500 });
  }
}
