import { getFirestoreDB } from "./firebase-admin";

export type Article = {
  id: string;
  title: string;
  category?: string;
  author?: string;
  content: string[] | string; // support array or single string
  tags?: string[];
  type?: string; // e.g., 'poem'
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
};

const COLLECTION_NAME = "articles";

function docToArticle(doc: any): Article {
  return {
    id: doc.id,
    ...doc.data(),
  } as Article;
}

export async function getArticles(filters?: { type?: string; category?: string }): Promise<Article[]> {
  try {
    const db = getFirestoreDB();
    let query: any = db.collection(COLLECTION_NAME);
    if (filters?.type) query = query.where("type", "==", filters.type);
    if (filters?.category) query = query.where("category", "==", filters.category);
    const snapshot = await query.get();
    return snapshot.docs.map((d: any) => docToArticle(d));
  } catch (err) {
    console.error("Error getting articles:", err);
    return [];
  }
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  try {
    const db = getFirestoreDB();
    // try category field first
    let snapshot = await db.collection(COLLECTION_NAME).where("category", "==", category).get();
    if (!snapshot.empty) return snapshot.docs.map((d: any) => docToArticle(d));
    // fallback to type field
    snapshot = await db.collection(COLLECTION_NAME).where("type", "==", category).get();
    if (!snapshot.empty) return snapshot.docs.map((d: any) => docToArticle(d));
    return [];
  } catch (err) {
    console.error("Error getting articles by category:", err);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const db = getFirestoreDB();
    const snapshot = await db.collection(COLLECTION_NAME).where("slug", "==", slug).limit(1).get();
    if (snapshot.empty) return undefined;
    return docToArticle(snapshot.docs[0]);
  } catch (err) {
    console.error("Error getting article by slug:", err);
    return undefined;
  }
}

export async function getArticleByTitle(title: string): Promise<Article | undefined> {
  try {
    const db = getFirestoreDB();
    const snapshot = await db.collection(COLLECTION_NAME).where("title", "==", title).limit(1).get();
    if (snapshot.empty) return undefined;
    return docToArticle(snapshot.docs[0]);
  } catch (err) {
    console.error("Error getting article by title:", err);
    return undefined;
  }
}

export async function createArticle(article: Omit<Article, "id" | "createdAt" | "updatedAt">) {
  try {
    const db = getFirestoreDB();
    const now = new Date().toISOString();
    const data: any = { ...article, createdAt: now, updatedAt: now };
    const docRef = await db.collection(COLLECTION_NAME).add(data);
    const doc = await docRef.get();
    return docToArticle(doc);
  } catch (err) {
    console.error("Error creating article:", err);
    throw err;
  }
}