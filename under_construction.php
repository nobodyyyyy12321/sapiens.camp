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
  <div class="icon">🚧</div>
  <div class="title">建構中</div>
</body>
</html>
