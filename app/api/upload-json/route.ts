import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { getFirestoreDB } from "@/lib/firebase-admin";

/**
 * 共用 JSON 上傳 API
 * POST /api/upload-json?file=xxx.json&collection=xxx&key=xxx
 * body 也可傳 file/collection/key，query string 優先
 * 只允許讀取 app/data/ 下的 json 檔
 */
export async function POST(req: Request) {
  try {
    // 解析 query string
    const url = new URL(req.url);
    const qs = url.searchParams;
    // 解析 body
    let body: any = {};
    try {
      body = await req.json();
    } catch {}
    // 參數優先順序：query string > body > 預設
    const file = (qs.get("file") || body.file || "").trim();
    const collectionName = (qs.get("collection") || body.collection || "").trim();
    const key = (qs.get("key") || body.key || "number").trim();

    if (!file || !collectionName || !key) {
      return Response.json({ error: "Missing file, collection, or key param" }, { status: 400 });
    }
    if (!file.endsWith(".json")) {
      return Response.json({ error: "Only .json files allowed" }, { status: 400 });
    }
    const filePath = join(process.cwd(), "app/data", file);
    if (!existsSync(filePath)) {
      return Response.json({ error: `File not found: ${file}` }, { status: 404 });
    }
    const fileContent = readFileSync(filePath, "utf-8");
    let items;
    try {
      items = JSON.parse(fileContent);
    } catch {
      return Response.json({ error: "Invalid JSON file" }, { status: 400 });
    }
    if (!Array.isArray(items)) {
      return Response.json({ error: "JSON must be an array" }, { status: 400 });
    }
    const db = getFirestoreDB();
    const collection = db.collection(collectionName);
    let added = 0;
    let updated = 0;
    for (const item of items) {
      const docKey = item[key];
      if (!docKey) continue;
      const docRef = collection.doc(docKey.toString());
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        updated++;
      } else {
        added++;
      }
      await docRef.set(item, { merge: true });
    }
    return Response.json({
      success: true,
      added,
      updated,
      total: items.length,
      file,
      collection: collectionName,
      key,
    });
  } catch (error) {
    console.error("Error uploading json:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
