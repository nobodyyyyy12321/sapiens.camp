# Firebase 設定指南

本專案已整合 Firebase Firestore 來存儲用戶資料和詩文資料。

## 設定步驟

### 1. 建立 Firebase 專案

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊「新增專案」或選擇現有專案
3. 完成專案建立流程

### 2. 啟用 Firestore Database

1. 在 Firebase Console 中，前往「Firestore Database」
2. 點擊「建立資料庫」
3. 選擇「以測試模式啟動」（之後可以設定安全規則）
4. 選擇資料庫位置（建議選擇離您最近的區域）

**注意：** Firestore 將用於存儲：
- **users** 集合：用戶帳號資料
- **poems** 集合：詩文資料（唐詩、宋詞、聖經等）

### 3. 建立服務帳號金鑰

1. 在 Firebase Console 中，前往「專案設定」>「服務帳戶」
2. 點擊「產生新的私密金鑰」
3. 下載 JSON 檔案（此檔案包含所需的認證資訊）

### 4. 設定環境變數

在專案根目錄建立 `.env.local` 檔案，並填入以下環境變數：

```env
# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

**如何取得這些值：**

從下載的服務帳號 JSON 檔案中：
- `FIREBASE_PROJECT_ID` = `project_id` 欄位的值
- `FIREBASE_CLIENT_EMAIL` = `client_email` 欄位的值
- `FIREBASE_PRIVATE_KEY` = `private_key` 欄位的值（完整包含 `-----BEGIN PRIVATE KEY-----` 和 `-----END PRIVATE KEY-----`）

**重要提示：**
- `FIREBASE_PRIVATE_KEY` 必須包含完整的私鑰，包括開頭和結尾標記
- 如果私鑰中有換行符，請使用 `\n` 來表示
- 私鑰應該用雙引號包圍

### 5. 設定 Firestore 安全規則（可選）

在 Firebase Console > Firestore Database > 規則中，可以設定安全規則。以下是基本的測試規則：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**注意：** 由於本專案使用 NextAuth 進行認證，Firestore 規則可能需要根據實際需求調整。

### 6. 資料遷移（可選）

#### 遷移用戶資料

如果您有現有的 `data/users.json` 檔案，可以執行以下步驟遷移資料：

1. 確保 Firebase 環境變數已正確設定
2. 執行遷移腳本（需要自行建立）或手動匯入資料

#### 遷移詩文資料

目前詩文資料是硬編碼在頁面中，建議遷移到 Firestore：

1. 使用 `lib/poems-firebase.ts` 中的函數來新增詩文
2. 或建立管理後台來新增/編輯詩文
3. 詳細資料結構請參考 `FIRESTORE_DATA_STRUCTURE.md`

## 驗證設定

啟動開發伺服器後，嘗試註冊新帳號。如果設定正確，用戶資料應該會儲存到 Firestore 中。

## 疑難排解

### 錯誤：Firebase Admin 配置缺失

確保所有三個環境變數都已正確設定在 `.env.local` 檔案中。

### 錯誤：權限不足

檢查服務帳號是否有 Firestore 的讀寫權限。在 Firebase Console > IAM & Admin 中確認。

### 資料未顯示

1. 檢查 Firestore Console 中是否有 `users` 集合
2. 檢查瀏覽器控制台是否有錯誤訊息
3. 確認環境變數已正確載入（重啟開發伺服器）

