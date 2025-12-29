import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let app: App | undefined;
let db: Firestore | undefined;

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
  return { app, db };
}

export function getFirestoreDB(): Firestore {
  const { db } = getFirebaseAdmin();
  return db!;
}

