<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>建構中 - 智人題庫</title>
  <link href="https://fonts.googleapis.com/css?family=Noto+Sans+TC:400,700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="theme.css">
  <style>
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .title {
      font-size: 2.4rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      letter-spacing: 2px;
      color: var(--fg);
      text-align: center;
    }
    .subtitle {
      font-size: 1.3rem;
      color: #ffd600;
      margin-bottom: 2rem;
      text-align: center;
    }
    .icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      color: #ffd600;
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
  <div class="icon">🚧</div>
  <div class="title">建構中</div>
  <script>
    const logoImg = document.getElementById('logo-img');
    if (document.body.classList.contains('light')) {
      logoImg.style.filter = 'invert(0) brightness(0)';
    }
  </script>
</body>
</html>
