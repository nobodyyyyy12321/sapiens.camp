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
      <div id="bulb-container"></div>
    </div>
  `;
  document.body.appendChild(btn);

  function createBulbSVG(isLight) {
    const color = isLight ? '#FFD600' : '#FFF';
    return `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="14" fill="${color}" stroke="#bbb" stroke-width="2"/>
      <rect x="20" y="34" width="8" height="8" rx="2" fill="#bbb"/>
      <rect x="22" y="42" width="4" height="4" rx="1" fill="#bbb"/>
    </svg>`;
  }

  function updateBulbIcon() {
    var bulbContainer = document.getElementById('bulb-container');
    if (!bulbContainer) return;
    const isLight = document.body.classList.contains('light');
    bulbContainer.innerHTML = createBulbSVG(isLight);
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
