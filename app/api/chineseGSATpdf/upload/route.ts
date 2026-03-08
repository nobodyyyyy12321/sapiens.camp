import { existsSync, readFileSync } from "fs";
import { basename, extname, join } from "path";
import { FieldValue } from "firebase-admin/firestore";
import { getFirestoreDB, getStorageBucket } from "@/lib/firebase-admin";

const COLLECTION = "chineseGSATpdf";
const DATA_DIR = join(process.cwd(), "app", "data", "chineseGSATpdf");
const DEFAULT_FILE_NAME = "01-115學測國綜試卷.pdf";

type UploadRequestBody = {
  fileName?: string;
  title?: string;
};

export async function POST(req: Request) {
  try {
    let body: UploadRequestBody = {};
    try {
      body = (await req.json()) as UploadRequestBody;
    } catch {
      body = {};
    }

    const fileName = (body.fileName || DEFAULT_FILE_NAME).trim();
    const localFilePath = join(DATA_DIR, fileName);

    if (!existsSync(localFilePath)) {
      return Response.json({ error: `File not found: ${fileName}` }, { status: 404 });
    }

    const fileBuffer = readFileSync(localFilePath);
    if (!fileBuffer.length) {
      return Response.json({ error: "Empty file" }, { status: 400 });
    }

    const maxBytes = 50 * 1024 * 1024;
    if (fileBuffer.length > maxBytes) {
      return Response.json({ error: "PDF too large (max 50MB)" }, { status: 413 });
    }

    const rawTitle = body.title?.trim();
    const title = rawTitle || basename(fileName, extname(fileName));
    const storagePath = `${COLLECTION}/${Date.now()}-${basename(fileName)}`;

    const bucket = getStorageBucket();
    const storageFile = bucket.file(storagePath);

    await storageFile.save(fileBuffer, {
      metadata: {
        contentType: "application/pdf",
        cacheControl: "public, max-age=31536000, immutable",
      },
    });

    let url = "";
    try {
      await storageFile.makePublic();
      url = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(storagePath)}`;
    } catch {
      const [signedUrl] = await storageFile.getSignedUrl({
        action: "read",
        expires: "03-01-2491",
      });
      url = signedUrl;
    }

    const db = getFirestoreDB();
    const docRef = db.collection(COLLECTION).doc();

    await docRef.set({
      title,
      fileName,
      storagePath,
      url,
      contentType: "application/pdf",
      sizeBytes: fileBuffer.length,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return Response.json({
      success: true,
      collection: COLLECTION,
      docId: docRef.id,
      fileName,
      storagePath,
      url,
    });
  } catch (error) {
    console.error("Error uploading chineseGSATpdf:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
