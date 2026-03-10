// bulb-toggle.js
(function(){
  // 建立燈泡切換按鈕
  var btn = document.createElement('button');
  btn.id = 'modeToggle';
  btn.style.position = 'fixed';
  btn.style.left = '35vw';
  btn.style.top = '24px';
  btn.style.zIndex = '50';
  btn.style.background = 'transparent';
  btn.style.border = 'none';
  btn.style.cursor = 'pointer';
  btn.style.padding = '0';
  btn.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="height:48px;width:2px;background:#bbb;margin-bottom:-8px;"></div>
      <img id="bulbDark" src="bulb-dark.png" alt="暗燈泡" style="width:80px;height:80px;display:block;transform:rotate(180deg);" />
      <img id="bulbLight" src="bulb-light.png" alt="亮燈泡" style="width:80px;height:80px;display:none;transform:rotate(180deg);" />
    </div>
  `;
  document.body.appendChild(btn);

  function updateBulbIcon() {
        <div id="bulb-container"></div>
    if (document.body.classList.contains('light')) {
      bulbDark.style.display = 'none';
      bulbLight.style.display = 'block';
    } else {
      bulbDark.style.display = 'block';
      bulbLight.style.display = 'none';
    }
  }
  function applySavedTheme() {
    var saved = localStorage.getItem('themeMode');
    if (saved === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    updateBulbIcon();
  }
  btn.addEventListener('click', function() {
    var isLight = document.body.classList.toggle('light');
    localStorage.setItem('themeMode', isLight ? 'light' : 'dark');
    updateBulbIcon();
  });
  applySavedTheme();
  window.addEventListener('storage', function(e) {
    if (e.key === 'themeMode') {
      applySavedTheme();
    }
  });
})();
