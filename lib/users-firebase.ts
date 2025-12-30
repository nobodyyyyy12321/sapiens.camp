import { getFirestoreDB } from "./firebase-admin";

export type User = {
  id: string;
  name: string;
  email?: string;
  passwordHash?: string;
  emailVerified?: boolean;
  verificationToken?: string;
  verificationExpires?: string; // ISO string
  bio?: string;
  avatarUrl?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    website?: string;
    [key: string]: string | undefined;
  };
  recitations?: Array<{
    articleId: string;
    articleNumber: number;
    title: string;
    success: boolean;
    timestamp: string;
  }>;
  recitationsPublic?: boolean;
};

const COLLECTION_NAME = "users";

// 輔助函數：將 Firestore 文檔轉換為 User
function docToUser(doc: any): User {
  return {
    id: doc.id,
    ...doc.data(),
  } as User;
}

export async function getUsers(): Promise<User[]> {
  try {
    const db = getFirestoreDB();
    const snapshot = await db.collection(COLLECTION_NAME).get();
    return snapshot.docs.map((doc) => docToUser(doc));
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  if (!email) return undefined;
  try {
    const db = getFirestoreDB();
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where("email", "==", email.toLowerCase())
      .limit(1)
      .get();

    if (snapshot.empty) return undefined;
    return docToUser(snapshot.docs[0]);
  } catch (error) {
    console.error("Error finding user by email:", error);
    return undefined;
  }
}

export async function findUserByName(name: string): Promise<User | undefined> {
  try {
    const db = getFirestoreDB();
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where("name", "==", name)
      .limit(1)
      .get();

    if (snapshot.empty) return undefined;
    return docToUser(snapshot.docs[0]);
  } catch (error) {
    console.error("Error finding user by name:", error);
    return undefined;
  }
}

export async function findUserByVerificationToken(
  token: string
): Promise<User | undefined> {
  try {
    const db = getFirestoreDB();
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where("verificationToken", "==", token)
      .limit(1)
      .get();

    if (snapshot.empty) return undefined;
    return docToUser(snapshot.docs[0]);
  } catch (error) {
    console.error("Error finding user by verification token:", error);
    return undefined;
  }
}

export async function findUserById(id: string): Promise<User | undefined> {
  try {
    const db = getFirestoreDB();
    const doc = await db.collection(COLLECTION_NAME).doc(id).get();
    if (!doc.exists) return undefined;
    return docToUser(doc);
  } catch (error) {
    console.error("Error finding user by id:", error);
    return undefined;
  }
}

export async function saveUser(user: User): Promise<void> {
  try {
    const db = getFirestoreDB();
    const userData = { ...user };
    delete (userData as any).id; // Firestore 會自動生成 ID，或使用提供的 ID

    if (user.email) {
      userData.email = user.email.toLowerCase();
    }

    await db.collection(COLLECTION_NAME).doc(user.id).set(userData);
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
}

export async function updateUser(
  id: string,
  updates: Partial<User>
): Promise<User | null> {
  try {
    const db = getFirestoreDB();
    const updateData: any = { ...updates };

    // 移除值為 undefined 的欄位，避免 Firestore update 出錯
    Object.keys(updateData).forEach((k) => {
      if ((updateData as any)[k] === undefined) delete (updateData as any)[k];
    });

    // 如果更新 email，轉換為小寫
    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase();
    }

    // 移除 id 欄位（不應該更新）
    delete updateData.id;

    await db.collection(COLLECTION_NAME).doc(id).update(updateData);
    
    const updatedDoc = await db.collection(COLLECTION_NAME).doc(id).get();
    if (!updatedDoc.exists) return null;
    
    return docToUser(updatedDoc);
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

