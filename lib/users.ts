import fs from "fs";
import path from "path";

export type User = {
  id: string;
  name: string;
  email?: string;
  passwordHash?: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    website?: string;
    [key: string]: string | undefined;
  };
};

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]");
}

export function getUsers(): User[] {
  ensureDataDir();
  const raw = fs.readFileSync(USERS_FILE, { encoding: "utf-8" });
  try {
    return JSON.parse(raw) as User[];
  } catch (e) {
    return [];
  }
}

export function findUserByEmail(email: string): User | undefined {
  if (!email) return undefined;
  return getUsers().find((u) => (u.email || "").toLowerCase() === email.toLowerCase());
}

export function findUserByName(name: string): User | undefined {
  return getUsers().find((u) => u.name === name);
}

export function saveUser(user: User) {
  const users = getUsers();
  users.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function updateUser(id: string, updates: Partial<User>) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  return users[idx];
}

