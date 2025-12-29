/**
 * 管理員 API：遷移用戶資料到 Firebase
 * 
 * 注意：此 API 應該有適當的身份驗證保護
 * 建議：只在首次部署時使用，完成後可以刪除或禁用此路由
 */

import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import fs from "fs";
import path from "path";
import { getFirestoreDB } from "../../../../lib/firebase-admin";
import type { User } from "../../../../lib/users-firebase";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

export async function POST(req: Request) {
  try {
    // 身份驗證檢查（可選，根據需求調整）
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    // 檢查 users.json 是否存在
    if (!fs.existsSync(USERS_FILE)) {
      return NextResponse.json({
        success: true,
        message: "No users.json file found. This is normal for new projects - users will be stored directly in Firebase.",
        stats: { total: 0, success: 0, skipped: 0, errors: 0 },
      });
    }

    // 讀取現有用戶資料
    let users: User[] = [];
    try {
      const rawData = fs.readFileSync(USERS_FILE, { encoding: "utf-8" });
      const parsed = JSON.parse(rawData);
      
      if (Array.isArray(parsed)) {
        users = parsed;
      } else {
        return NextResponse.json({
          success: false,
          error: "Invalid users.json format. Expected an array.",
          stats: { total: 0, success: 0, skipped: 0, errors: 0 },
        });
      }
    } catch (parseError: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to parse users.json",
          message: parseError.message,
          stats: { total: 0, success: 0, skipped: 0, errors: 0 },
        },
        { status: 400 }
      );
    }

    if (users.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No users to migrate. users.json is empty. This is normal for new projects - users will be stored directly in Firebase.",
        stats: { total: 0, success: 0, skipped: 0, errors: 0 },
      });
    }

    // 初始化 Firebase
    const db = getFirestoreDB();
    const usersCollection = db.collection("users");

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // 遷移每個用戶
    for (const user of users) {
      try {
        // 檢查是否已存在（根據 email）
        if (user.email) {
          const existingQuery = await usersCollection
            .where("email", "==", user.email.toLowerCase())
            .limit(1)
            .get();

          if (!existingQuery.empty) {
            skipCount++;
            continue;
          }
        }

        // 準備用戶資料
        const userData: any = {
          name: user.name,
          email: user.email?.toLowerCase(),
          passwordHash: user.passwordHash,
          emailVerified: user.emailVerified || false,
          verificationToken: user.verificationToken,
          verificationExpires: user.verificationExpires,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
          socialLinks: user.socialLinks,
        };

        // 移除 undefined 欄位
        Object.keys(userData).forEach((key) => {
          if (userData[key] === undefined) {
            delete userData[key];
          }
        });

        // 寫入 Firestore（使用原有的 ID）
        await usersCollection.doc(user.id).set(userData);
        successCount++;
      } catch (error: any) {
        errorCount++;
        errors.push(`${user.email || user.name}: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Migration completed",
      stats: {
        total: users.length,
        success: successCount,
        skipped: skipCount,
        errors: errorCount,
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "Migration failed", message: error.message },
      { status: 500 }
    );
  }
}

