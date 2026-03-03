import { NextResponse } from "next/server";
import { getFirestoreDB } from "../../../lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const db = getFirestoreDB();
    const articlesCol = db.collection("articles");
    const snapshot = await articlesCol.get();

    let totalAttempts = 0;
    let totalSuccesses = 0;

    snapshot.forEach((doc) => {
      const data = doc.data() || {};
      const a = Number(data.attemptCount || 0);
      const s = Number(data.successCount || 0);
      totalAttempts += a;
      totalSuccesses += s;
    });

    const url = new URL(request.url);
    const wantRecords = url.searchParams.get("records") === "1";

    // Read global site visits if present
    let visits = 0;
    try {
      const statsDoc = await db.collection("siteStats").doc("global").get();
      if (statsDoc.exists) {
        const sdata: any = statsDoc.data() || {};
        visits = Number(sdata.visits || 0);
      }
    } catch (vErr) {
      console.error("Failed to read site visits:", vErr);
    }

    if (!wantRecords) {
      return NextResponse.json({ success: true, totalAttempts, totalSuccesses, visits });
    }

    // Return recent recitationRecords (most recent first). Limit to 10.
    try {
      const recCol = db.collection("recitationRecords");
      const recSnap = await recCol.orderBy("createdAt", "desc").limit(10).get();
      const records: any[] = [];

      for (const d of recSnap.docs) {
        const data = d.data() || {};
        const record: any = { id: d.id, ...data };

        try {
          // Try to construct an article URL for the record so the UI can link to the original article
          let articleUrl: string | null = null;

          if (data.articleId) {
            const artRef = articlesCol.doc(data.articleId);
            const artSnap = await artRef.get();
            if (artSnap.exists) {
              const art = artSnap.data() || {};
              const category = art.category || art.type || "all";
              const number = art.number ?? data.articleNumber;
              if (number !== undefined) articleUrl = `/${encodeURIComponent(category)}/${number}`;
            }
          }

          if (!articleUrl && data.articleNumber !== undefined) {
            const byNum = await articlesCol.where("number", "==", data.articleNumber).limit(1).get();
            if (!byNum.empty) {
              const art = byNum.docs[0].data() || {};
              const category = art.category || art.type || "all";
              const number = art.number ?? data.articleNumber;
              if (number !== undefined) articleUrl = `/${encodeURIComponent(category)}/${number}`;
            }
          }

          if (articleUrl) record.articleUrl = articleUrl;
        } catch (e: any) {
          console.error("Failed to attach article url for recitation record:", e);
        }

        records.push(record);
      }

      return NextResponse.json({ success: true, totalAttempts, totalSuccesses, visits, records });
    } catch (recErr: any) {
      console.error("Failed to fetch recitationRecords:", recErr);
      return NextResponse.json({ success: true, totalAttempts, totalSuccesses, records: [] });
    }
  } catch (err: any) {
    console.error("Failed to compute stats:", err);
    return NextResponse.json({ error: err.message || "Failed to compute stats" }, { status: 500 });
  }
}
