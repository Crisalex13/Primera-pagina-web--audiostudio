/* ============================================
   menu.js
   ============================================
   TABLA DE CONTENIDO
   ============================================
   1. Menú Hamburguesa
      1.1 Declaración de elementos del DOM
      1.2 Abrir/Cerrar menú con click
      1.3 Cerrar menú al hacer click fuera
      1.4 Cerrar menú con tecla ESC

   2. Acciones del Menú
      2.1 Acción: Configuración (abrir sidebar)
      2.2 Acción: Mis pedidos (alert)
      2.3 Acción: Lista de deseos (alert)
      2.4 Acción: Cerrar sesión
      2.5 Cerrar menú después de seleccionar

   3. Sidebar de Configuración
      3.1 Cerrar sidebar con botón X
      3.2 Cerrar sidebar con overlay
      3.3 Evitar propagación de eventos en sidebar

   4. Gestión de Temas
      4.1 Declaración de elementos del tema
      4.2 Función: updateSidebarThemeUI
      4.3 Función: loadThemeInSidebar
      4.4 Función: setThemeFromSidebar
      4.5 Evento: click en opciones de tema
      4.6 Evento: click en toggle de tema

   5. Configuración General
      5.1 Declaración de elementos de configuración
      5.2 Función: Cambio de idioma
      5.3 Función: Preferencias de notificaciones

   6. Inicialización
      6.1 Cargar tema guardado

   ============================================ */

// 1. Menú Hamburguesa
// 1.1 Declaración de elementos del DOM
const menuBtn = document.getElementById('menuButton');
const menuContainer = document.getElementById('menuContainer');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const closeSidebarBtn = document.getElementById('closeSidebar');

// 1.2 Abrir/Cerrar menú con click
if (menuBtn && menuContainer) {
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    menuContainer.classList.toggle('active');
    
    const isExpanded = menuContainer.classList.contains('active');
    menuBtn.setAttribute('aria-expanded', isExpanded);
    
    console.log('Menú clickeado, clase active:', menuContainer.classList.contains('active'));
  });

  // 1.3 Cerrar menú al hacer click fuera
  document.addEventListener('click', (e) => {
    if (menuContainer && !menuContainer.contains(e.target)) {
      menuContainer.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
  
  // 1.4 Cerrar menú con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuContainer.classList.contains('active')) {
      menuContainer.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// 2. Acciones del Menú
document.querySelectorAll('.more-button-list-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    const action = item.dataset.action;
    
    switch(action) {
      // 2.1 Acción: Configuración (abrir sidebar)
      case 'config':
        if (sidebar) sidebar.classList.add('open');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
        break;
      
      // 2.2 Acción: Mis pedidos (alert)
      case 'orders':
        alert('📦 Tus pedidos próximamente');
        break;
      
      // 2.3 Acción: Lista de deseos (alert)
      case 'wishlist':
        alert('❤️ Tu lista de deseos próximamente');
        break;
      
      // 2.4 Acción: Cerrar sesión
      case 'logout':
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
          const logoutBtn = document.getElementById('logoutBtn');
          if (logoutBtn) logoutBtn.click();
        }
        break;
      
      default:
        console.log(`📌 Seleccionaste: ${item.querySelector('span')?.innerText || 'opción'}`);
    }
    
    // 2.5 Cerrar menú después de seleccionar
    if (menuContainer) menuContainer.classList.remove('active');
  });
});

// 3. Sidebar de Configuración
// 3.1 Cerrar sidebar con botón X
if (closeSidebarBtn) {
  closeSidebarBtn.addEventListener('click', () => {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
  });
}

// 3.2 Cerrar sidebar con overlay
if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', () => {
    if (sidebar) sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  });
}

// 3.3 Evitar propagación de eventos en sidebar
if (sidebar) {
  sidebar.addEventListener('click', (e) => e.stopPropagation());
}

// 4. Gestión de Temas
// 4.1 Declaración de elementos del tema
const themeToggleSidebar = document.getElementById('themeToggleSidebar');
const themeOptions = document.querySelectorAll('.theme-option');

// 4.2 Función: updateSidebarThemeUI
function updateSidebarThemeUI(theme) {
  themeOptions.forEach(opt => {
    if (opt.getAttribute('data-theme') === theme) {
      opt.classList.add('active');
    } else {
      opt.classList.remove('active');
    }
  });
  
  if (themeToggleSidebar) {
    themeToggleSidebar.setAttribute('data-theme-state', theme);
  }
}

// 4.3 Función: loadThemeInSidebar
function loadThemeInSidebar() {
  const savedTheme = localStorage.getItem('theme');
  const currentTheme = savedTheme === 'light' ? 'light' : 'dark';
  updateSidebarThemeUI(currentTheme);
}

// 4.4 Función: setThemeFromSidebar
function setThemeFromSidebar(theme) {
  if (typeof setTheme === 'function') {
    setTheme(theme === 'light');
  }
  updateSidebarThemeUI(theme);
}

// 4.5 Evento: click en opciones de tema
if (themeOptions.length > 0) {
  themeOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const theme = option.getAttribute('data-theme');
      setThemeFromSidebar(theme);
    });
  });
}

// 4.6 Evento: click en toggle de tema
if (themeToggleSidebar) {
  themeToggleSidebar.addEventListener('click', (e) => {
    if (!e.target.classList.contains('theme-option')) {
      const currentState = themeToggleSidebar.getAttribute('data-theme-state');
      const newTheme = currentState === 'light' ? 'dark' : 'light';
      setThemeFromSidebar(newTheme);
    }
  });
}

// 5. Configuración General
// 5.1 Declaración de elementos de configuración
const languageSelect = document.getElementById('languageSelect');
const notificationsToggle = document.getElementById('notificationsToggle');

// 5.2 Función: Cambio de idioma
if (languageSelect) {
  const savedLanguage = localStorage.getItem('language') || 'es';
  languageSelect.value = savedLanguage;
  
  languageSelect.addEventListener('change', (e) => {
    const selectedLang = e.target.value;
    localStorage.setItem('language', selectedLang);
    console.log(`🌐 Idioma cambiado a: ${selectedLang === 'es' ? 'Español' : 'English'}`);
  });
}

// 5.3 Función: Preferencias de notificaciones
if (notificationsToggle) {
  const savedNotifications = localStorage.getItem('notifications');
  if (savedNotifications === 'false') {
    notificationsToggle.checked = false;
  } else {
    notificationsToggle.checked = true;
  }
  
  notificationsToggle.addEventListener('change', (e) => {
    localStorage.setItem('notifications', e.target.checked);
    console.log(`🔔 Notificaciones: ${e.target.checked ? 'Activadas' : 'Desactivadas'}`);
    
    if (e.target.checked && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  });
}

// 6. Inicialización
// 6.1 Cargar tema guardado
loadThemeInSidebar();
