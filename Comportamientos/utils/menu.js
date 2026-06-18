/* ============================================================
   menu.js - Menú Hamburguesa y Sidebar
   ============================================================
   TABLA DE CONTENIDO
   ============================================================
   1. Menú Hamburguesa
      1.1 Declaración de elementos del DOM
      1.2 Abrir/Cerrar menú con click
      1.3 Cerrar menú al hacer click fuera
      1.4 Cerrar menú con tecla ESC

   2. Acciones del Menú
      2.1 Configuración
      2.2 Mis pedidos
      2.3 Lista de deseos
      2.4 Cerrar sesión

   3. Sidebar de Configuración
      3.1 Cerrar sidebar
      3.2 Cerrar con overlay

   4. Gestión de Temas en Sidebar
      4.1 updateSidebarThemeUI
      4.2 loadThemeInSidebar
      4.3 setThemeFromSidebar
      4.4 Eventos de tema

   5. Configuración General
      5.1 Idioma
      5.2 Notificaciones

   6. Inicialización
      6.1 Cargar tema guardado
   ============================================================ */

// ── 1. Menú Hamburguesa ──
const menuBtn = document.getElementById('menuButton');
const menuContainer = document.getElementById('menuContainer');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const closeSidebarBtn = document.getElementById('closeSidebar');

if (menuBtn && menuContainer) {
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    menuContainer.classList.toggle('active');
    menuBtn.setAttribute('aria-expanded', menuContainer.classList.contains('active'));
  });

  document.addEventListener('click', (e) => {
    if (menuContainer && !menuContainer.contains(e.target)) {
      menuContainer.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuContainer.classList.contains('active')) {
      menuContainer.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── 2. Acciones del Menú ──
document.querySelectorAll('.more-button-list-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    const action = item.dataset.action;
    
    switch(action) {
      case 'config':
        if (sidebar) sidebar.classList.add('open');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
        break;
      case 'orders':
        alert('📦 Tus pedidos próximamente');
        break;
      case 'wishlist':
        alert('❤️ Tu lista de deseos próximamente');
        break;
      case 'logout':
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
          const logoutBtn = document.getElementById('logoutBtn');
          if (logoutBtn) logoutBtn.click();
        }
        break;
    }
    
    if (menuContainer) menuContainer.classList.remove('active');
  });
});

// ── 3. Sidebar de Configuración ──
if (closeSidebarBtn) {
  closeSidebarBtn.addEventListener('click', () => {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
  });
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', () => {
    if (sidebar) sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  });
}

if (sidebar) {
  sidebar.addEventListener('click', (e) => e.stopPropagation());
}

// ── 4. Gestión de Temas en Sidebar ──
const themeToggleSidebar = document.getElementById('themeToggleSidebar');
const themeOptions = document.querySelectorAll('.theme-option');

function updateSidebarThemeUI(theme) {
  themeOptions.forEach(opt => {
    opt.classList.toggle('active', opt.getAttribute('data-theme') === theme);
  });
  if (themeToggleSidebar) {
    themeToggleSidebar.setAttribute('data-theme-state', theme);
  }
}

function loadThemeInSidebar() {
  const savedTheme = localStorage.getItem('theme');
  const currentTheme = savedTheme === 'light' ? 'light' : 'dark';
  updateSidebarThemeUI(currentTheme);
}

function setThemeFromSidebar(theme) {
  if (typeof setTheme === 'function') {
    setTheme(theme === 'light');
  }
  updateSidebarThemeUI(theme);
}

if (themeOptions.length > 0) {
  themeOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      setThemeFromSidebar(option.getAttribute('data-theme'));
    });
  });
}

if (themeToggleSidebar) {
  themeToggleSidebar.addEventListener('click', (e) => {
    if (!e.target.classList.contains('theme-option')) {
      const currentState = themeToggleSidebar.getAttribute('data-theme-state');
      const newTheme = currentState === 'light' ? 'dark' : 'light';
      setThemeFromSidebar(newTheme);
    }
  });
}

// ── 5. Configuración General ──
const languageSelect = document.getElementById('languageSelect');
const notificationsToggle = document.getElementById('notificationsToggle');

if (languageSelect) {
  const savedLanguage = localStorage.getItem('language') || 'es';
  languageSelect.value = savedLanguage;
  
  languageSelect.addEventListener('change', (e) => {
    localStorage.setItem('language', e.target.value);
    console.log(`🌐 Idioma cambiado a: ${e.target.value === 'es' ? 'Español' : 'English'}`);
  });
}

if (notificationsToggle) {
  const savedNotifications = localStorage.getItem('notifications');
  notificationsToggle.checked = savedNotifications !== 'false';
  
  notificationsToggle.addEventListener('change', (e) => {
    localStorage.setItem('notifications', e.target.checked);
    console.log(`🔔 Notificaciones: ${e.target.checked ? 'Activadas' : 'Desactivadas'}`);
    
    if (e.target.checked && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  });
}

// ── 6. Inicialización ──
loadThemeInSidebar();