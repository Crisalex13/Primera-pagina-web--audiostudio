/* ============================================
   menu.js 
   ============================================
   1.
   ============================================ */

// 1. Menú Hamburguesa 
const menuBtn = document.getElementById('menuButton');
const menuContainer = document.getElementById('menuContainer');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const closeSidebarBtn = document.getElementById('closeSidebar');

// ========== ABRIR/CERRAR MENÚ HAMBURGUESA ==========
if (menuBtn && menuContainer) {
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    menuContainer.classList.toggle('active');
    
    // MEJORA 1: Atributo aria-expanded para accesibilidad
    const isExpanded = menuContainer.classList.contains('active');
    menuBtn.setAttribute('aria-expanded', isExpanded);
    
    console.log('Menú clickeado, clase active:', menuContainer.classList.contains('active'));
  });

  // MEJORA 2: Cerrar al hacer click fuera
  document.addEventListener('click', (e) => {
    if (menuContainer && !menuContainer.contains(e.target)) {
      menuContainer.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
  
  // MEJORA 3: Cerrar con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuContainer.classList.contains('active')) {
      menuContainer.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// 2. Acciones del Menú (MEJORADAS)
document.querySelectorAll('.more-button-list-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    const action = item.dataset.action;
    
    switch(action) {
      case 'config':
        // MEJORA 4: Usar la clase que ya tiene tu CSS
        if (sidebar) sidebar.classList.add('open');  // ← USA 'open' como tu CSS original
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
        break;
      case 'orders':
        // MEJORA 5: Confirmación más amigable
        Swal.fire?.({
          title: '📦 Mis Pedidos',
          text: 'Funcionalidad en desarrollo',
          icon: 'info',
          confirmButtonColor: '#5fc234'
        }) || alert('📦 Tus pedidos próximamente');
        break;
      case 'wishlist':
        Swal.fire?.({
          title: '❤️ Lista de Deseos',
          text: 'Funcionalidad en desarrollo',
          icon: 'info',
          confirmButtonColor: '#5fc234'
        }) || alert('❤️ Tu lista de deseos próximamente');
        break;
      case 'logout':
        // MEJORA 6: Confirmación antes de cerrar sesión
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
          const logoutBtn = document.getElementById('logoutBtn');
          if (logoutBtn) logoutBtn.click();
        }
        break;
      default:
        console.log(`📌 Seleccionaste: ${item.querySelector('span')?.innerText || 'opción'}`);
    }
    
    // Cerrar menú después de seleccionar
    if (menuContainer) menuContainer.classList.remove('active');
  });
});

// 3. Sidebar de Configuración (MANTIENE TU CÓDIGO ORIGINAL)
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

// 4. Gestión de Temas (MEJORADA)
const themeToggleSidebar = document.getElementById('themeToggleSidebar');
const themeOptions = document.querySelectorAll('.theme-option');

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
      const theme = option.getAttribute('data-theme');
      setThemeFromSidebar(theme);
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

// 5. Configuración General (MEJORADA)
const languageSelect = document.getElementById('languageSelect');
if (languageSelect) {
  // Cargar idioma guardado
  const savedLanguage = localStorage.getItem('language') || 'es';
  languageSelect.value = savedLanguage;
  
  languageSelect.addEventListener('change', (e) => {
    const selectedLang = e.target.value;
    localStorage.setItem('language', selectedLang);
    console.log(`🌐 Idioma cambiado a: ${selectedLang === 'es' ? 'Español' : 'English'}`);
    // Aquí puedes implementar el cambio de idioma real
  });
}

const notificationsToggle = document.getElementById('notificationsToggle');
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
    
    // Solicitar permiso de notificaciones si está activado
    if (e.target.checked && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  });
}

// 6. Inicialización
loadThemeInSidebar();

console.log('✅ Menú y configuración inicializados correctamente');