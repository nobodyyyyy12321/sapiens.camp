(function() {
  const menuHTML = `
    <div id="custom-context-menu" class="custom-context-menu">
      <div class="context-menu-item">登入/ 登出</div>
      <div class="context-menu-separator"></div>
      <div class="context-menu-item">檔案</div>
      <div class="context-menu-item">紀錄</div>
      <div class="context-menu-item">個人清單</div>
      <div class="context-menu-separator"></div>
      <div class="context-menu-item">設定</div>
      <div class="context-menu-item">付費方案</div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', menuHTML);

  const menu = document.getElementById('custom-context-menu');

  window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    menu.style.display = 'block';
    
    // Position the menu
    let x = e.clientX;
    let y = e.clientY;
    
    // Initial positioning to get dimensions
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    
    // Guard against overflow
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    const menuWidth = menu.offsetWidth || 160;
    const menuHeight = menu.offsetHeight || 250;

    if (x + menuWidth > winWidth) x = winWidth - menuWidth - 10;
    if (y + menuHeight > winHeight) y = winHeight - menuHeight - 10;

    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
  });

  window.addEventListener('mousedown', (e) => {
    if (!menu.contains(e.target)) {
      menu.style.display = 'none';
    }
  });

  // Prevent internal clicks from bubbling and closing (optional, items are disabled anyway)
  menu.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });
})();
