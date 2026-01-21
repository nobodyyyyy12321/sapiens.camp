import { getFirestoreDB } from "./firebase-admin";

export type Poem = {
  id: string;
  title: string; // 詩名，如 "靜夜思"
  titleEn?: string; // 英文標題（可選）
  author: string; // 作者，如 "李白"
  authorEn?: string; // 作者英文名（可選）
  dynasty?: string; // 朝代，如 "唐"
  dynastyEn?: string; // 朝代英文（可選）
  content: string[]; // 詩文內容，每行一個元素
  translation?: {
    en?: string; // 英文翻譯
    [key: string]: string | undefined; // 其他語言翻譯
  };
  tags?: string[]; // 標籤，如 ["思鄉", "月亮", "夜晚"]
  category?: string; // 分類，如 "poem" (唐詩), "songci" (宋詞), "bible" (聖經)
  difficulty?: number; // 難度等級 1-5
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
};

const COLLECTION_NAME = "poems";

// 輔助函數：將 Firestore 文檔轉換為 Poem
function docToPoem(doc: any): Poem {
  return {
    id: doc.id,
    ...doc.data(),
  } as Poem;
}

// 取得詩文背誦
export async function getPoems(filters?: {
  category?: string;
  author?: string;
  dynasty?: string;
  tags?: string[];
}): Promise<Poem[]> {
  try {
    const db = getFirestoreDB();
    let query: any = db.collection(COLLECTION_NAME);

    if (filters?.category) {
      query = query.where("category", "==", filters.category);
    }
    if (filters?.author) {
      query = query.where("author", "==", filters.author);
    }
    if (filters?.dynasty) {
      query = query.where("dynasty", "==", filters.dynasty);
    }

    const snapshot = await query.get();
    let poems: Poem[] = snapshot.docs.map((doc: any) => docToPoem(doc));

    // 客戶端過濾 tags（因為 Firestore 不支援陣列包含查詢的組合）
    if (filters?.tags && filters.tags.length > 0) {
      poems = poems.filter((poem: Poem) =>
        filters.tags!.some((tag) => poem.tags?.includes(tag))
      );
    }

    return poems;
  } catch (error) {
    console.error("Error getting poems:", error);
    return [];
  }
}

// 根據 ID 取得單首詩
export async function getPoemById(id: string): Promise<Poem | undefined> {
  try {
    const db = getFirestoreDB();
    const doc = await db.collection(COLLECTION_NAME).doc(id).get();
    if (!doc.exists) return undefined;
    return docToPoem(doc);
  } catch (error) {
    console.error("Error getting poem by id:", error);
    return undefined;
  }
}

// 根據標題取得詩（用於 URL slug）
export async function getPoemBySlug(slug: string): Promise<Poem | undefined> {
  try {
    const db = getFirestoreDB();
    // 可以建立一個 slug 欄位，或使用標題轉換
    // 這裡先簡單搜尋標題
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snapshot.empty) return undefined;
    return docToPoem(snapshot.docs[0]);
  } catch (error) {
    console.error("Error getting poem by slug:", error);
    return undefined;
  }
}

// 新增詩文
export async function createPoem(poem: Omit<Poem, "id" | "createdAt" | "updatedAt">): Promise<Poem> {
  try {
    const db = getFirestoreDB();
    const now = new Date().toISOString();
    const poemData = {
      ...poem,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await db.collection(COLLECTION_NAME).add(poemData);
    const doc = await docRef.get();
    return docToPoem(doc);
  } catch (error) {
    console.error("Error creating poem:", error);
    throw error;
  }
}

// 更新詩文
export async function updatePoem(
  id: string,
  updates: Partial<Omit<Poem, "id" | "createdAt">>
): Promise<Poem | null> {
  try {
    const db = getFirestoreDB();
    const updateData: any = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    delete updateData.id; // 不應該更新 id

    await db.collection(COLLECTION_NAME).doc(id).update(updateData);

    const updatedDoc = await db.collection(COLLECTION_NAME).doc(id).get();
    if (!updatedDoc.exists) return null;

    return docToPoem(updatedDoc);
  } catch (error) {
    console.error("Error updating poem:", error);
    return null;
  }
}

// 刪除詩文
export async function deletePoem(id: string): Promise<boolean> {
  try {
    const db = getFirestoreDB();
    await db.collection(COLLECTION_NAME).doc(id).delete();
    return true;
  } catch (error) {
    console.error("Error deleting poem:", error);
    return false;
  }
}

// 搜尋詩文（根據標題、作者、內容）
export async function searchPoems(query: string): Promise<Poem[]> {
  try {
    const db = getFirestoreDB();
    const snapshot = await db.collection(COLLECTION_NAME).get();
    const poems = snapshot.docs.map((doc: any) => docToPoem(doc));

    // 簡單的文字搜尋（Firestore 的全文搜尋需要額外設定）
    const lowerQuery = query.toLowerCase();
    return poems.filter(
      (poem) =>
        poem.title.toLowerCase().includes(lowerQuery) ||
        poem.author.toLowerCase().includes(lowerQuery) ||
        poem.content.some((line) => line.toLowerCase().includes(lowerQuery)) ||
        poem.translation?.en?.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error("Error searching poems:", error);
    return [];
  }
}

