# Firestore 資料結構設計

## 集合 (Collections)

### 1. `users` - 用戶資料

```typescript
{
  id: string;                    // 用戶 ID
  name: string;                  // 用戶名稱
  email?: string;                // 電子郵件
  passwordHash?: string;         // 密碼雜湊
  emailVerified?: boolean;       // 郵件驗證狀態
  verificationToken?: string;    // 驗證令牌
  verificationExpires?: string;  // 驗證過期時間 (ISO string)
  bio?: string;                  // 個人簡介
  avatarUrl?: string;           // 頭像 URL
  socialLinks?: {                // 社交連結
    twitter?: string;
    github?: string;
    website?: string;
    [key: string]: string | undefined;
  };
}
```

### 2. `poems` - 詩文資料

```typescript
{
  id: string;                    // 詩文 ID（自動生成）
  title: string;                 // 詩名，如 "靜夜思"
  titleEn?: string;              // 英文標題（可選）
  slug: string;                  // URL slug，如 "jingye-si"
  author: string;                // 作者，如 "李白"
  authorEn?: string;             // 作者英文名，如 "Li Bai"
  dynasty?: string;              // 朝代，如 "唐"
  dynastyEn?: string;            // 朝代英文，如 "Tang"
  content: string[];             // 詩文內容，每行一個元素
  translation?: {                // 翻譯
    en?: string;                 // 英文翻譯
    [key: string]: string | undefined; // 其他語言
  };
  tags?: string[];               // 標籤，如 ["思鄉", "月亮", "夜晚"]
  category: string;              // 分類: "poem" (唐詩), "songci" (宋詞), "bible" (聖經)
  difficulty?: number;            // 難度等級 1-5
  createdAt: string;             // 建立時間 (ISO string)
  updatedAt: string;             // 更新時間 (ISO string)
}
```

### 3. `user_progress` - 用戶學習進度（可選）

```typescript
{
  id: string;                    // 進度 ID
  userId: string;                // 用戶 ID
  poemId: string;                // 詩文 ID
  status: "not_started" | "learning" | "mastered"; // 學習狀態
  lastPracticed?: string;        // 最後練習時間 (ISO string)
  practiceCount: number;         // 練習次數
  masteryScore?: number;         // 熟練度分數 0-100
  notes?: string;                // 用戶筆記
  createdAt: string;             // 建立時間
  updatedAt: string;             // 更新時間
}
```

## 索引建議

為了優化查詢效能，建議在 Firestore Console 中建立以下複合索引：

1. **poems 集合：**
   - `category` + `dynasty` + `createdAt` (降序)
   - `author` + `category` + `createdAt` (降序)
   - `tags` (陣列) + `category`

2. **user_progress 集合：**
   - `userId` + `status` + `lastPracticed` (降序)
   - `userId` + `poemId` (唯一)

## 資料範例

### 詩文範例

```json
{
  "title": "靜夜思",
  "titleEn": "Quiet Night Thoughts",
  "slug": "jingye-si",
  "author": "李白",
  "authorEn": "Li Bai",
  "dynasty": "唐",
  "dynastyEn": "Tang",
  "content": [
    "床前明月光，",
    "疑是地上霜。",
    "舉頭望明月，",
    "低頭思故鄉。"
  ],
  "translation": {
    "en": "Moonlight before my bed — Is it frost on the ground? Looking up, I find the moon bright; Bowing, in homesickness I'm drowned."
  },
  "tags": ["思鄉", "月亮", "夜晚"],
  "category": "poem",
  "difficulty": 2,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 安全規則建議

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 用戶資料：只能讀寫自己的資料
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 詩文資料：所有人可讀，只有管理員可寫
    match /poems/{poemId} {
      allow read: if true; // 公開讀取
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true;
    }
    
    // 用戶進度：只能讀寫自己的進度
    match /user_progress/{progressId} {
      allow read, write: if request.auth != null && 
                            resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                      request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## 遷移現有資料

如果您有現有的詩文資料（目前硬編碼在頁面中），可以：

1. 建立一個遷移腳本，將現有詩文資料匯入 Firestore
2. 或手動在 Firebase Console 中新增資料
3. 或建立管理後台來新增/編輯詩文

