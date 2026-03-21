<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>英文 - 智人題庫</title>
    <link rel="stylesheet" href="theme.css">
    <style>
        body {
            background-color: var(--bg);
            color: var(--fg);
            transition: background 0.3s, color 0.3s;
            margin: 0;
            font-family: 'Noto Sans TC', Arial, sans-serif;
        }
        .main {
            display: grid;
            grid-template-rows: 260px auto; /* Row 1: Fixed height for title area to ensure consistent Y-pos */
            justify-items: center;
            width: 100%;
            min-height: 90vh;
        }
        .title-group {
            grid-row: 1;
            align-self: end;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 2rem;
        }
        .title {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            letter-spacing: 2px;
            color: var(--fg);
            font-family: 'Noto Serif TC', serif;
            text-align: center;
        }
        .category-list {
            display: flex;
            flex-wrap: wrap;
            gap: 18px;
            justify-content: center;
            max-width: 900px;
            margin: 0 auto 2rem auto;
        }
        .category-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 80px;
            min-height: 48px;
            background: var(--btn-bg);
            color: var(--btn-fg);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 0.5rem 1rem;
            font-size: 1.1rem;
            font-weight: 500;
            text-decoration: none;
            transition: all 0.2s;
            text-align: center;
        }
        .category-btn:hover {
            background: var(--btn-hover-bg);
            color: var(--btn-hover-fg);
            border-color: var(--btn-hover-border);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <script>
        if (localStorage.getItem('themeMode') === 'light') {
            document.body.classList.add('light');
        }
    </script>
    <a href="index.php" style="display:inline-block;width:48px;height:48px;background:transparent;position:absolute;top:12px;left:18px;z-index:20;">
        <img src="logo-removebg-preview.png" alt="logo" id="logo-img" style="width:60px;height:60px;display:block;margin:4px auto;background:transparent;border-radius:0;object-fit:contain;" />
    </a>
    <div class="main">
        <div class="title-group">
            <h1 class="title">英文</h1>
        </div>
        <div class="category-list">
            <a href="english_exam.php" class="category-btn">2000單</a>
            <!-- Placeholders for future categories to match reference feel -->
            <a href="under_construction.php" class="category-btn btn-disabled">學測</a>
            <a href="under_construction.php" class="category-btn btn-disabled">指考</a>
        </div>
    </div>
    <script>
        // Set logo color based on mode
        const logoImg = document.getElementById('logo-img');
        if (document.body.classList.contains('light')) {
            logoImg.style.filter = 'invert(0) brightness(0)';
        }
    </script>
</body>
</html>
