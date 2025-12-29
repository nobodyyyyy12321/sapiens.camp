/**
 * 遷移腳本：將 users.json 中的用戶資料遷移到 Firebase Firestore
 * 
 * 使用方法：
 * 1. 確保已設定 Firebase 環境變數（.env.local）
 * 2. 執行：npx tsx scripts/migrate-users-to-firebase.ts
 * 
 * 注意：此腳本會檢查重複的 email，不會覆蓋現有資料
 */

import fs from "fs";
import path from "path";
import { getFirestoreDB } from "../lib/firebase-admin";
import type { User } from "../lib/users-firebase";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function migrateUsers() {
  try {
    console.log("開始遷移用戶資料到 Firebase...\n");

    // 檢查 users.json 是否存在
    if (!fs.existsSync(USERS_FILE)) {
      console.log(`ℹ️  提示：找不到 ${USERS_FILE}`);
      console.log("   這表示沒有本地用戶資料需要遷移。");
      console.log("   如果這是新專案，用戶資料將直接儲存在 Firebase 中。\n");
      console.log("✅ 遷移完成（無資料需要遷移）");
      process.exit(0);
    }

    // 讀取現有用戶資料
    let users: User[] = [];
    try {
      const rawData = fs.readFileSync(USERS_FILE, { encoding: "utf-8" });
      const parsed = JSON.parse(rawData);
      
      // 確保是陣列格式
      if (Array.isArray(parsed)) {
        users = parsed;
      } else {
        console.warn("⚠️  警告：users.json 格式不正確，應該是陣列格式");
        process.exit(0);
      }
    } catch (parseError: any) {
      console.error(`❌ 錯誤：無法解析 ${USERS_FILE}`);
      console.error(`   原因：${parseError.message}`);
      process.exit(1);
    }

    if (users.length === 0) {
      console.log("ℹ️  提示：users.json 是空陣列，沒有用戶資料需要遷移。");
      console.log("   如果這是新專案，用戶資料將直接儲存在 Firebase 中。\n");
      console.log("✅ 遷移完成（無資料需要遷移）");
      process.exit(0);
    }

    console.log(`找到 ${users.length} 個用戶資料\n`);

    // 初始化 Firebase
    const db = getFirestoreDB();
    const usersCollection = db.collection("users");

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

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
            console.log(`⏭️  跳過：${user.email}（已存在）`);
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

        console.log(`✅ 已遷移：${user.email || user.name} (ID: ${user.id})`);
        successCount++;
      } catch (error: any) {
        console.error(`❌ 錯誤：${user.email || user.name} - ${error.message}`);
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("遷移完成！");
    console.log(`✅ 成功：${successCount} 個用戶`);
    if (skipCount > 0) {
      console.log(`⏭️  跳過：${skipCount} 個用戶（已存在於 Firebase）`);
    }
    if (errorCount > 0) {
      console.log(`❌ 錯誤：${errorCount} 個用戶`);
    }
    console.log("=".repeat(50));

    // 如果所有用戶都跳過（已存在），這也是正常的
    if (successCount === 0 && skipCount > 0) {
      console.log("\nℹ️  所有用戶都已存在於 Firebase，無需遷移。");
    }

    if (errorCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error: any) {
    console.error("遷移失敗：", error.message);
    console.error(error);
    process.exit(1);
  }
}

// 執行遷移
migrateUsers();

