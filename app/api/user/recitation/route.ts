import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { getFirestoreDB } from "../../../../lib/firebase-admin";

export async function POST(request: Request) {
  try {
    let session = null;
    try {
      session = await auth();
    } catch (e) {
      session = null;
    }

    const { articleId, articleNumber, title, success, timestamp } = await request.json();

    if (!articleId || !articleNumber || !title || success === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getFirestoreDB();
    const usersCol = db.collection("users");

    // If user is signed in, append recitation to their user doc; otherwise skip user storage
    if (session?.user?.email) {
      try {
        const userSnapshot = await usersCol.where("email", "==", session.user.email).limit(1).get();
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();

          const recitations = userData.recitations || [];
          recitations.push({
            articleId,
            articleNumber,
            title,
            success,
            timestamp: timestamp || new Date().toISOString(),
          });

          const attemptCountUser = (userData.attemptCount || 0) + 1;
          const successCountUser = (userData.successCount || 0) + (success ? 1 : 0);

          await usersCol.doc(userDoc.id).update({
            recitations,
            attemptCount: attemptCountUser,
            successCount: successCountUser,
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.error("Failed to update user recitations:", e);
      }
    }

      // Update article counters (attempts and successes)
      try {
        const articlesCol = db.collection("articles");
        const articleRef = articlesCol.doc(articleId);
        const articleSnap = await articleRef.get();

        let attemptCount = 0;
        let successCount = 0;

        if (!articleSnap.exists) {
          // try to find by number as fallback
          const byNumber = await articlesCol.where("number", "==", articleNumber).limit(1).get();
          if (!byNumber.empty) {
            const doc = byNumber.docs[0];
            attemptCount = (doc.data().attemptCount || 0) + 1;
            successCount = (doc.data().successCount || 0) + (success ? 1 : 0);
            await doc.ref.update({ attemptCount, successCount, updatedAt: new Date().toISOString() });
          }
        } else {
          const data = articleSnap.data() || {};
          attemptCount = (data.attemptCount || 0) + 1;
          successCount = (data.successCount || 0) + (success ? 1 : 0);
          await articleRef.update({ attemptCount, successCount, updatedAt: new Date().toISOString() });
        }

        // Create a persistent recitation record in a dedicated collection
        try {
          const recordsCol = db.collection("recitationRecords");
          const record = {
            articleId,
            articleNumber,
            title,
            success,
            timestamp: timestamp || new Date().toISOString(),
            userEmail: session?.user?.email || null,
            anonymous: !session?.user?.email,
            createdAt: new Date().toISOString(),
          };
          await recordsCol.add(record);
        } catch (recErr) {
          console.error("Failed to write recitation record doc:", recErr);
        }

        return NextResponse.json({ success: true, message: "Recitation recorded", attemptCount, successCount });
      } catch (err) {
        console.error("Failed updating article counters:", err);
        // Return success for user recitation but indicate counters not updated
        return NextResponse.json({ success: true, message: "Recitation recorded (article counters not updated)" });
      }
  } catch (error: any) {
    console.error("Error recording recitation:", error);
    return NextResponse.json({ error: error.message || "Failed to record recitation" }, { status: 500 });
  }
}
