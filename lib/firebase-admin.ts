import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let app: App | undefined;
let db: Firestore | undefined;
let storageBucketName: string | undefined;

export function getFirebaseAdmin() {
  if (app && db) {
    return { app, db };
  }

  // 如果已经初始化，直接返回
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
    db = getFirestore(app);
    return { app, db };
  }

  // 初始化 Firebase Admin
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error(
      "Firebase Admin 配置缺失。請設置以下環境變數：\n" +
      "- FIREBASE_PROJECT_ID\n" +
      "- FIREBASE_CLIENT_EMAIL\n" +
      "- FIREBASE_PRIVATE_KEY"
    );
  }

  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });

  db = getFirestore(app);
  // optional: storage bucket name
  storageBucketName = process.env.FIREBASE_STORAGE_BUCKET;
  return { app, db };
}

export function getFirestoreDB(): Firestore {
  const { db } = getFirebaseAdmin();
  return db!;
}

export function getStorageBucket() {
  const { app } = getFirebaseAdmin();
  if (!process.env.FIREBASE_STORAGE_BUCKET) {
    throw new Error(
      "FIREBASE_STORAGE_BUCKET 環境變數未設定。請在 .env.local 加入 FIREBASE_STORAGE_BUCKET=your-bucket-name"
    );
  }
  const storage = getStorage(app);
  return storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
}

