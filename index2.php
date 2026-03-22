  <!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
  <link rel="stylesheet" href="theme.css">
  <link rel="icon" type="image/png" href="favicon.png">
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#141414">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="智人題庫">
  <link rel="apple-touch-icon" href="favicon.png">
  
  <style>
    .main {
      display: grid;
      grid-template-rows: 260px auto;
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
    }
    .subtitle {
      font-size: 1.3rem;
      color: var(--subtitle);
      margin-top: -0.5rem;
    }
    .search-box {
      width: 500px;
      max-width: 90vw;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .search-input {
      width: 100%;
      padding: 2mm 1.25rem;
      border-radius: 24px;
      border: 1.5px solid var(--input-border);
      background: var(--input-bg);
      color: var(--input-fg);
      font-size: 1.1rem;
      outline: none;
      transition: border 0.2s;
    }
    .search-input:focus {
      border-color: var(--btn-hover-border);
    }
    .category-list {
      display: flex;
      flex-wrap: wrap;
      column-gap: 12px;
      row-gap: 12px;
      justify-content: center;
      align-items: flex-start;
      align-content: flex-start;
      max-width: 700px;
      margin: 0 auto 2rem auto;
      position: relative;
    }
    .category-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--btn-bg);
      color: var(--btn-fg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 4mm;
      font-size: 1.1rem;
      font-weight: 500;
      line-height: 1;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      text-align: center;
      font-family: 'Inter';
    }
    .category-btn:hover {
      background: var(--btn-hover-bg);
      color: var(--btn-hover-fg);
      border-color: var(--btn-hover-border);
      text-decoration: none;
    }
    .announcement-btn {
      position: fixed;
      left: 40px;
      bottom: 40px;
      background: #222;
      color: #fff;
      border: none;
      border-radius: 12px;
      padding: 0.8rem 2rem;
      font-size: 1.1rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      cursor: pointer;
      z-index: 10;
      font-family: 'Inter', 'Noto Serif TC', serif;
    }
    select.lang-select {
      font-family: 'Inter', 'Noto Serif TC', serif;
    }
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

    .speaker-img-fixed {
      position: fixed;
      left: 400px;
      bottom: -30px;
      z-index: 0;
      width: 200px;
      height: auto;
      margin: 0;
      padding: 0;
      box-shadow: none;
      background: none;
    }
    .announcement-btn i {
      font-style: normal;
      font-size: 1.2rem;
    }
    .feedback {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      color: var(--feedback-color);
      font-size: 1rem;
      opacity: 0.8;
    }
    @media (max-width: 600px) {
      .main {
        margin-top: 40px;
      }
      .title {
        font-size: 2rem;
        margin-top: 80px;
      }
      .search-box {
        width: 100%;
      }
      .category-btn {
        padding: 0.6rem 1rem;
        font-size: 1rem;
      }
      .top-bar {
        right: 16px;
        top: 16px;
      }
      .avatar {
        width: 32px;
        height: 32px;
      }
      .announcement-btn {
        left: 16px;
        bottom: 16px;
        padding: 0.6rem 1.2rem;
      }
    }
  </style>
</head>
<body>
  <div style="display:flex;align-items:center;gap:16px;padding:1rem;">
    <a href="index.php" class="logo-link" style="display:inline-block;width:48px;height:48px;background:transparent;position:absolute;top:12px;left:18px;z-index:20;">
      <img src="logo-removebg-preview.png" alt="logo" id="logo-img" style="width:60px;height:60px;display:block;margin:4px auto;background:transparent;border-radius:0;object-fit:contain;" />
    </a>
  </div>
  <div style="position:absolute;left:32vw;top:3vh;transform:translateY(-50%);z-index:30;">
    <div style="display:flex;flex-direction:column;align-items:center;">
      
    </div>
  </div>
  <div class="top-bar" style="display:flex;align-items:center;gap:16px;position:absolute;right:32px;top:24px;z-index:30;">
    <select class="lang-select" style="min-width:120px;padding:6px 18px;border-radius:8px;border:1.5px solid var(--border);background:var(--btn-bg);color:var(--btn-fg);font-size:1rem;">
      <option>繁體中文</option>
      <option>简体中文</option>
      <option>English</option>
      <option>Español</option>
      <option>ไทย</option>
      <option>Bahasa Indonesia</option>
      <option>한국어</option>
    </select>
  <!-- 亮暗模式切換按鈕已移除 -->
     
    <!-- <div class="avatar"></div> -->
  </div>
  <div class="main">
    <div class="title-group">
      <div class="title">智人題庫</div>
      <div class="subtitle">sapiens.camp</div>
    </div>
    <div class="search-box">
      <input class="search-input" type="text" placeholder="搜尋科目" />
    </div>
    <div class="category-list">
      <a class="category-btn btn-disabled" href="under_construction.php">背東西</a>
      <a class="category-btn btn-disabled" href="under_construction.php">國文</a>
      <a class="category-btn" href="#" id="english-expand-btn">英文</a>
      <span id="english-sublist" style="display:none; position:absolute; left:0; top:100%; background:#fff; border:1px solid #ccc; box-shadow:0 2px 8px rgba(0,0,0,0.08); border-radius:10px; padding:8px 0; min-width:120px; z-index:10;">
        <a class="category-btn" href="test.php?subject=english">2000單</a>
        <a class="category-btn btn-disabled" href="#">學測</a>
        <a class="category-btn btn-disabled" href="#">指考</a>
      </span>
      <a class="category-btn btn-disabled" href="under_construction.php">公職考試</a>
      <a class="category-btn btn-disabled" href="under_construction.php">名言佳句</a>
      <a class="category-btn btn-disabled" href="under_construction.php">綜合</a>
      <a class="category-btn btn-disabled" href="under_construction.php">比賽</a>
      <a class="category-btn btn-disabled" href="under_construction.php">八卦</a>
      <a class="category-btn btn-disabled" href="under_construction.php">猜謎</a>
      <a class="category-btn btn-disabled" href="under_construction.php">笑話</a>
      <a class="category-btn btn-disabled" href="under_construction.php">數學</a>
      <a class="category-btn btn-disabled" href="under_construction.php">物理</a>
      <a class="category-btn btn-disabled" href="under_construction.php">化學</a>
      <a class="category-btn btn-disabled" href="under_construction.php">生物</a>
      <a class="category-btn btn-disabled" href="under_construction.php">地理</a>
      <a class="category-btn btn-disabled" href="under_construction.php">天文</a>
      <a class="category-btn btn-disabled" href="under_construction.php">歷史</a>
      <a class="category-btn btn-disabled" href="under_construction.php">公民</a>
      <a class="category-btn btn-disabled" href="under_construction.php">心理</a>
      <a class="category-btn btn-disabled" href="under_construction.php">哲學</a>
      <a class="category-btn btn-disabled" href="under_construction.php">自然</a>
      <a class="category-btn btn-disabled" href="under_construction.php">社會</a>
    <script>
    // 英文按鈕展開/收合子分類（不跳轉，且不影響搜尋框）
    document.addEventListener('DOMContentLoaded', function() {
      var btn = document.getElementById('english-expand-btn');
      var sublist = document.getElementById('english-sublist');
      if (btn && sublist) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          if (sublist.style.display === 'none' || sublist.style.display === '') {
            // 計算按鈕在父容器的位置
            var btnRect = btn.getBoundingClientRect();
            var parentRect = btn.parentElement.getBoundingClientRect();
            sublist.style.left = (btn.offsetLeft) + 'px';
            sublist.style.top = (btn.offsetTop + btn.offsetHeight + 4) + 'px';
            sublist.style.display = 'block';
          } else {
            sublist.style.display = 'none';
          }
        });
        // 點擊外部自動收合
        document.addEventListener('click', function(e) {
          if (!btn.contains(e.target) && !sublist.contains(e.target)) {
            sublist.style.display = 'none';
          }
        });
      }
    });
    </script>
    </div>
  </div>
  <!-- 公告已移除 -->
  <div class="feedback">意見回饋</div>
</body>
<script>
  // 註冊 service worker 以支援 PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('service-worker.js');
    });
  }
  // 亮暗模式切換相關程式已移除
  // ...existing code...

  // 語言切換與按鈕翻譯
  const langSelect = document.querySelector('.lang-select');
  const titleEl = document.querySelector('.title');
  const btnGroup = document.querySelector('.category-list');
  const originalTitle = titleEl.textContent;
  const originalBtns = Array.from(btnGroup.children).map(btn => btn.textContent);
  const zhTw = ['背東西','國文','英文','公職考試','名言佳句','綜合','比賽','八卦','猜謎','笑話','數學','物理','化學','生物','地理','天文','歷史','公民','心理','哲學','自然','社會'];
  const zhCn = ['背东西','语文','英语','公职考试','名言佳句','综合','比赛','八卦','猜谜','笑话','数学','物理','化学','生物','地理','天文','历史','公民','心理','哲学','自然','社会'];
  const btnTranslations = {
    'English': ['Quote','Math','Physics','Chemistry','Competition'],
    'Español': ['Cita','Matemáticas','Física','Química','Competencia'],
    'ไทย': ['คำคม','คณิตศาสตร์','ฟิสิกส์','เคมี','การแข่งขัน'],
    'Bahasa Indonesia': ['Kutipan','Matematika','Fisika','Kimia','Kompetisi'],
    '한국어': ['명언','수학','물리','화학','경쟁']
  };
  langSelect.addEventListener('change', function() {
    const lang = langSelect.value;
    if (lang === '繁體中文') {
      if (titleEl) titleEl.textContent = originalTitle;
      btnGroup.innerHTML = '';
      zhTw.forEach(txt => {
        const a = document.createElement('a');
        a.className = 'category-btn';
        const isApp = (txt === '英文' || txt === '英语');
        if (!isApp) a.classList.add('btn-disabled');
        a.href = isApp ? 'english.php' : 'under_construction.php';
        a.textContent = txt;
        btnGroup.appendChild(a);
      });
    } else if (lang === '简体中文') {
      if (titleEl) titleEl.textContent = '智人题库';
      btnGroup.innerHTML = '';
      zhCn.forEach(txt => {
        const a = document.createElement('a');
        a.className = 'category-btn';
        const isApp = (txt === '英文' || txt === '英语');
        if (!isApp) a.classList.add('btn-disabled');
        a.href = isApp ? 'english.php' : 'under_construction.php';
        a.textContent = txt;
        btnGroup.appendChild(a);
      });
    } else {
      // 其他語言只顯示五個按鈕
      if (titleEl) titleEl.textContent = originalTitle;
      btnGroup.innerHTML = '';
      (btnTranslations[lang] || btnTranslations['English']).forEach(txt => {
        const a = document.createElement('a');
        a.className = 'category-btn';
        const isApp = (txt === '英文' || txt === '英语');
        if (!isApp) a.classList.add('btn-disabled');
        a.href = isApp ? 'english.php' : 'under_construction.php';
        a.textContent = txt;
        btnGroup.appendChild(a);
      });
    }
  });
</script>
  <img src="speaker.png" alt="speaker" class="speaker-img-fixed" id="speaker-img">
  <div id="speaker-tooltip" style="display:none;position:fixed;top:0;left:0;background:rgba(0,0,0,0.85);color:#fff;padding:10px 18px;border-radius:12px;font-size:1.1rem;z-index:101;box-shadow:0 2px 8px rgba(0,0,0,0.15);pointer-events:none;">推荐搭配一點音樂</div>
  <script>
    const speakerImg = document.getElementById('speaker-img');
    const logoImg = document.getElementById('logo-img');
    const tooltip = document.getElementById('speaker-tooltip');
    speakerImg.addEventListener('mouseenter', function(e) {
      tooltip.style.display = 'block';
    });
    speakerImg.addEventListener('mouseleave', function(e) {
      tooltip.style.display = 'none';
    });
    speakerImg.addEventListener('mousemove', function(e) {
      const offsetX = 18;
      const offsetY = 18;
      tooltip.style.left = (e.clientX + offsetX) + 'px';
      tooltip.style.top = (e.clientY + offsetY) + 'px';
    });

    function setImageColorByMode() {
      const isLight = document.body.classList.contains('light');
      if (isLight) {
        speakerImg.style.filter = 'invert(0) brightness(0)';
        logoImg.style.filter = 'invert(0) brightness(0)';
        document.getElementById('bulbCircle').setAttribute('fill', '#FFD600');
      } else {
        speakerImg.style.filter = '';
        logoImg.style.filter = '';
        document.getElementById('bulbCircle').setAttribute('fill', '#FFF');
      }
    }
    setImageColorByMode();
    // Listen for mode changes
    const observer = new MutationObserver(setImageColorByMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });


      const isLight = document.body.classList.toggle('light');
      localStorage.setItem('themeMode', isLight ? 'light' : 'dark');
      setImageColorByMode();
    });
  </script>
  <script src="context_menu.js"></script>
</body>
</html>
