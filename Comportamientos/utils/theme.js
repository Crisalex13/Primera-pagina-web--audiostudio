/* ============================================================
   theme.js - Gestión de Temas
   ============================================================
   TABLA DE CONTENIDO
   ============================================================
   1. Gestión de Temas
      1.1 loadTheme
      1.2 setTheme

   2. Notificaciones
      2.1 showThemeNotification

   3. Inicialización
      3.1 Cargar Tema al Iniciar
   ============================================================ */

// ── 1. Gestión de Temas ──
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  const isLightMode = savedTheme === 'light';
  
  if (isLightMode) {
    document.documentElement.classList.add('light-mode');
  } else {
    document.documentElement.classList.remove('light-mode');
  }
}

function setTheme(isLight) {
  if (isLight) {
    document.documentElement.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
    showThemeNotification('☀️ Modo Día activado');
  } else {
    document.documentElement.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
    showThemeNotification('🌙 Modo Noche activado');
  }
}

// ── 2. Notificaciones ──
function showThemeNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'theme-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    background: var(--bg2);
    color: var(--text);
    padding: 12px 24px;
    border-radius: 40px;
    font-weight: 600;
    z-index: 9999;
    opacity: 0;
    transform: translateX(50px);
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    box-shadow: var(--shadow);
    pointer-events: none;
    font-size: 0.9rem;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(50px)';
    setTimeout(() => notification.remove(), 400);
  }, 2000);
}

// ── 3. Inicialización ──
loadTheme();