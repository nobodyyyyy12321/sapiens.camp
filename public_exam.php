<!-- Use layout.html as template -->
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>公職考試 - 智人題庫</title>
  <link rel="stylesheet" href="theme.css">
  
  <style>
    .btn-group {
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
      justify-content: center;
      margin-bottom: 2rem;
    }
    .exam-btn {
      display: inline-block;
      background: var(--btn-bg);
      color: var(--btn-fg);
      border: 2px solid var(--btn-border);
      border-radius: 12px;
      padding: 0.8rem 2rem;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s, color 0.2s, border 0.2s;
      text-decoration: none;
      text-align: center;
    }
    .exam-btn:hover {
      background: var(--btn-hover-bg);
      color: var(--btn-hover-fg);
      border-color: var(--btn-hover-border);
      text-decoration: none;
    }
    @media (max-width: 600px) {
      .btn-group {
        gap: 1rem;
      }
      .exam-btn {
        padding: 0.6rem 1rem;
        font-size: 1rem;
      }
      .title {
        font-size: 2rem;
        margin-top: 80px;
      }
    }
  </style>
</head>
<body>
  <header style="display:flex;align-items:center;justify-content:space-between;padding:1rem;">
    <img src="logo.png" alt="Sapiens Camp Logo" style="height:40px;">
  </header>
  <main class="main" style="text-align: center; margin-top: 50px;">
    <div class="title" style="font-size: 2.5rem; margin-bottom: 30px;">公職考試 - 智人題庫</div>
    <div class="btn-group">
      <a class="exam-btn" href="exam_bank.php">國考題庫</a>
      <a class="exam-btn" href="under_construction.php">初等考試</a>
      <a class="exam-btn" href="under_construction.php">高普考</a>
      <a class="exam-btn" href="under_construction.php">地方特考</a>
      <a class="exam-btn" href="index.php">回首頁</a>
    </div>
  </main>
</body>
</html>
